"use server";

import { revalidatePath } from "next/cache";
import { createContentSchema, createLibraryItemSchema } from "@/lib/validators/schemas";
import { assertPermission } from "@/server/permissions/assert";

export async function createContentItem(formData: FormData) {
  const input = createContentSchema.parse({
    profileId: formData.get("profileId"),
    title: formData.get("title"),
    contentType: formData.get("contentType"),
    idea: formData.get("idea") || undefined,
    platform: formData.get("platform") || undefined,
  });
  const { supabase, user } = await assertPermission("content.create");

  const { error } = await supabase.from("content_items").insert({
    profile_id: input.profileId,
    created_by: user.id,
    title: input.title,
    content_type: input.contentType,
    status: "idea",
    idea: input.idea,
    platform: input.platform,
  });

  if (error) {
    throw new Error("Não foi possível criar o conteúdo.");
  }

  revalidatePath("/criar-conteudo");
  revalidatePath("/");
}

export async function createLibraryItem(formData: FormData) {
  const input = createLibraryItemSchema.parse({
    profileId: formData.get("profileId"),
    type: formData.get("type"),
    title: formData.get("title"),
    body: formData.get("body") || undefined,
  });
  const { supabase, user } = await assertPermission("library.create");

  const { error } = await supabase.from("library_items").insert({
    profile_id: input.profileId,
    created_by: user.id,
    type: input.type,
    title: input.title,
    body: input.body,
    status: "active",
    metadata: {},
  });

  if (error) {
    throw new Error("Não foi possível criar o item da biblioteca.");
  }

  revalidatePath("/biblioteca");
}

export async function restoreLibraryItem(id: string) {
  const { supabase } = await assertPermission("library.restore");
  const { error } = await supabase
    .from("library_items")
    .update({ deleted_at: null })
    .eq("id", id);

  if (error) {
    throw new Error("Não foi possível restaurar o item.");
  }

  revalidatePath("/criar-conteudo");
  revalidatePath("/biblioteca");
}

export async function deleteLibraryItemPermanently(id: string) {
  const { supabase } = await assertPermission("library.delete");
  const { error } = await supabase
    .from("library_items")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Não foi possível deletar permanentemente.");
  }

  revalidatePath("/criar-conteudo");
}
