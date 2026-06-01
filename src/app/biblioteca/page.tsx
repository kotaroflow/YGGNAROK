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
        <section className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand">創作工房 — Sōsaku Kōbō</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Biblioteca</h1>
          <form action={createLibraryItem} className="mt-5 space-y-4">
            <Field label="Perfil">
              <select className={inputClass} name="profileId" required>
                <option value="">Selecione</option>
                {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </select>
            </Field>
            <Field label="Tipo"><input className={inputClass} name="type" defaultValue="prompt" required /></Field>
            <Field label="Título"><input className={inputClass} name="title" required /></Field>
            <Field label="Corpo"><textarea className={textareaClass} name="body" /></Field>
            <button className={buttonClass}>Salvar na biblioteca</button>
          </form>
          <form action={createGuidedAiJob} className="mt-5 space-y-3 rounded-2xl border border-line bg-surface-strong/40 p-5 shadow-sm backdrop-blur-md">
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
 
        <section className="rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
          <h2 className="text-lg font-bold tracking-tight">Itens</h2>
          <div className="mt-4 divide-y divide-line">
            {items.length ? items.map((item) => (
              <article key={item.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{item.title}</h3>
                    <p className="text-[10px] font-mono font-bold text-muted uppercase mt-0.5">{item.type} - {item.status}</p>
                    <p className="mt-2 text-xs text-muted leading-relaxed font-medium">{item.body || "Sem conteúdo."}</p>
                  </div>
                </div>
              </article>
            )) : <p className="py-8 text-sm text-muted">Nenhum item visível para esta sessão.</p>}
          </div>
        </section>
      </main>
    </AppShell>
  );
}