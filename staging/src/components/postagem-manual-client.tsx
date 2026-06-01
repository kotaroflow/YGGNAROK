"use client";

import { useState } from "react";
import { 
  Sparkles, Search, Copy, Check, Calendar, ExternalLink, 
  Cpu, Plus, Clock, Link as LinkIcon, Globe, Send 
} from "lucide-react";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";

interface Profile {
  id: string;
  name: string;
}

interface ContentItem {
  id: string;
  title: string;
}

interface ManualPostingItem {
  id: string;
  platform: string;
  status: string;
  planned_date: string | null;
  caption_to_copy: string | null;
  hashtags_to_copy: string[] | null;
  post_url: string | null;
}

interface PostagemManualClientProps {
  profiles: Profile[];
  contents: ContentItem[];
  queue: ManualPostingItem[];
  createManualPostingItemAction: (formData: FormData) => void;
  createGuidedAiJobAction: (formData: FormData) => void;
  markManualPostAsPublishedAction: (formData: FormData) => void;
}

export function PostagemManualClient({
  profiles,
  contents,
  queue,
  createManualPostingItemAction,
  createGuidedAiJobAction,
  markManualPostAsPublishedAction
}: PostagemManualClientProps) {
  const [activeFormTab, setActiveFormTab] = useState<"manual" | "ai">("manual");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);

  const filteredQueue = queue.filter(item => 
    item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.caption_to_copy || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyCaption = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaptionId(id);
    setTimeout(() => setCopiedCaptionId(null), 2000);
  };

  const totalPosted = queue.filter(item => item.status === "posted").length;
  const totalPending = queue.filter(item => item.status !== "posted").length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 space-y-8">
      {/* Header section with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Fluxo de Distribuição</p>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
            Postagem Manual
          </h1>
          <p className="mt-2 text-sm text-muted">
            Organize a publicação manual e prepare checklists de legendas para suas redes sociais.
          </p>
        </div>

        {/* Floating Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="rounded-2xl border border-line bg-surface/30 px-4 py-3 text-center min-w-[100px] backdrop-blur-sm">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">Fila Pendente</span>
            <span className="text-xl font-extrabold text-amber-500 mt-0.5 block">{totalPending}</span>
          </div>
          <div className="rounded-2xl border border-line bg-surface/30 px-4 py-3 text-center min-w-[100px] backdrop-blur-sm">
            <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">Publicados</span>
            <span className="text-xl font-extrabold text-emerald-500 mt-0.5 block">{totalPosted}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
        
        {/* LEFT COLUMN: Dual Form Panel (Manual Creation / AI Legenda Yomi) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute -top-10 -left-10 size-40 rounded-full bg-brand/5 blur-2xl pointer-events-none" />

            <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand mb-2">創作工房 — Sōsaku Kōbō</p>
            <h2 className="text-lg font-bold text-foreground tracking-tight mb-4">Orquestrar Legenda</h2>

            {/* Selector tabs */}
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
                <span>Adicionar Post</span>
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
                <span>Legenda via IA</span>
              </button>
            </div>

            {/* Manual input form */}
            {activeFormTab === "manual" ? (
              <form action={createManualPostingItemAction} className="space-y-4">
                <Field label="Perfil Alvo">
                  <select className={inputClass} name="profileId" required>
                    <option value="">Selecione um perfil...</option>
                    {profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>{profile.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Selecionar Ativo da Criação">
                  <select className={inputClass} name="contentId" required>
                    <option value="">Selecione o conteúdo...</option>
                    {contents.map((content) => (
                      <option key={content.id} value={content.id}>{content.title}</option>
                    ))}
                  </select>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Plataforma">
                    <input className={inputClass} name="platform" placeholder="Ex: Instagram, TikTok" required />
                  </Field>
                  <Field label="Planejado Para">
                    <input className={inputClass} name="plannedDate" type="date" />
                  </Field>
                </div>

                <Field label="Legenda Pronta">
                  <textarea className={textareaClass} rows={4} name="caption" placeholder="Escreva a legenda..." />
                </Field>

                <Field label="Hashtags Sugeridas">
                  <input className={inputClass} name="hashtags" placeholder="Separadas por espaço: #tag #marketing" />
                </Field>

                <button type="submit" className={`${buttonClass} w-full py-3 text-xs font-extrabold tracking-wider bg-brand text-neutral-950 hover:bg-brand-strong rounded-xl transition shadow-md flex items-center justify-center gap-2`}>
                  <Calendar size={14} />
                  <span>Agendar Postagem</span>
                </button>
              </form>
            ) : (
              /* AI Copy generator powered by Yomi */
              <form action={createGuidedAiJobAction} className="space-y-4">
                <input type="hidden" name="type" value="posting.prepare" />
                <input type="hidden" name="agentKey" value="yomi" />
                <input type="hidden" name="source" value="posting_page" />

                <Field label="Perfil para Yomi AI">
                  <select className={inputClass} name="profileId" required>
                    <option value="">Selecione o perfil...</option>
                    {profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>{profile.name}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Diretrizes do Briefing de Distribuição">
                  <textarea 
                    className={textareaClass} 
                    rows={8} 
                    name="brief" 
                    placeholder="Especifique o tom, os tópicos, o objetivo do vídeo/postagem, ganchos emocionais e chamada para ação (CTA). O agente Yomi gerará legendas magnéticas completas com emojis e hashtags." 
                    required 
                  />
                </Field>

                <div className="rounded-xl bg-brand/5 border border-brand/15 p-3 text-[10px] text-brand leading-relaxed font-bold flex items-start gap-2">
                  <Cpu size={14} className="shrink-0 mt-0.5 animate-pulse" />
                  <span>A assistente neural <strong>Yomi</strong> é especialista em retenção orgânica, criando ganchos rápidos e CTAs precisos para viralização.</span>
                </div>

                <button type="submit" className={`${buttonClass} w-full py-3 text-xs font-extrabold tracking-wider bg-brand text-neutral-950 hover:bg-brand-strong rounded-xl transition shadow-md flex items-center justify-center gap-2`}>
                  <Sparkles size={14} />
                  <span>Gerar com Yomi AI</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Distribution Queue */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface/40 p-4 border border-line rounded-2xl backdrop-blur-md">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-4" />
              <input
                type="text"
                placeholder="Buscar canais/plataformas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-xl border border-line bg-surface-strong/30 text-xs text-foreground placeholder:text-muted outline-none transition focus:border-brand/40"
              />
            </div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">
              Gerencie postagens e salve URLs publicados
            </p>
          </div>

          {filteredQueue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-line rounded-2xl bg-surface/10">
              <div className="grid size-16 place-items-center rounded-2xl bg-brand/5 text-brand mb-4">
                <Globe size={28} />
              </div>
              <h3 className="text-sm font-bold text-foreground">Nenhum agendamento pendente</h3>
              <p className="mt-1 text-xs text-muted">Use a coluna lateral para programar novas postagens nas redes.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredQueue.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl border border-line bg-surface/30 p-5 transition-all duration-300 hover:border-brand/20 hover:bg-surface/50 hover:shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 space-y-3 min-w-0">
                      
                      {/* Badge / Platform Info */}
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                          <Globe size={16} className="text-brand shrink-0" />
                          {item.platform}
                        </h3>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest ${
                          item.status === "posted" 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                            : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        }`}>
                          {item.status === "posted" ? "Publicado" : "Pendente"}
                        </span>
                        
                        {item.planned_date && (
                          <span className="text-[10px] text-muted font-bold flex items-center gap-1 font-mono">
                            <Clock size={12} />
                            {new Date(item.planned_date).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                      </div>

                      {/* Caption display */}
                      <div className="rounded-xl border border-line/45 bg-surface-strong/45 p-3.5">
                        <p className="text-[11px] text-muted leading-relaxed font-semibold whitespace-pre-wrap">
                          {item.caption_to_copy || "Sem legenda associada."}
                        </p>
                        {item.hashtags_to_copy?.length ? (
                          <p className="mt-2 text-[10px] font-mono font-bold text-brand">
                            {item.hashtags_to_copy.join(" ")}
                          </p>
                        ) : null}
                      </div>

                      {/* Copy actions */}
                      {item.caption_to_copy && (
                        <button
                          type="button"
                          onClick={() => handleCopyCaption(item.id, `${item.caption_to_copy}\n\n${(item.hashtags_to_copy || []).join(" ")}`)}
                          className={`flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl text-[10px] font-bold transition-all ${
                            copiedCaptionId === item.id
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-500"
                              : "bg-surface-strong/60 border border-line hover:border-brand/40 hover:text-foreground"
                          }`}
                        >
                          {copiedCaptionId === item.id ? (
                            <>
                              <Check size={12} />
                              <span>Copiado para publicação</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copiar Legenda + Hashtags</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Dynamic Action Forms */}
                    <div className="w-full md:w-64 shrink-0 p-4 rounded-xl bg-surface-strong/30 border border-line/60 flex flex-col justify-center">
                      {item.status !== "posted" ? (
                        <form action={markManualPostAsPublishedAction} className="space-y-3">
                          <input type="hidden" name="queueId" value={item.id} />
                          <p className="text-[10px] font-extrabold text-brand uppercase tracking-wider block">Confirmar Envio</p>
                          <div className="space-y-2">
                            <input 
                              className={`${inputClass} text-xs py-2`} 
                              name="postUrl" 
                              placeholder="Cole o link do post pronto..." 
                              required 
                            />
                            <button className={`${buttonClass} w-full py-2.5 text-[10px] font-extrabold uppercase tracking-wider bg-brand text-neutral-950 hover:bg-brand-strong rounded-xl transition flex items-center justify-center gap-1.5`}>
                              <Send size={12} />
                              <span>Finalizar Canal</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-2 text-center">
                          <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider">Publicado com Sucesso</p>
                          <a 
                            className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500 hover:bg-emerald-500/20 transition-all w-full" 
                            href={item.post_url ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink size={12} />
                            <span>Abrir Postagem</span>
                          </a>
                        </div>
                      )}
                    </div>
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
