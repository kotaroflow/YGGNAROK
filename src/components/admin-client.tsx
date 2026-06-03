"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield, Users, UserCog, KeyRound, Settings, ScrollText, Activity, ClipboardList,
  Server, Database, Cpu, HardDrive,
  ExternalLink, CheckCircle, XCircle, AlertTriangle, Clock, ArrowUpRight, RefreshCw,
  UserCheck, Hash, Loader2, FileText, Zap, BookOpen, Wrench,
} from "lucide-react";
import type { Profile, Job, HealthLog, AuditLog, Role, Permission } from "@/types/dashboard";

const tabs: Array<{ id: string; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: "geral", label: "Geral", icon: Shield },
  { id: "usuarios", label: "Usuários", icon: Users },
  { id: "cargos", label: "Cargos", icon: UserCog },
  { id: "permissoes", label: "Permissões", icon: KeyRound },
  { id: "logs", label: "Logs", icon: ScrollText },
  { id: "health", label: "Saúde", icon: Activity },
  { id: "auditoria", label: "Auditoria", icon: ClipboardList },
  { id: "config", label: "Configurações", icon: Settings },
];

interface DashboardCounts {
  profiles: number; pendingJobs: number; manualPosts: number; alerts: number;
}

interface HealthService {
  label: string; status: "online" | "offline" | "checking";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string; description: string;
}

const tabIds = new Set(tabs.map(t => t.id));

export function AdminClient({
  activeTab: rawTab, counts, profiles, jobs, healthLogs, auditLogs, roles, permissions,
}: {
  activeTab: string;
  counts: DashboardCounts;
  profiles: Profile[];
  jobs: Job[];
  healthLogs: HealthLog[];
  auditLogs: AuditLog[];
  roles: Role[];
  permissions: Permission[];
}) {
  const activeTab = tabIds.has(rawTab) ? rawTab : "geral";
  const router = useRouter();

  const [services, setServices] = useState<HealthService[]>([
    { label: "Ollama (IA Local)", status: "checking", icon: Cpu, href: "http://localhost:11434", description: "Modelo de IA local" },
    { label: "n8n (Workflows)", status: "checking", icon: Activity, href: "http://localhost:5678", description: "Automação de workflows" },
    { label: "OPENCLAW Gateway", status: "checking", icon: Server, href: "http://localhost:3334", description: "API Gateway" },
    { label: "Supabase", status: "checking", icon: Database, href: "https://supabase.com/dashboard", description: "Banco de dados" },
  ]);

  const checkServices = useCallback(async () => {
    setServices(prev => prev.map((s, i) => i < 3 ? { ...s, status: "checking" as const } : s));
    try {
      const res = await fetch("/api/workers/health", { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        if (data.services) {
          setServices(prev => prev.map((s, i) => {
            const svc = data.services[i];
            return svc ? { ...s, status: svc.status as "online" | "offline" } : s;
          }));
        }
      }
    } catch {
      setServices(prev => prev.map((s, i) => i < 3 ? { ...s, status: "offline" as const } : s));
    }
  }, []);

  useEffect(() => {
    checkServices();
  }, [checkServices]);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
      checkServices();
    }, 30000);
    return () => clearInterval(interval);
  }, [router, checkServices]);

  const TabIcon = tabs.find(t => t.id === activeTab)?.icon ?? Shield;

  const statusColor = (s: string) => {
    if (s === "online") return "bg-emerald-500";
    if (s === "offline") return "bg-red-500";
    return "bg-amber-400";
  };

  const statusLabel = (s: string) => {
    if (s === "online") return "Online";
    if (s === "offline") return "Offline";
    return "Verificando";
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short", timeStyle: "short",
      }).format(new Date(iso));
    } catch { return iso; }
  };

  return (
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
          {services.map((svc) => (
            <a
              key={svc.label}
              href={svc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4 shadow-sm backdrop-blur transition hover:border-brand/30 hover:bg-surface-strong"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10">
                <svc.icon size={18} className="text-brand" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{svc.label}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  {svc.status === "checking" ? (
                    <Loader2 size={12} className="text-muted animate-spin" />
                  ) : (
                    <span className={`size-2 rounded-full ${statusColor(svc.status)}`} />
                  )}
                  <span className="text-xs text-muted capitalize">{statusLabel(svc.status)}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted">{svc.description}</p>
              </div>
              <ExternalLink size={14} className="shrink-0 text-muted" />
            </a>
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
        <section className="rounded-xl border border-line bg-surface p-6 shadow-sm backdrop-blur">
          {/* Tab: Geral */}
          {activeTab === "geral" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Visão Geral do Sistema</h2>
                  <p className="text-sm text-muted">Métricas agregadas de operação</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-line bg-surface-strong p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">Perfis</p>
                  <p className="mt-1 text-3xl font-bold">{counts.profiles}</p>
                  <p className="mt-0.5 text-xs text-muted">Total de perfis cadastrados</p>
                </div>
                <div className="rounded-xl border border-line bg-surface-strong p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">Jobs Pendentes</p>
                  <p className="mt-1 text-3xl font-bold">{counts.pendingJobs}</p>
                  <p className="mt-0.5 text-xs text-muted">Aguardando processamento</p>
                </div>
                <div className="rounded-xl border border-line bg-surface-strong p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">Postagens Manuais</p>
                  <p className="mt-1 text-3xl font-bold">{counts.manualPosts}</p>
                  <p className="mt-0.5 text-xs text-muted">Na fila de publicação</p>
                </div>
                <div className="rounded-xl border border-line bg-surface-strong p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">Alertas Ativos</p>
                  <p className={`mt-1 text-3xl font-bold ${counts.alerts > 0 ? "text-red-500" : ""}`}>{counts.alerts}</p>
                  <p className="mt-0.5 text-xs text-muted">Health logs com warning/error</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-semibold">Último Health Log</h3>
                {healthLogs.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-line">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-strong text-xs uppercase text-muted">
                        <tr>
                          <th className="px-3 py-2 font-medium">Fonte</th>
                          <th className="px-3 py-2 font-medium">Status</th>
                          <th className="px-3 py-2 font-medium">Mensagem</th>
                          <th className="px-3 py-2 font-medium">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {healthLogs.slice(0, 5).map((log) => (
                          <tr key={log.id} className="hover:bg-surface-strong/50">
                            <td className="px-3 py-2 font-medium">{log.source}</td>
                            <td className="px-3 py-2">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                log.status === "ok" || log.status === "online" ? "bg-emerald-500/10 text-emerald-600" :
                                log.status === "warning" ? "bg-amber-500/10 text-amber-600" :
                                "bg-red-500/10 text-red-600"
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="max-w-xs truncate px-3 py-2 text-muted">{log.message}</td>
                            <td className="px-3 py-2 text-xs text-muted">{formatDate(log.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted">Nenhum health log registrado.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab: Usuários */}
          {activeTab === "usuarios" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Usuários do Sistema</h2>
                  <p className="text-sm text-muted">{profiles.length} perfis cadastrados</p>
                </div>
              </div>

              {profiles.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-line">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-strong text-xs uppercase text-muted">
                      <tr>
                        <th className="px-3 py-2 font-medium">Nome</th>
                        <th className="px-3 py-2 font-medium">Slug</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium">Criado em</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {profiles.map((p) => (
                        <tr key={p.id} className="hover:bg-surface-strong/50">
                          <td className="px-3 py-2 font-medium">{p.name}</td>
                          <td className="px-3 py-2 text-muted">{p.slug}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              p.status === "active" ? "bg-emerald-500/10 text-emerald-600" :
                              p.status === "inactive" ? "bg-muted/10 text-muted" :
                              "bg-amber-500/10 text-amber-600"
                            }`}>
                              {p.status === "active" && <CheckCircle size={10} />}
                              {p.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-muted">{formatDate(p.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted">Nenhum perfil encontrado.</p>
              )}
            </div>
          )}

          {/* Tab: Cargos */}
          {activeTab === "cargos" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <UserCog size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Cargos</h2>
                  <p className="text-sm text-muted">{roles.length} cargos configurados</p>
                </div>
              </div>

              {roles.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-line">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-strong text-xs uppercase text-muted">
                      <tr>
                        <th className="px-3 py-2 font-medium">Chave</th>
                        <th className="px-3 py-2 font-medium">Nome</th>
                        <th className="px-3 py-2 font-medium">Descrição</th>
                        <th className="px-3 py-2 font-medium">Criado em</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {roles.map((r) => (
                        <tr key={r.id} className="hover:bg-surface-strong/50">
                          <td className="px-3 py-2 font-mono text-xs text-brand">{r.key}</td>
                          <td className="px-3 py-2 font-medium">{r.name}</td>
                          <td className="px-3 py-2 text-muted">{r.description ?? "—"}</td>
                          <td className="px-3 py-2 text-xs text-muted">{formatDate(r.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted">Nenhum cargo configurado.</p>
              )}
            </div>
          )}

          {/* Tab: Permissões */}
          {activeTab === "permissoes" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <KeyRound size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Permissões</h2>
                  <p className="text-sm text-muted">{permissions.length} permissões registradas</p>
                </div>
              </div>

              {permissions.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-line">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-strong text-xs uppercase text-muted">
                      <tr>
                        <th className="px-3 py-2 font-medium">Chave</th>
                        <th className="px-3 py-2 font-medium">Módulo</th>
                        <th className="px-3 py-2 font-medium">Descrição</th>
                        <th className="px-3 py-2 font-medium">Criado em</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {permissions.map((p) => (
                        <tr key={p.id} className="hover:bg-surface-strong/50">
                          <td className="px-3 py-2 font-mono text-xs text-brand">{p.key}</td>
                          <td className="px-3 py-2">
                            <span className="rounded bg-surface-strong px-2 py-0.5 text-xs font-medium text-muted">{p.module}</span>
                          </td>
                          <td className="px-3 py-2 text-muted">{p.description ?? "—"}</td>
                          <td className="px-3 py-2 text-xs text-muted">{formatDate(p.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted">Nenhuma permissão registrada.</p>
              )}
            </div>
          )}

          {/* Tab: Logs */}
          {activeTab === "logs" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <ScrollText size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Logs de Saúde</h2>
                  <p className="text-sm text-muted">{healthLogs.length} registros</p>
                </div>
              </div>

              {healthLogs.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-line">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-strong text-xs uppercase text-muted">
                      <tr>
                        <th className="px-3 py-2 font-medium">Fonte</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium">Mensagem</th>
                        <th className="px-3 py-2 font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {healthLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-surface-strong/50">
                          <td className="px-3 py-2 font-medium">{log.source}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              log.status === "ok" || log.status === "online" ? "bg-emerald-500/10 text-emerald-600" :
                              log.status === "warning" ? "bg-amber-500/10 text-amber-600" :
                              "bg-red-500/10 text-red-600"
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="max-w-md truncate px-3 py-2 text-muted">{log.message}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs text-muted">{formatDate(log.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted">Nenhum log registrado.</p>
              )}
            </div>
          )}

          {/* Tab: Saúde */}
          {activeTab === "health" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Saúde do Sistema</h2>
                  <p className="text-sm text-muted">Status dos serviços e histórico de health checks</p>
                </div>
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {services.map((svc) => (
                  <div key={svc.label} className="flex items-center gap-4 rounded-xl border border-line bg-surface-strong p-4">
                    <div className={`grid size-10 shrink-0 place-items-center rounded-lg ${
                      svc.status === "online" ? "bg-emerald-500/10" :
                      svc.status === "offline" ? "bg-red-500/10" :
                      "bg-amber-500/10"
                    }`}>
                      <svc.icon size={18} className={
                        svc.status === "online" ? "text-emerald-500" :
                        svc.status === "offline" ? "text-red-500" :
                        "text-amber-400"
                      } />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{svc.label}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        {svc.status === "checking" ? (
                          <Loader2 size={12} className="text-muted animate-spin" />
                        ) : (
                          <span className={`size-2 rounded-full ${statusColor(svc.status)}`} />
                        )}
                        <span className="text-xs text-muted capitalize">{statusLabel(svc.status)}</span>
                      </div>
                    </div>
                    <a href={svc.href} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-foreground">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
              </div>

              <h3 className="mb-3 text-sm font-semibold">Histórico de Health Checks</h3>
              {healthLogs.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-line">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-strong text-xs uppercase text-muted">
                      <tr>
                        <th className="px-3 py-2 font-medium">Fonte</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 font-medium">Mensagem</th>
                        <th className="px-3 py-2 font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {healthLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-surface-strong/50">
                          <td className="px-3 py-2 font-medium">{log.source}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              log.status === "ok" || log.status === "online" ? "bg-emerald-500/10 text-emerald-600" :
                              log.status === "warning" ? "bg-amber-500/10 text-amber-600" :
                              "bg-red-500/10 text-red-600"
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="max-w-md truncate px-3 py-2 text-muted">{log.message}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs text-muted">{formatDate(log.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted">Nenhum registro de health check.</p>
              )}
            </div>
          )}

          {/* Tab: Auditoria */}
          {activeTab === "auditoria" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Auditoria</h2>
                  <p className="text-sm text-muted">{auditLogs.length} eventos registrados</p>
                </div>
              </div>

              {auditLogs.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-line">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-strong text-xs uppercase text-muted">
                      <tr>
                        <th className="px-3 py-2 font-medium">Ação</th>
                        <th className="px-3 py-2 font-medium">Tipo</th>
                        <th className="px-3 py-2 font-medium">Usuário</th>
                        <th className="px-3 py-2 font-medium">Motivo</th>
                        <th className="px-3 py-2 font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-surface-strong/50">
                          <td className="px-3 py-2 font-mono text-xs text-brand">{log.action}</td>
                          <td className="px-3 py-2">
                            {log.resource_type ? (
                              <span className="rounded bg-surface-strong px-2 py-0.5 text-xs text-muted">{log.resource_type}</span>
                            ) : <span className="text-xs text-muted">—</span>}
                          </td>
                          <td className="px-3 py-2 text-xs text-muted">{log.user_id ? log.user_id.slice(0, 8) + "…" : "—"}</td>
                          <td className="max-w-xs truncate px-3 py-2 text-xs text-muted">{log.reason ?? "—"}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-xs text-muted">{formatDate(log.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted">Nenhum evento de auditoria registrado.</p>
              )}
            </div>
          )}

          {/* Tab: Configurações */}
          {activeTab === "config" && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                  <Settings size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Configurações do Sistema</h2>
                  <p className="text-sm text-muted">Resumo da configuração atual</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-surface-strong p-4">
                  <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                    <Database size={16} className="text-brand" />
                    Banco de Dados
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Total de perfis</span>
                      <span className="font-medium">{counts.profiles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Total de jobs</span>
                      <span className="font-medium">{jobs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Cargos configurados</span>
                      <span className="font-medium">{roles.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Permissões</span>
                      <span className="font-medium">{permissions.length}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-surface-strong p-4">
                  <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                    <Server size={16} className="text-brand" />
                    Serviços
                  </h3>
                  <div className="space-y-2 text-sm">
                    {services.map((svc) => (
                      <div key={svc.label} className="flex items-center justify-between">
                        <span className="text-muted">{svc.label}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                          svc.status === "online" ? "text-emerald-500" :
                          svc.status === "offline" ? "text-red-500" :
                          "text-amber-400"
                        }`}>
                          {svc.status === "checking" ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <span className={`size-1.5 rounded-full ${statusColor(svc.status)}`} />
                          )}
                          {statusLabel(svc.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-surface-strong p-4">
                  <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                    <Hash size={16} className="text-brand" />
                    Jobs Status
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Pendentes</span>
                      <span className="font-medium">{counts.pendingJobs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Alertas</span>
                      <span className={`font-medium ${counts.alerts > 0 ? "text-red-500" : ""}`}>{counts.alerts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Postagens manuais</span>
                      <span className="font-medium">{counts.manualPosts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Health logs</span>
                      <span className="font-medium">{healthLogs.length}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-surface-strong p-4">
                  <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
                    <Wrench size={16} className="text-brand" />
                    Ambiente
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Auto-refresh</span>
                      <span className="font-medium text-emerald-500">30s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Eventos de auditoria</span>
                      <span className="font-medium">{auditLogs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Versão</span>
                      <span className="font-mono text-xs text-muted">1.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
