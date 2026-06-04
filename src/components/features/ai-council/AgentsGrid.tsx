"use client";

import React, { useState } from "react";
import { 
  PenTool, 
  Users, 
  Briefcase, 
  Share2, 
  Library, 
  Server, 
  BarChart, 
  CheckSquare, 
  ChevronRight
} from "lucide-react";
import { AgentEvolutionSidebar, AgentData } from "./AgentEvolutionSidebar";

const agentsData: AgentData[] = [
  {
    id: "hefesto",
    name: "Hefesto",
    role: "Criador de Conteúdo",
    description: "Responsável por rascunhos iniciais e ideação. Especialista em redação persuasiva e estruturação de narrativas para web e redes sociais.",
    status: "Debating",
    metrics: { complexityLevel: 14, pendingLearnings: 3, approvedLearnings: 42, successRate: 88 }
  },
  {
    id: "gaia",
    name: "Gaia",
    role: "Gestão de Perfis",
    description: "Mantém a consistência de personas, nichos, regras de estilo e identidade YGGNAROK durante a execução das tarefas.",
    status: "Idle",
    metrics: { complexityLevel: 18, pendingLearnings: 1, approvedLearnings: 89, successRate: 95 }
  },
  {
    id: "morax",
    name: "Morax",
    role: "Estrategista de Vendas",
    description: "Foco em resultados práticos, engajamento, retenção e conversão de vendas para afiliados e produtos próprios.",
    status: "Online",
    metrics: { complexityLevel: 16, pendingLearnings: 5, approvedLearnings: 56, successRate: 91 }
  },
  {
    id: "yomi",
    name: "Yomi",
    role: "Agente de Postagem",
    description: "Gerencia canais de distribuição e cronogramas de publicação em múltiplos ecossistemas e plataformas.",
    status: "Idle",
    metrics: { complexityLevel: 10, pendingLearnings: 0, approvedLearnings: 34, successRate: 98 }
  },
  {
    id: "hotei",
    name: "Hotei",
    role: "Curador de Biblioteca",
    description: "Organiza, cataloga e recupera ativos criativos (textos, imagens, prompts) de forma semântica do R2 e Vector DB.",
    status: "Online",
    metrics: { complexityLevel: 12, pendingLearnings: 2, approvedLearnings: 112, successRate: 96 }
  },
  {
    id: "heimdall",
    name: "Heimdall",
    role: "Guardião do Sistema",
    description: "Auditoria de segurança, governança e classificação de riscos (baixo, médio, alto). Requer override do admin para ações de alto risco.",
    status: "Online",
    metrics: { complexityLevel: 20, pendingLearnings: 8, approvedLearnings: 240, successRate: 99 }
  },
  {
    id: "maat",
    name: "Maat",
    role: "Auditoria e Relatórios",
    description: "Gera logs de auditoria detalhados e acompanha a performance técnica, financeira e operacional do YGGNAROK.",
    status: "Idle",
    metrics: { complexityLevel: 15, pendingLearnings: 1, approvedLearnings: 67, successRate: 94 }
  },
  {
    id: "isis",
    name: "Isis",
    role: "Revisora Crítica",
    description: "Encontra falhas, repetições, qualidade baixa e contradições nas propostas de conteúdo ou de código.",
    status: "Debating",
    metrics: { complexityLevel: 17, pendingLearnings: 4, approvedLearnings: 156, successRate: 92 }
  }
];

const iconMap: Record<string, React.FC<any>> = {
  "hefesto": PenTool,
  "gaia": Users,
  "morax": Briefcase,
  "yomi": Share2,
  "hotei": Library,
  "heimdall": Server,
  "maat": BarChart,
  "isis": CheckSquare,
};

export function AgentsGrid() {
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Online": return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]";
      case "Debating": return "bg-amber-500 shadow-[0_0_8px_rgba(248, 195, 102,0.6)] animate-pulse";
      case "Idle": return "bg-slate-300 dark:bg-slate-600";
      default: return "bg-slate-300";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {agentsData.map((agent) => {
          const Icon = iconMap[agent.id];
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className="group flex flex-col text-left rounded-2xl border border-white/70 bg-white/70 p-6 shadow-[0_18px_60px_rgba(99,85,74,0.10)] backdrop-blur transition hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-neutral-950/60 dark:hover:bg-neutral-900 overflow-hidden relative"
            >
              {/* Decorative top gradient line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between w-full mb-4">
                <div className="grid size-12 place-items-center rounded-xl bg-slate-100 text-slate-600 dark:bg-neutral-900/80 dark:text-stone-300 group-hover:bg-amber-100 group-hover:text-amber-600 dark:group-hover:bg-amber-900/30 dark:group-hover:text-amber-400 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-neutral-900/80 px-2 py-1 rounded-full border border-slate-200 dark:border-neutral-800">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400">
                    {agent.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-stone-400 mt-1 uppercase tracking-wide">
                  {agent.role}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-neutral-800/60 w-full flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 dark:text-stone-500 font-medium">Lvl Complexidade</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-stone-300">{agent.metrics.complexityLevel}</span>
                </div>
                
                <div className="flex items-center text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform">
                  Ver Evolução
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <AgentEvolutionSidebar 
        agent={selectedAgent} 
        onClose={() => setSelectedAgent(null)} 
      />
    </>
  );
}
