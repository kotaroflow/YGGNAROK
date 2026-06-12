export const dynamic = "force-dynamic";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rateLimitByIp } from "@/lib/rate-limit";
import { handleHermesChatRequest } from "@/server/hermes/gateway";
import type { HermesUser } from "@/server/hermes/permissions";

function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export async function POST(req: Request) {
  const { allowed } = rateLimitByIp(req, 20, 60000);
  if (!allowed) {
    return Response.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429, headers: { "X-RateLimit-Remaining": "0", "Retry-After": "60" } });
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const isBunkerMode = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").includes("example.supabase.co");
  let activeUser: HermesUser | null = user;
  
  if (!activeUser && isBunkerMode) {
    // In local offline bunker mode, mock the master admin user
    activeUser = { email: "admin@yggnarok.local" };
  }

  if (!activeUser) {
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Body JSON invalido.", 400);
  }

  const bodyObject = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  return handleHermesChatRequest({ body: bodyObject, user: activeUser });
}

