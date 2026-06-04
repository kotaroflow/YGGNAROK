import type { Json } from "../../src/types/database";
import {
  hierarchySystemPrompt,
  orchestrationMetadata,
  YGGNAROK_CONTINUOUS_EVOLUTION_LOOP,
  YGGNAROK_PERSISTENT_MEMORY_POLICY,
  yggnarokAgentHierarchy,
} from "../../src/lib/ai-hierarchy";
import { workerConfig } from "../src/config";
import { runAiCompletion } from "./provider";
import {
  type AiDomain,
  type AiMode,
  type AiRole,
  criticRolesFor,
  executorRolesFor,
  inferDomain,
  inferMode,
  modelFor,
} from "./models";

type AgentDefinition = {
  module: string;
  purpose: string;
  system: string;
};

type OrchestrationInput = {
  type: string;
  payload: unknown;
  agentKey: string;
  agent: AgentDefinition;
  learningContext?: Json[];
};

type Candidate = {
  role: AiRole;
  model: string;
  output: Record<string, unknown>;
};

type Critique = {
  role: AiRole;
  model: string;
  output: Record<string, unknown>;
};

const councilAgents = yggnarokAgentHierarchy;

export async function runOrchestratedAgent(input: OrchestrationInput) {
  const domain = inferDomain(input.type, input.payload);
  const mode = inferMode(input.type, input.payload, domain);
  const executorRoles = workerConfig.ai.freeFallbackOnly ? ["fast" as const] : executorRolesFor(domain, mode);

  const candidates = await runCandidates(input, executorRoles, domain, mode);
  const critiques = await runCritiques(
    input,
    candidates,
    workerConfig.ai.freeFallbackOnly || !workerConfig.ai.multiAgentDebateEnabled ? [] : criticRolesFor(domain, mode),
    domain,
    mode,
  );
  const final = workerConfig.ai.supervisorSynthesisEnabled
    ? await consolidate(input, candidates, critiques, domain, mode)
    : candidates[0]?.output ?? { summary: "Sem sintese do supervisor.", items: [], next_actions: [], risk: "medium", metadata: {} };
  const learning = await extractLearning(input, final, candidates, critiques, domain, mode);
  const risk = classifyRisk(final, critiques, mode);
  const requiresAdminApproval = risk === "high" && workerConfig.ai.requireAdminApprovalForHighRisk;

  return {
    ...final,
    risk,
    metadata: {
      ...(asRecord(final.metadata) ?? {}),
      ai_orchestration: orchestrationMetadata({
        provider: workerConfig.ai.provider,
        mode,
        domain,
        rounds: debateRoundsFor(mode),
        status: requiresAdminApproval ? "pending_momonga_approval" : "completed",
        decision_authority: decisionAuthorityFor(risk),
        cost_guard: workerConfig.ai.freeFallbackOnly ? "free_fallback_only" : "standard",
        limits: {
          max_models_per_task: workerConfig.ai.maxModelsPerTask,
          max_debate_rounds: workerConfig.ai.maxDebateRounds,
          max_agent_loop_depth: workerConfig.ai.maxAgentLoopDepth,
          max_agent_retry: workerConfig.ai.maxAgentRetry,
          max_task_external_cost: workerConfig.ai.maxTaskExternalCost,
          max_daily_external_cost: workerConfig.ai.maxDailyExternalCost,
        },
        council_agents: councilAgents.map((agent) => ({
          key: agent.key,
          name: agent.name,
          duty: agent.duty,
          layer: agent.layer,
          gate: agent.gate ?? "auto",
          active: agent.gate !== "admin" || requiresAdminApproval,
        })),
        executor_roles: candidates.map((candidate) => candidate.role),
        critic_roles: critiques.map((critique) => critique.role),
        models: {
          executors: candidates.map(({ role, model }) => ({ role, model })),
          critics: critiques.map(({ role, model }) => ({ role, model })),
          consolidator: modelFor("consolidator"),
        },
        candidates: candidates.map(({ role, model, output }) => ({
          role,
          model,
          summary: String(output.summary ?? output.text ?? "").slice(0, 700),
        })),
        critiques: critiques.map(({ role, model, output }) => ({
          role,
          model,
          summary: String(output.summary ?? output.text ?? "").slice(0, 700),
        })),
        learning,
        memory_candidates: memoryCandidatesFromLearning(learning),
        guardrails: {
          high_risk_requires_admin: workerConfig.ai.requireAdminApprovalForHighRisk,
          high_risk_memory_requires_admin: workerConfig.ai.requireAdminApprovalForHighRiskMemory,
          kill_switch_enabled: workerConfig.ai.killSwitchEnabled,
        },
      }),
    },
  };
}

async function runCandidates(input: OrchestrationInput, roles: AiRole[], domain: AiDomain, mode: AiMode) {
  const candidateRuns = await Promise.allSettled(
    roles.map(async (role) => {
      const model = modelFor(role);
      const output = await runAiCompletion(buildExecutorMessages(input, role, domain, mode), {
        model,
        label: `executor:${role}`,
        temperature: role === "creative" || role === "alternative" ? 0.75 : 0.45,
        allowExternal: mode === "deep" || mode === "chaos" || mode === "council_decision",
      });

      return { role, model, output };
    }),
  );

  const candidates = candidateRuns
    .filter((run): run is PromiseFulfilledResult<Candidate> => run.status === "fulfilled")
    .map((run) => run.value);

  if (!candidates.length) {
    const errors = candidateRuns
      .filter((run): run is PromiseRejectedResult => run.status === "rejected")
      .map((run) => run.reason instanceof Error ? run.reason.message : String(run.reason));
    throw new Error(`Nenhum modelo executor respondeu. ${errors.join(" | ")}`);
  }

  return candidates;
}

async function runCritiques(
  input: OrchestrationInput,
  candidates: Candidate[],
  roles: AiRole[],
  domain: AiDomain,
  mode: AiMode,
) {
  if (!roles.length) return [];

  const critiqueRuns = await Promise.allSettled(
    roles.map(async (role) => {
      const model = modelFor(role);
      const output = await runAiCompletion(buildCritiqueMessages(input, candidates, role, domain, mode), {
        model,
        label: `critic:${role}`,
        temperature: 0.25,
        allowExternal: mode === "deep" || mode === "chaos" || mode === "council_decision",
      });

      return { role, model, output };
    }),
  );

  return critiqueRuns
    .filter((run): run is PromiseFulfilledResult<Critique> => run.status === "fulfilled")
    .map((run) => run.value);
}

async function consolidate(
  input: OrchestrationInput,
  candidates: Candidate[],
  critiques: Critique[],
  domain: AiDomain,
  mode: AiMode,
) {
  if ((mode === "fast" || workerConfig.ai.freeFallbackOnly) && candidates[0] && !critiques.length) {
    return candidates[0].output;
  }

  return runAiCompletion(buildConsolidationMessages(input, candidates, critiques, domain, mode), {
    model: modelFor(mode === "deep" || mode === "chaos" ? "premium" : "consolidator"),
    label: "supervisor",
    temperature: 0.35,
    allowExternal: mode === "deep" || mode === "chaos" || mode === "council_decision",
  });
}

async function extractLearning(
  input: OrchestrationInput,
  final: Record<string, unknown>,
  candidates: Candidate[],
  critiques: Critique[],
  domain: AiDomain,
  mode: AiMode,
) {
  if (!workerConfig.ai.memoryEnabled || !workerConfig.ai.autoLearningEnabled) {
    return null;
  }

  if (mode !== "evolutive" && mode !== "debate" && mode !== "deep" && mode !== "chaos" && mode !== "council_decision") {
    return null;
  }

  return runAiCompletion(buildLearningMessages(input, final, candidates, critiques, domain, mode), {
    model: modelFor("fast"),
    label: "learning",
    temperature: 0.2,
  }).catch((error) => ({
    status: "not_saved",
    reason: error instanceof Error ? error.message : String(error),
  }));
}

function buildExecutorMessages(input: OrchestrationInput, role: AiRole, domain: AiDomain, mode: AiMode) {
  return [
    {
      role: "system" as const,
      content: [
        hierarchySystemPrompt(),
        input.agent.system,
        "Voce participa da cadeia de execucao do YGGNAROK. Gere uma proposta completa para seu papel e deixe dados uteis para aprendizado futuro.",
        `Papel do modelo: ${role}. Dominio: ${domain}. Modo: ${mode}.`,
        "Classifique risco como low, medium ou high. High risk exige Momonga/Admin.",
        "Responda apenas JSON com: summary, items, next_actions, risk, metadata.",
      ].join(" "),
    },
    {
      role: "user" as const,
      content: JSON.stringify(baseUserPayload(input)),
    },
  ];
}

function buildCritiqueMessages(
  input: OrchestrationInput,
  candidates: Candidate[],
  role: AiRole,
  domain: AiDomain,
  mode: AiMode,
) {
  return [
    {
      role: "system" as const,
      content: [
        hierarchySystemPrompt(),
        "Voce e um juiz/critico da hierarquia multiagente do YGGNAROK.",
        "Compare propostas, encontre falhas, riscos, contradicoes, oportunidades e escolha os melhores pontos.",
        "Comente pontos fortes, pontos fracos, melhoria sugerida e justificativa.",
        `Papel critico: ${role}. Dominio: ${domain}. Modo: ${mode}.`,
        "Responda apenas JSON com: summary, items, next_actions, risk, metadata.",
      ].join(" "),
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        ...baseUserPayload(input),
        candidates,
      }),
    },
  ];
}

function buildConsolidationMessages(
  input: OrchestrationInput,
  candidates: Candidate[],
  critiques: Critique[],
  domain: AiDomain,
  mode: AiMode,
) {
  return [
    {
      role: "system" as const,
      content: [
        hierarchySystemPrompt(),
        input.agent.system,
        "Voce e o supervisor de consolidacao da hierarquia multiagente do YGGNAROK. Use o melhor dos candidatos e das criticas.",
        "Nao copie cegamente: resolva conflitos, preserve qualidade e entregue uma saida pronta para uso.",
        "Para decisoes internas, aplique LOW_RISK automatico, MEDIUM_RISK supervisor e HIGH_RISK pendente de Momonga/Admin.",
        `Dominio: ${domain}. Modo: ${mode}.`,
        "Responda apenas JSON com: summary, items, next_actions, risk, metadata.",
      ].join(" "),
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        ...baseUserPayload(input),
        candidates,
        critiques,
      }),
    },
  ];
}

function buildLearningMessages(
  input: OrchestrationInput,
  final: Record<string, unknown>,
  candidates: Candidate[],
  critiques: Critique[],
  domain: AiDomain,
  mode: AiMode,
) {
  return [
    {
      role: "system" as const,
      content: [
        "Voce e o Memory Agent. Extraia aprendizado operacional para futuras execucoes do YGGNAROK.",
        "Salve apenas preferencias, decisoes aprovadas, padroes, estrategias, rotas de agente eficazes, falhas repetiveis e alertas novos que ajudem proximas tarefas.",
        `Politica de memoria persistente: ${JSON.stringify(YGGNAROK_PERSISTENT_MEMORY_POLICY)}.`,
        `Loop de evolucao constante: ${JSON.stringify(YGGNAROK_CONTINUOUS_EVOLUTION_LOOP)}.`,
        "Classifique memoria como low, medium ou high risk. High risk fica pendente de Momonga/Admin.",
        "Nao grave segredos, tokens, senhas, dados sensiveis sem necessidade, hipotese nao aprovada ou acao rejeitada pelo admin.",
        "Nao use dados antigos congelados como base. Nao invente fatos externos.",
        "Responda apenas JSON com: summary, keep, avoid, routing_hint, prompt_hint, evolution_hint, risk, confidence, status.",
      ].join(" "),
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        job_type: input.type,
        agent_key: input.agentKey,
        domain,
        mode,
        payload: toJson(input.payload),
        final,
        candidates: candidates.map(({ role, model, output }) => ({ role, model, output })),
        critiques: critiques.map(({ role, model, output }) => ({ role, model, output })),
      }),
    },
  ];
}

function baseUserPayload(input: OrchestrationInput) {
  return {
    job_type: input.type,
    agent_key: input.agentKey,
    module: input.agent.module,
    purpose: input.agent.purpose,
    payload: toJson(input.payload),
    recent_learning: input.learningContext ?? [],
    council_agents: councilAgents,
  };
}

function classifyRisk(final: Record<string, unknown>, critiques: Critique[], mode: AiMode) {
  const values = [
    String(final.risk ?? ""),
    ...critiques.map((critique) => String(critique.output.risk ?? "")),
  ].map((value) => value.toLowerCase());

  if (values.some((value) => value.includes("high"))) return "high";
  if (mode === "council_decision" || values.some((value) => value.includes("medium"))) return "medium";
  return "low";
}

function decisionAuthorityFor(risk: string) {
  if (risk === "high") return "momonga_admin_required";
  if (risk === "medium") return "supervisor_agent";
  return "council_auto";
}

function debateRoundsFor(mode: AiMode) {
  if (mode === "chaos") return workerConfig.ai.maxDebateRounds;
  if (mode === "deep" || mode === "debate" || mode === "council_decision") return Math.min(workerConfig.ai.maxDebateRounds, 2);
  return 1;
}

function memoryCandidatesFromLearning(learning: unknown) {
  const record = asRecord(learning);
  if (!record) return [];

  return [{
    content: record.summary ?? "",
    origin: "ai_council",
    agent: "memory",
    risk: record.risk ?? "low",
    confidence: record.confidence ?? null,
    status: record.status ?? (record.risk === "high" ? "pending" : "approved"),
    justification: "Extraido pelo Memory Agent a partir de geracao, debate e sintese.",
  }];
}

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value ?? null)) as Json;
}
