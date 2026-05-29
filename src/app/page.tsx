import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, FileText, LayoutDashboard, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { HomeScreen } from "@/components/home-screen";
import { getDashboardOverview } from "@/server/data/dashboard";

export default async function HomePage() {
  const overview = await getDashboardOverview();

  const quickStats = [
    { label: "Perfis", value: overview.counts.profiles, href: "/perfis", icon: Users },
    { label: "Jobs", value: overview.counts.pendingJobs, href: "/jobs-em-andamento", icon: BriefcaseBusiness },
    { label: "Postagens", value: overview.counts.manualPosts, href: "/postagem-manual", icon: FileText },
  ];

  return (
    <AppShell hideTopBar>
      <main className="flex min-h-[calc(100vh-1rem)] flex-col">
        <div className="flex flex-1 flex-col justify-center">
          <HomeScreen />
        </div>

        <section className="shrink-0 border-t border-line bg-surface/60 px-4 py-5 backdrop-blur lg:px-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              {quickStats.map((stat) => (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-strong px-4 py-2 text-sm transition hover:border-brand/40"
                >
                  <stat.icon size={15} className="text-brand" />
                  <span className="font-semibold text-foreground">{stat.value}</span>
                  <span className="text-muted">{stat.label}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/painel"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-brand-strong"
            >
              <LayoutDashboard size={16} />
              Painel operacional
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
