import { AppShell } from "@/components/app-shell";

export default function CalendarioLoading() {
  return (
    <AppShell>
      <main className="min-h-screen text-foreground">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="h-3 w-16 animate-pulse rounded bg-surface-strong" />
              <div className="mt-2 h-7 w-64 animate-pulse rounded bg-surface-strong" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded bg-surface-strong" />
            </div>
            <div className="h-10 w-40 animate-pulse rounded-full bg-surface-strong" />
          </div>
          <div className="mb-6 h-16 animate-pulse rounded-xl border border-line bg-surface p-4" />
          <div className="h-[600px] animate-pulse rounded-xl border border-line bg-surface" />
        </div>
      </main>
    </AppShell>
  );
}
