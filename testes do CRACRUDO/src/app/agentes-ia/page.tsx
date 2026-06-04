import { AppShell } from "@/components/app-shell";
import { AgentesIaClient } from "@/components/agentes-ia-client";

export default async function AgentesIaPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  return (
    <AppShell>
      <AgentesIaClient />
    </AppShell>
  );
}
