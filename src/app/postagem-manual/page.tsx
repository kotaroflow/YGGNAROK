import { AppShell } from "@/components/app-shell";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import { createGuidedAiJob } from "@/server/actions/jobs";
import { createManualPostingItem, markManualPostAsPublished } from "@/server/actions/posting";
import { getContentItems, getManualPostingItems, getProfiles } from "@/server/data/dashboard";
 
export default async function PostagemManualPage() {
  const [profiles, contents, queue] = await Promise.all([getProfiles(), getContentItems(), getManualPostingItems()]);
 
  return (
    <AppShell>
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[380px_1fr] lg:px-8">
        <section className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand">創作工房 — Sōsaku Kōbō</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Postagem Manual</h1>
          <form action={createManualPostingItem} className="mt-5 space-y-4">
            <Field label="Perfil">
              <select className={inputClass} name="profileId" required>
                <option value="">Selecione</option>
                {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </select>
            </Field>
            <Field label="Conteúdo">
              <select className={inputClass} name="contentId" required>
                <option value="">Selecione</option>
                {contents.map((content) => <option key={content.id} value={content.id}>{content.title}</option>)}
              </select>
            </Field>
            <Field label="Plataforma"><input className={inputClass} name="platform" required /></Field>
            <Field label="Legenda para copiar"><textarea className={textareaClass} name="caption" /></Field>
            <Field label="Hashtags"><input className={inputClass} name="hashtags" placeholder="#tag #outra" /></Field>
            <Field label="Data planejada"><input className={inputClass} name="plannedDate" type="date" /></Field>
            <button className={buttonClass}>Criar item manual</button>
          </form>
          <form action={createGuidedAiJob} className="mt-5 space-y-3 rounded-2xl border border-line bg-surface-strong/40 p-5 shadow-sm backdrop-blur-md">
            <input type="hidden" name="type" value="posting.prepare" />
            <input type="hidden" name="agentKey" value="yomi" />
            <input type="hidden" name="source" value="posting_page" />
            <Field label="Perfil para IA">
              <select className={inputClass} name="profileId" required>
                <option value="">Selecione</option>
                {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </select>
            </Field>
            <Field label="Brief de postagem"><textarea className={textareaClass} name="brief" placeholder="Peça checklist, legenda, hashtags e pendências." required /></Field>
            <button className={buttonClass}>Preparar com IA</button>
          </form>
        </section>
 
        <section className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-lg font-bold tracking-tight">Fila Manual</h2>
          <div className="mt-4 divide-y divide-line">
            {queue.length ? queue.map((item) => (
              <article key={item.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-foreground text-sm">{item.platform}</h3>
                    <p className="text-[10px] font-mono font-bold text-muted uppercase mt-0.5">{item.status} · {item.planned_date || "sem data"}</p>
                    <p className="mt-2 text-xs text-muted leading-relaxed font-medium">{item.caption_to_copy || "Sem legenda."}</p>
                    {item.hashtags_to_copy?.length ? <p className="mt-1.5 text-[10px] font-mono text-brand font-bold">{item.hashtags_to_copy.join(" ")}</p> : null}
                  </div>
                  {item.status !== "posted" ? (
                    <form action={markManualPostAsPublished} className="flex min-w-56 flex-col gap-2">
                      <input type="hidden" name="queueId" value={item.id} />
                      <input className={inputClass} name="postUrl" placeholder="URL do post" />
                      <button className={buttonClass}>Marcar publicado</button>
                    </form>
                  ) : <a className="text-xs font-bold text-brand hover:underline" href={item.post_url ?? "#"}>Abrir post</a>}
                </div>
              </article>
            )) : <p className="py-8 text-sm text-muted">Nenhum item na fila manual.</p>}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
