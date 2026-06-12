import { prepareHermesContext } from "./memory";
import { isHermesAdmin, type HermesUser } from "./permissions";
import { routeHermesChat } from "./router";

export type HermesGatewayResult =
  | {
      ok: true;
      text: string;
      conversationId?: string;
    }
  | {
      ok: false;
      error: string;
      status: number;
    };

export type HermesGatewayRequest = {
  body: Record<string, unknown>;
  user: HermesUser;
};

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function runHermesGateway({ body, user }: HermesGatewayRequest): Promise<HermesGatewayResult> {
  const role = isHermesAdmin(user) ? "admin" : "user";
  const userId = user.id || user.email || "anonymous";
  const context = await prepareHermesContext({ body, userId });

  if (!context.currentUserMessage) {
    return { ok: false, error: "Mensagem vazia.", status: 400 };
  }

  try {
    const result = await routeHermesChat({
      context,
      userRole: role,
      userId,
    });

    if (result.wasBlocked) {
      return { ok: false, error: result.response, status: 403 };
    }

    return context.conversationId
      ? { ok: true, text: result.response, conversationId: context.conversationId }
      : { ok: true, text: result.response };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro no Hermes";
    return { ok: false, error: message || "Erro no Hermes", status: 500 };
  }
}

export async function handleHermesChatRequest(request: HermesGatewayRequest): Promise<Response> {
  const result = await runHermesGateway(request);

  if (!result.ok) {
    return jsonError(result.error, result.status);
  }

  const headers = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store, no-transform",
    "hermes-live": "true",
    "X-YGGNAROK-Route": "hermes-gateway",
  });
  const conversationId = result.conversationId ?? "local";
  headers.set("x-conversation-id", conversationId);
  headers.set("X-YGGNAROK-Conversation", conversationId);

  return new Response(result.text, { status: 200, headers });
}
