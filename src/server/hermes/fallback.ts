import type { HermesCommandResult } from "./connectors";
import type { HermesContextPackage } from "./memory";
import type { HermesModelDecision } from "./model-selector";

export type HermesFallbackDecision = {
  shouldFallback: boolean;
  reason: string;
  failureReason: "primary_executor_failed" | "fallback_not_configured" | "none";
  nextProvider?: HermesModelDecision["provider"];
  nextPlan?: string;
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

/**
 * Decide se existe uma rota alternativa após falha de execução.
 * Nesta etapa, não aciona provedores externos; apenas produz erro seguro.
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

  return {
    shouldFallback: false,
    reason: `Executor principal ${modelDecision.provider} falhou e não há fallback configurado.`,
    failureReason: "fallback_not_configured",
    userSafeMessage: DEFAULT_SAFE_MESSAGE,
    internalError: result.error || result.output || "Hermes CLI failed without diagnostic output.",
  };
}
