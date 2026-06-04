type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  OPENROUTER_API_KEY?: string;
  AI_PROVIDER?: string;
  AI_MODEL?: string;
  AI_MODEL_FAST?: string;
  AI_MODEL_GENERAL?: string;
  AI_MODEL_CREATIVE?: string;
  AI_MODEL_ALTERNATIVE?: string;
  AI_MODEL_CRITIC?: string;
  AI_MODEL_STYLE_CRITIC?: string;
  AI_MODEL_CONSOLIDATOR?: string;
  AI_MODEL_CODE?: string;
  AI_MODEL_SAFETY?: string;
  AI_MODEL_RESEARCH?: string;
  AI_MULTI_MODEL_ENABLED?: string;
  AI_FREE_FALLBACK_ONLY?: string;
  AI_DEFAULT_MODE?: string;
  RUNNER_TOKEN: string;
  OLLAMA_BASE_URL?: string;
  OLLAMA_MODEL?: string;
  OLLAMA_CODE_MODEL?: string;
  OLLAMA_FAST_MODEL?: string;
  MSTY_URL?: string;
  ENABLE_OLLAMA?: string;
  ENABLE_MSTY?: string;
  AI?: {
    run(model: string, input: Record<string, unknown>): Promise<unknown>;
  };
};

type ScheduledEvent = unknown;
type ExecutionContext = {
  waitUntil(promise: Promise<unknown>): void;
};

type ClaimedJob = {
  id: string;
  user_id: string;
  profile_id: string | null;
  type: string;
  payload: Record<string, unknown> | null;
  attempts: number;
  max_attempts: number;
};

type AiMode = "fast" | "normal" | "comparative" | "evolutive" | "debate";
type AiRole = "fast" | "general" | "creative" | "alternative" | "critic" | "styleCritic" | "consolidator" | "code" | "safety" | "research";
type AiDomain = "general" | "creative" | "code" | "system" | "research" | "safety" | "media" | "report";

const agentKeys = ["hefesto", "gaia", "morax", "yomi", "hotei", "heimdall", "maat", "isis"] as const;
type AgentKey = typeof agentKeys[number];

const agentPrompts: Record<AgentKey, { module: string; system: string }> = {
  hefesto: { module: "content", system: "Voce e Hefesto, agente de criacao. Gere ideias, roteiro, legenda, hashtags e checklist. Nao publique automaticamente. Responda JSON." },
  gaia: { module: "profiles", system: "Voce e Gaia, agente de perfis. Sugira tags operacionais, riscos, objetivos e proximas acoes. Tags nao sao permissoes. Responda JSON." },
  morax: { module: "sales", system: "Voce e Morax, agente comercial. Estruture oferta, campanha, afiliados, links, riscos e oportunidades. Responda JSON." },
  yomi: { module: "posting", system: "Voce e Yomi, agente de postagem manual. Gere checklist, legenda para copiar, hashtags e pendencias. Nao prometa autopost. Responda JSON." },
  hotei: { module: "library", system: "Voce e Hotei, agente de biblioteca. Classifique referencias, prompts e materiais reutilizaveis. Responda JSON." },
  heimdall: { module: "system", system: "Voce e Heimdall, agente tecnico. Analise jobs, logs, saude e seguranca sem expor segredos. Responda JSON." },
  maat: { module: "reports", system: "Voce e Maat, agente de relatorios. Gere metricas interpretadas, resumo e recomendacoes. Responda JSON." },
  isis: { module: "content", system: "Voce e Isis, agente de revisao. Avalie clareza, coerencia, risco e criterio de aprovacao. Responda JSON." },
};

const worker = {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, service: "ygn-ai-runner" });
    }

    if (url.pathname === "/run-once" && request.headers.get("Authorization") === `Bearer ${env.RUNNER_TOKEN}`) {
      const result = await runOnce(env);
      return Response.json(result);
    }

    if (url.pathname === "/complete" && request.method === "POST" && request.headers.get("Authorization") === `Bearer ${env.RUNNER_TOKEN}`) {
      const body = await request.json().catch(() => null) as {
        system?: string;
        agent?: string;
        payload?: Record<string, unknown>;
      } | null;

      if (!body?.system || !body.payload) {
        return Response.json({ ok: false, error: "Invalid completion payload." }, { status: 400 });
      }

      const output = await runWorkersAi(env, body.system, {
        agent: body.agent ?? "worker-ai",
        ...body.payload,
      });

      return Response.json({
        ok: true,
        provider: "workers-ai",
        model: "@cf/meta/llama-3.1-8b-instruct",
        output,
      });
    }

    return new Response("Not found", { status: 404 });
  },

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runOnce(env));
  },
};

export default worker;

async function runOnce(env: Env) {
  await rpc(env, "recover_zombie_ai_jobs", { p_timeout: "15 minutes" }).catch((error) =>
    writeHealth(env, "error", "Cloudflare runner failed to recover zombie jobs", { error: String(error?.message ?? error) }),
  );

  const job = await rpc<ClaimedJob | null>(env, "claim_next_ai_job", {});

  if (!job?.id) {
    return { processed: false };
  }

  await processJob(env, job);
  return { processed: true, job_id: job.id };
}

async function processJob(env: Env, job: ClaimedJob) {
  const startedAt = new Date().toISOString();
  const agentKey = pickAgent(job.type, job.payload);
  const agent = agentPrompts[agentKey];

  try {
    const output = await complete(env, agent.system, {
      job_type: job.type,
      agent_key: agentKey,
      module: agent.module,
      payload: job.payload ?? {},
    });

    await insert(env, "agent_runs", {
      job_id: job.id,
      user_id: job.user_id,
      profile_id: job.profile_id,
      agent_key: agentKey,
      module: agent.module,
      input: job.payload ?? {},
      output,
      status: "completed",
      started_at: startedAt,
      completed_at: new Date().toISOString(),
    });

    await updateJob(env, job.id, {
      status: "completed",
      result: output,
      completed_at: new Date().toISOString(),
      error_message: null,
    });
  } catch (error) {
    const message = String(error instanceof Error ? error.message : error);
    const failedPermanently = job.attempts >= job.max_attempts;

    await insert(env, "agent_runs", {
      job_id: job.id,
      user_id: job.user_id,
      profile_id: job.profile_id,
      agent_key: agentKey,
      module: agent.module,
      input: job.payload ?? {},
      output: null,
      status: "failed",
      error_message: message,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
    });

    await updateJob(env, job.id, {
      status: failedPermanently ? "failed" : "pending",
      error_message: message,
      completed_at: failedPermanently ? new Date().toISOString() : null,
    });

    await writeHealth(env, failedPermanently ? "error" : "warning", "Cloudflare runner job failed", {
      job_id: job.id,
      attempts: job.attempts,
      max_attempts: job.max_attempts,
    });
  }
}

async function complete(env: Env, system: string, payload: Record<string, unknown>) {
  if (env.ENABLE_OLLAMA !== "false") {
    try {
      return await runOllama(env, system, payload);
    } catch {
      // Ollama not available, fall through
    }
  }

  const provider = env.AI_PROVIDER ?? "openrouter";

  if (provider === "workers-ai") {
    return runWorkersAi(env, system, payload);
  }

  try {
    return await runOpenAiCompatible(env, system, payload, provider);
  } catch (error) {
    if (env.AI && isProviderQuotaError(error)) {
      await writeHealth(env, "warning", "Primary AI provider quota failed; falling back to Workers AI", {
        provider,
        error: String(error instanceof Error ? error.message : error),
      });
      return runWorkersAi(env, system, payload);
    }

    throw error;
  }
}

async function runOpenAiCompatible(env: Env, system: string, payload: Record<string, unknown>, provider: string) {
  const domain = inferDomain(String(payload.job_type ?? ""), payload.payload ?? payload);
  const mode = inferMode(env, String(payload.job_type ?? ""), payload.payload ?? payload, domain);
  const freeFallbackOnly = env.AI_FREE_FALLBACK_ONLY === "true";
  const executorRoles = freeFallbackOnly ? ["fast" as const] : executorRolesFor(domain, mode);
  const criticRoles = freeFallbackOnly ? [] : criticRolesFor(domain, mode);

  const candidates = await Promise.all(executorRoles.map(async (role) => {
    const model = modelFor(env, role);
    const output = await callOpenRouter(env, provider, model, [
      { role: "system", content: `${system} Voce e o executor ${role}. Dominio: ${domain}. Modo: ${mode}. Responda apenas JSON com {"summary":string,"items":array,"next_actions":array,"risk":string,"metadata":object}.` },
      { role: "user", content: JSON.stringify(payload) },
    ], role === "creative" || role === "alternative" ? 0.75 : 0.45);

    return { role, model, output };
  }));

  const critiques = await Promise.all(criticRoles.map(async (role) => {
    const model = modelFor(env, role);
    const output = await callOpenRouter(env, provider, model, [
      { role: "system", content: `Voce e o critico ${role} do YGGNAROK. Compare candidatos, encontre falhas e preserve qualidade. Responda apenas JSON com {"summary":string,"items":array,"next_actions":array,"risk":string,"metadata":object}.` },
      { role: "user", content: JSON.stringify({ ...payload, candidates }) },
    ], 0.25);

    return { role, model, output };
  }));

  const final = (mode === "fast" || freeFallbackOnly) && !critiques.length ? candidates[0]?.output : await callOpenRouter(env, provider, modelFor(env, "consolidator"), [
    { role: "system", content: `${system} Voce e o consolidador final. Use o melhor dos candidatos e das criticas, resolva conflitos e entregue saida pronta. Responda apenas JSON com {"summary":string,"items":array,"next_actions":array,"risk":string,"metadata":object}.` },
    { role: "user", content: JSON.stringify({ ...payload, candidates, critiques }) },
  ], 0.35);

  return {
    ...asObject(final),
    metadata: {
      ...asObject(asObject(final).metadata),
      ai_orchestration: {
        provider: "openrouter",
        runner: "cloudflare",
        domain,
        mode,
        cost_guard: freeFallbackOnly ? "free_fallback_only" : "standard",
        executor_roles: candidates.map((candidate) => candidate.role),
        critic_roles: critiques.map((critique) => critique.role),
        models: {
          executors: candidates.map(({ role, model }) => ({ role, model })),
          critics: critiques.map(({ role, model }) => ({ role, model })),
          consolidator: modelFor(env, "consolidator"),
        },
      },
    },
  };
}

async function callOpenRouter(env: Env, provider: string, model: string, messages: Array<{ role: "system" | "user"; content: string }>, temperature: number) {
  const response = await requestOpenRouter(env, provider, model, messages, temperature);

  try {
    return await parseOpenRouterResponse(response);
  } catch (error) {
    if (!isProviderQuotaError(error)) {
      throw error;
    }

    let lastError = error;

    for (const fallbackModel of fallbackModelsFor(model)) {
      if (fallbackModel === model) continue;

      try {
        const fallbackResponse = await requestOpenRouter(env, provider, fallbackModel, messages, temperature);
        const output = await parseOpenRouterResponse(fallbackResponse);
        return {
          ...asObject(output),
          metadata: {
            ...asObject(asObject(output).metadata),
            provider_fallback: {
              reason: "quota_or_billing",
              preferred_model: model,
              used_model: fallbackModel,
            },
          },
        };
      } catch (fallbackError) {
        lastError = fallbackError;
      }
    }

    throw lastError;
  }
}

async function requestOpenRouter(env: Env, provider: string, model: string, messages: Array<{ role: "system" | "user"; content: string }>, temperature: number) {
  const endpoint = provider === "openrouter" ? "https://openrouter.ai/api/v1/chat/completions" : "";
  const key = provider === "openrouter" ? env.OPENROUTER_API_KEY : "";

  if (!key) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(30_000),
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://yggnarok-v1.vercel.app",
      "X-Title": "YGGNAROK / YGN V1",
    },
    body: JSON.stringify({
      model,
      temperature,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  return response;
}

async function parseOpenRouterResponse(response: Response) {
  const body = await response.json().catch(() => null) as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } } | null;

  if (!response.ok) {
    throw new ProviderRequestError(body?.error?.message ?? response.statusText, response.status);
  }

  const content = body?.choices?.[0]?.message?.content;
  if (!content) throw new Error("AI provider returned an empty response.");

  try {
    return normalizeProviderOutput(JSON.parse(content) as Record<string, unknown>);
  } catch {
    return { summary: content, items: [], next_actions: [], risk: "unknown", metadata: {} };
  }
}

class ProviderRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function modelFor(env: Env, role: AiRole) {
  const models: Record<AiRole, string | undefined> = {
    fast: env.AI_MODEL_FAST,
    general: env.AI_MODEL_GENERAL ?? env.AI_MODEL,
    creative: env.AI_MODEL_CREATIVE,
    alternative: env.AI_MODEL_ALTERNATIVE,
    critic: env.AI_MODEL_CRITIC,
    styleCritic: env.AI_MODEL_STYLE_CRITIC,
    consolidator: env.AI_MODEL_CONSOLIDATOR,
    code: env.AI_MODEL_CODE,
    safety: env.AI_MODEL_SAFETY,
    research: env.AI_MODEL_RESEARCH,
  };

  return models[role] ?? defaultModelFor(role);
}

function defaultModelFor(role: AiRole) {
  const defaults: Record<AiRole, string> = {
    fast: "qwen2.5-coder:7b",
    general: "gemma4:latest",
    creative: "gemma4:latest",
    alternative: "gemma4:latest",
    critic: "gemma4:latest",
    styleCritic: "gemma4:latest",
    consolidator: "gemma4:latest",
    code: "qwen2.5-coder:14b",
    safety: "gemma4:latest",
    research: "gemma4:latest",
  };

  return defaults[role];
}

function inferDomain(type: string, payload: unknown): AiDomain {
  const text = `${type} ${JSON.stringify(payload ?? {})}`.toLowerCase();

  if (/(code|codigo|código|component|typescript|react|bug|refactor|unit test|teste automatizado|teste unitario|teste unitário)/.test(text)) return "code";
  if (/(log|health|seguranca|segurança|security|system|worker|audit|erro|falha)/.test(text)) return "system";
  if (/(research|pesquisa|fonte|noticia|notícia|comparar|mercado)/.test(text)) return "research";
  if (/(risk|risco|moderation|moderacao|moderação|policy|safe)/.test(text)) return "safety";
  if (/(image|imagem|video|vídeo|audio|áudio|voz|asset|media|mídia)/.test(text)) return "media";
  if (/(report|relatorio|relatório|metric|métrica|dashboard)/.test(text)) return "report";
  if (/(content|conteudo|conteúdo|roteiro|legenda|criativo|criar|ideia|copy|post|script|story)/.test(text)) return "creative";

  return "general";
}

function inferMode(env: Env, type: string, payload: unknown, domain: AiDomain): AiMode {
  const requested = readMode(payload);
  if (requested) return requested;

  if (env.AI_DEFAULT_MODE && env.AI_DEFAULT_MODE !== "auto" && isAiMode(env.AI_DEFAULT_MODE)) {
    return env.AI_DEFAULT_MODE;
  }

  if (env.AI_MULTI_MODEL_ENABLED === "false") {
    return "normal";
  }

  const text = `${type} ${JSON.stringify(payload ?? {})}`.toLowerCase();
  if (/(debate|decisao|decisão|arquitetura|estrategia|estratégia)/.test(text)) return "debate";
  if (domain === "creative" || domain === "code" || domain === "media") return "evolutive";
  if (domain === "system" || domain === "research" || domain === "safety") return "comparative";
  return "normal";
}

function executorRolesFor(domain: AiDomain, mode: AiMode): AiRole[] {
  if (mode === "fast") return ["fast"];
  if (domain === "code") return mode === "normal" ? ["code"] : ["code", "general"];
  if (domain === "creative" || domain === "media") return mode === "normal" ? ["creative"] : ["creative", "general"];
  if (domain === "research") return mode === "normal" ? ["research"] : ["research", "general"];
  if (domain === "safety" || domain === "system") return mode === "normal" ? ["critic"] : ["critic", "general"];
  if (domain === "report") return mode === "normal" ? ["general"] : ["general", "research"];
  return mode === "normal" ? ["general"] : ["general", "creative", "critic"];
}

function criticRolesFor(domain: AiDomain, mode: AiMode): AiRole[] {
  if (mode === "fast") return [];
  if (mode === "normal") return domain === "creative" || domain === "media" ? ["styleCritic"] : ["critic"];
  if (domain === "creative" || domain === "media") return ["critic"];
  if (domain === "code") return ["critic"];
  if (domain === "safety") return ["safety"];
  return ["critic"];
}

function readMode(payload: unknown): AiMode | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const value = (payload as { ai_mode?: unknown; mode?: unknown }).ai_mode ?? (payload as { mode?: unknown }).mode;
  return isAiMode(value) ? value : null;
}

function isAiMode(value: unknown): value is AiMode {
  return value === "fast" || value === "normal" || value === "comparative" || value === "evolutive" || value === "debate";
}

function asObject(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function normalizeProviderOutput(output: Record<string, unknown>) {
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

async function runOllama(env: Env, system: string, payload: Record<string, unknown>) {
  const baseUrl = (env.OLLAMA_BASE_URL ?? "http://localhost:11434").replace(/\/$/, "");
  const domain = inferDomain(String(payload.job_type ?? ""), payload.payload ?? payload);
  const mode = inferMode(env, String(payload.job_type ?? ""), payload.payload ?? payload, domain);
  const model = modelForOllama(env, domain, mode);

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    signal: AbortSignal.timeout(60_000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: `${system} Responda em JSON valido.` },
        { role: "user", content: JSON.stringify(payload) },
      ],
      stream: false,
      format: "json",
    }),
  });

  const body = await response.json().catch(() => null) as {
    message?: { content?: string };
    error?: string;
  } | null;

  if (!response.ok || !body?.message?.content) {
    throw new Error(`Ollama failed: ${body?.error ?? response.statusText}`);
  }

  try {
    return normalizeProviderOutput(JSON.parse(body.message.content) as Record<string, unknown>);
  } catch {
    return { summary: body.message.content, items: [], next_actions: [], risk: "unknown", metadata: { provider: "ollama", model } };
  }
}

function modelForOllama(env: Env, domain: AiDomain, mode: AiMode) {
  if (domain === "code") return env.OLLAMA_CODE_MODEL ?? "qwen2.5-coder:14b";
  if (mode === "fast") return env.OLLAMA_FAST_MODEL ?? "qwen2.5-coder:7b";
  return env.OLLAMA_MODEL ?? "gemma4:latest";
}

async function runWorkersAi(env: Env, system: string, payload: Record<string, unknown>) {
  if (!env.AI) {
    throw new Error("Cloudflare Workers AI binding is not configured.");
  }

  const answer = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    prompt: [
      `${system} Responda em JSON valido.`,
      'Estrutura minima: {"summary":string,"items":array,"next_actions":array,"risk":string,"metadata":object}.',
      JSON.stringify(payload),
    ].join("\n\n"),
  }) as { response?: string } | string;

  const content = typeof answer === "string" ? answer : answer.response;

  if (!content) {
    throw new Error("Workers AI returned an empty response.");
  }

  try {
    return JSON.parse(extractJson(content));
  } catch {
    return { summary: content, items: [], next_actions: [], risk: "unknown", metadata: { provider: "workers-ai" } };
  }
}

function isProviderQuotaError(error: unknown) {
  const message = String(error instanceof Error ? error.message : error).toLowerCase();
  return error instanceof ProviderRequestError && (error.status === 402 || error.status === 429)
    || message.includes("quota")
    || message.includes("billing")
    || message.includes("insufficient credits")
    || message.includes("insufficient_quota");
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

function extractJson(value: string) {
  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");

  if (start >= 0 && end > start) {
    return value.slice(start, end + 1);
  }

  return value.trim();
}

function pickAgent(type: string, payload: Record<string, unknown> | null): AgentKey {
  const requested = String(payload?.agent_key ?? "");
  if (agentKeys.includes(requested as AgentKey)) return requested as AgentKey;

  const value = type.toLowerCase();
  if (value.includes("posting") || value.includes("postagem")) return "yomi";
  if (value.includes("report") || value.includes("relatorio")) return "maat";
  if (value.includes("sales") || value.includes("venda") || value.includes("campaign")) return "morax";
  if (value.includes("library") || value.includes("biblioteca") || value.includes("prompt")) return "hotei";
  if (value.includes("profile") || value.includes("perfil") || value.includes("tag")) return "gaia";
  if (value.includes("review") || value.includes("revisao") || value.includes("approve")) return "isis";
  if (value.includes("content") || value.includes("conteudo") || value.includes("script") || value.includes("caption")) return "hefesto";
  return "heimdall";
}

async function rpc<T>(env: Env, name: string, body: Record<string, unknown>) {
  const response = await supabaseFetch(env, `/rest/v1/rpc/${name}`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
}

async function insert(env: Env, table: string, body: Record<string, unknown>) {
  const response = await supabaseFetch(env, `/rest/v1/${table}`, {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(await response.text());
}

async function updateJob(env: Env, id: string, body: Record<string, unknown>) {
  const response = await supabaseFetch(env, `/rest/v1/ai_jobs?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(await response.text());
}

async function writeHealth(env: Env, status: string, message: string, metadata: Record<string, unknown>) {
  await insert(env, "health_logs", {
    source: "cloudflare_ai_runner",
    status,
    message,
    metadata,
  }).catch(() => undefined);
}

function supabaseFetch(env: Env, path: string, init: RequestInit) {
  return fetch(`${env.SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}
