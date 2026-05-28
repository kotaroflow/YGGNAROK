import { AppShell } from "@/components/app-shell";

export function AdminListPage({
  eyebrow,
  title,
  empty,
  children,
}: {
  eyebrow: string;
  title: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-stone-50">{title}</h1>
        <section className="mt-6 rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          {empty ? <p className="py-8 text-sm text-stone-500">Nenhum registro visível para esta sessão.</p> : children}
        </section>
      </main>
    </AppShell>
  );
}

export function JsonPreview({ value }: { value: unknown }) {
  return (
    <pre className="mt-2 max-h-36 overflow-auto rounded-lg border border-white/70 bg-white/60 p-3 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-neutral-950/60 dark:text-neutral-300">
      {JSON.stringify(value ?? {}, null, 2)}
    </pre>
  );
}
