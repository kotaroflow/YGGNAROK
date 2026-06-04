import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createProject, deleteProject, updateProject } from "@/server/chat/repository";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json();
  const project = await createProject(user.id, {
    name: String(body.name ?? ""),
    description: body.description ? String(body.description) : undefined,
    path_label: body.path_label ? String(body.path_label) : undefined,
  });
  return NextResponse.json({ project });
}

export async function PATCH(req: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json();
  const project = await updateProject(user.id, String(body.id), {
    name: body.name ? String(body.name) : undefined,
    description: body.description !== undefined ? String(body.description) : undefined,
    path_label: body.path_label !== undefined ? String(body.path_label) : undefined,
  });
  return NextResponse.json({ project });
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
  await deleteProject(user.id, id);
  return NextResponse.json({ ok: true });
}
