import { executeHermesCli, type HermesCommandResult } from "./connectors";
import { decideHermesFallback, type HermesFallbackDecision } from "./fallback";
import type { IntentClassification } from "./intent";
import type { HermesContextPackage } from "./memory";
import type { HermesModelDecision } from "./model-selector";

export type HermesExecutionRequest = {
  context: HermesContextPackage;
  intent: IntentClassification;
  modelDecision: HermesModelDecision;
  userRole: "user" | "admin";
  userId: string;
  contextFiles?: string[];
  systemOverride?: string;
};

export type HermesExecutionResult = HermesCommandResult & {
  provider: HermesModelDecision["provider"];
  model: string;
  userSafeMessage?: string;
  internalError?: string;
  failureReason?: HermesFallbackDecision["failureReason"];
  fallback?: HermesFallbackDecision;
};

/**
 * Executa a decisão planejada pelo router/model-selector.
 * Nesta etapa, apenas Hermes CLI é suportado para preservar comportamento.
 */
export async function executeHermesDecision(req: HermesExecutionRequest): Promise<HermesExecutionResult> {
  const args = ["chat", "-q", req.context.currentUserMessage];

  if (req.contextFiles && req.contextFiles.length > 0) {
    args.push("--context", ...req.contextFiles);
  }

  if (req.systemOverride && req.userRole === "admin") {
    args.push("--system", req.systemOverride);
  }

  const result = await executeHermesCli(args, { timeoutMs: 120000 });
  const fallback = result.success
    ? undefined
    : decideHermesFallback({
        result,
        context: req.context,
        modelDecision: req.modelDecision,
      });

  return {
    ...result,
    error: fallback?.userSafeMessage || result.error,
    userSafeMessage: fallback?.userSafeMessage,
    internalError: fallback?.internalError,
    failureReason: fallback?.failureReason,
    provider: req.modelDecision.provider,
    model: req.modelDecision.model,
    fallback,
  };
}
