import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

export const workerConfig = {
  supabaseUrl: required("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),
  pollIntervalMs: Number(process.env.WORKER_POLL_INTERVAL_MS ?? 5000),
  zombieTimeoutMinutes: Number(process.env.WORKER_ZOMBIE_TIMEOUT_MINUTES ?? 15),
  ai: {
    provider: process.env.AI_PROVIDER ?? "openrouter",
    openAiEnabled: flag("ENABLE_OPENAI_GPT", false),
    openRouterEnabled: flag("ENABLE_OPENROUTER_FALLBACK", true),
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
    models: {
      fast: process.env.AI_MODEL_FAST ?? "openrouter:openrouter/free",
      general: process.env.AI_MODEL_GENERAL ?? "openrouter:openrouter/free",
      creative: process.env.AI_MODEL_CREATIVE ?? "openrouter:openrouter/free",
      alternative: process.env.AI_MODEL_ALTERNATIVE ?? "openrouter:openrouter/free",
      critic: process.env.AI_MODEL_CRITIC ?? "openrouter:openrouter/free",
      styleCritic: process.env.AI_MODEL_STYLE_CRITIC ?? "openrouter:openrouter/free",
      consolidator: process.env.AI_MODEL_CONSOLIDATOR ?? "openrouter:openrouter/free",
      code: process.env.AI_MODEL_CODE ?? "openrouter:openrouter/free",
      safety: process.env.AI_MODEL_SAFETY ?? "openrouter:openrouter/free",
      research: process.env.AI_MODEL_RESEARCH ?? "openrouter:openrouter/free",
      premium: process.env.AI_MODEL_PREMIUM ?? "openrouter:openrouter/free",
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
