import { createSupabaseServerClient } from "@/lib/supabase/server";

const LIST_LIMIT = 50;
const MEDIA_LIMIT = 40;
const OVERVIEW_LIMIT = 5;

export async function getDashboardCounts() {
  const supabase = await getOptionalSupabase();

  if (!supabase) {
    return { profiles: 0, pendingJobs: 0, manualPosts: 0, alerts: 0 };
  }

  const [profiles, pendingJobs, manualPosts, alerts] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("ai_jobs").select("id", { count: "exact", head: true }).in("status", ["pending", "processing"]),
    supabase.from("manual_posting_queue").select("id", { count: "exact", head: true }).in("status", ["waiting", "ready"]),
    supabase.from("health_logs" as never).select("id", { count: "exact", head: true }).in("status", ["warning", "error", "critical"]),
  ]);

  return {
    profiles: profiles.count ?? 0,
    pendingJobs: pendingJobs.count ?? 0,
    manualPosts: manualPosts.count ?? 0,
    alerts: alerts.count ?? 0,
  };
}

export async function getDashboardOverview() {
  const [counts, jobs, contents, media, manualPosts, health] = await Promise.all([
    getDashboardCounts(),
    getJobs(),
    getContentItems(),
    getMediaAssets(),
    getManualPostingItems(),
    getHealthLogs(),
  ]);

  return {
    counts,
    jobs: jobs.slice(0, OVERVIEW_LIMIT),
    contents: contents.slice(0, OVERVIEW_LIMIT),
    media: media.slice(0, 4),
    manualPosts: manualPosts.slice(0, OVERVIEW_LIMIT),
    health: health.slice(0, 4),
  };
}

export async function getProfiles() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("profiles")
    .select("id,name,slug,description,status,created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return data ?? [];
}

export async function getContentItems() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("content_items")
    .select("id,profile_id,title,content_type,status,platform,idea,caption,hashtags,scheduled_for,created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return data ?? [];
}

export async function getLibraryItems() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("library_items")
    .select("id,profile_id,type,title,body,status,created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return data ?? [];
}

export async function getManualPostingItems() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("manual_posting_queue")
    .select("id,profile_id,content_id,platform,status,caption_to_copy,hashtags_to_copy,planned_date,posted_at,post_url,created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return data ?? [];
}

export async function getJobs() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_jobs")
    .select("id,profile_id,type,status,attempts,max_attempts,error_message,result,created_at,completed_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return data ?? [];
}

export async function getJobById(id: string) {
  const supabase = await getOptionalSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from("ai_jobs")
    .select("id,profile_id,type,status,attempts,max_attempts,error_message,result,payload,created_at,started_at,completed_at")
    .eq("id", id)
    .single();

  return data;
}

export async function getAgentRunsByJobId(jobId: string) {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("agent_runs")
    .select("id, job_id, agent_key, module, input, output, status, error_message, started_at, completed_at, created_at")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  return (data ?? []) as Array<{
    id: string;
    job_id: string | null;
    agent_key: string;
    module: string;
    input: unknown;
    output: unknown;
    status: string;
    error_message: string | null;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
  }>;
}

export async function getMediaAssets() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("media_assets")
    .select("id, asset_type, public_url, r2_key, mime_type, size_bytes, created_at, profile_id")
    .order("created_at", { ascending: false })
    .limit(MEDIA_LIMIT);

  return data ?? [];
}

export async function getHealthLogs() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("health_logs")
    .select("id, source, status, message, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return (data ?? []) as Array<{
    id: string;
    source: string;
    status: string;
    message: string;
    metadata: unknown;
    created_at: string;
  }>;
}

export async function getAuditLogs() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("audit_logs")
    .select("id, user_id, profile_id, action, resource_type, resource_id, reason, created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return (data ?? []) as Array<{
    id: string;
    user_id: string | null;
    profile_id: string | null;
    action: string;
    resource_type: string | null;
    resource_id: string | null;
    reason: string | null;
    created_at: string;
  }>;
}

export async function getAgentRuns() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("agent_runs")
    .select("id, job_id, agent_key, module, status, error_message, started_at, completed_at, created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return (data ?? []) as Array<{
    id: string;
    job_id: string | null;
    agent_key: string;
    module: string;
    status: string;
    error_message: string | null;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
  }>;
}

export async function getMomongaCouncilOverview() {
  const [jobs, runs, audits, health, memories, agents, providers, decisions, automations, costs] = await Promise.all([
    getJobs(),
    getAgentRuns(),
    getAuditLogs(),
    getHealthLogs(),
    getAiLearningItems(),
    getCouncilAgents(),
    getProviderStatus(),
    getCouncilDecisions(),
    getAiAutomations(),
    getCostLedger(),
  ]);

  return {
    jobs,
    runs,
    audits,
    health,
    memories,
    agents,
    providerStatus: providers,
    decisions,
    automations,
    costs,
    counts: {
      pendingJobs: jobs.filter((job) => job.status === "pending").length,
      processingJobs: jobs.filter((job) => job.status === "processing").length,
      completedJobs: jobs.filter((job) => job.status === "completed").length,
      failedJobs: jobs.filter((job) => job.status === "failed").length,
      pendingMemories: memories.filter((memory) => memory.status === "pending").length,
      approvedMemories: memories.filter((memory) => memory.status === "active" || memory.status === "approved").length,
      pendingDecisions: decisions.filter((decision) => decision.status === "pending").length,
      alerts: health.filter((entry) => entry.status === "warning" || entry.status === "error" || entry.status === "critical").length,
    },
    providers: providers.length ? providers.map((provider) => ({ name: provider.provider, count: provider.status === "online" ? 1 : 0 })) : summarizeProviders(jobs),
  };
}

async function getAiLearningItems() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("library_items")
    .select("id,profile_id,type,title,body,status,metadata,created_at")
    .eq("type", "ai_learning")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return (data ?? []) as Array<{
    id: string;
    profile_id: string | null;
    type: string;
    title: string;
    body: string | null;
    status: string;
    metadata: unknown;
    created_at: string;
  }>;
}

async function getCouncilAgents() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_council_agents" as never)
    .select("key,name,role,status,risk_level,paused_reason,last_seen_at,provider_preference,config,created_at" as never)
    .order("key" as never);

  return (data ?? []) as Array<{
    key: string;
    name: string;
    role: string;
    status: string;
    risk_level: string;
    paused_reason: string | null;
    last_seen_at: string | null;
    provider_preference: unknown;
    config: unknown;
    created_at: string;
  }>;
}

async function getProviderStatus() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_provider_status" as never)
    .select("provider,status,last_checked_at,latency_ms,error_message,metadata" as never)
    .order("provider" as never);

  return (data ?? []) as Array<{
    provider: string;
    status: string;
    last_checked_at: string | null;
    latency_ms: number | null;
    error_message: string | null;
    metadata: unknown;
  }>;
}

async function getCouncilDecisions() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_council_decisions" as never)
    .select("id,job_id,decision_type,status,risk,authority,summary,payload,result,created_at,approved_at" as never)
    .order("created_at" as never, { ascending: false })
    .limit(LIST_LIMIT);

  return (data ?? []) as Array<{
    id: string;
    job_id: string | null;
    decision_type: string;
    status: string;
    risk: string;
    authority: string;
    summary: string;
    payload: unknown;
    result: unknown;
    created_at: string;
    approved_at: string | null;
  }>;
}

async function getAiAutomations() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_automations" as never)
    .select("key,name,status,interval_ms,last_run_at,next_run_at,metadata" as never)
    .order("key" as never);

  return (data ?? []) as Array<{
    key: string;
    name: string;
    status: string;
    interval_ms: number;
    last_run_at: string | null;
    next_run_at: string | null;
    metadata: unknown;
  }>;
}

async function getCostLedger() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_cost_ledger" as never)
    .select("id,job_id,provider,model,estimated_cost,currency,created_at" as never)
    .order("created_at" as never, { ascending: false })
    .limit(LIST_LIMIT);

  return (data ?? []) as Array<{
    id: string;
    job_id: string | null;
    provider: string;
    model: string | null;
    estimated_cost: number;
    currency: string;
    created_at: string;
  }>;
}

function summarizeProviders(jobs: Awaited<ReturnType<typeof getJobs>>) {
  const providers = new Map<string, number>();

  for (const job of jobs) {
    const result = job.result && typeof job.result === "object" && !Array.isArray(job.result) ? job.result as Record<string, unknown> : {};
    const metadata = result.metadata && typeof result.metadata === "object" && !Array.isArray(result.metadata) ? result.metadata as Record<string, unknown> : {};
    const orchestration = metadata.ai_orchestration && typeof metadata.ai_orchestration === "object" && !Array.isArray(metadata.ai_orchestration)
      ? metadata.ai_orchestration as Record<string, unknown>
      : {};
    const models = orchestration.models && typeof orchestration.models === "object" && !Array.isArray(orchestration.models)
      ? orchestration.models as Record<string, unknown>
      : {};

    for (const group of ["executors", "critics"]) {
      const entries = Array.isArray(models[group]) ? models[group] as Array<{ model?: unknown }> : [];
      for (const entry of entries) {
        const provider = String(entry.model ?? "unknown").split(":")[0] || "unknown";
        providers.set(provider, (providers.get(provider) ?? 0) + 1);
      }
    }
  }

  return Array.from(providers.entries()).map(([name, count]) => ({ name, count }));
}

export async function getRolesAndPermissions() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return { roles: [], permissions: [] };
  const [roles, permissions] = await Promise.all([
    supabase.from("roles").select("id, key, name, description, created_at").order("key"),
    supabase.from("permissions").select("id, key, module, description, created_at").order("module").order("key"),
  ]);

  return {
    roles: (roles.data ?? []) as Array<{
      id: string;
      key: string;
      name: string;
      description: string | null;
      created_at: string;
    }>,
    permissions: (permissions.data ?? []) as Array<{
      id: string;
      key: string;
      module: string;
      description: string | null;
      created_at: string;
    }>,
  };
}

async function getOptionalSupabase() {
  try {
    return await createSupabaseServerClient();
  } catch {
    return null;
  }
}
