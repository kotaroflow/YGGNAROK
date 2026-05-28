import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, BriefcaseBusiness, FileText, Radio, Sparkles, Users, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { tagRows, v1Workflows } from "@/features/dashboard/v1-data";
import { getDashboardOverview } from "@/server/data/dashboard";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();
  const hasHealthAlerts = overview.counts.alerts > 0;
  const visibleJobs = overview.jobs.slice(0, 3);

  const stats = [
    {
      label: "Perfis ativos",
      value: overview.counts.profiles,
      href: "/perfis",
      icon: Users,
      tone: "amber",
    },
    {
      label: "Jobs em andamento",
      value: overview.counts.pendingJobs,
      href: "/jobs-em-andamento",
      icon: BriefcaseBusiness,
      tone: "violet",
    },
    {
      label: "Postagens manuais",
      value: overview.counts.manualPosts,
      href: "/postagem-manual",
      icon: FileText,
      tone: "blue",
    },
    {
      label: "Avisos simples",
      value: overview.counts.alerts,
      href: "/alertas",
      icon: Bell,
      tone: "sky",
    },
  ] as const;

  return (
    <AppShell hideTopBar>
      <main className="min-h-screen px-4 py-6 pl-16 text-slate-700 lg:px-8">
        <section className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">Visao operacional da V1</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
              Dashboard <span className="text-amber-500">YGGNAROK</span> / YGN V1
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-stone-400">Acompanhe o essencial e entre rapido nos fluxos principais.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionButton href="/criar-conteudo" className="bg-amber-300 text-slate-950 hover:bg-amber-200">
              <Zap size={16} />
              Criar conteudo
            </ActionButton>
            <ActionButton href="/conselho-ia" className="border border-violet-200 bg-violet-100 text-violet-950 hover:bg-violet-200 dark:border-violet-900/50 dark:bg-violet-950/60 dark:text-violet-200">
              <Radio size={16} />
              Conectar IA
            </ActionButton>
            <ActionButton href="/jobs" className="border border-blue-200 bg-blue-100 text-blue-950 hover:bg-blue-200 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-200">
              <Sparkles size={16} />
              Gerar com IA
            </ActionButton>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group flex min-h-28 items-center gap-5 rounded-lg border border-black/5 bg-white/78 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-neutral-950/70 dark:hover:bg-neutral-900"
            >
              <span className={`grid size-14 place-items-center rounded-lg border ${toneClasses[stat.tone]}`}>
                <stat.icon size={23} />
              </span>
              <span className="min-w-0">
                <span className="block text-3xl font-bold leading-none text-slate-900 dark:text-stone-50">{stat.value}</span>
                <span className="mt-3 block truncate text-sm text-slate-400 dark:text-stone-500">{stat.label}</span>
              </span>
            </Link>
          ))}
        </section>

        <section className="mx-auto mt-7 grid w-full max-w-7xl gap-5 xl:grid-cols-[1.9fr_.95fr]">
          <Panel title="Ultimos Jobs" href="/jobs" action="Ver todos">
            <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
              {visibleJobs.length ? visibleJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 py-4 text-sm">
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="min-w-0 truncate text-slate-600 dark:text-stone-300">{formatJobTitle(job.type)}</span>
                  <StatusPill status={job.status} />
                  <span className="whitespace-nowrap text-xs text-slate-400">{formatRelativeTime(job.created_at)}</span>
                </Link>
              )) : (
                <Empty text="Nenhum job recente." />
              )}
            </div>
          </Panel>

          <Panel title="Saude tecnica" href="/health-logs" action="Ver">
            <div className="grid min-h-48 place-items-center text-center">
              <div>
                <div className={`mx-auto grid size-20 place-items-center rounded-full border-4 ${hasHealthAlerts ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/70 dark:bg-red-950/40" : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/70 dark:bg-emerald-950/40"}`}>
                  <span className="text-xl font-bold">{hasHealthAlerts ? "!" : "OK"}</span>
                </div>
                <p className="mt-5 text-sm text-slate-400 dark:text-stone-500">
                  {hasHealthAlerts ? `${overview.counts.alerts} alerta(s) tecnico(s)` : "Todos os sistemas operacionais"}
                </p>
              </div>
            </div>
          </Panel>
        </section>

        <section className="mx-auto mt-5 grid w-full max-w-7xl gap-5 xl:grid-cols-[1.9fr_.95fr]">
          <Panel title="Fluxo guiado V1" href="/criar-conteudo" action="Abrir">
            <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
              {v1Workflows.map((workflow, index) => (
                <div key={workflow} className="flex items-center gap-4 py-3.5">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber-200 text-xs font-bold text-amber-900">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-stone-300">{workflow}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Tags operacionais" href="/perfis" action="Abrir">
            <div className="space-y-5">
              {tagRows.slice(0, 4).map((row) => (
                <div key={row.group}>
                  <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-stone-500">{row.group}</p>
                  <div className="flex flex-wrap gap-2">
                    {row.tags.slice(0, 6).map((tag) => (
                      <span key={tag} className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-500 dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-stone-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </main>
    </AppShell>
  );
}

const toneClasses = {
  amber: "border-amber-200 bg-amber-100 text-amber-600 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  violet: "border-violet-200 bg-violet-100 text-violet-500 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300",
  blue: "border-blue-200 bg-blue-100 text-blue-500 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
  sky: "border-sky-200 bg-sky-100 text-sky-600 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300",
};

function ActionButton({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return (
    <Link className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-bold shadow-sm transition ${className}`} href={href}>
      {children}
    </Link>
  );
}

function Panel({ title, href, action, children }: { title: string; href: string; action: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-black/5 bg-white/78 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/70">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-700 dark:text-stone-200">{title}</h2>
        <Link className="text-sm font-bold text-amber-500 hover:text-amber-600" href={href}>{action}</Link>
      </div>
      {children}
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const classes = status === "completed"
    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
    : status === "failed"
      ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
      : status === "processing"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
        : "bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-stone-300";

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${classes}`}>{statusLabel(status)}</span>;
}

function Empty({ text }: { text: string }) {
  return (
    <div className="grid min-h-32 place-items-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-400 dark:border-neutral-800 dark:text-stone-500">
      {text}
    </div>
  );
}

function formatJobTitle(type: string) {
  return type
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "pendente",
    processing: "em andamento",
    completed: "concluido",
    failed: "falhou",
  };

  return labels[status] ?? status;
}

function formatRelativeTime(value: string | null) {
  if (!value) return "sem data";

  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) return `ha ${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `ha ${hours}h`;

  const days = Math.floor(hours / 24);
  return `ha ${days}d`;
}
