import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { workerConfig } from "../src/config";

export function createR2Client() {
  if (!workerConfig.r2.accountId || !workerConfig.r2.accessKeyId || !workerConfig.r2.secretAccessKey) {
    throw new Error("R2 is not configured for this worker.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${workerConfig.r2.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: workerConfig.r2.accessKeyId,
      secretAccessKey: workerConfig.r2.secretAccessKey,
    },
  });
}

export async function uploadWorkerArtifact(input: {
  key: string;
  body: Uint8Array | string;
  contentType: string;
}) {
  if (process.env.R2_UPLOAD_GATEWAY_URL && process.env.R2_UPLOAD_GATEWAY_TOKEN) {
    const response = await fetch(
      `${process.env.R2_UPLOAD_GATEWAY_URL.replace(/\/$/, "")}/upload/${encodeURIComponent(input.key)}`,
      {
        method: "PUT",
        headers: {
          authorization: `Bearer ${process.env.R2_UPLOAD_GATEWAY_TOKEN}`,
          "content-type": input.contentType,
        },
        body: typeof input.body === "string" ? input.body : (input.body.buffer as ArrayBuffer),
      },
    );

    if (!response.ok) {
      throw new Error(`R2 gateway upload failed: ${response.status}`);
    }

    const result = (await response.json()) as { key: string; publicUrl: string | null };

    return {
      r2Key: result.key,
      publicUrl: result.publicUrl,
    };
  }

  const client = createR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: workerConfig.r2.bucketName,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType,
    }),
  );

  return {
    r2Key: input.key,
    publicUrl: workerConfig.r2.publicBaseUrl ? `${workerConfig.r2.publicBaseUrl}/${input.key}` : null,
  };
}
