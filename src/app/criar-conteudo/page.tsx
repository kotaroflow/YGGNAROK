import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import { createContentItem } from "@/server/actions/content";
import { createGuidedAiJob } from "@/server/actions/jobs";
import { getContentItems, getProfiles } from "@/server/data/dashboard";
import { Lightbulb, ScrollText, Subtitles, Hash, Brain, Send } from "lucide-react";

const tabs = [
  { id: "ideias", label: "Ideias", icon: Lightbulb, description: "Gerador de pautas" },
  { id: "roteiros", label: "Roteiros", icon: ScrollText, description: "Scripts completos" },
  { id: "legendas", label: "Legendas", icon: Subtitles, description: "Textos curtos" },
  { id: "hashtags", label: "Hashtags", icon: Hash, description: "Descoberta" },
];

export default async function CriarConteudoPage({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const [profiles, contents] = await Promise.all([getProfiles(), getContentItems()]);
  const { aba } = await searchParams;
  const activeTab = aba && tabs.some(t => t.id === aba) ? aba : "ideias";

  return (
    <AppShell>
      <main className="min-h-screen text-foreground">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Criação</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Estúdio de Conteúdo</h1>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Gere ideias, estruture roteiros e crie legendas usando o fluxo guiado do YGGNAROK.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/criar-conteudo?aba=${tab.id}`}
                className={`flex flex-col gap-2 rounded-xl border border-line p-4 transition ${
                  activeTab === tab.id
                    ? "bg-surface-strong shadow-sm ring-1 ring-brand/30"
                    : "bg-surface hover:border-brand/30 hover:bg-surface-strong"
                }`}
              >
                <div className={`grid size-10 place-items-center rounded-lg ${activeTab === tab.id ? "bg-brand/10 text-brand" : "bg-muted/10 text-muted"}`}>
                  <tab.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{tab.label}</p>
                  <p className="text-xs text-muted">{tab.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            {/* Form Section */}
            <section className="rounded-xl border border-line bg-surface p-6 shadow-sm backdrop-blur">
              <div className="mb-6 flex items-center gap-2">
                <Brain size={18} className="text-brand" />
                <h2 className="font-semibold">Workflow Manual</h2>
              </div>
              <form action={createContentItem} className="space-y-4">
                <Field label="Perfil">
                  <select className={inputClass} name="profileId" required>
                    <option value="">Selecione o perfil</option>
                    {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
                  </select>
                </Field>
                <Field label="Título"><input className={inputClass} name="title" required placeholder="Ex: Dicas de produtividade" /></Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Tipo"><input className={inputClass} name="contentType" defaultValue={activeTab} required /></Field>
                  <Field label="Plataforma"><input className={inputClass} name="platform" placeholder="Instagram, TikTok..." /></Field>
                </div>
                <Field label="Briefing / Ideia">
                  <textarea className={textareaClass} name="idea" placeholder="Descreva sobre o que é o conteúdo..." rows={4} />
                </Field>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-brand-strong">
                  <Send size={16} />
                  Salvar conteúdo
                </button>
              </form>

              <hr className="my-8 border-line" />

              <div className="mb-6 flex items-center gap-2">
                <Brain size={18} className="text-brand" />
                <h2 className="font-semibold">Geração IA</h2>
              </div>
              <form action={createGuidedAiJob} className="space-y-4 rounded-xl border border-brand/20 bg-brand/5 p-4">
                <input type="hidden" name="type" value="content.prepare" />
                <input type="hidden" name="source" value="content_page" />
                
                <Field label="Perfil para IA">
                  <select className={inputClass} name="profileId" required>
                    <option value="">Selecione</option>
                    {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
                  </select>
                </Field>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Agente Especialista">
                    <select className={inputClass} name="agentKey" defaultValue="hefesto">
                      <option value="hefesto">Hefesto - Criador</option>
                      <option value="isis">Isis - Revisora</option>
                      <option value="morax">Morax - Vendas</option>
                    </select>
                  </Field>
                  <Field label="Modo">
                    <select className={inputClass} name="aiMode" defaultValue="fast">
                      <option value="fast">Rápido</option>
                      <option value="deep">Profundo</option>
                    </select>
                  </Field>
                </div>
                
                <Field label="Pedido Específico (Prompt)">
                  <textarea className={textareaClass} name="brief" placeholder="O que a IA deve fazer com este conteúdo?" required rows={3} />
                </Field>
                
                <button className="w-full rounded-lg bg-surface-strong px-4 py-2.5 text-sm font-semibold text-foreground border border-line transition hover:border-brand/50">
                  Gerar com IA Especialista
                </button>
              </form>
            </section>

            {/* List Section */}
            <section className="rounded-xl border border-line bg-surface p-6 shadow-sm backdrop-blur">
              <h2 className="text-lg font-semibold">Acervo de {tabs.find(t => t.id === activeTab)?.label}</h2>
              <div className="mt-4 divide-y divide-line">
                {contents.filter(c => activeTab === "ideias" ? true : c.content_type?.toLowerCase().includes(activeTab.slice(0, -1))).length ? 
                  contents.filter(c => activeTab === "ideias" ? true : c.content_type?.toLowerCase().includes(activeTab.slice(0, -1))).map((item) => (
                  <article key={item.id} className="py-4 transition hover:bg-surface-strong/50 -mx-4 px-4 rounded-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand uppercase">
                            {item.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-muted">
                          <span>{item.content_type}</span>
                          <span className="size-1 rounded-full bg-line" />
                          <span>{item.platform || "Multiplataforma"}</span>
                        </div>
                        <p className="mt-3 text-sm text-muted line-clamp-3">{item.idea || "Sem briefing detalhado."}</p>
                        
                        <div className="mt-4 flex gap-2">
                          <form action={createGuidedAiJob}>
                            <input type="hidden" name="profileId" value={item.profile_id} />
                            <input type="hidden" name="contentId" value={item.id} />
                            <input type="hidden" name="type" value="content.review" />
                            <input type="hidden" name="agentKey" value="isis" />
                            <input type="hidden" name="aiMode" value="fast" />
                            <input type="hidden" name="source" value="content_list" />
                            <input type="hidden" name="brief" value={`Revise: ${item.title}.`} />
                            <button className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted transition hover:border-brand/30 hover:text-foreground">
                              Revisar com IA
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </article>
                )) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand">
                      <Lightbulb size={28} />
                    </div>
                    <p className="mt-4 text-sm text-muted">Nenhum item encontrado nesta categoria.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
