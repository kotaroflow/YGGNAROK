import { AppShell } from "@/components/app-shell";
import { BackButton } from "@/components/back-button";

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
        <BackButton />
        <p className="text-sm font-medium text-brand">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <section className="mt-6 rounded-xl border border-line bg-surface p-6 shadow-sm backdrop-blur">
          {empty ? (
            <p className="py-8 text-sm text-muted">Nenhum registro visível para esta sessão.</p>
          ) : (
            children
          )}
        </section>
      </main>
    </AppShell>
  );
}

export function JsonPreview({ value }: { value: unknown }) {
  return (
    <pre className="mt-2 max-h-36 overflow-auto rounded-lg border border-line bg-surface-strong p-3 text-xs text-muted">
      {JSON.stringify(value ?? {}, null, 2)}
    </pre>
  );
}
