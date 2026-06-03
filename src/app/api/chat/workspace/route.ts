import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createConversation,
  createProject,
  listWorkspace,
  replaceMessages,
  updateConversation,
} from "@/server/chat/repository";
import { rateLimitByIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "development" && (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("example.supabase.co"))) {
      return NextResponse.json({ mode: "local" as const }, { status: 200 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ mode: "local" as const }, { status: 401 });
    }

    const workspace = await listWorkspace(user.id);
    if (!workspace) {
      return NextResponse.json({ mode: "local" as const }, { status: 401 });
    }

    return NextResponse.json({ mode: "remote" as const, ...workspace });
  } catch {
    return NextResponse.json({ mode: "local" as const }, { status: 401 });
  }
}

type ImportBody = {
  projects?: Array<{
    id: string;
    name: string;
    description?: string;
    path?: string;
    conversations?: Array<{ id: string; title: string; lastMessage?: string }>;
  }>;
  recents?: Array<{ id: string; title: string; pinned?: boolean }>;
  histories?: Record<string, Array<{ id: string; role: string; content: string }>>;
};

export async function POST(req: Request) {
  const { allowed } = rateLimitByIp(req, 10, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429 });
  }

  try {
    if (process.env.NODE_ENV === "development" && (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("example.supabase.co"))) {
      return NextResponse.json({ mode: "local" as const }, { status: 200 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ mode: "local" as const }, { status: 401 });
    }

    let body: ImportBody = {};
    try {
      body = (await req.json()) as ImportBody;
    } catch {
      body = {};
    }

    const idMap = new Map<string, string>();

    for (const project of body.projects ?? []) {
      const created = await createProject(user.id, {
        name: project.name,
        description: project.description,
        path_label: project.path,
      });
      if (created) idMap.set(project.id, created.id);

      for (const conv of project.conversations ?? []) {
        const row = await createConversation(user.id, {
          title: conv.title,
          project_id: created?.id ?? null,
        });
        if (row) idMap.set(conv.id, row.id);
      }
    }

    for (const recent of body.recents ?? []) {
      if (idMap.has(recent.id)) continue;
      const row = await createConversation(user.id, { title: recent.title });
      if (row) {
        idMap.set(recent.id, row.id);
        if (recent.pinned) {
          await updateConversation(user.id, row.id, { pinned: true });
        }
      }
    }

    for (const [localId, messages] of Object.entries(body.histories ?? {})) {
      const remoteId = idMap.get(localId) ?? localId;
      const normalized = messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));
      await replaceMessages(user.id, remoteId, normalized);
    }

    const workspace = await listWorkspace(user.id);
    return NextResponse.json({ mode: "remote" as const, ...workspace, idMap: Object.fromEntries(idMap) });
  } catch {
    return NextResponse.json({ mode: "local" as const }, { status: 401 });
  }
}
