import { AppShell } from "@/components/app-shell";
import { PromptsClient } from "@/components/prompts-client";

export default function PromptsPage() {
  return (
    <AppShell>
      <main className="min-h-screen bg-background text-foreground px-4 py-8 lg:px-8">
        <PromptsClient />
      </main>
    </AppShell>
  );
}
