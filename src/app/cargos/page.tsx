import { AdminListPage } from "@/components/admin-list";
import { getRolesAndPermissions } from "@/server/data/dashboard";

export default async function CargosPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  const { roles } = await getRolesAndPermissions();

  return (
    <AdminListPage eyebrow="作戦本部 — Sakusen Honbu" title="Cargos" empty={!roles.length}>
      <div className="grid gap-3 md:grid-cols-2">
        {roles.map((role) => (
          <article key={role.id} className="rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
            <h2 className="font-medium">{role.name}</h2>
            <p className="mt-1 text-sm text-stone-500">{role.key}</p>
            <p className="mt-2 text-sm text-muted">{role.description}</p>
          </article>
        ))}
      </div>
    </AdminListPage>
  );
}
