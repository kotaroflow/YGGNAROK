import type { Json } from "../../src/types/database";

type MediaResult = {
  status: "pending" | "skipped";
  provider: string;
  media_type: "image" | "audio" | "video" | "audiovisual";
  prompt?: string;
  error_message?: string;
  metadata?: Record<string, unknown>;
};

export async function maybeRunMediaGeneration(jobType: string, payload: unknown, output: Json): Promise<Json> {
  const mediaType = inferMediaType(jobType, payload);

  if (!mediaType || !output || typeof output !== "object" || Array.isArray(output)) {
    return output;
  }

  return attachMediaResult(output as Record<string, unknown>, pendingCloudMedia(mediaType, payload, output as Record<string, unknown>));
}

function pendingCloudMedia(mediaType: MediaResult["media_type"], payload: unknown, output: Record<string, unknown>): MediaResult {
  return {
    status: "pending",
    provider: "cloud_media_provider",
    media_type: mediaType,
    prompt: readPrompt(payload, output),
    error_message: "Provedor cloud de midia ainda nao configurado. O YGGNAROK salvou o plano e o prompt final para execucao em nuvem.",
    metadata: { execution: "cloud_only" },
  };
}

function inferMediaType(jobType: string, payload: unknown): MediaResult["media_type"] | null {
  const text = `${jobType} ${JSON.stringify(payload ?? {})}`.toLowerCase();
  if (/(audiovisual|audio_visual|video com audio)/.test(text)) return "audiovisual";
  if (/(video|reel|shorts)/.test(text)) return "video";
  if (/(audio|voz|voice|narracao)/.test(text)) return "audio";
  if (/(image|imagem|asset visual|foto|ilustracao)/.test(text)) return "image";
  return null;
}

function readPrompt(payload: unknown, output: Record<string, unknown>) {
  const payloadRecord = payload && typeof payload === "object" && !Array.isArray(payload) ? payload as Record<string, unknown> : {};
  const prompt = payloadRecord.prompt ?? payloadRecord.brief ?? output.summary ?? "";
  return String(prompt).slice(0, 6000);
}

function attachMediaResult(output: Record<string, unknown>, media: MediaResult) {
  const metadata = output.metadata && typeof output.metadata === "object" && !Array.isArray(output.metadata)
    ? output.metadata as Record<string, unknown>
    : {};
  const orchestration = metadata.ai_orchestration && typeof metadata.ai_orchestration === "object" && !Array.isArray(metadata.ai_orchestration)
    ? metadata.ai_orchestration as Record<string, unknown>
    : {};

  return {
    ...output,
    metadata: {
      ...metadata,
      ai_orchestration: {
        ...orchestration,
        media_generation: media,
      },
    },
  } as Json;
}
