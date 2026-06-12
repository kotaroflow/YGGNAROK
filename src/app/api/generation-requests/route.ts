import { routeHomeIntent } from "@/server/hermes/intent";
import { createLocalGenerationRequest, readLocalBunkerState } from "@/server/hermes/local-store";
import { isHermesAdmin } from "@/server/hermes/permissions";
import { getCurrentPermissionContext } from "@/server/permissions/context";

export const dynamic = "force-dynamic";

type LocalRecord = Record<string, unknown>;

function readString(input: LocalRecord, snakeKey: string, camelKey: string) {
  const value = input[snakeKey] ?? input[camelKey];
  return typeof value === "string" ? value : undefined;
}

function belongsToUser(item: LocalRecord, userId: string) {
  return item.userId === userId || item.user_id === userId;
}

function filterForUser(items: LocalRecord[], userId: string, admin: boolean) {
  return admin ? items : items.filter((item) => belongsToUser(item, userId));
}

export async function POST(req: Request) {
  const user = await getCurrentPermissionContext();
  if (!user) {
    return Response.json({ error: "Autenticacao necessaria." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body JSON invalido." }, { status: 400 });
  }

  const input = body && typeof body === "object" ? (body as LocalRecord) : {};
  const prompt = String(input.prompt ?? "").trim();

  if (!prompt) {
    return Response.json({ error: "prompt ausente." }, { status: 400 });
  }

  const admin = isHermesAdmin({ ...user, email: user.email ?? undefined });
  const requestedAutopilot = Boolean(input.autopilot_enabled ?? input.autopilotEnabled);

  if (requestedAutopilot && !admin) {
    return Response.json({ error: "Somente ADM pode acionar Autopilot." }, { status: 403 });
  }

  const intent = routeHomeIntent(prompt, admin);
  const contentType = readString(input, "content_type", "contentType") ?? intent.detectedType ?? "text";

  const created = await createLocalGenerationRequest({
    userId: user.userId,
    role: user.roles[0] ?? "USER",
    title: typeof input.title === "string" ? input.title : undefined,
    prompt,
    contentType,
    platform: typeof input.platform === "string" ? input.platform : undefined,
    autopilotEnabled: requestedAutopilot,
    intent: intent as unknown as LocalRecord,
  });

  return Response.json({
    id: created.generationRequest.id,
    status: created.generationRequest.status,
    campaign_mode: "auto",
    campaign_id: created.campaign ? created.campaign.id : null,
    content_id: created.contentItem.id,
    post_queue_id: created.queueItem.id,
    intent,
    safety: {
      autopilot_enabled: requestedAutopilot,
      high_risk_auto_publish_blocked: true,
      secrets_exposed: false,
    },
  });
}

export async function GET() {
  const user = await getCurrentPermissionContext();
  if (!user) {
    return Response.json({ error: "Autenticacao necessaria." }, { status: 401 });
  }

  const admin = isHermesAdmin({ ...user, email: user.email ?? undefined });
  const state = await readLocalBunkerState();

  return Response.json({
    source: "local_bunker_store",
    generation_requests: filterForUser(state.generation_requests, user.userId, admin),
    campaigns: filterForUser(state.campaigns, user.userId, admin),
    content_items: filterForUser(state.content_items, user.userId, admin),
    post_queue: filterForUser(state.post_queue, user.userId, admin),
  });
}

