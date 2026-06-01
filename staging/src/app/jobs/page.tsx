import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import { JobsRealtime } from "@/components/jobs-realtime";
import { createAiJob } from "@/server/actions/jobs";
import { getJobs, getProfiles } from "@/server/data/dashboard";

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  const [profiles, jobs] = await Promise.all([getProfiles(), getJobs()]);

  return (
    <AppShell>
      <JobsRealtime />
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[380px_1fr] lg:px-8">
        <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">作戦本部 — Sakusen Honbu</p>
          <h1 className="mt-1 text-2xl font-semibold">Jobs</h1>
          <form action={createAiJob} className="mt-5 space-y-4">
            <Field label="Perfil">
              <select className={inputClass} name="profileId">
                <option value="">Sem perfil</option>
                {profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}</option>)}
              </select>
            </Field>
            <Field label="Tipo"><input className={inputClass} name="type" defaultValue="content.prepare" required /></Field>
            <Field label="Payload JSON"><textarea className={textareaClass} name="payload" defaultValue={'{"source":"manual","agent_key":"hefesto","brief":"Gerar conteúdo para validação."}'} /></Field>
            <button className={buttonClass}>Criar job</button>
          </form>
        </section>

        <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Fila em tempo real</h2>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">Realtime ativo</span>
          </div>
          <div className="mt-4 divide-y divide-slate-200/70 dark:divide-neutral-800">
            {jobs.length ? jobs.map((job) => (
              <article key={job.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link className="font-medium hover:text-amber-700 dark:hover:text-amber-300" href={`/jobs/${job.id}`}>{job.type}</Link>
                    <p className="text-sm text-slate-400 dark:text-stone-500">{job.id}</p>
                    {job.error_message ? <p className="mt-2 text-sm text-red-700 dark:text-red-300">{job.error_message}</p> : null}
                    {job.result ? <p className="mt-2 text-sm text-muted">Resultado pronto para abrir.</p> : null}
                  </div>
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">
                    {job.status} · {job.attempts}/{job.max_attempts}
                  </span>
                </div>
              </article>
            )) : <p className="py-8 text-sm text-stone-500">Nenhum job visível para esta sessão.</p>}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
