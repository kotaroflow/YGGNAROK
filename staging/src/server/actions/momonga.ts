"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { assertPermission } from "@/server/permissions/assert";
import type { Json } from "@/types/database";

export async function approveDecision(formData: FormData) {
  const id = requiredId(formData);
  const { user } = await assertPermission("admin.access");
  const admin = createSupabaseServiceClient();

  await admin.from("ai_council_decisions" as never).update({
    status: "approved",
    approved_by: user.id,
    approved_at: new Date().toISOString(),
  } as never).eq("id" as never, id as never);

  await audit(user.id, "ai_council.decision.approved", "ai_council_decision", id);
  revalidateMomonga();
}

export async function rejectDecision(formData: FormData) {
  const id = requiredId(formData);
  const { user } = await assertPermission("admin.access");
  const admin = createSupabaseServiceClient();

  await admin.from("ai_council_decisions" as never).update({
    status: "rejected",
    approved_by: user.id,
    approved_at: new Date().toISOString(),
  } as never).eq("id" as never, id as never);

  await audit(user.id, "ai_council.decision.rejected", "ai_council_decision", id);
  revalidateMomonga();
}

export async function pauseAgent(formData: FormData) {
  const key = requiredKey(formData);
  const { user } = await assertPermission("admin.access");
  const admin = createSupabaseServiceClient();

  await admin.from("ai_council_agents" as never).update({
    status: "paused",
    paused_reason: String(formData.get("reason") || "Pausado pelo Momonga."),
  } as never).eq("key" as never, key as never);

  await audit(user.id, "ai_council.agent.paused", "ai_council_agent", key);
  revalidateMomonga();
}

export async function reactivateAgent(formData: FormData) {
  const key = requiredKey(formData);
  const { user } = await assertPermission("admin.access");
  const admin = createSupabaseServiceClient();

  await admin.from("ai_council_agents" as never).update({
    status: "active",
    paused_reason: null,
    last_seen_at: new Date().toISOString(),
  } as never).eq("key" as never, key as never);

  await audit(user.id, "ai_council.agent.reactivated", "ai_council_agent", key);
  revalidateMomonga();
}

export async function approveMemory(formData: FormData) {
  const id = requiredId(formData);
  const { user } = await assertPermission("admin.access");
  const admin = createSupabaseServiceClient();

  const { data } = await admin.from("ai_memory_candidates" as never)
    .select("library_item_id" as never)
    .eq("id" as never, id as never)
    .single();
  const libraryItemId = (data as { library_item_id?: string | null } | null)?.library_item_id;

  await admin.from("ai_memory_candidates" as never).update({ status: "approved" } as never).eq("id" as never, id as never);
  if (libraryItemId) {
    await admin.from("library_items").update({ status: "active" }).eq("id", libraryItemId);
  }

  await audit(user.id, "ai_council.memory.approved", "ai_memory_candidate", id);
  revalidateMomonga();
}

export async function rejectMemory(formData: FormData) {
  const id = requiredId(formData);
  const { user } = await assertPermission("admin.access");
  const admin = createSupabaseServiceClient();

  const { data } = await admin.from("ai_memory_candidates" as never)
    .select("library_item_id" as never)
    .eq("id" as never, id as never)
    .single();
  const libraryItemId = (data as { library_item_id?: string | null } | null)?.library_item_id;

  await admin.from("ai_memory_candidates" as never).update({ status: "rejected" } as never).eq("id" as never, id as never);
  if (libraryItemId) {
    await admin.from("library_items").update({ status: "archived" }).eq("id", libraryItemId);
  }

  await audit(user.id, "ai_council.memory.rejected", "ai_memory_candidate", id);
  revalidateMomonga();
}

export async function clearQueue() {
  const { user } = await assertPermission("admin.access");
  const admin = createSupabaseServiceClient();

  await admin.from("ai_jobs").update({
    status: "failed",
    error_message: "Fila limpa pelo Momonga.",
    completed_at: new Date().toISOString(),
  }).in("status", ["pending", "processing"]);

  await audit(user.id, "ai_council.queue.cleared", "ai_jobs", "active_queue");
  revalidateMomonga();
}

export async function disableChaos() {
  const { user } = await assertPermission("admin.access");
  await upsertAutomation("chaos_mode", "Chaos Mode", "paused", { disabled_by: user.id });
  await audit(user.id, "ai_council.chaos.disabled", "ai_automation", "chaos_mode");
  revalidateMomonga();
}

export async function activateSafeMode() {
  const { user } = await assertPermission("admin.access");
  await upsertAutomation("safe_mode", "Safe Mode", "active", { activated_by: user.id });
  await audit(user.id, "ai_council.safe_mode.active", "ai_automation", "safe_mode");
  revalidateMomonga();
}

export async function killSwitch() {
  const { user } = await assertPermission("admin.access");
  await upsertAutomation("kill_switch", "Global Kill Switch", "active", { activated_by: user.id, activated_at: new Date().toISOString() });
  await audit(user.id, "ai_council.kill_switch.active", "ai_automation", "kill_switch");
  revalidateMomonga();
}

export async function releaseKillSwitch() {
  const { user } = await assertPermission("admin.access");
  await upsertAutomation("kill_switch", "Global Kill Switch", "paused", { released_by: user.id, released_at: new Date().toISOString() });
  await audit(user.id, "ai_council.kill_switch.released", "ai_automation", "kill_switch");
  revalidateMomonga();
}

async function upsertAutomation(key: string, name: string, status: string, metadata: Json) {
  const admin = createSupabaseServiceClient();
  await admin.from("ai_automations" as never).upsert({
    key,
    name,
    status,
    metadata,
  } as never);
}

async function audit(userId: string, action: string, resourceType: string, resourceId: string) {
  const admin = createSupabaseServiceClient();
  await admin.from("audit_logs").insert({
    user_id: userId,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    reason: "momonga_control_panel",
  });
}

function requiredId(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("ID ausente.");
  return id;
}

function requiredKey(formData: FormData) {
  const key = String(formData.get("key") || "");
  if (!key) throw new Error("Chave ausente.");
  return key;
}

function revalidateMomonga() {
  revalidatePath("/momonga");
  revalidatePath("/jobs");
  revalidatePath("/audit-logs");
}
