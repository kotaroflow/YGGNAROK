import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import { CHAT_SYSTEM_MESSAGE, type ChatMessage } from "@/lib/chat-storage";

export type ChatProjectRow = Database["public"]["Tables"]["chat_projects"]["Row"];
export type ChatConversationRow = Database["public"]["Tables"]["chat_conversations"]["Row"];

async function client() {
  try {
    return await createSupabaseServerClient();
  } catch {
    throw new Error("Falha ao conectar ao banco de dados.");
  }
}


export async function listWorkspace(userId: string) {
  const supabase = await client();

  const { data: projects } = await supabase
    .from("chat_projects")
    .select("id,name,description,path_label,created_at,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  const { data: conversations } = await supabase
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
  const supabase = await client();

  const { data, error } = await supabase
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
  return data;
}

export async function updateProject(
  userId: string,
  id: string,
  input: Partial<{ name: string; description: string; path_label: string }>,
) {
  const supabase = await client();

  const { data, error } = await supabase
    .from("chat_projects")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id,name,description,path_label,created_at,updated_at")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProject(userId: string, id: string) {
  const supabase = await client();
  const { error } = await supabase.from("chat_projects").delete().eq("id", id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return true;
}

export async function createConversation(
  userId: string,
  input: { id?: string; title?: string; project_id?: string | null; model_id?: string },
) {
  const supabase = await client();

  const { data, error } = await supabase
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
  return data;
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
  const supabase = await client();

  const { data, error } = await supabase
    .from("chat_conversations")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id,project_id,title,last_message_preview,model_id,pinned,updated_at")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteConversation(userId: string, id: string) {
  const supabase = await client();
  await supabase.from("chat_messages").delete().eq("conversation_id", id).eq("user_id", userId);
  const { error } = await supabase.from("chat_conversations").delete().eq("id", id).eq("user_id", userId);
  if (error) throw new Error(error.message);
  return true;
}

export async function loadMessages(userId: string, conversationId: string): Promise<ChatMessage[]> {
  const supabase = await client();

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id,role,content,created_at")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error || !data?.length) return [CHAT_SYSTEM_MESSAGE];

  return [
    CHAT_SYSTEM_MESSAGE,
    ...data.map((row) => ({
      id: row.id,
      role: row.role as ChatMessage["role"],
      content: row.content,
    })),
  ];
}

export async function replaceMessages(userId: string, conversationId: string, messages: ChatMessage[]) {
  const supabase = await client();

  await supabase.from("chat_messages").delete().eq("conversation_id", conversationId).eq("user_id", userId);

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
    const { error } = await supabase.from("chat_messages").insert(rows);
    if (error) throw new Error(error.message);
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (lastUser) {
    await supabase
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
