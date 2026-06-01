"use client";

import { useState } from "react";
import { Settings, Cpu, Palette, Key, Database, RefreshCw, ShieldAlert, Save, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-toggle";

export function ConfiguracoesClient() {
  const [theme, setTheme] = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

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
                  <span className="text-[9px] text-emerald-500 font-mono">Conectado</span>
                </label>
                <input 
                  type="password" 
                  defaultValue="sk-or-v1-****************************************"
                  className="w-full rounded-xl border border-line bg-surface-strong px-4 py-2.5 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20 font-mono"
                />
                <p className="text-[10px] text-muted leading-relaxed">
                  Utilizada para rotear chamadas de IA sem custo através de modelos open-source Llama 3 e Qwen.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground flex justify-between">
                  Google Gemini API Key
                  <span className="text-[9px] text-amber-500 font-mono">Opcional</span>
                </label>
                <input 
                  type="password" 
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
                <select className="w-full rounded-xl border border-line bg-surface-strong px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none appearance-none font-medium">
                  <option value="mistral">Mistral Nemo (Grátis)</option>
                  <option value="llama">Llama 3.2 3B (Grátis)</option>
                  <option value="gemini">Gemini 2.0 Flash</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Raciocínio Lógico (Code/UX)</label>
                <select className="w-full rounded-xl border border-line bg-surface-strong px-4 py-2.5 text-xs text-foreground focus:border-brand focus:outline-none appearance-none font-medium">
                  <option value="qwen">Qwen 2.5 Coder 32B (Grátis)</option>
                  <option value="deepseek">DeepSeek R1 (Grátis)</option>
                  <option value="llama70">Llama 3.3 70B (Grátis)</option>
                </select>
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
            
            <div className="grid grid-cols-3 gap-2">
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
                <span className="text-[9px] font-bold uppercase tracking-wider">Ambar</span>
              </button>
            </div>
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
                  localStorage.clear();
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
