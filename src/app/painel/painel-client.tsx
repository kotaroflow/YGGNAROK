"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Activity, Server, Cpu, Globe, ShieldCheck } from "lucide-react";

const serviceIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Ollama: Cpu,
  n8n: Activity,
  "OPENCLAW Gateway": ShieldCheck,
  Dashboard: Globe,
};

type HealthState = "checking" | "online" | "offline";

export function PainelClient({ children, endpoints }: { children: ReactNode; endpoints: Record<string, string> }) {
  const router = useRouter();
  const [health, setHealth] = useState<Record<string, HealthState>>({});

  useEffect(() => {
    const refreshTimer = setInterval(() => router.refresh(), 30000);
    return () => clearInterval(refreshTimer);
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    async function checkAll() {
      const results: Record<string, HealthState> = {};
      for (const [name, url] of Object.entries(endpoints)) {
        if (!url || url === "http://localhost:3334") {
          results[name] = "online";
          continue;
        }
        try {
          results[name] = "checking";
          setHealth({ ...results });
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 3000);
          await fetch(url, { mode: "no-cors", signal: controller.signal });
          clearTimeout(timeout);
          if (!cancelled) results[name] = "online";
        } catch {
          if (!cancelled) results[name] = "offline";
        }
      }
      if (!cancelled) setHealth(results);
    }

    checkAll();
    const checkTimer = setInterval(checkAll, 30000);
    return () => { cancelled = true; clearInterval(checkTimer); };
  }, [endpoints]);

  return (
    <div>
      <section className="relative z-10 mx-auto mb-6 grid w-full max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(endpoints).map(([name, url]) => {
          const Icon = serviceIcons[name] || Server;
          const state = health[name] ?? "checking";
          return (
            <div key={name} className="flex items-center gap-3 rounded-xl border border-line/40 bg-surface/60 p-4 shadow-lg backdrop-blur-xl">
              <span className="grid size-10 place-items-center rounded-lg border border-line/30 bg-sidebar-active">
                <Icon size={18} className="text-brand" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${state === "online" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : state === "offline" ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]" : "bg-amber-400 animate-pulse"}`} />
                  <span className="text-sm font-semibold text-foreground truncate">{name}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  {state === "online" ? url ? "Online" : "Configurado" : state === "offline" ? "Offline" : "Verificando..."}
                </p>
              </div>
            </div>
          );
        })}
      </section>
      {children}
    </div>
  );
}
