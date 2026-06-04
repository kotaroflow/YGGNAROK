import Link from "next/link";
import { Suspense } from "react";
import { AlertTriangle, Brain, CirclePause, CirclePlay, Power, ShieldCheck, Workflow } from "lucide-react";
import { AdminListPage, JsonPreview } from "@/components/admin-list";
import { getMomongaCouncilOverview } from "@/server/data/dashboard";
import type { Job, HealthLog } from "@/types/dashboard";
import {
  activateSafeMode,
  approveDecision,
  approveMemory,
  clearQueue,
  disableChaos,
  killSwitch,
  pauseAgent,
  reactivateAgent,
  rejectDecision,
  rejectMemory,
  releaseKillSwitch,
} from "@/server/actions/momonga";

async function MomongaContent() {
  const overview = await getMomongaCouncilOverview();
  const killSwitchActive = overview.automations.some((automation) => automation.key === "kill_switch" && automation.status === "active");

  return (
    <AdminListPage eyebrow="Momonga Control Mode" title="YGGNAROK AI Council" empty={false}>
      <section className="grid gap-4 md:grid-cols-5">
        <Metric label="Pendentes" value={overview.counts.pendingJobs} />
        <Metric label="Processando" value={overview.counts.processingJobs} />
        <Metric label="Decisoes pendentes" value={overview.counts.pendingDecisions} />
        <Metric label="Memorias pendentes" value={overview.counts.pendingMemories} />
        <Metric label="Alertas" value={overview.counts.alerts} />
      </section>

      <section className="mt-6 flex flex-wrap gap-3">
        <ControlForm action={clearQueue} icon={<AlertTriangle size={16} />} label="Limpar fila" />
        <ControlForm action={disableChaos} icon={<CirclePause size={16} />} label="Desligar chaos" />
        <ControlForm action={activateSafeMode} icon={<ShieldCheck size={16} />} label="Ativar modo seguro" />
        {killSwitchActive
          ? <ControlForm action={releaseKillSwitch} icon={<CirclePlay size={16} />} label="Liberar kill switch" />
          : <ControlForm action={killSwitch} icon={<Power size={16} />} label="Kill Switch" danger />}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Agentes do conselho">
          <div className="grid gap-2 sm:grid-cols-2">
            {overview.agents.length ? overview.agents.map((agent) => (
              <div key={String(agent.key)} className="rounded-lg border border-line bg-surface-strong p-3 shadow-sm backdrop-blur ">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{String(agent.name)}</p>
                    <p className="mt-1 text-xs text-muted">{String(agent.role)} / {String(agent.risk_level)}</p>
                  </div>
                  <span className="rounded-full bg-surface-strong px-3 py-1 text-xs text-slate-500 shadow-sm text-muted">{String(agent.status)}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <SmallAction action={pauseAgent} hiddenName="key" hiddenValue={String(agent.key)} icon={<CirclePause size={14} />} label="Pausar" />
                  <SmallAction action={reactivateAgent} hiddenName="key" hiddenValue={String(agent.key)} icon={<CirclePlay size={14} />} label="Ativar" />
                </div>
              </div>
            )) : <FallbackAgents />}
          </div>
        </Panel>

        <Panel title="Provedores e modelos">
          <div className="space-y-3">
            {overview.providerStatus.length ? overview.providerStatus.map((provider) => (
              <div key={String(provider.provider)} className="rounded-lg border border-line bg-surface-strong p-3 shadow-sm backdrop-blur ">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{String(provider.provider)}</span>
                  <span className="rounded-full bg-surface-strong px-3 py-1 text-xs text-slate-500 shadow-sm text-muted">{String(provider.status)}</span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {provider.latency_ms ? `${provider.latency_ms}ms` : "latencia nao medida"}
                  {provider.error_message ? ` / ${String(provider.error_message)}` : ""}
                </p>
              </div>
            )) : <p className="text-sm text-muted">Status sera preenchido pelo worker.</p>}
            <JsonPreview value={{
              ai_provider: process.env.AI_PROVIDER ?? "hybrid",
              max_models: process.env.MAX_MODELS_PER_TASK ?? "5",
              max_rounds: process.env.MAX_DEBATE_ROUNDS ?? "3",
              paid_ai: process.env.ENABLE_OPENAI_GPT ?? "false",
            }} />
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Decisoes recentes">
          <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
            {overview.decisions.length ? overview.decisions.slice(0, 10).map((decision) => (
              <article key={String(decision.id)} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{String(decision.decision_type)}</p>
                    {decision.job_id ? <Link className="mt-1 block text-xs text-amber-700 dark:text-amber-300" href={`/jobs/${String(decision.job_id)}`}>Abrir job</Link> : null}
                  </div>
                  <span className="rounded-full bg-surface-strong px-3 py-1 text-xs text-slate-500 shadow-sm text-muted">{String(decision.status)} / {String(decision.risk)}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{String(decision.summary || "Sem resumo.")}</p>
                <p className="mt-1 text-xs text-muted">Autoridade: {String(decision.authority)}</p>
                {decision.status === "pending" ? (
                  <div className="mt-3 flex gap-2">
                    <SmallAction action={approveDecision} hiddenName="id" hiddenValue={String(decision.id)} icon={<ShieldCheck size={14} />} label="Aprovar" />
                    <SmallAction action={rejectDecision} hiddenName="id" hiddenValue={String(decision.id)} icon={<AlertTriangle size={14} />} label="Rejeitar" />
                  </div>
                ) : null}
              </article>
            )) : <LegacyDecisionList jobs={overview.jobs} />}
          </div>
        </Panel>

        <Panel title="Memorias e aprendizado">
          <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
            {overview.memories.length ? overview.memories.slice(0, 10).map((memory) => (
              <article key={String(memory.id)} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{String(memory.title)}</p>
                  <span className="rounded-full bg-surface-strong px-3 py-1 text-xs text-slate-500 shadow-sm text-muted">{String(memory.status)}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{String(memory.body)}</p>
                {memory.status === "pending" ? (
                  <div className="mt-3 flex gap-2">
                    <SmallAction action={approveMemory} hiddenName="id" hiddenValue={String(memory.id)} icon={<Brain size={14} />} label="Aprovar" />
                    <SmallAction action={rejectMemory} hiddenName="id" hiddenValue={String(memory.id)} icon={<AlertTriangle size={14} />} label="Rejeitar" />
                  </div>
                ) : null}
              </article>
            )) : <p className="text-sm text-muted">Nenhuma memoria de IA registrada.</p>}
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Custos estimados">
          <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
            {overview.costs.length ? overview.costs.slice(0, 8).map((cost) => (
              <article key={String(cost.id)} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{String(cost.provider)}</p>
                  <p className="text-xs text-muted">{String(cost.model)}</p>
                </div>
                <span className="rounded-full bg-surface-strong px-3 py-1 text-xs text-slate-500 shadow-sm text-muted">{String(cost.currency)} {Number(cost.estimated_cost)}</span>
              </article>
            )) : <p className="text-sm text-muted">Ledger sera preenchido apos jobs do Council.</p>}
          </div>
        </Panel>

        <Panel title="Alertas e conflitos">
          <div className="divide-y divide-slate-200/70 dark:divide-neutral-800">
            {overview.health.slice(0, 6).map((entry) => (
              <article key={entry.id} className="py-3">
                <div className="flex items-center gap-2">
                  <Workflow size={16} />
                  <p className="font-medium">{entry.status} - {entry.source}</p>
                </div>
                <p className="mt-1 text-sm text-muted">{entry.message}</p>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </AdminListPage>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-surface-strong p-4 shadow-sm backdrop-blur ">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-surface-strong p-4 shadow-sm backdrop-blur ">
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ControlForm({ action, icon, label, danger = false }: { action: () => Promise<void>; icon: React.ReactNode; label: string; danger?: boolean }) {
  return (
    <form action={action}>
      <button className={buttonClass(danger)} type="submit">{icon}{label}</button>
    </form>
  );
}

function SmallAction({
  action,
  hiddenName,
  hiddenValue,
  icon,
  label,
}: {
  action: (formData: FormData) => Promise<void>;
  hiddenName: string;
  hiddenValue: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name={hiddenName} value={hiddenValue} />
      <button className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/55 px-3 py-1 text-xs text-muted shadow-sm transition hover:bg-white  dark:text-stone-300 dark:hover:bg-neutral-900" type="submit">
        {icon}
        {label}
      </button>
    </form>
  );
}

function buttonClass(danger: boolean) {
  const color = danger
    ? "border-red-300 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30"
    : "border-white/80 bg-white/55 text-muted shadow-sm transition hover:bg-white  dark:text-stone-300 dark:hover:bg-neutral-900";
  return `inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${color}`;
}

function FallbackAgents() {
  return (
    <>
      {["Creator", "Critic", "Strategy", "Consistency", "Safety/Governance", "Memory", "Supervisor", "Momonga"].map((agent) => (
        <div key={agent} className="rounded-lg border border-line bg-surface-strong p-3 shadow-sm backdrop-blur ">
          <p className="text-sm font-medium">{agent}</p>
          <p className="mt-1 text-xs text-muted">aguardando migracao</p>
        </div>
      ))}
    </>
  );
}

function LegacyDecisionList({ jobs }: { jobs: Job[] }) {
  return jobs.slice(0, 8).map((job) => {
    const orchestration = readOrchestration(job.result);
    return (
      <article key={job.id} className="py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link className="font-medium hover:text-amber-700 dark:hover:text-amber-300" href={`/jobs/${job.id}`}>{job.type}</Link>
            <p className="mt-1 text-xs text-muted">{String(orchestration.mode ?? "auto")} / {String(orchestration.domain ?? "geral")}</p>
          </div>
          <span className="rounded-full bg-surface-strong px-3 py-1 text-xs text-slate-500 shadow-sm text-muted">{job.status}</span>
        </div>
        <p className="mt-2 text-sm text-muted">
          Autoridade: {String(orchestration.decision_authority ?? "nao registrada")}
        </p>
      </article>
    );
  });
}

function readOrchestration(result: unknown) {
  const output = result && typeof result === "object" && !Array.isArray(result) ? result as Record<string, unknown> : {};
  const metadata = output.metadata && typeof output.metadata === "object" && !Array.isArray(output.metadata) ? output.metadata as Record<string, unknown> : {};
  return metadata.ai_orchestration && typeof metadata.ai_orchestration === "object" && !Array.isArray(metadata.ai_orchestration)
    ?     metadata.ai_orchestration as Record<string, unknown>
    : {};
}

export default async function MomongaPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando painel Momonga...</div>}>
      <MomongaContent />
    </Suspense>
  );
}
