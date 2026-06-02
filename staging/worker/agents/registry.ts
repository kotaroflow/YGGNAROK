import type { Json } from "../../src/types/database";
import { runOrchestratedAgent } from "./orchestrator";

export const agentKeys = ["hefesto", "gaia", "morax", "yomi", "hotei", "heimdall", "maat", "isis"] as const;

export type AgentKey = (typeof agentKeys)[number];

type AgentDefinition = {
  module: string;
  purpose: string;
  system: string;
};

const agents: Record<AgentKey, AgentDefinition> = {
  hefesto: {
    module: "content",
    purpose: "Transformar briefing em conteudo pronto para revisao.",
    system: "Voce e Hefesto, agente de criacao do YGGNAROK V1. Gere ideias, roteiros, legendas, hashtags e checklist de revisao. Nao publique automaticamente. Responda apenas JSON.",
  },
  gaia: {
    module: "profiles",
    purpose: "Organizar perfil, tags operacionais e posicionamento de conteudo.",
    system: "Voce e Gaia, agente de organizacao de perfis do YGGNAROK V1. Sugira tags operacionais, riscos, objetivos e proximas acoes. Tags nao sao permissoes. Responda apenas JSON.",
  },
  morax: {
    module: "sales",
    purpose: "Estruturar campanhas, ofertas, links, afiliados e oportunidades.",
    system: "Voce e Morax, agente comercial do YGGNAROK V1. Analise oferta, publico, canais, riscos e proximas acoes comerciais. Responda apenas JSON.",
  },
  yomi: {
    module: "posting",
    purpose: "Preparar postagem manual assistida.",
    system: "Voce e Yomi, agente de postagem manual do YGGNAROK V1. Gere checklist, legenda para copiar, hashtags e pendencias. Nao prometa autopost. Responda apenas JSON.",
  },
  hotei: {
    module: "library",
    purpose: "Organizar biblioteca, prompts, referencias e materiais reaproveitaveis.",
    system: "Voce e Hotei, agente de biblioteca do YGGNAROK V1. Classifique materiais, extraia resumo, uso recomendado, tags e riscos. Responda apenas JSON.",
  },
  heimdall: {
    module: "system",
    purpose: "Analisar jobs, logs, saude e seguranca operacional.",
    system: "Voce e Heimdall, agente tecnico do YGGNAROK V1. Analise falhas, saude, seguranca, jobs e auditoria sem expor segredos. Responda apenas JSON.",
  },
  maat: {
    module: "reports",
    purpose: "Gerar relatorios basicos, metricas, resumo e recomendacoes.",
    system: "Voce e Maat, agente de relatorios do YGGNAROK V1. Gere resumo, metricas interpretadas, riscos e recomendacoes praticas. Responda apenas JSON.",
  },
  isis: {
    module: "content",
    purpose: "Revisar conteudo, clareza, consistencia e aprovacao.",
    system: "Voce e Isis, agente de revisao do YGGNAROK V1. Avalie clareza, coerencia, risco, pendencias e criterio de aprovacao. Responda apenas JSON.",
  },
};

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
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return agent;
  }

  const record = payload as Record<string, unknown>;
  const agentName = typeof record.agent_name === "string" && record.agent_name.trim() ? record.agent_name.trim() : "";
  const instructions = typeof record.agent_instructions === "string" && record.agent_instructions.trim() ? record.agent_instructions.trim() : "";
  const outputFormat = typeof record.output_format === "string" && record.output_format.trim() ? record.output_format.trim() : "";

  if (!agentName && !instructions && !outputFormat) {
    return agent;
  }

  return {
    ...agent,
    purpose: agentName ? `${agent.purpose} Molde atual: ${agentName}.` : agent.purpose,
    system: [
      agent.system,
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

  if (value.includes("posting") || value.includes("postagem")) return "yomi";
  if (value.includes("report") || value.includes("relatorio")) return "maat";
  if (value.includes("sales") || value.includes("venda") || value.includes("campaign")) return "morax";
  if (value.includes("library") || value.includes("biblioteca") || value.includes("prompt")) return "hotei";
  if (value.includes("profile") || value.includes("perfil") || value.includes("tag")) return "gaia";
  if (value.includes("review") || value.includes("revisao") || value.includes("approve")) return "isis";
  if (value.includes("content") || value.includes("conteudo") || value.includes("script") || value.includes("caption")) return "hefesto";

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
