"use client";

import React from "react";
import { Network, Sparkles, MessagesSquare, CheckCircle, BrainCircuit, Activity } from "lucide-react";

const steps = [
  { id: 1, name: "Model Router", icon: Network, desc: "Infere domínio" },
  { id: 2, name: "Generator", icon: Sparkles, desc: "Cria candidatos" },
  { id: 3, name: "Debate Engine", icon: MessagesSquare, desc: "Crítica avançada" },
  { id: 4, name: "Supervisor", icon: CheckCircle, desc: "Síntese final" },
  { id: 5, name: "Learning Engine", icon: BrainCircuit, desc: "Extrai aprendizado" },
  { id: 6, name: "Audit Log", icon: Activity, desc: "Registra telemetria" },
];

export function WorkflowPipeline() {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-7 shadow-[0_24px_80px_rgba(99,85,74,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/60 mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-stone-100 flex items-center gap-2">
          <Network className="w-5 h-5 text-amber-500" />
          Arquitetura de Blocos Neurais
        </h2>
        <p className="text-sm text-slate-500 dark:text-stone-400 mt-1">
          Fluxo de execução de um AI Job em tempo real no Council.
        </p>
      </div>

      <div className="relative flex w-full flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0 mt-8">
        {/* Connecting Line for Desktop */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 dark:bg-neutral-800 hidden lg:block -translate-y-1/2 z-0" />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isProcessing = index === 2; // Simulando status ativo no "Debate Engine"

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group w-full lg:w-auto">
              {/* Connecting Line for Mobile */}
              {index !== steps.length - 1 && (
                <div className="w-[2px] h-6 bg-slate-200 dark:bg-neutral-800 lg:hidden my-1" />
              )}
              
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isProcessing
                    ? "border-amber-400 bg-amber-100 text-amber-600 shadow-[0_0_20px_rgba(245,196,0,0.3)] dark:border-amber-500/50 dark:bg-amber-950/50 dark:text-amber-400"
                    : "border-slate-200 bg-white text-slate-400 group-hover:border-amber-300 group-hover:text-amber-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-stone-500 dark:group-hover:border-amber-700/50"
                }`}
              >
                <Icon className={`w-6 h-6 ${isProcessing ? "animate-pulse" : ""}`} />
              </div>
              
              <div className="mt-3 text-center lg:absolute lg:top-16 lg:w-32 lg:-ml-9">
                <p className={`text-sm font-semibold ${isProcessing ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-stone-300"}`}>
                  {step.name}
                </p>
                <p className="text-xs text-slate-400 dark:text-stone-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
