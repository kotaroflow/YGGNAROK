"use client";

import { useState } from "react";
import { 
  Sparkles, Search, Copy, Check, FileText, Plus, BookOpen, 
  Cpu, Layers, HelpCircle, Grid, Trash2 
} from "lucide-react";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";

interface Profile {
  id: string;
  name: string;
}

interface LibraryItem {
  id: string;
  title: string;
  type: string;
  body: string | null;
  status: string;
}

interface BibliotecaClientProps {
  profiles: Profile[];
  items: LibraryItem[];
  createLibraryItemAction: (formData: FormData) => void;
  createGuidedAiJobAction: (formData: FormData) => void;
}

export function BibliotecaClient({ 
  profiles, 
  items, 
  createLibraryItemAction, 
  createGuidedAiJobAction 
}: BibliotecaClientProps) {
  const [activeFormTab, setActiveFormTab] = useState<"manual" | "ai">("manual");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dynamic filter tabs based on existing item types
  const types = ["Todos", ...Array.from(new Set(items.map(item => item.type || "prompt")))];

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.body || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "Todos" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 space-y-8">
      {/* Header section with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Acervo Criativo</p>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
            Biblioteca de Ativos
          </h1>
          <p className="mt-2 text-sm text-muted">
            Repositório central de prompts especialistas, roteiros base e diretivas neurais do YGGNAROK.
          </p>
        </div>

        {/* Floating Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-line bg-surface/30 px-4 py-3 text-center min-w-[100px] backdrop-blur-sm">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">Total Ativos</span>
            <span className="text-xl font-extrabold text-brand mt-0.5 block">{items.length}</span>
          </div>
          <div className="rounded-2xl border border-line bg-surface/30 px-4 py-3 text-center min-w-[100px] backdrop-blur-sm">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">Perfis</span>
            <span className="text-xl font-extrabold text-foreground mt-0.5 block">{profiles.length}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        
        {/* LEFT COLUMN: Premium Dual Form Panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
            {/* Ambient Background Glow inside form */}
            <div className="absolute -top-10 -left-10 size-40 rounded-full bg-brand/5 blur-2xl pointer-events-none" />

            {/* Inner Header */}
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand mb-2">創作工房 — Sōsaku Kōbō</p>
            <h2 className="text-lg font-bold text-foreground tracking-tight mb-4">Adicionar ao Acervo</h2>

            {/* Form Mode Selector tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-surface-strong/60 border border-line rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setActiveFormTab("manual")}
                className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  activeFormTab === "manual"
                    ? "bg-brand text-neutral-950 shadow-md font-extrabold"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Plus size={14} />
                <span>Salvar Item</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab("ai")}
                className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                  activeFormTab === "ai"
                    ? "bg-brand text-neutral-950 shadow-md font-extrabold"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Sparkles size={14} className="animate-pulse" />
                <span>Organizar via IA</span>
              </button>
            </div>

            {/* Manual item form */}
            {activeFormTab === "manual" ? (
              <form action={createLibraryItemAction} className="space-y-4">
                <Field label="Perfil de Criação">
                  <select className={inputClass} name="profileId" required>
                    <option value="">Selecione um perfil...</option>
                    {profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>{profile.name}</option>
                    ))}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tipo de Ativo">
                    <input className={inputClass} name="type" placeholder="Ex: prompt, roteiro" defaultValue="prompt" required />
                  </Field>
                  <Field label="Título Curto">
                    <input className={inputClass} name="title" placeholder="Ex: Gancho Viral" required />
                  </Field>
                </div>
                <Field label="Conteúdo / Corpo do Ativo">
                  <textarea className={textareaClass} rows={6} name="body" placeholder="Escreva o prompt completo, roteiro ou ideia..." required />
                </Field>
                <button type="submit" className={`${buttonClass} w-full py-3 text-xs font-extrabold tracking-wider bg-brand text-neutral-950 hover:bg-brand-strong rounded-xl transition shadow-md flex items-center justify-center gap-2`}>
                  <BookOpen size={14} />
                  <span>Salvar na Biblioteca</span>
                </button>
              </form>
            ) : (
              /* AI organizing material form powered by Hotei */
              <form action={createGuidedAiJobAction} className="space-y-4">
                <input type="hidden" name="type" value="library.organize" />
                <input type="hidden" name="agentKey" value="hotei" />
                <input type="hidden" name="source" value="library_page" />
                
                <Field label="Perfil para Vinculação">
                  <select className={inputClass} name="profileId" required>
                    <option value="">Selecione um perfil...</option>
                    {profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>{profile.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Material Bruto para a IA Organizar">
                  <textarea 
                    className={textareaClass} 
                    rows={8} 
                    name="brief" 
                    placeholder="Cole um prompt desorganizado, ideias soltas, referências de texto ou links. O agente Hotei irá estruturar, categorizar e salvar automaticamente no acervo." 
                    required 
                  />
                </Field>
                
                <div className="rounded-xl bg-brand/5 border border-brand/15 p-3 text-[10px] text-brand leading-relaxed font-bold flex items-start gap-2">
                  <Cpu size={14} className="shrink-0 mt-0.5 animate-pulse" />
                  <span>O agente neural <strong>Hotei</strong> analisa o contexto, cria uma estrutura modular limpa de prompt ou roteiro e classifica de forma inteligente no banco.</span>
                </div>

                <button type="submit" className={`${buttonClass} w-full py-3 text-xs font-extrabold tracking-wider bg-brand text-neutral-950 hover:bg-brand-strong rounded-xl transition shadow-md flex items-center justify-center gap-2`}>
                  <Sparkles size={14} />
                  <span>Organizar com IA</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Curated Feed */}
        <div className="space-y-6">
          {/* Controls Bar: Search & Categories */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface/40 p-4 border border-line rounded-2xl backdrop-blur-md">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-4" />
              <input
                type="text"
                placeholder="Buscar ativos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-line bg-surface-strong/30 text-xs text-foreground placeholder:text-muted outline-none transition focus:border-brand/40"
              />
            </div>

            <div className="flex flex-wrap gap-1 w-full sm:w-auto justify-start sm:justify-end overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all whitespace-nowrap ${
                    selectedType === t
                      ? "bg-brand text-neutral-950 shadow-sm"
                      : "bg-surface-strong/40 border border-line text-muted hover:border-brand/35 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid list */}
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-line rounded-2xl bg-surface/10">
              <div className="grid size-16 place-items-center rounded-2xl bg-brand/5 text-brand mb-4">
                <Grid size={28} />
              </div>
              <h3 className="text-sm font-bold text-foreground">Nenhum ativo localizado</h3>
              <p className="mt-1 text-xs text-muted">Ajuste os filtros ou crie um novo item para visualizá-lo aqui.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col rounded-2xl border border-line bg-surface/30 p-5 transition-all duration-300 hover:border-brand/30 hover:bg-surface/50 hover:shadow-md overflow-hidden"
                >
                  {/* Glowing hover card accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Header / Type */}
                  <div className="flex items-center justify-between mb-3 z-10">
                    <span className="inline-flex rounded-full border border-line bg-surface-strong px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-brand font-mono">
                      {item.type || "prompt"}
                    </span>
                    <span className="text-[9px] font-bold text-muted uppercase tracking-wider">
                      {item.status || "Ativo"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-foreground group-hover:text-brand transition-colors mb-2 z-10">
                    {item.title}
                  </h3>

                  {/* Body Content Box */}
                  <div className="rounded-xl border border-line/40 bg-surface-strong/45 p-3 flex-1 mb-4 max-h-[140px] overflow-y-auto custom-scrollbar z-10">
                    <p className="text-[11px] text-muted leading-relaxed font-semibold whitespace-pre-wrap">
                      {item.body || "Sem conteúdo cadastrado."}
                    </p>
                  </div>

                  {/* Card Actions */}
                  <div className="flex gap-2 z-10 pt-3 border-t border-line/20 mt-auto">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.body || "")}
                      className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-[10px] font-bold transition-all ${
                        copiedId === item.id
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-500"
                          : "bg-surface-strong/60 border border-line hover:border-brand/40 hover:text-foreground"
                      }`}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={12} />
                          <span>Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copiar Conteúdo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
