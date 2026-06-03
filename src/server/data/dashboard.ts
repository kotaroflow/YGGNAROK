import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { 
  Profile, 
  Job, 
  AgentRun,
  HealthLog, 
  AuditLog, 
  LibraryItem, 
  ContentItem, 
  ManualPostingItem, 
  MediaAsset,
  Role,
  Permission,
  DashboardCounts,
  DashboardOverview,
  MomongaCouncilOverview 
} from "@/types/dashboard";
import {
  safeMapToProfile,
  safeMapToContentItem,
  safeMapToLibraryItem,
  safeMapToManualPostingItem,
  safeMapToJob,
  safeMapToAgentRun,
  safeMapToMediaAsset,
  safeMapToHealthLog,
  safeMapToAuditLog,
} from "@/types/dashboard";

const LIST_LIMIT = 50;
const MEDIA_LIMIT = 40;
const OVERVIEW_LIMIT = 5;

async function getOptionalSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (!url || url.includes("example.supabase.co") || url === "https://example.supabase.co") {
    return null;
  }
  try {
    return await createSupabaseServerClient();
  } catch {
    return null;
  }
}

export async function queryAll<T extends Record<string, unknown>>(
  table: string,
  select: string,
  opts?: {
    limit?: number;
    order?: { column: string; ascending?: boolean };
    filters?: Array<{ column: string; operator: string; value: string | string[] | boolean | number | null }>;
  },
): Promise<T[]> {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];

  
  let query = supabase.from(table).select(select);

  if (opts?.filters) {
    for (const f of opts.filters) {
      if (f.operator === "in") {
        query = query.in(f.column, f.value as string[]);
      } else if (f.operator === "not") {
        query = query.not(f.column, "is", null);
      } else {
        query = query.eq(f.column, f.value as string | boolean | number);
      }
    }
  }

  if (opts?.order) {
    query = query.order(opts.order.column, { ascending: opts.order.ascending ?? false });
  }

  if (opts?.limit) {
    query = query.limit(opts.limit);
  }

  const { data } = await query;
  return (data ?? []) as T[];
}

export async function getDashboardCounts() {
  const supabase = await getOptionalSupabase();
  if (!supabase) return { profiles: 0, pendingJobs: 0, manualPosts: 0, alerts: 0 };

  const [profiles, pendingJobs, manualPosts, alerts] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("ai_jobs").select("id", { count: "exact", head: true }).in("status", ["pending", "processing"]),
    supabase.from("manual_posting_queue").select("id", { count: "exact", head: true }).in("status", ["waiting", "ready"]),
    supabase.from("health_logs").select("id", { count: "exact", head: true }).in("status", ["warning", "error", "critical"]),
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
    jobs: jobs.filter(job => job.status === 'pending' || job.status === 'processing').slice(0, OVERVIEW_LIMIT),
    contents: contents.slice(0, OVERVIEW_LIMIT),
    media: media.slice(0, 4),
    manualPosts: manualPosts.filter(post => post.status === 'waiting').slice(0, OVERVIEW_LIMIT),
    health: health.slice(0, 4),
  };
}

export async function getProfiles(): Promise<Profile[]> {
  const data = await queryAll("profiles", "id,owner_id,name,slug,description,status,created_at,updated_at",
    { order: { column: "created_at", ascending: false }, limit: LIST_LIMIT },
  );
  return safeMapToProfile(data);
}

export async function getContentItems(): Promise<ContentItem[]> {
  const data = await queryAll("content_items", "id,profile_id,created_by,title,content_type,status,idea,script,caption,hashtags,platform,scheduled_for,published_at,created_at,updated_at",
    { order: { column: "created_at", ascending: false }, limit: LIST_LIMIT },
  );
  return safeMapToContentItem(data);
}

export async function getLibraryItems(): Promise<LibraryItem[]> {
  const data = await queryAll("library_items", "id,profile_id,created_by,type,title,body,status,metadata,deleted_at,created_at,updated_at",
    { order: { column: "created_at", ascending: false }, limit: LIST_LIMIT },
  );
  return safeMapToLibraryItem(data);
}

export async function getDeletedLibraryItems(): Promise<LibraryItem[]> {
  const data = await queryAll("library_items", "id,profile_id,created_by,type,title,body,status,metadata,deleted_at,created_at,updated_at",
    { order: { column: "deleted_at", ascending: false }, filters: [{ column: "deleted_at", operator: "not", value: null }] },
  );
  return safeMapToLibraryItem(data);
}

export async function getManualPostingItems(): Promise<ManualPostingItem[]> {
  const data = await queryAll("manual_posting_queue", "id,profile_id,content_id,platform,status,checklist,caption_to_copy,hashtags_to_copy,media_asset_id,planned_date,posted_at,posted_by,post_url,notes,created_at,updated_at",
    { order: { column: "created_at", ascending: false }, limit: LIST_LIMIT },
  );
  return safeMapToManualPostingItem(data);
}

export async function getJobs(): Promise<Job[]> {
  const data = await queryAll("ai_jobs", "id,user_id,profile_id,type,status,payload,result,error_message,attempts,max_attempts,started_at,completed_at,created_at,updated_at",
    { order: { column: "created_at", ascending: false }, limit: LIST_LIMIT },
  );
  return safeMapToJob(data);
}

export async function getAgentRunsByJobId(jobId: string): Promise<Array<Database["public"]["Tables"]["agent_runs"]["Row"]>> {
  return queryAll("agent_runs", "id, job_id, user_id, profile_id, agent_key, module, input, output, status, error_message, started_at, completed_at, created_at",
    { order: { column: "created_at", ascending: false }, filters: [{ column: "job_id", operator: "eq", value: jobId }] },
  );
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const data = await queryAll("media_assets", "id,user_id,profile_id,content_id,job_id,asset_type,storage_provider,r2_key,public_url,mime_type,size_bytes,metadata,created_at,updated_at",
    { order: { column: "created_at", ascending: false }, limit: MEDIA_LIMIT },
  );
  return safeMapToMediaAsset(data);
}

export async function getHealthLogs(): Promise<HealthLog[]> {
  const data = await queryAll("health_logs", "id,source,status,message,metadata,created_at",
    { order: { column: "created_at", ascending: false }, limit: LIST_LIMIT },
  );
  return safeMapToHealthLog(data);
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const data = await queryAll("audit_logs", "id,user_id,profile_id,action,resource_type,resource_id,reason,metadata,created_at",
    { order: { column: "created_at", ascending: false }, limit: LIST_LIMIT },
  );
  return safeMapToAuditLog(data);
}

export async function getAgentRuns(): Promise<AgentRun[]> {
  const data = await queryAll("agent_runs", "id,job_id,user_id,profile_id,agent_key,module,input,output,status,error_message,started_at,completed_at,created_at",
    { order: { column: "created_at", ascending: false }, limit: LIST_LIMIT },
  );
  return safeMapToAgentRun(data);
}

export async function getJobById(id: string): Promise<Job | null> {
  const supabase = await getOptionalSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from("ai_jobs")
    .select("id,user_id,profile_id,type,status,payload,result,error_message,attempts,max_attempts,started_at,completed_at,created_at,updated_at")
    .eq("id", id)
    .single();
  return data ? safeMapToJob([data])[0] : null;
}

export async function getMomongaCouncilOverview(): Promise<MomongaCouncilOverview> {
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

async function getAiLearningItems(): Promise<Array<LibraryItem & { type: "ai_learning" }>> {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("library_items")
    .select("id,profile_id,created_by,type,title,body,status,metadata,deleted_at,created_at,updated_at")
    .eq("type", "ai_learning")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return (data ?? []).map(item => ({
    ...item,
    metadata: item.metadata && typeof item.metadata === 'object' ? item.metadata as Record<string, unknown> : {},
  })) as Array<LibraryItem & { type: "ai_learning" }>;
}

async function getCouncilAgents(): Promise<Array<Database["public"]["Tables"]["ai_council_agents"]["Row"]>> {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_council_agents")
    .select("key,name,role,status,risk_level,paused_reason,last_seen_at,provider_preference,config,created_at")
    .order("key");

  return (data ?? []) as Array<Database["public"]["Tables"]["ai_council_agents"]["Row"]>;
}

async function getProviderStatus(): Promise<Array<Database["public"]["Tables"]["ai_provider_status"]["Row"]>> {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_provider_status")
    .select("provider,status,last_checked_at,latency_ms,error_message,metadata")
    .order("provider");

  return (data ?? []) as Array<Database["public"]["Tables"]["ai_provider_status"]["Row"]>;
}

async function getCouncilDecisions(): Promise<Array<Database["public"]["Tables"]["ai_council_decisions"]["Row"]>> {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_council_decisions")
    .select("id,job_id,user_id,profile_id,decision_type,status,risk,authority,summary,payload,result,approved_by,created_at,approved_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return (data ?? []) as Array<Database["public"]["Tables"]["ai_council_decisions"]["Row"]>;
}

async function getAiAutomations(): Promise<Array<Database["public"]["Tables"]["ai_automations"]["Row"]>> {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_automations")
    .select("key,name,status,interval_ms,last_run_at,next_run_at,metadata")
    .order("key");

  return (data ?? []) as Array<Database["public"]["Tables"]["ai_automations"]["Row"]>;
}

async function getCostLedger(): Promise<Array<Database["public"]["Tables"]["ai_cost_ledger"]["Row"]>> {
  const supabase = await getOptionalSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("ai_cost_ledger")
    .select("id,job_id,provider,model,estimated_cost,currency,metadata,created_at")
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  return (data ?? []) as Array<Database["public"]["Tables"]["ai_cost_ledger"]["Row"]>;
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
