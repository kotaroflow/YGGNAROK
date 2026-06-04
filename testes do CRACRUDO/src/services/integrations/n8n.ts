/**
 * n8n Service — workflow automation engine stubs.
 * Stub phase: logs payload, returns synthetic execution ID + success.
 */

import type { YggNode, User, N8nService, N8nPayload } from "@/types/yggnarok";
import { integrationConfig } from "./integrationConfig";

const workflows = {
  imageGeneration: "",
  videoProcessing: "",
  promptExecution: "",
  chatContinuation: "",
  campaignOrchestration: "",
  obsidianSync: "",
};

function buildPayload(node: YggNode, workflowType: string, user: User): N8nPayload {
  const cfg = integrationConfig.n8n;
  const vaultPath = `${cfg.callbackBaseUrl || "http://localhost:3000"}/api/n8n/webhook`;
  return {
    node: {
      id: node.id,
      type: node.type,
      data: node.data,
      metadata: node.metadata,
      connections: node.connections,
    },
    user: {
      id: user.id,
      role: user.role,
      vaultPath: vaultPath,
    },
    action: workflowType,
    timestamp: new Date().toISOString(),
    callbackUrl: vaultPath,
    targetVault: user.role === "admin" ? "admin" : "user",
    targetVaultPath: `${user.role === "admin" ? "AdminVault" : `UserVault/User_${user.id}`}/${node.type}`,
  };
}

async function sendToN8nImpl(
  node: YggNode,
  workflowType: string,
  _user: User
): Promise<{
  success: boolean;
  executionId: string;
  workflowId: string;
  message: string;
}> {
  const executionId = `stub-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  console.log(`[n8n STUB] Would dispatch to workflow: ${workflowType}`);
  console.log(`[n8n STUB] Payload:`, buildPayload(node, workflowType, _user));

  return {
    success: true,
    executionId,
    workflowId: workflowType,
    message: `⚡ Dispatched to n8n workflow "${workflowType}" (stub — configure webhook in Settings → Integrations)`,
  };
}

async function getExecutionStatusImpl(
  _executionId: string
): Promise<{ status: "running" | "completed" | "failed"; result?: unknown }> {
  return { status: "completed" };
}

async function handleWebhookImpl(_payload: unknown): Promise<void> {
  console.log("[n8n webhook received]", _payload);
}

export const n8nService: N8nService = {
  workflows,
  sendToN8n: sendToN8nImpl,
  getExecutionStatus: getExecutionStatusImpl,
  handleWebhook: handleWebhookImpl,
};
