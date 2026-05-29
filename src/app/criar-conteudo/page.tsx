import { AppShell } from "@/components/app-shell";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import { createContentItem } from "@/server/actions/content";
import { createGuidedAiJob } from "@/server/actions/jobs";
import { getContentItems, getProfiles } from "@/server/data/dashboard";

export default async function CriarConteudoPage() {
  const [profiles, contents] = await Promise.all([getProfiles(), getContentItems()]);

  return (
    <AppShell>
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Sosaku Kobo</p>
          <h1 className="mt-1 text-2xl font-semibold">Criar conteudo</h1>

          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
            <h2 className="text-sm font-semibold">Fluxo guiado</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              {["Ideia", "Roteiro", "Legenda", "Hashtags", "Revisao", "Postagem Manual"].map((step, index) => (
                <span key={step} className="rounded-lg border border-amber-200/70 bg-white/60 px-3 py-2 shadow-sm dark:border-amber-900/60 dark:bg-neutral-950/40">{index + 1}. {step}</span>
              ))}
            </div>
          </div>

          <form action={createContentItem} className="mt-5 space-y-4">
            <Field label="Perfil">
              <select className={inputClass} name="profileId" required>
                <option value="">Selecione</option>
                {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </select>
            </Field>
            <Field label="Titulo"><input className={inputClass} name="title" required /></Field>
            <Field label="Tipo"><input className={inputClass} name="contentType" defaultValue="post" required /></Field>
            <Field label="Plataforma"><input className={inputClass} name="platform" placeholder="instagram, tiktok, youtube..." /></Field>
            <Field label="Ideia"><textarea className={textareaClass} name="idea" /></Field>
            <button className={buttonClass}>Salvar conteudo</button>
          </form>

          <form action={createGuidedAiJob} className="mt-4 space-y-3 rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
            <input type="hidden" name="type" value="content.prepare" />
            <input type="hidden" name="source" value="content_page" />
            <Field label="Perfil para IA">
              <select className={inputClass} name="profileId" required>
                <option value="">Selecione</option>
                {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </select>
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Agente">
                <select className={inputClass} name="agentKey" defaultValue="hefesto">
                  <option value="hefesto">Hefesto - criador</option>
                  <option value="isis">Isis - revisora</option>
                  <option value="morax">Morax - vendas</option>
                  <option value="gaia">Gaia - perfil</option>
                  <option value="hotei">Hotei - biblioteca</option>
                  <option value="heimdall">Heimdall - tecnico</option>
                </select>
              </Field>
              <Field label="Modo">
                <select className={inputClass} name="aiMode" defaultValue="fast">
                  <option value="fast">Rapido free</option>
                  <option value="deep">Mais completo</option>
                  <option value="chaos">Debate amplo</option>
                </select>
              </Field>
            </div>
            <Field label="Nome/apelido do agente"><input className={inputClass} name="agentName" placeholder="Ex: roteirista agressivo, editor premium..." /></Field>
            <Field label="Como esse agente deve pensar"><textarea className={textareaClass} name="agentInstructions" placeholder="Ex: gere ideias ousadas, critique sem suavizar, foque em venda e retencao." /></Field>
            <Field label="Formato da entrega"><textarea className={textareaClass} name="outputFormat" placeholder="Ex: 3 ideias, 1 roteiro, legenda curta, hashtags, critica e proximos passos." /></Field>
            <Field label="Brief para IA"><textarea className={textareaClass} name="brief" placeholder="Descreva ideia, oferta, publico e plataforma." required /></Field>
            <button className={buttonClass}>Gerar com IA</button>
          </form>
        </section>

        <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          <h2 className="text-lg font-semibold">Conteudos</h2>
          <div className="mt-4 divide-y divide-slate-200/70 dark:divide-neutral-800">
            {contents.length ? contents.map((item) => (
              <article key={item.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-slate-400 dark:text-stone-500">{item.content_type} - {item.platform || "sem plataforma"}</p>
                    <p className="mt-2 text-sm text-muted">{item.idea || "Sem ideia registrada."}</p>
                    <form action={createGuidedAiJob} className="mt-3">
                      <input type="hidden" name="profileId" value={item.profile_id} />
                      <input type="hidden" name="contentId" value={item.id} />
                      <input type="hidden" name="type" value="content.review" />
                      <input type="hidden" name="agentKey" value="isis" />
                      <input type="hidden" name="aiMode" value="fast" />
                      <input type="hidden" name="source" value="content_list" />
                      <input type="hidden" name="brief" value={`Revise este conteudo: ${item.title}. Ideia: ${item.idea || ""}`} />
                      <button className="rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900">Revisar com IA</button>
                    </form>
                  </div>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">{item.status}</span>
                </div>
              </article>
            )) : <p className="py-8 text-sm text-stone-500">Nenhum conteudo visivel para esta sessao.</p>}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
