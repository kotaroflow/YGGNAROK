"use client";

import { useState, useEffect, useCallback } from "react";
import { ExternalLink, Loader2, RefreshCw } from "lucide-react";
import type { HealthLog } from "@/types/dashboard";

type ServiceStatus = {
  id: string;
  label: string;
  status: "online" | "offline" | "checking";
};

export function WorkersClient({ initialLogs, initialPending, initialProcessing }: { initialLogs: HealthLog[]; initialPending: number; initialProcessing: number }) {
  const [logs, setLogs] = useState<HealthLog[]>(initialLogs);
  const [pending, setPending] = useState(initialPending);
  const [processing, setProcessing] = useState(initialProcessing);
  const [services, setServices] = useState<ServiceStatus[]>([
    { id: "ollama", label: "Ollama", status: "checking" },
    { id: "n8n", label: "n8n", status: "checking" },
    { id: "openclaw", label: "OPENCLAW Gateway", status: "checking" },
    { id: "dashboard", label: "Dashboard server", status: "checking" },
  ]);

  const checkServices = useCallback(async () => {
    setServices((prev) => prev.map((s) => ({ ...s, status: "checking" as const })));
    try {
      const res = await fetch("/api/workers/health");
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch {
      setServices((prev) => prev.map((s) => ({ ...s, status: "offline" as const })));
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/workers/health");
      const data = await res.json();
      if (data.services) setServices(data.services);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    checkServices();
    const svcInterval = setInterval(checkServices, 15000);
    return () => clearInterval(svcInterval);
  }, [checkServices]);

  const statusColor = (s: string) => {
    if (s === "online") return "bg-emerald-500";
    if (s === "offline") return "bg-red-500";
    return "bg-amber-400";
  };

  const statusLabel = (s: string) => {
    if (s === "online") return "Online";
    if (s === "offline") return "Offline";
    return "Verificando";
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
      <p className="text-sm font-medium text-amber-700 dark:text-amber-300">作戦本部 — Sakusen Honbu</p>
      <h1 className="mt-1 text-2xl font-semibold">Workers</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric label="Runner externo" value="Cloudflare Cron" />
        <Metric label="Jobs pendentes" value={String(pending)} />
        <Metric label="Jobs processando" value={String(processing)} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="flex items-center gap-4 rounded-lg border border-white/70 bg-white/70 p-4 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60"
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10">
              <span className={`size-2 rounded-full ${statusColor(svc.status)}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{svc.label}</p>
              <div className="mt-0.5 flex items-center gap-1.5">
                {svc.status === "checking" ? (
                  <Loader2 size={12} className="text-muted animate-spin" />
                ) : (
                  <span className={`size-2 rounded-full ${statusColor(svc.status)}`} />
                )}
                <span className="text-xs text-muted capitalize">{statusLabel(svc.status)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Health Logs</h2>
          <button type="button" onClick={fetchData} className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition">
            <RefreshCw size={12} />
            Atualizar
          </button>
        </div>
        {logs.length > 0 ? (
          <div className="max-h-96 overflow-y-auto rounded-lg border border-white/70 dark:border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/45 text-xs uppercase text-muted dark:bg-neutral-950/35 sticky top-0">
                <tr>
                  <th className="px-3 py-2 font-medium">Fonte</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Mensagem</th>
                  <th className="px-3 py-2 font-medium">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-neutral-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/45 dark:hover:bg-neutral-950/35">
                    <td className="px-3 py-2 font-medium">{log.source}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        log.status === "ok" || log.status === "online" ? "bg-emerald-500/10 text-emerald-600" :
                        log.status === "warning" ? "bg-amber-500/10 text-amber-600" :
                        "bg-red-500/10 text-red-600"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="max-w-md truncate px-3 py-2 text-muted">{log.message}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-muted">{formatDate(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-muted">Nenhum health log registrado.</p>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}
