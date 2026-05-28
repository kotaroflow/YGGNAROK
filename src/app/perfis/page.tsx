import { AppShell } from "@/components/app-shell";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import { operationalTags } from "@/lib/tags";
import { createProfile } from "@/server/actions/profiles";
import { getProfiles } from "@/server/data/dashboard";

export default async function PerfisPage() {
  const profiles = await getProfiles();

  return (
    <AppShell>
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[380px_1fr] lg:px-8">
        <section className="rounded-lg border border-black/5 bg-white/78 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/70">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">入口 - Iriguchi</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-stone-50">Perfis</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-stone-400">Crie e organize os perfis operacionais do sistema.</p>

          <form action={createProfile} className="mt-6 space-y-4">
            <Field label="Nome"><input className={inputClass} name="name" required /></Field>
            <Field label="Slug"><input className={inputClass} name="slug" required pattern="[a-z0-9-]+" placeholder="meu-perfil" /></Field>
            <Field label="Descricao"><textarea className={textareaClass} name="description" /></Field>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-stone-200">Tags iniciais</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(operationalTags).slice(0, 4).flatMap(([group, tags]) =>
                  tags.slice(0, 3).map((tag) => (
                    <label key={`${group}:${tag}`} className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-xs text-slate-600 shadow-sm dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300">
                      <input type="checkbox" name="tags" value={`${group}:${tag}`} />
                      {group}:{tag}
                    </label>
                  )),
                )}
              </div>
            </div>
            <button className={buttonClass}>Criar perfil</button>
          </form>
        </section>

        <section className="rounded-lg border border-black/5 bg-white/78 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-stone-50">Perfis disponiveis</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-stone-400">{profiles.length} perfil(is) visiveis nesta sessao.</p>
            </div>
          </div>
          <div className="mt-4 divide-y divide-slate-200/70 dark:divide-neutral-800">
            {profiles.length ? profiles.map((profile) => (
              <article key={profile.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-stone-100">{profile.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-stone-400">/{profile.slug}</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-stone-300">{profile.description || "Sem descricao."}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-neutral-900/80 dark:text-stone-300">{profile.status}</span>
                </div>
              </article>
            )) : <p className="grid min-h-40 place-items-center rounded-lg border border-dashed border-slate-200 py-8 text-sm text-slate-500 dark:border-neutral-800 dark:text-stone-400">Nenhum perfil visivel para esta sessao.</p>}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
