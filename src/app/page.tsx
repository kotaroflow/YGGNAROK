import type { ReactNode } from "react";
import Link from "next/link";
import { BriefcaseBusiness, FileText, Users, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { tagRows, v1Workflows } from "@/features/dashboard/v1-data";
import { getDashboardOverview } from "@/server/data/dashboard";

export default async function DashboardPage() {
  const overview = await getDashboardOverview();
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
      label: "Trabalhos em andamento",
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
  ] as const;

  return (
    <AppShell hideTopBar>
      <main className="min-h-screen px-4 py-6 pl-16 text-slate-700 lg:px-8">
        <section className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-stone-50">
              <span className="text-amber-500">YGGNAROK</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-stone-400">
              Acompanhe o essencial e entre rápido nos fluxos principais.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ActionButton href="/criar-conteudo" className="bg-amber-300 text-slate-950 hover:bg-amber-200">
              <Zap size={16} />
              Criar conteúdo
            </ActionButton>
            <ActionButton href="/postagem-manual" className="border border-blue-200 bg-blue-100 text-blue-950 hover:bg-blue-200 dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-200">
              <FileText size={16} />
              Postagem manual
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

        <section className="mx-auto mt-7 grid w-full max-w-7xl gap-5">
          <Panel title="Trabalhos recentes" href="/jobs" action="Ver todos">
            <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
              {visibleJobs.length ? visibleJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 py-4 text-sm">
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="min-w-0 truncate text-slate-600 dark:text-stone-300">{formatJobTitle(job.type)}</span>
                  <StatusPill status={job.status} />
                  <span className="whitespace-nowrap text-xs text-slate-400">{formatRelativeTime(job.created_at)}</span>
                </Link>
              )) : (
                <Empty text="Nenhum trabalho recente." />
              )}
            </div>
          </Panel>
        </section>

        <section className="mx-auto mt-5 grid w-full max-w-7xl gap-5 xl:grid-cols-3">
          <Panel title="Fluxo de criação" href="/criar-conteudo" action="Abrir">
            <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
              {v1Workflows.map((workflow, index) => (
                <div key={workflow} className="flex items-center gap-4 py-3.5">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-amber-200 text-xs font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-300">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-stone-300">{workflow}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Postagem manual" href="/postagem-manual" action="Ver fila">
            <div className="grid min-h-48 place-items-center text-center">
              <div>
                <div className="mx-auto grid size-16 place-items-center rounded-full border-2 border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/70 dark:bg-blue-950/40">
                  <FileText size={26} />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-stone-200">
                  {overview.counts.manualPosts} postagem(s) na fila
                </p>
                <p className="mt-1 text-xs text-slate-400 dark:text-stone-500">
                  Clique para gerenciar a fila
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="Tags de conteúdo" href="/criar-conteudo" action="Gerenciar">
            <div className="space-y-4">
              {tagRows.slice(0, 3).map((row) => (
                <div key={row.group}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-stone-500">{row.group}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {row.tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="rounded-full border border-slate-200 bg-white/70 px-2.5 py-0.5 text-xs text-slate-500 dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-stone-400">
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
  const translations: Record<string, string> = {
    "image_generation": "Geração de imagem",
    "content_generation": "Geração de conteúdo",
    "caption_generation": "Geração de legenda",
    "video_processing": "Processamento de vídeo",
  };

  const normalized = type.toLowerCase().replace(/[._-]/g, "_");
  if (translations[normalized]) return translations[normalized];

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
