"use client";

import { useState, useEffect } from "react";
import { 
  Brain, Sparkles, Trash2, Plus, RefreshCw, GitCommit, CheckCircle, 
  Settings, Filter, ArrowUpRight, Scale, Zap, Info, ChevronRight, HelpCircle
} from "lucide-react";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";

type MemoryItem = {
  id: string;
  category: "copy" | "tecnico" | "comercial" | "preferencias";
  fact: string;
  timestamp: string;
  confidence: number; // 0-100%
};

type MutationItem = {
  version: string;
  agent: string;
  change: string;
  timestamp: string;
  diffAdded: string;
  diffRemoved?: string;
};

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: "mem_1",
    category: "preferencias",
    fact: "O usuário Kotaro prefere abordagens diretas e focadas em benefícios reais, rejeitando marketing agressivo ou 'gatilhos' repetitivos.",
    timestamp: "Há 2 horas (Chat #42)",
    confidence: 96
  },
  {
    id: "mem_2",
    category: "copy",
    fact: "O Hermes (SEO) deve banir o uso das palavras 'revolucionário', 'disrupção' e 'paradigma' em copys e posts criados.",
    timestamp: "Há 1 dia (Chat #39)",
    confidence: 98
  },
  {
    id: "mem_3",
    category: "tecnico",
    fact: "Tempo de resposta do bucket R2 no Roteador de Mídias apresenta gargalo de latência (+1.4s) em conexões feitas após as 18h.",
    timestamp: "Ontem (Auditoria Técnica)",
    confidence: 89
  },
  {
    id: "mem_4",
    category: "comercial",
    fact: "O produto 'YGGNAROK Gold' atinge 35% mais engajamento quando a prova social (depoimentos) precede os botões de CTA.",
    timestamp: "Há 3 dias (Relatório Comercial)",
    confidence: 92
  },
  {
    id: "mem_5",
    category: "copy",
    fact: "Roteiros para vídeos curtos convertem 50% melhor se a introdução de 3 segundos for uma provocação direta em formato de pergunta.",
    timestamp: "Há 4 dias (Criação de Conteúdo)",
    confidence: 94
  }
];

const DEFAULT_MUTATIONS: MutationItem[] = [
  {
    version: "v1.2.4",
    agent: "Hermes (SEO)",
    change: "Adicionada restrição de termos redundantes e prolixidade após análise de taxa de rejeição de posts.",
    timestamp: "Há 2 horas",
    diffAdded: "+ Evite palavras de preenchimento (revolucionário, ecossistema, disrupção).\n+ Priorize headings H2 focados na dúvida de busca real.",
    diffRemoved: "- Use termos de alto impacto publicitário para reter a atenção."
  },
  {
    version: "v1.2.3",
    agent: "Morax (Conversão)",
    change: "Ajuste na priorização de depoimentos acima do CTA em páginas de checkout de alta conversão.",
    timestamp: "Há 1 dia",
    diffAdded: "+ Sempre estruture a prova social imediatamente antes de qualquer link de redirecionamento ou botão de checkout.",
  },
  {
    version: "v1.2.2",
    agent: "Isis (UX/UI)",
    change: "Injeção de diretrizes rígidas sobre contraste visual para acessibilidade baseada em feedbacks de auditoria.",
    timestamp: "Há 3 dias",
    diffAdded: "+ Mantenha a taxa mínima de contraste de 4.5:1 em elementos interativos e botões primários.",
    diffRemoved: "- Priorize gradientes estéticos sem contraste explícito."
  }
];

const NEW_FACTS_POOL = [
  "Detectado: O usuário prefere usar o modelo Qwen 2.5 Coder para tirar dúvidas de Next.js.",
  "Identificado padrão: A conversão de leads aumenta 12% se o botão de compra for dourado (#f5c400).",
  "Preferência: Resumos criativos devem conter no máximo 3 parágrafos e uma lista em tópicos.",
  "Gargalo de UX: Usuários mobile abandonam o carrinho se o popover de login abrir em tela inteira.",
  "Dica de Hashtags: Tags minimalistas (#yggnarok, #ia) geram 20% mais tráfego qualificado que spam de tags genéricas."
];

export function AgentEvolutionDashboard() {
  const [username, setUsername] = useState("kotaro");
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [mutations, setMutations] = useState<MutationItem[]>([]);
  const [level, setLevel] = useState(4);
  const [efficiency, setEfficiency] = useState(96.8);
  const [activeTab, setActiveTab] = useState<"all" | "copy" | "tecnico" | "comercial" | "preferencias">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom Memory Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFact, setNewFact] = useState("");
  const [newCategory, setNewCategory] = useState<"copy" | "tecnico" | "comercial" | "preferencias">("copy");

  // Active learning reflection simulation state
  const [reflectionStep, setReflectionStep] = useState<number | null>(null);
  const [reflectionLogs, setReflectionLogs] = useState<string[]>([]);
  
  const reflectionSteps = [
    "Analisando logs das últimas 48h de interações no chat...",
    "Examinando métricas comerciais de conversão do ecossistema...",
    "Medindo taxas de erro e latência na auditoria técnica de sites...",
    "Supervisor IA cruzando padrões comportamentais do usuário...",
    "Auto-aprendizado concluído! Novo conhecimento gerado."
  ];

  // Load from localStorage or set defaults
  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeUser = localStorage.getItem("yggnarok.username") || "kotaro";
      setUsername(activeUser);

      const storedMems = localStorage.getItem(`yggnarok.${activeUser}.ltm_memories`);
      const storedMuts = localStorage.getItem(`yggnarok.${activeUser}.prompt_mutations`);
      const storedLvl = localStorage.getItem(`yggnarok.${activeUser}.evolution_level`);
      const storedEff = localStorage.getItem(`yggnarok.${activeUser}.efficiency_rate`);

      if (storedMems) setMemories(JSON.parse(storedMems));
      else {
        setMemories(DEFAULT_MEMORIES);
        localStorage.setItem(`yggnarok.${activeUser}.ltm_memories`, JSON.stringify(DEFAULT_MEMORIES));
      }

      if (storedMuts) setMutations(JSON.parse(storedMuts));
      else {
        setMutations(DEFAULT_MUTATIONS);
        localStorage.setItem(`yggnarok.${activeUser}.prompt_mutations`, JSON.stringify(DEFAULT_MUTATIONS));
      }

      if (storedLvl) setLevel(Number(storedLvl));
      if (storedEff) setEfficiency(Number(storedEff));
    }
  }, []);

  // Save memories to localStorage
  const saveMemories = (updated: MemoryItem[]) => {
    setMemories(updated);
    localStorage.setItem(`yggnarok.${username}.ltm_memories`, JSON.stringify(updated));
  };

  const deleteMemory = (id: string) => {
    const updated = memories.filter((m) => m.id !== id);
    saveMemories(updated);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFact.trim()) return;

    const newItem: MemoryItem = {
      id: `mem_${Date.now()}`,
      category: newCategory,
      fact: newFact.trim(),
      timestamp: "Adicionado manualmente",
      confidence: 100
    };

    const updated = [newItem, ...memories];
    saveMemories(updated);
    
    // Trigger slightly increased efficiency
    const nextEff = Math.min(99.9, Number((efficiency + 0.2).toFixed(1)));
    setEfficiency(nextEff);
    localStorage.setItem(`yggnarok.${username}.efficiency_rate`, String(nextEff));

    setNewFact("");
    setShowAddForm(false);
  };

  // Run Self-Learning Simulation
  const triggerSelfLearning = () => {
    if (reflectionStep !== null) return;
    
    setReflectionStep(0);
    setReflectionLogs([reflectionSteps[0]]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < reflectionSteps.length) {
        setReflectionStep(step);
        setReflectionLogs((prev) => [...prev, reflectionSteps[step]]);
      } else {
        clearInterval(interval);
        
        // Pick a random learned fact
        const randomIndex = Math.floor(Math.random() * NEW_FACTS_POOL.length);
        const randomFact = NEW_FACTS_POOL[randomIndex];

        // Check if already learned
        const alreadyExists = memories.some((m) => m.fact === randomFact);
        if (!alreadyExists) {
          const newMem: MemoryItem = {
            id: `mem_auto_${Date.now()}`,
            category: Math.random() > 0.5 ? "copy" : "preferencias",
            fact: randomFact,
            timestamp: "Consolidado agora via Auto-Reflexão",
            confidence: Math.floor(Math.random() * 15) + 80
          };
          const updatedMems = [newMem, ...memories];
          saveMemories(updatedMems);

          // Add a prompt mutation log
          const newVer = `v1.2.${mutations.length + 2}`;
          const newMut: MutationItem = {
            version: newVer,
            agent: Math.random() > 0.5 ? "Hermes (SEO)" : "Morax (Conversão)",
            change: `Refinamento automático para otimização de contexto com base no novo fato assimilado.`,
            timestamp: "Agora mesmo",
            diffAdded: `+ Diretriz assimilada: ${randomFact}`
          };
          const updatedMuts = [newMut, ...mutations];
          setMutations(updatedMuts);
          localStorage.setItem(`yggnarok.${username}.prompt_mutations`, JSON.stringify(updatedMuts));
        }

        // Increase level and efficiency slightly
        const nextLvl = level + (Math.random() > 0.8 ? 1 : 0);
        const nextEff = Math.min(99.9, Number((efficiency + Math.random() * 0.5).toFixed(1)));
        
        setLevel(nextLvl);
        setEfficiency(nextEff);
        localStorage.setItem(`yggnarok.${username}.evolution_level`, String(nextLvl));
        localStorage.setItem(`yggnarok.${username}.efficiency_rate`, String(nextEff));

        setTimeout(() => {
          setReflectionStep(null);
          setReflectionLogs([]);
        }, 3000);
      }
    }, 1500);
  };

  // Filter memories
  const filteredMemories = memories.filter((m) => {
    const matchesTab = activeTab === "all" || m.category === activeTab;
    const matchesSearch = m.fact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "copy":
        return "text-indigo-600 bg-indigo-50 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-950/30 dark:border-indigo-800/50";
      case "tecnico":
        return "text-sky-600 bg-sky-50 border-sky-200 dark:text-sky-400 dark:bg-sky-950/30 dark:border-sky-800/50";
      case "comercial":
        return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800/50";
      default:
        return "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800/50";
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "copy": return "Copywriting";
      case "tecnico": return "Técnico";
      case "comercial": return "Comercial";
      default: return "Preferência";
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Autoaprendizado</p>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
            Motor de Evolução &amp; Reflexão
          </h2>
          <p className="text-sm text-muted mt-1">
            Supervisão e consolidação contínua das memórias semânticas de longo prazo de seus agentes.
          </p>
        </div>

        <button
          type="button"
          onClick={triggerSelfLearning}
          disabled={reflectionStep !== null}
          className="flex items-center gap-2 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-4 py-3 text-xs font-bold shadow-md shadow-brand/10 transition disabled:opacity-50 shrink-0"
        >
          <RefreshCw size={14} className={reflectionStep !== null ? "animate-spin" : ""} />
          {reflectionStep !== null ? "Auditando Logs..." : "Forçar Auto-Reflexão"}
        </button>
      </div>

      {/* Audit active loading overlay */}
      {reflectionStep !== null && (
        <div className="rounded-2xl border border-brand/35 bg-brand/5 p-6 animate-pulse shadow-lg backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 border border-brand/20">
              <Brain className="size-5 animate-pulse" />
            </div>
            <div className="space-y-2 flex-grow">
              <p className="text-sm font-bold text-foreground">Auto-Reflexão Ativa em Background...</p>
              <div className="space-y-1">
                {reflectionLogs.map((log, idx) => (
                  <p key={idx} className="text-xs text-muted flex items-center gap-2">
                    <span className="text-brand">›</span> {log}
                  </p>
                ))}
              </div>
              <div className="h-1.5 w-full bg-surface overflow-hidden rounded-full border border-line mt-3">
                <div 
                  className="h-full bg-brand rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
                  style={{ width: `${((reflectionStep + 1) / reflectionSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: KPIs */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface/40 p-4 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 size-16 bg-brand/5 blur-xl pointer-events-none" />
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Ecossistema Nível</p>
          <p className="text-2xl font-black text-brand mt-1.5">Lvl {level}</p>
          <p className="text-[10px] text-muted mt-1 leading-relaxed">Sábio Auto-Aprendizado</p>
        </div>

        <div className="rounded-xl border border-line bg-surface/40 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Fatos Consolidados</p>
          <p className="text-2xl font-black text-foreground mt-1.5">{memories.length}</p>
          <p className="text-[10px] text-muted mt-1 leading-relaxed">Memória Semântica LTM</p>
        </div>

        <div className="rounded-xl border border-line bg-surface/40 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Taxa de Eficiência</p>
          <p className="text-2xl font-black text-emerald-500 mt-1.5">{efficiency}%</p>
          <p className="text-[10px] text-muted mt-1 leading-relaxed">Redução de Alucinações</p>
        </div>

        <div className="rounded-xl border border-line bg-surface/40 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Mutações de Prompt</p>
          <p className="text-2xl font-black text-purple-500 mt-1.5">{mutations.length}</p>
          <p className="text-[10px] text-muted mt-1 leading-relaxed">Histórico de Otimização</p>
        </div>
      </div>

      {/* Content Layout split */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Learned Memories fact base (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface/20 rounded-xl p-3 border border-line">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1">
              {(["all", "copy", "tecnico", "comercial", "preferencias"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                    activeTab === tab 
                      ? "bg-brand text-neutral-950" 
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {tab === "all" ? "Todos os Fatos" : getCategoryLabel(tab)}
                </button>
              ))}
            </div>

            {/* Custom Search / Filter */}
            <input
              type="text"
              placeholder="Buscar memória..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-line bg-surface-strong/30 px-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
            />
          </div>

          {/* List of learned memories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Memória de Longo Prazo</span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 text-[11px] font-bold text-brand hover:text-brand-strong transition"
              >
                <Plus size={12} /> Injetar Fato Manual
              </button>
            </div>

            {/* Manual Fact Form */}
            {showAddForm && (
              <form onSubmit={handleAddMemory} className="rounded-xl border border-line bg-surface-strong/30 p-4 space-y-3 shadow-md">
                <p className="text-xs font-bold text-foreground">Injetar novo fato de aprendizado</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Ex: Usuário prefere copys mais breves de 2 parágrafos..."
                      value={newFact}
                      onChange={(e) => setNewFact(e.target.value)}
                      className="w-full rounded-lg border border-line bg-surface/50 px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full rounded-lg border border-line bg-surface/50 px-2 py-2 text-xs text-foreground focus:border-brand focus:outline-none"
                    >
                      <option value="copy">Copywriting</option>
                      <option value="tecnico">Técnico</option>
                      <option value="comercial">Comercial</option>
                      <option value="preferencias">Preferência</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-lg px-3 py-1.5 text-xs text-muted hover:text-foreground transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-brand hover:bg-brand-strong text-neutral-950 px-3 py-1.5 text-xs font-bold transition"
                  >
                    Salvar Fato
                  </button>
                </div>
              </form>
            )}

            {filteredMemories.length === 0 ? (
              <div className="rounded-xl border border-line border-dashed p-8 text-center text-xs text-muted">
                Nenhum fato de aprendizado encontrado nesta categoria.
              </div>
            ) : (
              filteredMemories.map((m) => (
                <div 
                  key={m.id} 
                  className="group rounded-xl border border-line bg-surface/20 hover:border-brand/20 p-4 transition duration-200 relative overflow-hidden flex gap-4"
                >
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getCategoryBadge(m.category)}`}>
                        {getCategoryLabel(m.category)}
                      </span>
                      <span className="text-[10px] text-muted font-mono">{m.timestamp}</span>
                      <span className="text-[9px] rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5">
                        {m.confidence}% Confiança
                      </span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{m.fact}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteMemory(m.id)}
                    className="opacity-0 group-hover:opacity-100 size-7 rounded-lg text-muted hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center shrink-0 transition"
                    title="Remover fato da memória"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column: Prompt Mutations (1 col) */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-muted uppercase tracking-wider block">Histórico de Otimização</span>

          <div className="relative border-l border-line/60 ml-2.5 pl-6 space-y-5">
            {mutations.map((mut, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <span className="absolute -left-[31px] top-1.5 size-2.5 rounded-full bg-brand border border-white dark:border-neutral-950 shadow-md group-hover:scale-125 transition" />
                
                <div className="rounded-xl border border-line bg-surface/20 p-4 space-y-2 shadow-sm hover:border-purple-500/25 transition">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-purple-500/15 border border-purple-500/20 px-1.5 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 font-mono uppercase tracking-wider">
                      {mut.version}
                    </span>
                    <span className="text-[9px] text-muted">{mut.timestamp}</span>
                  </div>
                  
                  <p className="text-[11px] font-bold text-foreground">{mut.agent}</p>
                  <p className="text-[11px] text-muted leading-relaxed leading-normal">{mut.change}</p>
                  
                  {/* Diff block preview */}
                  <div className="mt-2 rounded bg-neutral-900/80 p-2 font-mono text-[9px] text-foreground leading-relaxed overflow-x-auto border border-line/40">
                    {mut.diffRemoved && (
                      <p className="text-rose-500">{mut.diffRemoved}</p>
                    )}
                    <p className="text-emerald-500 whitespace-pre-wrap">{mut.diffAdded}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
