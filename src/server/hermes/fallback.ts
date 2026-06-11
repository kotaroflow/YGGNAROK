import type { HermesCommandResult } from "./connectors";
import type { HermesContextPackage } from "./memory";
import type { HermesModelDecision } from "./model-selector";

export type HermesFallbackDecision = {
  shouldFallback: boolean;
  reason: string;
  failureReason: "primary_executor_failed" | "fallback_not_configured" | "none";
  nextProvider?: HermesModelDecision["provider"];
  nextPlan?: string;
  nextModel?: string;
  userSafeMessage: string;
  internalError?: string;
};

export type HermesFallbackInput = {
  result: HermesCommandResult;
  context: HermesContextPackage;
  modelDecision: HermesModelDecision;
};

const DEFAULT_SAFE_MESSAGE =
  "Falha na comunicação com o Hermes Agent. Nenhum fallback automático está configurado para este ambiente.";
const FALLBACK_FAILED_SAFE_MESSAGE =
  "Falha na comunicação com o Hermes Agent. O fallback OpenRouter configurado não concluiu a solicitação.";

function configuredOpenRouterFallback() {
  const model = process.env.HERMES_OPENROUTER_FALLBACK_MODEL?.trim();
  const hasApiKey = Boolean(process.env.OPENROUTER_API_KEY?.trim());

  if (!model || !hasApiKey) {
    return null;
  }

  return model;
}

/**
 * Decide se existe uma rota alternativa após falha de execução.
 * Só habilita Hermes CLI -> OpenRouter quando configurado explicitamente.
 */
export function decideHermesFallback({ result, modelDecision }: HermesFallbackInput): HermesFallbackDecision {
  if (result.success) {
    return {
      shouldFallback: false,
      reason: "Execução principal concluída com sucesso.",
      failureReason: "none",
      userSafeMessage: "",
    };
  }

  const internalError = result.error || result.output || `${modelDecision.provider} failed without diagnostic output.`;

  if (modelDecision.provider === "hermes-cli") {
    const fallbackModel = configuredOpenRouterFallback();

    if (fallbackModel) {
      return {
        shouldFallback: true,
        reason: "Hermes CLI falhou; fallback OpenRouter configurado explicitamente.",
        failureReason: "primary_executor_failed",
        nextProvider: "openrouter",
        nextPlan: `openrouter:${fallbackModel}`,
        nextModel: fallbackModel,
        userSafeMessage: FALLBACK_FAILED_SAFE_MESSAGE,
        internalError,
      };
    }
  }

  return {
    shouldFallback: false,
    reason: `Executor principal ${modelDecision.provider} falhou e não há fallback configurado.`,
    failureReason: "fallback_not_configured",
    userSafeMessage: DEFAULT_SAFE_MESSAGE,
    internalError,
  };
}
