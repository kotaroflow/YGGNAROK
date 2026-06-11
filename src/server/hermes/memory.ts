import type { ChatMessage } from "@/lib/chat-storage";
import { loadMessages } from "@/server/chat/repository";

export type HermesContextMessage = Pick<ChatMessage, "role" | "content"> & {
  id?: string;
};

export type HermesContextPackage = {
  conversationId?: string;
  currentUserMessage: string;
  messages: HermesContextMessage[];
  recoveredMessages: HermesContextMessage[];
  compressedContext: {
    messages: HermesContextMessage[];
    prompt: string;
    maxMessages: number;
    maxChars: number;
    truncated: boolean;
  };
  summary: string | null;
  metadata: {
    requestedModel?: string;
    allowLocalOllama: boolean;
    messageCount: number;
    recoveredMessageCount: number;
    hasClientMessages: boolean;
  };
};

export type PrepareHermesContextInput = {
  body: Record<string, unknown>;
  userId: string;
};

const MAX_CONTEXT_MESSAGES = 8;
const MAX_CONTEXT_CHARS = 6000;

function normalizeMessage(item: unknown): HermesContextMessage | null {
  if (!item || typeof item !== "object") return null;

  const raw = item as Record<string, unknown>;
  const role = raw.role;
  const content = typeof raw.content === "string" ? raw.content.trim() : "";

  if ((role === "system" || role === "user" || role === "assistant") && content) {
    return {
      id: typeof raw.id === "string" ? raw.id : undefined,
      role,
      content,
    };
  }

  return null;
}

function normalizeMessages(bodyObject: Record<string, unknown>) {
  if (!Array.isArray(bodyObject.messages)) {
    return [];
  }

  return bodyObject.messages
    .map(normalizeMessage)
    .filter((message): message is HermesContextMessage => message !== null);
}

function extractCurrentUserMessage(bodyObject: Record<string, unknown>, messages: HermesContextMessage[]) {
  if (typeof bodyObject.message === "string") {
    return bodyObject.message.trim();
  }

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "user") {
      return message.content.trim();
    }
  }

  return "";
}

function extractConversationId(bodyObject: Record<string, unknown>) {
  return typeof bodyObject.conversationId === "string" ? bodyObject.conversationId : undefined;
}

async function recoverConversationMessages(userId: string, conversationId?: string) {
  if (!conversationId) return [];

  try {
    return (await loadMessages(userId, conversationId)).map(({ id, role, content }) => ({
      id,
      role,
      content,
    }));
  } catch {
    return [];
  }
}

function isCurrentUserMessage(message: HermesContextMessage, currentUserMessage: string) {
  return message.role === "user" && message.content.trim() === currentUserMessage.trim();
}

function compactConversationMessages(
  recoveredMessages: HermesContextMessage[],
  clientMessages: HermesContextMessage[],
  currentUserMessage: string,
) {
  const source = recoveredMessages.length > 0 ? recoveredMessages : clientMessages;
  const candidates = source
    .filter((message) => message.content.trim())
    .filter((message) => !isCurrentUserMessage(message, currentUserMessage));

  const selected: HermesContextMessage[] = [];
  let charCount = 0;
  let truncated = candidates.length > MAX_CONTEXT_MESSAGES;

  for (let index = candidates.length - 1; index >= 0; index -= 1) {
    const message = candidates[index];
    const contentLength = message.content.length;

    if (selected.length >= MAX_CONTEXT_MESSAGES || charCount + contentLength > MAX_CONTEXT_CHARS) {
      truncated = true;
      break;
    }

    selected.unshift(message);
    charCount += contentLength;
  }

  const prompt = selected.length
    ? [
        "Contexto recente da conversa:",
        ...selected.map((message) => `${message.role}: ${message.content}`),
        "",
        "Mensagem atual:",
        currentUserMessage,
      ].join("\n")
    : currentUserMessage;

  return {
    messages: selected,
    prompt,
    maxMessages: MAX_CONTEXT_MESSAGES,
    maxChars: MAX_CONTEXT_CHARS,
    truncated,
  };
}

export function createHermesContextFromMessage(message: string): HermesContextPackage {
  const currentUserMessage = message.trim();
  const messages: HermesContextMessage[] = currentUserMessage
    ? [{ role: "user", content: currentUserMessage }]
    : [];
  const compressedContext = compactConversationMessages([], messages, currentUserMessage);

  return {
    currentUserMessage,
    messages,
    recoveredMessages: [],
    compressedContext,
    summary: null,
    metadata: {
      allowLocalOllama: false,
      messageCount: messages.length,
      recoveredMessageCount: 0,
      hasClientMessages: messages.length > 0,
    },
  };
}

export async function prepareHermesContext({
  body,
  userId,
}: PrepareHermesContextInput): Promise<HermesContextPackage> {
  const conversationId = extractConversationId(body);
  const messages = normalizeMessages(body);
  const currentUserMessage = extractCurrentUserMessage(body, messages);
  const recoveredMessages = await recoverConversationMessages(userId, conversationId);
  const compressedContext = compactConversationMessages(recoveredMessages, messages, currentUserMessage);

  return {
    conversationId,
    currentUserMessage,
    messages,
    recoveredMessages,
    compressedContext,
    summary: null,
    metadata: {
      requestedModel: typeof body.model === "string" ? body.model : undefined,
      allowLocalOllama: body.allowLocalOllama === true,
      messageCount: messages.length,
      recoveredMessageCount: recoveredMessages.length,
      hasClientMessages: messages.length > 0,
    },
  };
}
