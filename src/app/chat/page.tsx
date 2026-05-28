import { AppShell } from "@/components/app-shell";
import { ChatClient } from "@/components/chat-client";

export default function ChatPage() {
  return (
    <AppShell>
      <main className="w-full px-4 py-6 lg:px-8">
        <ChatClient />
      </main>
    </AppShell>
  );
}

