import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CHAT_SYSTEM_MESSAGE, type ChatMessage } from "@/lib/chat-storage";

export type ChatProjectRow = {
  id: string;
  name: string;
  description: string | null;
  path_label: string | null;
  created_at: string;
  updated_at: string;
};

export type ChatConversationRow = {
  id: string;
  project_id: string | null;
  title: string;
  last_message_preview: string | null;
  model_id: string | null;
  pinned: boolean;
  updated_at: string;
};

type LooseClient = {
  from: (table: string) => {
    select: (columns: string) => LooseQuery;
    insert: (values: object | object[]) => { select: (columns: string) => { single: () => Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }> } };
    update: (values: object) => LooseQuery;
    delete: () => LooseQuery;
    upsert: (values: object | object[], options?: { onConflict?: string }) => Promise<{ error: { message: string } | null }>;
  };
};

type LooseQuery = {
  eq: (column: string, value: string | boolean) => LooseQuery;
  order: (column: string, options?: { ascending?: boolean }) => LooseQuery;
  limit: (count: number) => LooseQuery;
  single: () => Promise<{ data: Record<string, unknown> | null; error: { message: string } | null }>;
  then: <T>(
    onfulfilled?: (value: { data: Array<Record<string, unknown>> | null; error: { message: string } | null }) => T,
  ) => Promise<T>;
};

async function client() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase: supabase as unknown as LooseClient, userId: user.id };
}

export async function listWorkspace(userId: string) {
  const ctx = await client();
  if (!ctx) return null;

  const { data: projects } = await ctx.supabase
    .from("chat_projects")
    .select("id,name,description,path_label,created_at,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  const { data: conversations } = await ctx.supabase
    .from("chat_conversations")
    .select("id,project_id,title,last_message_preview,model_id,pinned,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return {
    projects: (projects ?? []) as ChatProjectRow[],
    conversations: (conversations ?? []) as ChatConversationRow[],
  };
}

export async function createProject(userId: string, input: { name: string; description?: string; path_label?: string }) {
  const ctx = await client();
  if (!ctx) return null;

  const { data, error } = await ctx.supabase
    .from("chat_projects")
    .insert({
      user_id: userId,
      name: input.name,
      description: input.description ?? null,
      path_label: input.path_label ?? null,
    })
    .select("id,name,description,path_label,created_at,updated_at")
    .single();

  if (error) throw new Error(error.message);
  return data as ChatProjectRow;
}

export async function updateProject(
  userId: string,
  id: string,
  input: Partial<{ name: string; description: string; path_label: string }>,
) {
  const ctx = await client();
  if (!ctx) return null;

  const { data, error } = await ctx.supabase
    .from("chat_projects")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id,name,description,path_label,created_at,updated_at")
    .single();

  if (error) throw new Error(error.message);
  return data as ChatProjectRow;
}

export async function deleteProject(userId: string, id: string) {
  const ctx = await client();
  if (!ctx) return false;
  const { error } = await ctx.supabase.from("chat_projects").delete().eq("id", id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return true;
}

export async function createConversation(
  userId: string,
  input: { id?: string; title?: string; project_id?: string | null; model_id?: string },
) {
  const ctx = await client();
  if (!ctx) return null;

  const { data, error } = await ctx.supabase
    .from("chat_conversations")
    .insert({
      id: input.id,
      user_id: userId,
      project_id: input.project_id ?? null,
      title: input.title ?? "Nova conversa",
      model_id: input.model_id ?? null,
    })
    .select("id,project_id,title,last_message_preview,model_id,pinned,updated_at")
    .single();

  if (error) throw new Error(error.message);
  return data as ChatConversationRow;
}

export async function updateConversation(
  userId: string,
  id: string,
  input: Partial<{
    title: string;
    project_id: string | null;
    pinned: boolean;
    model_id: string;
    last_message_preview: string;
  }>,
) {
  const ctx = await client();
  if (!ctx) return null;

  const { data, error } = await ctx.supabase
    .from("chat_conversations")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id,project_id,title,last_message_preview,model_id,pinned,updated_at")
    .single();

  if (error) throw new Error(error.message);
  return data as ChatConversationRow;
}

export async function deleteConversation(userId: string, id: string) {
  const ctx = await client();
  if (!ctx) return false;
  await ctx.supabase.from("chat_messages").delete().eq("conversation_id", id).eq("user_id", userId);
  const { error } = await ctx.supabase.from("chat_conversations").delete().eq("id", id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return true;
}

export async function loadMessages(userId: string, conversationId: string): Promise<ChatMessage[]> {
  const ctx = await client();
  if (!ctx) return [CHAT_SYSTEM_MESSAGE];

  const { data, error } = await ctx.supabase
    .from("chat_messages")
    .select("id,role,content,created_at")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error || !data?.length) return [CHAT_SYSTEM_MESSAGE];

  return [
    CHAT_SYSTEM_MESSAGE,
    ...data.map((row) => ({
      id: String(row.id),
      role: row.role as ChatMessage["role"],
      content: String(row.content),
    })),
  ];
}

export async function replaceMessages(userId: string, conversationId: string, messages: ChatMessage[]) {
  const ctx = await client();
  if (!ctx) return false;

  await ctx.supabase.from("chat_messages").delete().eq("conversation_id", conversationId).eq("user_id", userId);

  const rows = messages
    .filter((m) => m.role !== "system" && m.content.trim())
    .map((m) => ({
      id: m.id.length === 36 ? m.id : undefined,
      conversation_id: conversationId,
      user_id: userId,
      role: m.role,
      content: m.content,
    }));

  if (rows.length) {
    const { error } = await ctx.supabase.from("chat_messages").insert(rows);
    if (error) throw new Error(error.message);
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (lastUser) {
    await ctx.supabase
      .from("chat_conversations")
      .update({
        last_message_preview: lastUser.content.slice(0, 160),
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId)
      .eq("user_id", userId);
  }

  return true;
}
