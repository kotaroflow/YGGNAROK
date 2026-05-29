import Link from "next/link";
import {
  ShoppingBag, Package, UserCheck, Link2, Megaphone, BarChart3, TrendingUp, FileBarChart,
  ArrowUpRight, DollarSign, Users, TrendingDown,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";

const tabs = [
  { id: "vendas", label: "Vendas", icon: ShoppingBag },
  { id: "produtos", label: "Produtos", icon: Package },
  { id: "afiliados", label: "Afiliados", icon: UserCheck },
  { id: "links", label: "Links", icon: Link2 },
  { id: "campanhas", label: "Campanhas", icon: Megaphone },
  { id: "comissoes", label: "Comissões", icon: BarChart3 },
  { id: "oportunidades", label: "Oportunidades", icon: TrendingUp },
  { id: "relatorios", label: "Relatórios", icon: FileBarChart },
] as const;

const kpis = [
  { label: "Receita do mês", value: "R$ 0,00", change: "+0%", positive: true, icon: DollarSign },
  { label: "Clientes ativos", value: "0", change: "—", positive: true, icon: Users },
  { label: "Conversão", value: "0%", change: "—", positive: true, icon: TrendingUp },
  { label: "Ticket médio", value: "R$ 0,00", change: "—", positive: false, icon: TrendingDown },
];

export default async function ComercialPage({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const { aba } = await searchParams;
  const activeTab = aba && tabs.some(t => t.id === aba) ? aba : "vendas";

  return (
    <AppShell>
      <main className="min-h-screen text-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Mercado</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Painel Comercial</h1>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Vendas, afiliados, campanhas e métricas de monetização do YGGNAROK.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="group relative overflow-hidden rounded-xl border border-line bg-surface p-5 shadow-sm backdrop-blur transition hover:border-brand/30 hover:shadow-md"
              >
                <div className="absolute -right-4 -top-4 size-20 rounded-full bg-brand/5 transition group-hover:bg-brand/10" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <kpi.icon size={18} className="text-brand" />
                    <span className={`text-xs font-semibold ${kpi.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
                      {kpi.change}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-bold tracking-tight">{kpi.value}</p>
                  <p className="mt-1 text-xs text-muted">{kpi.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-line bg-surface-strong p-1.5 shadow-sm">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/comercial?aba=${tab.id}`}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-brand text-neutral-950 shadow-sm"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                <tab.icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </Link>
            ))}
          </div>

          {/* Content Area */}
          <section className="rounded-xl border border-line bg-surface p-8 shadow-sm backdrop-blur">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand">
                {(() => {
                  const Tab = tabs.find(t => t.id === activeTab);
                  return Tab ? <Tab.icon size={28} /> : <ShoppingBag size={28} />;
                })()}
              </div>
              <h2 className="mt-5 text-lg font-semibold">
                {tabs.find(t => t.id === activeTab)?.label ?? "Vendas"}
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Esta seção será conectada aos seus dados de vendas e integrações comerciais.
                Configure suas integrações para começar a visualizar métricas reais.
              </p>
              <Link
                href="/integracoes"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-brand-strong"
              >
                Conectar integrações
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
