"use server";

import { revalidatePath } from "next/cache";
import { createManualPostingSchema } from "@/lib/validators/schemas";
import { assertPermission } from "@/server/permissions/assert";

export async function createManualPostingItem(formData: FormData) {
  const input = createManualPostingSchema.parse({
    profileId: formData.get("profileId"),
    contentId: formData.get("contentId"),
    platform: formData.get("platform"),
    caption: formData.get("caption") || undefined,
    hashtags: formData.get("hashtags") || undefined,
    plannedDate: formData.get("plannedDate") || undefined,
  });
  const { supabase } = await assertPermission("posting.manage");

  const { error } = await supabase.from("manual_posting_queue").insert({
    profile_id: input.profileId,
    content_id: input.contentId,
    platform: input.platform,
    status: "waiting",
    checklist: {
      legenda_pronta: Boolean(input.caption),
      hashtags_prontas: Boolean(input.hashtags),
      midia_anexada: false,
      plataforma_definida: true,
      perfil_correto: true,
      link_oferta_conferido: false,
      aprovado_para_postagem: false,
    },
    caption_to_copy: input.caption,
    hashtags_to_copy: input.hashtags?.split(/\s+/).filter(Boolean) ?? [],
    planned_date: input.plannedDate || null,
  });

  if (error) {
    throw new Error("Não foi possível criar a postagem manual.");
  }

  revalidatePath("/postagem-manual");
}

export async function markManualPostAsPublished(formData: FormData) {
  const queueId = String(formData.get("queueId") || "");
  const postUrl = String(formData.get("postUrl") || "");
  const { supabase, user } = await assertPermission("posting.manage");

  const { error } = await supabase
    .from("manual_posting_queue")
    .update({
      status: "posted",
      post_url: postUrl,
      posted_by: user.id,
      posted_at: new Date().toISOString(),
    })
    .eq("id", queueId);

  if (error) {
    throw new Error("Não foi possível registrar a postagem.");
  }

  revalidatePath("/postagem-manual");
}
