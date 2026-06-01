"use client";

import { useState } from "react";
import { Globe, Search, Sparkles, AlertCircle, CheckCircle2, Shield, User, Key, ExternalLink, Copy, Bug, Palette, Code, BarChart3 } from "lucide-react";

interface AuditResult {
  url: string;
  score: { seo: number; ux: number; perf: number; cro: number; code: number; design: number };
  details: { title: string; description: string; h1: string; h2Count: number; ssl: boolean; loadTime: string; responsive: boolean; cookies: boolean };
  issues: { type: "warning" | "error" | "success" | "info"; category: "seo" | "code" | "design" | "perf" | "security"; title: string; description: string; suggestion?: string }[];
  suggestions: { title: string; impact: "high" | "medium" | "low"; agent: string; text: string }[];
  technical: { htmlValidation: { errors: number; warnings: number }; cssIssues: { errors: number; unused: number }; jsErrors: string[]; accessibility: { violations: number; passes: number } };
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

export function AnaliseSiteClient() {
  const [url, setUrl] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["hermes", "atlas", "pixel"]);
  const [status, setStatus] = useState<"idle" | "login" | "loading" | "done">("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [useAdminAuth, setUseAdminAuth] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });

  const toggleAgent = (agentKey: string) => {
    setSelectedAgents(prev => prev.includes(agentKey) ? prev.filter(k => k !== agentKey) : [...prev, agentKey]);
  };

  const startAnalysis = () => {
    if (!url) return;
    setStatus("loading");
    setStepIndex(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < auditSteps.length) {
        setStepIndex(currentStep);
      } else {
        clearInterval(interval);
        const mockResult: AuditResult = {
          url: url,
          score: { seo: 85, ux: 82, perf: 78, cro: 75, code: 90, design: 88 },
          details: { title: `Site: ${url}`, description: "Descrição da página", h1: `Bem-vindo`, h2Count: 5, ssl: url.startsWith("https"), loadTime: "1.2s", responsive: true, cookies: true },
          issues: [
            { type: "warning", category: "seo", title: "Meta description curta", description: "Adicione mais detalhes." },
            { type: "error", category: "code", title: "Imagens sem ALT", description: "Algumas imagens não têm descrição alternativa." }
          ],
          suggestions: [
            { title: "Otimizar SEO", impact: "high", agent: "Hermes", text: "Melhore as tags meta." },
            { title: "Corrigir contraste", impact: "medium", agent: "Isis", text: "Ajuste cores para acessibilidade." }
          ],
          technical: { htmlValidation: { errors: 2, warnings: 5 }, cssIssues: { errors: 1, unused: 10 }, jsErrors: [], accessibility: { violations: 1, passes: 30 } }
        };
        setResult(mockResult);
        setStatus("done");
      }
    }, 300);
  };

  const resetAnalysis = () => { setStatus("idle"); setStepIndex(0); setResult(null); };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-brand" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Estúdio · Audit</p>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Análise Automática de Site</h1>
        <p className="mt-2 text-sm text-muted">Auditoria completa de bugs, SEO, design e sugestões de melhorias.</p>
      </div>

      {status === "idle" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-line bg-surface-strong p-6">
              <h2 className="text-lg font-bold mb-4">Configurar Análise</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">URL do site</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted" />
                    <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://meusite.com" className="w-full rounded-xl border border-line bg-surface-strong py-4 pl-12 pr-4 text-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="admin-auth" checked={useAdminAuth} onChange={(e) => setUseAdminAuth(e.target.checked)} className="w-4 h-4" />
                  <label htmlFor="admin-auth" className="text-sm text-muted cursor-pointer">Usar autenticação administrativa</label>
                </div>
                {useAdminAuth && (
                  <div className="space-y-3 p-4 bg-surface rounded-xl">
                    <input type="text" placeholder="Usuário" value={adminCredentials.username} onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})} className="w-full" />
                    <input type="password" placeholder="Senha" value={adminCredentials.password} onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})} className="w-full" />
                  </div>
                )}
                <button onClick={startAnalysis} disabled={!url} className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-4 text-sm font-bold disabled:opacity-40">
                  <Search size={16} /> Iniciar Auditoria
                </button>
              </div>
            </section>
          </div>
          <div>
            <section className="rounded-2xl border border-line bg-surface-strong p-6">
              <div className="flex items-center gap-2 text-brand mb-4"><Sparkles size={16} /><h3 className="text-sm font-bold">Recursos</h3></div>
              <ul className="space-y-3 text-xs text-muted">
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" /><span>Varredura de bugs HTML/CSS/JS</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" /><span>Análise de acessibilidade WCAG</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" /><span>Auditoria de design visual</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" /><span>Acesso administrativo</span></li>
              </ul>
            </section>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="text-center py-12">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-6">
            <Sparkles size={28} />
          </div>
          <h2 className="text-xl font-bold mb-2">Executando Auditoria...</h2>
          <p className="text-sm text-muted mb-6">{auditSteps[stepIndex]}</p>
          <div className="w-full bg-surface-strong rounded-full h-2 mb-2">
            <div className="bg-brand h-2 rounded-full transition-all" style={{ width: `${(stepIndex / (auditSteps.length - 1)) * 100}%` }} />
          </div>
          <p className="text-xs text-muted">{Math.round((stepIndex / (auditSteps.length - 1)) * 100)}%</p>
        </div>
      )}

      {status === "done" && result && (
        <div className="space-y-6">
          <button onClick={resetAnalysis} className="text-xs font-bold text-muted hover:text-brand">← Nova análise</button>
          
          <section className="rounded-2xl border border-line bg-surface-strong p-6">
            <div className="flex justify-between items-center mb-4">
              <div><span className="text-xs text-brand uppercase">Domínio Auditado</span><h2 className="text-xl font-bold">{result.url}</h2></div>
              <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">Concluído</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {Object.entries(result.score).map(([label, value]) => (
                <div key={label} className="score-card text-center">
                  <p className="text-xs text-muted uppercase">{label}</p>
                  <p className="text-2xl font-bold">{value}<span className="text-xs text-muted">/100</span></p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="rounded-2xl border border-line bg-surface-strong p-6">
              <h3 className="text-sm font-bold mb-4">Bugs & Alertas</h3>
              <div className="space-y-3">
                {result.issues.map((issue, i) => (
                  <div key={i} className="issue-card">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className={`size-5 ${issue.type === "error" ? "text-rose-500" : "text-amber-500"}`} />
                      <p className="font-bold">{issue.title}</p>
                    </div>
                    <p className="text-sm text-muted">{issue.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-surface-strong p-6">
              <h3 className="text-sm font-bold mb-4">Sugestões IA</h3>
              <div className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="suggestion-card">
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-brand">{s.agent}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded bg-${s.impact === "high" ? "rose" : "amber"}-500/10 text-${s.impact === "high" ? "rose" : "amber"}-400`}>
                        {s.impact === "high" ? "Alto" : "Médio"}
                      </span>
                    </div>
                    <p className="font-bold mb-1">{s.title}</p>
                    <p className="text-sm text-muted">{s.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}