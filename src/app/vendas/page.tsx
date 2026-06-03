import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, Users, TrendingUp, BarChart3, Briefcase, Activity, Cpu, Globe, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getProfiles, getJobs } from "@/server/data/dashboard";
import type { Profile, Job } from "@/types/dashboard";

export const metadata: Metadata = {
  title: "Vendas",
  description: "Dashboard de vendas, comissões e clientes.",
};

export default async function VendasPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  const [profiles, jobs] = (await Promise.all([getProfiles(), getJobs()])) as [Profile[], Job[]];

  const stats = [
    { label: "Total de vendas", value: "0", icon: DollarSign, tone: "emerald" as const },
    { label: "Comissões", value: "R$ 0", icon: TrendingUp, tone: "amber" as const },
    { label: "Clientes", value: "0", icon: Users, tone: "blue" as const },
  ];

  const recentProfiles = profiles.slice(0, 5);
  const recentJobs = jobs.slice(0, 6);

  return (
    <AppShell>
      <main className="relative min-h-screen px-4 py-6 text-foreground lg:px-8">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full pointer-events-none z-0" />

        <header className="relative z-10 mx-auto mb-8 flex w-full max-w-7xl flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand">Comercial</p>
            <h1 className="mt-1 font-divine text-3xl sm:text-4xl font-black tracking-widest leading-tight bg-gradient-to-r from-brand via-amber-200 to-brand-strong bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">Vendas</h1>
            <p className="mt-2 text-sm text-muted">Acompanhe faturamento, comissões e perfil dos clientes.</p>
          </div>
          <Link href="/" className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-strong">Voltar ao início</Link>
        </header>

        <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-line/40 bg-surface/60 p-5 shadow-lg backdrop-blur-xl">
              <span className={`grid size-12 place-items-center rounded-xl border ${vendaToneClasses[stat.tone]}`}>
                <stat.icon size={22} />
              </span>
              <span>
                <span className="block text-2xl font-bold leading-none">{stat.value}</span>
                <span className="mt-1 block text-sm text-muted">{stat.label}</span>
              </span>
            </div>
          ))}
        </section>

        <section className="relative z-10 mx-auto mt-6 grid w-full max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4">
          <ServiceBadge name="Ollama" icon={Cpu} status="online" />
          <ServiceBadge name="n8n" icon={Activity} status="online" />
          <ServiceBadge name="Gateway" icon={ShieldCheck} status="online" />
          <ServiceBadge name="Dashboard" icon={Globe} status="online" />
        </section>

        <div className="relative z-10 mx-auto mt-6 grid w-full max-w-7xl gap-5 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-line/40 bg-surface/60 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Perfis criados recentemente</h2>
              <Link className="text-sm font-semibold text-brand hover:text-brand-strong" href="/perfis">Ver todos</Link>
            </div>
            <div className="divide-y divide-line">
              {recentProfiles.length ? recentProfiles.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted truncate">{p.slug}</p>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap ml-3">{p.created_at ? new Date(p.created_at).toLocaleDateString("pt-BR") : "—"}</span>
                </div>
              )) : (
                <p className="py-6 text-sm text-muted text-center">Nenhum perfil encontrado.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-line/40 bg-surface/60 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Trabalhos recentes</h2>
              <Link className="text-sm font-semibold text-brand hover:text-brand-strong" href="/jobs">Ver todos</Link>
            </div>
            <div className="divide-y divide-line">
              {recentJobs.length ? recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{job.type}</p>
                    <p className="text-xs text-muted">{job.status}</p>
                  </div>
                  <span className="text-xs text-muted whitespace-nowrap ml-3">{job.created_at ? new Date(job.created_at).toLocaleDateString("pt-BR") : "—"}</span>
                </div>
              )) : (
                <p className="py-6 text-sm text-muted text-center">Nenhum trabalho encontrado.</p>
              )}
            </div>
          </section>
        </div>

        <section className="relative z-10 mx-auto mt-6 w-full max-w-7xl">
          <div className="rounded-2xl border border-dashed border-line/40 bg-surface/30 p-8 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 size={20} className="text-brand" />
              <h2 className="text-base font-bold text-foreground">Gráfico de Vendas</h2>
            </div>
            <div className="grid min-h-[200px] place-items-center rounded-xl border border-line/20 bg-surface/20">
              <div className="text-center">
                <TrendingUp size={40} className="mx-auto text-muted/40 mb-2" />
                <p className="text-sm text-muted">Conecte uma integração de pagamentos para ver os gráficos.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

const vendaToneClasses: Record<string, string> = {
  emerald: "border-emerald-300/50 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  amber: "border-brand/30 bg-sidebar-active text-brand",
  blue: "border-blue-300/50 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
};

function ServiceBadge({ name, icon: Icon, status }: { name: string; icon: React.ComponentType<{ size?: number; className?: string }>; status: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line/30 bg-surface/40 p-3 shadow-sm">
      <span className={`size-2 rounded-full ${status === "online" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" : "bg-red-400"}`} />
      <Icon size={14} className="text-muted" />
      <span className="text-xs font-medium text-foreground">{name}</span>
    </div>
  );
}
