"use client";

import React from "react";
import { X, Brain, Activity, Target, Shield, BookOpen } from "lucide-react";

export interface AgentData {
  id: string;
  name: string;
  role: string;
  description: string;
  status: "Online" | "Idle" | "Debating";
  metrics: {
    complexityLevel: number;
    pendingLearnings: number;
    approvedLearnings: number;
    successRate: number;
  };
}

interface AgentEvolutionSidebarProps {
  agent: AgentData | null;
  onClose: () => void;
}

export function AgentEvolutionSidebar({ agent, onClose }: AgentEvolutionSidebarProps) {
  if (!agent) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/95 dark:bg-[#121018]/95 shadow-[0_0_80px_rgba(0,0,0,0.15)] dark:shadow-[0_0_80px_rgba(0,0,0,0.5)] border-l border-white/40 dark:border-white/10 backdrop-blur-2xl transform transition-transform duration-300 ease-out translate-x-0 overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-stone-100">{agent.name}</h2>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-500">{agent.role}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-stone-500 dark:hover:text-stone-300 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500 mb-4">Evolução Cognitiva</h3>
            
            {/* Complexity Level */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-stone-300 font-semibold">
                  <Activity className="w-4 h-4 text-violet-500" />
                  Nível de Complexidade
                </div>
                <span className="text-2xl font-bold text-slate-900 dark:text-stone-50">Lvl {agent.metrics.complexityLevel}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[linear-gradient(90deg,#8b5cf6,#d946ef)] rounded-full" 
                  style={{ width: `${(agent.metrics.complexityLevel / 20) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 dark:text-stone-500 mt-2 text-right">Progresso atual: {agent.metrics.complexityLevel}/20 MAX</p>
            </div>

            {/* Grid of Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50">
                <div className="flex items-center gap-2 text-slate-500 dark:text-stone-400 mb-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold uppercase">Acertos</span>
                </div>
                <p className="text-2xl font-bold text-slate-800 dark:text-stone-100">{agent.metrics.successRate}%</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50">
                <div className="flex items-center gap-2 text-slate-500 dark:text-stone-400 mb-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-semibold uppercase">Status</span>
                </div>
                <p className="text-lg font-bold text-slate-800 dark:text-stone-100">{agent.status}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500 mb-4">Base de Conhecimento</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-stone-200">Aprendizados Aprovados</p>
                    <p className="text-xs text-slate-500 dark:text-stone-400">Memória ativa e validada</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{agent.metrics.approvedLearnings}</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200/50 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-stone-200">Aprendizados Pendentes</p>
                    <p className="text-xs text-slate-500 dark:text-stone-400">Aguardando aprovação</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{agent.metrics.pendingLearnings}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-stone-500 mb-4">Resumo Operacional</h3>
            <p className="text-sm text-slate-600 dark:text-stone-300 leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-100 dark:bg-neutral-900/50 dark:border-neutral-800">
              {agent.description}
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
