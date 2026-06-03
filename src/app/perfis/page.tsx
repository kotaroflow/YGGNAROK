import { AppShell } from "@/components/app-shell";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import { PageFrame, PagePanel } from "@/components/page-frame";
import { operationalTags } from "@/lib/tags";
import { createProfile } from "@/server/actions/profiles";
import { getProfiles } from "@/server/data/dashboard";
import type { Profile } from "@/types/dashboard";

export default async function PerfisPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  const profiles = (await getProfiles()) as Profile[];

  return (
    <AppShell>
      <main className="min-h-screen">
        <PageFrame
          title="Perfis"
          description="Crie e organize os perfis operacionais do sistema."
        >
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <PagePanel>
              <p className="text-xs font-bold uppercase tracking-wide text-brand">入口 · Entrada</p>
              <h2 className="mt-2 text-lg font-bold text-foreground">Novo perfil</h2>
              <form action={createProfile} className="mt-6 space-y-4">
                <Field label="Nome">
                  <input className={inputClass} name="name" required />
                </Field>
                <Field label="Slug">
                  <input
                    className={inputClass}
                    name="slug"
                    required
                    pattern="[a-z0-9-]+"
                    placeholder="meu-perfil"
                  />
                </Field>
                <Field label="Descrição">
                  <textarea className={textareaClass} name="description" />
                </Field>
                <div>
                  <p className="mb-2 text-sm font-semibold text-foreground">Tags iniciais</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {Object.entries(operationalTags)
                      .slice(0, 4)
                      .flatMap(([group, tags]) =>
                        tags.slice(0, 3).map((tag) => (
                          <label
                            key={`${group}:${tag}`}
                            className="flex items-center gap-2 rounded-full border border-line bg-surface-strong px-3 py-1.5 text-xs text-muted"
                          >
                            <input type="checkbox" name="tags" value={`${group}:${tag}`} />
                            {group}:{tag}
                          </label>
                        )),
                      )}
                  </div>
                </div>
                <button className={buttonClass}>Criar perfil</button>
              </form>
            </PagePanel>

            <PagePanel>
              <h2 className="text-lg font-bold text-foreground">Perfis disponíveis</h2>
              <p className="mt-1 text-sm text-muted">
                {profiles.length} perfil(is) visíveis nesta sessão.
              </p>
              <div className="mt-4 divide-y divide-line">
                {profiles.length ? (
                  profiles.map((profile) => (
                    <article key={profile.id} className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-foreground">{profile.name}</h3>
                          <p className="text-sm text-muted">/{profile.slug}</p>
                          <p className="mt-2 text-sm text-muted">
                            {profile.description || "Sem descrição."}
                          </p>
                        </div>
                        <span className="rounded-full border border-line bg-surface-strong px-3 py-1 text-xs font-semibold text-muted">
                          {profile.status}
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="grid min-h-40 place-items-center rounded-lg border border-dashed border-line text-sm text-muted">
                    Nenhum perfil visível para esta sessão.
                  </p>
                )}
              </div>
            </PagePanel>
          </div>
        </PageFrame>
      </main>
    </AppShell>
  );
}
