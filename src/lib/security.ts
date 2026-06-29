import { NextResponse } from "next/server";

type JsonInit = ResponseInit & {
  headers?: HeadersInit;
};

function buildHeaders(init?: HeadersInit) {
  const headers = new Headers(init);
  headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  headers.set("Surrogate-Control", "no-store");
  return headers;
}

export function jsonNoStore(body: unknown, init?: JsonInit) {
  return NextResponse.json(body, {
    ...init,
    headers: buildHeaders(init?.headers),
  });
}

function collectAllowedOrigins(request: Request) {
  const allowedOrigins = new Set<string>();
  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol =
    forwardedProto || requestUrl.protocol.replace(":", "") || "https";

  allowedOrigins.add(requestUrl.origin.replace(/\/$/, ""));

  if (host) {
    allowedOrigins.add(`${protocol}://${host}`);
  }

  const envOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
  ].filter(Boolean) as string[];

  for (const origin of envOrigins) {
    allowedOrigins.add(origin.replace(/\/$/, ""));
  }

  return allowedOrigins;
}

function normalizeOrigin(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.origin.replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function rejectUntrustedOrigin(request: Request) {
  const origin = normalizeOrigin(request.headers.get("origin"));
  const referer = normalizeOrigin(request.headers.get("referer"));
  const fetchSite = request.headers.get("sec-fetch-site");
  const allowedOrigins = collectAllowedOrigins(request);

  if (origin && !allowedOrigins.has(origin)) {
    return jsonNoStore({ error: "Origem não permitida." }, { status: 403 });
  }

  if (!origin && referer && !allowedOrigins.has(referer)) {
    return jsonNoStore({ error: "Referer não permitido." }, { status: 403 });
  }

  if (!origin && !referer && fetchSite === "cross-site") {
    return jsonNoStore(
      { error: "Requisição cross-site bloqueada." },
      { status: 403 },
    );
  }

  return null;
}

export function shouldExposeHealthDetails() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.HEALTH_DETAILS_ENABLED === "true"
  );
}
