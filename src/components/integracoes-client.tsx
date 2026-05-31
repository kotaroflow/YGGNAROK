"use client";

import { useState } from "react";
import {
  Plug, Camera, Video, MessageCircle, Globe, ArrowUpRight, Check, AlertCircle,
  Plus, Trash2, Star, X, Key, Database, FolderHeart, Sparkles
} from "lucide-react";
import { BackButton } from "@/components/back-button";

// --- Types ---
interface AccountItem {
  id: string;
  name: string;
  isPrimary: boolean;
}

interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  accounts: AccountItem[];
}

export function IntegracoesClient() {
  // Stateful Integrations with multiple accounts support
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([
    {
      id: "openrouter",
      name: "OpenRouter",
      description: "Modelos de IA de alta performance (LLaMA, GPT, Claude)",
      icon: Plug,
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
      accounts: [
        { id: "acc-1", name: "Chave Principal (Council of IAs)", isPrimary: true },
        { id: "acc-2", name: "Chave de Testes / Sandbox", isPrimary: false }
      ]
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "Banco de dados Postgres relacional, logs e autenticação",
      icon: Database,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accounts: [
        { id: "acc-3", name: "YGGNAROK Production DB", isPrimary: true }
      ]
    },
    {
      id: "cloudflare-r2",
      name: "Cloudflare R2",
      description: "Armazenamento e CDN de mídia com custo zero de egresso",
      icon: FolderHeart,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      accounts: []
    },
    {
      id: "instagram",
      name: "Instagram Graph API",
      description: "Agendamento e publicação automática de posts e reels",
      icon: Camera,
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
      accounts: [
        { id: "acc-4", name: "@yggnarok_oficial", isPrimary: true },
        { id: "acc-5", name: "@kotaro_flow", isPrimary: false }
      ]
    },
    {
      id: "youtube",
      name: "YouTube v3 API",
      description: "Upload automático e agendamento de vídeos 4K e Shorts",
      icon: Video,
      color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      accounts: [
        { id: "acc-6", name: "YGGNAROK TV (Principal)", isPrimary: true }
      ]
    },
    {
      id: "twitter",
      name: "X (Twitter) v2 API",
      description: "Disparo automático de threads e micro-insights",
      icon: MessageCircle,
      color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      accounts: []
    },
    {
      id: "whatsapp",
      name: "WhatsApp Cloud API",
      description: "Automação comercial e fluxos de mensagens assistidas",
      icon: MessageCircle,
      color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      accounts: [
        { id: "acc-7", name: "Suporte Comercial (+55 11 99999-9999)", isPrimary: true }
      ]
    }
  ]);

  // Modal / Input State
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [newAccountName, setNewAccountName] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add a new account to a platform
  const handleAddAccount = (integrationId: string) => {
    if (!newAccountName.trim()) {
      alert("Por favor, preencha o nome do canal/conta.");
      return;
    }

    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        // If it's the first account, set it as primary
        const isFirst = integration.accounts.length === 0;
        const newAcc: AccountItem = {
          id: `acc-${Date.now()}`,
          name: newAccountName,
          isPrimary: isFirst
        };
        return {
          ...integration,
          accounts: [...integration.accounts, newAcc]
        };
      }
      return integration;
    }));

    const platformName = integrations.find(i => i.id === integrationId)?.name;
    triggerToast(`Conta '${newAccountName}' integrada ao ${platformName}!`);
    setNewAccountName("");
    setActiveModalId(null);
  };

  // Set account as primary
  const handleSetPrimary = (integrationId: string, accountId: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        const updatedAccounts = integration.accounts.map(acc => ({
          ...acc,
          isPrimary: acc.id === accountId
        }));
        return { ...integration, accounts: updatedAccounts };
      }
      return integration;
    }));
    triggerToast("Conta definida como principal.");
  };

  // Remove account
  const handleRemoveAccount = (integrationId: string, accountId: string, accountName: string) => {
    setIntegrations(prev => prev.map(integration => {
      if (integration.id === integrationId) {
        const remaining = integration.accounts.filter(acc => acc.id !== accountId);
        // If the removed account was primary, make the first of remaining primary
        if (remaining.length > 0 && !remaining.some(acc => acc.isPrimary)) {
          remaining[0].isPrimary = true;
        }
        return { ...integration, accounts: remaining };
      }
      return integration;
    }));
    triggerToast(`Conta '${accountName}' removida.`);
  };

  // Stats
  const totalPlatforms = integrations.length;
  const connectedPlatforms = integrations.filter(i => i.accounts.length > 0).length;
  const totalAccounts = integrations.reduce((acc, curr) => acc + curr.accounts.length, 0);

  return (
    <main className="min-h-screen text-foreground bg-neutral-950 px-4 py-8 lg:px-8 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-neutral-950 border border-brand/40 text-foreground px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-alert-pop">
          <div className="size-2 rounded-full bg-brand animate-ping" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="mx-auto w-full max-w-4xl space-y-8">
        <BackButton />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-line pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Workspace</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Integrações de API e Plataformas</h1>
            <p className="mt-2 max-w-lg text-xs text-muted">
              Conecte chaves, servidores e contas de redes sociais. O YGGNAROK suporta a conexão de **múltiplas contas simultâneas** por plataforma.
            </p>
          </div>

          {/* Status dashboard */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-[11px] font-semibold text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {connectedPlatforms} / {totalPlatforms} Plataformas Ativas
            </div>
            <div className="flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-[11px] font-semibold text-brand">
              <span className="size-1.5 rounded-full bg-brand animate-pulse" />
              {totalAccounts} Contas Integradas
            </div>
          </div>
        </div>

        {/* Integration Cards List */}
        <div className="space-y-4">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            const isConnected = integration.accounts.length > 0;
            const isFormOpen = activeModalId === integration.id;

            return (
              <div
                key={integration.id}
                className="rounded-2xl border border-line bg-surface p-6 shadow-xl relative overflow-hidden backdrop-blur flex flex-col gap-6 transition hover:border-white/10"
              >
                {/* Top: Integration Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`grid size-12 shrink-0 place-items-center rounded-xl border ${integration.color}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-bold text-foreground">{integration.name}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          isConnected
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                            : "bg-surface-strong border border-line text-muted"
                        }`}>
                          {isConnected ? `${integration.accounts.length} Contas` : "Desconectado"}
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-0.5 max-w-xl">{integration.description}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalId(isFormOpen ? null : integration.id);
                      setNewAccountName("");
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-4.5 py-2.5 text-xs font-bold transition shadow-sm self-start sm:self-auto shrink-0"
                  >
                    <Plus size={14} />
                    Conectar Conta
                  </button>
                </div>

                {/* Accounts List (If any) */}
                {isConnected && (
                  <div className="space-y-2 border-t border-line/60 pt-4">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Contas Conectadas</p>
                    <div className="grid gap-2">
                      {integration.accounts.map((acc) => (
                        <div
                          key={acc.id}
                          className="rounded-xl border border-line bg-neutral-900/30 px-4 py-3 flex items-center justify-between gap-4 hover:border-white/10 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="size-2 rounded-full bg-brand" />
                            <span className="text-xs font-bold text-foreground">{acc.name}</span>
                            {acc.isPrimary && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand/10 border border-brand/20 text-[9px] font-bold text-brand uppercase">
                                Principal
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {!acc.isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(integration.id, acc.id)}
                                className="size-8 rounded-lg border border-line bg-surface hover:border-brand/40 text-muted hover:text-brand flex items-center justify-center transition"
                                title="Definir como Principal"
                              >
                                <Star size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveAccount(integration.id, acc.id, acc.name)}
                              className="size-8 rounded-lg border border-line bg-surface hover:border-red-500/30 hover:bg-red-500/10 text-muted hover:text-red-400 flex items-center justify-center transition"
                              title="Desconectar conta"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inline Form to Add Account */}
                {isFormOpen && (
                  <div className="border-t border-line/60 pt-4 animate-alert-pop">
                    <div className="rounded-xl border border-line bg-surface-strong/30 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-brand uppercase tracking-wider">Integrar no {integration.name}</h4>
                        <button
                          onClick={() => setActiveModalId(null)}
                          className="text-muted hover:text-foreground text-xs"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3 items-end">
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-[10px] font-bold text-muted uppercase">Identificador da Conta (Handle, Canel, API Key, Token)</label>
                          <input
                            type="text"
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                            placeholder={
                              integration.id === "openrouter" ? "Ex: API Key Produção (sk-or-...)" :
                              integration.id === "instagram" ? "Ex: @meu_perfil_comercial" :
                              integration.id === "youtube" ? "Ex: Canal Principal de Vendas" :
                              "Ex: Conta / Identificador da plataforma"
                            }
                            className="w-full h-10 px-3 rounded-xl border border-line bg-surface text-xs text-foreground outline-none focus:border-brand/40 transition"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddAccount(integration.id)}
                          className="h-10 flex items-center justify-center gap-1.5 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 text-xs font-bold transition shadow-sm w-full"
                        >
                          <Sparkles size={12} />
                          <span>Confirmar Conexão</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
