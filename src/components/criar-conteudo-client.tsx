"use client";

import Link from "next/link";
import { useMemo, useState, useCallback, useRef } from "react";
import { 
  Lightbulb, Brain, Send, Sparkles, 
  Wand2, Layers, CheckCircle, Film, Play, Sliders, AlertTriangle, 
  Trash2, ShieldAlert, Cpu, HelpCircle, Video, Scissors,
  Music, Radio, Star, Award, Heart, MessageSquare, RefreshCw, Plus, X, FileText, Image, Check,
  MoreVertical, Copy, RotateCcw, Loader2, Search, Zap, ChevronRight, AtSign, Library,
  ScrollText, Subtitles, Hash, Globe, Settings, Terminal
} from "lucide-react";
import { inputClass } from "@/components/field";

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

const tabs = [
  { id: "ideias", label: "Ideias", icon: Lightbulb, description: "Novas Pautas" },
  { id: "roteiros", label: "Roteiros", icon: ScrollText, description: "Scripts e Falas" },
  { id: "legendas", label: "Legendas", icon: Subtitles, description: "Copy e Ganchos" },
  { id: "hashtags", label: "Hashtags", icon: Hash, description: "Tags e Alcance" },
  { id: "videos", label: "Estúdio de Vídeo", icon: Film, description: "Mesa de Edição" }
];

const DEFAULT_PRESETS: Record<string, VideoStylePreset> = {
  tiktok: {
    name: "Estilo TikTok & Reels (Retenção Acelerada)",
    duration: "15s - 60s (Alta Frequência)",
    trendingMusic: ["'Void Echoes' (Synthwave Suave)", "'Amber Pulse' (Techno Melódico)", "'Kotaro Vibe' (Acoustic Trap)"],
    trendingTransitions: ["Zoom Rápido a cada 1.5s", "Legendas de Destaque Neon Central", "Efeitos Sonoros 'Swoosh'"],
    mostSearched: ["Engenharia de Prompt Inteligente", "IAs Gratuitas sem Limites", "Automação no Navegador"],
    baseDirectives: "Ritmo frenético, gancho de impacto nos primeiros 2.5 segundos, zero pausas respiratórias, paleta Void & Amber vibrante com legendas de duas palavras por quadro."
  },
  youtube: {
    name: "Estilo Vlogging / Explicativo no YouTube",
    duration: "5m - 12m (Engajamento Profundo)",
    trendingMusic: ["'Cyber Coffee' (Batidas Calmas)", "'Infinite Drift' (Sintetizador de Fundo)"],
    trendingTransitions: ["Cortes Secos Estruturados", "Cenas de Apoio de Softwares Neon", "Zoom Lento no Ponto de Destaque"],
    mostSearched: ["Como criar agente de autoaprendizado", "Supabase vs LocalStorage no NextJS", "Estúdio de Nodes Neon"],
    baseDirectives: "Ritmo conversacional premium, transição explicativa visual a cada 10s, introdução estruturada do problema, tela limpa com cards informativos sobrepostos."
  },
  cinematic: {
    name: "Estilo Documentário & Mini-Histórias",
    duration: "2m - 5m (Imersão Dramática)",
    trendingMusic: ["'Odyssey Orchestral' (Dramático)", "'Deep Void' (Sonoplastia Cinematográfica)"],
    trendingTransitions: ["Transição Gradual Suave", "Sobreposição de Texturas de Luz", "Sonoplastia Sub-grave"],
    mostSearched: ["Evolução de Sistemas AI", "Privacidade Digital Multi-tenant", "História do YGGNAROK"],
    baseDirectives: "Foco estético em mistério, gradação de cores âmbar escuras, pausas dramáticas com trilha subindo de volume, voz grave e firme com frases curtas de alta reflexão."
  },
  sales: {
    name: "VSL de Vendas de Alta Conversão",
    duration: "3m - 8m (Persuasão & Neuro-copy)",
    trendingMusic: ["'Ascension' (Trilha de Tensão Crescente)", "'Resolution' (Trilha Heroica de Fechamento)"],
    trendingTransitions: ["Quebras de Padrão Agressivas", "Letreiros Neon Piscantes", "Efeito de Máquina de Escrever"],
    mostSearched: ["Como economizar R$15.000 em APIs", "Melhores agentes para vendas automática", "Roteamento inteligente de modelos"],
    baseDirectives: "Copy focada na dor imediata, quebra de objeção a cada 4 quadros, música de suspense crescendo até a revelação da oferta, CTA claro de urgência no fim."
  }
};

export function CriarConteudoClient({ profiles, initialContents, activeTab: currentTab }: CriarConteudoClientProps) {
  const [activeTab, setActiveTab] = useState(currentTab);
  const [contents, setContents] = useState<ContentItem[]>(
    initialContents.length > 0 ? initialContents : DEMO_CONTENTS
  );
  
  const [creationMode, setCreationMode] = useState<"manual" | "ia">("manual");
  const [carouselIdx, setCarouselIdx] = useState(0);
  
  const [contentType, setContentType] = useState("ideia");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [showChannelMention, setShowChannelMention] = useState(false);
  const [channelFilter, setChannelFilter] = useState("");
  const briefingRef = useRef<HTMLTextAreaElement>(null);
  const [, setRefinementInstructions] = useState("");
  
  const [acervoFilter, setAcervoFilter] = useState<string>("todos");
  const [acervoSearch, setAcervoSearch] = useState("");
  const [openCardMenu, setOpenCardMenu] = useState<string | null>(null);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);
  
  const [learningMargin, setLearningMargin] = useState(85);
  const [autoFreeTier, setAutoFreeTier] = useState(true);

  const [manualTitle, setManualTitle] = useState("");
  const [manualIdea, setManualIdea] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("hefesto");

  const [videoStyle, setVideoStyle] = useState<string>("tiktok");
  const [allPresets, setAllPresets] = useState<Record<string, VideoStylePreset>>(DEFAULT_PRESETS);
  const [, setShowStyleCreator] = useState(false);

  const [referenceAssets, setReferenceAssets] = useState<ReferenceAsset[]>([]);

  const ltmMemories = useMemo(() => {
    void toast;
    if (typeof window === "undefined") return [];
    const username = window.localStorage.getItem("yggnarok.username") || "kotaro";
    const stored = window.localStorage.getItem(`yggnarok.${username}.ltm_memories`);
    if (!stored) return [];
    try {
      const list = JSON.parse(stored) as { id: string; fact: string; confidence: number }[];
      return list.slice(0, 4);
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [toast]);

  const handleSimulateAssetUpload = (type: "image" | "video" | "audio" | "doc") => {
    const fileNamesMap = {
      image: "referencia_estilo_quadro.png",
      video: "corte_exemplo_referencia.mp4",
      audio: "efeito_sonoro_swoosh.mp3",
      doc: "roteiro_planejado_vendas.pdf",
    };
    const nextAsset: ReferenceAsset = {
      id: `asset_${Date.now()}`,
      name: fileNamesMap[type],
      type,
      size: type === "video" ? "14.2 MB" : type === "image" ? "1.8 MB" : type === "audio" ? "600 KB" : "120 KB",
      status: "uploading",
      progress: 0,
    };
    setReferenceAssets((prev) => [...prev, nextAsset]);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      setReferenceAssets((prev) => prev.map((a) => (a.id === nextAsset.id ? { ...a, progress: prog } : a)));
      if (prog >= 100) {
        clearInterval(interval);
        setReferenceAssets((prev) => prev.map((a) => (a.id === nextAsset.id ? { ...a, status: "completed" } : a)));
      }
    }, 400);
  };

  const handleRemoveAsset = (id: string) => {
    setReferenceAssets(referenceAssets.filter((a) => a.id !== id));
  };

  const [videoStatus, setVideoStatus] = useState<"idle" | "analyzing" | "projecting" | "council_review" | "rendering" | "completed" | "rejected" | "exporting">("idle");
  const [progressVal, setProgressVal] = useState(0);
  const [exportPlatform, setExportPlatform] = useState<"4k" | "tiktok" | "reels" | "shorts" | null>(null);
  const [exportLogs, setExportLogs] = useState<string[]>([]);
  const [exportStep, setExportStep] = useState(0);
  
  const [rejectionError, setRejectionError] = useState("");
  const [absorbedFeedback, setAbsorbedFeedback] = useState<string[]>([]);
  const [councilMessages, setCouncilMessages] = useState<{agent: string, avatar: string, message: string, status: "thinking" | "approved"}[]>([]);

  const [videoScriptTitle, setVideoScriptTitle] = useState("Como Economizar 100% de APIs com YGGNAROK");
  const [videoAspect, setVideoAspect] = useState<"916" | "169">("916");
  const [videoTimeline, setVideoTimeline] = useState([
    { id: "clip_1", title: "Gancho de Vídeo (3s)", dur: "3s", script: "Você sabia que está jogando dinheiro fora usando IAs pagas para coisas simples?", type: "Gancho" },
    { id: "clip_2", title: "Apresentação (12s)", dur: "12s", script: "Apresento o YGGNAROK OS, seu centro de controle neural. Ele seleciona e direciona o modelo gratuito ideal para cada tarefa automaticamente.", type: "Conteúdo" },
    { id: "clip_3", title: "Demonstração (15s)", dur: "15s", script: "[Mostrar tela do canvas visual n8n neon pulsando e os dados fluindo em tempo real pelo navegador]", type: "Visual" },
    { id: "clip_4", title: "Chamada de Ação Final (10s)", dur: "10s", script: "Pare de ter surpresas na fatura de IA. Clique no link abaixo e inicie sua orquestra gratuita agora mesmo!", type: "CTA" },
  ]);

  const [videoGenre, setVideoGenre] = useState<"viral" | "educational" | "comedy" | "documentary" | "serious" | "sales">("viral");
  const [adaptationMode, setAdaptationMode] = useState<"liquid" | "fixed">("liquid");
  const [isScanningTrends, setIsScanningTrends] = useState(false);
  const [trendRadarLogs, setTrendRadarLogs] = useState<string[]>([
    "Gancho mais retentivo: Zoom Rápido no segundo 1.8.",
    "Batida Recomendada: Synthwave Melodic (124BPM).",
    "Estética do Algoritmo: Lettering Void & Amber piscante com ironia."
  ]);

  const runActiveTrendScan = () => {
    setIsScanningTrends(true);
    const mockLogs = [
      "🌐 Conectando radar YGGNAROK ao feed global de tendências...",
      "📈 Mapeando 14 padrões virais emergentes (Humor, Documentário)...",
      "⚡ Sintonizando transições dinâmicas baseadas em retenção mobile...",
      "🔥 Consciência de Gênero atualizada! Pesos sintonizados no Qwen-VL e Gemini!"
    ];

    let idx = 0;
    setTrendRadarLogs([mockLogs[0]]);

    const interval = setInterval(() => {
      idx++;
      if (idx < mockLogs.length) {
        setTrendRadarLogs(prev => [...prev, mockLogs[idx]]);
      } else {
        clearInterval(interval);
        setIsScanningTrends(false);
      }
    }, 1000);
  };

  const activePreset = allPresets[videoStyle] || DEFAULT_PRESETS["tiktok"];

  const filteredContents = contents.filter(c => {
    if (activeTab !== "videos" && activeTab !== "ideias" && !c.content_type?.toLowerCase().includes(activeTab.slice(0, -1))) return false;
    if (acervoFilter !== "todos") {
      const normalized = (c.status || "rascunho").toLowerCase().replace(/\s/g, "_");
      if (normalized !== acervoFilter && c.etapa_fluxo !== acervoFilter) return false;
    }
    if (acervoSearch && !c.title.toLowerCase().includes(acervoSearch.toLowerCase())) return false;
    return true;
  });

  const toggleChannel = (ch: string) => {
    setSelectedChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  const handleBriefingChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setManualIdea(val);
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPos);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    if (atMatch) {
      setShowChannelMention(true);
      setChannelFilter(atMatch[1].toLowerCase());
    } else {
      setShowChannelMention(false);
      setChannelFilter("");
    }
  };

  const selectChannelFromMention = (ch: string) => {
    if (!selectedChannels.includes(ch)) {
      setSelectedChannels(prev => [...prev, ch]);
    }
    if (briefingRef.current) {
      const val = manualIdea;
      const cursorPos = briefingRef.current.selectionStart;
      const textBeforeCursor = val.slice(0, cursorPos);
      const textAfterCursor = val.slice(cursorPos);
      const newTextBefore = textBeforeCursor.replace(/@\w*$/, `@${ch} `);
      const newVal = newTextBefore + textAfterCursor;
      setManualIdea(newVal);
      setTimeout(() => {
        const newPos = newTextBefore.length;
        briefingRef.current?.setSelectionRange(newPos, newPos);
        briefingRef.current?.focus();
      }, 0);
    }
    setShowChannelMention(false);
    setChannelFilter("");
  };

  const filteredMentionChannels = CHANNELS.filter(
    ch => ch.toLowerCase().includes(channelFilter) && !selectedChannels.includes(ch)
  );

  const handleSaveDraft = async () => {
    if (!manualTitle.trim()) { showToast("Preencha o título operacional.", "error"); return; }
    setActionLoading("draft");
    await new Promise(r => setTimeout(r, 800));
    const newItem: ContentItem = {
      id: `local-${Date.now()}`,
      profile_id: profiles[0]?.id || "",
      title: manualTitle.trim(),
      content_type: contentType,
      platform: selectedChannels.join(", ") || "Multicanal",
      idea: manualIdea.trim(),
      status: "rascunho",
      created_at: new Date().toISOString(),
      etapa_fluxo: "ideia",
      origem: "manual",
    };
    setContents(prev => [newItem, ...prev]);
    setManualTitle(""); setManualIdea(""); setRefinementInstructions("");
    setActionLoading(null);
    showToast("Rascunho salvo no Acervo!");
  };

  const handleSendForReview = async () => {
    if (!manualTitle.trim()) { showToast("Preencha o título operacional.", "error"); return; }
    setActionLoading("review");
    await new Promise(r => setTimeout(r, 1200));
    const newItem: ContentItem = {
      id: `local-${Date.now()}`,
      profile_id: profiles[0]?.id || "",
      title: manualTitle.trim(),
      content_type: contentType,
      platform: selectedChannels.join(", ") || "Multicanal",
      idea: manualIdea.trim(),
      status: "na_fila",
      created_at: new Date().toISOString(),
      etapa_fluxo: "ideia",
      origem: "manual",
      agente_executor: selectedAgent,
    };
    setContents(prev => [newItem, ...prev]);
    setManualTitle(""); setManualIdea(""); setRefinementInstructions("");
    setActionLoading(null);
    showToast("Pauta enviada para Fila do Agente!");
  };

  const handleGenerateContent = async () => {
    if (!manualTitle.trim()) { showToast("Preencha o título operacional.", "error"); return; }
    setActionLoading("generate");
    await new Promise(r => setTimeout(r, 1800));
    const newItem: ContentItem = {
      id: `local-${Date.now()}`,
      profile_id: profiles[0]?.id || "",
      title: manualTitle.trim(),
      content_type: contentType,
      platform: selectedChannels.join(", ") || "Multicanal",
      idea: manualIdea.trim(),
      status: "processando",
      created_at: new Date().toISOString(),
      etapa_fluxo: "ideia",
      origem: selectedAgent as ContentOrigem,
      agente_executor: selectedAgent,
    };
    setContents(prev => [newItem, ...prev]);
    setManualTitle(""); setManualIdea(""); setRefinementInstructions("");
    setActionLoading(null);
    showToast("Pipeline de geração por IA acionado!");
  };

  const getNextAction = (item: ContentItem) => {
    const etapa = item.etapa_fluxo || "ideia";
    const status = (item.status || "rascunho").toLowerCase().replace(/\s/g, "_");
    if (status === "processando") return { label: "Processando...", disabled: true, spinning: true };
    if (status === "erro") return { label: "Tentar novamente", disabled: false, spinning: false };
    if (etapa === "ideia" && (status === "rascunho" || status === "pronto" || status === "idea" || status === "pendente")) return { label: "Gerar Roteiro", disabled: false, spinning: false };
    if (etapa === "roteiro" && status === "pronto") return { label: "Gerar Legenda", disabled: false, spinning: false };
    if (etapa === "legenda" && status === "pronto") return { label: "Gerar Hashtags", disabled: false, spinning: false };
    if (etapa === "hashtag" && status === "pronto") return { label: "Concluir Pauta", disabled: false, spinning: false };
    return { label: "Abrir Conteúdo", disabled: false, spinning: false };
  };

  const handleUpdateClipScript = (id: string, nextText: string) => {
    setVideoTimeline(prev => prev.map(c => c.id === id ? { ...c, script: nextText } : c));
  };

  const runVideoEditingPipeline = async () => {
    setVideoStatus("analyzing");
    setProgressVal(15);
    setCouncilMessages([
      { agent: "Hefesto (Roteirista)", avatar: "🔨", message: "Iniciando verificação técnica de proporção e codec...", status: "thinking" }
    ]);
    await new Promise(r => setTimeout(r, 1000));
    setVideoStatus("projecting");
    setProgressVal(40);
    setCouncilMessages(prev => [
      ...prev,
      { agent: "Morax (Estrategista)", avatar: "🦉", message: "Calculando pontos críticos de retenção. Sugiro zoom no hook inicial.", status: "thinking" }
    ]);
    await new Promise(r => setTimeout(r, 1200));
    setVideoStatus("council_review");
    setProgressVal(75);
    setCouncilMessages(prev => [
      ...prev.map(c => ({ ...c, status: "approved" as const })),
      { agent: "Odin OS (Supervisor)", avatar: "👁️", message: "Ganchos e pacing aprovados sem custo de API! Renderizando cortes...", status: "thinking" }
    ]);
    await new Promise(r => setTimeout(r, 1500));
    setVideoStatus("completed");
    setProgressVal(100);
    setCouncilMessages(prev => prev.map(c => ({ ...c, status: "approved" as const })));
    showToast("Orquestra de vídeo finalizada com sucesso!");
  };

  const handleRejectVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionError.trim()) return;

    const errorFact = `[ERRO DE EDIÇÃO DE VÍDEO DETECTADO] Estilo: ${videoStyle}. Correção crítica exigida: ${rejectionError.trim()}`;
    const username = typeof window !== "undefined" ? (localStorage.getItem("yggnarok.username") || "kotaro") : "kotaro";
    const storedMems = localStorage.getItem(`yggnarok.${username}.ltm_memories`);
    let memoriesList = [];
    if (storedMems) {
      try {
        memoriesList = JSON.parse(storedMems);
      } catch (err) {}
    }
    const newMem = {
      id: `mem_video_error_${Date.now()}`,
      category: "tecnico" as const,
      fact: errorFact,
      timestamp: "Absorbido via Feedback de Edição",
      confidence: 100
    };
    localStorage.setItem(`yggnarok.${username}.ltm_memories`, JSON.stringify([newMem, ...memoriesList]));

    setAbsorbedFeedback([rejectionError.trim(), ...absorbedFeedback]);
    setVideoStatus("rejected");
    setRejectionError("");
    setProgressVal(0);
    setCouncilMessages([]);
  };

  const triggerPlatformPublish = (platform: "4k" | "tiktok" | "reels" | "shorts") => {
    setExportPlatform(platform);
    setVideoStatus("exporting");
    setExportStep(0);

    const stepsMap = {
      "4k": [
        "Iniciando Renderização H.264 / ProRes a 60fps...",
        "Calculando anti-aliasing vetorial e sobreposição neon...",
        "Ajustando bitrate de exportação para 50 Mbps (Qualidade Máxima)...",
        "✓ Sucesso! Vídeo salvo em ProRes 4K Ultra-HD sem compactação local!"
      ],
      tiktok: [
        "Conectando com a API oficial do TikTok...",
        "Ignorando compressão automática do servidor TikTok...",
        "Carregando vídeo original ProRes via Envio Fragmentado...",
        "✓ Sucesso! Vídeo publicado no TikTok em Resolução Nativa Máxima!"
      ],
      reels: [
        "Negociando codec HDR com a API do Instagram Graph...",
        "Estabilizando taxa de quadros e cores Void & Amber em 4K...",
        "Carregando arquivo brutamente em alta fidelidade...",
        "✓ Sucesso! Reels publicado em Altíssima Qualidade no Instagram!"
      ],
      shorts: [
        "Abrindo túnel de alta velocidade com o YouTube Creator API...",
        "Processando áudio original sem compactação em WAV...",
        "Transmitindo pacote de dados sem perdas...",
        "✓ Sucesso! YouTube Short agendado em Ultra-HD original!"
      ]
    };

    const steps = stepsMap[platform];
    setExportLogs([steps[0]]);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < steps.length) {
        setExportStep(idx);
        setExportLogs(prev => [...prev, steps[idx]]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setVideoStatus("idle");
          setExportPlatform(null);
          setExportLogs([]);
        }, 3000);
      }
    }, 2000);
  };

  return (
    <main className="min-h-screen text-foreground relative bg-background pb-20 select-none">
      
      {/* CSS Keyframe Injections for Rich Aesthetics */}
      <style>{`
        @keyframes subtleGlow {
          0% { border-color: rgba(245, 158, 11, 0.15); box-shadow: 0 0 10px rgba(245, 158, 11, 0.02); }
          50% { border-color: rgba(245, 158, 11, 0.35); box-shadow: 0 0 20px rgba(245, 158, 11, 0.08); }
          100% { border-color: rgba(245, 158, 11, 0.15); box-shadow: 0 0 10px rgba(245, 158, 11, 0.02); }
        }
        .glowing-panel {
          animation: subtleGlow 4s ease-in-out infinite;
        }
        .glowing-input:focus {
          border-color: rgba(245, 158, 11, 0.6);
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.2);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.4);
        }
      `}</style>

      {/* Exquisite Top Gradient Orbs (Illuminated for Legibility) */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-6 pt-8">
        
        {/* Dynamic Toast Feedback Overlay */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-extrabold shadow-2xl backdrop-blur-xl animate-bounce ${
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

        {/* ── Visual Studio Header & Navigation ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8 pb-6 border-b border-line/25">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand/75 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand leading-none">Studio de Criação Neuronal</span>
            </div>
            <h1 className="font-divine text-4xl sm:text-5xl font-black tracking-widest leading-tight bg-gradient-to-r from-brand via-amber-200 to-brand-strong bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-pulse">
              YGGNAROK Creation Hub
            </h1>
            <p className="text-xs text-muted mt-2 max-w-xl font-medium">Configure pautas, defina parâmetros de ingestão e acelere sua produção de mídias de alta retenção.</p>
          </div>

          {/* Slash Command Button (Menos Destaque, Clicável) */}
          <button 
            type="button"
            onClick={() => showToast("Comandos '/' estarão disponíveis em breve!")}
            className="flex items-center gap-2 bg-black/10 hover:bg-black/30 border border-line/20 hover:border-line/40 px-3 py-1.5 rounded-lg backdrop-blur-md transition-all duration-300 text-muted hover:text-white"
          >
            <Zap size={12} className="text-brand/50" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Comandos "/"</span>
          </button>
        </div>

        {/* ── 3-Column Symmetrical Studio Grid Workspace ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMN 1 & 2: Console de Criação (Left/Middle - 8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {activeTab !== "videos" ? (
              /* console de criação de conteúdo */
              <section className="rounded-2xl border border-line/40 bg-surface/60 p-6 shadow-2xl backdrop-blur-xl space-y-6 transition-all duration-300 focus-within:border-brand/30">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-line/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-8 place-items-center rounded-lg bg-brand/10 border border-brand/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      <Terminal size={15} className="text-brand" />
                    </div>
                    <div>
                      <h2 className="text-base font-black uppercase tracking-widest text-brand">Núcleo Neural de Ingestão</h2>
                      <p className="text-[10px] text-muted font-semibold tracking-wider">Defina a pauta bruta de entrada via texto ou comandos</p>
                    </div>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex items-center gap-1 bg-black/10 dark:bg-black/40 border border-line/20 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setCreationMode("manual")}
                      className={`px-3 py-1.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider transition ${
                        creationMode === "manual" ? "bg-neutral-800 text-brand font-black" : "text-muted hover:text-white"
                      }`}
                    >
                      Manual
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreationMode("ia")}
                      className={`px-3 py-1.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider transition ${
                        creationMode === "ia" ? "bg-neutral-800 text-brand font-black" : "text-muted hover:text-white"
                      }`}
                    >
                      Piloto Automático
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Inputs Grid */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Título Operacional</label>
                      <input
                        id="title-input"
                        type="text"
                        placeholder="Ex: 5 Dicas Rápidas de Prompt Engineering"
                        value={manualTitle}
                        onChange={(e) => setManualTitle(e.target.value)}
                        className="h-10 w-full rounded-lg border border-line bg-black/10 dark:bg-black/40 px-3 text-xs text-foreground outline-none focus:border-brand/40 transition placeholder:text-muted/40 font-semibold focus:ring-1 focus:ring-brand/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Tipo de Formato</label>
                      <select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="h-10 w-full rounded-lg border border-line bg-black/10 dark:bg-black/40 px-3 text-xs text-foreground outline-none focus:border-brand/40 transition font-semibold cursor-pointer"
                      >
                        {CONTENT_TYPES.map(ct => (
                          <option key={ct.value} value={ct.value} className="bg-neutral-900">{ct.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Briefing Field Imersivo */}
                  <div className="relative">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Conteúdo / Briefing Principal</label>
                    <div className="relative rounded-xl border border-line/40 bg-black/10 dark:bg-black/20 focus-within:border-brand/40 transition-all duration-500 shadow-inner">
                      <textarea
                        ref={briefingRef}
                        value={manualIdea}
                        onChange={handleBriefingChange}
                        onBlur={() => setTimeout(() => setShowChannelMention(false), 200)}
                        placeholder="Insira o seu fluxo criativo aqui... Digite @ para definir canais ou / para ações de IA."
                        rows={22}
                        className="w-full resize-none bg-transparent px-5 py-4 text-sm leading-loose text-white outline-none placeholder:text-muted/30 font-medium custom-scrollbar"
                      />

                      {/* Botões de Ação Embutidos no Textarea (Elegantes) */}
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { setManualTitle(""); setManualIdea(""); }}
                          className="grid size-10 place-items-center rounded-lg bg-black/40 hover:bg-rose-500/20 text-muted hover:text-rose-400 transition backdrop-blur-md border border-line/20"
                          title="Limpar formulário"
                        >
                          <RotateCcw size={14} />
                        </button>
                        
                        {creationMode === "manual" ? (
                          <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={actionLoading !== null || !manualIdea.trim()}
                            className="flex items-center gap-2 rounded-lg bg-black/60 hover:bg-black border border-line/20 px-5 py-2.5 text-xs font-bold text-neutral-300 hover:text-white transition backdrop-blur-md shadow-lg h-10 disabled:opacity-30"
                          >
                            {actionLoading === "draft" ? <Loader2 size={13} className="animate-spin text-brand" /> : <Check size={13} />}
                            <span>Salvar Rascunho</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleGenerateContent}
                            disabled={actionLoading !== null || !manualIdea.trim()}
                            className="flex items-center gap-2 rounded-lg bg-brand text-neutral-950 hover:bg-brand-strong px-6 py-2.5 text-xs font-black transition shadow-[0_0_20px_rgba(245,158,11,0.4)] h-10 disabled:opacity-30"
                          >
                            {actionLoading === "generate" ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                            <span>Gerar Mídia via IA</span>
                          </button>
                        )}
                      </div>

                      {/* @mention floating overlay */}
                      {showChannelMention && filteredMentionChannels.length > 0 && (
                        <div className="absolute left-5 bottom-16 mb-2 z-50 w-56 rounded-xl border border-line bg-surface-strong/95 shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-1.5 backdrop-blur-xl animate-fade-in-up">
                          <p className="px-3 py-1 text-[9px] font-black text-brand uppercase tracking-widest border-b border-line/10 mb-1">Canais e Redes</p>
                          {filteredMentionChannels.map(ch => (
                            <button
                              key={ch}
                              type="button"
                              onMouseDown={(e) => { e.preventDefault(); selectChannelFromMention(ch); }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-neutral-300 hover:bg-brand/15 hover:text-brand transition font-bold"
                            >
                              <AtSign size={12} className="text-brand/50" />
                              {ch}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </section>
            ) : (
              /* Estúdio de Vídeo Colaborativo */
              <section className="glowing-panel relative overflow-hidden rounded-2xl border-2 border-line/40 bg-surface/30 p-6 shadow-2xl backdrop-blur-xl space-y-6 transition-all duration-700 hover:border-brand/30 hover:shadow-[0_0_60px_-15px_rgba(245,158,11,0.15)]">
                {/* Motion Poetics Ambient Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/0 via-brand/0 to-brand/5 opacity-0 transition-opacity duration-700 hover:opacity-100 pointer-events-none" />
                
                <div className="relative z-10 flex items-center justify-between border-b border-line/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-8 place-items-center rounded-lg bg-rose-500/10 border border-rose-500/20">
                      <Film size={15} className="text-rose-400 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">Mesa de Edição Colaborativa</h2>
                      <p className="text-[10px] text-muted">Ajuste de mídias e cortes automáticos do conselho multi-agentes</p>
                    </div>
                  </div>

                  {videoStatus === "idle" && (
                    <button
                      onClick={runVideoEditingPipeline}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-black px-4 transition shadow-lg shadow-rose-500/15"
                    >
                      <Wand2 size={12} />
                      <span>Disparar Edição</span>
                    </button>
                  )}

                  {videoStatus !== "idle" && videoStatus !== "completed" && videoStatus !== "rejected" && videoStatus !== "exporting" && (
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                      <RefreshCw size={12} className="animate-spin" />
                      <span>{videoStatus === "analyzing" ? "Analisando..." : videoStatus === "projecting" ? "Cortando..." : "Conselho deliberando..."}</span>
                    </div>
                  )}

                  {videoStatus === "completed" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-extrabold text-emerald-400 uppercase">
                      <CheckCircle size={10} /> Render Ok
                    </span>
                  )}
                </div>

                {/* Progress Visualizer */}
                {(videoStatus !== "idle" && videoStatus !== "exporting") && (
                  <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${progressVal}%` }}
                    />
                  </div>
                )}

                {/* Local Video Ingestion settings */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Preset de Vídeo</label>
                      <select 
                        className="h-10 w-full rounded-lg border border-line bg-black/40 px-3 text-xs text-white outline-none focus:border-brand/40 transition font-semibold"
                        value={videoStyle}
                        onChange={(e) => setVideoStyle(e.target.value)}
                      >
                        {Object.keys(allPresets).map(key => (
                          <option key={key} value={key} className="bg-neutral-900">{allPresets[key].name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Formato</label>
                        <div className="grid grid-cols-2 gap-1 p-0.5 bg-black/40 border border-line rounded-lg">
                          <button 
                            type="button" 
                            onClick={() => setVideoAspect("916")}
                            className={`py-1.5 text-[10px] font-extrabold rounded transition ${videoAspect === "916" ? "bg-rose-500 text-white font-black" : "text-muted hover:text-white"}`}
                          >
                            9:16
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setVideoAspect("169")}
                            className={`py-1.5 text-[10px] font-extrabold rounded transition ${videoAspect === "169" ? "bg-rose-500 text-white font-black" : "text-muted hover:text-white"}`}
                          >
                            16:9
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Duração</label>
                        <div className="py-2 bg-black/40 border border-line rounded-lg text-xs font-bold text-center text-rose-400 font-mono">
                          {activePreset.duration}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side styling logs */}
                  <div className="rounded-xl border border-line bg-black/20 p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block mb-1">Diretivas do Preset</span>
                      <p className="text-[10px] text-muted leading-relaxed font-semibold">{activePreset.baseDirectives}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-line/10 flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold">
                      <Cpu size={12} className="shrink-0" />
                      <span>Processamento Local sem consumo de cota.</span>
                    </div>
                  </div>
                </div>

                {/* Grid Visual Timeline Preview */}
                <div className="grid gap-6 sm:grid-cols-12 border-t border-line/10 pt-5">
                  <div className="sm:col-span-4 flex flex-col items-center justify-start border-r border-line/10 pr-4">
                    <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider block mb-3 relative z-10">Simulação 4K HDR</span>
                    
                    <div className={`relative group/video overflow-hidden border border-white/10 bg-black rounded-xl flex flex-col items-center justify-center transition-all duration-700 hover:border-brand/40 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] hover:scale-[1.02] ${
                      videoAspect === "916" ? "h-[190px] w-[110px]" : "h-[110px] w-[190px]"
                    }`}>
                      {videoStatus === "rendering" || videoStatus === "analyzing" ? (
                        <div className="absolute inset-0 bg-neutral-950/80 flex flex-col items-center justify-center gap-2 z-20">
                          <Loader2 size={20} className="text-rose-400 animate-spin" />
                          <span className="text-[8px] text-rose-300 font-mono tracking-widest">RENDER...</span>
                        </div>
                      ) : null}
                      
                      <div className="absolute inset-0 border border-dashed border-white/5 grid grid-cols-3 grid-rows-3 pointer-events-none" />
                      <Video className="text-rose-500/20 size-7 transition-colors duration-700 group-hover/video:text-brand/40" />
                      <div className="absolute bottom-2 left-1.5 right-1.5 text-[6.5px] font-mono text-center text-white/40 truncate transition-colors duration-700 group-hover/video:text-brand/80">
                        {videoScriptTitle}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-8 space-y-4">
                    <div className="relative z-10 space-y-2">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest block">Cortes Estruturados</span>
                      
                      <div className="flex border border-line/40 bg-surface/40 backdrop-blur-md rounded-xl p-2 gap-2 overflow-x-auto custom-scrollbar shadow-inner">
                        {videoTimeline.map((clip, idx) => (
                          <div 
                            key={clip.id} 
                            className="group/clip flex-grow min-w-[100px] rounded-lg border border-line/40 bg-surface p-2.5 text-center relative overflow-hidden transition-all duration-500 hover:border-brand/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 cursor-pointer"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-brand/5 to-transparent opacity-0 transition-opacity duration-500 group-hover/clip:opacity-100 pointer-events-none" />
                            <span className="relative z-10 text-[7px] font-black uppercase text-rose-400 block tracking-widest transition-colors duration-500 group-hover/clip:text-brand">{clip.type}</span>
                            <span className="relative z-10 text-xs font-black text-foreground block mt-0.5">{clip.dur}</span>
                            <span className="relative z-10 text-[8px] text-muted block truncate mt-1">Corte #{idx+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Council Log Space */}
                    {(videoStatus === "council_review" || videoStatus === "completed") && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest block">Ata do Conselho de IA</span>
                        <div className="space-y-2 bg-black/40 rounded-xl p-3 border border-line max-h-[140px] overflow-y-auto custom-scrollbar">
                          {councilMessages.map((msg, idx) => (
                            <div key={idx} className="text-[10px] leading-normal flex items-start gap-2 border-b border-line/5 pb-1.5 last:border-0 last:pb-0">
                              <span className="size-5 rounded-full bg-neutral-800 border border-line/30 grid place-items-center text-xs shrink-0">{msg.avatar}</span>
                              <div className="flex-grow">
                                <span className="font-extrabold text-neutral-200 block">{msg.agent}</span>
                                <p className="text-muted mt-0.5">{msg.message}</p>
                              </div>
                              <span className={`text-[8px] font-extrabold uppercase shrink-0 px-1.5 py-0.5 rounded ${msg.status === "approved" ? "text-emerald-400 bg-emerald-500/5 border border-emerald-500/10" : "text-amber-400 bg-amber-500/5 animate-pulse"}`}>
                                {msg.status === "approved" ? "Ok" : "Fila"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Section inside Videos tab */}
                <div className="relative z-10 border-t border-line/10 pt-5 space-y-4">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest block">Arquivos de Ingestão de Referência</span>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <button 
                      type="button"
                      onClick={() => handleSimulateAssetUpload("image")}
                      className="group relative overflow-hidden flex flex-col items-center justify-center p-3 border border-line/40 bg-surface/40 hover:border-brand/40 transition-all duration-500 rounded-xl gap-1.5 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.2)] cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-brand/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                      <Image size={15} className="text-amber-400 transition-transform duration-500 group-hover:scale-125" />
                      <span className="text-[9px] font-extrabold text-muted transition-colors duration-500 group-hover:text-foreground">Quadro de Estilo</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleSimulateAssetUpload("video")}
                      className="group relative overflow-hidden flex flex-col items-center justify-center p-3 border border-line/40 bg-surface/40 hover:border-brand/40 transition-all duration-500 rounded-xl gap-1.5 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.2)] cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-brand/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                      <Play size={15} className="text-rose-400 transition-transform duration-500 group-hover:scale-125" />
                      <span className="text-[9px] font-extrabold text-muted transition-colors duration-500 group-hover:text-foreground">Corte Bruto</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleSimulateAssetUpload("audio")}
                      className="group relative overflow-hidden flex flex-col items-center justify-center p-3 border border-line/40 bg-surface/40 hover:border-brand/40 transition-all duration-500 rounded-xl gap-1.5 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.2)] cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-brand/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                      <Music size={15} className="text-sky-400 transition-transform duration-500 group-hover:scale-125" />
                      <span className="text-[9px] font-extrabold text-muted transition-colors duration-500 group-hover:text-foreground">Voz/Música</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleSimulateAssetUpload("doc")}
                      className="group relative overflow-hidden flex flex-col items-center justify-center p-3 border border-line/40 bg-surface/40 hover:border-brand/40 transition-all duration-500 rounded-xl gap-1.5 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.2)] cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-brand/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                      <FileText size={15} className="text-emerald-400 transition-transform duration-500 group-hover:scale-125" />
                      <span className="text-[9px] font-extrabold text-muted transition-colors duration-500 group-hover:text-foreground">Roteiro PDF</span>
                    </button>
                  </div>

                  {/* Upload List */}
                  {referenceAssets.length > 0 && (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {referenceAssets.map((asset) => (
                        <div key={asset.id} className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-black/40">
                          <div className="flex items-center gap-2 truncate">
                            <span className="size-6 rounded bg-neutral-900 border border-line flex items-center justify-center text-xs shrink-0">
                              {asset.type === "image" ? "🖼️" : asset.type === "video" ? "📹" : asset.type === "audio" ? "🎵" : "📄"}
                            </span>
                            <div className="truncate">
                              <span className="text-[10px] font-bold text-white block truncate max-w-[130px]">{asset.name}</span>
                              <span className="text-[8px] text-muted block">{asset.size}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {asset.status === "uploading" ? (
                              <span className="text-[9px] text-brand font-mono font-bold animate-pulse">{asset.progress}%</span>
                            ) : (
                              <span className="text-[8px] font-extrabold uppercase text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">Pronto</span>
                            )}
                            <button 
                              type="button" 
                              onClick={() => handleRemoveAsset(asset.id)}
                              className="text-muted hover:text-rose-400 text-xs px-1"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Export Hub */}
                {videoStatus === "completed" && (
                  <div className="relative z-10 border-t border-line/15 pt-5 space-y-4">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest block">Exportação ProRes &amp; Distribuição</span>
                    
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <button 
                        onClick={() => triggerPlatformPublish("4k")}
                        className="group relative overflow-hidden flex flex-col items-center justify-center p-3 border border-brand/20 bg-brand/5 hover:border-brand/40 hover:bg-brand/10 transition-all duration-500 rounded-xl gap-1 text-center hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.3)] cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand/0 via-brand/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                        <Film size={15} className="text-brand animate-pulse transition-transform duration-500 group-hover:scale-125" />
                        <span className="text-[10px] font-extrabold text-foreground block transition-colors duration-500">Render ProRes 4K</span>
                        <span className="text-[8px] text-muted block">Ultra HD Local</span>
                      </button>
                      <button 
                        onClick={() => triggerPlatformPublish("tiktok")}
                        className="group relative overflow-hidden flex flex-col items-center justify-center p-3 border border-line/40 bg-surface/40 hover:border-brand/40 transition-all duration-500 rounded-xl gap-1 text-center hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2)] cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand/0 via-brand/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                        <MessageSquare size={15} className="text-pink-400 transition-transform duration-500 group-hover:scale-125" />
                        <span className="text-[10px] font-extrabold text-foreground block transition-colors duration-500 group-hover:text-pink-400">Subir TikTok</span>
                        <span className="text-[8px] text-muted block">API Direta Original</span>
                      </button>
                      <button 
                        onClick={() => triggerPlatformPublish("reels")}
                        className="group relative overflow-hidden flex flex-col items-center justify-center p-3 border border-line/40 bg-surface/40 hover:border-brand/40 transition-all duration-500 rounded-xl gap-1 text-center hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2)] cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand/0 via-brand/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                        <Heart size={15} className="text-rose-400 transition-transform duration-500 group-hover:scale-125" />
                        <span className="text-[10px] font-extrabold text-foreground block transition-colors duration-500 group-hover:text-rose-400">Agendar Reels</span>
                        <span className="text-[8px] text-muted block">Instagram HDR 4K</span>
                      </button>
                      <button 
                        onClick={() => triggerPlatformPublish("shorts")}
                        className="group relative overflow-hidden flex flex-col items-center justify-center p-3 border border-line/40 bg-surface/40 hover:border-brand/40 transition-all duration-500 rounded-xl gap-1 text-center hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2)] cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand/0 via-brand/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                        <Play size={15} className="text-red-400 transition-transform duration-500 group-hover:scale-125" />
                        <span className="text-[10px] font-extrabold text-foreground block transition-colors duration-500 group-hover:text-red-400">YouTube Shorts</span>
                        <span className="text-[8px] text-muted block">Sem compactação</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Export logs */}
                {videoStatus === "exporting" && exportPlatform && (
                  <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={12} className="animate-spin text-brand" />
                      <span className="text-[10px] font-bold text-brand uppercase tracking-wider">Distribuição Nativa ativa...</span>
                    </div>

                    <div className="space-y-1.5 border border-line/10 rounded-lg p-3 bg-black font-mono text-[9px] text-muted">
                      {exportLogs.map((log, idx) => (
                        <p key={idx} className="flex items-center gap-1.5">
                          {idx === exportStep ? (
                            <span className="text-brand animate-pulse">&gt;</span>
                          ) : (
                            <span className="text-emerald-400">✓</span>
                          )}
                          <span>{log}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejection Feedbacks */}
                {videoStatus === "completed" && (
                  <div className="border-t border-line/15 pt-5 space-y-4">
                    <div className="bg-black/40 rounded-xl p-4 border border-line/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Award size={13} className="text-brand" /> Revisão do Corte
                        </h4>
                        <p className="text-[10px] text-muted">Aprove o vídeo ou envie de volta com aprendizados LTM.</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setVideoStatus("idle");
                            showToast("Vídeo aceito e salvo no Acervo!");
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 text-xs font-extrabold transition"
                        >
                          Aceitar Corte
                        </button>
                        <button 
                          onClick={() => setVideoStatus("rejected")}
                          className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition"
                        >
                          Recusar &amp; Ajustar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {videoStatus === "rejected" && (
                  <form onSubmit={handleRejectVideo} className="border-t border-line/15 pt-5 space-y-3">
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-1">
                      <h4 className="text-xs font-extrabold text-rose-400 flex items-center gap-1.5">
                        <ShieldAlert size={13} /> O que deve ser melhorado?
                      </h4>
                      <p className="text-[10px] text-muted leading-relaxed">
                        Descreva as alterações exigidas. Seus feedbacks de rejeição são gravados na <strong>Long-Term Memory</strong> das IAs para que elas aprimorem a edição e não repitam erros nos próximos vídeos.
                      </p>
                    </div>

                    <textarea
                      required
                      className="w-full rounded-xl border border-line bg-black/40 p-3 text-xs text-white placeholder:text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20 font-medium"
                      rows={3}
                      value={rejectionError}
                      onChange={(e) => setRejectionError(e.target.value)}
                      placeholder="Ex: Diminuir o pacing das legendas centrais no final e usar música mais tranquila..."
                    />

                    <div className="flex justify-end">
                      <button className="flex items-center gap-2 rounded-xl bg-brand py-2 px-5 text-xs font-black text-neutral-950 shadow-md transition hover:bg-brand-strong">
                        <Wand2 size={12} />
                        <span>Injetar Neural Feedback</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Active Error Feedback history */}
                {absorbedFeedback.length > 0 && (
                  <div className="rounded-xl border border-brand/20 bg-brand/5 p-3 space-y-1.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
                      <Brain size={12} className="animate-pulse" /> Memória LTM Neural Injetada
                    </span>
                    <div className="text-[9px] text-muted space-y-1 font-semibold">
                      {absorbedFeedback.map((fb, idx) => (
                        <p key={idx} className="flex items-center gap-1.5">
                          <span className="text-brand font-bold">•</span>
                          <span>Refinamento Absorvido: <em>&quot;{fb}&quot;</em></span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

              </section>
            )}

          </div>

          {/* COLUMN 3: Sintonia Fina & Odin Supervisor (Right - 4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Painel de Controle de Temperatura Isolado (Premium mas sutil) */}
            <section className="rounded-2xl border border-line/10 bg-surface/40 p-6 backdrop-blur-xl space-y-6 transition-all duration-500 hover:border-line/30">
              <div className="flex items-center gap-2.5 pb-4 border-b border-line/10">
                <div className="grid size-8 place-items-center rounded bg-brand/10 border border-brand/20 shadow-inner">
                  <Sliders size={14} className="text-brand" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-foreground block">Cognição Criativa</span>
                  <span className="text-[9px] text-muted font-bold">Ajuste neural de fidelidade vs criatividade</span>
                </div>
              </div>

              {/* Fine Tuning Creativeness */}
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between text-[11px] font-black">
                  <span className="text-brand/80 uppercase tracking-widest">Temperatura Local</span>
                  <span className="text-brand font-mono text-xs bg-brand/10 px-2 py-0.5 rounded border border-brand/20">{learningMargin}%</span>
                </div>
                
                <div className="relative pt-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={learningMargin}
                    onChange={(e) => setLearningMargin(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-900 rounded-full appearance-none cursor-pointer accent-brand shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/20 to-transparent pointer-events-none blur-md mix-blend-screen" />
                </div>
                
                <div className="flex justify-between text-[9px] text-muted/80 font-mono font-black uppercase tracking-widest">
                  <span>Modo Fiel</span>
                  <span>Alucinação Criativa</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between bg-black/30 dark:bg-black/50 rounded-xl p-4 border border-line/20 shadow-inner">
                <div>
                  <span className="text-[11px] font-black text-white block uppercase tracking-wider">Cota Grátis Llama 3.3</span>
                  <span className="text-[9px] text-muted font-semibold block leading-tight mt-1">Ative para não gastar credits OpenRouter.</span>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setAutoFreeTier(!autoFreeTier);
                    showToast(autoFreeTier ? "Foco em Alto Desempenho!" : "Foco em Economia Total!");
                  }}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 focus:outline-none shadow-lg ${autoFreeTier ? "bg-brand shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "bg-neutral-800"}`}
                >
                  <span className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow transition-all duration-300 ${autoFreeTier ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </section>

            {/* 📈 Active Trend Radar Panel */}
            <section className="glowing-panel rounded-2xl border border-line bg-surface/30 p-5 shadow-sm backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-line/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="grid size-6 place-items-center rounded bg-brand/5 border border-brand/20">
                    <Radio size={12} className="text-brand animate-pulse" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-foreground">Radar de Tendências Ativo</span>
                </div>
                <span className="text-[8px] text-muted font-bold tracking-widest">TEMPO REAL</span>
              </div>

              <p className="text-[10.5px] text-muted leading-relaxed font-medium">
                Mapeamento das tendências de áudio, transição e copy mais retentivos da semana.
              </p>

              <div className="space-y-1.5 p-3 rounded-lg bg-black/40 border border-line/10 font-mono text-[9px] text-muted">
                {trendRadarLogs.map((log, idx) => (
                  <p key={idx} className="truncate select-none leading-snug">• {log}</p>
                ))}
              </div>

              <button
                type="button"
                onClick={runActiveTrendScan}
                disabled={isScanningTrends}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand text-neutral-950 hover:bg-brand-strong py-2 text-xs font-black transition"
              >
                <RefreshCw size={11} className={isScanningTrends ? "animate-spin" : ""} />
                <span>{isScanningTrends ? "Mapeando Redes..." : "Recarregar Radar"}</span>
              </button>
            </section>

          </div>

        </div>

        {/* ── SECTION 3: Symmetrical Acervo Operacional (Full Width Bottom) ── */}
        {activeTab !== "videos" && (
          <div className="mt-8">
            <section className="glowing-panel rounded-2xl border border-line bg-surface/30 p-6 shadow-sm backdrop-blur-xl">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line/10 pb-4 mb-6 gap-4">
                <div>
                  <h2 className="text-base font-black tracking-tight text-foreground flex items-center gap-2">
                    <Layers size={16} className="text-brand" />
                    <span>Acervo Operacional</span>
                  </h2>
                  <p className="text-[10px] text-muted mt-0.5">Acompanhe e progrida suas ideias e pautas ao longo de todas as etapas de criação</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-[10px] font-black text-brand uppercase tracking-wider">
                    {filteredContents.length} Itens Encontrados
                  </span>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={13} />
                  <input
                    type="text"
                    placeholder="Filtrar acervo operacional por título..."
                    value={acervoSearch}
                    onChange={(e) => setAcervoSearch(e.target.value)}
                    className="h-10 w-full rounded-lg border border-line bg-black/10 dark:bg-black/40 pl-9 pr-3 text-xs text-foreground outline-none focus:border-brand/40 transition placeholder:text-muted/40 font-semibold focus:ring-1 focus:ring-brand/20"
                  />
                </div>
                <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
                  {["todos", "rascunho", "na_fila", "processando", "pronto", "erro"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setAcervoFilter(f)}
                      className={`rounded-lg px-3 py-2 text-[9px] font-extrabold uppercase tracking-wider border transition shrink-0 ${
                        acervoFilter === f 
                          ? "border-brand bg-brand/10 text-brand font-black" 
                          : "border-line bg-black/20 text-muted hover:text-white"
                      }`}
                    >
                      {f.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista Ultra-Compacta */}
              <div className="flex flex-col rounded-xl overflow-hidden border border-line bg-black/20">
                {/* Header Table */}
                <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-line/20 bg-black/40 text-[9px] font-black uppercase tracking-widest text-muted">
                  <div className="col-span-4">Pauta / Título</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-2">Formato</div>
                  <div className="col-span-2">Plataforma</div>
                  <div className="col-span-1 text-right">Ação</div>
                </div>
                
                {filteredContents.length > 0 ? (
                  filteredContents.map((item) => {
                    const normalizedStatus = (item.status || "rascunho").toLowerCase().replace(/\s/g, "_");
                    const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG["rascunho"];

                    return (
                      <div 
                        key={item.id} 
                        className="group grid grid-cols-12 gap-4 items-center px-5 py-3 border-b border-line/10 last:border-0 hover:bg-surface/30 transition-colors cursor-pointer"
                        onClick={() => {
                          setManualTitle(item.title);
                          setManualIdea(item.idea);
                          showToast("Pauta carregada no Console!");
                        }}
                      >
                        {/* Title & Idea Tooltip */}
                        <div className="col-span-4 truncate">
                          <span className="text-[11px] font-bold text-foreground group-hover:text-brand transition block truncate">{item.title}</span>
                          <span className="text-[9px] text-muted truncate block">{item.idea.substring(0, 45)}...</span>
                        </div>
                        
                        {/* Status Label Compact */}
                        <div className="col-span-3">
                          <span className={`inline-flex items-center justify-center rounded border px-2 py-0.5 text-[8.5px] font-extrabold uppercase tracking-wider ${config.color} border-current/25 bg-current/5`}>
                            {config.label}
                          </span>
                        </div>
                        
                        {/* Format */}
                        <div className="col-span-2">
                          <span className="text-[10px] font-semibold text-neutral-300">{item.content_type || "Pauta"}</span>
                        </div>
                        
                        {/* Platform */}
                        <div className="col-span-2">
                          <span className="text-[10px] font-bold text-brand/80 truncate block">{item.platform || "Multicanais"}</span>
                        </div>
                        
                        {/* Quick Menu Actions */}
                        <div className="col-span-1 flex justify-end">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setContents(prev => prev.filter(c => c.id !== item.id));
                              showToast("Pauta deletada!");
                            }}
                            className="text-muted hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Apagar Pauta"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-xs text-muted font-bold">Nenhuma pauta no Acervo.</p>
                  </div>
                )}
              </div>

            </section>
          </div>
        )}

      </div>
    </main>
  );
}
