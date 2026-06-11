import { executeHermesCli } from "./connectors";
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

  const args = ["chat", "-q", message];

  if (contextFiles && contextFiles.length > 0) {
    args.push("--context", ...contextFiles);
  }

  if (req.systemOverride && userRole === "admin") {
    args.push("--system", req.systemOverride);
  }

  const result = await executeHermesCli(args, { timeoutMs: 120000 });

  await recordBridgeLog(userId, "chat_success", {
    messagePreview: message.substring(0, 50),
    provider: modelDecision.provider,
    model: modelDecision.model,
    success: result.success,
    error: result.error,
  });

  if (!result.success) {
    return {
      response: `Falha na comunicação com o Hermes Agent: ${result.error}`,
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
