import Link from "next/link";
import { AdminListPage } from "@/components/admin-list";
import { getDashboardCounts } from "@/server/data/dashboard";

export default async function SistemaPage() {
  const counts = await getDashboardCounts();

  return (
    <AdminListPage eyebrow="作戦本部 — Sakusen Honbu" title="Sistema" empty={false}>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Perfis" value={counts.profiles} />
        <Metric label="Jobs ativos" value={counts.pendingJobs} />
        <Metric label="Postagens manuais" value={counts.manualPosts} />
        <Metric label="Alertas" value={counts.alerts} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded-full border border-white/80 bg-white/55 px-5 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href="/workers">Workers</Link>
        <Link className="rounded-full border border-white/80 bg-white/55 px-5 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href="/momonga">Momonga</Link>
        <Link className="rounded-full border border-white/80 bg-white/55 px-5 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href="/health-logs">Health Logs</Link>
        <Link className="rounded-full border border-white/80 bg-white/55 px-5 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href="/audit-logs">Audit Logs</Link>
      </div>
    </AdminListPage>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
