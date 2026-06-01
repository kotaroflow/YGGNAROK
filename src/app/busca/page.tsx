import { AppShell } from "@/components/app-shell";
import { BuscaClient } from "@/components/busca-client";

export default async function BuscaPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  return (
    <AppShell>
      <main className="min-h-screen bg-neutral-950 text-foreground px-4 py-8 lg:px-8">
        <BuscaClient />
      </main>
    </AppShell>
  );
}
