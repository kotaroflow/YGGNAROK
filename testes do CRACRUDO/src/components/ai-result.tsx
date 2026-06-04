import Link from "next/link";

type ResultShape = {
  summary?: unknown;
  items?: unknown;
  next_actions?: unknown;
  risk?: unknown;
  metadata?: unknown;
};

export function AiResult({ result }: { result: unknown }) {
  const value = normalizeResult(result);

  if (!value) {
    return <p className="text-sm text-stone-500">Nenhum resultado salvo ainda.</p>;
  }

  return (
    <div className="space-y-4">
      <section>
        <p className="text-xs font-semibold uppercase text-stone-500">Resumo</p>
        <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-200">{String(value.summary || "Sem resumo.")}</p>
      </section>
      <section className="grid gap-3 md:grid-cols-2">
        <ResultList title="Itens" value={value.items} />
        <ResultList title="Proximas acoes" value={value.next_actions} />
      </section>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500 shadow-sm dark:bg-neutral-900/70 dark:text-stone-300">Risco: {String(value.risk || "nao informado")}</span>
        <OrchestrationBadge metadata={value.metadata} />
        <Link className="rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href="/biblioteca">
          Salvar manualmente na biblioteca
        </Link>
        <Link className="rounded-full border border-white/80 bg-white/55 px-4 py-2 text-sm text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-950/50 dark:text-stone-300 dark:hover:bg-neutral-900" href="/criar-conteudo">
          Usar em conteudo
        </Link>
      </div>
    </div>
  );
}

function OrchestrationBadge({ metadata }: { metadata: unknown }) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata) || !("ai_orchestration" in metadata)) {
    return null;
  }

  const orchestration = (metadata as { ai_orchestration?: unknown }).ai_orchestration;

  if (!orchestration || typeof orchestration !== "object" || Array.isArray(orchestration)) {
    return null;
  }

  const details = orchestration as { mode?: unknown; domain?: unknown; executor_roles?: unknown; critic_roles?: unknown; decision_authority?: unknown; status?: unknown };
  const executors = Array.isArray(details.executor_roles) ? details.executor_roles.length : 0;
  const critics = Array.isArray(details.critic_roles) ? details.critic_roles.length : 0;

  return (
    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
      Council: {String(details.mode || "auto")} / {String(details.domain || "geral")} / {executors} exec. / {critics} crit. / {String(details.decision_authority || details.status || "ok")}
    </span>
  );
}

function ResultList({ title, value }: { title: string; value: unknown }) {
  const rows = Array.isArray(value) ? value : [];

  return (
    <div className="rounded-lg border border-white/70 bg-white/45 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35">
      <p className="text-sm font-medium">{title}</p>
      {rows.length ? (
        <ul className="mt-3 space-y-2">
          {rows.slice(0, 6).map((item, index) => (
            <li key={index} className="text-sm leading-6 text-slate-600 dark:text-stone-300">
              {typeof item === "string" ? item : JSON.stringify(item)}
            </li>
          ))}
        </ul>
      ) : <p className="mt-3 text-sm text-stone-500">Sem itens.</p>}
    </div>
  );
}

function normalizeResult(result: unknown): ResultShape | null {
  if (!result || typeof result !== "object") return null;
  return result as ResultShape;
}
