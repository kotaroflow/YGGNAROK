import { AdminListPage } from "@/components/admin-list";
import { getAuditLogs } from "@/server/data/dashboard";

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <AdminListPage eyebrow="作戦本部 — Sakusen Honbu" title="Audit Logs" empty={!logs.length}>
      <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
        {logs.map((log) => (
          <article key={log.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-medium">{log.action}</h2>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">{log.resource_type || "recurso"}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{log.reason || "Sem motivo informado."}</p>
            <p className="mt-1 text-xs text-stone-500">{new Date(String(log.created_at)).toLocaleString("pt-BR")}</p>
          </article>
        ))}
      </div>
    </AdminListPage>
  );
}
