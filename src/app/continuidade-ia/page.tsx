import { AppShell } from "@/components/app-shell";
import { ContinuityMode } from "@/components/continuity-mode";

export default function ContinuidadeIaPage() {
  return (
    <AppShell>
      <main className="w-full px-4 py-6 lg:px-8">
        <ContinuityMode />
      </main>
    </AppShell>
  );
}
