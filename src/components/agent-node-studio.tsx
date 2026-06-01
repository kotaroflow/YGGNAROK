"use client";

import { useMemo, useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, Html, QuadraticBezierLine, Stars, Sparkles as DreiSparkles } from "@react-three/drei";
import * as THREE from "three";
import { 
  Brain, CircleDot, GitBranch, Plus, Save, ShieldCheck, 
  Sparkles, Trash2, Play, Loader2, Check, X, 
  Layers, ShieldAlert, Cpu, RefreshCw, Zap
} from "lucide-react";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";
import { useTheme } from "./theme-toggle";

type AgentNode = {
  id: string;
  label: string;
  role: string;
  model: string;
  instructions: string;
  outputFormat: string;
  phi: number;
  theta: number;
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
    phi: 0.15,
    theta: -2.6,
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
    phi: 0.55,
    theta: -1.9,
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
    phi: 0.55,
    theta: -1.2,
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
    phi: 0.15,
    theta: -1.57,
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
    phi: 0.15,
    theta: -0.5,
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

function FullGlobe({ nodes, edges, selectedId, onNodePointerDown, setIsInteracting }: { nodes: AgentNode[], edges: AgentEdge[], selectedId: string, onNodePointerDown: (id: string) => void, setIsInteracting: (val: boolean) => void }) {
  // Apontando para o arquivo neural-bg.png que contém a Miku Hacker!
  const texture = useTexture("/neural-bg.png");
  const R = 2.6; // Slightly larger than globe radius for pins
  
  return (
    <group>
      <mesh>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          map={texture} 
          roughness={0.2} 
          metalness={0.8}
        />
      </mesh>
      
      {/* 3D Neural Edges */}
      {edges.map((edge, idx) => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return null;
        
        const x1 = R * Math.cos(fromNode.phi) * Math.cos(fromNode.theta);
        const y1 = R * Math.cos(fromNode.phi) * Math.sin(fromNode.theta);
        const z1 = -R * Math.sin(fromNode.phi);
        
        const x2 = R * Math.cos(toNode.phi) * Math.cos(toNode.theta);
        const y2 = R * Math.cos(toNode.phi) * Math.sin(toNode.theta);
        const z2 = -R * Math.sin(toNode.phi);
        
        // Midpoint pushed out for a curved arc over the planet
        const mx = (x1 + x2) / 2 * 1.2;
        const my = (y1 + y2) / 2 * 1.2;
        const mz = (z1 + z2) / 2 * 1.2;

        return (
          <QuadraticBezierLine
            key={`${edge.from}-${edge.to}-${idx}`}
            start={[x1, y1, z1]}
            end={[x2, y2, z2]}
            mid={[mx, my, mz]}
            color={edge.colorClass.includes("amber") ? "#f59e0b" : edge.colorClass.includes("rose") ? "#ef4444" : edge.colorClass.includes("emerald") ? "#10b981" : "#38bdf8"}
            lineWidth={2}
            dashed={false}
          />
        );
      })}

      {/* 3D HTML Pins */}
      {nodes.map(node => {
        const x = R * Math.cos(node.phi) * Math.cos(node.theta);
        const y = R * Math.cos(node.phi) * Math.sin(node.theta);
        const z = -R * Math.sin(node.phi);
        const isSelected = selectedId === node.id;

        return (
          <Html key={node.id} position={[x, y, z]} center zIndexRange={[100, 0]} occlude="blending">
            <div
              className={`relative flex flex-col items-center justify-center group cursor-pointer transition-all duration-300 ${
                isSelected ? "scale-110" : "hover:scale-105"
              }`}
              onPointerDown={(e) => {
                e.stopPropagation();
                onNodePointerDown(node.id);
              }}
              onPointerEnter={() => setIsInteracting(true)}
              onPointerLeave={() => setIsInteracting(false)}
            >
              <div className={`relative flex items-center justify-center size-10 rounded-full border-2 backdrop-blur-sm ${
                isSelected 
                  ? "border-brand bg-brand/20 shadow-[0_0_20px_rgba(245,158,11,0.5)]" 
                  : "border-brand/40 bg-black/40 group-hover:border-brand"
              }`}>
                {/* Inner core pulsing indicator */}
                <div className={`size-3 rounded-full animate-pulse ${
                  node.status === "warning" ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]" : "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                }`} />

                {/* Miniature health ring border using circular SVG gauge */}
                <svg className="absolute inset-0 size-full -rotate-90 p-0.5 pointer-events-none">
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    stroke={node.status === "warning" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)"}
                    strokeWidth="1.5"
                  />
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    stroke={node.status === "warning" ? "#f59e0b" : "#10b981"}
                    strokeWidth="1.5"
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={2 * Math.PI * 16 * (1 - node.health / 100)}
                  />
                </svg>
              </div>

              {/* Clean text label attached below the node */}
              <div className={`mt-2 px-2 py-0.5 whitespace-nowrap rounded-md border text-[10px] font-bold font-mono tracking-wide transition-all duration-300 ${
                isSelected
                  ? "bg-brand text-neutral-950 border-brand shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                  : "bg-surface-strong/90 text-foreground border-line group-hover:border-brand/50 group-hover:text-brand"
              }`}>
                {node.label}
              </div>
            </div>
          </Html>
        );
      })}
    </group>
  );
}

export function AgentNodeStudio() {
  const [theme] = useTheme();
  const [nodes, setNodes] = useState<AgentNode[]>(initialNodes);
  const [edges, setEdges] = useState<AgentEdge[]>(initialEdges);
  const [selectedId, setSelectedId] = useState("creator");
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0];
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const [isInteracting, setIsInteracting] = useState(false);

  // === 3D Parallax & Drag State ===
  const [canvasRotation, setCanvasRotation] = useState({ x: 20, y: -10 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // ResizeObserver for absolute node styling and SVG paths
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 580 });
  
  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  const R = 280; // Planet radius
  
  // Calculate projected node coordinates in 3D space
  const projectedNodes = useMemo(() => {
    const map = new Map<string, { x: number; y: number; z: number; visible: boolean }>();
    const pitch = (canvasRotation.x * Math.PI) / 180;
    const yaw = (canvasRotation.y * Math.PI) / 180;
    const cx = containerSize.width / 2;
    const cy = containerSize.height / 2 + 100; // Shift down to match planet equator center

    nodes.forEach(node => {
      // 3D position on hemisphere surface
      const px = R * Math.cos(node.phi) * Math.cos(node.theta);
      const py = -R * Math.sin(node.phi);
      const pz = R * Math.cos(node.phi) * Math.sin(node.theta);

      // Rotate Y (Yaw)
      const x1 = px * Math.cos(yaw) - pz * Math.sin(yaw);
      const z1 = px * Math.sin(yaw) + pz * Math.cos(yaw);

      // Rotate X (Pitch)
      const y2 = py * Math.cos(pitch) - z1 * Math.sin(pitch);
      const z2 = py * Math.sin(pitch) + z1 * Math.cos(pitch);

      // Perspective scale
      const D = 600;
      const scale = D / (D + z2);

      map.set(node.id, {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        z: z2,
        visible: z2 > -R * 1.5
      });
    });
    return map;
  }, [nodes, canvasRotation, containerSize]);

  const handlePointerMove = (e: React.PointerEvent) => {
    // 3D Rotation via Middle Mouse Button (buttons === 4)
    if (e.buttons === 4 && canvasRef.current) {
      e.preventDefault();
      const rect = canvasRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 8;
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 8;
      
      setCanvasRotation({ x: rotateX + 15, y: rotateY });
      return;
    }

    // Node Dragging Logic (gliding along Hatsune Miku planet surface!)
    if (!draggingNodeId || !canvasRef.current) return;
    
    const deltaX = e.movementX;
    const deltaY = e.movementY;

    setNodes(prev => prev.map(node => {
      if (node.id !== draggingNodeId) return node;
      
      let newTheta = node.theta + deltaX * 0.005;
      let newPhi = node.phi - deltaY * 0.005;

      // Clamping limits to keep nodes on upper hemisphere of Hatsune Miku planet
      if (newPhi < 0.05) newPhi = 0.05;
      if (newPhi > Math.PI / 2 - 0.05) newPhi = Math.PI / 2 - 0.05;

      if (newTheta > Math.PI) newTheta -= Math.PI * 2;
      if (newTheta < -Math.PI) newTheta += Math.PI * 2;

      return { ...node, phi: newPhi, theta: newTheta };
    }));
  };

  const handlePointerDown = (e: React.PointerEvent, nodeId: string) => {
    if (e.button === 1) return; // Ignore middle click for dragging
    e.preventDefault();
    setDraggingNodeId(nodeId);
    setSelectedId(nodeId);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

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
      phi: 0.35,
      theta: 0.1,
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
          phi: 0.15,
          theta: -2.6,
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
          phi: 0.55,
          theta: -1.9,
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
          phi: 0.55,
          theta: -1.2,
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
          phi: 0.15,
          theta: -1.57,
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
          phi: 0.15,
          theta: -0.5,
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
          phi: 0.15,
          theta: -2.6,
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
          phi: 0.55,
          theta: -1.9,
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
          phi: 0.55,
          theta: -1.2,
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
          phi: 0.15,
          theta: -1.57,
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
          phi: 0.15,
          theta: -0.5,
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
          phi: 0.15,
          theta: -2.6,
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
          phi: 0.55,
          theta: -1.9,
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
          phi: 0.55,
          theta: -1.2,
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
          phi: 0.15,
          theta: -1.57,
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
          phi: 0.15,
          theta: -0.5,
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
            if (n.id === "creator") {
              return {
                ...n,
                label: "Hefesto Pro",
                instructions: n.instructions + " [OTIMIZADO POR HEIMDALL: Use linguagem direta, de alta conversão, sem chavões genéricos. Foco em escassez e exclusividade.]",
                health: 100,
                status: "success",
                phi: 0.50
              };
            }
            if (n.id === "strategy" || n.id === "cro_expert") {
              return {
                ...n,
                label: n.label + " Optimized",
                instructions: n.instructions + " [OTIMIZADO POR HEIMDALL: Exija CTAs explícitos ao final de cada proposta. Formate links de gatilho em negrito.]",
                health: 100,
                status: "success",
                phi: 0.15
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

      <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/30 shadow-sm flex flex-col">
        
        {/* Upper Grid toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-line px-5 py-4 bg-surface/40">
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
 
        <div className="relative h-[580px] overflow-hidden bg-black flex-grow flex items-center justify-center cursor-move">
          <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
            {/* Deep Space Background with True Depth (Fog) */}
            <color attach="background" args={['#010204']} />
            <fog attach="fog" args={['#010204', 8, 40]} />
            
            {/* Distant Galaxy Layers: Radius is high so stars don't block the foreground planet! */}
            <Stars radius={35} depth={50} count={5000} factor={2} saturation={0.5} fade speed={0.5} />
            <Stars radius={45} depth={60} count={2000} factor={5} saturation={1} fade speed={1.2} />
            
            {/* Simulated Meteors / Constellation Dust (pushed far back on Z axis) */}
            <DreiSparkles count={30} scale={40} size={5} speed={3} opacity={0.8} color="#2dd4bf" position={[0, 0, -15]} />
            <DreiSparkles count={20} scale={50} size={3} speed={5} opacity={0.5} color="#f59e0b" position={[0, 0, -25]} />

            {/* Premium Cinematic Lighting (High Contrast) */}
            <ambientLight intensity={0.2} color="#0f172a" /> {/* Very dark ambient for dramatic shadows */}
            
            {/* Key Light (Sun) */}
            <directionalLight position={[12, 10, 8]} intensity={2.5} color="#ffffff" />
            
            {/* Rim Lights (Bounces off the dark side of the planet) */}
            <directionalLight position={[-10, 5, -12]} intensity={4} color="#2dd4bf" /> {/* Teal Miku Glow */}
            <directionalLight position={[10, -10, -12]} intensity={3} color="#f59e0b" /> {/* Amber Yggnarok Glow */}
            
            <Suspense fallback={null}>
              <FullGlobe nodes={nodes} edges={edges} selectedId={selectedId} onNodePointerDown={setSelectedId} setIsInteracting={setIsInteracting} />
            </Suspense>

            {/* OrbitControls: Super slow majestic rotation (0.05) */}
            <OrbitControls 
              enableZoom={true} 
              enablePan={false} 
              autoRotate={!isInteracting} 
              autoRotateSpeed={0.05} 
              minDistance={3}
              maxDistance={12}
            />
          </Canvas>
        </div>
      </section>
 
      {/* RIGHT SIDEBAR: SPLIT EDITOR + HEIMDALL NEURAL OPTIMIZER */}
      <aside className="space-y-4 flex flex-col justify-between h-full">
        
        {/* Editor panel */}
        <div className="rounded-2xl border border-line bg-surface/50 p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-brand text-neutral-950">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-line bg-surface-strong shadow-xl text-foreground overflow-hidden">
            
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
