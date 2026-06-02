"use server";

import { createJobSchema } from "@/lib/validators/schemas";
import { runFreeCouncilTask } from "@/server/ai-council/free-runtime";
import { assertPermission } from "@/server/permissions/assert";
import type { Json } from "@/types/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAiJob(formData: FormData) {
  const payloadText = String(formData.get("payload") || "{}");
  let parsedPayload: Record<string, unknown>;
  try {
    parsedPayload = JSON.parse(payloadText);
  } catch {
    parsedPayload = {};
  }
  const input = createJobSchema.parse({
    profileId: formData.get("profileId") || undefined,
    type: formData.get("type"),
    payload: parsedPayload,
  });
  const { supabase, user } = await assertPermission("ai_jobs.create");

  const { error } = await supabase
    .from("ai_jobs")
    .insert({
      user_id: user.id,
      profile_id: input.profileId,
      type: input.type,
      payload: input.payload as Json,
      status: "pending",
      max_attempts: 3,
    });

  if (error) {
    throw new Error("Nao foi possivel criar o job.");
  }

  revalidatePath("/jobs");
  revalidatePath("/jobs-em-andamento");
}

export async function createGuidedAiJob(formData: FormData) {
  const payload = {
    source: String(formData.get("source") || "guided"),
    agent_key: String(formData.get("agentKey") || "hefesto"),
    agent_name: String(formData.get("agentName") || "").trim() || undefined,
    agent_instructions: String(formData.get("agentInstructions") || "").trim() || undefined,
    output_format: String(formData.get("outputFormat") || "").trim() || undefined,
    ai_mode: String(formData.get("aiMode") || "fast"),
    brief: String(formData.get("brief") || ""),
    content_id: String(formData.get("contentId") || "") || undefined,
    library_item_id: String(formData.get("libraryItemId") || "") || undefined,
    posting_queue_id: String(formData.get("postingQueueId") || "") || undefined,
    platform: String(formData.get("platform") || "") || undefined,
  };
  const input = createJobSchema.parse({
    profileId: formData.get("profileId") || undefined,
    type: formData.get("type") || "content.prepare",
    payload,
  });
  const { supabase, user } = await assertPermission("ai_jobs.create");
  const councilJob = await runFreeCouncilTask({
    taskType: input.type,
    mode: normalizeCouncilMode(payload.ai_mode),
    prompt: buildGuidedPrompt(payload),
  });
  const result = councilJobToResult(councilJob);

  const { data, error } = await supabase
    .from("ai_jobs")
    .insert({
      user_id: user.id,
      profile_id: input.profileId,
      type: input.type,
      payload: input.payload as Json,
      status: councilJob.status === "completed" ? "completed" : "failed",
      result: result ?? null,
      error_message: councilJob.errorMessage ?? null,
      completed_at: new Date().toISOString(),
      max_attempts: 3,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error("Nao foi possivel criar o job de IA.");
  }

  await supabase.from("agent_runs").insert({
    job_id: data.id,
    user_id: user.id,
    profile_id: input.profileId,
    agent_key: payload.agent_key,
    module: input.type,
    input: input.payload as Json,
    output: result,
    status: councilJob.status,
    error_message: councilJob.errorMessage ?? null,
    started_at: councilJob.createdAt,
    completed_at: new Date().toISOString(),
  });

  revalidatePath("/jobs");
  revalidatePath("/jobs-em-andamento");
  redirect(`/jobs/${data.id}`);
}

export async function createAiJobAndReturnId(formData: FormData) {
  const payloadText = String(formData.get("payload") || "{}");
  let parsedPayload: Record<string, unknown>;
  try {
    parsedPayload = JSON.parse(payloadText);
  } catch {
    parsedPayload = {};
  }
  const input = createJobSchema.parse({
    profileId: formData.get("profileId") || undefined,
    type: formData.get("type"),
    payload: parsedPayload,
  });
  const { supabase, user } = await assertPermission("ai_jobs.create");

  const { data, error } = await supabase
    .from("ai_jobs")
    .insert({
      user_id: user.id,
      profile_id: input.profileId,
      type: input.type,
      payload: input.payload as Json,
      status: "pending",
      max_attempts: 3,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error("Nao foi possivel criar o job.");
  }

  return data.id;
}

function normalizeCouncilMode(value: string): "fast" | "deep" | "chaos" | "council_decision" {
  if (value === "deep" || value === "chaos" || value === "council_decision") return value;
  return "fast";
}

function buildGuidedPrompt(payload: {
  agent_key: string;
  agent_name?: string;
  agent_instructions?: string;
  output_format?: string;
  brief: string;
  platform?: string;
  source: string;
}) {
  return [
    `Agente escolhido: ${payload.agent_name || payload.agent_key}.`,
    payload.agent_instructions ? `Molde do agente: ${payload.agent_instructions}` : "",
    payload.output_format ? `Formato desejado: ${payload.output_format}` : "Formato desejado: entregue conteudo pronto, variacoes, critica e proximas acoes.",
    payload.platform ? `Plataforma: ${payload.platform}` : "",
    `Brief: ${payload.brief}`,
  ].filter(Boolean).join("\n");
}

function councilJobToResult(job: Awaited<ReturnType<typeof runFreeCouncilTask>>): Json {
  return {
    summary: job.final,
    items: [
      ...job.candidates.map((candidate) => `${candidate.agent}: ${candidate.summary}`),
      ...job.critiques.map((critique) => `${critique.agent}: ${critique.summary}`),
    ].slice(0, 8),
    next_actions: job.memory.map((memory) => memory.content).slice(0, 5),
    risk: job.risk,
    metadata: {
      ai_orchestration: {
        architecture: "YGGNAROK_FREE_AI_COUNCIL",
        provider: "openrouter",
        mode: job.mode,
        status: job.status,
        decision_authority: job.risk === "high" ? "momonga_admin_required" : "council_auto",
        executor_roles: job.candidates.map((candidate) => candidate.agent),
        critic_roles: job.critiques.map((critique) => critique.agent),
        models: {
          executors: job.candidates.map((candidate) => ({ role: candidate.agent, model: candidate.model })),
          critics: job.critiques.map((critique) => ({ role: critique.agent, model: critique.model })),
          consolidator: job.providers.at(-1)?.model ?? null,
        },
      },
      free_council_job_id: job.id,
      providers: job.providers,
      media: job.media,
    },
  } as Json;
}
