/**
 * Integration Configuration — currently disabled, ready for env wiring.
 */

import type { IntegrationConfig } from "@/types/yggnarok";

export const defaultIntegrationConfig: IntegrationConfig = {
  obsidian: {
    enabled: false,
    adminVaultPath: "",
    userVaultBasePath: "",
    apiUrl: "",
    apiKey: "",
  },
  n8n: {
    enabled: false,
    baseUrl: "",
    apiKey: "",
    webhooks: {
      imageGeneration: "",
      videoProcessing: "",
      promptExecution: "",
      chatContinuation: "",
      campaignOrchestration: "",
      obsidianSync: "",
    },
    callbackBaseUrl: "",
  },
};

function fromEnv(): IntegrationConfig {
  return {
    obsidian: {
      enabled: process.env.OBSIDIAN_ENABLED === "true",
      adminVaultPath: process.env.OBSIDIAN_ADMIN_VAULT_PATH || "",
      userVaultBasePath: process.env.OBSIDIAN_USER_VAULT_BASE_PATH || "",
      apiUrl: process.env.OBSIDIAN_API_URL || "",
      apiKey: process.env.OBSIDIAN_API_KEY || "",
    },
    n8n: {
      enabled: process.env.N8N_ENABLED === "true",
      baseUrl: process.env.N8N_BASE_URL || "",
      apiKey: process.env.N8N_API_KEY || "",
      webhooks: {
        imageGeneration: process.env.N8N_WEBHOOK_IMAGE_GENERATION || "",
        videoProcessing: process.env.N8N_WEBHOOK_VIDEO_PROCESSING || "",
        promptExecution: process.env.N8N_WEBHOOK_PROMPT_EXECUTION || "",
        chatContinuation: process.env.N8N_WEBHOOK_CHAT_CONTINUATION || "",
        campaignOrchestration: process.env.N8N_WEBHOOK_CAMPAIGN_ORCHESTRATION || "",
        obsidianSync: process.env.N8N_WEBHOOK_OBSIDIAN_SYNC || "",
      },
      callbackBaseUrl: process.env.N8N_CALLBACK_BASE_URL || "",
    },
  };
}

export const integrationConfig: IntegrationConfig = fromEnv();
