"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Settings, Cpu, Palette, Key, Database, RefreshCw,
  ShieldAlert, Save, Moon, Sun, CheckCircle2, XCircle,
  Loader2, Server, Globe, Network,
  Box, Activity
} from "lucide-react";
import { useTheme } from "@/components/theme-toggle";
import { logger } from "@/lib/utils";

type ServiceStatus = "checking" | "connected" | "error";

interface OllamaModel {
  name: string;
  size?: number;
}

interface SystemInfo {
  nextjs: string;
  nodejs: string;
  buildTime: string;
}

async function checkOllama(): Promise<{ status: ServiceStatus; models: OllamaModel[] }> {
  try {
    const res = await fetch("http://localhost:11434/api/tags", { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { status: "error", models: [] };
    const data = await res.json();
    const models: OllamaModel[] = (data.models || []).map((m: { name: string; size?: number }) => ({
      name: m.name,
      size: m.size,
    }));
    return { status: "connected", models };
  } catch {
    return { status: "error", models: [] };
  }
}

async function checkN8n(): Promise<ServiceStatus> {
  try {
    const res = await fetch("http://localhost:5678/healthz", { signal: AbortSignal.timeout(3000) });
    return res.ok ? "connected" : "error";
  } catch {
    return "error";
  }
}



const STORAGE_KEYS = {
  openrouter: "ygn-openrouter-key",
  gemini: "ygn-gemini-key",
};

function getLS(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

const statusIcon = (status: ServiceStatus, size = 14) => {
  switch (status) {
    case "connected": return <CheckCircle2 size={size} className="text-emerald-500" />;
    case "error": return <XCircle size={size} className="text-rose-500" />;
    default: return <Loader2 size={size} className="animate-spin text-muted" />;
  }
};

const statusLabel: Record<ServiceStatus, { text: string; className: string }> = {
  checking: { text: "Verificando...", className: "text-muted" },
  connected: { text: "Conectado", className: "text-emerald-500" },
  error: { text: "Offline", className: "text-rose-500" },
};

export default function ConfiguracoesClient() {
  const [theme, setTheme] = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [modelDraft, setModelDraft] = useState("mistral");
  const [modelReasoning, setModelReasoning] = useState("qwen");

  const [ollamaStatus, setOllamaStatus] = useState<ServiceStatus>("checking");
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [n8nStatus, setN8nStatus] = useState<ServiceStatus>("checking");

  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    nextjs: "16.2.6",
    nodejs: "",
    buildTime: "",
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved keys on mount
  useEffect(() => {
    const ls = getLS();
    if (!ls) return;
    setOpenrouterKey(ls.getItem(STORAGE_KEYS.openrouter) || "");
    setGeminiKey(ls.getItem(STORAGE_KEYS.gemini) || "");
    setModelDraft(ls.getItem("ygn-model-draft") || "mistral");
    setModelReasoning(ls.getItem("ygn-model-reasoning") || "qwen");
  }, []);

  // Gather system info
  useEffect(() => {
    setSystemInfo({
      nextjs: "16.2.6",
      nodejs: typeof process !== "undefined" ? (process.version || "desconhecido") : "desconhecido",
      buildTime: new Date().toISOString().replace("T", " ").slice(0, 19),
    });
  }, []);

  // Check services
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const [ollama, n8n] = await Promise.all([
        checkOllama(),
        checkN8n(),
      ]);
      if (cancelled) return;
      setOllamaStatus(ollama.status);
      setOllamaModels(ollama.models);
      setN8nStatus(n8n);
    };

    run();
    return () => { cancelled = true; };
  }, []);

  const showSaveMessage = useCallback((msg: string) => {
    setSaveMessage(msg);
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => setSaveMessage(null), 3000);
  }, []);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    // Simulate a brief network delay then persist
    saveTimerRef.current = setTimeout(() => {
      try {
        const ls = getLS();
        if (ls) {
          ls.setItem(STORAGE_KEYS.openrouter, openrouterKey);
          ls.setItem(STORAGE_KEYS.gemini, geminiKey);
          ls.setItem("ygn-model-draft", modelDraft);
          ls.setItem("ygn-model-reasoning", modelReasoning);
        }
        logger.log("[settings] Saved to localStorage");
        showSaveMessage("Configurações salvas com sucesso!");
      } catch (err) {
        logger.error("[settings] Save failed", err);
        showSaveMessage("Erro ao salvar configurações.");
      } finally {
        setIsSaving(false);
      }
    }, 400);
  }, [openrouterKey, geminiKey, modelDraft, modelReasoning, showSaveMessage]);

  const activeProviders = [];
  if (ollamaStatus === "connected") activeProviders.push("Ollama");
  if (openrouterKey) activeProviders.push("OpenRouter");
  if (n8nStatus === "connected") activeProviders.push("n8n");

  return (
    <main className="min-h-screen px-4 py-8 lg:px-8 space-y-8 pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings size={18} className="text-brand" />
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand">System Preferences</p>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Configurações do OS
          </h1>
          <p className="mt-2 text-sm text-muted">
            Gerencie a interface, credenciais neurais e parâmetros base do seu ecossistema.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-[11px] font-medium text-emerald-500 animate-pulse">{saveMessage}</span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-5 py-2.5 text-xs font-bold transition shadow-sm shadow-brand/20 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {isSaving ? "Sincronizando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Main Settings Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* API Keys */}
          <section className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 border-b border-line pb-4">
              <Key size={16} className="text-brand" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">Chaves Neurais (APIs)</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex justify-between">
                  OpenRouter API Key
                  <span className={`text-[9px] font-mono ${openrouterKey ? "text-emerald-500" : "text-amber-500"}`}>
                    {openrouterKey ? "Configurada" : "Não configurada"}
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={openrouterKey}
                    onChange={(e) => setOpenrouterKey(e.target.value)}
                    placeholder="sk-or-v1-****************************************"
                    className="flex-1 w-full rounded-xl border border-line bg-surface-strong px-4 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => { setOpenrouterKey(""); getLS()?.removeItem(STORAGE_KEYS.openrouter); showSaveMessage("Chave OpenRouter removida."); }}
                    className="rounded-xl border border-rose-500/30 px-3 py-2.5 text-rose-500 hover:bg-rose-500/10 transition text-[10px] font-bold"
                    title="Remover chave"
                  >
                    <XCircle size={14} />
                  </button>
                </div>
                <p className="text-[10px] text-muted leading-relaxed">
                  Utilizada para rotear chamadas de IA sem custo através de modelos open-source Llama 3 e Qwen.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex justify-between">
                  Google Gemini API Key
                  <span className={`text-[9px] font-mono ${geminiKey ? "text-emerald-500" : "text-amber-500"}`}>
                    {geminiKey ? "Configurada" : "Opcional"}
                  </span>
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy********************************"
                  className="w-full rounded-xl border border-line bg-surface-strong px-4 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20 font-mono"
                />
              </div>
            </div>
          </section>

          {/* Model Preferences */}
          <section className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 border-b border-line pb-4">
              <Cpu size={16} className="text-brand" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">Motores Cognitivos Padrão</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Criação Rápida (Drafts)</label>
                <select
                  value={modelDraft}
                  onChange={(e) => setModelDraft(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface-strong px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none appearance-none font-medium"
                >
                  <option value="mistral">Mistral Nemo (Grátis)</option>
                  <option value="llama">Llama 3.2 3B (Grátis)</option>
                  <option value="gemini">Gemini 2.0 Flash</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Raciocínio Lógico (Code/UX)</label>
                <select
                  value={modelReasoning}
                  onChange={(e) => setModelReasoning(e.target.value)}
                  className="w-full rounded-xl border border-line bg-surface-strong px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none appearance-none font-medium"
                >
                  <option value="qwen">Qwen 2.5 Coder 32B (Grátis)</option>
                  <option value="deepseek">DeepSeek R1 (Grátis)</option>
                  <option value="llama70">Llama 3.3 70B (Grátis)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Service Status */}
          <section className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 border-b border-line pb-4">
              <Activity size={16} className="text-brand" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">Status dos Serviços</h2>
            </div>

            <div className="space-y-4">
              {/* Ollama */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-line bg-surface-strong/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface border border-line">
                    <Box size={16} className="text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Ollama</p>
                    <p className={`text-[10px] font-mono ${statusLabel[ollamaStatus].className}`}>
                      {statusLabel[ollamaStatus].text}
                      {ollamaStatus === "connected" && ollamaModels.length > 0 && (
                        <> &middot; {ollamaModels.length} modelo{ollamaModels.length !== 1 ? "s" : ""}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ollamaStatus === "connected" && ollamaModels.length > 0 && (
                    <details className="relative">
                      <summary className="text-[10px] text-muted cursor-pointer hover:text-foreground transition list-none">
                        Ver modelos
                      </summary>
                      <div className="absolute right-0 top-6 z-10 min-w-[200px] rounded-xl border border-line bg-surface p-3 shadow-xl backdrop-blur-md">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Modelos disponíveis</p>
                        <ul className="space-y-1">
                          {ollamaModels.map((m) => (
                            <li key={m.name} className="text-[11px] font-mono text-foreground flex justify-between">
                              <span>{m.name}</span>
                              {m.size && (
                                <span className="text-muted">{(m.size / 1e9).toFixed(1)}GB</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  )}
                  {statusIcon(ollamaStatus)}
                </div>
              </div>

              {/* n8n */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-line bg-surface-strong/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface border border-line">
                    <Network size={16} className="text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">n8n</p>
                    <p className={`text-[10px] font-mono ${statusLabel[n8nStatus].className}`}>
                      {statusLabel[n8nStatus].text}
                    </p>
                  </div>
                </div>
                {statusIcon(n8nStatus)}
              </div>
            </div>
          </section>

          {/* System Info */}
          <section className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 border-b border-line pb-4">
              <Server size={16} className="text-brand" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">Informações do Sistema</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-line bg-surface-strong/50">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Next.js</p>
                <p className="text-sm font-bold text-foreground font-mono">{systemInfo.nextjs}</p>
              </div>
              <div className="p-3 rounded-xl border border-line bg-surface-strong/50">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Node.js</p>
                <p className="text-sm font-bold text-foreground font-mono">{systemInfo.nodejs}</p>
              </div>
              <div className="p-3 rounded-xl border border-line bg-surface-strong/50">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Build Time</p>
                <p className="text-sm font-bold text-foreground font-mono">{systemInfo.buildTime}</p>
              </div>
              <div className="p-3 rounded-xl border border-line bg-surface-strong/50">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Provedores Ativos</p>
                <p className="text-sm font-bold text-foreground font-mono">
                  {activeProviders.length > 0 ? activeProviders.join(", ") : "Nenhum"}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-line bg-surface-strong/50">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Modelos Ollama</p>
                <p className="text-sm font-bold text-foreground font-mono">
                  {ollamaStatus === "checking" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    ollamaModels.length
                  )}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-line bg-surface-strong/50">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Tema Atual</p>
                <p className="text-sm font-bold text-foreground font-mono capitalize">{theme === "dark" ? "Void" : "Amber"}</p>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Appearance */}
          <section className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 border-b border-line pb-4">
              <Palette size={16} className="text-brand" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">Aparência do OS</h2>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition ${theme === "dark" ? "border-brand bg-brand/10 text-brand" : "border-line bg-surface text-muted hover:text-foreground"}`}
              >
                <Moon size={16} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Void</span>
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition ${theme === "light" ? "border-brand bg-brand/10 text-brand" : "border-line bg-surface text-muted hover:text-foreground"}`}
              >
                <Sun size={16} />
                <span className="text-[9px] font-bold uppercase tracking-wider">Amber</span>
              </button>
            </div>

            {/* Theme Preview */}
            <div className="rounded-xl border border-line overflow-hidden transition-all duration-300">
              {/* Browser chrome mock */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line bg-surface-strong">
                <div className="w-2 h-2 rounded-full bg-rose-500/60" />
                <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                <div className="ml-2 flex-1 max-w-[120px] rounded-md border border-line bg-surface px-2 py-1">
                  <span className="text-[8px] font-mono text-muted">yggnarok.app</span>
                </div>
              </div>
              {/* Preview content */}
              <div className={`p-4 space-y-3 transition-colors duration-300 ${theme === "dark" ? "bg-neutral-950" : "bg-stone-50"}`}>
                {/* Mock sidebar */}
                <div className="flex gap-3">
                  <div className={`w-8 rounded-md ${theme === "dark" ? "bg-neutral-800" : "bg-stone-200"} h-16`} />
                  <div className="flex-1 space-y-2">
                    {/* Mock header */}
                    <div className={`h-3 w-3/4 rounded ${theme === "dark" ? "bg-neutral-800" : "bg-stone-200"}`} />
                    {/* Mock cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`h-10 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-stone-200"} p-2`}>
                        <div className={`h-1.5 w-1/2 rounded ${theme === "dark" ? "bg-neutral-700" : "bg-stone-300"}`} />
                      </div>
                      <div className={`h-10 rounded-lg ${theme === "dark" ? "bg-neutral-800" : "bg-stone-200"} p-2`}>
                        <div className={`h-1.5 w-2/3 rounded ${theme === "dark" ? "bg-neutral-700" : "bg-stone-300"}`} />
                      </div>
                    </div>
                    {/* Mock brand accent */}
                    <div className={`h-2 w-1/4 rounded ${theme === "dark" ? "bg-amber-500/80" : "bg-amber-500/80"}`} />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-2 text-[10px] text-muted text-center">
              Prévia ao vivo &mdash; {theme === "dark" ? "Void (escuro)" : "Amber (claro)"}
            </p>
          </section>

          {/* Cache and Memory */}
          <section className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 border-b border-rose-500/20 pb-4">
              <Database size={16} className="text-rose-500" />
              <h2 className="text-sm font-bold tracking-tight text-foreground">Memória de Longo Prazo</h2>
            </div>

            <p className="text-[10px] text-muted leading-relaxed mb-4">
              O YGGNAROK OS armazena diretrizes de marca e padrões de escrita na LTM local do seu navegador para economizar tokens de contexto.
            </p>

            <button
              type="button"
              onClick={() => {
                if (confirm("Isto apagará a memória neural salva neste navegador. Continuar?")) {
                  const ls = getLS();
                  if (ls) {
                    // Keep theme but clear settings
                    const theme = ls.getItem("ygn-theme");
                    ls.clear();
                    if (theme) ls.setItem("ygn-theme", theme);
                  }
                  window.location.reload();
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-surface px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition"
            >
              <ShieldAlert size={14} />
              Limpar LTM & Cache Local
            </button>
          </section>

        </div>
      </div>

    </main>
  );
}
