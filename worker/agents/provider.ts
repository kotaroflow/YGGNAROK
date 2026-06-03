import { workerConfig } from "../src/config";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type CompletionOptions = {
  model?: string;
  temperature?: number;
  label?: string;
  allowExternal?: boolean;
};

type ProviderName = "ollama" | "openai" | "openrouter" | "openclaw" | "msty";

type ParsedModel = {
  provider: ProviderName | "auto";
  model: string;
};

export async function runAiCompletion(messages: ChatMessage[], options: CompletionOptions = {}): Promise<Record<string, unknown>> {
  const preferred = parseModel(options.model ?? workerConfig.ai.models.general);
  const attempts = providerAttempts(preferred);
  const errors: string[] = [];

  for (const attempt of attempts) {
    try {
      const output = await runProvider(attempt, messages, options);
      return withGatewayMetadata(output, attempt.provider, attempt.model, errors);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  return {
    summary: "Nenhum provedor de IA respondeu. O job foi preservado para nova tentativa ou fallback operacional.",
    items: [],
    next_actions: ["Verificar OLLAMA_BASE_URL, OPENROUTER_API_KEY, OPENCLAW_URL, MSTY_URL ou limites de uso."],
    risk: "medium",
    metadata: {
      ai_gateway: {
        status: "offline",
        preferred_model: options.model ?? null,
        errors,
      },
    },
  };
}

async function runProvider(model: ParsedModel & { provider: ProviderName }, messages: ChatMessage[], options: CompletionOptions) {
  switch (model.provider) {
    case "ollama": return runOllama(model.model, messages, options);
    case "openai": return runOpenAi(model.model, messages, options);
    case "openrouter": return runOpenRouter(model.model, messages, options);
    case "openclaw": return runOpenClaw(model.model, messages, options);
    case "msty": return runMsty(model.model, messages, options);
  }
}

async function runOpenAi(model: string, messages: ChatMessage[], options: CompletionOptions) {
  if (workerConfig.ai.freeFallbackOnly) {
    throw new Error("External AI is disabled by AI_FREE_FALLBACK_ONLY=true.");
  }

  if (!workerConfig.ai.openAiEnabled) {
    throw new Error("OpenAI is disabled by ENABLE_OPENAI_GPT=false.");
  }

  if (!workerConfig.ai.openAiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(45_000),
    headers: {
      Authorization: `Bearer ${workerConfig.ai.openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.4,
      response_format: { type: "json_object" },
    }),
  });

  return parseProviderResponse(response, `OpenAI/${model}`, (body) => body?.choices?.[0]?.message?.content);
}

async function runOllama(model: string, messages: ChatMessage[], options: CompletionOptions) {
  if (!workerConfig.ai.ollamaEnabled) {
    throw new Error("Ollama is disabled by ENABLE_OLLAMA=false.");
  }

  const response = await fetch(`${workerConfig.ai.ollamaBaseUrl}/api/chat`, {
    method: "POST",
    signal: AbortSignal.timeout(60_000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      temperature: options.temperature ?? 0.4,
      format: "json",
    }),
  });

  return parseOllamaResponse(response, model);
}

async function parseOllamaResponse(response: Response, model: string) {
  const body = await response.json().catch(() => null) as OllamaResponse | null;

  if (!response.ok || !body) {
    throw new Error(`Ollama/${model} request failed: ${body?.error ?? response.statusText}`);
  }

  const content = body.message?.content;
  if (!content) {
    throw new Error(`Ollama/${model} returned an empty response.`);
  }

  try {
    return normalizeProviderOutput(JSON.parse(content) as Record<string, unknown>);
  } catch {
    return { summary: content, items: [], next_actions: [], risk: "unknown", metadata: { provider: "ollama" } };
  }
}

type OllamaResponse = {
  model?: string;
  message?: { content?: string };
  error?: string;
};

async function runOpenClaw(model: string, messages: ChatMessage[], options: CompletionOptions) {
  if (!workerConfig.ai.openClawUrl) {
    throw new Error("OPENCLAW_URL is not configured.");
  }

  const response = await fetch(`${workerConfig.ai.openClawUrl}/v1/chat/completions`, {
    method: "POST",
    signal: AbortSignal.timeout(45_000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.4,
      response_format: { type: "json_object" },
    }),
  });

  return parseProviderResponse(response, `OpenClaw/${model}`, (body) => body?.choices?.[0]?.message?.content);
}

async function runMsty(model: string, messages: ChatMessage[], options: CompletionOptions) {
  if (!workerConfig.ai.mstyUrl) {
    throw new Error("MSTY_URL is not configured.");
  }

  const response = await fetch(`${workerConfig.ai.mstyUrl}/v1/chat/completions`, {
    method: "POST",
    signal: AbortSignal.timeout(45_000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.4,
      response_format: { type: "json_object" },
    }),
  });

  return parseProviderResponse(response, `Msty/${model}`, (body) => body?.choices?.[0]?.message?.content);
}

async function runOpenRouter(model: string, messages: ChatMessage[], options: CompletionOptions) {
  if (!options.allowExternal && workerConfig.ai.freeFallbackOnly && !isFreeOpenRouterModel(model)) {
    throw new Error("Paid OpenRouter models are disabled by AI_FREE_FALLBACK_ONLY=true.");
  }

  if (!workerConfig.ai.openRouterEnabled) {
    throw new Error("OpenRouter is disabled by ENABLE_OPENROUTER_FALLBACK=false.");
  }

  if (!workerConfig.ai.openRouterKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const response = await requestOpenRouter(model, messages, options);

  try {
    return await parseProviderResponse(response, `OpenRouter/${model}`, (body) => body?.choices?.[0]?.message?.content ?? body?.message?.content);
  } catch (error) {
    if (!isQuotaError(error)) {
      throw error;
    }

    let lastError = error;

    for (const fallbackModel of fallbackModelsFor(model)) {
      if (fallbackModel === model) continue;

      try {
        const fallbackResponse = await requestOpenRouter(fallbackModel, messages, options);
        const output = await parseProviderResponse(fallbackResponse, `OpenRouter/fallback:${fallbackModel}`, (body) => body?.choices?.[0]?.message?.content ?? body?.message?.content);
        return withFallbackMetadata(output, model, fallbackModel);
      } catch (fallbackError) {
        lastError = fallbackError;
      }
    }

    throw lastError;
  }
}

async function requestOpenRouter(model: string, messages: ChatMessage[], options: CompletionOptions) {
  return fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(45_000),
    headers: {
      Authorization: `Bearer ${workerConfig.ai.openRouterKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://yggnarok-v1.vercel.app",
      "X-Title": "YGGNAROK AI Council",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.4,
      response_format: { type: "json_object" },
    }),
  });
}

async function parseProviderResponse(
  response: Response,
  provider: string,
  readContent: (body: ProviderBody | null) => string | undefined,
) {
  const body = (await response.json().catch(() => null)) as ProviderBody | null;

  if (!response.ok) {
    throw new ProviderRequestError(`${provider} request failed: ${body?.error?.message ?? response.statusText}`, response.status);
  }

  const content = readContent(body);

  if (!content) {
    throw new Error(`${provider} returned an empty response.`);
  }

  try {
    return normalizeProviderOutput(JSON.parse(content) as Record<string, unknown>);
  } catch {
    return { summary: content, items: [], next_actions: [], risk: "unknown", metadata: {} };
  }
}

type ProviderBody = {
  choices?: Array<{ message?: { content?: string } }>;
  message?: { content?: string };
  error?: { message?: string };
};

class ProviderRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function providerAttempts(preferred: ParsedModel) {
  const attempts: Array<ParsedModel & { provider: ProviderName }> = [];
  const add = (provider: ProviderName, model: string) => {
    if (!attempts.some((a) => a.provider === provider && a.model === model)) {
      attempts.push({ provider, model });
    }
  };

  if (preferred.provider !== "auto") {
    add(preferred.provider, preferred.model);
  }

  const baseModel = preferred.provider !== "auto" ? preferred.model : stripProvider(workerConfig.ai.models.general);

  if (preferred.provider === "ollama" || preferred.provider === "auto" || workerConfig.ai.provider === "hybrid" || workerConfig.ai.provider === "openrouter" || workerConfig.ai.provider === "ollama") {
    if (workerConfig.ai.openRouterEnabled) {
      add("openrouter", baseModel);
    }
    if (workerConfig.ai.openClawEnabled && workerConfig.ai.openClawUrl) {
      add("openclaw", baseModel);
    }
    if (workerConfig.ai.mstyEnabled && workerConfig.ai.mstyUrl) {
      add("msty", baseModel);
    }
    if (!workerConfig.ai.freeFallbackOnly && workerConfig.ai.openAiEnabled) {
      add("openai", stripProvider(workerConfig.ai.models.premium));
    }
  }

  add("openrouter", "google/gemini-2.5-flash");

  return attempts;
}

function parseModel(value: string): ParsedModel {
  if (value.startsWith("ollama:")) return { provider: "ollama", model: value.slice("ollama:".length) };
  if (value.startsWith("openai:")) return { provider: "openai", model: value.slice("openai:".length) };
  if (value.startsWith("openrouter:")) return { provider: "openrouter", model: value.slice("openrouter:".length) };
  if (value.startsWith("openclaw:")) return { provider: "openclaw", model: value.slice("openclaw:".length) };
  if (value.startsWith("msty:")) return { provider: "msty", model: value.slice("msty:".length) };
  return { provider: "auto", model: value };
}

function stripProvider(value: string) {
  return parseModel(value).model;
}

function isQuotaError(error: unknown) {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return error instanceof ProviderRequestError && (error.status === 402 || error.status === 429)
    || message.includes("insufficient credits")
    || message.includes("quota")
    || message.includes("billing");
}

function isFreeOpenRouterModel(model: string) {
  return model === "openrouter/free" || model.endsWith(":free");
}

function fallbackModelsFor(model: string) {
  return [
    model,
    "google/gemini-2.5-flash",
    "meta-llama/llama-4-scout",
    "mistral/mistral-small-3.1",
    "openrouter/free",
  ];
}

function withFallbackMetadata(output: Record<string, unknown>, preferredModel: string, fallbackModel: string) {
  const metadata = output.metadata && typeof output.metadata === "object" && !Array.isArray(output.metadata)
    ? output.metadata as Record<string, unknown>
    : {};

  return {
    ...output,
    metadata: {
      ...metadata,
      provider_fallback: {
        reason: "quota_or_billing",
        preferred_model: preferredModel,
        used_model: fallbackModel,
      },
    },
  };
}

function withGatewayMetadata(output: Record<string, unknown>, provider: ProviderName, model: string, previousErrors: string[]) {
  const metadata = output.metadata && typeof output.metadata === "object" && !Array.isArray(output.metadata)
    ? output.metadata as Record<string, unknown>
    : {};

  return {
    ...output,
    metadata: {
      ...metadata,
      ai_gateway: {
        status: "ok",
        provider,
        model,
        previous_errors: previousErrors,
      },
    },
  };
}

function normalizeProviderOutput(output: Record<string, unknown>): Record<string, unknown> {
  const summary = typeof output.summary === "string"
    ? output.summary
    : typeof output.text === "string"
      ? output.text
      : JSON.stringify(output).slice(0, 1200);

  return {
    ...output,
    summary,
    items: Array.isArray(output.items) ? output.items : [],
    next_actions: Array.isArray(output.next_actions) ? output.next_actions : [],
    risk: typeof output.risk === "string" ? output.risk : "unknown",
    metadata: output.metadata && typeof output.metadata === "object" && !Array.isArray(output.metadata) ? output.metadata : {},
  };
}
