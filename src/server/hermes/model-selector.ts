import type { IntentClassification } from "./intent";
import type { HermesContextPackage } from "./memory";

export type HermesExecutionProvider = "hermes-cli" | "openrouter" | "ollama" | "worker";

export type HermesModelDecision = {
  provider: HermesExecutionProvider;
  model: string;
  reason: string;
  allowLocal: boolean;
  riskLevel: IntentClassification["riskLevel"];
  confidence: "low" | "medium" | "high";
};

const DEFAULT_HERMES_MODEL = "hermes/yggnarok-bunker";

function normalizeRequestedModel(value: string) {
  return value.startsWith("openrouter:") ? value.slice("openrouter:".length) : value;
}

function isOpenRouterModel(value: string) {
  return value.includes("/") && !value.startsWith("hermes/");
}

function isTechnicalContext(context: HermesContextPackage, intent: IntentClassification) {
  if (intent.category === "architecture_analysis" || intent.category === "local_execution") {
    return true;
  }

  const text = `${context.currentUserMessage}\n${context.summary ?? ""}`.toLowerCase();

  return [
    "arquitetura",
    "architecture",
    "código",
    "codigo",
    "code",
    "typecheck",
    "build",
    "diff",
    "commit",
    "fallback",
    "router",
    "executor",
    "gateway",
    "memory",
    "model selector",
  ].some((signal) => text.includes(signal));
}

function isLightContext(context: HermesContextPackage, intent: IntentClassification) {
  if (intent.category !== "chat" || intent.riskLevel !== "low") {
    return false;
  }

  const text = context.currentUserMessage.trim().toLowerCase();

  return text.length <= 80 && /^(oi|ol[aá]|bom dia|boa tarde|boa noite|ok|obrigad|valeu|sim|não|nao)\b/.test(text);
}

function buildSelectionReason(input: {
  requestedModel?: string;
  wantsOpenRouter?: boolean;
  usesImplicitOpenRouter?: boolean;
  technicalContext: boolean;
  lightContext: boolean;
}) {
  if (input.wantsOpenRouter) {
    return "Modelo OpenRouter solicitado explicitamente pelo frontend.";
  }

  if (input.usesImplicitOpenRouter) {
    return "Modelo do frontend reconhecido como catalogo OpenRouter e preservado como provider remoto.";
  }

  if (input.requestedModel) {
    return input.technicalContext
      ? "Modelo solicitado pelo frontend preservado; Hermes marcou contexto técnico/arquitetural para telemetria."
      : "Modelo solicitado pelo frontend preservado como decisão inicial.";
  }

  if (input.technicalContext) {
    return "Modelo padrão Hermes usado para contexto técnico/arquitetural sem modelo explícito.";
  }

  if (input.lightContext) {
    return "Modelo padrão Hermes mantido para tarefa leve sem modelo explícito.";
  }

  return "Modelo padrão Hermes usado porque o frontend não enviou modelo.";
}

/**
 * Contrato mínimo de seleção de modelo.
 * Regras leves vivem no Hermes, preservando modelo/provider explícitos do frontend.
 */
export function selectHermesModel(
  context: HermesContextPackage,
  intent: IntentClassification,
): HermesModelDecision {
  const requestedModel = context.metadata.requestedModel?.trim();
  const wantsOpenRouter = requestedModel?.startsWith("openrouter:");
  const usesImplicitOpenRouter = requestedModel ? isOpenRouterModel(requestedModel) : false;
  const technicalContext = isTechnicalContext(context, intent);
  const lightContext = isLightContext(context, intent);

  return {
    provider: wantsOpenRouter || usesImplicitOpenRouter ? "openrouter" : "hermes-cli",
    model: requestedModel ? normalizeRequestedModel(requestedModel) : DEFAULT_HERMES_MODEL,
    reason: buildSelectionReason({
      requestedModel,
      wantsOpenRouter,
      usesImplicitOpenRouter,
      technicalContext,
      lightContext,
    }),
    allowLocal: context.metadata.allowLocalOllama,
    riskLevel: intent.riskLevel,
    confidence: wantsOpenRouter || usesImplicitOpenRouter ? "high" : requestedModel || technicalContext ? "medium" : "low",
  };
}
