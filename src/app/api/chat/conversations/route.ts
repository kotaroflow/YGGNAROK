import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createConversation,
  deleteConversation,
  updateConversation,
} from "@/server/chat/repository";
import { rateLimitByIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { allowed } = rateLimitByIp(req, 20, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json();
  const conversation = await createConversation(user.id, {
    id: body.id ? String(body.id) : undefined,
    title: body.title ? String(body.title) : undefined,
    project_id: body.project_id ? String(body.project_id) : null,
    model_id: body.model_id ? String(body.model_id) : undefined,
  });
  return NextResponse.json({ conversation });
}

export async function PATCH(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json();
  const conversation = await updateConversation(user.id, String(body.id), {
    title: body.title !== undefined ? String(body.title) : undefined,
    project_id: body.project_id !== undefined ? (body.project_id ? String(body.project_id) : null) : undefined,
    pinned: typeof body.pinned === "boolean" ? body.pinned : undefined,
    model_id: body.model_id !== undefined ? String(body.model_id) : undefined,
    last_message_preview:
      body.last_message_preview !== undefined ? String(body.last_message_preview) : undefined,
  });
  return NextResponse.json({ conversation });
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id ausente." }, { status: 400 });
  await deleteConversation(user.id, id);
  return NextResponse.json({ ok: true });
}
