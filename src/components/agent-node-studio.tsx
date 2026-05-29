"use client";

import { useMemo, useState } from "react";
import { Brain, CircleDot, FileText, GitBranch, Plus, Save, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";

type AgentNode = {
  id: string;
  label: string;
  role: string;
  model: string;
  instructions: string;
  outputFormat: string;
  x: number;
  y: number;
  color: string;
};

type AgentEdge = {
  from: string;
  to: string;
  label: string;
};

const initialNodes: AgentNode[] = [
  {
    id: "brief",
    label: "Brief",
    role: "Entrada",
    model: "manual",
    instructions: "Recebe objetivo, publico, tom, plataforma e restricoes.",
    outputFormat: "Contexto limpo para os agentes.",
    x: 48,
    y: 188,
    color: "bg-sky-100 text-sky-950 border-sky-200 dark:bg-sky-950/50 dark:text-sky-100 dark:border-sky-800",
  },
  {
    id: "creator",
    label: "Hefesto",
    role: "Criador",
    model: "openrouter:openrouter/free",
    instructions: "Gerar ideias, roteiro, legenda, variacoes e um primeiro caminho forte.",
    outputFormat: "summary, items, next_actions, risk, metadata",
    x: 286,
    y: 96,
    color: "bg-amber-100 text-amber-950 border-amber-200 dark:bg-amber-950/50 dark:text-amber-100 dark:border-amber-800",
  },
  {
    id: "critic",
    label: "Isis",
    role: "Critica",
    model: "openrouter:openrouter/free",
    instructions: "Encontrar fraquezas, repeticao, promessa fraca, risco e falta de clareza.",
    outputFormat: "critica, ajustes obrigatorios, nota de prontidao",
    x: 526,
    y: 96,
    color: "bg-rose-100 text-rose-950 border-rose-200 dark:bg-rose-950/50 dark:text-rose-100 dark:border-rose-800",
  },
  {
    id: "strategy",
    label: "Morax",
    role: "Estrategista",
    model: "openrouter:openrouter/free",
    instructions: "Aumentar utilidade, venda, retencao, clareza de oferta e proximo passo.",
    outputFormat: "melhorias, angulos, hooks, CTA",
    x: 526,
    y: 294,
    color: "bg-emerald-100 text-emerald-950 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-800",
  },
  {
    id: "supervisor",
    label: "Supervisor",
    role: "Sintese",
    model: "openrouter:openrouter/free",
    instructions: "Unir o melhor das propostas, cortar ruido e entregar versao pronta para uso.",
    outputFormat: "conteudo final, checklist, riscos, proximas acoes",
    x: 770,
    y: 188,
    color: "bg-violet-100 text-violet-950 border-violet-200 dark:bg-violet-950/50 dark:text-violet-100 dark:border-violet-800",
  },
];

const initialEdges: AgentEdge[] = [
  { from: "brief", to: "creator", label: "contexto" },
  { from: "creator", to: "critic", label: "rascunho" },
  { from: "creator", to: "strategy", label: "ideia" },
  { from: "critic", to: "supervisor", label: "correcao" },
  { from: "strategy", to: "supervisor", label: "direcao" },
];

export function AgentNodeStudio() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedId, setSelectedId] = useState("creator");
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  function updateSelected(patch: Partial<AgentNode>) {
    setNodes((current) => current.map((node) => node.id === selected.id ? { ...node, ...patch } : node));
  }

  function addNode() {
    const id = `agent-${Date.now()}`;
    const next: AgentNode = {
      id,
      label: "Novo agente",
      role: "Custom",
      model: "openrouter:openrouter/free",
      instructions: "Defina como este agente deve pensar e decidir.",
      outputFormat: "summary, items, next_actions, risk",
      x: 320,
      y: 402,
      color: "bg-slate-100 text-slate-950 border-slate-200 dark:bg-neutral-900 dark:text-stone-100 dark:border-white/10",
    };
    setNodes((current) => [...current, next]);
    setSelectedId(id);
  }

  function removeSelected() {
    if (["brief", "supervisor"].includes(selected.id)) return;
    setNodes((current) => current.filter((node) => node.id !== selected.id));
    setEdges((current) => current.filter((edge) => edge.from !== selected.id && edge.to !== selected.id));
    setSelectedId("creator");
  }

  return (
    <div className="grid min-h-[calc(100vh-6rem)] gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="relative overflow-hidden rounded-lg border border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 px-5 py-4 dark:border-white/10">
          <div>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">YGGNAROK Agent Studio</p>
            <h1 className="text-xl font-semibold">Fluxo de agentes em nodes</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-stone-200" onClick={addNode}>
              <Plus size={16} /> Node
            </button>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-stone-200">
              <Save size={16} /> Salvo local
            </button>
          </div>
        </div>

        <div className="relative h-[640px] min-w-[940px] overflow-auto bg-[linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 980 640" aria-hidden="true">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" className="fill-slate-400 dark:fill-stone-500" />
              </marker>
            </defs>
            {edges.map((edge) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              const x1 = from.x + 168;
              const y1 = from.y + 58;
              const x2 = to.x;
              const y2 = to.y + 58;
              const mid = Math.max(36, Math.abs(x2 - x1) / 2);
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path
                    d={`M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`}
                    className="fill-none stroke-slate-400/80 dark:stroke-stone-500/80"
                    strokeWidth="2.5"
                    markerEnd="url(#arrow)"
                  />
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} className="fill-slate-500 text-[11px] dark:fill-stone-400">{edge.label}</text>
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className={[
                "absolute h-[116px] w-[168px] rounded-lg border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                node.color,
                selected.id === node.id ? "ring-4 ring-amber-300/45" : "",
              ].join(" ")}
              style={{ left: node.x, top: node.y }}
              onClick={() => setSelectedId(node.id)}
            >
              <div className="flex items-center gap-2">
                <CircleDot size={15} />
                <span className="truncate text-sm font-bold">{node.label}</span>
              </div>
              <p className="mt-2 truncate text-xs font-semibold opacity-75">{node.role}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 opacity-80">{node.instructions}</p>
              <p className="mt-2 truncate text-[11px] opacity-60">{node.model}</p>
            </button>
          ))}
        </div>
      </section>

      <aside className="rounded-lg border border-white/70 bg-white/70 p-5 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur dark:border-white/10 dark:bg-neutral-950/60">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-md bg-slate-950 text-amber-300 dark:bg-amber-300 dark:text-neutral-950">
            <Brain size={19} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Editor do node</p>
            <p className="truncate text-xs text-stone-500">{selected.id}</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Nome"><input className={inputClass} value={selected.label} onChange={(event) => updateSelected({ label: event.target.value })} /></Field>
          <Field label="Papel"><input className={inputClass} value={selected.role} onChange={(event) => updateSelected({ role: event.target.value })} /></Field>
          <Field label="Modelo"><input className={inputClass} value={selected.model} onChange={(event) => updateSelected({ model: event.target.value })} /></Field>
          <Field label="Instrucoes"><textarea className={textareaClass} value={selected.instructions} onChange={(event) => updateSelected({ instructions: event.target.value })} /></Field>
          <Field label="Formato de saida"><textarea className={textareaClass} value={selected.outputFormat} onChange={(event) => updateSelected({ outputFormat: event.target.value })} /></Field>
        </div>

        <div className="mt-5 grid gap-3">
          <button type="button" className={buttonClass}>
            <Sparkles size={16} className="mr-2" /> Testar fluxo
          </button>
          <button type="button" className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-900 dark:text-stone-200" onClick={removeSelected}>
            <Trash2 size={16} className="mr-2" /> Remover node
          </button>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-stone-300">
          <Status icon={<GitBranch size={16} />} text={`${nodes.length} nodes no fluxo`} />
          <Status icon={<ShieldCheck size={16} />} text="Pago desligado por padrao" />
          <Status icon={<FileText size={16} />} text="OpenRouter/free como modelo base" />
        </div>
      </aside>
    </div>
  );
}

function Status({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-white/70 bg-white/45 px-3 py-2 dark:border-white/10 dark:bg-neutral-950/35">
      {icon}
      <span>{text}</span>
    </div>
  );
}
