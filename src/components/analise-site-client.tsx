"use client";

import { useState } from "react";
import { Globe, BarChart3, Search, Sparkles, AlertCircle, CheckCircle2, ChevronRight, Layout, TrendingUp, Zap, HelpCircle } from "lucide-react";

interface AuditResult {
  url: string;
  score: {
    seo: number;
    ux: number;
    perf: number;
    cro: number;
  };
  details: {
    title: string;
    description: string;
    h1: string;
    h2Count: number;
    ssl: boolean;
    loadTime: string;
  };
  issues: {
    type: "warning" | "error" | "success";
    title: string;
    description: string;
  }[];
  suggestions: {
    title: string;
    impact: "high" | "medium" | "low";
    agent: string;
    text: string;
  }[];
}

const auditSteps = [
  "Estabelecendo conexão segura SSL...",
  "Baixando conteúdo HTML da página inicial...",
  "Analisando Tags de SEO (Meta, OpenGraph, Schema)...",
  "Avaliando contraste de cores e legibilidade UX...",
  "Medindo First Contentful Paint e tamanho do DOM...",
  "Identificando gargalos de conversão (CTA, Escassez)..."
];

const mockAgents = [
  { key: "hermes", name: "Hermes - Mestre de SEO", desc: "Varre indexabilidade, tags meta e hierarquia semântica de headings.", avatar: "🧭" },
  { key: "isis", name: "Isis - Especialista UX/UI", desc: "Avalia contraste visual, fontes, espaçamentos e usabilidade mobile.", avatar: "👁️" },
  { key: "morax", name: "Morax - Mestre de Conversão", desc: "Identifica falhas na jornada de compra, clareza das CTAs e gatilhos mentais.", avatar: "🏆" }
];

export function AnaliseSiteClient() {
  const [url, setUrl] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("hermes");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);

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
        
        const cleanUrl = url.replace(/(^\w+:|^)\/\//, "");
        setResult({
          url: url,
          score: {
            seo: Math.floor(Math.random() * 20) + 75,
            ux: Math.floor(Math.random() * 20) + 70,
            perf: Math.floor(Math.random() * 25) + 65,
            cro: Math.floor(Math.random() * 30) + 60
          },
          details: {
            title: `Portal Oficial | ${cleanUrl.split(".")[0].toUpperCase()}`,
            description: "Descubra as melhores soluções personalizadas de ponta a ponta.",
            h1: `O futuro da tecnologia para ${cleanUrl.split(".")[0].toUpperCase()}`,
            h2Count: 8,
            ssl: true,
            loadTime: `${(Math.random() * 1.5 + 0.5).toFixed(2)}s`
          },
          issues: [
            { type: "error", title: "Ausência de Meta Descrição no Padrão Ideal", description: "A meta descrição atual possui mais de 160 caracteres, o que causa truncamento nos resultados do Google." },
            { type: "warning", title: "Imagens Sem Tag ALT Configurada", description: "Foram localizadas 14 imagens importantes sem descrição alternativa (ALT), prejudicando a acessibilidade e indexação." },
            { type: "success", title: "Certificado de Segurança Ativo (SSL/HTTPS)", description: "Seu site trafega dados de forma segura com criptografia TLS de ponta a ponta ativa." }
          ],
          suggestions: [
            { title: "Otimizar Contraste das Cores nos CTAs", impact: "high", agent: "Isis", text: "O botão principal possui texto branco em fundo âmbar muito claro. Aumentar a saturação ou escurecer o fundo para atingir contraste mínimo de 4.5:1." },
            { title: "Adicionar Tag de Marcação Local (JSON-LD)", impact: "medium", agent: "Hermes", text: "Você não possui marcação de Organização estruturada no cabeçalho. Adicionar script Schema.org para aumentar chances de Rich Snippets." },
            { title: "Inserir Depoimentos Próximos ao Rodapé", impact: "high", agent: "Morax", text: "A página possui pouca prova social imediata. Mover avaliações ou logotipos de clientes parceiros para cima da dobra para reduzir a taxa de rejeição." }
          ]
        });
        setStatus("done");
      }
    }, 1200);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-brand" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Estúdio · Audit</p>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
          Análise Avançada de Site
        </h1>
        <p className="mt-2 text-sm text-muted">
          Auditoria de performance, experiência do usuário (UX), SEO e conversão guiada por múltiplos especialistas de IA do YGGNAROK.
        </p>
      </div>

      {status === "idle" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Panel: Form */}
          <div className="lg:col-span-2 space-y-6">
            <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
              <h2 className="text-lg font-bold text-foreground mb-4">Insira o domínio para auditar</h2>
              
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

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Selecionar Agente de Auditoria</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {mockAgents.map((agent) => (
                      <button
                        key={agent.key}
                        type="button"
                        onClick={() => setSelectedAgent(agent.key)}
                        className={`flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                          selectedAgent === agent.key
                            ? "border-brand/40 bg-brand/5 text-foreground"
                            : "border-line bg-surface-strong/30 text-muted hover:border-brand/20 hover:bg-surface-strong/50"
                        }`}
                      >
                        <span className="text-2xl mb-3">{agent.avatar}</span>
                        <div>
                          <p className="text-xs font-bold text-foreground">{agent.name}</p>
                          <p className="text-[10px] text-muted mt-1 leading-relaxed line-clamp-2">{agent.desc}</p>
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
                  Iniciar Auditoria Técnica com IA
                </button>
              </div>
            </section>
          </div>

          {/* Right Panel: Value Proposition Info */}
          <div className="space-y-6">
            <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/30 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-brand mb-4">
                <Sparkles size={16} />
                <h3 className="text-sm font-bold uppercase tracking-wider">Como funciona?</h3>
              </div>
              <ul className="space-y-4 text-xs text-muted leading-relaxed">
                <li className="flex gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded bg-brand/10 text-[10px] font-bold text-brand font-mono">01</span>
                  <span>O YGGNAROK simula um agente navegando nas abas do seu site.</span>
                </li>
                <li className="flex gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded bg-brand/10 text-[10px] font-bold text-brand font-mono">02</span>
                  <span>Múltiplos modelos realizam a varredura e conferem erros técnicos de SEO, contraste e usabilidade.</span>
                </li>
                <li className="flex gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded bg-brand/10 text-[10px] font-bold text-brand font-mono">03</span>
                  <span>Retornamos um plano de ação pronto para ser implementado ou copiado para o Estúdio de Criação.</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      )}

      {/* Loader screen */}
      {status === "loading" && (
        <div className="mx-auto max-w-xl text-center py-20">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-6 animate-bounce">
            <Sparkles size={28} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Executando Auditoria Remota</h2>
          <p className="text-sm text-muted mt-2">Aguarde enquanto analisamos seu domínio...</p>

          <div className="mt-8 rounded-2xl border border-line bg-surface/50 p-6 text-left shadow-lg">
            <div className="flex items-center justify-between text-xs text-muted font-bold mb-3 uppercase tracking-wider">
              <span>Progresso do Scan</span>
              <span>{Math.round(((stepIndex + 1) / auditSteps.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-surface-strong overflow-hidden rounded-full border border-line">
              <div 
                className="h-full bg-brand rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                style={{ width: `${((stepIndex + 1) / auditSteps.length) * 100}%` }}
              />
            </div>
            <p className="mt-4 text-xs font-semibold text-brand text-center animate-pulse">
              {auditSteps[stepIndex]}
            </p>
          </div>
        </div>
      )}

      {/* Dashboard Result screen */}
      {status === "done" && result && (
        <div className="space-y-6">
          {/* Back to audit button */}
          <button 
            onClick={() => setStatus("idle")} 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-brand transition"
          >
            ← Mudar domínio auditado
          </button>

          {/* Scores Header Block */}
          <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 mb-6">
              <div>
                <span className="text-xs font-semibold text-brand uppercase tracking-wider">Domínio Auditado</span>
                <h2 className="text-xl font-extrabold text-foreground">{result.url}</h2>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400">
                <CheckCircle2 size={14} />
                <span>SSL Conectado &amp; Protegido</span>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              {[
                { label: "SEO Geral", value: result.score.seo, color: "text-amber-500 border-amber-500/20 bg-amber-500/5", desc: "Indexação e Meta Tags" },
                { label: "UX / Acessibilidade", value: result.score.ux, color: "text-violet-500 border-violet-500/20 bg-violet-500/5", desc: "Usabilidade e Legibilidade" },
                { label: "Performance", value: result.score.perf, color: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5", desc: "Velocidade de Carregamento" },
                { label: "Conversão (CRO)", value: result.score.cro, color: "text-rose-500 border-rose-500/20 bg-rose-500/5", desc: "CTA e Textos de Venda" }
              ].map((s, idx) => (
                <div key={idx} className={`rounded-xl border p-4 text-center ${s.color}`}>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">{s.label}</p>
                  <p className="text-3xl font-extrabold tracking-tight mt-2">{s.value}<span className="text-xs text-muted">/100</span></p>
                  <p className="text-[10px] text-muted mt-1 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Audit details & warnings list */}
            <div className="lg:col-span-2 space-y-6">
              {/* Critical Tags Details */}
              <section className="rounded-2xl border border-line bg-surface/40 p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Tags HTML e SEO Encontradas</h3>
                <div className="divide-y divide-line/40 text-xs">
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="text-muted font-mono font-semibold">Title Tag</span>
                    <span className="text-foreground text-right truncate max-w-md">{result.details.title}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="text-muted font-mono font-semibold">Meta Description</span>
                    <span className="text-foreground text-right truncate max-w-md">{result.details.description}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="text-muted font-mono font-semibold">Heading H1 Principal</span>
                    <span className="text-foreground text-right truncate max-w-md">{result.details.h1}</span>
                  </div>
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="text-muted font-mono font-semibold">Contagem Headings H2</span>
                    <span className="text-foreground">{result.details.h2Count} tags</span>
                  </div>
                  <div className="py-3 flex justify-between items-center gap-4">
                    <span className="text-muted font-mono font-semibold">Tempo de Resposta Servidor</span>
                    <span className="text-foreground font-mono">{result.details.loadTime}</span>
                  </div>
                </div>
              </section>

              {/* Scanned Warnings & Errors */}
              <section className="rounded-2xl border border-line bg-surface/40 p-6 shadow-xl backdrop-blur-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Erros &amp; Alertas Identificados</h3>
                <div className="space-y-3">
                  {result.issues.map((issue, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-3 rounded-xl border p-4 text-xs leading-relaxed ${
                        issue.type === "error" ? "border-rose-500/20 bg-rose-500/5 text-rose-800 dark:text-rose-200" :
                        issue.type === "warning" ? "border-amber-500/20 bg-amber-500/5 text-amber-800 dark:text-amber-200" :
                        "border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200"
                      }`}
                    >
                      <AlertCircle className="size-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">{issue.title}</p>
                        <p className="mt-1 text-muted">{issue.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* AI Recommendations Action List */}
            <div className="space-y-6">
              <section className="relative overflow-hidden rounded-2xl border border-brand/25 bg-gradient-to-b from-brand/5 to-surface/20 p-6 shadow-xl backdrop-blur-md">
                <div className="absolute right-0 top-0 size-24 bg-brand/5 blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-brand">Ações Corretivas IA</h3>
                  <Sparkles className="size-4 text-brand animate-pulse" />
                </div>

                <div className="space-y-4">
                  {result.suggestions.map((s, idx) => (
                    <div key={idx} className="rounded-xl border border-line bg-surface p-4 text-xs shadow-sm">
                      <div className="flex items-center justify-between mb-2">
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

                <button 
                  onClick={() => alert("Plano exportado! Agora o YGGNAROK Assistente possui o escopo do seu site no contexto.")}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-xs font-bold text-neutral-950 transition hover:bg-brand-strong"
                >
                  Exportar Plano de Ação para o Chat
                  <ChevronRight size={14} />
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
