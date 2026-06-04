type R2Bucket = {
  put(
    key: string,
    value: ArrayBuffer,
    options?: {
      httpMetadata?: {
        contentType?: string;
      };
      customMetadata?: Record<string, string>;
    },
  ): Promise<void>;
};

type Env = {
  YGN_MEDIA: R2Bucket;
  R2_GATEWAY_TOKEN: string;
  R2_PUBLIC_BASE_URL: string;
};

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

const worker = {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ ok: true, service: "ygn-r2-gateway" });
    }

    if (request.method !== "PUT" || !url.pathname.startsWith("/upload/")) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const authorization = request.headers.get("authorization") ?? "";
    const expected = `Bearer ${env.R2_GATEWAY_TOKEN}`;

    if (!env.R2_GATEWAY_TOKEN || authorization !== expected) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const key = decodeURIComponent(url.pathname.replace("/upload/", ""));

    if (!isAllowedKey(key)) {
      return Response.json({ error: "Invalid object key" }, { status: 400 });
    }

    const contentType = request.headers.get("content-type") ?? "application/octet-stream";
    const body = await request.arrayBuffer();

    await env.YGN_MEDIA.put(key, body, {
      httpMetadata: {
        contentType,
      },
      customMetadata: {
        source: "ygn-r2-gateway",
      },
    });

    const publicUrl = env.R2_PUBLIC_BASE_URL
      ? `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`
      : null;

    return new Response(
      JSON.stringify({
        key,
        publicUrl,
        size: body.byteLength,
        contentType,
      }),
      {
        status: 201,
        headers: jsonHeaders,
      },
    );
  },
};

export default worker;

function isAllowedKey(key: string) {
  if (!key || key.length > 512) {
    return false;
  }

  if (key.includes("..") || key.startsWith("/") || key.endsWith("/")) {
    return false;
  }

  return /^(users|profiles|test)\//.test(key);
}
