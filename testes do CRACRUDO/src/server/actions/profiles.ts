"use server";

import { revalidatePath } from "next/cache";
import { createProfileSchema } from "@/lib/validators/schemas";
import { assertPermission } from "@/server/permissions/assert";

export async function createProfile(formData: FormData) {
  const input = createProfileSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    tags: formData.getAll("tags").map(String),
  });
  const { supabase, user } = await assertPermission("profiles.create");

  const { data, error } = await supabase.from("profiles").insert({
    owner_id: user.id,
    name: input.name,
    slug: input.slug,
    description: input.description,
  }).select("id").single();

  if (error) {
    throw new Error("Não foi possível criar o perfil.");
  }

  if (data && input.tags.length > 0) {
    const tags = input.tags.map((tag) => {
      const [tag_group, tag_key] = tag.split(":");
      return { profile_id: data.id, tag_group, tag_key };
    });

    await supabase.from("profile_tags").insert(tags);
  }

  revalidatePath("/perfis");
  revalidatePath("/");
}
