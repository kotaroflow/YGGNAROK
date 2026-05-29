import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { ChatClient } from "@/components/chat-client";

export default function ChatPage() {
  return (
    <AppShell hideTopBar>
      <main className="flex h-[calc(100vh-1rem)] min-h-0 flex-col px-2 py-2 lg:px-4">
        <Suspense
          fallback={
            <div className="grid flex-1 place-items-center text-sm text-muted">Carregando chat…</div>
          }
        >
          <ChatClient />
        </Suspense>
      </main>
    </AppShell>
  );
}
