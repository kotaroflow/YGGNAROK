import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateConversation, deleteConversation } from "@/server/chat/repository";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const conversation = await updateConversation(user.id, id, {
    title: body.title !== undefined ? String(body.title) : undefined,
    project_id: body.project_id !== undefined ? (body.project_id ? String(body.project_id) : null) : undefined,
    pinned: typeof body.pinned === "boolean" ? body.pinned : undefined,
    model_id: body.model_id !== undefined ? String(body.model_id) : undefined,
    last_message_preview: body.last_message_preview !== undefined ? String(body.last_message_preview) : undefined,
  });
  return NextResponse.json({ conversation });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  await deleteConversation(user.id, id);
  return NextResponse.json({ ok: true });
}
