/**
 * YGGNAROK Dashboard Types
 * @module types/dashboard
 */

import type { JobStatus, Json } from '@/types/database';

export interface Job {
  id: string;
  profile_id: string | null;
  type: string;
  status: JobStatus;
  attempts: number;
  max_attempts: number;
  error_message: string | null;
  result: Json;
  created_at: string;
  completed_at: string | null;
}

export interface HealthLog {
  id: string;
  status: string;
  source: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DashboardCounts {
  pendingJobs: number;
  processingJobs: number;
  pendingDecisions: number;
  pendingMemories: number;
  alerts: number;
}

export interface Agent {
  key: string;
  name: string;
  role: string;
  risk_level: string;
  status: string;
  last_seen_at?: string;
}

export interface ProviderStatus {
  provider: string;
  status: string;
  latency_ms?: number;
  error_message?: string;
  models?: string[];
}

export interface Decision {
  id: string;
  decision_type: string;
  status: 'pending' | 'approved' | 'rejected';
  risk: string;
  authority: string;
  summary?: string;
  job_id?: string;
  created_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface Memory {
  id: string;
  title: string;
  body: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  created_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface Cost {
  id: string;
  provider: string;
  model: string;
  currency: string;
  estimated_cost: number;
  timestamp: string;
}

export interface MomongaCouncilOverview {
  counts: DashboardCounts;
  agents: Agent[];
  providerStatus: ProviderStatus[];
  decisions: Decision[];
  memories: Memory[];
  costs: Cost[];
  health: HealthLog[];
  automations: Array<{
    key: string;
    status: string;
    name?: string;
  }>;
  jobs: Job[];
}