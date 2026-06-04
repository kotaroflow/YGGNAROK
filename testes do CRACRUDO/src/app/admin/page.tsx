import Link from "next/link";
import {
  Shield, Users, UserCog, KeyRound, Settings, ScrollText, Activity, ClipboardList,
  Server, Database, Cpu, HardDrive,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const tabs = [
  { id: "geral", label: "Geral", icon: Shield },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "cargos", label: "Cargos", icon: UserCog },
  { id: "permissoes", label: "Permissões", icon: KeyRound },
  { id: "logs", label: "Logs", icon: ScrollText },
  { id: "health", label: "Saúde", icon: Activity },
  { id: "auditoria", label: "Auditoria", icon: ClipboardList },
  { id: "config", label: "Configurações", icon: Settings },
] as const;

const systemStats = [
  { label: "API", status: "online", icon: Server },
  { label: "Banco de dados", status: "online", icon: Database },
  { label: "Workers", status: "idle", icon: Cpu },
  { label: "Storage (R2)", status: "online", icon: HardDrive },
];

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const { aba } = await searchParams;
  const activeTab = aba && tabs.some(t => t.id === aba) ? aba : "geral";

  return (
    <AppShell>
      <main className="min-h-screen text-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Operação</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Administração</h1>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Painel centralizado de administração, monitoramento e governança do YGGNAROK.
            </p>
          </div>

          {/* System Status Cards */}
          <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {systemStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 shadow-sm backdrop-blur"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10">
                  <stat.icon size={18} className="text-brand" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{stat.label}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${stat.status === "online" ? "bg-emerald-500" : "bg-amber-400"}`} />
                    <span className="text-xs text-muted capitalize">{stat.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-line bg-surface-strong p-1.5 shadow-sm">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/admin?aba=${tab.id}`}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-brand text-neutral-950 shadow-sm"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                <tab.icon size={15} />
                <span className="hidden md:inline">{tab.label}</span>
              </Link>
            ))}
          </div>

          {/* Content Area */}
          <section className="rounded-xl border border-line bg-surface p-8 shadow-sm backdrop-blur">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand">
                {(() => {
                  const Tab = tabs.find(t => t.id === activeTab);
                  return Tab ? <Tab.icon size={28} /> : <Shield size={28} />;
                })()}
              </div>
              <h2 className="mt-5 text-lg font-semibold">
                {tabs.find(t => t.id === activeTab)?.label ?? "Geral"}
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Seção administrativa em preparação. Os dados serão preenchidos conforme
                as integrações do sistema forem ativadas.
              </p>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
