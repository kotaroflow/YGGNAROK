import { AppShell } from "@/components/app-shell";
import { IntegracoesClient } from "@/components/integracoes-client";

export default async function IntegracoesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  return (
    <AppShell>
      <IntegracoesClient />
    </AppShell>
  );
}
