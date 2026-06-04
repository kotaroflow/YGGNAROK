import { NextResponse } from "next/server";

const SERVICES = [
  { id: "ollama", label: "Ollama", url: "http://localhost:11434/api/tags" },
  { id: "n8n", label: "n8n", url: "http://localhost:5678/healthz" },
  { id: "dashboard", label: "Dashboard server", url: "http://localhost:3333/health" },
];

export async function GET() {
  const results = await Promise.allSettled(
    SERVICES.map(async (svc) => {
      try {
        const res = await fetch(svc.url, { signal: AbortSignal.timeout(5000) });
        return { id: svc.id, label: svc.label, status: res.ok ? "online" : "offline" as const };
      } catch {
        return { id: svc.id, label: svc.label, status: "offline" as const };
      }
    })
  );

  const services = results.map((r) =>
    r.status === "fulfilled" ? r.value : { id: "", label: "", status: "offline" as const }
  );

  return NextResponse.json({ services });
}
