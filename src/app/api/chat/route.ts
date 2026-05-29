export const dynamic = "force-dynamic";

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

type OpenRouterResponse = {
  choices?: Array<{
    delta?: {
      content?: unknown;
    };
  }>;
};

function pickModel(clientModel?: string) {
  if (clientModel && clientModel.trim()) return clientModel.trim();
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

function normalizeMessage(msg: unknown): ChatMessage | null {
  if (!msg || typeof msg !== "object") return null;
  const message = msg as Record<string, unknown>;
  const role = String(message.role) as ChatMessage["role"];
  const content = String(message.content ?? "").trim();

  if ((role === "system" || role === "user" || role === "assistant") && content.length > 0) {
    return { role, content };
  }

  return null;
}

export async function POST(req: Request) {
  const apiKey = (process.env.OPENROUTER_API_KEY || "").trim();
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const text = "Você está em um ambiente de desenvolvimento local (Mock Mode). A chave da API do OpenRouter não foi encontrada.\n\nA interface de chat e o fluxo de resposta (streaming) estão funcionando perfeitamente! Para gerar respostas reais da inteligência artificial, você precisará configurar a variável `OPENROUTER_API_KEY` posteriormente.\n\nAté lá, sinta-se livre para testar a responsividade e o design da interface.";
          const words = text.split(" ");
          for (const word of words) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((resolve) => setTimeout(resolve, 30));
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
    return jsonError("OPENROUTER_API_KEY ausente.", 500);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Body JSON invalido.", 400);
  }

  const bodyObject = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const messages = bodyObject.messages as unknown;
  const clientModel = (typeof bodyObject.model === "string" ? bodyObject.model : "") as string;
  if (!Array.isArray(messages) || !messages.length) return jsonError("messages ausente.", 400);

  const normalized: ChatMessage[] = messages
    .map(normalizeMessage)
    .filter((msg): msg is ChatMessage => msg !== null);

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
      model: pickModel(clientModel),
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
                const parsed = JSON.parse(data) as OpenRouterResponse;
                const delta = parsed?.choices?.[0]?.delta?.content;
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

