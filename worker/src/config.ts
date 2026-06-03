import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

export const workerConfig = {
  supabaseUrl: required("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  pollIntervalMs: Number(process.env.WORKER_POLL_INTERVAL_MS ?? 5000),
  zombieTimeoutMinutes: Number(process.env.WORKER_ZOMBIE_TIMEOUT_MINUTES ?? 15),
  ai: {
    provider: process.env.AI_PROVIDER ?? "ollama",
    ollamaEnabled: flag("ENABLE_OLLAMA", true),
    openAiEnabled: flag("ENABLE_OPENAI_GPT", false),
    openRouterEnabled: flag("ENABLE_OPENROUTER_FALLBACK", true),
    openClawEnabled: flag("ENABLE_OPENCLAW", true),
    mstyEnabled: flag("ENABLE_MSTY", true),
    multiModelEnabled: flag("ENABLE_MULTI_MODEL_GENERATION", process.env.AI_MULTI_MODEL_ENABLED !== "false"),
    multiAgentDebateEnabled: flag("ENABLE_MULTI_AGENT_DEBATE", true),
    supervisorSynthesisEnabled: flag("ENABLE_SUPERVISOR_SYNTHESIS", true),
    modelRouterEnabled: flag("ENABLE_MODEL_ROUTER", true),
    decisionCouncilEnabled: flag("ENABLE_DECISION_COUNCIL", true),
    memoryEnabled: flag("ENABLE_MEMORY", true),
    autoLearningEnabled: flag("ENABLE_AUTO_LEARNING", true),
    supervisedLearningEnabled: flag("ENABLE_SUPERVISED_LEARNING", true),
    costGuardEnabled: flag("ENABLE_COST_GUARD", true),
    auditLogsEnabled: flag("ENABLE_AUDIT_LOGS", true),
    killSwitchEnabled: flag("ENABLE_KILL_SWITCH", true),
    requireAdminApprovalForHighRisk: flag("REQUIRE_ADMIN_APPROVAL_FOR_HIGH_RISK", true),
    requireAdminApprovalForHighRiskMemory: flag("REQUIRE_ADMIN_APPROVAL_FOR_HIGH_RISK_MEMORY", true),
    freeFallbackOnly: process.env.AI_FREE_FALLBACK_ONLY === "true",
    defaultMode: process.env.AI_DEFAULT_MODE ?? "auto",
    maxModelsPerTask: boundedNumber("MAX_MODELS_PER_TASK", 5, 1, 8),
    maxDebateRounds: boundedNumber("MAX_DEBATE_ROUNDS", 3, 1, 5),
    maxAgentLoopDepth: boundedNumber("MAX_AGENT_LOOP_DEPTH", 5, 1, 10),
    maxAgentRetry: boundedNumber("MAX_AGENT_RETRY", 3, 0, 5),
    maxTaskExternalCost: process.env.MAX_TASK_EXTERNAL_AI_COST ?? "defined_by_admin",
    maxDailyExternalCost: process.env.MAX_DAILY_EXTERNAL_AI_COST ?? "defined_by_admin",
    openAiKey: process.env.OPENAI_API_KEY ?? "",
    openRouterKey: process.env.OPENROUTER_API_KEY ?? "",
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
    openClawUrl: process.env.OPENCLAW_URL ?? "http://localhost:3334",
    mstyUrl: process.env.MSTY_URL ?? "",
    models: {
      fast: process.env.AI_MODEL_FAST ?? "ollama:qwen2.5-coder:7b",
      general: process.env.AI_MODEL_GENERAL ?? "ollama:gemma4:latest",
      creative: process.env.AI_MODEL_CREATIVE ?? "ollama:gemma4:latest",
      alternative: process.env.AI_MODEL_ALTERNATIVE ?? "ollama:gemma4:latest",
      critic: process.env.AI_MODEL_CRITIC ?? "ollama:gemma4:latest",
      styleCritic: process.env.AI_MODEL_STYLE_CRITIC ?? "ollama:gemma4:latest",
      consolidator: process.env.AI_MODEL_CONSOLIDATOR ?? "ollama:gemma4:latest",
      code: process.env.AI_MODEL_CODE ?? "ollama:qwen2.5-coder:14b",
      safety: process.env.AI_MODEL_SAFETY ?? "ollama:gemma4:latest",
      research: process.env.AI_MODEL_RESEARCH ?? "ollama:gemma4:latest",
      premium: process.env.AI_MODEL_PREMIUM ?? "ollama:gemma4:31b-cloud",
    },
    embeddings: {
      model: process.env.AI_EMBEDDING_MODEL ?? "ollama:nomic-embed-text",
    },
  },
  r2: {
    accountId: process.env.R2_ACCOUNT_ID ?? "",
    bucketName: process.env.R2_BUCKET_NAME ?? "",
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL ?? "",
  },
};

function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required worker env: ${name}`);
  }

  return value;
}

function flag(name: string, fallback: boolean) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return value !== "false" && value !== "0";
}

function boundedNumber(name: string, fallback: number, min: number, max: number) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(value)));
}
