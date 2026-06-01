import { AdminListPage } from "@/components/admin-list";
import { getRolesAndPermissions } from "@/server/data/dashboard";

export default async function PermissoesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  const { permissions } = await getRolesAndPermissions();

  return (
    <AdminListPage eyebrow="作戦本部 — Sakusen Honbu" title="Permissões" empty={!permissions.length}>
      <div className="grid gap-3 md:grid-cols-2">
        {permissions.map((permission) => (
          <article key={permission.id} className="rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
            <h2 className="font-medium">{permission.key}</h2>
            <p className="mt-1 text-sm text-stone-500">{permission.module}</p>
            <p className="mt-2 text-sm text-muted">{permission.description}</p>
          </article>
        ))}
      </div>
    </AdminListPage>
  );
}
