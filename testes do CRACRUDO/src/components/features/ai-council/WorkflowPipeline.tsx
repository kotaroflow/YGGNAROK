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
    <div className="rounded-2xl border border-line bg-surface p-7 shadow-sm backdrop-blur-xl mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Network className="w-5 h-5 text-brand" />
          Arquitetura de Blocos Neurais
        </h2>
        <p className="text-sm text-muted mt-1">
          Fluxo de execução de um AI Job em tempo real no Council.
        </p>
      </div>

      <div className="relative flex w-full flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0 mt-8">
        {/* Connecting Line for Desktop */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-line hidden lg:block -translate-y-1/2 z-0" />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isProcessing = index === 2; // Simulando status ativo no "Debate Engine"

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group w-full lg:w-auto">
              {/* Connecting Line for Mobile */}
              {index !== steps.length - 1 && (
                <div className="w-[2px] h-6 bg-line lg:hidden my-1" />
              )}
              
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isProcessing
                    ? "border-brand bg-brand/10 text-brand shadow-sm"
                    : "border-line bg-surface-strong text-muted group-hover:border-brand/50 group-hover:text-brand"
                }`}
              >
                <Icon className={`w-6 h-6 ${isProcessing ? "animate-pulse" : ""}`} />
              </div>
              
              <div className="mt-3 text-center lg:absolute lg:top-16 lg:w-32 lg:-ml-9">
                <p className={`text-sm font-semibold ${isProcessing ? "text-brand" : "text-foreground"}`}>
                  {step.name}
                </p>
                <p className="text-xs text-muted mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
