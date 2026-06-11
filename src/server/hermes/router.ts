import { executeHermesDecision } from "./executor";
import { classifyIntent } from "./intent";
import { recordBridgeLog } from "./local-store";
import type { HermesContextPackage } from "./memory";
import { selectHermesModel } from "./model-selector";
import { checkHermesPermission } from "./permissions";

export type HermesRouteRequest = {
  context: HermesContextPackage;
  userRole: "user" | "admin";
  userId: string;
  contextFiles?: string[];
  systemOverride?: string;
};

export type HermesRouteResponse = {
  response: string;
  intent: string;
  wasBlocked: boolean;
  blockReason?: string;
};

/**
 * Decide a rota inicial do chat Hermes e delega para o executor físico atual.
 * Nesta etapa, preserva o comportamento existente: Hermes CLI é a única rota executora.
 */
export async function routeHermesChat(req: HermesRouteRequest): Promise<HermesRouteResponse> {
  const { context, userRole, userId, contextFiles } = req;
  const message = context.currentUserMessage;

  const intent = classifyIntent(message);
  const modelDecision = selectHermesModel(context, intent);
  const permission = checkHermesPermission(intent, userRole);

  if (!permission.allowed) {
    await recordBridgeLog(userId, "chat_blocked", { message, intent, reason: permission.reason });
    return {
      response: "Ação bloqueada pelas políticas do YGGNAROK.",
      intent: intent.category,
      wasBlocked: true,
      blockReason: permission.reason,
    };
  }

  const result = await executeHermesDecision({
    context,
    intent,
    modelDecision,
    userRole,
    userId,
    contextFiles,
    systemOverride: req.systemOverride,
  });

  await recordBridgeLog(userId, "chat_success", {
    messagePreview: message.substring(0, 50),
    provider: result.provider,
    model: result.model,
    success: result.success,
    error: result.error,
    internalError: result.internalError,
    failureReason: result.failureReason,
  });

  if (!result.success) {
    return {
      response: result.userSafeMessage ?? "Falha na comunicação com o Hermes Agent.",
      intent: intent.category,
      wasBlocked: false,
    };
  }

  return {
    response: result.output,
    intent: intent.category,
    wasBlocked: false,
  };
}
