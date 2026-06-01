import { AppShell } from "@/components/app-shell";
import { ContinuityMode } from "@/components/continuity-mode";

export default async function ContinuidadeIaPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams; // Resolve searchParams

  return (
    <AppShell>
      <main className="w-full px-4 py-6 lg:px-8">
        <ContinuityMode />
      </main>
    </AppShell>
  );
}
