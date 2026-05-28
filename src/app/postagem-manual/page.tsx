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
        <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">創作工房 — Sōsaku Kōbō</p>
          <h1 className="mt-1 text-2xl font-semibold">Postagem Manual</h1>
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
          <form action={createGuidedAiJob} className="mt-4 space-y-3 rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
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

        <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          <h2 className="text-lg font-semibold">Fila manual</h2>
          <div className="mt-4 divide-y divide-slate-200/70 dark:divide-neutral-800">
            {queue.length ? queue.map((item) => (
              <article key={item.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{item.platform}</h3>
                    <p className="text-sm text-slate-400 dark:text-stone-500">{item.status} · {item.planned_date || "sem data"}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-stone-300">{item.caption_to_copy || "Sem legenda."}</p>
                    {item.hashtags_to_copy?.length ? <p className="mt-1 text-xs text-stone-500">{item.hashtags_to_copy.join(" ")}</p> : null}
                  </div>
                  {item.status !== "posted" ? (
                    <form action={markManualPostAsPublished} className="flex min-w-56 flex-col gap-2">
                      <input type="hidden" name="queueId" value={item.id} />
                      <input className={inputClass} name="postUrl" placeholder="URL do post" />
                      <button className={buttonClass}>Marcar publicado</button>
                    </form>
                  ) : <a className="text-sm text-amber-700 dark:text-amber-300" href={item.post_url ?? "#"}>Abrir post</a>}
                </div>
              </article>
            )) : <p className="py-8 text-sm text-stone-500">Nenhum item na fila manual.</p>}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
