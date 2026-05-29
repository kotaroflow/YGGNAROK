"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Field, buttonClass, textareaClass } from "@/components/field";

const STORAGE_KEY = "yggnarok.chat.history.v1";

type UiMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const SYSTEM_MESSAGE: UiMessage = {
  id: "system-default",
  role: "system",
  content: "Voce e um assistente do YGGNAROK. Responda em PT-BR, direto e pratico.",
};

const AGENT_DEFINITIONS = {
  "yggnarok-core": {
    name: "YGGNAROK Core",
    summary: "Decisoes gerais do sistema.",
    prompt:
      "Voce e o YGGNAROK Core. Responda como um assistente geral do sistema YGGNAROK, com decisao, prioridade e clareza. Mantenha respostas objetivas, prontas para uso e alinhadas ao contexto do projeto.",
    tone: "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
  },
  hefesto: {
    name: "Hefesto",
    summary: "Ensino, explicacao e aprendizado passo a passo.",
    prompt:
      "Voce e Hefesto, especialista em ensino, explicacao e aprendizado passo a passo. Quebre tarefas em passos claros, explique o por que de cada etapa e adapte a linguagem para facilitar o aprendizado.",
    tone: "bg-cyan-500/15 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-200",
  },
  daedalus: {
    name: "Daedalus",
    summary: "Arquitetura, codigo e refatoracao.",
    prompt:
      "Voce e Daedalus, especialista em arquitetura de software, codigo e refatoracao. Foque em estrutura, qualidade, legibilidade, consistencia e melhoria incremental. Sugira solucoes tecnicas claras e seguras.",
    tone: "bg-violet-500/15 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
  },
  yomi: {
    name: "Yomi",
    summary: "Conteudo, personagens, midia e uso responsavel.",
    prompt:
      "Voce e Yomi, orientando sobre conteudo, personagens, midia e uso responsavel. Priorize responsabilidade, clareza, respeito ao contexto e boas praticas ao criar ou avaliar conteudos e representacoes.",
    tone: "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
  },
  hotei: {
    name: "Hotei",
    summary: "Audio, musica, voz e criacao sonora.",
    prompt:
      "Voce e Hotei, especialista em audio, musica, voz e criacao sonora. Sugira ideias sonoras, atmosferas, direcoes de voz e abordagens criativas para producao de audio e media.",
    tone: "bg-rose-500/15 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
  },
} as const;

type AgentId = keyof typeof AGENT_DEFINITIONS;

function loadHistory(): UiMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [SYSTEM_MESSAGE];
    const parsed = JSON.parse(raw) as UiMessage[];
    if (parsed.length === 0 || parsed[0].role !== "system") {
      return [SYSTEM_MESSAGE, ...parsed];
    }
    return parsed;
  } catch {
    return [SYSTEM_MESSAGE];
  }
}

export function ChatClient() {
  const [messages, setMessages] = useState<UiMessage[]>(() => loadHistory());
  const [input, setInput] = useState(
    "Explique como melhorar o meu fluxo de criacao de conteudo para Instagram em 3 passos."
  );
  const [activeAgent, setActiveAgent] = useState<AgentId>("yggnarok-core");
  const [status, setStatus] = useState<"idle" | "streaming" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const activeAgentDefinition = AGENT_DEFINITIONS[activeAgent];

  const apiMessages = useMemo(
    () => messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content })),
    [messages]
  );

  async function send() {
    const content = input.trim();
    if (!content) return;

    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    setError(null);
    setStatus("streaming");

    const userMessage: UiMessage = { id: uid(), role: "user", content };
    const assistantId = uid();

    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: activeAgentDefinition.prompt },
            ...apiMessages,
            { role: "user", content },
          ],
        }),
        signal: abort.signal,
      });

      if (!response.ok || !response.body) {
        const detail = await response.text().catch(() => "");
        throw new Error(detail || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        setMessages((current) =>
          current.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        );
      }

      setStatus("idle");
    } catch (err) {
      if (abort.signal.aborted) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Falha desconhecida.");
    }
  }

  function stop() {
    abortRef.current?.abort();
    setStatus("idle");
  }

  function clearChat() {
    abortRef.current?.abort();
    setStatus("idle");
    setError(null);
    setInput("");
    setMessages([SYSTEM_MESSAGE]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
        <h1 className="text-2xl font-semibold">Chat (streaming)</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-stone-300">
          Consume <code className="font-mono text-xs">/api/chat</code> e
          renderiza o texto conforme chega.
        </p>

        <div className="mt-5 rounded-xl border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/50">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">Agente ativo</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-stone-300">
                {activeAgentDefinition.summary}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${activeAgentDefinition.tone}`}>
              {activeAgentDefinition.name}
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {(Object.entries(AGENT_DEFINITIONS) as [AgentId, (typeof AGENT_DEFINITIONS)[AgentId]][]).map(([agentId, agent]) => (
              <button
                key={agentId}
                type="button"
                onClick={() => setActiveAgent(agentId)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                  activeAgent === agentId
                    ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
                    : "border-slate-200 bg-white/70 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900/60 dark:text-stone-200 dark:hover:bg-neutral-800"
                }`}
              >
                <span className="block font-semibold">{agent.name}</span>
                <span className="mt-1 block text-[10px] uppercase tracking-wide text-slate-500 dark:text-stone-400">
                  {agent.summary}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {messages
            .filter((m) => m.role !== "system")
            .map((m) => (
              <article
                key={m.id}
                className={[
                  "rounded-lg border p-4 shadow-sm",
                  m.role === "user"
                    ? "border-amber-200/70 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/20"
                    : "border-white/70 bg-white/45 dark:border-white/10 dark:bg-neutral-950/35",
                ].join(" ")}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  {m.role}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-stone-800 dark:text-stone-200">
                  {m.content}
                </p>
              </article>
            ))}
        </div>

        {error ? (
          <p className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </p>
        ) : null}
      </section>

      <aside className="rounded-lg border border-white/70 bg-white/70 p-5 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
        <Field label="Mensagem">
          <textarea
            className={textareaClass}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Digite e envie..."
          />
        </Field>

        <div className="mt-4 grid gap-3">
          <button
            type="button"
            className={buttonClass}
            onClick={send}
            disabled={status === "streaming"}
          >
            {status === "streaming" ? "Gerando..." : "Enviar"}
          </button>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:bg-neutral-900 dark:text-stone-200 dark:hover:bg-neutral-800"
            onClick={stop}
            disabled={status !== "streaming"}
          >
            Parar
          </button>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-md border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 disabled:opacity-60 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300 dark:hover:bg-red-950/40"
            onClick={clearChat}
            disabled={status === "streaming"}
          >
            Limpar chat
          </button>
        </div>

        <div className="mt-5 rounded-lg border border-white/70 bg-white/45 p-4 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/35 dark:text-stone-300">
          <p className="font-semibold">Env vars</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><code className="font-mono text-xs">OPENROUTER_API_KEY</code> (obrigatoria)</li>
            <li><code className="font-mono text-xs">AI_MODEL</code> (ex: meta-llama/llama-3.1-8b-instruct)</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
