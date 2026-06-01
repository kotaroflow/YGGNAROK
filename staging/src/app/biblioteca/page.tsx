import { AppShell } from "@/components/app-shell";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import { createLibraryItem } from "@/server/actions/content";
import { createGuidedAiJob } from "@/server/actions/jobs";
import { getLibraryItems, getProfiles } from "@/server/data/dashboard";

export default async function BibliotecaPage() {
  const [profiles, items] = await Promise.all([getProfiles(), getLibraryItems()]);

  return (
    <AppShell>
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[380px_1fr] lg:px-8">
        <section className="rounded-lg border border-gray-300 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-neutral-700/50 dark:bg-neutral-950/60">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">創作工房 — Sōsaku Kōbō</p>
          <h1 className="mt-1 text-2xl font-semibold">Biblioteca</h1>
          <form action={createLibraryItem} className="mt-5 space-y-4">
            <Field label="Perfil">
              <select className={inputClass} name="profileId" required>
                <option value="">Selecione</option>
                {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </select>
            </Field>
            <Field label="Tipo"><input className={inputClass} name="type" defaultValue="prompt" required /></Field>
            <Field label="Titulo"><input className={inputClass} name="title" required /></Field>
            <Field label="Corpo"><textarea className={textareaClass} name="body" /></Field>
            <button className={buttonClass}>Salvar na biblioteca</button>
          </form>
          <form action={createGuidedAiJob} className="mt-4 space-y-3 rounded-lg border border-gray-300 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-neutral-700/50 dark:bg-neutral-950/35">
            <input type="hidden" name="type" value="library.organize" />
            <input type="hidden" name="agentKey" value="hotei" />
            <input type="hidden" name="source" value="library_page" />
            <Field label="Perfil para IA">
              <select className={inputClass} name="profileId" required>
                <option value="">Selecione</option>
                {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </select>
            </Field>
            <Field label="Material para organizar"><textarea className={textareaClass} name="brief" placeholder="Cole prompt, referencia ou texto para classificar." required /></Field>
            <button className={buttonClass}>Organizar com IA</button>
          </form>
        </section>

        <section className="rounded-lg border border-gray-300 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-neutral-700/50 dark:bg-neutral-950/60">
          <h2 className="text-lg font-semibold">Itens</h2>
          <div className="mt-4 divide-y divide-gray-200/70 dark:divide-neutral-700/50">
            {items.length ? items.map((item) => (
              <article key={item.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-slate-400 dark:text-stone-500">{item.type} - {item.status}</p>
                    <p className="mt-2 text-sm text-muted">{item.body || "Sem conteudo."}</p>
                  </div>
                </div>
              </article>
            )) : <p className="py-8 text-sm text-stone-500">Nenhum item visivel para esta sessao.</p>}
          </div>
        </section>
      </main>
    </AppShell>
  );
}