import { AppShell } from "@/components/app-shell";

export default async function LinksPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams; // Resolve searchParams

  return (
    <AppShell>
      <main className="min-h-screen px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Links
          </h1>
          <p className="mt-2 text-sm text-muted">
            Esta seção está em construção.
          </p>
        </div>
      </main>
    </AppShell>
  );
}
