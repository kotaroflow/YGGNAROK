"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, FileDown, RefreshCw, ShieldCheck } from "lucide-react";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";

type ContinuityState = {
  objective: string;
  currentState: string;
  blockers: string;
  decisions: string;
  nextSteps: string;
  files: string;
  constraints: string;
};

const initialState: ContinuityState = {
  objective: "Continuar a construcao do YGGNAROK como ferramenta web cloud-only, com IA free, agentes moldaveis e fluxo de criacao funcional.",
  currentState: [
    "Ollama e motores locais foram removidos do caminho principal.",
    "OpenRouter/free virou base cloud de menor custo.",
    "IA paga fica desligada por padrao.",
    "Existe /agentes-ia com editor visual em nodes.",
    "Existe /criar-conteudo com campos para moldar agente e gerar com IA.",
  ].join("\n"),
  blockers: "Supabase do .env.local precisa estar configurado para login, banco, jobs e telas internas funcionarem.",
  decisions: [
    "Nao usar maquina local como motor do site.",
    "Nao usar IA paga sem decisao explicita.",
    "Priorizar cloud/free e arquitetura substituivel.",
    "Entregar ferramenta usavel antes de expandir recursos grandes.",
  ].join("\n"),
  nextSteps: [
    "Corrigir Supabase/env e validar login.",
    "Persistir fluxos de /agentes-ia no banco.",
    "Conectar nodes aos jobs reais.",
    "Criar projetos e associar agentes/conteudos a cada projeto.",
  ].join("\n"),
  files: [
    "src/app/agentes-ia/page.tsx",
    "src/components/agent-node-studio.tsx",
    "src/app/criar-conteudo/page.tsx",
    "src/server/actions/jobs.ts",
    "src/server/ai-council/free-runtime.ts",
    "worker/agents/provider.ts",
    "worker/src/config.ts",
  ].join("\n"),
  constraints: [
    "Manter tudo cloud-only.",
    "Cortar custos ao maximo.",
    "Usar modelos free/open quando possivel.",
    "Nao depender de terminal como experiencia principal do usuario.",
    "Toda resposta deve priorizar implementacao e validacao real.",
  ].join("\n"),
};

export function ContinuityMode() {
  const [state, setState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const packet = useMemo(() => buildPacket(state), [state]);

  function update(key: keyof ContinuityState, value: string) {
    setState((current) => ({ ...current, [key]: value }));
    setCopied(false);
  }

  async function copyPacket() {
    await navigator.clipboard.writeText(packet);
    setCopied(true);
  }

  function downloadPacket() {
    const blob = new Blob([packet], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `yggnarok-continuity-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="rounded-lg border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Modo Continuidade</p>
            <h1 className="mt-1 text-2xl font-semibold">Pacote para continuar sem perder contexto</h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            <ShieldCheck size={16} /> Cloud/free first
          </span>
        </div>

        <div className="mt-6 grid gap-4">
          <Field label="Objetivo atual">
            <textarea className={textareaClass} value={state.objective} onChange={(event) => update("objective", event.target.value)} />
          </Field>
          <Field label="Estado atual">
            <textarea className={textareaClass} value={state.currentState} onChange={(event) => update("currentState", event.target.value)} />
          </Field>
          <Field label="Bloqueadores">
            <textarea className={textareaClass} value={state.blockers} onChange={(event) => update("blockers", event.target.value)} />
          </Field>
          <div className="grid gap-4 xl:grid-cols-2">
            <Field label="Decisoes fixas">
              <textarea className={textareaClass} value={state.decisions} onChange={(event) => update("decisions", event.target.value)} />
            </Field>
            <Field label="Proximos passos">
              <textarea className={textareaClass} value={state.nextSteps} onChange={(event) => update("nextSteps", event.target.value)} />
            </Field>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <Field label="Arquivos importantes">
              <textarea className={textareaClass} value={state.files} onChange={(event) => update("files", event.target.value)} />
            </Field>
            <Field label="Restricoes">
              <textarea className={textareaClass} value={state.constraints} onChange={(event) => update("constraints", event.target.value)} />
            </Field>
          </div>
        </div>
      </section>

      <aside className="rounded-lg border border-white/70 bg-white/70 p-5 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Prompt de retomada</p>
            <p className="text-xs text-stone-500">Cole em qualquer IA cloud/free para continuar.</p>
          </div>
          <button type="button" className="grid size-10 place-items-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-stone-200" onClick={() => setState(initialState)} aria-label="Restaurar pacote base">
            <RefreshCw size={17} />
          </button>
        </div>

        <textarea className={`${textareaClass} mt-4 min-h-[520px] font-mono text-xs`} value={packet} readOnly />

        <div className="mt-4 grid gap-3">
          <button type="button" className={buttonClass} onClick={copyPacket}>
            {copied ? <Check size={16} className="mr-2" /> : <Clipboard size={16} className="mr-2" />}
            {copied ? "Copiado" : "Copiar pacote"}
          </button>
          <button type="button" className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-stone-200" onClick={downloadPacket}>
            <FileDown size={16} className="mr-2" /> Baixar .md
          </button>
        </div>

        <Field label="Modelo alvo">
          <input className={inputClass} value="OpenRouter/free, Qwen/DeepSeek/Kimi free ou outro modelo cloud gratuito" readOnly />
        </Field>
      </aside>
    </div>
  );
}

function buildPacket(state: ContinuityState) {
  return [
    "# YGGNAROK CONTINUITY PACK",
    "",
    "Voce vai continuar o desenvolvimento do YGGNAROK sem perder contexto. Priorize implementacao real, validacao e custo minimo.",
    "",
    "## Objetivo",
    state.objective,
    "",
    "## Estado atual",
    state.currentState,
    "",
    "## Bloqueadores",
    state.blockers,
    "",
    "## Decisoes fixas",
    state.decisions,
    "",
    "## Proximos passos",
    state.nextSteps,
    "",
    "## Arquivos importantes",
    state.files,
    "",
    "## Restricoes",
    state.constraints,
    "",
    "## Como agir",
    "- Leia o codigo antes de editar.",
    "- Mantenha cloud-only e free-first.",
    "- Nao introduza IA paga sem confirmacao explicita.",
    "- Ao terminar, rode typecheck, lint e build.",
    "- Explique o que mudou e o que ainda bloqueia uso real.",
  ].join("\n");
}
