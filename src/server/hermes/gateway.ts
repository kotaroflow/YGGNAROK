import { sendChatMessage } from "./chat";
import { isHermesAdmin } from "./permissions";

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
  user: any;
};

function extractMessage(bodyObject: Record<string, unknown>) {
  if (typeof bodyObject.message === "string") {
    return bodyObject.message.trim();
  }

  if (!Array.isArray(bodyObject.messages)) {
    return "";
  }

  for (let index = bodyObject.messages.length - 1; index >= 0; index -= 1) {
    const item = bodyObject.messages[index];
    if (!item || typeof item !== "object") continue;
    const message = item as Record<string, unknown>;
    if (message.role === "user" && typeof message.content === "string") {
      return message.content.trim();
    }
  }

  return "";
}

function extractConversationId(bodyObject: Record<string, unknown>) {
  return typeof bodyObject.conversationId === "string" ? bodyObject.conversationId : undefined;
}

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function runHermesGateway({ body, user }: HermesGatewayRequest): Promise<HermesGatewayResult> {
  const message = extractMessage(body);
  const role = isHermesAdmin(user) ? "admin" : "user";
  const userId = user.id || user.email;
  const conversationId = extractConversationId(body);

  if (!message) {
    return { ok: false, error: "Mensagem vazia.", status: 400 };
  }

  try {
    const result = await sendChatMessage({
      message,
      userRole: role,
      userId,
    });

    if (result.wasBlocked) {
      return { ok: false, error: result.response, status: 403 };
    }

    return { ok: true, text: result.response, conversationId };
  } catch (error: any) {
    return { ok: false, error: error.message || "Erro no Hermes", status: 500 };
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
