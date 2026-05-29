import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import { createContentItem } from "@/server/actions/content";
import { createGuidedAiJob } from "@/server/actions/jobs";
import { getContentItems, getProfiles } from "@/server/data/dashboard";
import { Lightbulb, ScrollText, Subtitles, Hash, Brain, Send, Sparkles, Wand2, Layers, CheckCircle } from "lucide-react";

const tabs = [
  { id: "ideias", label: "Ideias", icon: Lightbulb, description: "Novas Pautas", color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30" },
  { id: "roteiros", label: "Roteiros", icon: ScrollText, description: "Scripts e Falas", color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30" },
  { id: "legendas", label: "Legendas", icon: Subtitles, description: "Copy e Ganchos", color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30" },
  { id: "hashtags", label: "Hashtags", icon: Hash, description: "Tags e Alcance", color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30" },
];

export default async function CriarConteudoPage({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const [profiles, contents] = await Promise.all([getProfiles(), getContentItems()]);
  const { aba } = await searchParams;
  const activeTab = aba && tabs.some(t => t.id === aba) ? aba : "ideias";
  const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <AppShell>
      <main className="min-h-screen text-foreground relative overflow-hidden bg-radial-gradient">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-1/4 size-96 rounded-full bg-brand/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 size-80 rounded-full bg-orange-600/5 blur-3xl pointer-events-none" />

        <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-brand" />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">創作工房 · Kobo</p>
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
                Estúdio de Criação
              </h1>
              <p className="mt-2 text-sm text-muted">
                Engine de inteligência criativa para estruturação de marcas de alto impacto.
              </p>
            </div>
            
            {/* Minimal Step Navigation Map */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-xl border border-line bg-surface/40 p-1.5 shadow-inner">
              {tabs.map((tab, idx) => (
                <div key={tab.id} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${activeTab === tab.id ? "text-brand bg-brand/10" : "text-muted"}`}>
                    <span className="size-4 rounded bg-surface-strong grid place-items-center text-[10px]">{idx + 1}</span>
                    <span>{tab.label}</span>
                  </div>
                  {idx < tabs.length - 1 && <span className="text-muted/30 px-1">→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Steps Grid */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/criar-conteudo?aba=${tab.id}`}
                className={`group flex flex-col justify-between rounded-2xl border p-4 transition duration-300 relative overflow-hidden backdrop-blur ${
                  activeTab === tab.id
                    ? "border-brand/40 bg-surface-strong/60 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                    : "border-line bg-surface/30 hover:border-brand/20 hover:bg-surface-strong/20"
                }`}
              >
                {/* Micro Ambient Glow behind active tab icon */}
                {activeTab === tab.id && <div className="absolute -left-10 -top-10 size-24 rounded-full bg-brand/10 blur-xl" />}
                
                <div className="relative flex items-center justify-between">
                  <div className={`grid size-11 place-items-center rounded-xl transition duration-300 ${
                    activeTab === tab.id 
                      ? "bg-brand text-neutral-950 shadow-md shadow-brand/10" 
                      : "bg-surface-strong text-muted group-hover:text-foreground"
                  }`}>
                    <tab.icon size={20} />
                  </div>
                </div>
                
                <div className="mt-5 relative z-10">
                  <p className="text-sm font-bold tracking-tight text-foreground transition group-hover:text-brand">
                    {tab.label}
                  </p>
                  <p className="text-[11px] text-muted font-medium mt-0.5">{tab.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[430px_1fr]">
            {/* WORKSTATION PANEL */}
            <div className="space-y-6">
              {/* Creator Engine Box */}
              <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
                <div className="absolute right-0 top-0 size-24 bg-brand/5 blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-brand" />
                    <h2 className="text-sm font-bold tracking-wider uppercase text-foreground">Composição Manual</h2>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-line text-muted">Aba Ativa</span>
                </div>

                <form action={createContentItem} className="space-y-4">
                  <Field label="Perfil de Lançamento">
                    <select className={`${inputClass} border-line bg-surface-strong hover:border-brand/30 focus:border-brand`} name="profileId" required>
                      <option value="">Selecione o perfil de atuação</option>
                      {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
                    </select>
                  </Field>
                  
                  <Field label="Título Operacional">
                    <input className={`${inputClass} border-line bg-surface-strong focus:border-brand`} name="title" required placeholder="Ex: Masterclass de Engenharia de Prompt" />
                  </Field>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Tipo">
                      <input className={`${inputClass} border-line bg-surface-strong focus:border-brand font-mono text-xs`} name="contentType" defaultValue={activeTab} required />
                    </Field>
                    <Field label="Canal / Rede">
                      <input className={`${inputClass} border-line bg-surface-strong focus:border-brand`} name="platform" placeholder="Instagram, YouTube, etc." />
                    </Field>
                  </div>
                  
                  <Field label="Briefing Criativo / Direcionamento">
                    <textarea 
                      className={`${textareaClass} border-line bg-surface-strong focus:border-brand text-xs`} 
                      name="idea" 
                      placeholder="Estruture a ideia básica, objetivos ou tópicos que devem constar no material..." 
                      rows={5} 
                    />
                  </Field>
                  
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-neutral-950 shadow-md shadow-brand/10 transition duration-300 hover:bg-brand-strong hover:shadow-brand/20">
                    <Send size={15} />
                    Salvar na Fila
                  </button>
                </form>
              </section>

              {/* Advanced AI Director Box */}
              <section className="relative overflow-hidden rounded-2xl border border-brand/25 bg-gradient-to-b from-brand/5 to-surface/20 p-6 shadow-xl backdrop-blur-md">
                <div className="absolute right-0 top-0 size-24 bg-brand/10 blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Brain size={16} className="text-brand animate-pulse" />
                    <h2 className="text-sm font-bold tracking-wider uppercase text-brand">Diretoria IA Especializada</h2>
                  </div>
                  <Sparkles size={14} className="text-brand" />
                </div>

                <form action={createGuidedAiJob} className="space-y-4">
                  <input type="hidden" name="type" value="content.prepare" />
                  <input type="hidden" name="source" value="content_page" />
                  
                  <Field label="Perfil para o Agent Matrix">
                    <select className={`${inputClass} border-line bg-surface-strong`} name="profileId" required>
                      <option value="">Selecione para ativar</option>
                      {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
                    </select>
                  </Field>
                  
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Agente Executor">
                      <select className={`${inputClass} border-line bg-surface-strong text-xs font-semibold`} name="agentKey" defaultValue="hefesto">
                        <option value="hefesto">Hefesto (Redator Estrela)</option>
                        <option value="isis">Isis (Editora Sênior)</option>
                        <option value="morax">Morax (Copywriter de Elite)</option>
                      </select>
                    </Field>
                    <Field label="Modo Operacional">
                      <select className={`${inputClass} border-line bg-surface-strong text-xs`} name="aiMode" defaultValue="deep">
                        <option value="fast">Rápido (Free)</option>
                        <option value="deep">Profundo (Amber AI)</option>
                      </select>
                    </Field>
                  </div>
                  
                  <Field label="Instruções de Refinamento (Prompt)">
                    <textarea 
                      className={`${textareaClass} border-line bg-surface-strong focus:border-brand text-xs`} 
                      name="brief" 
                      placeholder="Gere 3 pautas ultra conectadas com o público alvo, abordando o calcanhar de aquiles..." 
                      required 
                      rows={4} 
                    />
                  </Field>
                  
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand/40 bg-surface px-4 py-3 text-sm font-bold text-brand shadow-inner transition duration-300 hover:bg-brand hover:text-neutral-950 hover:border-transparent">
                    <Wand2 size={15} />
                    Disparar Pipeline Inteligente
                  </button>
                </form>
              </section>
            </div>

            {/* GRID OF DIGITAL ASSETS */}
            <div className="space-y-6">
              <section className="rounded-2xl border border-line bg-surface/40 p-6 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-line pb-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground">
                      Acervo de {activeTabObj.label}
                    </h2>
                    <p className="text-xs text-muted">Materiais catalogados e em processamento</p>
                  </div>
                  <span className="rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-[11px] font-bold text-brand uppercase">
                    {contents.filter(c => activeTab === "ideias" ? true : c.content_type?.toLowerCase().includes(activeTab.slice(0, -1))).length} itens
                  </span>
                </div>

                <div className="grid gap-4">
                  {contents.filter(c => activeTab === "ideias" ? true : c.content_type?.toLowerCase().includes(activeTab.slice(0, -1))).length ? 
                    contents.filter(c => activeTab === "ideias" ? true : c.content_type?.toLowerCase().includes(activeTab.slice(0, -1))).map((item) => (
                    <article 
                      key={item.id} 
                      className="group relative overflow-hidden rounded-2xl border border-line bg-surface-strong/30 p-5 shadow-sm transition duration-300 hover:border-brand/30 hover:bg-surface-strong/60"
                    >
                      <div className="absolute right-0 top-0 size-20 bg-brand/5 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-foreground group-hover:text-brand transition duration-300">
                              {item.title}
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-surface-strong border border-line px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted">
                              {item.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                            <span className="capitalize">{item.content_type}</span>
                            <span className="size-1 rounded-full bg-line" />
                            <span className="uppercase text-[10px] text-brand">{item.platform || "Multicanais"}</span>
                          </div>

                          <p className="text-xs text-muted leading-relaxed line-clamp-3">
                            {item.idea || "Sem briefing detalhado definido."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-line/40 flex justify-between items-center">
                        <div className="flex gap-2">
                          <form action={createGuidedAiJob}>
                            <input type="hidden" name="profileId" value={item.profile_id} />
                            <input type="hidden" name="contentId" value={item.id} />
                            <input type="hidden" name="type" value="content.review" />
                            <input type="hidden" name="agentKey" value="isis" />
                            <input type="hidden" name="aiMode" value="fast" />
                            <input type="hidden" name="source" value="content_list" />
                            <input type="hidden" name="brief" value={`Revise: ${item.title}.`} />
                            <button className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition hover:border-brand/40 hover:text-foreground">
                              <Sparkles size={11} className="text-brand" />
                              Revisão IA
                            </button>
                          </form>
                        </div>
                        <span className="text-[10px] text-muted font-medium">Criado em {new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </article>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-line rounded-2xl bg-surface/10">
                      <div className="grid size-14 place-items-center rounded-2xl bg-brand/5 text-brand/60 mb-4">
                        <activeTabObj.icon size={26} />
                      </div>
                      <h3 className="text-sm font-bold text-foreground">Nenhum item nesta pauta</h3>
                      <p className="mt-1 text-xs text-muted max-w-xs">Gere novos conceitos ou pautas usando o formulário inteligente ao lado.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
