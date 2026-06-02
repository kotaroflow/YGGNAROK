import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";

async function AfiliadosContent() {
  return (
    <main className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Afiliados
        </h1>
        <p className="mt-2 text-sm text-muted">
          Esta seção está em construção.
        </p>
      </div>
    </main>
  );
}

export default async function AfiliadosPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams; // Resolve searchParams

  return (
    <AppShell>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
        <AfiliadosContent />
      </Suspense>
    </AppShell>
  );
}
