"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag, Package, UserCheck, Link2, Megaphone, BarChart3, TrendingUp, FileBarChart,
  ArrowUpRight, DollarSign, Users, Lock, Activity,
  Search, Plus, Trash2, Edit2, Check, Copy, Sparkles
} from "lucide-react";

// --- Types & Interfaces ---
type TabId = "vendas" | "produtos" | "afiliados" | "links" | "campanhas" | "comissoes" | "oportunidades" | "relatorios";

interface SaleItem { id: string; client: string; product: string; value: number; status: string; date: string; }
interface ProductItem { id: string; name: string; price: number; sales: number; status: string; }
interface AffiliateItem { id: string; name: string; commission: number; status: string; }
interface PayoutItem { id: string; amount: number; date: string; pixKey: string; status: string; }
interface OpportunityItem { id: string; title: string; description: string; impact: string; effort: string; type: string; }

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

  // --- Dynamic Dashboard States ---
  const [toast, setToast] = useState<{ message: string; type: "success" | "warning" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "warning" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Metric Cards States (updated dynamically by actions)
  const [conversionRate, setConversionRate] = useState(0);

  // 2. Sales list state
  const [salesList] = useState<{
    id: string; client: string; email: string; product: string;
    value: number; method: string; status: string; date: string;
  }[]>([]);

  // 3. Products list state
  const [productsList, setProductsList] = useState<{
    id: string; name: string; price: number; sales: number; status: string;
  }[]>([]);

  // 4. Affiliates state
  const [affiliatesList, setAffiliatesList] = useState<{
    id: string; name: string; commission: number; clicks: number; sales: number; unpaid: number;
  }[]>([]);

  // 5. Commissions state
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance] = useState(0);
  const [payoutsHistory, setPayoutsHistory] = useState<{
    id: string; value: number; status: string; date: string; method: string;
  }[]>([]);

  // 6. Opportunities / AI Insights State
  const [opportunities, setOpportunities] = useState<{
    id: string; title: string; desc: string; impact: string; status: string;
  }[]>([]);

  // Derive metrics directly from salesList
  const approvedSales = salesList.filter(s => s.status === "Aprovada");
  const derivedRevenue = approvedSales.reduce((acc, curr) => acc + curr.value, 0);
  const derivedClients = approvedSales.length;
  const derivedTicket = derivedClients > 0 ? derivedRevenue / derivedClients : 0;

  return (
    <div className="mx-auto w-full max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in text-foreground relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-950 border border-brand/40 text-foreground px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-alert-pop">
          <div className="size-2 rounded-full bg-brand animate-ping" />
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

      {/* 1. Header */}
      <CommercialHeader />

      {/* 2. Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Receita do mês"
          value={derivedRevenue > 0 ? `R$ ${derivedRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "R$ 0,00"}
          status={derivedRevenue > 0 ? "Alimentado por integrações" : "Aguardando vendas"}
          chip={derivedRevenue > 0 ? "Real" : "Sem dados"}
          icon={DollarSign}
        />
        <MetricCard
          title="Clientes ativos"
          value={derivedClients.toString()}
          status={derivedClients > 0 ? "Clientes logados/compras" : "Nenhum cliente conectado"}
          chip={derivedClients > 0 ? "Ativo" : "Sem dados"}
          icon={Users}
        />
        <MetricCard
          title="Conversão"
          value={conversionRate > 0 ? `${conversionRate}%` : "0%"}
          status={conversionRate > 0 ? "Taxa otimizada por IA" : "Conecte campanhas para calcular"}
          chip={conversionRate > 0 ? "Otimizado" : "Pendente"}
          icon={TrendingUp}
        />
        <MetricCard
          title="Ticket médio"
          value={derivedTicket > 0 ? `R$ ${derivedTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "R$ 0,00"}
          status={derivedTicket > 0 ? "Consolidado em tempo real" : "Calculado após vendas"}
          chip={derivedTicket > 0 ? "Atualizado" : "Pendente"}
          icon={Activity}
        />
      </div>

      {/* 3. Navigation Tabs */}
      <CommercialTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* 4. Tab Content Area */}
      <div className="transition-all duration-300">
        {activeTab === "vendas" && (
          <VendasTabContent salesList={salesList} />
        )}

        {activeTab === "produtos" && (
          <ProdutosTabContent productsList={productsList} setProductsList={setProductsList} showToast={showToast} />
        )}

        {activeTab === "afiliados" && (
          <AfiliadosTabContent affiliatesList={affiliatesList} setAffiliatesList={setAffiliatesList} showToast={showToast} />
        )}

        {activeTab === "links" && (
          <LinksTabContent showToast={showToast} />
        )}

        {activeTab === "campanhas" && (
          <CampanhasTabContent setConversionRate={setConversionRate} showToast={showToast} />
        )}

        {activeTab === "comissoes" && (
          <ComissoesTabContent
            availableBalance={availableBalance}
            setAvailableBalance={setAvailableBalance}
            pendingBalance={pendingBalance}
            payoutsHistory={payoutsHistory}
            setPayoutsHistory={setPayoutsHistory}
            showToast={showToast}
          />
        )}

        {activeTab === "oportunidades" && (
          <OportunidadesTabContent
            opportunities={opportunities}
            setOpportunities={setOpportunities}
            setConversionRate={setConversionRate}
            showToast={showToast}
          />
        )}

        {activeTab === "relatorios" && (
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            {/* Left: Empty State & Checklist (takes 2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              <ReportsEmptyState showToast={showToast} />
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
        )}
      </div>
    </div>
  );
}

// --- 1. Commercial Header Component ---
function CommercialHeader() {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-1.5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 w-full shadow-inner">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition whitespace-nowrap border w-full ${
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

// --- TAB CONTENT 1: VENDAS (Stateful & Functional) ---
interface VendasTabProps {
  salesList: SaleItem[];
}

function VendasTabContent({ salesList }: VendasTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filteredSales = useMemo(() => {
    return salesList.filter(sale => {
      const matchSearch = sale.client.toLowerCase().includes(search.toLowerCase()) || 
                          sale.product.toLowerCase().includes(search.toLowerCase()) ||
                          sale.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || sale.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [salesList, search, statusFilter]);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Transações Comerciais</h3>
          <p className="text-xs text-muted">Acompanhe o fluxo de faturamento, status de pagamentos e transações comerciais em tempo real.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
          <input
            type="text"
            placeholder="Buscar por cliente, produto ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-line bg-surface-strong text-xs text-foreground placeholder:text-muted outline-none transition focus:border-brand/35"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted whitespace-nowrap">Filtrar por:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-line bg-surface-strong text-xs text-foreground px-3 outline-none focus:border-brand/35 transition cursor-pointer"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Aprovada">Aprovada</option>
            <option value="Pendente">Pendente</option>
          </select>
        </div>
      </div>

      {/* Sales List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="pb-3 font-semibold">ID</th>
              <th className="pb-3 font-semibold">Cliente</th>
              <th className="pb-3 font-semibold">Produto</th>
              <th className="pb-3 font-semibold">Valor</th>
              <th className="pb-3 font-semibold">Método</th>
              <th className="pb-3 font-semibold">Data</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="py-3.5 font-mono text-muted">{sale.id}</td>
                <td className="py-3.5">
                  <div className="font-semibold text-foreground">{sale.client}</div>
                  <div className="text-[10px] text-muted">{sale.email}</div>
                </td>
                <td className="py-3.5 text-muted">{sale.product}</td>
                <td className="py-3.5 font-bold text-foreground">R$ {sale.value.toFixed(2)}</td>
                <td className="py-3.5 text-muted">{sale.method}</td>
                <td className="py-3.5 text-muted">{sale.date}</td>
                <td className="py-3.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    sale.status === "Aprovada" 
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                      : "bg-amber-500/10 border border-amber-500/20 text-brand"
                  }`}>
                    <span className={`size-1 rounded-full ${sale.status === "Aprovada" ? "bg-emerald-400" : "bg-brand"}`} />
                    {sale.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredSales.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-muted">
                  Nenhuma transação encontrada com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- TAB CONTENT 2: PRODUTOS (Stateful & Functional Add/Delete) ---
interface ProdutosTabProps {
  productsList: ProductItem[];
  setProductsList: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  showToast: (message: string, type?: "success" | "warning" | "info") => void;
}

function ProdutosTabContent({ productsList, setProductsList, showToast }: ProdutosTabProps) {
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStatus, setNewProductStatus] = useState("Ativo");
  const [isAdding, setIsAdding] = useState(false);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) {
      showToast("Preencha todos os campos do produto!", "warning");
      return;
    }

    const priceNum = parseFloat(newProductPrice.replace(",", "."));
    if (isNaN(priceNum)) {
      showToast("Preço inválido!", "warning");
      return;
    }

    const newProd = {
      id: `prod-${Math.floor(100 + Math.random() * 900)}`,
      name: newProductName,
      price: priceNum,
      sales: 0,
      status: newProductStatus,
    };

    setProductsList(prev => [...prev, newProd]);
    setNewProductName("");
    setNewProductPrice("");
    setIsAdding(false);
    showToast(`Produto '${newProductName}' criado e listado com sucesso!`);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setProductsList(prev => prev.filter(p => p.id !== id));
    showToast(`Produto '${name}' removido.`);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Portfólio de Infoprodutos</h3>
          <p className="text-xs text-muted">Gerencie preços, status e acompanhe o volume total de cópias vendidas.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-4 py-2.5 text-xs font-bold transition shadow-sm"
        >
          <Plus size={14} />
          {isAdding ? "Cancelar" : "Adicionar Produto"}
        </button>
      </div>

      {/* Add Product Inline Form */}
      {isAdding && (
        <form onSubmit={handleCreateProduct} className="rounded-xl border border-line bg-surface-strong/30 p-5 space-y-4 animate-alert-pop">
          <h4 className="text-xs font-bold text-brand uppercase tracking-wider">Novo Infoproduto</h4>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted uppercase">Nome do Infoproduto</label>
              <input
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Ex: Formação Council of IAs"
                className="w-full h-10 px-3 rounded-xl border border-line bg-surface text-xs text-foreground outline-none focus:border-brand/35 transition"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted uppercase">Preço (R$)</label>
              <input
                type="text"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                placeholder="Ex: 497,00"
                className="w-full h-10 px-3 rounded-xl border border-line bg-surface text-xs text-foreground outline-none focus:border-brand/35 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted uppercase">Status Inicial</label>
              <select
                value={newProductStatus}
                onChange={(e) => setNewProductStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-line bg-surface text-xs text-foreground outline-none focus:border-brand/35 transition cursor-pointer"
              >
                <option value="Ativo">Ativo (Pronto para Checkout)</option>
                <option value="Rascunho">Rascunho (Privado)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-4.5 py-2 text-xs font-bold transition shadow-sm ml-auto"
          >
            Cadastrar Produto
          </button>
        </form>
      )}

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productsList.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-dashed border-line bg-surface-strong/20 p-10 text-center">
            <Package size={32} className="mx-auto text-muted mb-3" />
            <p className="text-sm font-bold text-foreground">Nenhum produto cadastrado</p>
            <p className="text-xs text-muted mt-1">Clique em &quot;Adicionar Produto&quot; para criar seu primeiro infoproduto.</p>
          </div>
        ) : productsList.map((product) => (
          <div key={product.id} className="rounded-xl border border-line bg-neutral-900/40 p-5 space-y-4 hover:border-brand/20 transition-all flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                  product.status === "Ativo" 
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                    : "bg-white/[0.04] border border-white/5 text-muted"
                }`}>
                  {product.status}
                </span>
                <span className="text-[10px] font-mono text-muted">{product.id}</span>
              </div>
              <h4 className="text-sm font-bold text-foreground">{product.name}</h4>
            </div>

            <div className="flex items-end justify-between pt-4 border-t border-line/60">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Preço de Venda</p>
                <p className="text-base font-black text-brand">R$ {product.price.toFixed(2)}</p>
              </div>
              
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Vendas</p>
                  <p className="text-xs font-bold text-foreground">{product.sales} un</p>
                </div>

                <button
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  className="size-8 rounded-lg border border-line bg-surface hover:border-red-500/30 hover:bg-red-500/10 text-muted hover:text-red-400 flex items-center justify-center transition"
                  title="Excluir produto"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TAB CONTENT 3: AFILIADOS (Stateful Commission Editor) ---
interface AfiliadosTabProps {
  affiliatesList: AffiliateItem[];
  setAffiliatesList: React.Dispatch<React.SetStateAction<AffiliateItem[]>>;
  showToast: (message: string, type?: "success" | "warning" | "info") => void;
}

function AfiliadosTabContent({ affiliatesList, setAffiliatesList, showToast }: AfiliadosTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempCommission, setTempCommission] = useState("");

  const handleUpdateCommission = (id: string, name: string) => {
    const valNum = parseInt(tempCommission);
    if (isNaN(valNum) || valNum <= 0 || valNum > 100) {
      showToast("Comissão precisa ser entre 1% e 100%!", "warning");
      return;
    }

    setAffiliatesList(prev => prev.map(af => {
      if (af.id === id) {
        return { ...af, commission: valNum };
      }
      return af;
    }));
    setEditingId(null);
    showToast(`Comissão de '${name}' alterada para ${valNum}% com sucesso!`);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 space-y-6 shadow-xl">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Afiliados & Coprodutores</h3>
        <p className="text-xs text-muted">Controle regras de divisão de receitas e audite cliques e conversões de afiliados parceiros.</p>
      </div>

      <div className="space-y-3">
        {affiliatesList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-surface-strong/20 p-10 text-center">
            <UserCheck size={32} className="mx-auto text-muted mb-3" />
            <p className="text-sm font-bold text-foreground">Nenhum afiliado cadastrado</p>
            <p className="text-xs text-muted mt-1">Os afiliados aparecerão aqui quando integrados às plataformas de vendas.</p>
          </div>
        ) : affiliatesList.map((af) => (
          <div key={af.id} className="rounded-xl border border-line bg-neutral-900/30 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/10 transition">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">{af.name}</p>
                <span className="text-[10px] font-mono text-muted bg-surface-strong px-2 py-0.5 rounded border border-line">ID: {af.id}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span>Cliques: <strong className="text-foreground">{af.clicks}</strong></span>
                <span>Vendas: <strong className="text-foreground">{af.sales}</strong></span>
                <span>Conversão: <strong className="text-foreground">{af.clicks > 0 ? ((af.sales / af.clicks) * 100).toFixed(1) : "0.0"}%</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-6 self-end md:self-auto">
              <div className="text-right">
                <p className="text-[10px] text-muted uppercase tracking-wider">Comissões Acumuladas</p>
                <p className="text-sm font-bold text-brand">R$ {af.unpaid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
              </div>

              {/* Commission input inline */}
              <div className="flex items-center gap-2 border-l border-line pl-6">
                {editingId === af.id ? (
                  <div className="flex items-center gap-1.5 animate-alert-pop">
                    <input
                      type="text"
                      value={tempCommission}
                      onChange={(e) => setTempCommission(e.target.value)}
                      placeholder="%"
                      className="size-10 text-center rounded-lg border border-brand/40 bg-surface-strong text-xs text-foreground outline-none font-bold"
                    />
                    <button
                      onClick={() => handleUpdateCommission(af.id, af.name)}
                      className="size-8 rounded-lg bg-brand hover:bg-brand-strong text-neutral-950 flex items-center justify-center transition"
                      title="Salvar comissão"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="size-8 rounded-lg border border-line bg-surface text-muted flex items-center justify-center transition text-xs hover:text-foreground"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] text-muted uppercase tracking-wider font-mono">Divisão</p>
                      <p className="text-xs font-bold text-emerald-400 font-mono">{af.commission}%</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingId(af.id);
                        setTempCommission(af.commission.toString());
                      }}
                      className="size-8 rounded-lg border border-line bg-surface hover:border-brand/35 text-muted hover:text-brand flex items-center justify-center transition"
                      title="Editar regras de comissão"
                    >
                      <Edit2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TAB CONTENT 4: LINKS (Fully Functional Tracking Link Generator) ---
function LinksTabContent({ showToast }: { showToast: (message: string, type?: "success" | "warning" | "info") => void }) {
  const [destUrl, setDestUrl] = useState("");
  const [utmSrc, setUtmSrc] = useState("instagram");
  const [utmMed, setUtmMed] = useState("stories");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destUrl) {
      showToast("Insira uma URL de destino!", "warning");
      return;
    }

    const trackingLink = `https://yggnarok.com/lnk?url=${encodeURIComponent(destUrl)}&utm_source=${encodeURIComponent(utmSrc)}&utm_medium=${encodeURIComponent(utmMed)}`;
    setGeneratedLink(trackingLink);
    setIsCopied(false);
    showToast("Link parametrizado gerado com sucesso!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    showToast("Link de rastreamento copiado para o clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 space-y-6 shadow-xl">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Rastreadores & Encurtadores de Links</h3>
        <p className="text-xs text-muted">Crie links inteligentes com parâmetros UTM estruturados para metrificar perfeitamente o ROI de suas fontes de tráfego.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted uppercase">URL de Destino (Checkout / Página de Vendas)</label>
            <input
              type="text"
              value={destUrl}
              onChange={(e) => setDestUrl(e.target.value)}
              placeholder="Ex: https://checkout.kiwify.com.br/xxxxx"
              className="w-full h-10 px-3 rounded-xl border border-line bg-surface-strong text-xs text-foreground outline-none focus:border-brand/35 transition"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted uppercase">Origem da Campanha (UTM Source)</label>
              <input
                type="text"
                value={utmSrc}
                onChange={(e) => setUtmSrc(e.target.value)}
                placeholder="Ex: instagram, youtube, facebook_ads"
                className="w-full h-10 px-3 rounded-xl border border-line bg-surface-strong text-xs text-foreground outline-none focus:border-brand/35 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted uppercase">Meio da Campanha (UTM Medium)</label>
              <input
                type="text"
                value={utmMed}
                onChange={(e) => setUtmMed(e.target.value)}
                placeholder="Ex: stories, bio, video_desc, cpc"
                className="w-full h-10 px-3 rounded-xl border border-line bg-surface-strong text-xs text-foreground outline-none focus:border-brand/35 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-5 py-2.5 text-xs font-bold transition shadow-sm w-full justify-center"
          >
            Gerar Link de Rastreamento
          </button>
        </form>

        <div className="rounded-xl border border-dashed border-line bg-surface-strong/20 p-5 flex flex-col justify-center space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-foreground">Link Gerado para Campanhas</h4>
            <p className="text-[11px] text-muted">Use este link nas suas mídias sociais. O YGGNAROK auditará os cliques automaticamente.</p>
          </div>

          {generatedLink ? (
            <div className="space-y-3 animate-alert-pop">
              <div className="rounded-xl border border-line bg-neutral-950 p-4 font-mono text-[10px] text-brand break-all select-all">
                {generatedLink}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center justify-center gap-1.5 h-10 rounded-xl text-xs font-bold transition-all w-full border ${
                  isCopied 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-surface border-line hover:border-brand/30 hover:text-brand"
                }`}
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                <span>{isCopied ? "Link Copiado!" : "Copiar Link"}</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-muted font-medium">
              Preencha os campos e gere um link para visualização.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- TAB CONTENT 5: CAMPANHAS (Interactive Dynamic ROI Calculator) ---
interface CampanhasTabProps {
  setConversionRate: React.Dispatch<React.SetStateAction<number>>;
  showToast: (message: string, type?: "success" | "warning" | "info") => void;
}

function CampanhasTabContent({ setConversionRate, showToast }: CampanhasTabProps) {
  // Calculator States
  const [budget, setBudget] = useState("1000");
  const [clicks, setClicks] = useState("2500");
  const [salePrice, setSalePrice] = useState("197");
  const [convRate, setConvRate] = useState("1.8");

  // Dynamic calculations
  const totalBudget = parseFloat(budget) || 0;
  const totalClicks = parseInt(clicks) || 0;
  const price = parseFloat(salePrice) || 0;
  const rate = parseFloat(convRate) || 0;

  const cpc = totalClicks > 0 ? totalBudget / totalClicks : 0;
  const generatedSales = Math.floor(totalClicks * (rate / 100));
  const estimatedRevenue = generatedSales * price;
  const netProfit = estimatedRevenue - totalBudget;
  const roi = totalBudget > 0 ? (estimatedRevenue / totalBudget) * 100 : 0;

  const handleApplyToDashboard = () => {
    setConversionRate(rate);
    showToast(`Taxa de conversão de ${rate}% cadastrada e atualizada nos KPIs do painel!`);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 space-y-6 shadow-xl">
      <div>
        <h3 className="text-lg font-bold tracking-tight">Simulador Analítico de ROI</h3>
        <p className="text-xs text-muted">Ajuste métricas comerciais de investimento e conversão para simular o retorno bruto de suas campanhas de marketing.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Simulator Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted uppercase">Investimento Total (R$)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-line bg-surface-strong text-xs font-mono text-foreground outline-none focus:border-brand/35 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted uppercase">Cliques Obtidos</label>
            <input
              type="number"
              value={clicks}
              onChange={(e) => setClicks(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-line bg-surface-strong text-xs font-mono text-foreground outline-none focus:border-brand/35 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted uppercase">Preço do Infoproduto (R$)</label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-line bg-surface-strong text-xs font-mono text-foreground outline-none focus:border-brand/35 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted uppercase">Taxa de Conversão Estimada (%)</label>
            <input
              type="text"
              value={convRate}
              onChange={(e) => setConvRate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-line bg-surface-strong text-xs font-mono text-brand font-bold outline-none focus:border-brand/35 transition"
            />
          </div>

          <button
            onClick={handleApplyToDashboard}
            className="flex items-center justify-center gap-1.5 w-full h-10 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 text-xs font-bold transition shadow-sm"
          >
            Aplicar Conversão ao Dashboard
          </button>
        </div>

        {/* Results Screen */}
        <div className="lg:col-span-2 rounded-xl border border-line bg-neutral-950/40 p-6 flex flex-col justify-between gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/5 bg-neutral-950/50 p-4 space-y-1">
              <p className="text-[10px] text-muted uppercase tracking-wider">Custo por Clique (CPC)</p>
              <p className="text-xl font-bold font-mono">R$ {cpc.toFixed(2)}</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-neutral-950/50 p-4 space-y-1">
              <p className="text-[10px] text-muted uppercase tracking-wider">Estimativa de Vendas</p>
              <p className="text-xl font-bold font-mono">{generatedSales} un</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-neutral-950/50 p-4 space-y-1">
              <p className="text-[10px] text-muted uppercase tracking-wider">Receita Bruta Esperada</p>
              <p className="text-xl font-bold font-mono text-brand">R$ {estimatedRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            </div>

            <div className="rounded-xl border border-white/5 bg-neutral-950/50 p-4 space-y-1">
              <p className="text-[10px] text-muted uppercase tracking-wider">Lucro Líquido</p>
              <p className={`text-xl font-bold font-mono ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                R$ {netProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-neutral-950 p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted uppercase tracking-wider">Retorno sobre Investimento (ROI)</p>
              <p className="text-xs text-muted leading-relaxed">Fórmula analítica idealizada para campanhas pagas.</p>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-lg font-black font-mono shadow-md ${
                roi >= 100 
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-emerald-500/5" 
                  : "bg-red-500/10 border border-red-500/20 text-red-400 shadow-red-500/5"
              }`}>
                {roi.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TAB CONTENT 6: COMISSÕES (Functional Pix Payout Request) ---
interface ComissoesTabProps {
  availableBalance: number;
  setAvailableBalance: React.Dispatch<React.SetStateAction<number>>;
  pendingBalance: number;
  payoutsHistory: PayoutItem[];
  setPayoutsHistory: React.Dispatch<React.SetStateAction<PayoutItem[]>>;
  showToast: (message: string, type?: "success" | "warning" | "info") => void;
}

function ComissoesTabContent({
  availableBalance, setAvailableBalance, pendingBalance, payoutsHistory, setPayoutsHistory, showToast
}: ComissoesTabProps) {
  const [pixKey, setPixKey] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (availableBalance <= 0) {
      showToast("Você não possui saldo disponível para saque!", "warning");
      return;
    }
    if (!pixKey) {
      showToast("Preencha sua chave PIX!", "warning");
      return;
    }

    const valueToWithdraw = availableBalance;
    const newPayout = {
      id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
      value: valueToWithdraw,
      status: "Em Processamento",
      date: new Date().toLocaleDateString("pt-BR"),
      method: "Pix"
    };

    setPayoutsHistory(prev => [newPayout, ...prev]);
    setAvailableBalance(0);
    setPixKey("");
    setIsRequesting(false);
    showToast(`Saque PIX de R$ ${valueToWithdraw.toFixed(2)} solicitado com sucesso!`);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight">Financeiro & Coprodução</h3>
          <p className="text-xs text-muted">Saques, saldo líquido disponível e histórico operacional de transferências comerciais.</p>
        </div>

        {availableBalance > 0 && (
          <button
            onClick={() => setIsRequesting(!isRequesting)}
            className="flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-4.5 py-2.5 text-xs font-bold transition shadow-sm"
          >
            {isRequesting ? "Cancelar" : "Solicitar Saque (PIX)"}
          </button>
        )}
      </div>

      {/* Balance display */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950/70 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Saldo Disponível para Saque</span>
            <p className="text-3xl font-black text-emerald-400 font-mono">
              R$ {availableBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <p className="text-[10px] text-muted">Acessível para saques automáticos via Pix a qualquer momento.</p>
        </div>

        <div className="rounded-xl border border-line bg-surface-strong/20 p-5 flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Pendente de Liberação (Garantia)</span>
            <p className="text-3xl font-black text-muted font-mono">
              R$ {pendingBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <p className="text-[10px] text-muted">Reservado para segurança em cumprimento das políticas de chargeback.</p>
        </div>
      </div>

      {/* Pix Payout request form */}
      {isRequesting && (
        <form onSubmit={handleRequestPayout} className="rounded-xl border border-line bg-surface-strong/30 p-5 space-y-4 animate-alert-pop">
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-brand" />
            <h4 className="text-xs font-bold text-brand uppercase tracking-wider">Solicitação Payout Pix</h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted uppercase">Chave PIX (E-mail, CPF, Celular)</label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Insira sua chave Pix..."
                className="w-full h-10 px-3 rounded-xl border border-line bg-surface text-xs text-foreground outline-none focus:border-brand/35 transition"
              />
            </div>

            <button
              type="submit"
              className="h-10 flex items-center justify-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 text-xs font-bold transition shadow-sm"
            >
              Confirmar Saque de R$ {availableBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </button>
          </div>
        </form>
      )}

      {/* Payouts History Table */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-muted uppercase tracking-wider block">Histórico de Saques</span>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="pb-3 font-semibold">ID</th>
                <th className="pb-3 font-semibold">Método</th>
                <th className="pb-3 font-semibold">Valor</th>
                <th className="pb-3 font-semibold">Data</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {payoutsHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-muted text-xs">
                    Nenhum saque realizado ainda.
                  </td>
                </tr>
              ) : payoutsHistory.map((payout) => (
                <tr key={payout.id}>
                  <td className="py-3 font-mono text-muted">{payout.id}</td>
                  <td className="py-3 font-semibold text-foreground">{payout.method}</td>
                  <td className="py-3 font-bold text-foreground">R$ {payout.value.toFixed(2)}</td>
                  <td className="py-3 text-muted">{payout.date}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      payout.status === "Concluído" 
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                        : "bg-amber-500/10 border border-amber-500/20 text-brand"
                    }`}>
                      <span className={`size-1 rounded-full ${payout.status === "Concluído" ? "bg-emerald-400" : "bg-brand"}`} />
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- TAB CONTENT 7: OPORTUNIDADES (Interactive AI insights applicator) ---
interface OportunidadesTabProps {
  opportunities: OpportunityItem[];
  setOpportunities: React.Dispatch<React.SetStateAction<OpportunityItem[]>>;
  setConversionRate: React.Dispatch<React.SetStateAction<number>>;
  showToast: (message: string, type?: "success" | "warning" | "info") => void;
}

function OportunidadesTabContent({
  opportunities, setOpportunities, setConversionRate, showToast
}: OportunidadesTabProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApplyInsight = (id: string, title: string) => {
    setLoadingId(id);
    
    // Simulate IA applying adjustments
    setTimeout(() => {
      setOpportunities(prev => prev.map(op => {
        if (op.id === id) {
          return { ...op, status: "Aplicado" };
        }
        return op;
      }));
      setLoadingId(null);
      setConversionRate(prev => parseFloat((prev + 1.2).toFixed(1)));
      showToast(`Oportunidade '${title}' aplicada pela IA! Taxa de conversão geral aumentada (+1.2%).`);
    }, 1200);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 space-y-6 shadow-xl">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-brand animate-pulse" />
        <div>
          <h3 className="text-lg font-bold tracking-tight">Oportunidades Recomendadas por IA</h3>
          <p className="text-xs text-muted">O Conselho de IAs audita o comportamento dos checkouts e propõe gatilhos automáticos para reter clientes e aumentar o faturamento.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {opportunities.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-dashed border-line bg-surface-strong/20 p-10 text-center">
            <Sparkles size={32} className="mx-auto text-muted mb-3" />
            <p className="text-sm font-bold text-foreground">Nenhuma oportunidade disponível</p>
            <p className="text-xs text-muted mt-1">As IAs analisarão seus checkouts e tráfego para sugerir oportunidades de aumento de faturamento.</p>
          </div>
        ) : opportunities.map((op) => (
          <div key={op.id} className="rounded-xl border border-line bg-neutral-900/30 p-5 flex flex-col justify-between gap-4 hover:border-brand/20 transition-all">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{op.id}</span>
                <span className="text-xs font-bold text-brand font-mono">{op.impact}</span>
              </div>
              <h4 className="text-sm font-bold text-foreground">{op.title}</h4>
              <p className="text-xs text-muted leading-relaxed">{op.desc}</p>
            </div>

            <button
              onClick={() => handleApplyInsight(op.id, op.title)}
              disabled={op.status === "Aplicado" || loadingId !== null}
              className={`flex items-center justify-center gap-1.5 h-10 w-full rounded-xl text-xs font-bold transition-all border ${
                op.status === "Aplicado"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default"
                  : "bg-surface border-line hover:border-brand/35 hover:text-brand"
              }`}
            >
              {loadingId === op.id ? (
                <div className="size-4 rounded-full border-2 border-brand border-t-transparent animate-spin" />
              ) : op.status === "Aplicado" ? (
                <>
                  <Check size={14} />
                  <span>Ajuste IA Ativado</span>
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  <span>Aplicar Sugestão de IA</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4. Reports Empty State Component ---
function ReportsEmptyState({ showToast }: { showToast: (message: string, type?: "success" | "warning" | "info") => void }) {
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
            onClick={() => showToast("Conecte integrações de vendas (Hotmart, Kiwify, Stripe) via Webhooks para liberar os relatórios.", "info")}
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
