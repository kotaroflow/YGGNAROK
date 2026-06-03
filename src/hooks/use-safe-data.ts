import { queryAll } from '@/server/data/dashboard';
import type { 
  Profile, 
  ContentItem, 
  LibraryItem, 
  ManualPostingItem, 
  Job, 
  AgentRun, 
  MediaAsset, 
  HealthLog, 
  AuditLog, 
  Role, 
  Permission, 
  DashboardCounts, 
  DashboardOverview, 
  MomongaCouncilOverview 
} from '@/types/dashboard';
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
} from '@/types/dashboard';

// Type-safe query wrapper functions
export async function getSafeProfiles(): Promise<Profile[]> {
  const data = await queryAll('profiles', 'id, name, slug, description, status, created_at');
  return safeMapToProfile(data);
}

export async function getSafeContentItems(): Promise<ContentItem[]> {
  const data = await queryAll('content', 'id, profile_id, title, content_type, status, platform, idea, caption, hashtags, scheduled_for, created_at');
  return safeMapToContentItem(data);
}

export async function getSafeLibraryItems(): Promise<LibraryItem[]> {
  const data = await queryAll('library', 'id, profile_id, type, title, body, status, created_at');
  return safeMapToLibraryItem(data);
}

export async function getSafeManualPostingItems(): Promise<ManualPostingItem[]> {
  const data = await queryAll('manual_posting_queue', 'id, profile_id, content_id, platform, status, caption_to_copy, hashtags_to_copy, planned_date, posted_at, post_url, created_at');
  return safeMapToManualPostingItem(data);
}

export async function getSafeJobs(): Promise<Job[]> {
  const data = await queryAll('ai_jobs', 'id, user_id, profile_id, type, status, attempts, max_attempts, error_message, result, payload, created_at, completed_at');
  return safeMapToJob(data);
}

export async function getSafeAgentRunsByJobId(jobId: string): Promise<AgentRun[]> {
  const data = await queryAll('agent_runs', 'id, job_id, user_id, profile_id, agent_key, module, input, output, status, error_message, started_at, completed_at, created_at', {
    filters: [{ column: 'job_id', operator: 'eq', value: jobId }]
  });
  return safeMapToAgentRun(data);
}

export async function getSafeMediaAssets(): Promise<MediaAsset[]> {
  const data = await queryAll('media_assets', 'id, asset_type, public_url, r2_key, mime_type, size_bytes, created_at, profile_id');
  return safeMapToMediaAsset(data);
}

export async function getSafeHealthLogs(): Promise<HealthLog[]> {
  const data = await queryAll('health_logs', 'id, source, status, message, metadata, created_at');
  return safeMapToHealthLog(data);
}

export async function getSafeAuditLogs(): Promise<AuditLog[]> {
  const data = await queryAll('audit_logs', 'id, user_id, profile_id, action, resource_type, resource_id, reason, created_at');
  return safeMapToAuditLog(data);
}

// Utility function for safe date conversion
export function safeDate(value: unknown): Date | null {
  if (!value) return null;
  try {
    return new Date(String(value));
  } catch {
    return null;
  }
}

// Utility function for safe string conversion
export function safeString(value: unknown, defaultValue = ''): string {
  return value ? String(value) : defaultValue;
}

// Utility function for safe number conversion
export function safeNumber(value: unknown, defaultValue = 0): number {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

// Re-export types
export type {
  Profile,
  ContentItem,
  LibraryItem,
  ManualPostingItem,
  Job,
  AgentRun,
  MediaAsset,
  HealthLog,
  AuditLog,
  Role,
  Permission,
  DashboardCounts,
  DashboardOverview,
  MomongaCouncilOverview
} from '@/types/dashboard';

// Re-export type guards
export {
  isProfile,
  isContentItem,
  isLibraryItem,
  isManualPostingItem,
  isJob,
  isAgentRun,
  isMediaAsset,
  isHealthLog,
  isAuditLog
} from '@/types/dashboard';