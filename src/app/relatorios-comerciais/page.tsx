import type { Metadata } from "next";
import Link from "next/link";
import { FileBarChart, Download, Calendar, Briefcase, Activity, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getJobs, getHealthLogs } from "@/server/data/dashboard";
import type { Job, HealthLog } from "@/types/dashboard";

export const metadata: Metadata = {
  title: "Relatórios Comerciais",
  description: "Relatórios comerciais, filtros e exportação de dados.",
};

export default async function RelatoriosComerciaisPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  const [jobs, healthLogs] = (await Promise.all([getJobs(), getHealthLogs()])) as [Job[], HealthLog[]];

  const jobStats = {
    total: jobs.length,
    pending: jobs.filter((j) => j.status === "pending").length,
    processing: jobs.filter((j) => j.status === "processing").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  };

  const recentHealth = healthLogs.slice(0, 8);

  const reports = [
    { name: "Relatório de Vendas", desc: "Resumo mensal de faturamento e comissões", filename: "relatorio-vendas.csv" },
    { name: "Relatório de Jobs", desc: "Desempenho da fila de processamento", filename: "relatorio-jobs.csv" },
    { name: "Relatório de Saúde", desc: "Logs de saúde dos serviços", filename: "relatorio-saude.csv" },
  ];

  return (
    <AppShell>
      <main className="relative min-h-screen px-4 py-6 text-foreground lg:px-8">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none z-0" />

        <header className="relative z-10 mx-auto mb-8 flex w-full max-w-7xl flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand">Comercial</p>
            <h1 className="mt-1 font-divine text-3xl sm:text-4xl font-black tracking-widest leading-tight bg-gradient-to-r from-brand via-amber-200 to-brand-strong bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">Relatórios Comerciais</h1>
            <p className="mt-2 text-sm text-muted">Exporte relatórios, acompanhe métricas e visualize logs de saúde.</p>
          </div>
          <Link href="/" className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-strong">Voltar ao início</Link>
        </header>

        <section className="relative z-10 mx-auto mb-6 flex w-full max-w-7xl flex-wrap items-center gap-4 rounded-2xl border border-line/40 bg-surface/60 p-5 shadow-lg backdrop-blur-xl">
          <Calendar size={18} className="text-muted" />
          <span className="text-sm font-medium text-foreground">Filtrar por período:</span>
          <input type="date" defaultValue="2026-01-01" className="rounded-lg border border-line/40 bg-surface-strong px-3 py-1.5 text-xs text-foreground outline-none focus:border-brand/40" />
          <span className="text-xs text-muted">até</span>
          <input type="date" defaultValue="2026-12-31" className="rounded-lg border border-line/40 bg-surface-strong px-3 py-1.5 text-xs text-foreground outline-none focus:border-brand/40" />
          <button className="rounded-lg bg-brand px-4 py-1.5 text-xs font-bold text-neutral-950 hover:bg-brand-strong transition">Aplicar</button>
        </section>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-line/40 bg-surface/60 p-6 shadow-xl backdrop-blur-xl">
            <h2 className="mb-4 text-base font-bold text-foreground">Exportar Relatórios</h2>
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.name} className="flex items-center justify-between rounded-xl border border-line/30 bg-surface/40 p-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    <p className="text-xs text-muted">{r.desc}</p>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-lg border border-line/40 bg-surface-strong px-3 py-2 text-xs font-medium text-foreground hover:border-brand/40 hover:text-brand transition">
                    <Download size={14} />
                    CSV
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-line/40 bg-surface/60 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Resumo de Jobs</h2>
              <Link className="text-sm font-semibold text-brand hover:text-brand-strong" href="/jobs">Ver fila</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="pb-2 font-semibold text-xs">Status</th>
                    <th className="pb-2 font-semibold text-xs">Quantidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  <tr><td className="py-2 text-foreground">Total</td><td className="py-2 font-bold">{jobStats.total}</td></tr>
                  <tr><td className="py-2 text-foreground">Pendentes</td><td className="py-2">{jobStats.pending}</td></tr>
                  <tr><td className="py-2 text-foreground">Em processamento</td><td className="py-2">{jobStats.processing}</td></tr>
                  <tr><td className="py-2 text-foreground">Concluídos</td><td className="py-2 text-emerald-500 font-semibold">{jobStats.completed}</td></tr>
                  <tr><td className="py-2 text-foreground">Falhos</td><td className="py-2 text-red-400 font-semibold">{jobStats.failed}</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="relative z-10 mx-auto mt-6 w-full max-w-7xl">
          <div className="rounded-2xl border border-line/40 bg-surface/60 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-brand" />
                <h2 className="text-base font-bold text-foreground">Logs de Saúde</h2>
              </div>
              <Link className="text-sm font-semibold text-brand hover:text-brand-strong" href="/health-logs">Ver todos</Link>
            </div>
            <div className="divide-y divide-line">
              {recentHealth.length ? recentHealth.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`size-2 shrink-0 rounded-full ${log.status === "healthy" || log.status === "online" ? "bg-emerald-400" : log.status === "warning" ? "bg-amber-400" : "bg-red-400"}`} />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{log.source}</p>
                      <p className="text-xs text-muted truncate">{log.message}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap ml-3">{log.created_at ? new Date(log.created_at).toLocaleDateString("pt-BR") : "—"}</span>
                </div>
              )) : (
                <div className="flex items-center gap-3 py-8 text-sm text-muted justify-center">
                  <AlertTriangle size={16} />
                  <span>Nenhum log de saúde encontrado.</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
