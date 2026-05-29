export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

type ChatRequestBody = {
  messages?: unknown;
};

interface OpenRouterChunk {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
}

function pickModel() {
  const configured = (process.env.AI_MODEL || "").trim();
  if (!configured) return "meta-llama/llama-3.1-8b-instruct";
  return configured;
}

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function extractSseDataLines(chunk: string) {
  return chunk
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice("data:".length).trimStart());
}

export async function POST(req: Request) {
  const apiKey = (process.env.OPENROUTER_API_KEY || "").trim();
  if (!apiKey) return jsonError("OPENROUTER_API_KEY ausente.", 500);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Body JSON invalido.", 400);
  }

  const requestBody = body as ChatRequestBody;
  const messages =
    body && typeof body === "object" && "messages" in body ? requestBody.messages : null;
  if (!Array.isArray(messages) || !messages.length) return jsonError("messages ausente.", 400);

  const normalized: ChatMessage[] = messages
    .filter((msg): msg is Record<string, unknown> => msg !== null && typeof msg === "object")
    .map((msg) => ({
      role: String(msg.role ?? "") as ChatMessage["role"],
      content: String(msg.content ?? ""),
    }))
    .filter((msg) => (msg.role === "system" || msg.role === "user" || msg.role === "assistant") && msg.content.trim().length > 0);

  if (!normalized.length) return jsonError("messages vazio apos normalizacao.", 400);

  const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      "HTTP-Referer": process.env.OPENROUTER_APP_URL || "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_APP_NAME || "YGGNAROK",
    },
    body: JSON.stringify({
      model: pickModel(),
      messages: normalized,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return jsonError(`OpenRouter falhou (${upstream.status}). ${detail}`.trim(), 502);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let buffered = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (!value) continue;

          buffered += decoder.decode(value, { stream: true });

          const parts = buffered.split("\n\n");
          buffered = parts.pop() || "";

          for (const part of parts) {
            const dataLines = extractSseDataLines(part);
            for (const data of dataLines) {
              if (!data) continue;
              if (data === "[DONE]") {
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(data) as OpenRouterChunk;
                const delta = parsed.choices?.[0]?.delta?.content ?? "";
                if (typeof delta === "string" && delta.length) {
                  controller.enqueue(encoder.encode(delta));
                }
              } catch {
                // ignore malformed JSON chunks
              }
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        try {
          reader.releaseLock();
        } catch {
          // ignore
        }
      }

      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
    },
  });
}

