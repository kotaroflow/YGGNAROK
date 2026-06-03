/**
 * YGGNAROK Creation Nexus — Core Types
 * @module types/yggnarok
 */

export type YggNodeType =
  | "image"
  | "video"
  | "prompt"
  | "chat"
  | "campaign"
  | "project"
  | "reference"
  | "idea";

export type ConnectionType =
  | "related_to"
  | "derived_from"
  | "inspires"
  | "depends_on"
  | "contains";

export interface YggNode {
  id: string;
  type: YggNodeType;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  zIndex: number;
  data: Record<string, unknown>;
  connections: Array<{
    targetId: string;
    connectionType: ConnectionType;
  }>;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    tags: string[];
    vaultPath?: string;
    n8nWorkflowId?: string;
    n8nExecutionId?: string;
  };
}

export interface YggEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: ConnectionType;
}

export interface CanvasState {
  nodes: YggNode[];
  edges: YggEdge[];
  selectedNodeId: string | null;
  scale: number;
  pan: { x: number; y: number };
  connectingFromId: string | null;
}

export interface CanvasViewport {
  scale: number;
  pan: { x: number; y: number };
}

export interface User {
  id: string;
  role: "admin" | "user";
  email?: string;
}

export interface ObsidianService {
  resolveVault(node: YggNode, user: User): "admin" | "user";
  buildMarkdown(node: YggNode): string;
  buildVaultPath(node: YggNode, user: User): string;
  sendToObsidian(
    node: YggNode,
    user: User
  ): Promise<{ success: boolean; vaultPath: string; message: string }>;
  pullFromObsidian(
    path: string,
    vault: "admin" | "user"
  ): Promise<YggNode | null>;
}

export interface N8nService {
  workflows: {
    imageGeneration: string;
    videoProcessing: string;
    promptExecution: string;
    chatContinuation: string;
    campaignOrchestration: string;
    obsidianSync: string;
  };
  sendToN8n(
    node: YggNode,
    workflowType: string,
    user: User
  ): Promise<{
    success: boolean;
    executionId: string;
    workflowId: string;
    message: string;
  }>;
  getExecutionStatus(
    executionId: string
  ): Promise<{ status: "running" | "completed" | "failed"; result?: unknown }>;
  handleWebhook(payload: unknown): Promise<void>;
}

export interface IntegrationConfig {
  obsidian: {
    enabled: boolean;
    adminVaultPath: string;
    userVaultBasePath: string;
    apiUrl: string;
    apiKey: string;
  };
  n8n: {
    enabled: boolean;
    baseUrl: string;
    apiKey: string;
    webhooks: {
      imageGeneration: string;
      videoProcessing: string;
      promptExecution: string;
      chatContinuation: string;
      campaignOrchestration: string;
      obsidianSync: string;
    };
    callbackBaseUrl: string;
  };
}

export interface N8nPayload {
  node: {
    id: string;
    type: string;
    data: Record<string, unknown>;
    metadata: YggNode["metadata"];
    connections: YggNode["connections"];
  };
  user: {
    id: string;
    role: "admin" | "user";
    vaultPath: string;
  };
  action: string;
  timestamp: string;
  callbackUrl: string;
  targetVault: "admin" | "user";
  targetVaultPath: string;
}
