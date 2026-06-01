import Link from "next/link";
import { notFound } from "next/navigation";
import { AiResult } from "@/components/ai-result";
import { AppShell } from "@/components/app-shell";
import { JsonPreview } from "@/components/admin-list";
import { JobsRealtime } from "@/components/jobs-realtime";
import { getAgentRunsByJobId, getJobById } from "@/server/data/dashboard";

export default async function JobDetailPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { id } = await params;
  await searchParams;
  const [job, runs] = await Promise.all([getJobById(id), getAgentRunsByJobId(id)]);

  if (!job) {
    notFound();
  }

  return (
    <AppShell>
      <JobsRealtime />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">作戦本部 — Sakusen Honbu</p>
            <h1 className="mt-1 text-2xl font-semibold">{job.type}</h1>
            <p className="mt-1 text-sm text-stone-500">{job.id}</p>
          </div>
          <span className="rounded-full bg-white/70 px-3 py-2 text-sm text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">
            {job.status} · {job.attempts}/{job.max_attempts}
          </span>
        </div>

        {job.error_message ? <p className="mt-5 rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">{job.error_message}</p> : null}

        <section className="mt-6 rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          <h2 className="text-lg font-semibold">Resultado</h2>
          <div className="mt-4"><AiResult result={job.result} /></div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
            <h2 className="text-lg font-semibold">Payload</h2>
            <JsonPreview value={job.payload} />
          </div>
          <div className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
            <h2 className="text-lg font-semibold">Execuções</h2>
            <div className="mt-4 divide-y divide-slate-200/70 dark:divide-neutral-800">
              {runs.length ? runs.map((run) => (
                <article key={run.id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{run.agent_key} · {run.module}</p>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">{run.status}</span>
                  </div>
                  {run.error_message ? <p className="mt-2 text-sm text-red-700 dark:text-red-300">{run.error_message}</p> : null}
                </article>
              )) : <p className="text-sm text-stone-500">Nenhuma execução registrada.</p>}
            </div>
          </div>
        </section>

        <Link className="mt-6 inline-block rounded-full border border-white/80 bg-white/55 px-5 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href="/jobs">
          Voltar para jobs
        </Link>
      </main>
    </AppShell>
  );
}
