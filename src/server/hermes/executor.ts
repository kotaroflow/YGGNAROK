import {
  executeHermesCli,
  executeOpenRouterChat,
  type HermesCommandResult,
  type OpenRouterChatMessage,
} from "./connectors";
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

function buildOpenRouterMessages(req: HermesExecutionRequest): OpenRouterChatMessage[] {
  const messages = req.context.messages
    .filter((message) => message.role === "system" || message.role === "user" || message.role === "assistant")
    .map(({ role, content }) => ({ role, content }));

  if (messages.length > 0) {
    return messages;
  }

  return [{ role: "user", content: req.context.currentUserMessage }];
}

async function executePrimary(req: HermesExecutionRequest) {
  if (req.modelDecision.provider === "openrouter") {
    return executeOpenRouterChat(req.modelDecision.model, buildOpenRouterMessages(req));
  }

  if (req.modelDecision.provider !== "hermes-cli") {
    return {
      success: false,
      output: "",
      error: `Provider ${req.modelDecision.provider} is not implemented in Hermes executor.`,
    };
  }

  const args = ["chat", "-q", req.context.currentUserMessage];

  if (req.contextFiles && req.contextFiles.length > 0) {
    args.push("--context", ...req.contextFiles);
  }

  if (req.systemOverride && req.userRole === "admin") {
    args.push("--system", req.systemOverride);
  }

  return executeHermesCli(args, { timeoutMs: 120000 });
}

/**
 * Executa a decisão planejada pelo router/model-selector.
 * OpenRouter só é usado quando o model-selector decidir explicitamente esse provider.
 */
export async function executeHermesDecision(req: HermesExecutionRequest): Promise<HermesExecutionResult> {
  const result = await executePrimary(req);
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
