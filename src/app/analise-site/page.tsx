import { AppShell } from "@/components/app-shell";
import { AnaliseSiteClient } from "@/components/analise-site-client";

export default function AnaliseSitePage() {
  return (
    <AppShell>
      <main className="min-h-screen text-foreground relative overflow-hidden bg-radial-gradient">
        <AnaliseSiteClient />
      </main>
    </AppShell>
  );
}
