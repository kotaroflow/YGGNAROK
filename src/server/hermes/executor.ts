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
  fallbackUsed?: boolean;
  userSafeMessage?: string;
  internalError?: string;
  failureReason?: HermesFallbackDecision["failureReason"];
  fallback?: HermesFallbackDecision;
};

function buildOpenRouterMessages(req: HermesExecutionRequest): OpenRouterChatMessage[] {
  const messages = req.context.compressedContext.messages
    .filter((message) => message.role === "system" || message.role === "user" || message.role === "assistant")
    .map(({ role, content }) => ({ role, content }));

  if (req.context.currentUserMessage) {
    messages.push({ role: "user", content: req.context.currentUserMessage });
  }

  return messages.length > 0 ? messages : [{ role: "user", content: req.context.compressedContext.prompt }];
}

function buildHermesCliPrompt(req: HermesExecutionRequest) {
  return req.context.compressedContext.prompt || req.context.currentUserMessage;
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

  const args = ["chat", "-q", buildHermesCliPrompt(req)];

  if (req.contextFiles && req.contextFiles.length > 0) {
    args.push("--context", ...req.contextFiles);
  }

  if (req.systemOverride && req.userRole === "admin") {
    args.push("--system", req.systemOverride);
  }

  return executeHermesCli(args, { timeoutMs: 120000 });
}

async function executeFallback(req: HermesExecutionRequest, fallback: HermesFallbackDecision) {
  if (fallback.nextProvider === "openrouter" && fallback.nextModel) {
    const result = await executeOpenRouterChat(fallback.nextModel, buildOpenRouterMessages(req));

    return {
      ...result,
      provider: "openrouter" as const,
      model: fallback.nextModel,
    };
  }

  return null;
}

/**
 * Executa a decisão planejada pelo router/model-selector.
 * OpenRouter só é usado quando o model-selector decidir explicitamente esse provider.
 */
export async function executeHermesDecision(req: HermesExecutionRequest): Promise<HermesExecutionResult> {
  const result = await executePrimary(req);
  const fallbackDecision = result.success
    ? undefined
    : decideHermesFallback({
        result,
        context: req.context,
        modelDecision: req.modelDecision,
      });

  if (fallbackDecision?.shouldFallback) {
    const fallbackResult = await executeFallback(req, fallbackDecision);

    if (fallbackResult?.success) {
      return {
        ...fallbackResult,
        fallbackUsed: true,
        fallback: fallbackDecision,
      };
    }

    const fallbackError = fallbackResult?.error || "Fallback provider failed without diagnostic output.";

    return {
      success: false,
      output: fallbackResult?.output || "",
      error: fallbackDecision.userSafeMessage,
      provider: fallbackResult?.provider || req.modelDecision.provider,
      model: fallbackResult?.model || req.modelDecision.model,
      fallbackUsed: true,
      userSafeMessage: fallbackDecision.userSafeMessage,
      internalError: `${fallbackDecision.internalError || ""}\nFallback error: ${fallbackError}`.trim(),
      failureReason: fallbackDecision.failureReason,
      fallback: fallbackDecision,
    };
  }

  return {
    ...result,
    error: fallbackDecision?.userSafeMessage || result.error,
    userSafeMessage: fallbackDecision?.userSafeMessage,
    internalError: fallbackDecision?.internalError,
    failureReason: fallbackDecision?.failureReason,
    provider: req.modelDecision.provider,
    model: req.modelDecision.model,
    fallback: fallbackDecision,
  };
}
