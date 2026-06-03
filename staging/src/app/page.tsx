import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ChatClient } from "@/components/chat-client";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;

  return (
    <AppShell hideTopBar>
      <main className="flex h-[calc(100vh-1rem)] min-h-0 flex-col px-2 py-2 lg:px-4">
        <Suspense
          fallback={
            <div className="grid flex-1 place-items-center text-sm text-muted">Carregando assistente…</div>
          }
        >
          <ChatClient />
        </Suspense>
      </main>
    </AppShell>
  );
}
