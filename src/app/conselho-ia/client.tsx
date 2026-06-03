"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Brain, ImageIcon, ShieldCheck, Sparkles, Workflow, Loader2, Check, 
  AlertTriangle, Play, Music, Cpu, Terminal, Radio, ShieldAlert 
} from "lucide-react";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import dynamic from "next/dynamic";

const HologramScene = dynamic(() => import("./hologram-scene").then((m) => m.HologramScene), { ssr: false });

type FreeCouncilJob = {
  id: string;
  taskType: string;
  mode: "fast" | "deep" | "chaos" | "council_decision";
  prompt: string;
  status: "completed" | "failed" | "processing" | "pending";
  risk: "low" | "medium" | "high";
  final: string;
  candidates: Array<{ agent: string; provider: string; model: string; summary: string; risk: string; items: string[] }>;
  critiques: Array<{ agent: string; provider: string; model: string; summary: string; risk: string; items: string[] }>;
  memory: Array<{ content: string; risk: string; status: string; confidence: number }>;
  media: { type: string; status: string; prompt: string; provider: string; message: string } | null;
  providers: Array<{ provider: string; model: string; status: string }>;
  createdAt: string;
  errorMessage?: string;
};

export function ConselhoIaClient({ initialJobs, selectedJob }: { initialJobs: FreeCouncilJob[]; selectedJob: FreeCouncilJob | null }) {
  const router = useRouter();
  const [jobs, setJobs] = useState<FreeCouncilJob[]>(initialJobs);
  const [selected, setSelected] = useState<FreeCouncilJob | null>(selectedJob);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const hasProcessingJobs = useCallback((list: FreeCouncilJob[]) => {
    return list.some((j) => j.status === "processing" || j.status === "pending");
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/ai-council/jobs");
      const data = await res.json();
      if (data.jobs) {
        setJobs(data.jobs);
        setSelected((prev) => {
          if (!prev) return data.jobs[0] ?? null;
          const updated = data.jobs.find((j: FreeCouncilJob) => j.id === prev.id);
          return updated ?? prev;
        });
      }
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    if (hasProcessingJobs(jobs)) {
      pollRef.current = setInterval(fetchJobs, 10000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [jobs, hasProcessingJobs, fetchJobs]);

  useEffect(() => {
    if (selected?.id) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("job") !== selected.id) {
        params.set("job", selected.id);
        window.history.replaceState(null, "", `?${params.toString()}`);
      }
    }
  }, [selected]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/ai-council/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: formData.get("taskType"),
          mode: formData.get("mode"),
          prompt: formData.get("prompt"),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "unknown" }));
        showToast("error", `Erro: ${err.error || "Falha ao processar"}`);
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      if (data.job) {
        setJobs((prev) => [data.job, ...prev]);
        setSelected(data.job);
        showToast("success", "Conselho de IA acionado!");
      }
    } catch {
      showToast("error", "Erro de rede ao enviar tarefa");
    }

    setSubmitting(false);
  };

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[400px_1fr] lg:px-8 text-stone-200 font-sans relative">
      
      {/* Background Anime Screentone */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f5c400 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[var(--z-toast)] flex items-center gap-2 border px-5 py-3 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-2xl rounded-none ${
            toast.type === "success"
              ? "border-[#f5c400] bg-[#0e0d10]/95 text-[#f5c400]"
              : "border-red-500 bg-[#0e0d10]/95 text-red-500"
          }`}
        >
          {toast.type === "success" ? <Check size={14} /> : <AlertTriangle size={14} />}
          {toast.message}
        </div>
      )}

      {/* LEFT COLUMN: Controls Console */}
      <section className="bg-[#0e0d10]/90 backdrop-blur-md border border-white/10 border-l-4 border-l-[#f5c400] p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#f5c400] animate-pulse" />
            <span className="text-xs font-bold text-[#f5c400] uppercase tracking-widest">Painel Operacional</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight text-white" style={{ letterSpacing: "0.05em" }}>Conselho de IAs</h1>
          <p className="mt-2 text-sm text-stone-400 leading-relaxed">
            Conselho Neural de IA. Orquestração multi-agente, debates críticos e sínteses operacionais.
          </p>
        </div>

        {/* 3D Holographic supervisor Core (surprise!) */}
        <div className="w-full h-56 bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center">
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">Odin Core: Online</span>
          </div>
          
          {mounted ? (
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
              <HologramScene />
            </div>
          ) : (
            <div className="text-stone-600 font-mono text-xs">Carregando Holograma 3D...</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Tipo de Missão">
            <select className={`${inputClass} !bg-black/60 !border-white/10 !text-white rounded-none focus:!border-[#f5c400] focus:ring-0`} name="taskType" defaultValue="content.prepare">
              <option value="content.prepare">Preparar Conteúdo / Texto</option>
              <option value="strategy.plan">Planejamento de Estratégia</option>
              <option value="system.decision">Decisão de Arquitetura</option>
              <option value="image.generate">Geração de Imagens (Cloud)</option>
              <option value="video.plan">Planejamento de Vídeo</option>
              <option value="review.critic">Revisão Crítica Geral</option>
            </select>
          </Field>
          
          <Field label="Modo Operacional">
            <select className={`${inputClass} !bg-black/60 !border-white/10 !text-white rounded-none focus:!border-[#f5c400] focus:ring-0`} name="mode" defaultValue="chaos">
              <option value="fast">FAST (Um Agente Rápido)</option>
              <option value="deep">DEEP (Debate de Especialistas)</option>
              <option value="chaos">CHAOS (Conselho Completo + Odin)</option>
              <option value="council_decision">COUNCIL DECISION (Consenso Geral)</option>
            </select>
          </Field>
          
          <Field label="Ordens e Diretrizes">
            <textarea 
              rows={4}
              className={`${textareaClass} !bg-black/60 !border-white/10 !text-stone-100 rounded-none focus:!border-[#f5c400] focus:ring-0 text-sm`} 
              name="prompt" 
              defaultValue="Crie um novo módulo de segurança com HUD estilo mecha e defina as diretrizes musicais do Arco." 
            />
          </Field>
          
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-[#f5c400] text-black font-bold uppercase tracking-wider py-3 hover:bg-white transition-all duration-300 rounded-none"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2 text-xs">
                <Loader2 size={16} className="animate-spin" />
                CONVOCANDO O CONSELHO...
              </span>
            ) : (
              <span className="flex items-center gap-2 text-xs">
                <Play size={14} fill="currentColor" />
                INICIAR DEBATE NEURAL
              </span>
            )}
          </button>
        </form>

        {/* Hardware & Models Live Hud */}
        <div className="border border-white/5 bg-black/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-[#f5c400]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Hardware & Modelos</h3>
          </div>
          <div className="grid gap-2 font-mono text-xs text-stone-400">
            <div className="flex justify-between">
              <span>NVIDIA Model:</span>
              <span className="text-[#f5c400]">nemotron-3-nano:4b</span>
            </div>
            <div className="flex justify-between">
              <span>DeepSeek:</span>
              <span className="text-[#f5c400]">deepseek-r1:8b</span>
            </div>
            <div className="flex justify-between">
              <span>Coder:</span>
              <span className="text-stone-300">qwen2.5-coder:14b</span>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: Results Dashboard */}
      <section className="space-y-6">
        {selected ? <SelectedJob job={selected} /> : <EmptyState />}

        {/* History Log Panel */}
        <section className="bg-[#0e0d10]/90 backdrop-blur-md border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-[#f5c400]" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Histórico de Sessões do Conselho</h2>
          </div>
          
          <div className="grid gap-3 max-h-72 overflow-y-auto pr-2">
            {jobs.length ? jobs.map((job) => (
              <button 
                key={job.id} 
                type="button" 
                onClick={() => setSelected(job)} 
                className={`w-full text-left p-3 border hover:border-[#f5c400]/40 transition-all duration-300 ${selected?.id === job.id ? 'border-[#f5c400] bg-white/[0.03]' : 'border-white/5 bg-black/20'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-sm text-white tracking-wide uppercase">{job.taskType}</p>
                    <p className="mt-1 text-[11px] font-mono text-stone-500 uppercase tracking-widest">{job.mode} | {job.createdAt.substring(0, 10)}</p>
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f5c400] bg-[#f5c400]/15 border border-[#f5c400]/30 px-3 py-1 rounded-sm">{job.risk}</span>
                </div>
              </button>
            )) : <p className="py-4 text-sm text-stone-500 font-mono text-center">Nenhum log armazenado no Grimório.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

function SelectedJob({ job }: { job: FreeCouncilJob }) {
  return (
    <section className="bg-[#0e0d10]/90 backdrop-blur-md border border-white/10 p-6 shadow-2xl relative overflow-hidden flex flex-col gap-6">
      
      {/* Background Screentone */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#f5c400 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>

      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/15 pb-5 relative z-10">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#f5c400] border border-[#f5c400]/30 bg-[#f5c400]/10 px-2 py-1">{job.mode} mode</span>
          <h2 className="mt-2 text-xl font-bold uppercase tracking-tight text-white">{job.taskType}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">Risco Operacional:</span>
          <span className={`text-xs font-mono font-bold uppercase border px-3 py-1.5 rounded-sm ${job.risk === 'high' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-stone-500 text-stone-300'}`}>{job.risk}</span>
        </div>
      </header>

      {job.errorMessage ? (
        <div className="border border-red-500 bg-red-500/10 p-4 flex items-start gap-3 relative z-10">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm font-mono text-red-200">{job.errorMessage}</p>
        </div>
      ) : null}

      {/* Supervisor Unified Synthesis Card */}
      <article className="border border-white/10 border-l-4 border-l-[#f5c400] bg-white/[0.02] p-5 relative z-10">
        <header className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-[#f5c400]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Síntese do Supervisor Odin</h3>
        </header>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-300 font-sans">{job.final}</p>
      </article>

      {/* Multi-Agent Candidates and Critiques */}
      <div className="grid gap-4 md:grid-cols-2 relative z-10">
        <ResultGroup icon={<Sparkles className="w-4 h-4 text-[#f5c400]" />} title="Gerações dos Especialistas" rows={job.candidates} />
        <ResultGroup icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />} title="Críticas do Conselho" rows={job.critiques} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 relative z-10">
        {/* Memory and Learnings */}
        <section className="border border-white/10 bg-black/30 p-5">
          <header className="flex items-center gap-2 mb-4">
            <Workflow className="w-4 h-4 text-[#f5c400]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Aprendizado de Longo Prazo</h3>
          </header>
          <div className="space-y-3">
            {job.memory.map((memory, index) => (
              <article key={index} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase bg-white/5 px-2 py-0.5 text-stone-400">{memory.status}</span>
                  <span className="text-[10px] font-mono text-stone-500">Confiança: {(memory.confidence * 100).toFixed(0)}%</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">{memory.content}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Audio Visual Prompt Panel */}
        <section className="border border-white/10 bg-black/30 p-5 flex flex-col gap-4">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#f5c400]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Diretrizes Audiovisuais</h3>
            </div>
            {job.media && <Music className="w-4 h-4 text-[#f5c400] animate-pulse" />}
          </header>
          
          {job.media ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <span className="text-[10px] font-mono uppercase border border-stone-600 px-2 py-0.5 text-stone-400">{job.media.provider}</span>
                <span className="text-[10px] font-mono uppercase border border-stone-600 px-2 py-0.5 text-stone-400">{job.media.type}</span>
                <span className="text-[10px] font-mono uppercase border border-[#f5c400]/40 text-[#f5c400] bg-[#f5c400]/10 px-2 py-0.5">{job.media.status}</span>
              </div>
              <p className="text-xs text-stone-300 font-mono italic leading-relaxed">&ldquo;{job.media.message}&rdquo;</p>
              <div className="bg-[#0e0d10] p-3 border border-white/5 font-mono text-[11px] text-stone-400 leading-relaxed break-words">
                <strong>Prompt:</strong> {job.media.prompt}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-white/10 p-6 text-center">
              <p className="text-xs text-stone-500 font-mono">Nenhum pedido de mídia gerado neste Arco.</p>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

function ResultGroup({ icon, title, rows }: { icon: React.ReactNode; title: string; rows: Array<{ agent: string; provider: string; model: string; summary: string; risk: string; items: string[] }> }) {
  return (
    <section className="border border-white/10 bg-black/30 p-5 flex flex-col gap-4">
      <header className="flex items-center gap-2">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">{title}</h3>
      </header>
      
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {rows.map((row) => (
          <article key={`${row.agent}-${row.model}`} className="border border-white/5 bg-black/40 p-4 hover:border-white/15 transition-all duration-300">
            <header className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">{row.agent}</p>
                <p className="text-[10px] font-mono text-stone-500 mt-0.5">{row.model}</p>
              </div>
              <span className="text-[9px] font-mono uppercase bg-white/5 px-2 py-0.5 text-stone-400 border border-white/10">{row.provider}</span>
            </header>
            <p className="text-xs leading-relaxed text-stone-300">{row.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="bg-[#0e0d10]/90 backdrop-blur-md border border-white/10 border-dashed p-12 text-center shadow-2xl flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 rounded-full border border-[#f5c400]/30 bg-[#f5c400]/10 flex items-center justify-center">
        <Brain className="w-6 h-6 text-[#f5c400] animate-pulse" />
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-white">Conselho em Prontidão</p>
        <p className="mt-2 text-xs text-stone-500 max-w-sm leading-relaxed">
          Envie ordens e diretrizes táticas para acionar a tomada de decisões, discussões de especialistas e auditorias do conselho.
        </p>
      </div>
    </section>
  );
}
