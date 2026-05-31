"use client";

import { useMemo, useState } from "react";
import { 
  Brain, CircleDot, GitBranch, Plus, Save, ShieldCheck, 
  Sparkles, Trash2, Play, Loader2, Check, X, 
  Layers, ShieldAlert, Cpu, RefreshCw, Zap
} from "lucide-react";
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
  status: "idle" | "success" | "warning";
  health: number;
};

type AgentEdge = {
  from: string;
  to: string;
  label: string;
  colorClass: string;
};

type SandboxStepLog = {
  nodeId: string;
  nodeLabel: string;
  modelUsed: string;
  status: "pending" | "running" | "completed";
  output: string;
  tokens: number;
  cost: number;
};

const initialNodes: AgentNode[] = [
  {
    id: "brief",
    label: "Brief",
    role: "Entrada",
    model: "manual (Grátis)",
    instructions: "Recebe objetivo, publico, tom, plataforma e restricoes.",
    outputFormat: "Contexto limpo para os agentes.",
    x: 48,
    y: 200,
    color: "border-sky-500/30 dark:bg-sky-950/20 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.05)]",
    status: "success",
    health: 100
  },
  {
    id: "creator",
    label: "Hefesto",
    role: "Criador",
    model: "mistralai/mistral-nemo (Grátis)",
    instructions: "Gerar ideias, roteiro, legenda, variacoes e um primeiro caminho forte.",
    outputFormat: "summary, items, next_actions, risk, metadata",
    x: 280,
    y: 80,
    color: "border-amber-500/30 dark:bg-amber-950/20 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.05)]",
    status: "warning", // Has bottleneck!
    health: 82
  },
  {
    id: "critic",
    label: "Isis",
    role: "Critica",
    model: "google/gemini-2.0-flash-thinking-exp (Grátis)",
    instructions: "Encontrar fraquezas, repeticao, promessa fraca, risco e falta de clareza.",
    outputFormat: "critica, ajustes obrigatorios, nota de prontidao",
    x: 520,
    y: 80,
    color: "border-rose-500/30 dark:bg-rose-950/20 text-rose-200 shadow-[0_0_15px_rgba(239,68,68,0.05)]",
    status: "success",
    health: 95
  },
  {
    id: "strategy",
    label: "Morax",
    role: "Estrategista",
    model: "meta-llama/llama-3.3-70b-instruct (Grátis)",
    instructions: "Aumentar utilidade, venda, retencao, clareza de oferta e proximo passo.",
    outputFormat: "melhorias, angulos, hooks, CTA",
    x: 520,
    y: 320,
    color: "border-emerald-500/30 dark:bg-emerald-950/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.05)]",
    status: "warning", // Has bottleneck!
    health: 78
  },
  {
    id: "supervisor",
    label: "Supervisor",
    role: "Sintese",
    model: "deepseek/deepseek-r1 (Grátis)",
    instructions: "Unir o melhor das propostas, cortar ruido e entregar versao pronta para uso.",
    outputFormat: "conteudo final, checklist, riscos, proximas acoes",
    x: 770,
    y: 200,
    color: "border-violet-500/30 dark:bg-violet-950/20 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.05)]",
    status: "success",
    health: 98
  },
];

const initialEdges: AgentEdge[] = [
  { from: "brief", to: "creator", label: "contexto", colorClass: "stroke-sky-500/40" },
  { from: "creator", to: "critic", label: "rascunho", colorClass: "stroke-amber-500/40" },
  { from: "creator", to: "strategy", label: "ideia", colorClass: "stroke-amber-500/40" },
  { from: "critic", to: "supervisor", label: "correcao", colorClass: "stroke-rose-500/40" },
  { from: "strategy", to: "supervisor", label: "direcao", colorClass: "stroke-emerald-500/40" },
];

export function AgentNodeStudio() {
  const [nodes, setNodes] = useState<AgentNode[]>(initialNodes);
  const [edges, setEdges] = useState<AgentEdge[]>(initialEdges);
  const [selectedId, setSelectedId] = useState("creator");
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  // Sandbox states
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxPrompt, setSandboxPrompt] = useState("Crie uma campanha de marketing para o YGGNAROK OS");
  const [sandboxStatus, setSandboxStatus] = useState<"idle" | "running" | "completed">("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [sandboxLogs, setSandboxLogs] = useState<SandboxStepLog[]>([]);

  // AI Auto-Construction prompt state
  const [aiFlowPrompt, setAiFlowPrompt] = useState("");
  const [isGeneratingFlow, setIsGeneratingFlow] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);

  // Dedicated Optimizer Agent (Heimdall) states
  const [optimizerStatus, setOptimizerStatus] = useState<"idle" | "diagnosing" | "fixing" | "completed">("idle");
  const [healthScore, setHealthScore] = useState(91); // Ecossystem overall health

  const bottlenecks = useMemo(() => {
    return nodes
      .filter((n) => n.health < 90)
      .map((n) => {
        if (n.id === "creator") return { id: n.id, label: n.label, issue: "Instruções excessivamente genéricas no Criador. Risco de gerar textos clichês." };
        if (n.id === "strategy") return { id: n.id, label: n.label, issue: "Estrategista operando sem metas de conversão de CTA explícitas." };
        return { id: n.id, label: n.label, issue: `Agente com performance sub-otimizada (${n.health}%).` };
      });
  }, [nodes]);

  function updateSelected(patch: Partial<AgentNode>) {
    setNodes((current) => current.map((node) => node.id === selected.id ? { ...node, ...patch } : node));
  }

  function addNode() {
    const id = `agent-${Date.now()}`;
    const next: AgentNode = {
      id,
      label: "Novo agente",
      role: "Custom",
      model: "google/gemini-2.0-flash-thinking-exp (Grátis)",
      instructions: "Defina como este agente deve pensar e decidir.",
      outputFormat: "summary, items, next_actions, risk",
      x: 320,
      y: 400,
      color: "border-brand/30 dark:bg-brand/10 text-brand shadow-[0_0_15px_rgba(245,158,11,0.05)] node-animation-pop",
      status: "idle",
      health: 100
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

  // --- AUTOMATIC AI DYNAMIC WORKFLOW BUILDER ---
  const handleAutoBuildFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiFlowPrompt.trim() || isGeneratingFlow) return;

    setIsGeneratingFlow(true);
    setNodes([]);
    setEdges([]);
    setGenerationLogs(["Iniciando sintetizador neural de fluxo..."]);

    const promptLower = aiFlowPrompt.toLowerCase();
    let flowNodes: AgentNode[] = [];
    let flowEdges: AgentEdge[] = [];

    if (promptLower.includes("seo") || promptLower.includes("blog") || promptLower.includes("artigo") || promptLower.includes("texto")) {
      flowNodes = [
        {
          id: "brief",
          label: "Palavra-Chave",
          role: "Entrada SEO",
          model: "manual (Grátis)",
          instructions: "Define o tema de busca, concorrentes e volume estimado.",
          outputFormat: "keyword, intent, parameters",
          x: 48,
          y: 200,
          color: "border-sky-500/30 dark:bg-sky-950/20 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.05)] node-animation-pop",
          status: "success",
          health: 100
        },
        {
          id: "keyword_analyst",
          label: "Hermes (SEO)",
          role: "Pesquisador",
          model: "meta-llama/llama-3.3-70b-instruct (Grátis)",
          instructions: "Busca intenção de busca, headings ideais (H2/H3) e densidade de LSI.",
          outputFormat: "headings, keywords_list, strategy",
          x: 280,
          y: 80,
          color: "border-emerald-500/30 dark:bg-emerald-950/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.05)] node-animation-pop",
          status: "success",
          health: 98
        },
        {
          id: "copywriter",
          label: "Hefesto (Redator)",
          role: "Escritor",
          model: "mistralai/mistral-nemo (Grátis)",
          instructions: "Escrever artigo completo estruturado com introdução atraente e formatação limpa.",
          outputFormat: "content_markdown, summary, tags",
          x: 520,
          y: 80,
          color: "border-amber-500/30 dark:bg-amber-950/20 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.05)] node-animation-pop",
          status: "warning",
          health: 84
        },
        {
          id: "cro_expert",
          label: "Morax (CTA)",
          role: "Otimizador CRO",
          model: "meta-llama/llama-3.2-3b-instruct (Grátis)",
          instructions: "Adiciona caixas de captura, links internos ideais e chamadas de conversão.",
          outputFormat: "cta_blocks, lead_magnet_suggestion",
          x: 520,
          y: 320,
          color: "border-indigo-500/30 dark:bg-indigo-950/20 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.05)] node-animation-pop",
          status: "warning",
          health: 81
        },
        {
          id: "supervisor",
          label: "Supervisor SEO",
          role: "Revisão Final",
          model: "deepseek/deepseek-r1 (Grátis)",
          instructions: "Garante legibilidade, remove prolixidades e audita densidade das palavras-chave.",
          outputFormat: "artigo_pronto, meta_title, meta_description",
          x: 770,
          y: 200,
          color: "border-violet-500/30 dark:bg-violet-950/20 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.05)] node-animation-pop",
          status: "success",
          health: 99
        }
      ];

      flowEdges = [
        { from: "brief", to: "keyword_analyst", label: "keyword", colorClass: "stroke-sky-500/40" },
        { from: "keyword_analyst", to: "copywriter", label: "estrutura", colorClass: "stroke-emerald-500/40" },
        { from: "copywriter", to: "cro_expert", label: "artigo_sujo", colorClass: "stroke-amber-500/40" },
        { from: "cro_expert", to: "supervisor", label: "artigo_cta", colorClass: "stroke-indigo-500/40" }
      ];
    } else if (promptLower.includes("cod") || promptLower.includes("dev") || promptLower.includes("program") || promptLower.includes("api") || promptLower.includes("bug")) {
      flowNodes = [
        {
          id: "brief",
          label: "Issue/Bug",
          role: "Definição",
          model: "manual (Grátis)",
          instructions: "Define o bug report, comportamento esperado e stack utilizada.",
          outputFormat: "bug_details, expected, technologies",
          x: 48,
          y: 200,
          color: "border-sky-500/30 dark:bg-sky-950/20 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.05)] node-animation-pop",
          status: "success",
          health: 100
        },
        {
          id: "architect",
          label: "Isis (Arquiteta)",
          role: "Analista de Lógica",
          model: "google/gemini-2.0-flash-thinking-exp (Grátis)",
          instructions: "Planeja o refactoring das pastas, hooks necessários e previne regressões.",
          outputFormat: "refactoring_plan, risk_assessment",
          x: 280,
          y: 80,
          color: "border-rose-500/30 dark:bg-rose-950/20 text-rose-200 shadow-[0_0_15px_rgba(239,68,68,0.05)] node-animation-pop",
          status: "success",
          health: 96
        },
        {
          id: "coder",
          label: "Qwen Coder",
          role: "Engenheiro",
          model: "qwen/qwen-2.5-coder-32b-instruct (Grátis)",
          instructions: "Escrever código limpo, comentado, tipado e otimizado com TypeScript.",
          outputFormat: "source_code, imports, complexity",
          x: 520,
          y: 80,
          color: "border-amber-500/30 dark:bg-amber-950/20 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.05)] node-animation-pop",
          status: "warning",
          health: 85
        },
        {
          id: "tester",
          label: "Phi-4 QA",
          role: "Analista de Testes",
          model: "microsoft/phi-4 (Grátis)",
          instructions: "Escrever testes unitários correspondentes no Jest/Vitest e caçar edge cases.",
          outputFormat: "unit_tests, edge_cases_checked",
          x: 520,
          y: 320,
          color: "border-emerald-500/30 dark:bg-emerald-950/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.05)] node-animation-pop",
          status: "warning",
          health: 80
        },
        {
          id: "supervisor",
          label: "DeepSeek R1",
          role: "Revisor Final",
          model: "deepseek/deepseek-r1 (Grátis)",
          instructions: "Audita segurança, vazamento de memória e faz a compilação final.",
          outputFormat: "reviewed_code, status_check, merged",
          x: 770,
          y: 200,
          color: "border-violet-500/30 dark:bg-violet-950/20 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.05)] node-animation-pop",
          status: "success",
          health: 98
        }
      ];

      flowEdges = [
        { from: "brief", to: "architect", label: "especificacao", colorClass: "stroke-sky-500/40" },
        { from: "architect", to: "coder", label: "plano", colorClass: "stroke-rose-500/40" },
        { from: "coder", to: "tester", label: "codigo_fonte", colorClass: "stroke-amber-500/40" },
        { from: "tester", to: "supervisor", label: "codigo_e_testes", colorClass: "stroke-emerald-500/40" }
      ];
    } else {
      // Default Commercial
      flowNodes = [
        {
          id: "brief",
          label: "Objetivo",
          role: "Input Comercial",
          model: "manual (Grátis)",
          instructions: "Objetivo do produto, mercado nichado e orçamento estimado.",
          outputFormat: "target_market, value_prop, goals",
          x: 48,
          y: 200,
          color: "border-sky-500/30 dark:bg-sky-950/20 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.05)] node-animation-pop",
          status: "success",
          health: 100
        },
        {
          id: "creator",
          label: "Hefesto (Criador)",
          role: "Criador Comercial",
          model: "mistralai/mistral-nemo (Grátis)",
          instructions: "Gerar oferta irresistível, roteiro e ângulo de captação de leads.",
          outputFormat: "offer_structure, scripts",
          x: 280,
          y: 80,
          color: "border-amber-500/30 dark:bg-amber-950/20 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.05)] node-animation-pop",
          status: "warning",
          health: 82
        },
        {
          id: "critic",
          label: "Isis (UX)",
          role: "Analista de Risco",
          model: "google/gemini-2.0-flash-thinking-exp (Grátis)",
          instructions: "Identificar termos clichês, propostas fracas e gargalos na jornada do cliente.",
          outputFormat: "risk_points, clarity_score",
          x: 520,
          y: 80,
          color: "border-rose-500/30 dark:bg-rose-950/20 text-rose-200 shadow-[0_0_15px_rgba(239,68,68,0.05)] node-animation-pop",
          status: "success",
          health: 95
        },
        {
          id: "strategy",
          label: "Morax (Copy)",
          role: "Estrategista de CRO",
          model: "meta-llama/llama-3.3-70b-instruct (Grátis)",
          instructions: "Injeta hooks de vídeo de 3s e organiza a prova social acima da dobra.",
          outputFormat: "hooks_list, layout_structure",
          x: 520,
          y: 320,
          color: "border-emerald-500/30 dark:bg-emerald-950/20 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.05)] node-animation-pop",
          status: "warning",
          health: 78
        },
        {
          id: "supervisor",
          label: "Supervisor",
          role: "Síntese Final",
          model: "deepseek/deepseek-r1 (Grátis)",
          instructions: "Gera a oferta lapidada pronta para o checkout e valida o budget de mídia.",
          outputFormat: "final_sales_copy, budget_recommendations",
          x: 770,
          y: 200,
          color: "border-violet-500/30 dark:bg-violet-950/20 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.05)] node-animation-pop",
          status: "success",
          health: 98
        }
      ];

      flowEdges = [
        { from: "brief", to: "creator", label: "briefing", colorClass: "stroke-sky-500/40" },
        { from: "creator", to: "critic", label: "oferta_inicial", colorClass: "stroke-amber-500/40" },
        { from: "creator", to: "strategy", label: "ideias_cro", colorClass: "stroke-amber-500/40" },
        { from: "critic", to: "supervisor", label: "critica_oferta", colorClass: "stroke-rose-500/40" },
        { from: "strategy", to: "supervisor", label: "hooks_comerciais", colorClass: "stroke-emerald-500/40" }
      ];
    }

    setHealthScore(87);

    // Staggered dynamic node insertion with spring cubic-bezier effects!
    let index = 0;
    const interval = setInterval(() => {
      if (index < flowNodes.length) {
        const nodeToAdd = flowNodes[index];
        setNodes((prev) => [...prev, nodeToAdd]);
        setGenerationLogs((prev) => [...prev, `Mapeando nó cooperativo: "${nodeToAdd.label}" instanciado`]);
        index++;
      } else {
        clearInterval(interval);
        setEdges(flowEdges);
        setGenerationLogs((prev) => [...prev, `Fluxo neural estruturado com ${flowEdges.length} conexões ativas!`, "Auto-Construção Finalizada!"]);
        setIsGeneratingFlow(false);
        setAiFlowPrompt("");
        setSelectedId("brief");
      }
    }, 850);
  };

  // --- DEDICATED OPTIMIZER AGENT (HEIMDALL NEURAL OPTIMIZATION ENGINE) ---
  const handleRunOdinOptimization = () => {
    if (optimizerStatus !== "idle") return;

    setOptimizerStatus("diagnosing");
    
    // Simulate diagnosis
    setTimeout(() => {
      setOptimizerStatus("fixing");
      
      // Perform dynamic visual realignment and fix instruction/metrics bottlenecks!
      setTimeout(() => {
        setNodes((current) => 
          current.map((n) => {
            // Realignment (perfect grid snapping + vertical alignment)
            let updatedY = n.y;

            if (n.id === "creator") {
              updatedY = 90;
              return {
                ...n,
                label: "Hefesto Pro",
                instructions: n.instructions + " [OTIMIZADO POR HEIMDALL: Use linguagem direta, de alta conversão, sem chavões genéricos. Foco em escassez e exclusividade.]",
                health: 100,
                status: "success",
                y: updatedY
              };
            }
            if (n.id === "strategy" || n.id === "cro_expert") {
              updatedY = 310;
              return {
                ...n,
                label: n.label + " Optimized",
                instructions: n.instructions + " [OTIMIZADO POR HEIMDALL: Exija CTAs explícitos ao final de cada proposta. Formate links de gatilho em negrito.]",
                health: 100,
                status: "success",
                y: updatedY
              };
            }
            if (n.id === "copywriter") {
              return {
                ...n,
                instructions: n.instructions + " [OTIMIZADO POR HEIMDALL: Formato estruturado modular de alta legibilidade.]",
                health: 99,
                status: "success"
              };
            }
            return { ...n, status: "success", health: 100 };
          })
        );

        setHealthScore(99);
        setOptimizerStatus("completed");
        
        setTimeout(() => {
          setOptimizerStatus("idle");
        }, 3000);
      }, 1800);
    }, 1200);
  };

  // --- SANDBOX EXECUTION (100% FREE MODELS) ---
  const startSandboxExecution = () => {
    if (sandboxStatus === "running") return;
    
    setSandboxStatus("running");
    setCurrentStepIndex(0);

    const initialLogs: SandboxStepLog[] = nodes.map((node) => ({
      nodeId: node.id,
      nodeLabel: node.label,
      modelUsed: node.model.includes("(") ? node.model : `${node.model} (Grátis)`,
      status: "pending",
      output: "",
      tokens: 0,
      cost: 0
    }));
    
    setSandboxLogs(initialLogs);

    // Staggered sandbox pipeline calls
    setTimeout(() => {
      updateStepLog(0, {
        status: "completed",
        tokens: 380,
        cost: 0.0,
        output: JSON.stringify({
          topic: sandboxPrompt,
          tone: "Profissional, focado em alta usabilidade",
          audience: "Usuários finais e operadores de negócios",
          restrictions: "Use somente modelos gratuitos do OpenRouter para economizar créditos."
        }, null, 2)
      });
      
      setCurrentStepIndex(1);
      setTimeout(() => {
        updateStepLog(1, {
          status: "completed",
          tokens: 1420,
          cost: 0.0,
          output: `## RASCUNHO INICIAL DE CONTEÚDO (Gerado via Mistral Nemo)\n\n**Escopo**: Campanha de economia de créditos.\n\n**O Problema**: A maior parte das pessoas consome Claude e GPT-4 para responder a e-mails triviais ou formatar pequenas frases.\n\n**A Solução**: Roteamento Inteligente gratuito do YGGNAROK. Nosso sistema direciona saudações para o Llama 3.2 3B e tarefas de código para o Qwen Coder sem gastar um único centavo.`
        });

        setCurrentStepIndex(2);
        setTimeout(() => {
          updateStepLog(2, {
            status: "completed",
            tokens: 950,
            cost: 0.0,
            output: `## AUDITORIA DE CRÍTICA NEURAL (Gerada via Gemini 2.0 Thinking)\n\n{\n  "pontos_fortes": ["Abordagem clara sobre desperdício de tokens", "Problema muito comum com solução óbvia"],\n  "melhorias_obrigatorias": [\n    "Destacar que o DeepSeek R1 (Lógica complexa) também é 100% gratuito.",\n    "Mostrar a facilidade do switcher visual no topo."\n  ],\n  "nota_assertividade": 9.2\n}`
          });

          setCurrentStepIndex(3);
          setTimeout(() => {
            updateStepLog(3, {
              status: "completed",
              tokens: 1250,
              cost: 0.0,
              output: `## ESTRUTURA CRO & HOOKS COMERCIAIS (Gerada via Llama 3.3 70B):\n\n*   **Hook 1 (3 segundos)**: Você está jogando dinheiro fora no ChatGPT todo mês e eu posso provar.\n*   **Prova Social**: 'Mais de 1,200 criadores e desenvolvedores otimizaram 100% do consumo de API na primeira semana.'\n*   **Chamada de Ação (CTA)**: 'Inicie sua orquestra de agentes sem gastar nada. Clique abaixo.'`
            });

            setCurrentStepIndex(4);
            setTimeout(() => {
              updateStepLog(4, {
                status: "completed",
                tokens: 2400,
                cost: 0.0,
                output: `## ENTREGA CONSOLIDADA FINAL (Gerada via DeepSeek R1)\n\n**Título**: Pare de desperdiçar dinheiro com IAs genéricas. Conheça a Orquestra YGGNAROK.\n\n**Conteúdo**: Economizar em APIs de inteligência artificial não significa usar modelos piores. Significa usar o modelo certo para a tarefa certa de forma automática. O YGGNAROK OS direciona seus chats triviais para o Llama 3.2 e códigos pesados para o Qwen Coder de forma 100% gratuita.\n\n**Onde a mágica acontece**:\n➔ Switcher visual de setor inteligente (Criação, Vendas, Operação).\n➔ Roteador automático de custos em milissegundos.\n\n**Status final**: PRODUTO APROVADO PARA PUBLICAÇÃO.`
              });

              setSandboxStatus("completed");
              setCurrentStepIndex(-1);
            }, 2000);
          }, 2000);
        }, 2000);
      }, 2000);
    }, 1500);
  };

  const updateStepLog = (index: number, patch: Partial<SandboxStepLog>) => {
    setSandboxLogs((current) => 
      current.map((item, idx) => idx === index ? { ...item, ...patch } as SandboxStepLog : item)
    );
  };

  const totalSandboxTokens = sandboxLogs.reduce((sum, item) => sum + item.tokens, 0);

  return (
    <div className="grid min-h-[calc(100vh-6rem)] gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      
      {/* 🚀 INSANELY FLUID CSS KEYFRAMES FOR n8n-STYLE GLOWING PATH PACKETS & SPRING POPUPS */}
      <style>{`
        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(25px);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        .node-animation-pop {
          animation: floatIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* n8n-Style Glowing Packet Flow animation */
        @keyframes strokeFlow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .glowing-edge-pulse {
          stroke-dasharray: 6, 4;
          animation: strokeFlow 0.85s linear infinite;
        }
        
        .grid-bg-overlay {
          background-size: 24px 24px;
          background-image: 
            radial-gradient(circle, rgba(245,158,11,0.02) 1px, transparent 1px);
        }
      `}</style>

      <section className="relative overflow-hidden rounded-2xl border border-brand/20 bg-[#0a0a0a] shadow-[0_0_80px_rgba(245,158,11,0.05)] flex flex-col">
        
        {/* Upper Grid toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-brand/10 px-5 py-4 bg-surface/40">
          <div>
            <p className="text-sm font-medium text-brand flex items-center gap-1.5">
              <Zap size={14} className="text-brand animate-pulse" /> YGGNAROK Node Engine v3.0
            </p>
            <h1 className="text-xl font-semibold">Orquestrador Neural Dinâmico</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-xs font-bold text-foreground shadow-sm hover:bg-surface-strong hover:text-brand transition" onClick={addNode}>
              <Plus size={14} /> Novo Node
            </button>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-xs font-bold text-foreground shadow-sm hover:bg-surface-strong hover:text-brand transition">
              <Save size={14} /> Salvar Fluxo
            </button>
          </div>
        </div>

        {/* AI Automatic Staggered Construction input */}
        <div className="bg-surface/10 border-b border-line px-5 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <form onSubmit={handleAutoBuildFlow} className="flex gap-2 flex-grow max-w-xl">
            <input
              type="text"
              placeholder="Construir novo fluxo cooperativo com IA (ex: Crie um fluxo de SEO)..."
              value={aiFlowPrompt}
              onChange={(e) => setAiFlowPrompt(e.target.value)}
              disabled={isGeneratingFlow}
              className="flex-grow rounded-xl border border-line bg-surface-strong/30 px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isGeneratingFlow || !aiFlowPrompt.trim()}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 px-4 text-xs font-bold shadow-md shadow-brand/10 transition disabled:opacity-50"
            >
              {isGeneratingFlow ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              Sintetizar
            </button>
          </form>

          {/* Quick Flow Logs / Status */}
          {generationLogs.length > 0 ? (
            <div className="text-[10px] font-mono text-muted bg-surface/50 border border-line px-3 py-1.5 rounded-lg flex items-center gap-1.5 max-w-xs truncate">
              <span className="size-1.5 rounded-full bg-brand animate-ping" />
              <span>{generationLogs[generationLogs.length - 1]}</span>
            </div>
          ) : (
            <div className="text-[10px] text-muted flex items-center gap-1">
              <Cpu size={12} className="text-brand/60" /> Mapeamento neural em idle
            </div>
          )}
        </div>

        {/* Canvas area (n8n inspired grid styling) */}
        <div className="relative h-[580px] min-w-[940px] overflow-auto bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[size:24px_24px] bg-[#0a0a0a] flex-grow">
          
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 980 580" aria-hidden="true">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,5 L8,2.5 z" className="fill-neutral-700 dark:fill-neutral-500" />
              </marker>
            </defs>
            {edges.map((edge) => {
              const from = nodeMap.get(edge.from);
              const to = nodeMap.get(edge.to);
              if (!from || !to) return null;
              
              const x1 = from.x + 168;
              const y1 = from.y + 50;
              const x2 = to.x;
              const y2 = to.y + 50;
              const mid = Math.max(48, Math.abs(x2 - x1) / 2);

              return (
                <g key={`${edge.from}-${edge.to}`} className="transition duration-500">
                  {/* Base visual wire */}
                  <path
                    d={`M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`}
                    className="fill-none stroke-neutral-300 dark:stroke-neutral-800/80 transition duration-500"
                    strokeWidth="3.5"
                  />
                  {/* n8n Glowing Data Packet Overlay Animation */}
                  <path
                    d={`M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`}
                    className={`fill-none glowing-edge-pulse ${edge.colorClass} transition duration-500`}
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                  <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} className="fill-neutral-500 text-[9px] font-mono dark:fill-neutral-400">{edge.label}</text>
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => (
            <button
              key={node.id}
              type="button"
              className={[
                "absolute h-[100px] w-[168px] rounded-xl border p-3 text-left shadow-lg transition-all duration-300 backdrop-blur-md bg-neutral-900/90 node-animation-pop hover:scale-[1.05] hover:border-brand/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
                node.color,
                selected.id === node.id ? "scale-[1.05] ring-2 ring-brand border-brand shadow-[0_0_30px_rgba(245,158,11,0.3)] bg-neutral-900/100 z-10" : "",
              ].join(" ")}
              style={{ left: node.x, top: node.y }}
              onClick={() => setSelectedId(node.id)}
            >
              {/* Top Node Info */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <CircleDot size={12} className={node.status === "warning" ? "text-amber-500 animate-pulse" : "text-emerald-500"} />
                  <span className="truncate text-xs font-bold tracking-tight text-foreground">{node.label}</span>
                </div>
                
                {/* Health Score indicator badge */}
                <span className={`text-[8px] font-bold px-1 rounded ${
                  node.health > 90 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                }`}>
                  {node.health}%
                </span>
              </div>
              
              <p className="mt-1.5 truncate text-[10px] font-bold opacity-75">{node.role}</p>
              <p className="mt-0.5 line-clamp-2 text-[9px] leading-relaxed opacity-60 text-muted-foreground">{node.instructions}</p>
            </button>
          ))}
        </div>
      </section>

      {/* RIGHT SIDEBAR: SPLIT EDITOR + HEIMDALL NEURAL OPTIMIZER */}
      <aside className="space-y-4 flex flex-col justify-between h-full">
        
        {/* Editor panel */}
        <div className="rounded-2xl border border-line bg-surface/50 p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-slate-950 text-amber-300 dark:bg-amber-300 dark:text-neutral-950">
              <Brain size={16} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground">Editor do Node</p>
              <p className="truncate text-[10px] text-stone-500 font-mono">{selected?.id || "Nenhum"}</p>
            </div>
          </div>

          {selected && (
            <div className="space-y-3">
              <Field label="Nome"><input className={inputClass} value={selected.label} onChange={(event) => updateSelected({ label: event.target.value })} /></Field>
              <Field label="Papel"><input className={inputClass} value={selected.role} onChange={(event) => updateSelected({ role: event.target.value })} /></Field>
              <Field label="Modelo"><input className={inputClass} value={selected.model} onChange={(event) => updateSelected({ model: event.target.value })} /></Field>
              <Field label="Instruções"><textarea className={textareaClass} value={selected.instructions} onChange={(event) => updateSelected({ instructions: event.target.value })} /></Field>
            </div>
          )}
        </div>

        {/* 🧠 DEDICATED OPTIMIZER AGENT: HEIMDALL ENGINE (VOID & AMBER) */}
        <div className="rounded-lg border border-brand/20 bg-brand/5 p-5 shadow-lg backdrop-blur space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 size-20 bg-brand/5 blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="text-brand size-4 animate-spin-slow" />
              <span className="text-xs font-bold text-foreground">Heimdall Optimizer</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              healthScore > 95 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}>
              Score: {healthScore}%
            </span>
          </div>

          {/* Active Diagnosed Bottlenecks */}
          <div className="space-y-2">
            <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Diagnóstico de Gargalos</p>
            {bottlenecks.length === 0 ? (
              <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-[10px] text-emerald-400 flex items-center gap-2">
                <Check size={12} />
                <span>Fluxo 100% otimizado. Sem gargalos detectados!</span>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {bottlenecks.map((b) => (
                  <div key={b.id} className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-2 text-[9px] text-amber-200 flex items-start gap-1.5 leading-normal">
                    <ShieldAlert size={12} className="text-brand shrink-0 mt-0.5" />
                    <span><strong>{b.label}</strong>: {b.issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Optimization execution button */}
          <button
            type="button"
            onClick={handleRunOdinOptimization}
            disabled={optimizerStatus !== "idle" || bottlenecks.length === 0}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 py-2.5 text-xs font-bold transition disabled:opacity-50 shadow-md shadow-brand/10"
          >
            {optimizerStatus === "diagnosing" ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Diagnosticando...
              </>
            ) : optimizerStatus === "fixing" ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Refatorando Nodes...
              </>
            ) : optimizerStatus === "completed" ? (
              <>
                <Check size={13} />
                Friction Resolved!
              </>
            ) : (
              <>
                <Zap size={13} />
                Auto-Corrigir Gargalos
              </>
            )}
          </button>
        </div>

        {/* Global studio actions */}
        <div className="space-y-4">
          <div className="grid gap-3">
            <button 
              type="button" 
              onClick={() => {
                setSandboxPrompt("Crie uma campanha de marketing para o YGGNAROK OS");
                setShowSandbox(true);
              }} 
              className={buttonClass}
            >
              <Sparkles size={16} className="mr-2" /> Testar fluxo
            </button>
            <button type="button" className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-950/40 dark:text-stone-200" onClick={removeSelected}>
              <Trash2 size={16} className="mr-2" /> Remover node
            </button>
          </div>

          <div className="grid gap-3 text-xs text-slate-600 dark:text-stone-300">
            <Status icon={<GitBranch size={16} />} text={`${nodes.length} nodes no fluxo`} />
            <Status icon={<ShieldCheck size={16} />} text="Autogestão de custos ativa" />
          </div>
        </div>
      </aside>

      {/* STUNNING WEB SANDBOX PIPELINE SIMULATOR MODAL */}
      {showSandbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-brand/20 bg-neutral-950 shadow-[0_0_50px_rgba(245,158,11,0.1)] text-foreground overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div className="flex items-center gap-2">
                <Layers className="text-brand size-5" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Sandbox de Execução Neural (100% Grátis)</h3>
                  <p className="text-[10px] text-muted">Testes ilimitados rodando exclusivamente em modelos open-source livres</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setShowSandbox(false);
                  setSandboxStatus("idle");
                }}
                className="size-7 rounded-lg text-muted hover:bg-surface/50 hover:text-foreground flex items-center justify-center transition"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Content Split */}
            <div className="flex-grow overflow-y-auto p-6 grid gap-6 md:grid-cols-[280px_1fr]">
              
              {/* Left Column: Config Panel */}
              <div className="space-y-4 border-r border-line/50 pr-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Objetivo do Teste (Prompt)</label>
                    <textarea
                      rows={4}
                      value={sandboxPrompt}
                      onChange={(e) => setSandboxPrompt(e.target.value)}
                      disabled={sandboxStatus === "running"}
                      placeholder="O que os agentes devem realizar..."
                      className="w-full rounded-xl border border-line bg-surface/30 px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={startSandboxExecution}
                    disabled={sandboxStatus === "running" || !sandboxPrompt.trim() || nodes.length === 0}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand hover:bg-brand-strong text-neutral-950 py-3 text-xs font-bold transition disabled:opacity-50 shadow-md shadow-brand/10"
                  >
                    {sandboxStatus === "running" ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Play size={13} />
                        Iniciar Pipeline
                      </>
                    )}
                  </button>
                </div>

                {/* Costs estimation panel */}
                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-3 relative overflow-hidden">
                  <div className="absolute right-0 top-0 size-16 bg-emerald-500/5 blur-xl pointer-events-none" />
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={11} /> Filtro Financeiro Ativo
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[9px] text-muted">Tokens Consumidos</p>
                      <p className="font-bold text-foreground mt-0.5">{totalSandboxTokens} tkn</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted">Orçamento Restante</p>
                      <p className="font-bold text-emerald-400 mt-0.5">$0.000 USD</p>
                    </div>
                  </div>
                  <div className="rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-500 font-bold px-2 py-1 text-center">
                    100% de Economia (Modelos Free)
                  </div>
                </div>
              </div>

              {/* Right Column: Execution steps logs output */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Fluxo Operacional de Execução</span>

                {sandboxLogs.length === 0 ? (
                  <div className="h-48 rounded-xl border border-line border-dashed flex flex-col items-center justify-center text-center text-xs text-muted">
                    <Play className="size-8 text-line mb-2" />
                    Pressione &quot;Iniciar Pipeline&quot; para rodar o fluxo
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sandboxLogs.map((log, idx) => (
                      <div 
                        key={log.nodeId} 
                        className={`rounded-xl border p-4 transition duration-200 ${
                          currentStepIndex === idx 
                            ? "border-brand bg-brand/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]" 
                            : log.status === "completed"
                            ? "border-line bg-surface/10"
                            : "border-line/40 bg-surface/5 opacity-55"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                          <div className="flex items-center gap-2">
                            {log.status === "completed" ? (
                              <span className="size-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                <Check size={9} />
                              </span>
                            ) : currentStepIndex === idx ? (
                              <span className="size-4 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 border border-brand/20">
                                <Loader2 size={9} className="animate-spin" />
                              </span>
                            ) : (
                              <span className="size-4 rounded-full bg-surface-strong/50 text-muted flex items-center justify-center shrink-0 border border-line">
                                <CircleDot size={8} />
                              </span>
                            )}
                            <span className="text-xs font-bold text-foreground">{log.nodeLabel}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="font-mono text-muted bg-surface/50 px-1.5 py-0.5 rounded border border-line">{log.modelUsed}</span>
                            {log.status === "completed" && (
                              <span className="text-emerald-500 font-bold">GRÁTIS</span>
                            )}
                          </div>
                        </div>

                        {log.status === "completed" ? (
                          <div className="rounded bg-neutral-900/80 p-3 font-mono text-[10px] text-stone-300 border border-line/40 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48">
                            {log.output}
                          </div>
                        ) : currentStepIndex === idx ? (
                          <p className="text-[10px] text-brand/80 animate-pulse font-mono">Agente executando cadeia de raciocínio lógico...</p>
                        ) : (
                          <p className="text-[10px] text-muted/65 font-mono">Aguardando término dos nós predecessores...</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-line px-6 py-4 bg-surface/10">
              <button
                type="button"
                onClick={() => {
                  setShowSandbox(false);
                  setSandboxStatus("idle");
                }}
                className="rounded-lg border border-line px-4 py-2 text-xs font-bold text-muted hover:text-foreground transition"
              >
                Fechar Sandbox
              </button>
            </div>
            
          </div>
        </div>
      )}

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
