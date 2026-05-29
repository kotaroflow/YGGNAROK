import Link from "next/link";
import { Brain, ImageIcon, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import { getFreeCouncilJobs } from "@/server/ai-council/free-runtime";

export default async function ConselhoIaPage({ searchParams }: { searchParams: Promise<{ job?: string }> }) {
  const [{ job: selectedId }, jobs] = await Promise.all([searchParams, getFreeCouncilJobs()]);
  const selected = jobs.find((job) => job.id === selectedId) ?? jobs[0] ?? null;

  return (
    <AppShell>
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[400px_1fr] lg:px-8">
        <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">YGGNAROK AI Council</p>
          <h1 className="mt-1 text-2xl font-semibold">Conselho de IAs</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Gera, debate, critica, sintetiza, classifica risco e registra aprendizado usando IAs free integradas via OpenRouter.
          </p>

          <form action="/api/ai-council/run" method="post" className="mt-5 space-y-4">
            <Field label="Tipo da tarefa">
              <select className={inputClass} name="taskType" defaultValue="content.prepare">
                <option value="content.prepare">Texto / conteudo</option>
                <option value="strategy.plan">Estrategia</option>
                <option value="system.decision">Decisao do sistema</option>
                <option value="image.generate">Imagem / cloud</option>
                <option value="video.plan">Audiovisual</option>
                <option value="review.critic">Revisao critica</option>
              </select>
            </Field>
            <Field label="Modo">
              <select className={inputClass} name="mode" defaultValue="fast">
                <option value="fast">FAST</option>
                <option value="deep">DEEP</option>
                <option value="chaos">CHAOS</option>
                <option value="council_decision">COUNCIL DECISION</option>
              </select>
            </Field>
            <Field label="Pedido">
              <textarea className={textareaClass} name="prompt" defaultValue="Crie uma legenda curta, uma versao mais agressiva e uma critica de risco para um post do YGGNAROK." />
            </Field>
            <button className={buttonClass}>Rodar Conselho agora</button>
          </form>

          <div className="mt-6 rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
            <p className="text-sm font-medium">Runtime free integrado</p>
            <div className="mt-3 grid gap-2 text-sm text-muted">
              <StatusLine label="OpenRouter" value={process.env.OPENROUTER_API_KEY ? "free ativo" : "sem chave"} />
              <StatusLine label="Modelo rapido" value={process.env.AI_MODEL_FAST || "openrouter:openrouter/free"} />
              <StatusLine label="Pago" value={process.env.ENABLE_OPENAI_GPT === "true" ? "habilitado" : "desligado"} />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          {selected ? <SelectedJob job={selected} /> : <EmptyState />}

          <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
            <h2 className="text-lg font-semibold">Historico do conselho</h2>
            <div className="mt-4 divide-y divide-slate-200/70 dark:divide-neutral-800">
              {jobs.length ? jobs.map((job) => (
                <Link key={job.id} href={`/conselho-ia?job=${job.id}`} className="block py-3 hover:text-amber-700 dark:hover:text-amber-300">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{job.taskType}</p>
                      <p className="mt-1 text-xs text-stone-500">{job.mode} / {job.createdAt}</p>
                    </div>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">{job.risk}</span>
                  </div>
                </Link>
              )) : <p className="py-4 text-sm text-stone-500">Nenhuma execucao ainda.</p>}
            </div>
          </section>
        </section>
      </main>
    </AppShell>
  );
}

function SelectedJob({ job }: { job: Awaited<ReturnType<typeof getFreeCouncilJobs>>[number] }) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">{job.mode}</p>
          <h2 className="mt-1 text-xl font-semibold">{job.taskType}</h2>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-2 text-sm text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">Risco: {job.risk}</span>
      </div>

      {job.errorMessage ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">{job.errorMessage}</p> : null}

      <article className="mt-5 rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
        <div className="flex items-center gap-2">
          <Brain size={18} />
          <h3 className="font-semibold">Sintese do Supervisor</h3>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-700 dark:text-stone-200">{job.final}</p>
      </article>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <ResultGroup icon={<Sparkles size={16} />} title="Geracoes" rows={job.candidates} />
        <ResultGroup icon={<ShieldCheck size={16} />} title="Criticas" rows={job.critiques} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
          <div className="flex items-center gap-2">
            <Workflow size={16} />
            <h3 className="font-semibold">Aprendizado</h3>
          </div>
          {job.memory.map((memory, index) => (
            <p key={index} className="mt-3 text-sm leading-6 text-muted">
              {memory.status} / {memory.risk} / {memory.confidence}: {memory.content}
            </p>
          ))}
        </section>

        <section className="rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} />
            <h3 className="font-semibold">Audiovisual</h3>
          </div>
          {job.media ? (
            <div className="mt-3 space-y-2 text-sm leading-6 text-muted">
              <p>{job.media.provider} / {job.media.type} / {job.media.status}</p>
              <p>{job.media.message}</p>
              <p className="line-clamp-3">{job.media.prompt}</p>
            </div>
          ) : <p className="mt-3 text-sm text-stone-500">Tarefa sem pedido audiovisual.</p>}
        </section>
      </div>
    </section>
  );
}

function ResultGroup({ icon, title, rows }: { icon: React.ReactNode; title: string; rows: Array<{ agent: string; provider: string; model: string; summary: string; risk: string; items: string[] }> }) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <article key={`${row.agent}-${row.model}`} className="rounded-md bg-stone-50 p-3 dark:bg-neutral-950">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium">{row.agent}</p>
              <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">{row.provider} / {row.risk}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{row.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className="truncate rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">{value}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <section className="rounded-lg border border-white/70 bg-white/70 p-8 text-center shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
      <p className="text-lg font-semibold">Conselho pronto.</p>
      <p className="mt-2 text-sm text-stone-500">Envie uma tarefa para gerar, debater, sintetizar e registrar aprendizado.</p>
    </section>
  );
}
