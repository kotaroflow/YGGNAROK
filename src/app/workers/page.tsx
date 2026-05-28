import { AdminListPage } from "@/components/admin-list";
import { getHealthLogs, getJobs } from "@/server/data/dashboard";

export default async function WorkersPage() {
  const [logs, jobs] = await Promise.all([getHealthLogs(), getJobs()]);
  const pending = jobs.filter((job) => job.status === "pending").length;
  const processing = jobs.filter((job) => job.status === "processing").length;
  const latest = logs[0];

  return (
    <AdminListPage eyebrow="作戦本部 — Sakusen Honbu" title="Workers" empty={false}>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Runner externo" value="Cloudflare Cron" />
        <Metric label="Jobs pendentes" value={String(pending)} />
        <Metric label="Jobs processando" value={String(processing)} />
      </div>
      <div className="mt-6 rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
        <h2 className="font-medium">Último health log</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-stone-300">{latest?.message ?? "Sem logs visíveis."}</p>
      </div>
    </AdminListPage>
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
