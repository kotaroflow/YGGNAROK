import type { ReactNode } from "react";
import Link from "next/link";
import { BriefcaseBusiness, FileText, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { tagRows, v1Workflows } from "@/features/dashboard/v1-data";
import { getDashboardOverview } from "@/server/data/dashboard";

export default async function PainelPage() {
  const overview = await getDashboardOverview();
  const visibleJobs = overview.jobs.slice(0, 5);

  const stats = [
    {
      label: "Perfis ativos",
      value: overview.counts.profiles,
      href: "/perfis",
      icon: Users,
      tone: "amber" as const,
    },
    {
      label: "Trabalhos em andamento",
      value: overview.counts.pendingJobs,
      href: "/jobs-em-andamento",
      icon: BriefcaseBusiness,
      tone: "violet" as const,
    },
    {
      label: "Postagens manuais",
      value: overview.counts.manualPosts,
      href: "/postagem-manual",
      icon: FileText,
      tone: "blue" as const,
    },
  ];

  return (
    <AppShell>
      <main className="relative min-h-screen px-4 py-6 text-foreground lg:px-8">
        
        {/* Ambient Light Orbs for Void Mode Legibility */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/10 blur-[130px] rounded-full pointer-events-none z-0" />
        <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none z-0" />

        <header className="relative z-10 mx-auto mb-8 flex w-full max-w-7xl flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-brand">Operação</p>
            <h1 className="mt-1 font-divine text-3xl sm:text-4xl font-black tracking-widest leading-tight bg-gradient-to-r from-brand via-amber-200 to-brand-strong bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">Painel Operacional</h1>
            <p className="mt-2 text-sm text-muted">
              Trabalhos, filas e fluxos do YGGNAROK.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-strong"
          >
            Voltar ao início
          </Link>
        </header>

        <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group flex items-center gap-4 rounded-xl border border-line/40 bg-surface/60 p-5 shadow-lg backdrop-blur-xl transition hover:border-brand/40 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]"
            >
              <span className={`grid size-12 place-items-center rounded-xl border ${toneClasses[stat.tone]}`}>
                <stat.icon size={22} />
              </span>
              <span>
                <span className="block text-2xl font-bold leading-none">{stat.value}</span>
                <span className="mt-1 block text-sm text-muted">{stat.label}</span>
              </span>
            </Link>
          ))}
        </section>

        <section className="mx-auto mt-8 grid w-full max-w-7xl gap-5">
          <Panel title="Trabalhos recentes" href="/jobs" action="Ver todos">
            <div className="divide-y divide-line">
              {visibleJobs.length ? (
                visibleJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 py-4 text-sm"
                  >
                    <span className="size-2 rounded-full bg-brand" />
                    <span className="min-w-0 truncate text-muted">{formatJobTitle(job.type)}</span>
                    <StatusPill status={job.status} />
                    <span className="whitespace-nowrap text-xs text-muted">
                      {formatRelativeTime(job.created_at)}
                    </span>
                  </Link>
                ))
              ) : (
                <Empty text="Nenhum trabalho recente." />
              )}
            </div>
          </Panel>
        </section>

        <section className="mx-auto mt-5 grid w-full max-w-7xl gap-5 xl:grid-cols-3">
          <Panel title="Fluxo de criação" href="/criar-conteudo" action="Abrir">
            <div className="divide-y divide-line">
              {v1Workflows.map((workflow, index) => (
                <div key={workflow} className="flex items-center gap-3 py-3">
                  <span className="grid size-6 place-items-center rounded-full bg-sidebar-active text-xs font-bold text-brand">
                    {index + 1}
                  </span>
                  <span className="text-sm text-muted">{workflow}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Postagem manual" href="/postagem-manual" action="Ver fila">
            <div className="grid min-h-40 place-items-center text-center">
              <div>
                <p className="text-3xl font-bold text-foreground">{overview.counts.manualPosts}</p>
                <p className="mt-2 text-sm text-muted">na fila de postagem</p>
              </div>
            </div>
          </Panel>

          <Panel title="Tags de conteúdo" href="/criar-conteudo" action="Gerenciar">
            <div className="space-y-4">
              {tagRows.slice(0, 3).map((row) => (
                <div key={row.group}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{row.group}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {row.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-muted"
                      >
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
  amber: "border-brand/30 bg-sidebar-active text-brand",
  violet: "border-violet-300/50 bg-violet-50 text-violet-600 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
  blue: "border-blue-300/50 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
};

function Panel({
  title,
  href,
  action,
  children,
}: {
  title: string;
  href: string;
  action: string;
  children: ReactNode;
}) {
  return (
    <section className="relative z-10 rounded-2xl border border-line/40 bg-surface/60 p-6 shadow-xl backdrop-blur-xl transition hover:border-line/60">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        <Link className="text-sm font-semibold text-brand hover:text-brand-strong" href={href}>
          {action}
        </Link>
      </div>
      {children}
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const classes =
    status === "completed"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
      : status === "failed"
        ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
        : status === "processing"
          ? "bg-sidebar-active text-brand"
          : "bg-surface-strong text-muted";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{statusLabel(status)}</span>;
}

function Empty({ text }: { text: string }) {
  return (
    <div className="grid min-h-28 place-items-center rounded-lg border border-dashed border-line text-sm text-muted">
      {text}
    </div>
  );
}

function formatJobTitle(type: string) {
  const translations: Record<string, string> = {
    image_generation: "Geração de imagem",
    content_generation: "Geração de conteúdo",
    caption_generation: "Geração de legenda",
    video_processing: "Processamento de vídeo",
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
    completed: "concluído",
    failed: "falhou",
  };
  return labels[status] ?? status;
}

function formatRelativeTime(value: string | null) {
  if (!value) return "sem data";
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `há ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  return `há ${Math.floor(hours / 24)}d`;
}
