"use server";

import { assertPermission } from "@/server/permissions/assert";
import type { Json } from "@/types/database";
import { revalidatePath } from "next/cache";

const maxUploadBytes = 50 * 1024 * 1024;

export async function uploadMediaAsset(formData: FormData) {
  const { supabase, user } = await assertPermission("library.create");
  const file = formData.get("file");
  const profileId = String(formData.get("profileId") || "") || null;
  const assetType = String(formData.get("assetType") || "document");

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Selecione um arquivo para enviar.");
  }

  if (file.size > maxUploadBytes) {
    throw new Error("Arquivo acima do limite de 50 MB para upload direto.");
  }

  const gatewayUrl = process.env.R2_UPLOAD_GATEWAY_URL;
  const gatewayToken = process.env.R2_UPLOAD_GATEWAY_TOKEN;

  if (!gatewayUrl || !gatewayToken) {
    throw new Error("Gateway de mídia não configurado.");
  }

  const assetId = crypto.randomUUID();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120) || "asset";
  const key = profileId
    ? `profiles/${profileId}/media/${assetId}-${safeName}`
    : `users/${user.id}/profiles/no-profile/media/${assetId}-${safeName}`;

  const uploadResponse = await fetch(`${gatewayUrl.replace(/\/$/, "")}/upload/${encodeURIComponent(key)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${gatewayToken}`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: await file.arrayBuffer(),
  });

  const uploadResult = await uploadResponse.json().catch(() => null) as { publicUrl?: string; error?: string } | null;

  if (!uploadResponse.ok || !uploadResult?.publicUrl) {
    throw new Error(uploadResult?.error || "Não foi possível enviar a mídia.");
  }

  const { error } = await supabase.from("media_assets").insert({
    id: assetId,
    user_id: user.id,
    profile_id: profileId,
    asset_type: assetType,
    storage_provider: "cloudflare_r2",
    r2_key: key,
    public_url: uploadResult.publicUrl,
    mime_type: file.type || "application/octet-stream",
    size_bytes: file.size,
    metadata: {
      original_name: file.name,
      uploaded_from: "manual_media_page",
    } satisfies Json,
  });

  if (error) {
    throw new Error("Mídia enviada, mas não foi possível registrar no banco.");
  }

  revalidatePath("/midias");
}
