import Link from "next/link";
import { AdminListPage, JsonPreview } from "@/components/admin-list";
import { getHealthLogs } from "@/server/data/dashboard";

export default async function HealthLogsPage({ searchParams }: { searchParams: Promise<{ status?: string; source?: string }> }) {
  const params = await searchParams;
  const logs = (await getHealthLogs()).filter((log) =>
    (!params.status || log.status === params.status) &&
    (!params.source || log.source === params.source),
  );
  const statuses = ["info", "warning", "error", "critical"];

  return (
    <AdminListPage eyebrow="作戦本部 — Sakusen Honbu" title="Health Logs" empty={!logs.length}>
      <div className="mb-4 flex flex-wrap gap-2">
        {statuses.map((status) => <Link key={status} className="rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href={`/health-logs?status=${status}`}>{status}</Link>)}
        <Link className="rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href="/health-logs">Todos</Link>
      </div>
      <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
        {logs.map((log) => (
          <article key={log.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-medium">{log.source}</h2>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">{log.status}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{log.message}</p>
            <p className="mt-1 text-xs text-stone-500">{new Date(log.created_at).toLocaleString("pt-BR")}</p>
            <JsonPreview value={log.metadata} />
          </article>
        ))}
      </div>
    </AdminListPage>
  );
}
