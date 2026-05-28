import { workerConfig } from "../src/config";

export type AiMode = "fast" | "normal" | "comparative" | "evolutive" | "debate" | "deep" | "chaos" | "council_decision";
export type AiRole =
  | "fast"
  | "general"
  | "creative"
  | "alternative"
  | "critic"
  | "styleCritic"
  | "consolidator"
  | "code"
  | "safety"
  | "research"
  | "premium";

export type AiDomain =
  | "general"
  | "creative"
  | "code"
  | "system"
  | "research"
  | "safety"
  | "media"
  | "report";

export function modelFor(role: AiRole) {
  return workerConfig.ai.models[role];
}

export function inferDomain(type: string, payload: unknown): AiDomain {
  const text = `${type} ${JSON.stringify(payload ?? {})}`.toLowerCase();

  if (/(code|codigo|component|typescript|react|bug|refactor|unit test|teste automatizado|teste unitario)/.test(text)) return "code";
  if (/(log|health|seguranca|security|system|worker|audit|erro|falha)/.test(text)) return "system";
  if (/(research|pesquisa|fonte|noticia|comparar|mercado)/.test(text)) return "research";
  if (/(risk|risco|moderation|moderacao|policy|safe)/.test(text)) return "safety";
  if (/(image|imagem|video|audio|voz|asset|media|midia)/.test(text)) return "media";
  if (/(report|relatorio|metric|dashboard)/.test(text)) return "report";
  if (/(content|conteudo|roteiro|legenda|criativo|criar|ideia|copy|post|script|story)/.test(text)) return "creative";

  return "general";
}

export function inferMode(type: string, payload: unknown, domain: AiDomain): AiMode {
  const requestedMode = readString(payload, "ai_mode") ?? readString(payload, "mode");

  if (isAiMode(requestedMode)) {
    return requestedMode;
  }

  if (workerConfig.ai.defaultMode !== "auto" && isAiMode(workerConfig.ai.defaultMode)) {
    return workerConfig.ai.defaultMode;
  }

  if (!workerConfig.ai.multiModelEnabled) {
    return "normal";
  }

  const text = `${type} ${JSON.stringify(payload ?? {})}`.toLowerCase();

  if (/(chaos|caos|monstro|conselho intenso)/.test(text)) return "chaos";
  if (/(deep|profundo|alta qualidade|alto impacto|raciocinio avancado)/.test(text)) return "deep";
  if (/(decisao do sistema|council_decision|governanca|aprovacao|aprovar decisao)/.test(text)) return "council_decision";
  if (/(debate|decisao|arquitetura|estrategia)/.test(text)) return "debate";
  if (domain === "creative" || domain === "code" || domain === "media") return "evolutive";
  if (domain === "system" || domain === "research" || domain === "safety") return "comparative";
  if (/(review|revisao|approve|aprovar)/.test(text)) return "normal";

  return "normal";
}

export function executorRolesFor(domain: AiDomain, mode: AiMode): AiRole[] {
  if (mode === "fast") return ["fast"];
  if (mode === "chaos") return limitRoles(["creative", "general", "alternative", "critic", "research"]);
  if (mode === "deep") return limitRoles(["general", "creative", "critic", "alternative"]);
  if (mode === "council_decision") return limitRoles(["general", "critic", "safety"]);

  if (domain === "code") {
    return limitRoles(mode === "normal" ? ["code"] : ["code", "general"]);
  }

  if (domain === "creative" || domain === "media") {
    return limitRoles(mode === "normal" ? ["creative"] : ["creative", "general"]);
  }

  if (domain === "research") {
    return limitRoles(mode === "normal" ? ["research"] : ["research", "general"]);
  }

  if (domain === "safety" || domain === "system") {
    return limitRoles(mode === "normal" ? ["critic"] : ["critic", "general"]);
  }

  if (domain === "report") {
    return limitRoles(mode === "normal" ? ["general"] : ["general", "research"]);
  }

  return limitRoles(mode === "normal" ? ["general"] : ["general", "creative", "critic"]);
}

export function criticRolesFor(domain: AiDomain, mode: AiMode): AiRole[] {
  if (mode === "fast") return [];
  if (mode === "chaos") return limitRoles(["critic", "styleCritic", "safety", "alternative"]);
  if (mode === "deep") return limitRoles(["critic", "styleCritic", "safety"]);
  if (mode === "council_decision") return limitRoles(["safety", "critic"]);
  if (mode === "normal") return domain === "creative" || domain === "media" ? ["styleCritic"] : ["critic"];
  if (domain === "creative" || domain === "media") return ["critic"];
  if (domain === "code") return ["critic"];
  if (domain === "safety") return ["safety"];
  return ["critic"];
}

function readString(payload: unknown, key: string) {
  if (!payload || typeof payload !== "object" || !(key in payload)) return null;
  const value = (payload as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

function isAiMode(value: unknown): value is AiMode {
  return value === "fast"
    || value === "normal"
    || value === "comparative"
    || value === "evolutive"
    || value === "debate"
    || value === "deep"
    || value === "chaos"
    || value === "council_decision";
}

function limitRoles(roles: AiRole[]) {
  return roles.slice(0, workerConfig.ai.maxModelsPerTask);
}
