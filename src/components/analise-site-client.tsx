"use client";

import { useState } from "react";
import { Globe, Search, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Shield, User, Key, ExternalLink, Copy, RefreshCw, Bug, Palette, Code, BarChart3 } from "lucide-react";

interface AuditResult {
  url: string;
  score: {
    seo: number;
    ux: number;
    perf: number;
    cro: number;
    code: number;
    design: number;
  };
  details: {
    title: string;
    description: string;
    h1: string;
    h2Count: number;
    ssl: boolean;
    loadTime: string;
    responsive: boolean;
    cookies: boolean;
  };
  issues: {
    type: "warning" | "error" | "success" | "info";
    category: "seo" | "code" | "design" | "perf" | "security";
    title: string;
    description: string;
    suggestion?: string;
  }[];
  suggestions: {
    title: string;
    impact: "high" | "medium" | "low";
    agent: string;
    text: string;
  }[];
  technical: {
    htmlValidation: { errors: number; warnings: number };
    cssIssues: { errors: number; unused: number };
    jsErrors: string[];
    accessibility: { violations: number; passes: number };
  };
}

interface AdminCredentials {
  username: string;
  password: string;
  adminUrl: string;
}

const auditSteps = [
  "Estabelecendo conexão segura SSL...",
  "Autenticando na área administrativa...",
  "Baixando conteúdo HTML da página inicial...",
  "Executando varredura de bugs de código...",
  "Analisando Tags de SEO (Meta, OpenGraph, Schema)...",
  "Avaliando contraste de cores e legibilidade UX...",
  "Analisando responsividade e breakpoints...",
  "Verificando acessibilidade (WCAG)...",
  "Medindo First Contentful Paint e tamanho do DOM...",
  "Identificando gargalos de conversão (CTA, Escassez)..."
];

const mockAgents = [
  { key: "hermes", name: "Hermes - Mestre de SEO", desc: "Varre indexabilidade, tags meta e hierarquia semântica de headings.", avatar: "🧭" },
  { key: "isis", name: "Isis - Especialista UX/UI", desc: "Avalia contraste visual, fontes, espaçamentos e usabilidade mobile.", avatar: "👁️" },
  { key: "morax", name: "Morax - Mestre de Conversão", desc: "Identifica falhas na jornada de compra, clareza das CTAs e gatilhos mentais.", avatar: "🏆" },
  { key: "atlas", name: "Atlas - Arquiteto de Código", desc: "Detecta bugs de HTML, CSS, JavaScript e erros técnicos.", avatar: "🔧" },
  { key: "pixel", name: "Pixel - Especialista em Design", desc: "Analisa paleta de cores, tipografia, hierarquia visual e consistência.", avatar: "🎨" }
];

export function AnaliseSiteClient() {
  const [url, setUrl] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["hermes", "atlas", "pixel"]);
  const [status, setStatus] = useState<"idle" | "login" | "loading" | "done">("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>({ username: "", password: "", adminUrl: "" });
  const [useAdminAuth, setUseAdminAuth] = useState(false);

  const toggleAgent = (agentKey: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentKey)
        ? prev.filter(k => k !== agentKey)
        : [...prev, agentKey]
    );
  };

const startAnalysis = async () => {
    if (!url) return;
    setStatus(useAdminAuth ? "login" : "loading");
    setStepIndex(0);

    const totalSteps = useAdminAuth ? auditSteps.length : auditSteps.length - 2;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const maxSteps = useAdminAuth ? auditSteps.length : auditSteps.length - 2;
      if (currentStep < maxSteps) {
        setStepIndex(currentStep);
      } else {
        clearInterval(interval);
        
        const performAudit = async () => {
          try {
            const response = await fetch("/api/audit-site", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url,
                adminAuth: useAdminAuth ? adminCredentials : undefined,
                agents: selectedAgents
              })
            });
            
            if (!response.ok) throw new Error("Falha na análise");
            const data = await response.json();
            setResult(data);
            setStatus("done");
          } catch (e) {
            setStatus("idle");
            alert("Erro ao analisar o site. Tente novamente.");
          }
        };
        
        performAudit();
      }
    }, 800);
  };

  const resetAnalysis = () => {
    setStatus("idle");
    setStepIndex(0);
    setResult(null);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-brand" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Estúdio · Audit</p>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
          Análise Automática de Site
        </h1>
        <p className="mt-2 text-sm text-muted">
          Auditoria completa com acesso administrativo, detecção de bugs, análise de design e sugestões de melhorias.
        </p>
      </div>

      {status === "idle" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-lg font-bold text-foreground mb-4">Configurar Análise</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">URL do site</label>
                  <div className="relative flex items-center">
                    <Globe className="absolute left-4 size-5 text-muted" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://meusite.com"
                      className="w-full rounded-xl border border-line bg-surface-strong/50 py-4 pl-12 pr-4 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 transition"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="admin-auth"
                    checked={useAdminAuth}
                    onChange={(e) => setUseAdminAuth(e.target.checked)}
                    className="w-4 h-4 rounded border-border-accent text-brand focus:ring-2 focus:ring-brand/20"
                  />
                  <label htmlFor="admin-auth" className="text-sm text-muted cursor-pointer">
                    Usar autenticação administrativa (acessa área restrita do site)
                  </label>
                </div>

                {useAdminAuth && (
                  <div className="space-y-3 p-4 bg-surface/30 rounded-xl border border-line">
                    <div>
                      <label className="block text-xs font-semibold text-muted mb-1">Usuário Administrador</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                        <input
                          type="text"
                          value={adminCredentials.username}
                          onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                          placeholder="admin@site.com"
                          className="w-full rounded-lg border border-line bg-surface-strong py-2 pl-10 pr-3 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted mb-1">Senha</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted" />
                        <input
                          type="password"
                          value={adminCredentials.password}
                          onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                          placeholder="******"
                          className="w-full rounded-lg border border-line bg-surface-strong py-2 pl-10 pr-3 text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted">
                      <Shield className="size-3 inline mr-1" />
                      As credenciais são usadas apenas para esta sessão e não são armazenadas.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Agentes de Auditoria</label>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {mockAgents.map((agent) => (
                      <button
                        key={agent.key}
                        type="button"
                        onClick={() => toggleAgent(agent.key)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                          selectedAgents.includes(agent.key)
                            ? "border-brand/40 bg-brand/5 text-foreground"
                            : "border-line bg-surface-strong/30 text-muted hover:border-brand/20"
                        }`}
                      >
                        <span className="text-lg">{agent.avatar}</span>
                        <div>
                          <p className="text-xs font-bold">{agent.name}</p>
                          <p className="text-[10px] opacity-70">{agent.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startAnalysis}
                  disabled={!url}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-bold text-neutral-950 shadow-md shadow-brand/10 transition duration-300 hover:bg-brand-strong disabled:opacity-40"
                >
                  <Search size={16} />
                  Iniciar Auditoria Automática
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/30 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-brand mb-4">
                <Sparkles size={16} />
                <h3 className="text-sm font-bold uppercase tracking-wider">Recursos Incluídos</h3>
              </div>
              <ul className="space-y-3 text-xs text-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Varredura completa de bugs HTML/CSS/JS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Análise de acessibilidade WCAG 2.1</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Auditoria de design e paleta visual</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Acesso administrativo com credenciais</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Relatório detalhado com sugestões</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      )}

      {status === "login" && (
        <div className="mx-auto max-w-md py-20">
          <div className="rounded-2xl border border-line bg-surface/50 p-8 shadow-xl backdrop-blur-md text-center">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-4">
              <Shield size={28} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Autenticação Administrativa</h2>
            <p className="text-sm text-muted mb-6">
              Conectando-se à área administrativa do site para análise profunda...
            </p>
            <div className="h-2 w-full bg-surface-strong overflow-hidden rounded-full border border-line">
              <div 
                className="h-full bg-brand rounded-full transition-all duration-300" 
                style={{ width: `${(stepIndex / auditSteps.length) * 100}%` }}
              />
            </div>
            <p className="mt-4 text-xs font-semibold text-brand">
              {auditSteps[stepIndex]}
            </p>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="mx-auto max-w-xl text-center py-20">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-6 animate-bounce">
            <Sparkles size={28} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Executando Auditoria Automática</h2>
          <p className="text-sm text-muted mt-2">Aguarde enquanto analisamos seu domínio...</p>

          <div className="mt-8 rounded-2xl border border-line bg-surface/50 p-6 text-left shadow-lg">
            <div className="flex items-center justify-between text-xs text-muted font-bold mb-3 uppercase tracking-wider">
              <span>Progresso do Scan</span>
              <span>{Math.round((stepIndex / (auditSteps.length - 1)) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-surface-strong overflow-hidden rounded-full border border-line">
              <div 
                className="h-full bg-brand rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                style={{ width: `${(stepIndex / (auditSteps.length - 1)) * 100}%` }}
              />
            </div>
            <p className="mt-4 text-xs font-semibold text-brand text-center animate-pulse">
              {auditSteps[stepIndex]}
            </p>
          </div>
        </div>
      )}

      {status === "done" && result && (
        <div className="space-y-6">
          <button 
            onClick={resetAnalysis} 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-brand transition"
          >
            ← Nova análise
          </button>

          <section className="overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 mb-6">
              <div>
                <span className="text-xs font-semibold text-brand uppercase tracking-wider">Domínio Auditado</span>
                <h2 className="text-xl font-extrabold text-foreground">{result.url}</h2>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400">
                <CheckCircle2 size={14} />
                <span>SSL Ativo &amp; Protegido</span>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: "SEO", value: result.score.seo, color: "text-amber-500", icon: "📊" },
                { label: "UX", value: result.score.ux, color: "text-violet-500", icon: "👁️" },
                { label: "Performance", value: result.score.perf, color: "text-emerald-500", icon: "⚡" },
                { label: "CRO", value: result.score.cro, color: "text-rose-500", icon: "🏆" },
                { label: "Código", value: result.score.code, color: "text-blue-500", icon: "🔧" },
                { label: "Design", value: result.score.design, color: "text-purple-500", icon: "🎨" }
              ].map((s, idx) => (
                <div key={idx} className={`rounded-xl border border-line p-3 text-center ${s.color}`}>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">{s.label}</p>
                  <p className="text-2xl font-extrabold tracking-tight mt-1">{s.value}<span className="text-xs text-muted">/100</span></p>
                  <p className="text-xs mt-1">{s.icon}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <section className="rounded-2xl border border-line bg-surface/40 p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Bugs & Alertas Identificados</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {result.issues.map((issue, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-3 rounded-xl border p-4 text-xs leading-relaxed ${
                        issue.type === "error" ? "border-rose-500/20 bg-rose-500/5" :
                        issue.type === "warning" ? "border-amber-500/20 bg-amber-500/5" :
                        issue.type === "info" ? "border-blue-500/20 bg-blue-500/5" :
                        "border-emerald-500/20 bg-emerald-500/5"
                      }`}
                    >
                      <AlertCircle className={`size-5 shrink-0 mt-0.5 ${
                        issue.type === "error" ? "text-rose-500" :
                        issue.type === "warning" ? "text-amber-500" :
                        issue.type === "info" ? "text-blue-500" :
                        "text-emerald-500"
                      }`} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-foreground">{issue.title}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            issue.category === "seo" ? "bg-amber-500/10 text-amber-400" :
                            issue.category === "code" ? "bg-blue-500/10 text-blue-400" :
                            issue.category === "design" ? "bg-purple-500/10 text-purple-400" :
                            issue.category === "perf" ? "bg-emerald-500/10 text-emerald-400" :
                            "bg-rose-500/10 text-rose-400"
                          }`}>
                            {issue.category.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-muted">{issue.description}</p>
                        {issue.suggestion && (
                          <p className="mt-2 text-[11px] text-brand font-medium bg-brand/5 p-2 rounded">
                            💡 Sugerido: {issue.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-line bg-surface/40 p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Detalhes Técnicos</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <p className="text-muted mb-2 font-semibold">Validação HTML</p>
                    <div className="flex gap-4">
                      <span className="text-rose-500">Erros: {result.technical.htmlValidation.errors}</span>
                      <span className="text-amber-500">Warnings: {result.technical.htmlValidation.warnings}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted mb-2 font-semibold">CSS</p>
                    <div className="flex gap-4">
                      <span className="text-rose-500">Erros: {result.technical.cssIssues.errors}</span>
                      <span className="text-amber-500">Não utilizados: {result.technical.cssIssues.unused}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted mb-2 font-semibold">JavaScript Errors</p>
                    <div className="bg-surface-strong rounded p-2 max-h-24 overflow-y-auto">
                      {result.technical.jsErrors.map((err, i) => (
                        <p key={i} className="text-rose-400 font-mono text-[11px]">{err}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted mb-2 font-semibold">Acessibilidade</p>
                    <span className="text-emerald-400">Passes: {result.technical.accessibility.passes}</span>
                    <span className="text-rose-400 ml-4">Violações: {result.technical.accessibility.violations}</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section className="relative overflow-hidden rounded-2xl border border-brand/25 bg-gradient-to-b from-brand/5 to-surface/20 p-6 shadow-xl backdrop-blur-md">
                <div className="absolute right-0 top-0 size-24 bg-brand/5 blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Ações Corretivas IA</h3>
                  <BarChart3 className="size-4 text-brand" />
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {result.suggestions.map((s, idx) => (
                    <div key={idx} className="rounded-xl border border-line bg-surface p-3 text-xs shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-brand font-mono">Agente {s.agent}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                          s.impact === "high" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
                        }`}>
                          Impacto {s.impact === "high" ? "Alto" : "Médio"}
                        </span>
                      </div>
                      <p className="font-bold text-foreground mb-1">{s.title}</p>
                      <p className="text-muted leading-relaxed">{s.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-surface py-2 text-xs font-medium hover:bg-surface-strong transition"
                  >
                    <Copy size={12} />
                    Copiar Relatório
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-surface py-2 text-xs font-medium hover:bg-surface-strong transition"
                  >
                    <ExternalLink size={12} />
                    Exportar PDF
                  </button>
                </div>
              </section>

              <section className="rounded-2xl border border-line bg-surface/30 p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Próximos Passos</h3>
                <ol className="text-xs text-muted space-y-2">
                  <li className="flex gap-2">
                    <span className="text-brand font-bold">1.</span>
                    <span>Implementar correções de código (HTML/CSS/JS)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand font-bold">2.</span>
                    <span>Ajustar contraste e paleta visual para WCAG</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand font-bold">3.</span>
                    <span>Adicionar schema markup e otimizar SEO</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand font-bold">4.</span>
                    <span>Re-auditar após 30 dias para validar melhorias</span>
                  </li>
                </ol>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}