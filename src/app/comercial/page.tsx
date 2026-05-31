import { AppShell } from "@/components/app-shell";
import { CommercialDashboardClient } from "@/components/commercial-dashboard-client";

export default async function ComercialPage({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const { aba } = await searchParams;

  return (
    <AppShell>
      <main className="min-h-screen text-foreground bg-neutral-950/20">
        <CommercialDashboardClient initialTab={aba} />
      </main>
    </AppShell>
  );
}
