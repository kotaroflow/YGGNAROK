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

/**
 * Contrato mínimo de seleção de modelo.
 * Nesta etapa, preserva o comportamento existente: todo chat segue para Hermes CLI.
 */
export function selectHermesModel(
  context: HermesContextPackage,
  intent: IntentClassification,
): HermesModelDecision {
  const requestedModel = context.metadata.requestedModel?.trim();
  const wantsOpenRouter = requestedModel?.startsWith("openrouter:");

  return {
    provider: wantsOpenRouter ? "openrouter" : "hermes-cli",
    model: requestedModel ? normalizeRequestedModel(requestedModel) : DEFAULT_HERMES_MODEL,
    reason: wantsOpenRouter
      ? "Modelo OpenRouter solicitado explicitamente pelo frontend."
      : requestedModel
      ? "Modelo solicitado pelo frontend preservado como decisão inicial."
      : "Modelo padrão Hermes usado porque o frontend não enviou modelo.",
    allowLocal: context.metadata.allowLocalOllama,
    riskLevel: intent.riskLevel,
    confidence: requestedModel ? "medium" : "low",
  };
}
