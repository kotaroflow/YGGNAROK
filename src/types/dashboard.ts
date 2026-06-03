// Central type definitions for YGGNAROK Dashboard Data
export interface Profile {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  profile_id: string;
  created_by: string;
  title: string;
  content_type: string;
  status: string;
  idea: string | null;
  script: string | null;
  caption: string | null;
  hashtags: string[] | null;
  platform: string | null;
  scheduled_for: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LibraryItem {
  id: string;
  profile_id: string;
  created_by: string;
  type: string;
  title: string;
  body: string | null;
  status: string;
  metadata: Record<string, unknown>;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ManualPostingItem {
  id: string;
  profile_id: string;
  content_id: string;
  platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'tiktok';
  status: 'waiting' | 'ready' | 'posted' | 'skipped' | 'needs_fix';
  caption_to_copy: string;
  hashtags_to_copy: string[];
  planned_date: string | null;
  posted_at: string | null;
  post_url: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  profile_id: string;
  type: string;
  status: 'pending' | 'running' | 'processing' | 'completed' | 'failed' | 'cancelled';
  attempts: number;
  max_attempts: number;
  error_message: string | null;
  result: unknown;
  payload: unknown;
  created_at: string;
  completed_at: string | null;
}

export interface AgentRun {
  id: string;
  job_id: string | null;
  user_id: string;
  profile_id: string | null;
  agent_key: string;
  module: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  status: string;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  user_id: string;
  profile_id: string | null;
  content_id: string | null;
  job_id: string | null;
  asset_type: string;
  storage_provider: string;
  r2_key: string;
  public_url: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface HealthLog {
  id: string;
  source: string;
  status: string;
  message: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  profile_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  reason: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Role {
  id: string;
  key: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Permission {
  id: string;
  key: string;
  module: string;
  description: string | null;
  created_at: string;
}

export interface DashboardCounts {
  profiles: number;
  pendingJobs: number;
  manualPosts: number;
  alerts: number;
}

export interface DashboardOverview {
  counts: DashboardCounts;
  jobs: Job[];
  contents: ContentItem[];
  media: MediaAsset[];
  manualPosts: ManualPostingItem[];
  health: HealthLog[];
}

export interface MomongaCouncilOverview {
  jobs: Job[];
  runs: AgentRun[];
  audits: AuditLog[];
  health: HealthLog[];
  memories: Array<LibraryItem & { type: "ai_learning" }>;
  agents: Array<Record<string, unknown>>;
  providerStatus: Array<Record<string, unknown>>;
  decisions: Array<Record<string, unknown>>;
  automations: Array<Record<string, unknown>>;
  costs: Array<Record<string, unknown>>;
  counts: {
    pendingJobs: number;
    processingJobs: number;
    completedJobs: number;
    failedJobs: number;
    pendingMemories: number;
    approvedMemories: number;
    pendingDecisions: number;
    alerts: number;
  };
  providers: Array<{ name: string; count: number }>;
}

// Type guards for safe type checking
export function isProfile(data: unknown): data is Profile {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'slug' in data &&
    'description' in data &&
    'status' in data &&
    'created_at' in data
  );
}

export function isContentItem(data: unknown): data is ContentItem {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'profile_id' in data &&
    'title' in data &&
    'content_type' in data &&
    'status' in data &&
    'created_at' in data
  );
}

export function isLibraryItem(data: unknown): data is LibraryItem {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'profile_id' in data &&
    'type' in data &&
    'title' in data &&
    'status' in data &&
    'created_at' in data
  );
}

export function isManualPostingItem(data: unknown): data is ManualPostingItem {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'profile_id' in data &&
    'content_id' in data &&
    'platform' in data &&
    'status' in data &&
    'created_at' in data
  );
}

export function isJob(data: unknown): data is Job {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'profile_id' in data &&
    'type' in data &&
    'status' in data &&
    'attempts' in data &&
    'max_attempts' in data &&
    'error_message' in data &&
    'result' in data &&
    'payload' in data &&
    'created_at' in data &&
    'completed_at' in data
  );
}

export function isAgentRun(data: unknown): data is AgentRun {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'job_id' in data &&
    'user_id' in data &&
    'agent_key' in data &&
    'module' in data &&
    'input' in data &&
    'output' in data &&
    'status' in data &&
    'error_message' in data &&
    'created_at' in data
  );
}

export function isMediaAsset(data: unknown): data is MediaAsset {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'asset_type' in data &&
    'r2_key' in data &&
    'created_at' in data
  );
}

export function isHealthLog(data: unknown): data is HealthLog {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'source' in data &&
    'status' in data &&
    'message' in data &&
    'created_at' in data
  );
}

export function isAuditLog(data: unknown): data is AuditLog {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'user_id' in data &&
    'profile_id' in data &&
    'action' in data &&
    'created_at' in data
  );
}

// Safe type conversion functions
export function safeMapToProfile(data: unknown[]): Profile[] {
  return data
    .filter(isProfile)
    .map(item => ({
      ...item,
      id: String(item.id),
      name: String(item.name),
      slug: String(item.slug),
      description: item.description ? String(item.description) : null,
      status: String(item.status),
      created_at: String(item.created_at),
      updated_at: String(item.updated_at),
    }));
}

export function safeMapToContentItem(data: unknown[]): ContentItem[] {
  return data
    .filter(isContentItem)
    .map(item => ({
      ...item,
      id: String(item.id),
      profile_id: String(item.profile_id),
      created_by: String(item.created_by),
      title: String(item.title),
      content_type: String(item.content_type),
      status: String(item.status),
      idea: item.idea ? String(item.idea) : null,
      script: item.script ? String(item.script) : null,
      caption: item.caption ? String(item.caption) : null,
      hashtags: Array.isArray(item.hashtags) ? item.hashtags as string[] : null,
      platform: item.platform ? String(item.platform) : null,
      scheduled_for: item.scheduled_for ? String(item.scheduled_for) : null,
      published_at: item.published_at ? String(item.published_at) : null,
      created_at: String(item.created_at),
      updated_at: String(item.updated_at),
    }));
}

export function safeMapToLibraryItem(data: unknown[]): LibraryItem[] {
  return data
    .filter(isLibraryItem)
    .map(item => ({
      ...item,
      id: String(item.id),
      profile_id: String(item.profile_id),
      created_by: String(item.created_by),
      type: String(item.type),
      title: String(item.title),
      body: item.body ? String(item.body) : null,
      status: String(item.status),
      metadata: typeof item.metadata === 'object' && item.metadata !== null ? item.metadata : {},
      deleted_at: item.deleted_at ? String(item.deleted_at) : null,
      created_at: String(item.created_at),
      updated_at: String(item.updated_at),
    }));
}

export function safeMapToManualPostingItem(data: unknown[]): ManualPostingItem[] {
  return data
    .filter(isManualPostingItem)
    .map(item => ({
      ...item,
      id: String(item.id),
      profile_id: String(item.profile_id),
      content_id: String(item.content_id),
      platform: item.platform === 'instagram' || item.platform === 'linkedin' || item.platform === 'twitter' || item.platform === 'facebook' || item.platform === 'tiktok' ? item.platform : 'instagram',
      status: item.status === 'waiting' || item.status === 'ready' || item.status === 'posted' || item.status === 'skipped' || item.status === 'needs_fix' ? item.status : 'waiting',
      caption_to_copy: String(item.caption_to_copy || ''),
      hashtags_to_copy: Array.isArray(item.hashtags_to_copy) ? item.hashtags_to_copy : [],
      planned_date: item.planned_date ? String(item.planned_date) : null,
      posted_at: item.posted_at ? String(item.posted_at) : null,
      post_url: item.post_url ? String(item.post_url) : null,
      created_at: String(item.created_at),
    }));
}

export function safeMapToJob(data: unknown[]): Job[] {
  return data
    .filter(isJob)
    .map(item => ({
      ...item,
      id: String(item.id),
      profile_id: String(item.profile_id),
      type: String(item.type),
      status: item.status === 'pending' || item.status === 'running' || item.status === 'processing' || item.status === 'completed' || item.status === 'failed' || item.status === 'cancelled' ? item.status : 'pending',
      attempts: Number(item.attempts),
      max_attempts: Number(item.max_attempts),
      error_message: item.error_message ? String(item.error_message) : null,
      result: item.result,
      payload: item.payload,
      created_at: String(item.created_at),
      completed_at: item.completed_at ? String(item.completed_at) : null,
    }));
}

export function safeMapToAgentRun(data: unknown[]): AgentRun[] {
  return data
    .filter(isAgentRun)
    .map(item => ({
      ...item,
      id: String(item.id),
      job_id: item.job_id ? String(item.job_id) : null,
      user_id: String(item.user_id),
      profile_id: item.profile_id ? String(item.profile_id) : null,
      agent_key: String(item.agent_key),
      module: String(item.module),
      input: typeof item.input === 'object' && item.input !== null ? item.input : {},
      output: typeof item.output === 'object' && item.output !== null ? item.output : {},
      status: String(item.status),
      error_message: item.error_message ? String(item.error_message) : null,
      started_at: item.started_at ? String(item.started_at) : null,
      completed_at: item.completed_at ? String(item.completed_at) : null,
      created_at: String(item.created_at),
    }));
}

export function safeMapToMediaAsset(data: unknown[]): MediaAsset[] {
  return data
    .filter(isMediaAsset)
    .map(item => ({
      ...item,
      id: String(item.id),
      user_id: String(item.user_id),
      profile_id: item.profile_id ? String(item.profile_id) : null,
      content_id: item.content_id ? String(item.content_id) : null,
      job_id: item.job_id ? String(item.job_id) : null,
      asset_type: String(item.asset_type),
      storage_provider: String(item.storage_provider),
      r2_key: String(item.r2_key),
      public_url: item.public_url ? String(item.public_url) : null,
      mime_type: item.mime_type ? String(item.mime_type) : null,
      size_bytes: item.size_bytes ? Number(item.size_bytes) : null,
      metadata: typeof item.metadata === 'object' && item.metadata !== null ? item.metadata : {},
      created_at: String(item.created_at),
      updated_at: String(item.updated_at),
    }));
}

export function safeMapToHealthLog(data: unknown[]): HealthLog[] {
  return data
    .filter(isHealthLog)
    .map(item => ({
      ...item,
      id: String(item.id),
      source: String(item.source),
      status: String(item.status),
      message: String(item.message),
      metadata: typeof item.metadata === 'object' && item.metadata !== null ? item.metadata : {},
      created_at: String(item.created_at),
    }));
}

export function safeMapToAuditLog(data: unknown[]): AuditLog[] {
  return data
    .filter(isAuditLog)
    .map(item => ({
      ...item,
      id: String(item.id),
      user_id: item.user_id ? String(item.user_id) : null,
      profile_id: item.profile_id ? String(item.profile_id) : null,
      action: String(item.action),
      resource_type: item.resource_type ? String(item.resource_type) : null,
      resource_id: item.resource_id ? String(item.resource_id) : null,
      reason: item.reason ? String(item.reason) : null,
      metadata: typeof item.metadata === 'object' && item.metadata !== null ? item.metadata : {},
      created_at: String(item.created_at),
    }));
}