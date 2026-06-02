import { workerConfig } from "../src/config";
import { supabaseAdmin } from "../src/supabase";
import type { Json } from "../../src/types/database";

type ProviderHealth = {
  provider: string;
  status: "online" | "offline" | "degraded" | "disabled" | "unknown";
  latencyMs: number | null;
  errorMessage: string | null;
  metadata?: Record<string, unknown>;
};

export async function refreshProviderHealth() {
  const checks = await Promise.allSettled([
    checkOpenAi(),
    checkOpenRouter(),
  ]);

  for (const check of checks) {
    if (check.status === "fulfilled") {
      await saveProviderHealth(check.value);
    }
  }
}

async function checkOpenAi(): Promise<ProviderHealth> {
  if (!workerConfig.ai.openAiEnabled) {
    return disabled("openai");
  }

  if (!workerConfig.ai.openAiKey) {
    return offline("openai", "OPENAI_API_KEY ausente.");
  }

  return timed("openai", async () => {
    const response = await fetch("https://api.openai.com/v1/models", {
      signal: AbortSignal.timeout(5000),
      headers: { Authorization: `Bearer ${workerConfig.ai.openAiKey}` },
    });
    if (!response.ok) throw new Error(response.statusText);
    return { key_configured: true };
  });
}

async function checkOpenRouter(): Promise<ProviderHealth> {
  if (!workerConfig.ai.openRouterEnabled) {
    return disabled("openrouter");
  }

  if (!workerConfig.ai.openRouterKey) {
    return offline("openrouter", "OPENROUTER_API_KEY ausente.");
  }

  return timed("openrouter", async () => {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      signal: AbortSignal.timeout(5000),
      headers: { Authorization: `Bearer ${workerConfig.ai.openRouterKey}` },
    });
    if (!response.ok) throw new Error(response.statusText);
    return { key_configured: true };
  });
}

async function timed(provider: string, fn: () => Promise<Record<string, unknown>>): Promise<ProviderHealth> {
  const startedAt = Date.now();

  try {
    const metadata = await fn();
    return {
      provider,
      status: "online",
      latencyMs: Date.now() - startedAt,
      errorMessage: null,
      metadata,
    };
  } catch (error) {
    return offline(provider, error instanceof Error ? error.message : String(error), Date.now() - startedAt);
  }
}

function disabled(provider: string): ProviderHealth {
  return { provider, status: "disabled", latencyMs: null, errorMessage: null };
}

function offline(provider: string, errorMessage: string, latencyMs: number | null = null): ProviderHealth {
  return { provider, status: "offline", latencyMs, errorMessage };
}

async function saveProviderHealth(health: ProviderHealth) {
   await supabaseAdmin.from("ai_provider_status").upsert({
     provider: health.provider,
     status: health.status,
     last_checked_at: new Date().toISOString(),
     latency_ms: health.latencyMs,
     error_message: health.errorMessage,
     metadata: (health.metadata ?? {}) as Json,
   });
 }
