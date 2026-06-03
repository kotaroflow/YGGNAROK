export const dynamic = "force-dynamic";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rateLimitByIp } from "@/lib/rate-limit";

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

function stripProviderPrefix(value: string) {
  const prefixes = ["ollama:", "openrouter:", "openai:", "openclaw:", "msty:"];
  for (const prefix of prefixes) {
    if (value.startsWith(prefix)) return value.slice(prefix.length);
  }
  return value;
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

function proxyOllamaStream(upstream: Response) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data) continue;

            try {
              const parsed = JSON.parse(data) as { message?: { content?: string }; done?: boolean };
              if (parsed.message?.content) {
                controller.enqueue(encoder.encode(parsed.message.content));
              }
            } catch {
              // skip malformed JSON
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        try { reader.releaseLock(); } catch { /* ignore */ }
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

export async function POST(req: Request) {
  const { allowed, remaining } = rateLimitByIp(req, 20, 60000);
  if (!allowed) {
    return Response.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429, headers: { "X-RateLimit-Remaining": "0", "Retry-After": "60" } });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Não autenticado." }, { status: 401 });
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

  const ollamaBaseUrl = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
  try {
    const ollamaResponse = await fetch(`${ollamaBaseUrl}/api/chat`, {
      method: "POST",
      signal: AbortSignal.timeout(5000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: pickModel(clientModel).replace(/^ollama:/, ""),
        messages: normalized,
        stream: true,
      }),
    });

    if (ollamaResponse.ok && ollamaResponse.body) {
      return proxyOllamaStream(ollamaResponse);
    }
  } catch {
    // Ollama not available, fall through to OpenRouter
  }

  const apiKey = (process.env.OPENROUTER_API_KEY || "").trim();
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const text = "Você está em um ambiente de desenvolvimento local (Mock Mode). Nenhum provedor AI local (Ollama) ou remoto (OpenRouter) foi encontrado.\n\nA interface de chat e o fluxo de resposta (streaming) estão funcionando perfeitamente! Para gerar respostas reais, configure OLLAMA_BASE_URL ou OPENROUTER_API_KEY.";
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
    return jsonError("OPENROUTER_API_KEY ausente e Ollama indisponivel.", 500);
  }

  let finalMessages = normalized;

  // Compress older messages if history is long (> 12 messages) to protect API costs and model focus
  if (normalized.length > 12) {
    try {
      const systemMsg = normalized.find((m) => m.role === "system");
      const userAndAssistantMsgs = normalized.filter((m) => m.role !== "system");

      if (userAndAssistantMsgs.length > 8) {
        // Keep the last 6 messages completely intact for conversational flow
        const messagesToCompress = userAndAssistantMsgs.slice(0, -6);
        const messagesToKeep = userAndAssistantMsgs.slice(-6);

        // Compress utilizing Llama 3.1 8B (100% FREE on OpenRouter)
        const summaryResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.OPENROUTER_APP_URL || "http://localhost:3000",
            "X-Title": "YGGNAROK Context Condenser",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct",
            messages: [
              {
                role: "system",
                content: "Você é o sistema de compressão de memória do YGGNAROK. Resuma em português do Brasil os principais pontos, preferências do usuário, fatos e tópicos cruciais discutidos no histórico a seguir em um resumo de no máximo 3 linhas. Seja extremamente conciso. Responda APENAS com o resumo direto, sem saudações ou explicações.",
              },
              ...messagesToCompress,
            ],
            temperature: 0.3,
            max_tokens: 150,
          }),
        });

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          const summaryText = summaryData?.choices?.[0]?.message?.content?.trim();

          if (summaryText) {
            finalMessages = [];
            if (systemMsg) finalMessages.push(systemMsg);
            finalMessages.push({
              role: "system",
              content: `[MEMÓRIA DO CONTEXTO ANTERIOR COMPACTADA: ${summaryText}]`
            });
            finalMessages.push(...messagesToKeep);
          }
        }
      }
    } catch (e) {
      console.error("Erro na compressão automática de histórico:", e);
    }
  }

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
      model: stripProviderPrefix(pickModel(clientModel)),
      messages: finalMessages,
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

