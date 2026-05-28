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
        <section className="rounded-lg border border-black/5 bg-white/78 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/70">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">創作工房 - Sosaku Kobo</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-stone-50">Biblioteca</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-stone-400">Guarde prompts, referencias e materiais reutilizaveis.</p>

          <form action={createLibraryItem} className="mt-6 space-y-4">
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

          <form action={createGuidedAiJob} className="mt-5 space-y-3 rounded-lg border border-amber-200/70 bg-amber-50/70 p-4 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20">
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

        <section className="rounded-lg border border-black/5 bg-white/78 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/70">
          <h2 className="text-lg font-bold text-slate-950 dark:text-stone-50">Itens</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">{items.length} item(ns) na biblioteca.</p>
          <div className="mt-4 divide-y divide-slate-200/70 dark:divide-neutral-800">
            {items.length ? items.map((item) => (
              <article key={item.id} className="py-4">
                <h3 className="font-semibold text-slate-900 dark:text-stone-100">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-stone-400">{item.type} - {item.status}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-stone-300">{item.body || "Sem conteudo."}</p>
              </article>
            )) : <p className="grid min-h-40 place-items-center rounded-lg border border-dashed border-slate-200 py-8 text-sm text-slate-500 dark:border-neutral-800 dark:text-stone-400">Nenhum item visivel para esta sessao.</p>}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
