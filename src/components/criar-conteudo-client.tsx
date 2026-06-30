"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import {
  Lightbulb, Brain, Send, Sparkles,
  Wand2, Layers, CheckCircle, Film, Play, Sliders, AlertTriangle,
  Trash2, ShieldAlert, Cpu, HelpCircle, Video, Scissors,
  Music, Radio, Star, Award, Heart, MessageSquare, RefreshCw, Plus, X, FileText, Image as ImageIcon, Check,
  MoreVertical, Copy, RotateCcw, Loader2, Search, Zap, ChevronRight, ChevronLeft, AtSign, Library, Archive,
  ScrollText, Subtitles, Hash, Globe, Settings, Terminal, Share2, ZoomIn, ZoomOut
} from "lucide-react";
import { inputClass } from "@/components/field";
import { useN8n } from "@/hooks/useN8n";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { YggNode, YggNodeType, ConnectionType, User } from "@/types/yggnarok";

type Profile = {
  id: string;
  name: string;
};

type EtapaFluxo = "ideia" | "roteiro" | "legenda" | "hashtag" | "publicacao";
type ContentOrigem = "manual" | "hefesto" | "amber" | "openrouter" | "local" | "sistema";

type ContentItem = {
  id: string;
  profile_id: string;
  title: string;
  content_type: string;
  platform: string;
  idea: string;
  status: string;
  created_at: string;
  etapa_fluxo?: EtapaFluxo;
  origem?: ContentOrigem;
  agente_executor?: string;
};

type ReferenceAsset = {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "doc";
  size: string;
  status: "uploading" | "completed";
  progress: number;
};

type CreativeNodeType = "image" | "video" | "prompt" | "chat" | "campaign" | "project" | "reference" | "idea" | "script";

type CreativeNode = {
  id: string;
  type: CreativeNodeType;
  title: string;
  x: number;
  y: number;
  content: string;
  tags: string[];
  source: string;
  status: string;
  archived?: boolean;
  meta: {
    preview?: string;
    duration?: string;
    platform?: string;
    model?: string;
    persona?: string;
    progress?: number;
    deadline?: string;
    history?: string;
    messages?: { sender: "user" | "ai"; text: string }[];
  };
  related: string[];
};

type CreativeEdge = {
  id: string;
  source: string;
  target: string;
};

type VideoStylePreset = {
  name: string;
  duration: string;
  trendingMusic: string[];
  trendingTransitions: string[];
  mostSearched: string[];
  baseDirectives: string;
  isCustom?: boolean;
};

type CriarConteudoClientProps = {
  profiles: Profile[];
  initialContents: ContentItem[];
  activeTab: string;
};

const CONTENT_TYPES = [
  { value: "ideia", label: "Ideia" },
  { value: "reel", label: "Reel" },
  { value: "shorts", label: "Shorts" },
  { value: "carrossel", label: "Carrossel" },
  { value: "post_estatico", label: "Post Estático" },
  { value: "story", label: "Story" },
  { value: "thread", label: "Thread" },
  { value: "artigo", label: "Artigo" },
  { value: "script_video", label: "Script de Vídeo" },
  { value: "campanha", label: "Campanha" },
];

const CHANNELS = [
  "Instagram", "YouTube", "TikTok", "LinkedIn", "X/Twitter", "Pinterest", "Blog", "Multicanal"
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  rascunho:    { label: "Rascunho",     color: "text-neutral-400", bg: "bg-neutral-900/60 border-neutral-800" },
  na_fila:     { label: "Na fila",      color: "text-amber-400",   bg: "bg-amber-950/20 border-amber-500/20" },
  processando: { label: "Processando",  color: "text-sky-400",     bg: "bg-sky-950/20 border-sky-500/20" },
  em_revisao:  { label: "Em revisão",   color: "text-orange-400",  bg: "bg-orange-950/20 border-orange-500/20" },
  pronto:      { label: "Pronto",       color: "text-emerald-400", bg: "bg-emerald-950/20 border-emerald-500/20" },
  erro:        { label: "Erro",         color: "text-rose-400",    bg: "bg-rose-950/20 border-rose-500/20" },
  idea:        { label: "Rascunho",     color: "text-neutral-400", bg: "bg-neutral-900/60 border-neutral-800" },
  Pendente:    { label: "Rascunho",     color: "text-neutral-400", bg: "bg-neutral-900/60 border-neutral-800" },
};

const ETAPA_CONFIG: Record<string, { label: string; icon: typeof Lightbulb }> = {
  ideia:      { label: "Ideia",      icon: Lightbulb },
  roteiro:    { label: "Roteiro",    icon: ScrollText },
  legenda:    { label: "Legenda",    icon: Subtitles },
  hashtag:    { label: "Hashtag",    icon: Hash },
  publicacao:  { label: "Publicação", icon: Send },
};

const DEMO_CONTENTS: ContentItem[] = [
  { id: "demo-1", profile_id: "", title: "Estratégia de Lançamento Q3", content_type: "campanha", platform: "Multicanal", idea: "Campanha integrada para lançamento do produto principal no terceiro trimestre, com foco em topo de funil.", status: "pronto", created_at: new Date(Date.now() - 86400000).toISOString(), etapa_fluxo: "roteiro", origem: "hefesto" },
  { id: "demo-2", profile_id: "", title: "Reels Topo de Funil — Engenharia de Prompt", content_type: "reel", platform: "Instagram", idea: "Série de 5 reels curtos mostrando técnicas de prompt engineering para iniciantes.", status: "processando", created_at: new Date(Date.now() - 172800000).toISOString(), etapa_fluxo: "ideia", origem: "manual" },
  { id: "demo-3", profile_id: "", title: "Sequência de Posts — IAs Gratuitas", content_type: "carrossel", platform: "Instagram", idea: "Carrossel educativo comparando 5 IAs gratuitas com alto desempenho para criadores de conteúdo.", status: "rascunho", created_at: new Date(Date.now() - 259200000).toISOString(), etapa_fluxo: "ideia", origem: "manual" },
];

const CREATIVE_NODE_WIDTH = 240;
const CREATIVE_NODE_PORT_Y = 46;

const CREATIVE_NODE_META: Record<CreativeNodeType, { label: string; icon: typeof FileText; tone: string }> = {
  image: { label: "Imagem", icon: ImageIcon, tone: "border-brand/30 bg-brand/10 text-brand" },
  video: { label: "Vídeo", icon: Video, tone: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-300 dark:bg-rose-950/30" },
  prompt: { label: "Prompt", icon: Sparkles, tone: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300 dark:bg-violet-950/30" },
  chat: { label: "Chat", icon: MessageSquare, tone: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-300 dark:bg-sky-950/30" },
  campaign: { label: "Campanha", icon: Award, tone: "border-brand/35 bg-brand/10 text-brand dark:bg-amber-950/30" },
  project: { label: "Projeto", icon: Layers, tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 dark:bg-emerald-950/30" },
  reference: { label: "Referência", icon: Library, tone: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 dark:bg-indigo-950/30" },
  idea: { label: "Ideia", icon: Lightbulb, tone: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-yellow-300 dark:bg-yellow-950/25" },
  script: { label: "Roteiro", icon: ScrollText, tone: "border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-300 dark:bg-orange-950/25" },
};

const INITIAL_CREATIVE_NODES: CreativeNode[] = [
  {
    id: "image-01",
    type: "image",
    title: "Rainha Sombria",
    x: 40,
    y: 64,
    content: "Referência visual principal para atmosfera de mistério, ouro escuro e presença lendária.",
    tags: ["#referência", "#visual", "#dark-fantasy"],
    source: "Moodboard YGN",
    status: "Referência ativa",
    meta: { preview: "Luz âmbar, silhueta nobre, contraste alto." },
    related: ["Prompt — Dark fantasy queen", "Roteiro — Gancho Viral"],
  },
  {
    id: "prompt-01",
    type: "prompt",
    title: "Dark Fantasy Queen",
    x: 320,
    y: 64,
    content: "Dark fantasy queen, golden lighting, ultra detailed, cinematic mood, sacred artifact atmosphere.",
    tags: ["#prompt", "#midjourney", "#visual"],
    source: "Midjourney v6",
    status: "Pronto para reuso",
    meta: { model: "Midjourney v6", history: "Usado 12 vezes em variações visuais." },
    related: ["Rainha Sombria", "Moodboard — Inspiração Visual"],
  },
  {
    id: "chat-01",
    type: "chat",
    title: "Conversa Kotaro IA",
    x: 600,
    y: 64,
    content: "Sugere variações com emoção, mistério e foco em campanha de lançamento.",
    tags: ["#chat", "#direção", "#ia"],
    source: "Kotaro IA",
    status: "Contexto vivo",
    meta: { 
      persona: "Kotaro IA", 
      history: "Conversa ligada ao conceito central.",
      messages: [
        { sender: "user", text: "Kotaro, como podemos estruturar o tom de mistério?" },
        { sender: "ai", text: "Recomendo começar com uma pergunta provocativa, usando imagens com contraste alto e tons dourados/âmbar." }
      ]
    },
    related: ["Prompt — Dark Fantasy Queen", "Campanha YGN Ascensão"],
  },
  {
    id: "script-01",
    type: "script",
    title: "Gancho Viral",
    x: 320,
    y: 280,
    content: "Eles não querem que você saiba disso... mas mudou meu jogo completamente.",
    tags: ["#roteiro", "#shorts", "#retenção"],
    source: "Creative Vault",
    status: "Em refinamento",
    meta: { platform: "Shorts / Reels / TikTok" },
    related: ["Conversa Kotaro IA", "Campanha YGN Ascensão"],
  },
  {
    id: "campaign-01",
    type: "campaign",
    title: "Campanha YGN Ascensão",
    x: 600,
    y: 280,
    content: "Campanha completa para lançamento YGN Ascensão. Foco em storytelling, mistério e transformação.",
    tags: ["#campanha", "#lançamento", "#high-ticket"],
    source: "Creation Nexus",
    status: "78% estruturada",
    meta: { progress: 78, deadline: "28/11/2026", platform: "Multicanal" },
    related: ["Rainha Sombria", "Gancho Viral", "Conversa Kotaro IA"],
  },
];

const INITIAL_CREATIVE_EDGES: CreativeEdge[] = [
  { id: "e-image-prompt", source: "image-01", target: "prompt-01" },
  { id: "e-prompt-chat", source: "prompt-01", target: "chat-01" },
  { id: "e-chat-script", source: "chat-01", target: "script-01" },
  { id: "e-script-campaign", source: "script-01", target: "campaign-01" },
  { id: "e-chat-campaign", source: "chat-01", target: "campaign-01" },
];

const getClosestPorts = (
  source: { x: number; y: number },
  target: { x: number; y: number },
  width = 240,
  height = 140
) => {
  const sourcePorts = [
    { x: source.x + width / 2, y: source.y }, // Top
    { x: source.x + width, y: source.y + height / 2 }, // Right
    { x: source.x + width / 2, y: source.y + height }, // Bottom
    { x: source.x, y: source.y + height / 2 } // Left
  ];

  const targetPorts = [
    { x: target.x + width / 2, y: target.y },
    { x: target.x + width, y: target.y + height / 2 },
    { x: target.x + width / 2, y: target.y + height },
    { x: target.x, y: target.y + height / 2 }
  ];

  let bestSource = sourcePorts[1];
  let bestTarget = targetPorts[3];
  let minDist = Infinity;

  for (const sp of sourcePorts) {
    for (const tp of targetPorts) {
      const dx = sp.x - tp.x;
      const dy = sp.y - tp.y;
      const d = dx * dx + dy * dy;
      if (d < minDist) {
        minDist = d;
        bestSource = sp;
        bestTarget = tp;
      }
    }
  }

  return { sourcePoint: bestSource, targetPoint: bestTarget };
};

export function CriarConteudoClient({ profiles, initialContents, activeTab: currentTab }: CriarConteudoClientProps) {
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // System Roles & Connection Style
  const [userRole, setUserRole] = useState<"standard" | "admin">("standard");
  const [showArchivedOnCanvas, setShowArchivedOnCanvas] = useState<boolean>(true);
  const [connectionLineStyle, setConnectionLineStyle] = useState<"straight" | "orthogonal">("straight");
  const [zoomLevel, setZoomLevel] = useState(1);

  // Search & Filtration on Canvas
  const [canvasSearchQuery, setCanvasSearchQuery] = useState("");
  const [selectedNodeTypeFilter, setSelectedNodeTypeFilter] = useState("all");

  // Canvas Nodes & Edges State
  const [canvasNodes, setCanvasNodes] = useState<CreativeNode[]>(() => {
    return [
      ...INITIAL_CREATIVE_NODES,
      {
        id: "archived-01",
        type: "idea",
        title: "Ideia Antiga - Post Carrossel",
        x: 100,
        y: 460,
        content: "Post carrossel comparando produtividade com obsidian vs notion.",
        tags: ["#arquivado", "#notion", "#obsidian"],
        source: "Brain dump",
        status: "Arquivado",
        archived: true,
        meta: {},
        related: [],
      },
      {
        id: "archived-02",
        type: "prompt",
        title: "Prompt Velho - DALL-E 2",
        x: 400,
        y: 490,
        content: "Futuristic city neon purple, 3d render retro style.",
        tags: ["#arquivado", "#dalle2"],
        source: "Testes",
        status: "Arquivado",
        archived: true,
        meta: { model: "DALL-E 2" },
        related: [],
      }
    ];
  });
  const [canvasEdges, setCanvasEdges] = useState<CreativeEdge[]>(INITIAL_CREATIVE_EDGES);

  const [selectedCanvasNodeId, setSelectedCanvasNodeId] = useState(INITIAL_CREATIVE_NODES[4]?.id ?? INITIAL_CREATIVE_NODES[0].id);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null);
  const nextCreativeNodeId = useRef(100);
  const nextCreativeEdgeId = useRef(100);

  // Inspector & Interactive Messaging States
  const [chatMessageText, setChatMessageText] = useState("");

  // Creation Console Input Fields
  const [newNodeTitle, setNewNodeTitle] = useState("");
  const [newNodeType, setNewNodeType] = useState<CreativeNodeType>("idea");
  const [newNodeContent, setNewNodeContent] = useState("");
  const [newNodeTags, setNewNodeTags] = useState("");

  // Obsidian note credentials (configurable by Admin)
  const [obsidianVault, setObsidianVault] = useState("Yggnarok");
  const [obsidianPath, setObsidianPath] = useState("creative-nexus/notes");

  // n8n connection details (configurable by Admin)
  const [n8nUrl, setn8nUrl] = useState("https://n8n.yggnarok.internal/webhook/creative");

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRequestRef = useRef<number | null>(null);
  const dragLatestPos = useRef<{ x: number; y: number } | null>(null);

  // Integration hooks
  const { triggerWorkflow } = useN8n();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load user info client-side
  useEffect(() => {
    async function loadUser() {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          id: user.id,
          role: userRole === "admin" ? "admin" : "user",
          email: user.email,
        });
      } else {
        setCurrentUser({
          id: "anonymous",
          role: userRole === "admin" ? "admin" : "user",
          email: "guest@yggnarok.internal",
        });
      }
    }
    loadUser();
  }, [userRole]);

  // Load nodes and edges from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedNodes = window.localStorage.getItem("yggnarok.canvas_nodes");
      const storedEdges = window.localStorage.getItem("yggnarok.canvas_edges");
      if (storedNodes) {
        try {
          setCanvasNodes(JSON.parse(storedNodes));
        } catch (e) {
          console.error("Erro ao carregar canvasNodes", e);
        }
      }
      if (storedEdges) {
        try {
          setCanvasEdges(JSON.parse(storedEdges));
        } catch (e) {
          console.error("Erro ao carregar canvasEdges", e);
        }
      }
    }
  }, []);

  // Save to localStorage when nodes or edges change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yggnarok.canvas_nodes", JSON.stringify(canvasNodes));
    }
  }, [canvasNodes]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("yggnarok.canvas_edges", JSON.stringify(canvasEdges));
    }
  }, [canvasEdges]);

  // Helper to map CreativeNode to YggNode for API compatibility
  const mapToYggNode = useCallback((node: CreativeNode): YggNode => {
    return {
      id: node.id,
      type: node.type as YggNodeType,
      position: { x: node.x, y: node.y },
      dimensions: { width: 240, height: 140 },
      zIndex: 1,
      data: {
        title: node.title,
        content: node.content,
        source: node.source,
        status: node.status,
        archived: node.archived || false,
        ...node.meta
      },
      connections: (node.related || []).map(rId => ({
        targetId: rId,
        connectionType: "related_to" as ConnectionType
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser?.id || "guest",
        tags: node.tags || []
      }
    };
  }, [currentUser]);

  // Real Integration Handlers
  const handleDispararPipelineN8n = async () => {
    if (!selectedCanvasNode || !currentUser) return;
    const yggNode = mapToYggNode(selectedCanvasNode);
    await triggerWorkflow(yggNode, "pipeline", currentUser);
  };

  const handleExecutarAutomacaoBasica = async () => {
    if (!selectedCanvasNode || !currentUser) return;
    const yggNode = mapToYggNode(selectedCanvasNode);
    await triggerWorkflow(yggNode, "basic", currentUser);
  };

  const handleResetCanvas = () => {
    if (window.confirm("Deseja realmente restaurar o canvas para o estado padrão? Isso removerá todas as modificações personalizadas.")) {
      setCanvasNodes([
        ...INITIAL_CREATIVE_NODES,
        {
          id: "archived-01",
          type: "idea",
          title: "Ideia Antiga - Post Carrossel",
          x: 100,
          y: 460,
          content: "Post carrossel comparando produtividade com obsidian vs notion.",
          tags: ["#arquivado", "#notion", "#obsidian"],
          source: "Brain dump",
          status: "Arquivado",
          archived: true,
          meta: {},
          related: [],
        },
        {
          id: "archived-02",
          type: "prompt",
          title: "Prompt Velho - DALL-E 2",
          x: 400,
          y: 490,
          content: "Futuristic city neon purple, 3d render retro style.",
          tags: ["#arquivado", "#dalle2"],
          source: "Testes",
          status: "Arquivado",
          archived: true,
          meta: { model: "DALL-E 2" },
          related: [],
        }
      ]);
      setCanvasEdges(INITIAL_CREATIVE_EDGES);
      showToast("Canvas restaurado para o padrão!");
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 9;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 9;
    canvasRef.current.style.setProperty('--canvas-tx', `${rotateY}px`);
    canvasRef.current.style.setProperty('--canvas-ty', `${rotateX}px`);
  };

  // Node Drag and Drop Event handlers
  const handlePointerDown = (e: React.PointerEvent, nodeId: string) => {
    setSelectedCanvasNodeId(nodeId);
    if (connectingFromId && connectingFromId !== nodeId) {
      nextCreativeEdgeId.current += 1;
      const edgeId = `e-${nextCreativeEdgeId.current}`;
      setCanvasEdges(prev => [...prev, { id: edgeId, source: connectingFromId, target: nodeId }]);
      setConnectingFromId(null);
      showToast("Conexão visual criada!");
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    const nodeElement = e.currentTarget as HTMLDivElement;
    const rect = nodeElement.getBoundingClientRect();
    setDragOffset({
      x: (e.clientX - rect.left) / zoomLevel,
      y: (e.clientY - rect.top) / zoomLevel
    });
    setDraggingNodeId(nodeId);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingNodeId) return;
    const canvasElement = e.currentTarget as HTMLDivElement;
    const rect = canvasElement.getBoundingClientRect();

    let newX = (e.clientX - rect.left) / zoomLevel - dragOffset.x;
    let newY = (e.clientY - rect.top) / zoomLevel - dragOffset.y;

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > 3200) newX = 3200;
    if (newY > 2200) newY = 2200;

    dragLatestPos.current = { x: newX, y: newY };

    if (dragRequestRef.current === null) {
      dragRequestRef.current = requestAnimationFrame(() => {
        if (dragLatestPos.current && draggingNodeId) {
          const { x, y } = dragLatestPos.current;
          setCanvasNodes(prev => prev.map(node =>
            node.id === draggingNodeId ? { ...node, x, y } : node
          ));
        }
        dragRequestRef.current = null;
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      e.currentTarget.releasePointerCapture(e.pointerId);
      if (dragRequestRef.current !== null) {
        cancelAnimationFrame(dragRequestRef.current);
        dragRequestRef.current = null;
      }
      dragLatestPos.current = null;
    }
  };

  const selectedCanvasNode = canvasNodes.find((node) => node.id === selectedCanvasNodeId);

  const selectedCanvasConnections = useMemo(() => {
    if (!selectedCanvasNode) return [];
    return canvasEdges
      .filter((edge) => edge.source === selectedCanvasNode.id || edge.target === selectedCanvasNode.id)
      .map((edge) => {
        const connectedId = edge.source === selectedCanvasNode.id ? edge.target : edge.source;
        return canvasNodes.find((node) => node.id === connectedId);
      })
      .filter((node): node is CreativeNode => Boolean(node));
  }, [canvasEdges, selectedCanvasNodeId, canvasNodes]);

  // Dormant Node Layer Mechanics (Archive/Restore/Delete)
  const archiveCanvasNode = (id: string) => {
    setCanvasNodes(prev => prev.map(n => n.id === id ? { ...n, archived: true, status: "Arquivado" } : n));
    showToast("Nó arquivado no Shadow Archive.");
  };

  const restoreCanvasNode = (id: string) => {
    setCanvasNodes(prev => prev.map(n => n.id === id ? { ...n, archived: false, status: "Rascunho" } : n));
    showToast("Nó restaurado.");
  };

  const deleteCanvasNodePermanently = (id: string) => {
    setCanvasNodes(prev => prev.filter(n => n.id !== id));
    setCanvasEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
    if (selectedCanvasNodeId === id) {
      setSelectedCanvasNodeId("");
    }
    showToast("Nó excluído permanentemente.");
  };

  // Insert Nodes Function
  const handleInsertNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeTitle.trim()) {
      showToast("Título é obrigatório", "error");
      return;
    }

    nextCreativeNodeId.current += 1;
    const typeLabel = CREATIVE_NODE_META[newNodeType].label;
    const parsedTags = newNodeTags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith("#") ? t : `#${t}`);

    const newNode: CreativeNode = {
      id: `creative-node-${nextCreativeNodeId.current}`,
      type: newNodeType,
      title: newNodeTitle.trim(),
      x: 150 + (canvasNodes.length % 4) * 220,
      y: 120 + Math.floor(canvasNodes.length / 4) * 160,
      content: newNodeContent.trim() || `Novo bloco criativo de ${typeLabel}.`,
      tags: parsedTags.length > 0 ? parsedTags : [`#${newNodeType}`],
      source: "Manual Hub",
      status: "Rascunho",
      meta: {
        messages: newNodeType === "chat" ? [
          { sender: "ai", text: `Olá! Eu sou Kotaro IA associado ao canal. Como posso estruturar o ${newNodeTitle.trim()} hoje?` }
        ] : [],
        progress: (newNodeType === "campaign" || newNodeType === "project") ? 0 : undefined
      },
      related: []
    };

    setCanvasNodes(prev => [...prev, newNode]);
    setSelectedCanvasNodeId(newNode.id);
    setNewNodeTitle("");
    setNewNodeContent("");
    setNewNodeTags("");
    showToast(`Nó "${newNode.title}" adicionado!`);
  };

  // Chat messaging node interaction
  const handleSendChatMessage = () => {
    if (!chatMessageText.trim() || !selectedCanvasNodeId) return;
    const text = chatMessageText.trim();
    setChatMessageText("");

    // Add user text
    setCanvasNodes(prev => prev.map(node => {
      if (node.id === selectedCanvasNodeId) {
        const currentMessages = node.meta.messages || [];
        return {
          ...node,
          meta: {
            ...node.meta,
            messages: [...currentMessages, { sender: "user", text }]
          }
        };
      }
      return node;
    }));

    // Append mock response
    setTimeout(() => {
      setCanvasNodes(prev => prev.map(node => {
        if (node.id === selectedCanvasNodeId) {
          const currentMessages = node.meta.messages || [];
          const responseOptions = [
            "Excelente ponto. Vamos processar isso no backend via automação n8n para atualizar o Obsidian Vault.",
            "De acordo com a base de dados do Obsidian, essa relação fortalece a narrativa do Yggnarok.",
            "Analisando os canais, sugiro adaptar esse roteiro para o formato Shorts, usando cortes rápidos e trilha dramática.",
            "Entendido. Vou registrar esse feedback na Long-Term Memory do conselho de IAs.",
            "Ideia excelente! Como quer mapear os nós filhos vinculados a esse pensamento?"
          ];
          const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
          return {
            ...node,
            meta: {
              ...node.meta,
              messages: [...currentMessages, { sender: "ai", text: randomResponse }]
            }
          };
        }
        return node;
      }));
      showToast("Resposta recebida no chat.");
    }, 1200);
  };

  // Proximity & Relevance Sort Filter Limit (~40 nodes)
  const visibleNodes = useMemo(() => {
    let filtered = canvasNodes.filter(node => {
      const matchesSearch = canvasSearchQuery === "" || 
        node.title.toLowerCase().includes(canvasSearchQuery.toLowerCase()) ||
        node.content.toLowerCase().includes(canvasSearchQuery.toLowerCase()) ||
        node.tags.some(tag => tag.toLowerCase().includes(canvasSearchQuery.toLowerCase()));

      const matchesType = selectedNodeTypeFilter === "all" || node.type === selectedNodeTypeFilter;

      return matchesSearch && matchesType;
    });

    filtered = filtered.filter(n => showArchivedOnCanvas || !n.archived);

    const LIMIT = 40;
    if (filtered.length <= LIMIT) return filtered;

    const selected = filtered.find(n => n.id === selectedCanvasNodeId);
    if (!selected) {
      return filtered.slice(0, LIMIT);
    }

    const priorityIds = new Set<string>();
    priorityIds.add(selected.id);

    canvasEdges.forEach(e => {
      if (e.source === selected.id) priorityIds.add(e.target);
      if (e.target === selected.id) priorityIds.add(e.source);
    });

    const otherNodes = filtered.filter(n => !priorityIds.has(n.id));
    const dist = (n1: CreativeNode, n2: CreativeNode) => {
      const dx = n1.x - n2.x;
      const dy = n1.y - n2.y;
      return dx * dx + dy * dy;
    };
    otherNodes.sort((a, b) => dist(a, selected) - dist(b, selected));

    const result = filtered.filter(n => priorityIds.has(n.id));
    const needed = LIMIT - result.length;
    if (needed > 0) {
      result.push(...otherNodes.slice(0, needed));
    }
    return result;
  }, [canvasNodes, canvasEdges, selectedCanvasNodeId, canvasSearchQuery, selectedNodeTypeFilter, showArchivedOnCanvas]);

  const visibleEdges = useMemo(() => {
    const visibleIds = new Set(visibleNodes.map(n => n.id));
    return canvasEdges.filter(e => visibleIds.has(e.source) && visibleIds.has(e.target));
  }, [canvasEdges, visibleNodes]);

  const drawEdgePath = (edge: CreativeEdge) => {
    const sourceNode = visibleNodes.find(n => n.id === edge.source);
    const targetNode = visibleNodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return null;

    const { sourcePoint, targetPoint } = getClosestPorts(sourceNode, targetNode);
    const isSelectedConnection = selectedCanvasNodeId === sourceNode.id || selectedCanvasNodeId === targetNode.id;

    if (connectionLineStyle === "orthogonal") {
      const midX = sourcePoint.x + (targetPoint.x - sourcePoint.x) / 2;
      const points = `${sourcePoint.x},${sourcePoint.y} ${midX},${sourcePoint.y} ${midX},${targetPoint.y} ${targetPoint.x},${targetPoint.y}`;
      return (
        <polyline
          key={edge.id}
          points={points}
          fill="none"
          stroke={isSelectedConnection ? "rgba(var(--aura-color),0.85)" : "rgba(var(--aura-color),0.35)"}
          strokeWidth={isSelectedConnection ? 2.5 : 1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          markerEnd="url(#creative-arrow)"
        />
      );
    } else {
      return (
        <line
          key={edge.id}
          x1={sourcePoint.x}
          y1={sourcePoint.y}
          x2={targetPoint.x}
          y2={targetPoint.y}
          stroke={isSelectedConnection ? "rgba(var(--aura-color),0.85)" : "rgba(var(--aura-color),0.35)"}
          strokeWidth={isSelectedConnection ? 2.5 : 1.5}
          markerEnd="url(#creative-arrow)"
        />
      );
    }
  };

  const ltmMemories = useMemo(() => {
    if (typeof window === "undefined") return [];
    const username = window.localStorage.getItem("yggnarok.username") || "kotaro";
    const stored = window.localStorage.getItem(`yggnarok.${username}.ltm_memories`);
    if (!stored) return [];
    try {
      return (JSON.parse(stored) as Array<{ id: string | number; confidence: number | string; fact: string }>).slice(0, 4);
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [toast]);

  return (
    <main className="min-h-screen text-foreground relative bg-background pb-10 select-none">
      <style>{`
        @keyframes subtleGlow {
          0% { border-color: rgba(var(--aura-color), 0.15); box-shadow: 0 0 10px rgba(var(--aura-color), 0.02); }
          50% { border-color: rgba(var(--aura-color), 0.35); box-shadow: 0 0 20px rgba(var(--aura-color), 0.08); }
          100% { border-color: rgba(var(--aura-color), 0.15); box-shadow: 0 0 10px rgba(var(--aura-color), 0.02); }
        }
        .glowing-panel {
          animation: subtleGlow 4s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--aura-color), 0.25);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--aura-color), 0.45);
        }
      `}</style>

      {/* Aesthetic Backlight */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-brand-strong/5 blur-[130px] rounded-full pointer-events-none" />

      {/* Floating Status Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-extrabold shadow-2xl backdrop-blur-xl animate-bounce ${
          toast.type === "success"
            ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-400"
            : "border-rose-500/30 bg-rose-950/90 text-rose-400"
        }`}>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${toast.type === "success" ? "bg-emerald-400" : "bg-rose-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Fullscreen Board Layout */}
      <div className="flex h-screen flex-col overflow-hidden">
        {/* Core Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-line/20 bg-surface/30 px-6 py-4 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand/75 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-brand leading-none">Creative Brain Canvas</span>
            </div>
            <h1 className="font-divine text-2xl font-black tracking-widest bg-gradient-to-r from-brand via-amber-200 to-brand-strong bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(248, 195, 102,0.3)]">
              YGGNAROK Creation Nexus
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-lg border border-brand/20 bg-brand/5 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-brand">
              Canvas: {visibleNodes.length}/{canvasNodes.length} cards (Performance Limiter)
            </span>
            <Link 
              href="/estudio-video" 
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-300 transition"
            >
              <Film size={11} />
              <span>Estúdio de Edição</span>
            </Link>
          </div>
        </header>

        {/* Unified workspace */}
        <div className="flex flex-1 overflow-hidden">
          {/* MAIN CANVAS WORKSPACE */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            {/* Canvas Header toolbar: Search and Filters */}
            <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 bg-surface/85 border border-line/30 rounded-xl p-3 backdrop-blur-md shadow-2xl select-none">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted/60" size={12} />
                  <input
                    type="text"
                    placeholder="Pesquisar nós ou tags..."
                    className="h-8 w-56 rounded-lg border border-line/40 bg-surface-strong/50 pl-8 pr-3 text-[10px] text-foreground outline-none focus:border-brand/40 transition font-semibold"
                    value={canvasSearchQuery}
                    onChange={(e) => setCanvasSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-1 border-l border-line/20 pl-2">
                  <button
                    onClick={() => setSelectedNodeTypeFilter("all")}
                    className={`h-8 px-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${
                      selectedNodeTypeFilter === "all" ? "bg-brand text-white dark:text-neutral-950" : "text-muted hover:text-brand"
                    }`}
                  >
                    Todos
                  </button>
                  {Object.keys(CREATIVE_NODE_META).slice(0, 5).map(key => (
                    <button
                      key={key}
                      onClick={() => setSelectedNodeTypeFilter(key)}
                      className={`h-8 px-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${
                        selectedNodeTypeFilter === key ? "bg-brand text-white dark:text-neutral-950" : "text-muted hover:text-brand"
                      }`}
                    >
                      {CREATIVE_NODE_META[key as CreativeNodeType].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Controls */}
              <div className="flex items-center gap-2">
                {/* Toggle Show Archived */}
                <button
                  type="button"
                  onClick={() => setShowArchivedOnCanvas(!showArchivedOnCanvas)}
                  className={`h-8 px-3 rounded-lg border text-[9.5px] font-black uppercase tracking-widest flex items-center gap-1.5 transition ${
                    showArchivedOnCanvas 
                      ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 dark:bg-indigo-950/30"
                      : "border-line bg-surface/20 text-muted hover:text-brand"
                  }`}
                >
                  <Archive size={11} />
                  <span>Arquivo de Sombras</span>
                </button>

                {/* Toggle Orthogonal Lines */}
                <button
                  type="button"
                  onClick={() => {
                    const style = connectionLineStyle === "straight" ? "orthogonal" : "straight";
                    setConnectionLineStyle(style);
                    showToast(style === "straight" ? "Conexões retas ativadas." : "Conexões ortogonais ativadas.");
                  }}
                  className={`h-8 px-3 rounded-lg border text-[9.5px] font-black uppercase tracking-widest flex items-center gap-1.5 transition ${
                    connectionLineStyle === "orthogonal"
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-line bg-surface/20 text-muted hover:text-brand"
                  }`}
                >
                  <Sliders size={11} />
                  <span>{connectionLineStyle === "orthogonal" ? "Ortogonal" : "Retas"}</span>
                </button>
              </div>
            </div>

            {/* Board Canvas Workspace */}
            <div
              ref={canvasRef}
              className={`flex-1 relative overflow-hidden bg-surface-base ${connectingFromId ? "cursor-alias" : "cursor-crosshair"}`}
              onMouseMove={handleCanvasMouseMove}
            >
              {/* Backlight layout */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(var(--aura-color),0.12),transparent_45%),linear-gradient(135deg,var(--surface-base)_0%,var(--background)_100%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:60px_60px]" />

              {/* Transform layout wrapper */}
              <div
                className="absolute inset-0 transition-transform duration-100 ease-out z-10"
                style={{
                  transform: `scale(${zoomLevel}) translate3d(calc(120px + var(--canvas-tx, 0px)), calc(40px + var(--canvas-ty, 0px)), 0)`,
                  transformOrigin: "center center",
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onClick={() => connectingFromId && setConnectingFromId(null)}
              >
                {/* Connections SVG */}
                <svg className="absolute inset-0 z-0 size-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="creative-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                      <path d="M 0 1 L 6 4 L 0 7 z" fill="rgba(var(--aura-color),0.65)" />
                    </marker>
                  </defs>
                  {visibleEdges.map(edge => drawEdgePath(edge))}
                </svg>

                {/* Nodes Cards */}
                {visibleNodes.map(node => {
                  const meta = CREATIVE_NODE_META[node.type];
                  const TitleIcon = meta.icon;
                  const isSelected = selectedCanvasNodeId === node.id;

                  return (
                    <div
                      key={node.id}
                      onPointerDown={(e) => handlePointerDown(e, node.id)}
                      className={`absolute w-[240px] rounded-xl border p-3.5 shadow-2xl backdrop-blur-md select-none ${
                        draggingNodeId === node.id ? "cursor-grabbing scale-[1.03]" : "transition-all duration-300 cursor-grab"
                      } ${meta.tone} ${
                        isSelected 
                          ? "ring-2 ring-brand/60 border-brand shadow-[0_0_40px_rgba(var(--aura-color),0.22)] scale-[1.01]" 
                          : "hover:border-brand/40"
                      } ${node.archived ? "opacity-35 hover:opacity-50 ring-0 border-indigo-950/40 bg-indigo-950/5 text-indigo-400/50" : ""} ${
                        connectingFromId === node.id ? "ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : ""}`}
                      style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        touchAction: "none",
                      }}
                    >
                      {/* Close/Archive node button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (node.archived) {
                            deleteCanvasNodePermanently(node.id);
                          } else {
                            archiveCanvasNode(node.id);
                          }
                        }}
                        className="absolute -right-1.5 -top-1.5 z-20 grid size-5 place-items-center rounded-full border border-line bg-surface-strong text-muted transition hover:border-red-500 hover:text-red-400"
                        title={node.archived ? "Excluir Permanentemente" : "Arquivar Pensamento"}
                      >
                        <X size={9} />
                      </button>

                      {/* Header layout */}
                      <div className="mb-2 flex items-center justify-between border-b border-line/15 pb-2">
                        <div className="flex min-w-0 items-center gap-1.5">
                          <TitleIcon size={12} className="shrink-0" />
                          <span className="truncate text-[8.5px] font-black uppercase tracking-widest">{meta.label}</span>
                        </div>
                        <span className="rounded bg-black/35 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider">{node.status}</span>
                      </div>

                      {/* Title & info */}
                      <h3 className="line-clamp-2 text-xs font-black leading-snug text-foreground">{node.title}</h3>
                      
                      {/* Campaign slider progress indicator */}
                      {(node.type === "campaign" || node.type === "project") && node.meta.progress !== undefined && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-[7px] text-muted">
                            <span>Progresso</span>
                            <span className="text-brand font-bold">{node.meta.progress}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-black/30 overflow-hidden">
                            <div className="h-full rounded-full bg-brand" style={{ width: `${node.meta.progress}%` }} />
                          </div>
                        </div>
                      )}

                      <p className="mt-2 line-clamp-3 text-[10px] font-semibold leading-relaxed text-muted/80">{node.content}</p>
                      
                      {/* Tags */}
                      {node.tags && node.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {node.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="rounded border border-current/15 bg-black/25 px-1.5 py-0.5 text-[7.5px] font-extrabold uppercase opacity-80">{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* Ports for snapping lines */}
                      <div className="absolute -left-1.5 top-[46px] size-3 rounded-full border-2 border-line bg-surface-strong" />
                      <button
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          setConnectingFromId(node.id);
                          showToast("Clique em outro nó para criar uma conexão!");
                        }}
                        className="absolute -right-2 top-[44px] grid size-4 cursor-crosshair place-items-center rounded-full border border-line bg-brand transition-transform hover:scale-125 hover:shadow-[0_0_8px_rgba(var(--aura-color),0.5)]"
                        title="Conectar"
                      >
                        <Plus size={8} className="text-white dark:text-neutral-950" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Zoom Buttons inside Canvas */}
              <div className="absolute bottom-4 left-4 flex gap-1 z-20 select-none">
                <button
                  type="button"
                  onClick={() => {
                    const z = Math.min(1.5, zoomLevel + 0.1);
                    setZoomLevel(z);
                    showToast(`Zoom: ${Math.round(z * 100)}%`);
                  }}
                  className="grid size-8 place-items-center bg-surface/85 border border-line/25 rounded-lg text-muted hover:text-brand backdrop-blur transition hover:bg-surface-strong/50"
                >
                  <ZoomIn size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const z = Math.max(0.5, zoomLevel - 0.1);
                    setZoomLevel(z);
                    showToast(`Zoom: ${Math.round(z * 100)}%`);
                  }}
                  className="grid size-8 place-items-center bg-surface/85 border border-line/25 rounded-lg text-muted hover:text-brand backdrop-blur transition hover:bg-surface-strong/50"
                >
                  <ZoomOut size={12} />
                </button>
              </div>
              
              {/* Floating toggle button for right sidebar */}
              <button
                type="button"
                onClick={() => setRightSidebarCollapsed((c) => !c)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/85 text-foreground backdrop-blur-md shadow-2xl transition hover:text-brand hover:border-brand/45"
                title={rightSidebarCollapsed ? "Abrir Painel de Controle" : "Recuar Painel de Controle"}
              >
                {rightSidebarCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Inspector (or Creation Console if none selected) */}
          <aside
            style={{
              width: rightSidebarCollapsed ? "0px" : "360px",
              opacity: rightSidebarCollapsed ? 0 : 1,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            className="border-l border-line/25 bg-surface/15 backdrop-blur-xl flex flex-col shrink-0 overflow-y-auto overflow-x-hidden custom-scrollbar select-text"
          >
            <div className="w-[360px] h-full flex flex-col">
            {selectedCanvasNode ? (
              // Detailed Node Inspector
              <div className="flex flex-col p-5 space-y-5 h-full">
                <div className="flex items-start justify-between gap-3 border-b border-line/20 pb-4">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.22em] text-brand">Detailed Node Inspector</p>
                    <input
                      type="text"
                      className="mt-1 bg-transparent border-b border-transparent focus:border-brand/40 text-base font-black text-foreground outline-none w-full pb-0.5"
                      value={selectedCanvasNode.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCanvasNodes(prev => prev.map(n => n.id === selectedCanvasNode.id ? { ...n, title: val } : n));
                      }}
                    />
                  </div>
                  <span className={`rounded-lg border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${CREATIVE_NODE_META[selectedCanvasNode.type].tone}`}>
                    {CREATIVE_NODE_META[selectedCanvasNode.type].label}
                  </span>
                </div>

                <div className="space-y-5 flex-1">
                  {/* Image Type Specific view */}
                  {selectedCanvasNode.type === "image" && (
                    <div className="space-y-3">
                      <div className="relative overflow-hidden rounded-xl border border-brand/20 bg-surface-strong/50 p-4 flex flex-col items-center justify-center h-44 shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent pointer-events-none" />
                        <ImageIcon size={40} className="text-brand/50 mb-2" />
                        <span className="text-[9.5px] font-bold text-muted text-center leading-normal">
                          {selectedCanvasNode.meta.preview || "Preview Dourado (Yggnarok AI)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Prompt Sintonizado</span>
                        <div className="flex rounded-lg border border-line/30 bg-surface-strong/50 p-2.5 items-start justify-between gap-2">
                          <code className="text-[10.5px] text-brand/90 font-mono leading-normal select-all">
                            {selectedCanvasNode.content}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedCanvasNode.content);
                              showToast("Prompt copiado!");
                            }}
                            className="p-1.5 rounded bg-surface/50 border border-line/25 text-muted hover:text-brand transition"
                            title="Copiar Prompt"
                          >
                            <Copy size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Video Type Specific view */}
                  {selectedCanvasNode.type === "video" && (
                    <div className="space-y-3">
                      <div className="relative overflow-hidden rounded-xl border border-rose-500/20 bg-rose-500/10 dark:bg-rose-950/10 p-4 flex flex-col items-center justify-center h-44">
                        <div className="absolute inset-0 bg-gradient-to-t from-rose-500/5 to-transparent pointer-events-none" />
                        <Play size={40} className="text-rose-400/40 mb-2 animate-pulse" />
                        <span className="text-[10px] font-mono text-rose-600 dark:text-rose-300 font-bold uppercase tracking-wider">
                          Duração: {selectedCanvasNode.meta.duration || "15s"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Roteiro / Legenda</span>
                        <textarea
                          rows={4}
                          className="w-full rounded-lg border border-line bg-surface-strong/50 p-3 text-[11px] font-medium leading-relaxed text-foreground focus:border-brand focus:outline-none"
                          value={selectedCanvasNode.content}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCanvasNodes(prev => prev.map(n => n.id === selectedCanvasNode.id ? { ...n, content: val } : n));
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Chat Type Specific view (Interactive conversations) */}
                  {selectedCanvasNode.type === "chat" && (
                    <div className="space-y-3 flex flex-col h-[280px]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Canal IA: {selectedCanvasNode.meta.persona || "Kotaro"}</span>
                      <div className="flex-1 overflow-y-auto border border-line/30 rounded-xl bg-surface-strong/30 p-3 space-y-2.5 custom-scrollbar min-h-0">
                        {(selectedCanvasNode.meta.messages || []).map((msg, i) => (
                          <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs font-semibold leading-relaxed shadow-sm ${
                              msg.sender === "user" 
                                ? "bg-brand text-white dark:text-neutral-950 rounded-br-none" 
                                : "bg-surface-strong border border-line/25 text-foreground rounded-bl-none"
                            }`}>
                              {msg.text}
                            </div>
                            <span className="text-[7.5px] text-muted/60 mt-0.5 px-1 font-bold">
                              {msg.sender === "user" ? "Você" : selectedCanvasNode.meta.persona || "Kotaro"}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <input
                          type="text"
                          placeholder="Digite para conversar..."
                          className="flex-1 h-9 rounded-lg border border-line bg-surface-strong/50 px-3 text-xs text-foreground outline-none focus:border-brand/40 transition font-semibold"
                          value={chatMessageText}
                          onChange={(e) => setChatMessageText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                        />
                        <button
                          onClick={handleSendChatMessage}
                          className="grid size-9 place-items-center rounded-lg bg-brand text-white dark:text-neutral-950 hover:bg-brand-strong transition shadow-[0_0_10px_rgba(var(--aura-color),0.2)]"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Prompt Type Specific view */}
                  {selectedCanvasNode.type === "prompt" && (
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Modelo de IA</span>
                        <input
                          type="text"
                          className="h-9 w-full rounded-lg border border-line bg-surface-strong/50 px-3 text-xs text-foreground outline-none focus:border-brand/40 font-semibold"
                          value={selectedCanvasNode.meta.model || "Universal LLM"}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCanvasNodes(prev => prev.map(n => n.id === selectedCanvasNode.id ? { ...n, meta: { ...n.meta, model: val } } : n));
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Prompt / Diretivas</span>
                        <textarea
                          rows={6}
                          className="w-full rounded-lg border border-line bg-surface-strong/50 p-3 text-[11px] font-mono leading-relaxed text-brand/90 focus:border-brand focus:outline-none"
                          value={selectedCanvasNode.content}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCanvasNodes(prev => prev.map(n => n.id === selectedCanvasNode.id ? { ...n, content: val } : n));
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Campaign & Project Type Specific view */}
                  {(selectedCanvasNode.type === "campaign" || selectedCanvasNode.type === "project") && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted mb-1.5">
                          <span>Progresso Operacional</span>
                          <span className="text-brand font-mono">{selectedCanvasNode.meta.progress ?? 0}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          className="w-full h-1.5 bg-neutral-900 rounded-full appearance-none cursor-pointer accent-brand"
                          value={selectedCanvasNode.meta.progress ?? 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setCanvasNodes(prev => prev.map(n => n.id === selectedCanvasNode.id ? { ...n, meta: { ...n.meta, progress: val } } : n));
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Deadline</span>
                        <input
                          type="text"
                          placeholder="DD/MM/AAAA"
                          className="h-9 w-full rounded-lg border border-line bg-surface-strong/50 px-3 text-xs text-foreground outline-none focus:border-brand/40 font-semibold"
                          value={selectedCanvasNode.meta.deadline || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCanvasNodes(prev => prev.map(n => n.id === selectedCanvasNode.id ? { ...n, meta: { ...n.meta, deadline: val } } : n));
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* General context layout */}
                  {selectedCanvasNode.type !== "prompt" && selectedCanvasNode.type !== "chat" && (
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Notas / Conteúdo</span>
                      <textarea
                        rows={4}
                        className="w-full rounded-lg border border-line bg-surface-strong/50 p-3 text-xs font-semibold leading-relaxed text-foreground focus:border-brand focus:outline-none"
                        value={selectedCanvasNode.content}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCanvasNodes(prev => prev.map(n => n.id === selectedCanvasNode.id ? { ...n, content: val } : n));
                        }}
                      />
                    </div>
                  )}

                  {/* Tags input */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1.5">Tags</span>
                    <input
                      type="text"
                      className="h-9 w-full rounded-lg border border-line bg-surface-strong/50 px-3 text-xs text-foreground outline-none focus:border-brand/40 font-semibold"
                      value={selectedCanvasNode.tags.join(", ")}
                      onChange={(e) => {
                        const parsed = e.target.value.split(",").map(t => t.trim());
                        setCanvasNodes(prev => prev.map(n => n.id === selectedCanvasNode.id ? { ...n, tags: parsed } : n));
                      }}
                    />
                  </div>

                  {/* Connections Details */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted block">Relações Conectadas ({selectedCanvasConnections.length})</span>
                    {selectedCanvasConnections.length > 0 ? (
                      <div className="grid gap-1.5">
                        {selectedCanvasConnections.map(node => (
                          <button
                            key={node.id}
                            type="button"
                            onClick={() => setSelectedCanvasNodeId(node.id)}
                            className="flex items-center justify-between rounded-lg border border-line/25 bg-surface-strong/50 hover:border-brand/35 hover:bg-surface px-3 py-2 text-left text-xs font-semibold text-muted transition"
                          >
                            <span className="flex items-center gap-2 truncate">
                              {(() => {
                                const Icon = CREATIVE_NODE_META[node.type].icon;
                                return <Icon size={12} className="text-brand shrink-0" />;
                              })()}
                              <span className="truncate">{node.title}</span>
                            </span>
                            <ChevronRight size={11} className="text-muted/40 shrink-0" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[9.5px] font-bold text-muted/50 italic block">Nenhuma relação visual neste pensamento.</span>
                    )}
                  </div>

                  {/* Obsidian & n8n System Actions */}
                  <div className="border-t border-line/20 pt-4 space-y-3.5">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand block mb-2">Vault Obsidian (Link Direto)</span>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[7.5px] font-black text-muted uppercase block mb-0.5">Vault</label>
                            <input
                              type="text"
                              className="h-8 w-full rounded border border-line bg-surface-strong/50 px-2 text-[10px] text-foreground font-semibold outline-none"
                              value={obsidianVault}
                              onChange={(e) => setObsidianVault(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-[7.5px] font-black text-muted uppercase block mb-0.5">Caminho</label>
                            <input
                              type="text"
                              className="h-8 w-full rounded border border-line bg-surface-strong/50 px-2 text-[10px] text-foreground font-semibold outline-none"
                              value={obsidianPath}
                              onChange={(e) => setObsidianPath(e.target.value)}
                            />
                          </div>
                        </div>
                        <a
                          href={`obsidian://open?vault=${encodeURIComponent(obsidianVault)}&file=${encodeURIComponent(obsidianPath + "/" + selectedCanvasNode.title)}`}
                          className="flex h-9 items-center justify-between rounded-lg border border-indigo-500/30 bg-indigo-950/20 hover:bg-indigo-950/30 px-3 text-[10px] font-black uppercase tracking-wide text-indigo-300 transition"
                        >
                          <span>Abrir Nota no Obsidian</span>
                          <ChevronRight size={11} />
                        </a>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand block mb-2">Workflow n8n (Integrações)</span>
                      {userRole === "admin" ? (
                        <div className="space-y-2">
                          <div>
                            <label className="text-[7.5px] font-black text-muted uppercase block mb-0.5">URL Webhook</label>
                            <input
                              type="text"
                              className="h-8 w-full rounded border border-line bg-surface-strong/50 px-2 text-[9px] text-foreground font-mono outline-none"
                              value={n8nUrl}
                              onChange={(e) => setn8nUrl(e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleDispararPipelineN8n}
                            className="w-full h-8 text-[9px] font-black uppercase tracking-wider bg-brand/20 hover:bg-brand/30 border border-brand/40 text-brand rounded transition"
                          >
                            Disparar Pipeline n8n
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleExecutarAutomacaoBasica}
                          className="w-full flex h-9 items-center justify-between rounded-lg border border-brand/20 bg-brand/5 hover:bg-brand/10 px-3 text-[10px] font-black uppercase tracking-wide text-brand transition"
                        >
                          <span>Executar Automação Básica</span>
                          <ChevronRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Inspector controls */}
                <div className="grid gap-2 border-t border-line/20 pt-4 shrink-0">
                  {selectedCanvasNode.archived ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => restoreCanvasNode(selectedCanvasNode.id)}
                        className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/30 text-[10px] font-black uppercase tracking-wide transition"
                      >
                        <RefreshCw size={11} />
                        <span>Recuperar</span>
                      </button>
                      <button
                        onClick={() => deleteCanvasNodePermanently(selectedCanvasNode.id)}
                        className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-950/20 text-rose-400 hover:bg-rose-950/30 text-[10px] font-black uppercase tracking-wide transition"
                      >
                        <Trash2 size={11} />
                        <span>Excluir</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => archiveCanvasNode(selectedCanvasNode.id)}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface-strong/85 hover:bg-surface-strong text-[10px] font-black uppercase tracking-wide text-muted hover:text-brand transition"
                    >
                      <Archive size={11} />
                      <span>Arquivar Pensamento</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedCanvasNodeId("")}
                    className="h-9 rounded-lg border border-line/20 bg-surface/30 text-[10px] font-black uppercase text-muted hover:text-brand transition"
                  >
                    Fechar Inspector
                  </button>
                </div>
              </div>
            ) : (
              // Creation Console (No Node Selected)
              <div className="flex flex-col p-5 space-y-6 h-full">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-brand">Creation Console</p>
                  <h2 className="text-base font-black text-foreground mt-1">Ingestão Visual</h2>
                  <p className="text-[9.5px] text-muted font-semibold mt-1 leading-normal">
                    Adicione um novo pensamento no Nexus para interligar referências e disparar fluxos.
                  </p>
                </div>

                {/* Node Insertion Form */}
                <form onSubmit={handleInsertNode} className="space-y-4">
                  <div>
                    <label className="text-[9.5px] font-black text-muted uppercase tracking-widest block mb-1">Título do Pensamento</label>
                    <input
                      type="text"
                      placeholder="Ex: Pauta - IAs de Áudio"
                      className="h-9 w-full rounded-lg border border-line bg-surface-strong/50 px-3 text-xs text-foreground outline-none focus:border-brand/40 transition font-semibold"
                      value={newNodeTitle}
                      onChange={(e) => setNewNodeTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9.5px] font-black text-muted uppercase tracking-widest block mb-1">Tipo de Bloco</label>
                      <select
                        className="h-9 w-full rounded-lg border border-line bg-surface-strong/50 px-2 text-xs text-foreground font-semibold outline-none focus:border-brand/40 cursor-pointer"
                        value={newNodeType}
                        onChange={(e) => setNewNodeType(e.target.value as CreativeNodeType)}
                      >
                        {Object.keys(CREATIVE_NODE_META).map(key => (
                          <option key={key} value={key} className="bg-surface-strong text-foreground">
                            {CREATIVE_NODE_META[key as CreativeNodeType].label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9.5px] font-black text-muted uppercase tracking-widest block mb-1">Tags (Vírgula)</label>
                      <input
                        type="text"
                        placeholder="ia, audio"
                        className="h-9 w-full rounded-lg border border-line bg-surface-strong/50 px-3 text-xs text-foreground outline-none focus:border-brand/40 font-semibold"
                        value={newNodeTags}
                        onChange={(e) => setNewNodeTags(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9.5px] font-black text-muted uppercase tracking-widest block mb-1">Diretivas / Conteúdo</label>
                    <textarea
                      rows={5}
                      placeholder="Descreva a pauta ou o prompt que deseja interligar..."
                      className="w-full rounded-lg border border-line bg-surface-strong/50 p-3 text-xs font-semibold text-foreground leading-relaxed outline-none focus:border-brand/40"
                      value={newNodeContent}
                      onChange={(e) => setNewNodeContent(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex h-10 items-center justify-center gap-2 rounded-lg bg-brand text-white dark:text-neutral-950 hover:bg-brand-strong transition font-black text-xs shadow-[0_0_15px_rgba(var(--aura-color),0.2)]"
                  >
                    <Plus size={14} />
                    <span>Inserir no Nexus</span>
                  </button>
                </form>

                {/* Console System Settings */}
                <div className="border-t border-line/25 pt-5 space-y-4 flex-1">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-2">Painel de Configuração</span>
                    <div className="flex rounded-lg border border-line/20 bg-surface/20 border border-line/20 p-1">
                      <button
                        type="button"
                        onClick={() => { setUserRole("standard"); showToast("Operador Standard ativado."); }}
                        className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-md text-center transition-all ${userRole === "standard" ? "bg-surface text-brand font-black" : "text-muted"}`}
                      >
                        Operador Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => { setUserRole("admin"); showToast("Administrador ativado."); }}
                        className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-md text-center transition-all ${userRole === "admin" ? "bg-brand text-white dark:text-neutral-950 font-black shadow-[0_0_10px_rgba(var(--aura-color),0.3)]" : "text-muted"}`}
                      >
                        Administrador
                      </button>
                    </div>
                  </div>

                  {/* LTM Memories in Console */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand flex items-center gap-1.5">
                      <Brain size={12} className="animate-pulse" /> Memórias LTM Ativas
                    </span>
                    <div className="bg-surface-strong/30 rounded-xl p-3 border border-line/30 space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                      {ltmMemories.length > 0 ? (
                        ltmMemories.map((mem) => (
                          <div key={mem.id} className="text-[9.5px] leading-relaxed text-muted border-b border-line/5 pb-1.5 last:border-0 last:pb-0">
                            <span className="font-extrabold text-neutral-400 block mb-0.5">Confiança: {mem.confidence}%</span>
                            {mem.fact}
                          </div>
                        ))
                      ) : (
                        <p className="text-[9px] text-muted/50 italic">Nenhuma memória sintonizada localmente.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
