/**
 * Histórico de mensagens por conversa (localStorage).
 */

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

const LEGACY_KEY = "yggnarok.chat.history.v1";
const convKey = (convId: string) => `yggnarok.chat.history.v1.${convId}`;

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

export function loadConversation(convId: string): ChatMessage[] {
  if (typeof window === "undefined") return [CHAT_SYSTEM_MESSAGE];

  try {
    const raw = localStorage.getItem(convKey(convId));
    if (raw) return normalize(JSON.parse(raw) as ChatMessage[]);

    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy && convId !== "legacy") {
      return normalize(JSON.parse(legacy) as ChatMessage[]);
    }
  } catch {
    // ignore
  }

  return [CHAT_SYSTEM_MESSAGE];
}

export function saveConversation(convId: string, messages: ChatMessage[]) {
  try {
    localStorage.setItem(convKey(convId), JSON.stringify(messages));
  } catch {
    // ignore
  }
}

export function clearConversation(convId: string) {
  try {
    localStorage.removeItem(convKey(convId));
  } catch {
    // ignore
  }
}

export function newConversationId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
