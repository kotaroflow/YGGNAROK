import { AppShell } from "@/components/app-shell";
import { AgentNodeStudio } from "@/components/agent-node-studio";

export default function AgentesIaPage() {
  return (
    <AppShell>
      <main className="w-full px-4 py-6 lg:px-8">
        <AgentNodeStudio />
      </main>
    </AppShell>
  );
}
