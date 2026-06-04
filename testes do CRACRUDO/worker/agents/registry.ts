import type { Json } from "../../src/types/database";
import { hierarchySystemPrompt } from "../../src/lib/ai-hierarchy";
import { yggnarokPrimaryAiAgents } from "../../src/lib/ai-entity-catalog";
import { runOrchestratedAgent } from "./orchestrator";

export const agentKeys = yggnarokPrimaryAiAgents.map((agent) => agent.key);

export type AgentKey = (typeof yggnarokPrimaryAiAgents)[number]["key"];

type AgentDefinition = {
  module: string;
  purpose: string;
  system: string;
};

const agents = Object.fromEntries(
  yggnarokPrimaryAiAgents.map((agent) => [
    agent.key,
    {
      module: moduleForArea(agent.area ?? ""),
      purpose: `${agent.name}: ${agent.area}.`,
      system: [
        `Voce e ${agent.name}, IA ${agent.area} do YGGNAROK / YGN V1.`,
        "Atue exatamente dentro da sua funcao nomeada no catalogo mestre.",
        "Nao acumule funcoes genericas: quando a tarefa passar do seu escopo, sinalize roteamento para Heimdall/Janus.",
        "Voce pode sugerir acoes, mas publicacao, exclusao, gastos, permissoes, auth, alteracao estrutural de banco e automacoes persistentes exigem aprovacao do Administrador Master.",
        "Responda apenas JSON com summary, items, next_actions, risk, needs_admin_approval e metadata.",
      ].join(" "),
    },
  ]),
) as Record<AgentKey, AgentDefinition>;

export async function runAgentJob(input: {
  type: string;
  payload: unknown;
  agentKey?: AgentKey;
  learningContext?: Json[];
}) {
  const agentKey = input.agentKey ?? pickAgent(input.type, input.payload);
  const agent = applyPayloadAgentShape(agents[agentKey], input.payload);
  const output = await runOrchestratedAgent({
    type: input.type,
    payload: input.payload,
    agentKey,
    agent,
    learningContext: input.learningContext,
  });

  return {
    agent_key: agentKey,
    module: agent.module,
    output: toJson({
      agent_key: agentKey,
      module: agent.module,
      job_type: input.type,
      ...output,
    }),
  };
}

function applyPayloadAgentShape(agent: AgentDefinition, payload: unknown): AgentDefinition {
  const baseAgent = {
    ...agent,
    system: `${hierarchySystemPrompt()} ${agent.system}`,
  };

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return baseAgent;
  }

  const record = payload as Record<string, unknown>;
  const agentName = typeof record.agent_name === "string" && record.agent_name.trim() ? record.agent_name.trim() : "";
  const instructions = typeof record.agent_instructions === "string" && record.agent_instructions.trim() ? record.agent_instructions.trim() : "";
  const outputFormat = typeof record.output_format === "string" && record.output_format.trim() ? record.output_format.trim() : "";

  if (!agentName && !instructions && !outputFormat) {
    return baseAgent;
  }

  return {
    ...baseAgent,
    purpose: agentName ? `${baseAgent.purpose} Molde atual: ${agentName}.` : baseAgent.purpose,
    system: [
      baseAgent.system,
      agentName ? `Nesta execucao, aja como: ${agentName}.` : "",
      instructions ? `Instrucoes moldadas pelo usuario: ${instructions}` : "",
      outputFormat ? `Formato exigido para a entrega: ${outputFormat}` : "",
    ].filter(Boolean).join(" "),
  };
}

function pickAgent(type: string, payload: unknown): AgentKey {
  const requested = readRequestedAgent(payload);

  if (requested) {
    return requested;
  }

  const value = type.toLowerCase();

  if (value.includes("flow") || value.includes("fluxo") || value.includes("status")) return "janus";
  if (value.includes("triage") || value.includes("triagem") || value.includes("curadoria")) return "isis";
  if (value.includes("posting") || value.includes("postagem")) return "sarutahiko";
  if (value.includes("report") || value.includes("relatorio") || value.includes("insight")) return "omoikane";
  if (value.includes("sales") || value.includes("venda") || value.includes("monetizacao")) return "gaia";
  if (value.includes("campaign") || value.includes("campanha")) return "daikokuten";
  if (value.includes("library") || value.includes("biblioteca")) return "wenchang";
  if (value.includes("prompt") || value.includes("ideia")) return "hefesto";
  if (value.includes("profile") || value.includes("perfil") || value.includes("onboarding")) return "nuwa";
  if (value.includes("review") || value.includes("revisao") || value.includes("approve")) return "anubis";
  if (value.includes("content") || value.includes("conteudo") || value.includes("script") || value.includes("caption")) return "amaterasu";
  if (value.includes("copyright") || value.includes("direito")) return "yomi";
  if (value.includes("security") || value.includes("seguranca")) return "susanoo";
  if (value.includes("logs") || value.includes("permission") || value.includes("permiss")) return "metatron";
  if (value.includes("test") || value.includes("teste")) return "pandora";

  return "heimdall";
}

function readRequestedAgent(payload: unknown): AgentKey | null {
  if (!payload || typeof payload !== "object" || !("agent_key" in payload)) {
    return null;
  }

  const value = String((payload as { agent_key?: unknown }).agent_key);
  return agentKeys.includes(value as AgentKey) ? (value as AgentKey) : null;
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value ?? null)) as Json;
}

function moduleForArea(area: string) {
  const value = area.toLowerCase();
  if (/(conteudo|prompt|ideias|estetica|voz)/.test(value)) return "content";
  if (/(monetizacao|copy|oferta|parcerias|campanhas|nicho|recompensas)/.test(value)) return "growth";
  if (/(memoria|biblioteca|relatorios|logs|permissoes|xp|rank|karma)/.test(value)) return "intelligence";
  if (/(direitos|lgpd|seguranca|problematico|risco|auditoria)/.test(value)) return "governance";
  if (/(saude|recuperacao|testes|fluxos|roteamento)/.test(value)) return "operations";
  if (/(onboarding|tutorial|assistente|interface|postagem|notificacoes)/.test(value)) return "user_ops";
  return "general";
}
