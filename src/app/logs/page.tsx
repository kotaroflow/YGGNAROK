import Link from "next/link";
import { AdminListPage } from "@/components/admin-list";
import { getAgentRuns } from "@/server/data/dashboard";
import type { AgentRun } from "@/types/dashboard";

export default async function LogsPage({ searchParams }: { searchParams: Promise<{ status?: string; agent?: string }> }) {
  const params = await searchParams;
  const runs = (await getAgentRuns()).filter((run) =>
    (!params.status || run.status === params.status) &&
    (!params.agent || run.agent_key === params.agent),
  );

  return (
    <AdminListPage eyebrow="作戦本部 — Sakusen Honbu" title="Logs" empty={!runs.length}>
      <div className="mb-4 flex flex-wrap gap-2">
        {["completed", "failed", "processing"].map((status) => <Link key={status} className="rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href={`/logs?status=${status}`}>{status}</Link>)}
        <Link className="rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href="/logs">Todos</Link>
      </div>
      <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
        {runs.map((run) => (
          <article key={run.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-medium">{run.agent_key} · {run.module}</h2>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">{run.status}</span>
            </div>
            {run.job_id ? <Link className="mt-1 block text-sm text-amber-700 dark:text-amber-300" href={`/jobs/${run.job_id}`}>Abrir job {run.job_id}</Link> : null}
            {run.error_message ? <p className="mt-2 text-sm text-red-700 dark:text-red-300">{run.error_message}</p> : null}
            <p className="mt-1 text-xs text-stone-500">{new Date(run.created_at || '').toLocaleString("pt-BR")}</p>
          </article>
        ))}
      </div>
    </AdminListPage>
  );
}
