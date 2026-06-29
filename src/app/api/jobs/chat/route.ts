import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/database";
import { rateLimitByIp } from "@/lib/rate-limit";
import { jsonNoStore, rejectUntrustedOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";

const chatJobSchema = z.object({
  message: z.string().trim().min(1, "message é obrigatória."),
  profileId: z.string().trim().min(1).optional(),
  conversationId: z.string().trim().min(1).optional(),
  context: z.record(z.string(), z.unknown()).optional(),
});

function isLocalDevMode() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.includes("localhost") || url.includes("127.0.0.1");
}

function buildJobPayload(input: z.infer<typeof chatJobSchema>): Json {
  const context = JSON.parse(
    JSON.stringify(input.context ?? { source: "chat-ui" }),
  ) as Json;

  return {
    message: input.message,
    conversationId: input.conversationId ?? null,
    context,
    source: "api/jobs/chat",
  };
}

export async function POST(request: Request) {
  const originError = rejectUntrustedOrigin(request);
  if (originError) {
    return originError;
  }

  const { allowed } = rateLimitByIp(request, 15, 60000);
  if (!allowed) {
    return jsonNoStore(
      { error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: "Body JSON inválido." }, { status: 400 });
  }

  const parsed = chatJobSchema.safeParse(body);
  if (!parsed.success) {
    return jsonNoStore(
      {
        error: "Payload inválido.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const jobId = crypto.randomUUID();
  const localDevMode = isLocalDevMode();

  try {
    if (localDevMode) {
      return jsonNoStore(
        {
          jobId,
          status: "pending",
        },
        { status: 202 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonNoStore({ error: "Não autenticado." }, { status: 401 });
    }

    const jobRecord: Database["public"]["Tables"]["ai_jobs"]["Insert"] = {
      id: jobId,
      user_id: user.id,
      profile_id: input.profileId ?? null,
      type: "chat",
      status: "pending",
      payload: buildJobPayload(input),
    };

    const { error } = await supabase.from("ai_jobs").insert(jobRecord);
    if (error) {
      throw error;
    }

    return jsonNoStore(
      {
        jobId,
        status: "pending",
      },
      { status: 202 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Falha ao criar job de chat.";
    return jsonNoStore({ error: message }, { status: 500 });
  }
}
