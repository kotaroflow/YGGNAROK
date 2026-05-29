/**
 * Histórico de mensagens por conversa — localStorage com sync Supabase quando autenticado.
 */

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

const convKey = (convId: string) => `yggnarok.chat.history.v1.${convId}`;
const LEGACY_KEY = "yggnarok.chat.history.v1";

export const CHAT_SYSTEM_MESSAGE: ChatMessage = {
  id: "system-default",
  role: "system",
  content:
    "Você é o Conselho IA do YGGNAROK. Responda em PT-BR, direto, prático e focado em alta performance.",
};

function normalize(messages: ChatMessage[]): ChatMessage[] {
  if (!messages.length || messages[0].role !== "system") {
    return [CHAT_SYSTEM_MESSAGE, ...messages.filter((m) => m.role !== "system")];
  }
  return messages;
}

function loadLocal(convId: string): ChatMessage[] {
  if (typeof window === "undefined") return [CHAT_SYSTEM_MESSAGE];
  try {
    const raw = localStorage.getItem(convKey(convId));
    if (raw) return normalize(JSON.parse(raw) as ChatMessage[]);
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) return normalize(JSON.parse(legacy) as ChatMessage[]);
  } catch {
    // ignore
  }
  return [CHAT_SYSTEM_MESSAGE];
}

function saveLocal(convId: string, messages: ChatMessage[]) {
  try {
    localStorage.setItem(convKey(convId), JSON.stringify(messages));
  } catch {
    // ignore
  }
}

export function newConversationId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function loadConversation(convId: string): Promise<ChatMessage[]> {
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/chat/conversations/${convId}/messages`, { cache: "no-store" });
      if (res.ok) {
        const payload = (await res.json()) as { messages: ChatMessage[] };
        if (payload.messages?.length) {
          saveLocal(convId, payload.messages);
          return payload.messages;
        }
      }
    } catch {
      // fallback local
    }
  }
  return loadLocal(convId);
}

export async function saveConversation(convId: string, messages: ChatMessage[]) {
  saveLocal(convId, messages);
  try {
    await fetch(`/api/chat/conversations/${convId}/messages`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
  } catch {
    // local only
  }
}

export function clearConversation(convId: string) {
  try {
    localStorage.removeItem(convKey(convId));
  } catch {
    // ignore
  }
}
