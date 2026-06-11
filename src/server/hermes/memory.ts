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
const MAX_SUMMARY_MESSAGES = 6;
const MAX_SUMMARY_CHARS = 1600;
const SUMMARY_SIGNAL_PATTERN =
  /\b(decis[aã]o|decidid|aprovad|etapa|modelo|model|openrouter|hermes|fallback|arquivo|file|erro|falha|bug|typecheck|commit|pr[oó]ximo|next|todo)\b/i;
const SENSITIVE_PATTERN =
  /(api[_-]?key|authorization|bearer|password|senha|secret|token)\b\s*[:=]/i;

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

function sanitizeSummaryContent(content: string) {
  return content
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim();
      return (
        trimmed &&
        !SENSITIVE_PATTERN.test(trimmed) &&
        !trimmed.startsWith("at ") &&
        !trimmed.startsWith("Traceback")
      );
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildConversationSummary(messages: HermesContextMessage[], currentUserMessage: string) {
  const candidates = messages
    .filter((message) => message.content.trim())
    .filter((message) => !isCurrentUserMessage(message, currentUserMessage))
    .map((message) => ({
      role: message.role,
      content: sanitizeSummaryContent(message.content),
    }))
    .filter((message) => message.content && SUMMARY_SIGNAL_PATTERN.test(message.content))
    .slice(-MAX_SUMMARY_MESSAGES);

  if (candidates.length === 0) {
    return null;
  }

  const lines: string[] = [];
  let charCount = 0;

  for (const message of candidates) {
    const line = `- ${message.role}: ${message.content}`;

    if (charCount + line.length > MAX_SUMMARY_CHARS) {
      break;
    }

    lines.push(line);
    charCount += line.length;
  }

  return lines.length > 0 ? lines.join("\n") : null;
}

function compactConversationMessages(
  recoveredMessages: HermesContextMessage[],
  clientMessages: HermesContextMessage[],
  currentUserMessage: string,
  summary: string | null,
) {
  const source = recoveredMessages.length > 0 ? recoveredMessages : clientMessages;
  const candidates = source
    .map((message) => ({
      ...message,
      content: sanitizeSummaryContent(message.content),
    }))
    .filter((message) => message.content)
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

  const promptParts = [
    ...(summary ? ["Resumo da conversa:", summary, ""] : []),
    ...(selected.length
      ? [
        "Contexto recente da conversa:",
        ...selected.map((message) => `${message.role}: ${message.content}`),
        "",
      ]
      : []),
    "Mensagem atual:",
    currentUserMessage,
  ];

  return {
    messages: selected,
    prompt: promptParts.join("\n"),
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
  const summary = buildConversationSummary(messages, currentUserMessage);
  const compressedContext = compactConversationMessages([], messages, currentUserMessage, summary);

  return {
    currentUserMessage,
    messages,
    recoveredMessages: [],
    compressedContext,
    summary,
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
  const summarySource = recoveredMessages.length > 0 ? recoveredMessages : messages;
  const summary = buildConversationSummary(summarySource, currentUserMessage);
  const compressedContext = compactConversationMessages(recoveredMessages, messages, currentUserMessage, summary);

  return {
    conversationId,
    currentUserMessage,
    messages,
    recoveredMessages,
    compressedContext,
    summary,
    metadata: {
      requestedModel: typeof body.model === "string" ? body.model : undefined,
      allowLocalOllama: body.allowLocalOllama === true,
      messageCount: messages.length,
      recoveredMessageCount: recoveredMessages.length,
      hasClientMessages: messages.length > 0,
    },
  };
}
