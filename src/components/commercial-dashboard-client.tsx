"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Package, UserCheck, Link2, Megaphone, BarChart3, TrendingUp, FileBarChart,
  ArrowUpRight, DollarSign, Users, Lock, ChevronRight, Activity, CheckCircle, Play
} from "lucide-react";

// --- Types ---
type TabId = "vendas" | "produtos" | "afiliados" | "links" | "campanhas" | "comissoes" | "oportunidades" | "relatorios";

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

// --- Tab definitions ---
const TABS: TabItem[] = [
  { id: "vendas", label: "Vendas", icon: ShoppingBag, description: "Monitore faturamento, boletos, pix e transações completadas." },
  { id: "produtos", label: "Produtos", icon: Package, description: "Gerencie seu portfólio de infoprodutos, preços e ofertas." },
  { id: "afiliados", label: "Afiliados", icon: UserCheck, description: "Gerencie recrutamento, comissões de parceiros e produtores." },
  { id: "links", label: "Links", icon: Link2, description: "Rastreadores dinâmicos e encurtadores de links de checkout." },
  { id: "campanhas", label: "Campanhas", icon: Megaphone, description: "Acompanhe ROI, UTMs de campanhas de tráfego pago e orgânico." },
  { id: "comissoes", label: "Comissões", icon: BarChart3, description: "Histórico de saques e divisões de co-produção." },
  { id: "oportunidades", label: "Oportunidades", icon: TrendingUp, description: "Leads quentes e sugestões de IA para aumentar o ticket." },
  { id: "relatorios", label: "Relatórios", icon: FileBarChart, description: "Dashboard financeiro consolidado, auditorias e projeções de IA." },
];

export function CommercialDashboardClient({ initialTab = "vendas" }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState<TabId>(
    TABS.some((t) => t.id === initialTab) ? (initialTab as TabId) : "vendas"
  );

  return (
    <div className="mx-auto w-full max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in text-foreground">
      {/* 1. Header */}
      <CommercialHeader />

      {/* 2. Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Receita do mês"
          value="R$ 0,00"
          status="Aguardando vendas"
          chip="Sem dados"
          icon={DollarSign}
        />
        <MetricCard
          title="Clientes ativos"
          value="0"
          status="Nenhum cliente conectado"
          chip="Sem dados"
          icon={Users}
        />
        <MetricCard
          title="Conversão"
          value="0%"
          status="Conecte campanhas para calcular"
          chip="Pendente"
          icon={TrendingUp}
        />
        <MetricCard
          title="Ticket médio"
          value="R$ 0,00"
          status="Calculado após vendas"
          chip="Pendente"
          icon={Activity}
        />
      </div>

      {/* 3. Navigation Tabs */}
      <CommercialTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* 4. Tab Content Area */}
      <div className="transition-all duration-300">
        {activeTab === "relatorios" ? (
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            {/* Left: Empty State & Checklist (takes 2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              <ReportsEmptyState />
              <IntegrationChecklist />
            </div>

            {/* Right: Ghost Previews */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-muted uppercase tracking-wider block">
                Visualização de Relatórios (Bloqueado)
              </span>
              <ReportPreviewCard
                title="Projeção de Receita Mensal"
                description="Tendência e previsão acumulada de vendas recomendada por IA."
                type="chart"
              />
              <ReportPreviewCard
                title="Funil de Vendas YGG"
                description="Taxa de atrito do checkout e abandono de carrinho em tempo real."
                type="funnel"
              />
              <ReportPreviewCard
                title="Ranking de Campanhas ROI"
                description="Listagem de campanhas ordenadas por custo por aquisição."
                type="list"
              />
            </div>
          </div>
        ) : (
          <GenericTabEmptyState tab={TABS.find((t) => t.id === activeTab)!} />
        )}
      </div>
    </div>
  );
}

// --- 1. Commercial Header Component ---
function CommercialHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-line pb-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-brand" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">MERCADO</p>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
          Painel Comercial
        </h1>
        <p className="mt-1 text-sm text-muted">
          Vendas, afiliados, campanhas e métricas de monetização do ecossistema YGGNAROK.
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <Link
          href="/campanhas/nova"
          className="rounded-xl border border-line bg-surface-strong/30 hover:border-brand/30 hover:text-brand px-4 py-2.5 text-xs font-bold transition shadow-sm"
        >
          Nova campanha
        </Link>
        <Link
          href="/integracoes"
          className="flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-5 py-2.5 text-xs font-bold transition shadow-md shadow-brand/10"
        >
          Conectar integrações
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// --- 2. Metric Card Component ---
interface MetricCardProps {
  title: string;
  value: string;
  status: string;
  chip: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

function MetricCard({ title, value, status, chip, icon: Icon }: MetricCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/70 p-5 hover:border-brand/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.05)] transition-all duration-300 flex flex-col justify-between min-h-[140px]">
      {/* Decorative Glow */}
      <div className="absolute -right-4 -top-4 size-20 rounded-full bg-brand/5 blur-xl group-hover:bg-brand/10 transition-all duration-300 pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="size-10 rounded-xl bg-surface/50 border border-line flex items-center justify-center text-brand">
          <Icon size={18} />
        </div>
        <span className="rounded-full bg-white/[0.04] border border-white/5 px-2.5 py-1 text-[10px] font-bold text-muted select-none">
          {chip}
        </span>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-2xl font-black tracking-tight text-foreground">{value}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <span className="size-1.5 rounded-full bg-amber-500/50" />
          <p className="truncate">{title} · {status}</p>
        </div>
      </div>
    </div>
  );
}

// --- 3. Commercial Tabs Navigation ---
interface CommercialTabsProps {
  activeTab: TabId;
  onChange: (id: TabId) => void;
}

function CommercialTabs({ activeTab, onChange }: CommercialTabsProps) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-1.5 flex gap-1 overflow-x-auto scrollbar-none shadow-inner">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap border ${
              isActive
                ? "bg-brand/15 text-brand border-brand/20 shadow-sm"
                : "text-muted border-transparent hover:text-foreground hover:bg-white/[0.04]"
            }`}
          >
            <Icon size={14} className={isActive ? "text-brand" : "text-muted"} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// --- 4. Reports Empty State Component ---
function ReportsEmptyState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950/40 p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6 backdrop-blur">
      <div className="size-16 rounded-2xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(245,158,11,0.08)]">
        <FileBarChart size={28} className="animate-pulse" />
      </div>

      <div className="space-y-4 text-center md:text-left flex-grow">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            Relatórios ainda não estão conectados
          </h3>
          <p className="text-xs text-muted leading-relaxed max-w-xl">
            Conecte suas contas de vendas (Pix, Boleto, Checkout), afiliados ou campanhas rastreadas para gerar relatórios robustos de receita consolidada, conversão e desempenho técnico no YGGNAROK.
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
          <Link
            href="/integracoes"
            className="flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-4.5 py-2 text-xs font-bold transition shadow-sm"
          >
            Conectar integrações
            <ArrowUpRight size={13} />
          </Link>
          <button
            type="button"
            onClick={() => alert("Estrutura YGGNAROK LTM: Relatórios consolidam dados das APIs Hotmart, Kiwify e Stripe via Webhooks unificados.")}
            className="rounded-xl border border-line bg-surface/50 hover:bg-surface-strong px-4.5 py-2 text-xs font-bold text-muted hover:text-foreground transition"
          >
            Ver estrutura de relatórios
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 5. Integration Checklist Component ---
function IntegrationChecklist() {
  const items = [
    { label: "Integração de vendas (Hotmart, Kiwify, Stripe)", desc: "Webhook de transações PIX/Boleto e checkout externo." },
    { label: "Fontes de afiliados e parceiros", desc: "Sincronização de co-produção e relatórios de produtores." },
    { label: "Campanhas rastreadas e UTMs", desc: "Mapeamento automático de cliques de tráfego pago." },
    { label: "Eventos de conversão e pixel", desc: "Auditoria ativa de disparos de pixels de remarketing." },
  ];

  return (
    <div className="rounded-2xl border border-line bg-surface/20 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Activity size={14} className="text-brand" />
        <span className="text-xs font-bold text-muted uppercase tracking-wider">
          Checklist de Requisitos Comerciais
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-xl border border-line bg-neutral-900/40 p-4 space-y-2 hover:border-white/10 transition">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold text-foreground">{item.label}</p>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/20 text-brand text-[9px] font-bold px-2 py-0.5 select-none shrink-0">
                Pendente
              </span>
            </div>
            <p className="text-[10px] text-muted leading-normal">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 6. Ghost Preview Cards Component ---
interface PreviewCardProps {
  title: string;
  description: string;
  type: "chart" | "funnel" | "list";
}

function ReportPreviewCard({ title, description, type }: PreviewCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-neutral-950/50 p-5 space-y-4 relative overflow-hidden group select-none hover:border-white/15 transition-all duration-300">
      {/* Locked Overlay */}
      <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="bg-surface border border-line rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-xl">
          <Lock size={12} className="text-brand" />
          <span className="text-[10px] font-bold text-foreground">Conecte Integrações para Liberar</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-foreground">{title}</h4>
          <p className="text-[10px] text-muted leading-relaxed truncate max-w-[210px]">{description}</p>
        </div>
        <Lock size={12} className="text-muted shrink-0" />
      </div>

      {/* Render dummy visuals based on type */}
      {type === "chart" && (
        <div className="h-20 w-full flex items-end gap-1.5 pt-2 opacity-25">
          {[30, 45, 25, 60, 40, 80, 55, 90, 75, 100].map((h, idx) => (
            <div
              key={idx}
              className="flex-1 bg-gradient-to-t from-brand/20 to-brand rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      )}

      {type === "funnel" && (
        <div className="space-y-1.5 pt-2 opacity-20">
          <div className="h-3 w-full bg-brand rounded-md text-[8px] flex items-center justify-center font-bold text-neutral-950">Visualizações (100%)</div>
          <div className="h-3 w-[80%] bg-brand/80 rounded-md mx-auto text-[8px] flex items-center justify-center font-bold text-neutral-950">Checkout (80%)</div>
          <div className="h-3 w-[50%] bg-brand/60 rounded-md mx-auto text-[8px] flex items-center justify-center font-bold text-neutral-950">Compras (50%)</div>
        </div>
      )}

      {type === "list" && (
        <div className="space-y-1.5 pt-2 opacity-20 font-mono text-[8px] text-muted">
          <div className="flex items-center justify-between border-b border-line pb-1">
            <span>1. Campanha_Lançamento_YGG</span>
            <span className="text-brand">ROI: 4.8x</span>
          </div>
          <div className="flex items-center justify-between border-b border-line pb-1">
            <span>2. Remarketing_Instagram_Warm</span>
            <span className="text-brand">ROI: 3.2x</span>
          </div>
          <div className="flex items-center justify-between">
            <span>3. YouTube_Organic_Shorts</span>
            <span className="text-brand">ROI: 2.9x</span>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 7. Generic Tab Empty State Component ---
function GenericTabEmptyState({ tab }: { tab: TabItem }) {
  const Icon = tab.icon;

  return (
    <div className="rounded-2xl border border-line bg-surface p-12 shadow-md relative overflow-hidden backdrop-blur flex flex-col items-center justify-center text-center animate-alert-pop">
      <div className="size-16 rounded-2xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shrink-0">
        <Icon size={28} />
      </div>
      
      <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">
        Área de {tab.label}
      </h3>
      <p className="mt-2 max-w-md text-xs text-muted leading-relaxed">
        {tab.description} Configure e autentique suas integrações comerciais para que o YGGNAROK consiga alimentar este painel com informações em tempo real.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href="/integracoes"
          className="flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-4.5 py-2.5 text-xs font-bold transition shadow-sm"
        >
          Conectar integrações
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
