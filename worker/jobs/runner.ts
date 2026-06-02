import { runAgentJob } from "../agents/registry";
import { refreshProviderHealth } from "../agents/health";
import { maybeRunMediaGeneration } from "../media/generation";
import { writeHealthLog } from "../logs/health";
import { supabaseAdmin } from "../src/supabase";
import { workerConfig } from "../src/config";
import type { Json } from "../../src/types/database";

type ClaimedJob = {
  id: string;
  user_id: string;
  profile_id: string | null;
  type: string;
  payload: unknown;
  attempts: number;
  max_attempts: number;
};

type LaxRpc = {
  rpc: (name: string, params?: Record<string, unknown>) => {
    then: <T>(onfulfilled?: (value: { data: T | null; error: { message: string } | null }) => T | null) => Promise<T | null>;
  };
};

const supabaseLax = supabaseAdmin as unknown as LaxRpc;

export async function recoverZombieJobs() {
  const { data, error } = await supabaseLax.rpc("recover_zombie_ai_jobs", {
    p_timeout: `${workerConfig.zombieTimeoutMinutes} minutes`,
  });

  if (error) {
    await writeHealthLog("error", "Failed to recover zombie jobs", { error: error.message });
    return 0;
  }

  return Number(data ?? 0);
}

export async function claimNextJob() {
  const { data, error } = await supabaseLax.rpc("claim_next_ai_job");

  if (error) {
    await writeHealthLog("error", "Failed to claim next job", { error: error.message });
    return null;
  }

  return data as ClaimedJob | null;
}

export async function processJob(job: ClaimedJob) {
  const startedAt = new Date().toISOString();
  let runId: string | null = null;

  try {
    const automationState = await getAutomationState();
    if (automationState.killSwitch || automationState.safeModeBlocked(job)) {
      await blockJob(job, automationState.reason);
      return;
    }

    const learningContext = await getRecentAiLearning(job);
    const agentResult = await runAgentJob({
      type: job.type,
      payload: job.payload,
      learningContext,
    });
    agentResult.output = await maybeRunMediaGeneration(job.type, job.payload, agentResult.output);

    const { data: runData } = await supabaseAdmin.from("agent_runs").insert({
      job_id: job.id,
      user_id: job.user_id,
      profile_id: job.profile_id,
      agent_key: agentResult.agent_key,
      module: job.type,
      input: job.payload as Json,
      output: agentResult.output,
      status: "completed",
      started_at: startedAt,
      completed_at: new Date().toISOString(),
    }).select("id").single();

    runId = runData?.id ?? null;

    await supabaseAdmin
      .from("ai_jobs")
      .update({
        status: "completed",
        result: agentResult.output,
        completed_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", job.id);

    await writeAiCouncilAudit(job, agentResult.output, runId, "completed");
    await writeCouncilDecision(job, agentResult.output, runId);
    await writeCostLedger(job, agentResult.output);
    await saveAiLearning(job, agentResult.output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown worker error";
    const failedPermanently = job.attempts >= job.max_attempts;

    await supabaseAdmin.from("agent_runs").insert({
      job_id: job.id,
      user_id: job.user_id,
      profile_id: job.profile_id,
      agent_key: readAgentKey(job.payload),
      module: job.type,
      input: job.payload as Json,
      output: null,
      status: "failed",
      error_message: message,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
    });

    await supabaseAdmin
      .from("ai_jobs")
      .update({
        status: failedPermanently ? "failed" : "pending",
        error_message: message,
        completed_at: failedPermanently ? new Date().toISOString() : null,
      })
      .eq("id", job.id);

    await writeHealthLog(failedPermanently ? "error" : "warning", "Job processing failed", {
      job_id: job.id,
      agent_run_id: runId,
      attempts: job.attempts,
      max_attempts: job.max_attempts,
    });

    await writeAiCouncilAudit(job, { error: message } as Json, runId, "failed").catch(() => undefined);
  }
}

async function getRecentAiLearning(job: ClaimedJob): Promise<Json[]> {
  if (!job.profile_id) {
    return [];
  }

  const { data, error } = await supabaseAdmin
    .from("library_items")
    .select("title,body,metadata,created_at")
    .eq("profile_id", job.profile_id)
    .eq("type", "ai_learning")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !data) {
    return [];
  }

  return data.map((item) => toJson(item));
}

async function saveAiLearning(job: ClaimedJob, output: Json) {
  if (!job.profile_id || !output || typeof output !== "object" || Array.isArray(output)) {
    return;
  }

  const result = output as Record<string, unknown>;
  const resultMetadata = result.metadata && typeof result.metadata === "object" && !Array.isArray(result.metadata)
    ? result.metadata as Record<string, unknown>
    : null;
  const orchestration = resultMetadata?.ai_orchestration;
  const learning = orchestration && typeof orchestration === "object" && !Array.isArray(orchestration)
    ? (orchestration as Record<string, unknown>).learning
    : null;

  if (!learning || typeof learning !== "object" || Array.isArray(learning)) {
    return;
  }

  const summary = "summary" in learning ? String((learning as { summary?: unknown }).summary ?? "") : "";
  const memoryRisk = "risk" in learning ? String((learning as { risk?: unknown }).risk ?? "low").toLowerCase() : "low";

  if (!summary.trim()) {
    return;
  }

  const status = memoryRisk === "high" && workerConfig.ai.requireAdminApprovalForHighRiskMemory
    ? "pending"
    : memoryRisk === "medium" && workerConfig.ai.supervisedLearningEnabled
      ? "pending"
      : "active";

  const { data: libraryItem } = await supabaseAdmin.from("library_items").insert({
    profile_id: job.profile_id,
    created_by: job.user_id,
    type: "ai_learning",
    title: `Aprendizado IA - ${job.type}`,
    body: summary.slice(0, 4000),
    status,
    metadata: toJson({
      source: "ai_orchestration",
      job_id: job.id,
      job_type: job.type,
      risk: memoryRisk,
      scope: "profile",
      agent: "memory",
      model: "fast",
      origin: "YGGNAROK_AI_COUNCIL",
      learning,
    }),
  }).select("id").single();

  await writeMemoryCandidate(job, {
    libraryItemId: (libraryItem as { id?: string } | null)?.id ?? null,
    content: summary.slice(0, 4000),
    risk: memoryRisk,
    status: status === "active" ? "approved" : "pending",
    learning,
  });
}

async function writeAiCouncilAudit(job: ClaimedJob, output: Json, runId: string | null, status: "completed" | "failed") {
  if (!workerConfig.ai.auditLogsEnabled) {
    return;
  }

  const result = output && typeof output === "object" && !Array.isArray(output) ? output as Record<string, unknown> : {};
  const metadata = result.metadata && typeof result.metadata === "object" && !Array.isArray(result.metadata)
    ? result.metadata as Record<string, unknown>
    : {};
  const orchestration = metadata.ai_orchestration && typeof metadata.ai_orchestration === "object" && !Array.isArray(metadata.ai_orchestration)
    ? metadata.ai_orchestration as Record<string, unknown>
    : {};

  await supabaseAdmin.from("audit_logs").insert({
    user_id: job.user_id,
    profile_id: job.profile_id,
    action: status === "completed" ? "ai_council.completed" : "ai_council.failed",
    resource_type: "ai_job",
    resource_id: job.id,
    old_data: null,
    new_data: toJson({
      status,
      job_type: job.type,
      agent_run_id: runId,
      mode: orchestration.mode ?? null,
      domain: orchestration.domain ?? null,
      risk: result.risk ?? null,
      decision_authority: orchestration.decision_authority ?? null,
      models: orchestration.models ?? null,
      candidates: orchestration.candidates ?? null,
      critiques: orchestration.critiques ?? null,
      learning: orchestration.learning ?? null,
      memory_candidates: orchestration.memory_candidates ?? null,
      guardrails: orchestration.guardrails ?? null,
    }),
    reason: status === "completed"
      ? "YGGNAROK AI Council registrou geracao, debate, sintese, risco e aprendizado."
      : "YGGNAROK AI Council registrou falha para retentativa ou revisao.",
  });
}

async function writeCouncilDecision(job: ClaimedJob, output: Json, runId: string | null) {
  const result = output && typeof output === "object" && !Array.isArray(output) ? output as Record<string, unknown> : {};
  const metadata = result.metadata && typeof result.metadata === "object" && !Array.isArray(result.metadata)
    ? result.metadata as Record<string, unknown>
    : {};
  const orchestration = metadata.ai_orchestration && typeof metadata.ai_orchestration === "object" && !Array.isArray(metadata.ai_orchestration)
    ? metadata.ai_orchestration as Record<string, unknown>
    : {};
  const risk = String(result.risk ?? "low").toLowerCase();
  const status = risk === "high" ? "pending" : risk === "medium" ? "approved" : "executed";

  await supabaseAdmin.from("ai_council_decisions").insert({
    job_id: job.id,
    user_id: job.user_id,
    profile_id: job.profile_id,
    decision_type: job.type,
    status,
    risk,
     authority: (orchestration.decision_authority as string) ?? "council_auto",
    summary: String(result.summary ?? "").slice(0, 4000),
    payload: toJson({
      job_payload: job.payload,
      agent_run_id: runId,
      orchestration,
    }),
    result: toJson(result),
  });
}

async function writeMemoryCandidate(
  job: ClaimedJob,
  input: { libraryItemId: string | null; content: string; risk: string; status: string; learning: unknown },
) {
  await supabaseAdmin.from("ai_memory_candidates").insert({
    library_item_id: input.libraryItemId,
    job_id: job.id,
    user_id: job.user_id,
    profile_id: job.profile_id,
    content: input.content,
    origin: "ai_council",
    agent_key: "memory",
    model: workerConfig.ai.models.fast,
    scope: "profile",
    risk: input.risk,
    status: input.status,
    confidence: readConfidence(input.learning),
    justification: "Extraido pelo Memory Agent a partir de resultado, debate e sintese.",
    metadata: toJson({ learning: input.learning }),
  });
}

async function writeCostLedger(job: ClaimedJob, output: Json) {
  const result = output && typeof output === "object" && !Array.isArray(output) ? output as Record<string, unknown> : {};
  const metadata = result.metadata && typeof result.metadata === "object" && !Array.isArray(result.metadata)
    ? result.metadata as Record<string, unknown>
    : {};
  const orchestration = metadata.ai_orchestration && typeof metadata.ai_orchestration === "object" && !Array.isArray(metadata.ai_orchestration)
    ? metadata.ai_orchestration as Record<string, unknown>
    : {};
  const models = orchestration.models && typeof orchestration.models === "object" && !Array.isArray(orchestration.models)
    ? orchestration.models as Record<string, unknown>
    : {};

  const entries = [
    ...modelsFromGroup(models.executors),
    ...modelsFromGroup(models.critics),
    { model: typeof models.consolidator === "string" ? models.consolidator : null },
  ].filter((entry) => entry.model);

  for (const entry of entries) {
    const provider = String(entry.model).split(":")[0] || "unknown";
    await supabaseAdmin.from("ai_cost_ledger").insert({
      job_id: job.id,
      provider,
      model: entry.model,
      estimated_cost: 0,
      currency: "USD",
      metadata: toJson({ estimate_status: "pending_pricing_table" }),
    });
  }
}

async function getAutomationState() {
  const { data } = await supabaseAdmin
    .from("ai_automations")
    .select("key,status,metadata")
    .in("key", ["worker_loop", "kill_switch", "safe_mode", "chaos_mode"]);

  const rows = Array.isArray(data) ? data as Array<{ key?: string; status?: string; metadata?: unknown }> : [];
  const killSwitch = rows.some((row) => row.key === "kill_switch" && row.status === "active");
  const safeMode = rows.some((row) => row.key === "safe_mode" && row.status === "active");

  return {
    killSwitch,
    reason: killSwitch ? "Momonga Kill Switch ativo." : "Modo seguro bloqueou job de risco.",
    safeModeBlocked(job: ClaimedJob) {
      const text = `${job.type} ${JSON.stringify(job.payload ?? {})}`.toLowerCase();
      return safeMode && /(chaos|publish|publicar|delete|excluir|auth|permiss)/.test(text);
    },
  };
}

async function blockJob(job: ClaimedJob, reason: string) {
  await supabaseAdmin
    .from("ai_jobs")
    .update({
      status: "failed",
      error_message: reason,
      completed_at: new Date().toISOString(),
    })
    .eq("id", job.id);

  await writeHealthLog("warning", "AI Council blocked job", { job_id: job.id, reason });
}

function modelsFromGroup(value: unknown) {
  return Array.isArray(value) ? value.map((entry) => ({
    model: entry && typeof entry === "object" && "model" in entry ? String((entry as { model?: unknown }).model ?? "") : null,
  })) : [];
}

function readConfidence(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value) || !("confidence" in value)) return null;
  const confidence = Number((value as { confidence?: unknown }).confidence);
  return Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : null;
}

function readAgentKey(payload: unknown) {
  const value = payload && typeof payload === "object" && "agent_key" in payload
    ? String((payload as { agent_key?: unknown }).agent_key)
    : "heimdall";

  return value || "heimdall";
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value ?? null)) as Json;
}

export async function runWorkerOnce() {
  await recoverZombieJobs();
  await refreshProviderHealth().catch((error) => writeHealthLog("warning", "Provider health refresh failed", {
    error: error instanceof Error ? error.message : String(error),
  }));
  const job = await claimNextJob();

  if (!job) {
    return false;
  }

  await processJob(job);
  return true;
}
