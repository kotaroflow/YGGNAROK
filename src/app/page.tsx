import { AppShell } from "@/components/app-shell";
import { HomeScreen } from "@/components/home-screen";

export default function DashboardPage() {
  return (
    <AppShell hideTopBar>
      <main className="flex min-h-screen flex-col">
        <HomeScreen />
      </main>
    </AppShell>
  );
}
