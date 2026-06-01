import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";

export type FreeCouncilJob = {
  id: string;
  taskType: string;
  mode: "fast" | "deep" | "chaos" | "council_decision";
  prompt: string;
  status: "completed" | "failed";
  risk: "low" | "medium" | "high";
  final: string;
  candidates: CouncilMessage[];
  critiques: CouncilMessage[];
  memory: CouncilMemory[];
  media: CouncilMedia | null;
  providers: Array<{ provider: string; model: string; status: string }>;
  createdAt: string;
  errorMessage?: string;
};

type CouncilMessage = {
  agent: string;
  provider: string;
  model: string;
  summary: string;
  items: string[];
  risk: "low" | "medium" | "high";
};

type CouncilMemory = {
  content: string;
  risk: "low" | "medium" | "high";
  status: "approved" | "pending";
  confidence: number;
};

type CouncilMedia = {
  type: "image" | "audio" | "video" | "audiovisual";
  status: "queued" | "pending" | "offline";
  prompt: string;
  provider: string;
  message: string;
};

const runtimeDir = process.env.YGGNAROK_RUNTIME_DIR
  || (process.env.VERCEL ? "/tmp/yggnarok-runtime" : path.join(process.cwd(), ".yggnarok-runtime"));
const storePath = path.join(runtimeDir, "ai-council-jobs.json");

export async function runFreeCouncilTask(input: {
  taskType: string;
  mode: "fast" | "deep" | "chaos" | "council_decision";
  prompt: string;
}) {
  const startedAt = new Date().toISOString();
  const roles = rolesForMode(input.mode);

  try {
    const candidates = await Promise.all(roles.executors.map((agent) => runAgent(agent, input)));
    const critiques = await Promise.all(roles.critics.map((agent) => runCritic(agent, input, candidates)));
    const supervisor = input.mode === "fast" && candidates[0]
      ? { ...candidates[0], agent: "Supervisor Agent", summary: candidates[0].summary }
      : await runSupervisor(input, candidates, critiques);
    const risk = highestRisk([supervisor, ...candidates, ...critiques]);
    const memory = extractLocalMemory(input, supervisor, critiques, risk);
    const media = await maybeQueueMedia(input, supervisor.summary);
    const providers = [...candidates, ...critiques, supervisor].map((entry) => ({
      provider: entry.provider,
      model: entry.model,
      status: "ok",
    }));

    const job: FreeCouncilJob = {
      id: randomUUID(),
      taskType: input.taskType,
      mode: input.mode,
      prompt: input.prompt,
      status: "completed",
      risk,
      final: supervisor.summary,
      candidates,
      critiques,
      memory,
      media,
      providers,
      createdAt: startedAt,
    };

    await saveJob(job);
    return job;
  } catch (error) {
    const job: FreeCouncilJob = {
      id: randomUUID(),
      taskType: input.taskType,
      mode: input.mode,
      prompt: input.prompt,
      status: "failed",
      risk: "medium",
      final: "O Conselho de IAs falhou antes da sintese final.",
      candidates: [],
      critiques: [],
      memory: [],
      media: null,
      providers: [],
      createdAt: startedAt,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
    await saveJob(job);
    return job;
  }
}

export async function getFreeCouncilJobs() {
  const persisted = await readPersistedJobs();

  if (persisted.length) {
    return persisted;
  }

  return readJobs();
}

async function runAgent(agent: string, input: { taskType: string; mode: string; prompt: string }): Promise<CouncilMessage> {
  const system = [
    `Voce e o ${agent} do YGGNAROK AI Council.`,
    "Responda apenas JSON com summary, items e risk.",
    "Risk deve ser low, medium ou high.",
  ].join(" ");
  return runCompletion(agent, system, JSON.stringify(input), input.mode === "chaos" && agent === "Strategy Agent");
}

async function runCritic(agent: string, input: { taskType: string; mode: string; prompt: string }, candidates: CouncilMessage[]) {
  const system = [
    `Voce e o ${agent} do YGGNAROK AI Council.`,
    "Critique candidatos, ache falhas, riscos, repeticao e melhorias.",
    "Responda apenas JSON com summary, items e risk.",
  ].join(" ");
  return runCompletion(agent, system, JSON.stringify({ input, candidates }), input.mode === "chaos" || input.mode === "council_decision");
}

async function runSupervisor(input: { taskType: string; mode: string; prompt: string }, candidates: CouncilMessage[], critiques: CouncilMessage[]) {
  const system = [
    "Voce e o Supervisor Agent do YGGNAROK AI Council.",
    "Resolva conflitos, consolide a resposta final, decida risco e gere sintese pronta para uso.",
    "Responda apenas JSON com summary, items e risk.",
  ].join(" ");
  return runCompletion("Supervisor Agent", system, JSON.stringify({ input, candidates, critiques }), input.mode === "chaos" || input.mode === "council_decision");
}

async function runCompletion(agent: string, system: string, user: string, preferExternal: boolean): Promise<CouncilMessage> {
  const externalModel = selectFreeModel(agent, preferExternal);
  const canUseOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
  const runnerResult = await tryAiRunner(agent, system, user);

  if (runnerResult) {
    return runnerResult;
  }

  if (!canUseOpenRouter) {
    throw new Error("OPENROUTER_API_KEY ausente. Configure a chave para usar as IAs free integradas do YGGNAROK.");
  }

  return tryOpenRouter(agent, system, user, externalModel);
}

async function tryOpenRouter(agent: string, system: string, user: string, externalModel: string) {
  let lastError = "";

  for (const model of freeModelFallbacks(externalModel)) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(45_000),
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "YGGNAROK Free AI Council",
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    const body = await response.json().catch(() => null) as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } } | null;
    if (response.ok && body?.choices?.[0]?.message?.content) {
      return normalizeMessage(agent, "openrouter", model, body.choices[0].message.content);
    }

    lastError = body?.error?.message ?? response.statusText;
  }

  throw new Error(`OpenRouter free nao respondeu para ${agent}. ${lastError}`);
}

async function tryAiRunner(agent: string, system: string, user: string) {
  const runnerUrl = process.env.AI_RUNNER_URL;
  const runnerToken = process.env.AI_RUNNER_TOKEN;

  if (!runnerUrl || !runnerToken) {
    return null;
  }

  try {
    const response = await fetch(`${runnerUrl.replace(/\/$/, "")}/complete`, {
      method: "POST",
      signal: AbortSignal.timeout(45_000),
      headers: {
        Authorization: `Bearer ${runnerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent,
        system,
        payload: {
          user,
        },
      }),
    });
    const body = await response.json().catch(() => null) as {
      ok?: boolean;
      provider?: string;
      model?: string;
      output?: Record<string, unknown>;
    } | null;

    if (!response.ok || !body?.ok || !body.output) {
      return null;
    }

    return normalizeMessage(agent, body.provider ?? "workers-ai", body.model ?? "@cf/meta/llama-3.1-8b-instruct", JSON.stringify(body.output));
  } catch {
    return null;
  }
}

function selectFreeModel(agent: string, preferExternal: boolean) {
  const lower = agent.toLowerCase();
  const configured = lower.includes("critic") || lower.includes("safety")
    ? process.env.AI_MODEL_CRITIC
    : lower.includes("strategy")
      ? process.env.AI_MODEL_CREATIVE
      : preferExternal
        ? process.env.AI_MODEL_GENERAL
        : process.env.AI_MODEL_FAST;

  return stripOpenRouterPrefix(configured || "openrouter:openrouter/free");
}

function freeModelFallbacks(preferredModel: string) {
  const preferred = normalizeFreeModel(preferredModel);
  return unique([
    preferred,
    "openrouter/free",
  ]);
}

function stripOpenRouterPrefix(value: string) {
  return value.startsWith("openrouter:") ? value.slice("openrouter:".length) : value;
}

function normalizeFreeModel(value: string) {
  const model = stripOpenRouterPrefix(value.trim()) || "openrouter/free";
  return model === "openrouter/free" || model.endsWith(":free") ? model : "openrouter/free";
}

function unique(values: string[]) {
  return values.filter((value, index) => value && values.indexOf(value) === index);
}

function normalizeMessage(agent: string, provider: string, model: string, raw: string): CouncilMessage {
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    parsed = { summary: raw, items: [], risk: "medium" };
  }

  return {
    agent,
    provider,
    model,
    summary: String(parsed.summary ?? parsed.text ?? raw).slice(0, 4000),
    items: Array.isArray(parsed.items) ? parsed.items.map((item) => typeof item === "string" ? item : JSON.stringify(item)).slice(0, 8) : [],
    risk: normalizeRisk(parsed.risk),
  };
}

function rolesForMode(mode: string) {
  if (mode === "fast") {
    return { executors: ["Creator Agent"], critics: [] };
  }
  if (mode === "chaos") {
    return {
      executors: ["Creator Agent", "Strategy Agent", "Consistency Agent"],
      critics: ["Critic Agent", "Safety/Governance Agent", "Memory Agent"],
    };
  }
  if (mode === "council_decision") {
    return { executors: ["Strategy Agent", "Consistency Agent"], critics: ["Safety/Governance Agent", "Critic Agent"] };
  }
  return { executors: ["Creator Agent", "Strategy Agent"], critics: ["Critic Agent", "Consistency Agent", "Safety/Governance Agent"] };
}

async function maybeQueueMedia(input: { taskType: string; prompt: string }, supervisorSummary: string): Promise<CouncilMedia | null> {
  const text = `${input.taskType} ${input.prompt}`.toLowerCase();
  const type = text.includes("video") ? "video" : text.includes("audio") || text.includes("voz") ? "audio" : text.includes("imagem") || text.includes("image") ? "image" : null;
  if (!type) return null;

  const prompt = supervisorSummary || input.prompt;
  if (type !== "image") {
    return { type, status: "pending", prompt, provider: "cloud_media_provider", message: "Plano audiovisual salvo; provedor cloud ainda nao configurado." };
  }

  return { type: "image", status: "pending", prompt, provider: "cloud_media_provider", message: "Prompt visual salvo; provedor cloud de imagem ainda nao configurado." };
}

function extractLocalMemory(input: { taskType: string; mode: string }, supervisor: CouncilMessage, critiques: CouncilMessage[], risk: "low" | "medium" | "high") {
  return [{
    content: `Padrao aprovado para ${input.taskType}/${input.mode}: ${supervisor.summary.slice(0, 600)}`,
    risk,
    status: risk === "high" ? "pending" as const : "approved" as const,
    confidence: critiques.length ? 0.74 : 0.62,
  }];
}

function highestRisk(messages: Array<{ risk: "low" | "medium" | "high" }>) {
  if (messages.some((message) => message.risk === "high")) return "high";
  if (messages.some((message) => message.risk === "medium")) return "medium";
  return "low";
}

function normalizeRisk(value: unknown): "low" | "medium" | "high" {
  const text = String(value ?? "").toLowerCase();
  if (text.includes("high")) return "high";
  if (text.includes("medium")) return "medium";
  return "low";
}

async function readJobs(): Promise<FreeCouncilJob[]> {
  try {
    const text = await readFile(storePath, "utf8");
    return JSON.parse(text) as FreeCouncilJob[];
  } catch {
    return [];
  }
}

async function saveJob(job: FreeCouncilJob) {
  const jobs = await readJobs();
  jobs.unshift(job);
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(jobs.slice(0, 50), null, 2), "utf8");
  await savePersistedJob(job);
}

async function readPersistedJobs(): Promise<FreeCouncilJob[]> {
  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("ai_council_decisions" as never)
      .select("payload, created_at")
      .eq("decision_type", "free_council")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      return [];
    }

    return data
      .map((row) => (row as { payload?: { free_job?: FreeCouncilJob } }).payload?.free_job)
      .filter(Boolean) as FreeCouncilJob[];
  } catch {
    return [];
  }
}

async function savePersistedJob(job: FreeCouncilJob) {
  try {
    const supabase = createSupabaseServiceClient();
    await supabase.from("ai_council_decisions" as never).insert({
      decision_type: "free_council",
      status: job.status === "completed" ? "executed" : "blocked",
      risk: job.risk,
      authority: job.risk === "high" ? "momonga_admin_required" : "council_auto",
      summary: job.final,
      payload: {
        free_job: job,
      },
      result: {
        final: job.final,
        providers: job.providers,
        media: job.media,
      },
    } as never);
  } catch {
    // File history remains the fallback when database persistence is unavailable.
  }
}
