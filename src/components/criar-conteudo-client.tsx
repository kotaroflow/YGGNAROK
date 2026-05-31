"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Lightbulb, ScrollText, Subtitles, Hash, Brain, Send, Sparkles, 
  Wand2, Layers, CheckCircle, Film, Play, Sliders, AlertTriangle, 
  Trash2, ShieldAlert, Cpu, HelpCircle, ArrowRight, Video, Scissors,
  Upload, Music, Radio, Star, Award, Heart, MessageSquare, ThumbsUp, RefreshCw, Plus, X, FileText, Image, Check,
  MoreVertical, Copy, RotateCcw, Loader2, Filter, Search, Zap, ChevronRight
} from "lucide-react";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";

type Profile = {
  id: string;
  name: string;
};

type EtapaFluxo = "ideia" | "roteiro" | "legenda" | "hashtag" | "publicacao";
type ContentStatus = "rascunho" | "na_fila" | "processando" | "em_revisao" | "pronto" | "erro";
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

// ── Content Type Options ─────────────────────────────────────────────────────
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

// ── Status visual config ─────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  rascunho:    { label: "Rascunho",     color: "text-neutral-400", bg: "bg-neutral-500/10 border-neutral-500/20" },
  na_fila:     { label: "Na fila",      color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
  processando: { label: "Processando",  color: "text-sky-400",     bg: "bg-sky-500/10 border-sky-500/20" },
  em_revisao:  { label: "Em revisão",   color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20" },
  pronto:      { label: "Pronto",       color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  erro:        { label: "Erro",         color: "text-rose-400",    bg: "bg-rose-500/10 border-rose-500/20" },
  // Legacy fallbacks
  idea:        { label: "Rascunho",     color: "text-neutral-400", bg: "bg-neutral-500/10 border-neutral-500/20" },
  Pendente:    { label: "Rascunho",     color: "text-neutral-400", bg: "bg-neutral-500/10 border-neutral-500/20" },
};

const ETAPA_CONFIG: Record<string, { label: string; icon: typeof Lightbulb }> = {
  ideia:      { label: "Ideia",      icon: Lightbulb },
  roteiro:    { label: "Roteiro",    icon: ScrollText },
  legenda:    { label: "Legenda",    icon: Subtitles },
  hashtag:    { label: "Hashtag",    icon: Hash },
  publicacao:  { label: "Publicação", icon: Send },
};

// ── Demo data for empty Acervo ───────────────────────────────────────────────
const DEMO_CONTENTS: ContentItem[] = [
  { id: "demo-1", profile_id: "", title: "Estratégia de Lançamento Q3", content_type: "campanha", platform: "Multicanal", idea: "Campanha integrada para lançamento do produto principal no terceiro trimestre, com foco em topo de funil.", status: "pronto", created_at: new Date(Date.now() - 86400000).toISOString(), etapa_fluxo: "roteiro", origem: "hefesto" },
  { id: "demo-2", profile_id: "", title: "Reels Topo de Funil — Engenharia de Prompt", content_type: "reel", platform: "Instagram", idea: "Série de 5 reels curtos mostrando técnicas de prompt engineering para iniciantes.", status: "processando", created_at: new Date(Date.now() - 172800000).toISOString(), etapa_fluxo: "ideia", origem: "manual" },
  { id: "demo-3", profile_id: "", title: "Sequência de Posts — IAs Gratuitas", content_type: "carrossel", platform: "Instagram", idea: "Carrossel educativo comparando 5 IAs gratuitas com alto desempenho para criadores de conteúdo.", status: "rascunho", created_at: new Date(Date.now() - 259200000).toISOString(), etapa_fluxo: "ideia", origem: "manual" },
];

const tabs = [
  { id: "ideias", label: "Ideias", icon: Lightbulb, description: "Novas Pautas", color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30" },
  { id: "roteiros", label: "Roteiros", icon: ScrollText, description: "Scripts e Falas", color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30" },
  { id: "legendas", label: "Legendas", icon: Subtitles, description: "Copy e Ganchos", color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30" },
  { id: "hashtags", label: "Hashtags", icon: Hash, description: "Tags e Alcance", color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30" },
  { id: "videos", label: "Estúdio de Vídeo", icon: Film, description: "Cortes e Linha do Tempo", color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30" },
];

const DEFAULT_PRESETS: Record<string, VideoStylePreset> = {
  tiktok: {
    name: "Estilo TikTok & Reels (Retenção Acelerada)",
    duration: "15s - 60s (Alta Frequência)",
    trendingMusic: ["'Void Echoes' (Lofi Synthwave)", "'Amber Pulse' (Techno Melodic)", "'Kotaro Vibe' (Acoustic Trap)"],
    trendingTransitions: ["Zoom Rápido a cada 1.5s", "Legendas de Destaque Neon Central", "Efeitos Sonoros 'Swoosh'"],
    mostSearched: ["Engenharia de Prompt Inteligente", "IAs Gratuitas sem Limites", "Automação no Navegador"],
    baseDirectives: "Ritmo frenético, hook de impacto nos primeiros 2.5 segundos, zero pausas respiratórias, paleta Void & Amber vibrante com legendas de duas palavras por frame."
  },
  youtube: {
    name: "Estilo Vlogging / Explicativo no YouTube",
    duration: "5m - 12m (Engajamento Profundo)",
    trendingMusic: ["'Cyber Coffee' (Chill Beats)", "'Infinite Drift' (Ambient Synth)"],
    trendingTransitions: ["Cortes Secos Estruturados", "B-Rolls de Softwares Neon", "Zoom Lento de Ponto de Ênfase"],
    mostSearched: ["Como criar agente de autoaprendizado", "Supabase vs LocalStorage no NextJS", "Estúdio de Nodes Neon"],
    baseDirectives: "Pacing conversacional premium, transição explicativa visual a cada 10s, introdução estruturada do problema, tela limpa com cards informativos sobrepostos."
  },
  cinematic: {
    name: "Estilo Documentário & Mini-Histórias",
    duration: "2m - 5m (Imersão Dramática)",
    trendingMusic: ["'Odyssey Orchestral' (Dramático)", "'Deep Void' (Soundscape Cinematográfico)"],
    trendingTransitions: ["Fade to Black Suave", "Sobreposição de Texturas de Luz", "Sound Design Sub-grave"],
    mostSearched: ["Evolução de Sistemas AI", "Privacidade Digital Multi-tenant", "História do YGGNAROK"],
    baseDirectives: "Foco estético em mistério, gradação de cores âmbar escuras, pausas dramáticas com trilha subindo de volume, voz grave e firme com frases curtas de alta reflexão."
  },
  sales: {
    name: "VSL de Vendas de Alta Conversão",
    duration: "3m - 8m (Persuasão & Neuro-copy)",
    trendingMusic: ["'Ascension' (Trilha de Tensão Crescente)", "'Resolution' (Trilha Heroica de Fechamento)"],
    trendingTransitions: ["Quebras de Padrão Agressivas", "Lettering Amber Piscante", "Efeito de Máquina de Escrever"],
    mostSearched: ["Como economizar R$15.000 em APIs", "Melhores agentes para vendas automática", "Roteamento inteligente de modelos"],
    baseDirectives: "Copy focada na dor imediata, quebra de objeção a cada 4 frames, música de suspense crescendo até a revelação da oferta, CTA claro de urgência no fim."
  }
};

export function CriarConteudoClient({ profiles, initialContents, activeTab: currentTab }: CriarConteudoClientProps) {
  const [activeTab, setActiveTab] = useState(currentTab);
  // Use demo data when DB is empty (P0: remove test data)
  const [contents, setContents] = useState<ContentItem[]>(
    initialContents.length > 0 ? initialContents : DEMO_CONTENTS
  );
  
  // ── Creation mode: Manual vs IA Especializada (P1: clear separation) ──
  const [creationMode, setCreationMode] = useState<"manual" | "ia">("manual");
  
  // ── Form fields (P0: proper dropdowns) ──
  const [contentType, setContentType] = useState("ideia");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [refinementInstructions, setRefinementInstructions] = useState("");
  
  // ── Acervo filters (P2: simple filters) ──
  const [acervoFilter, setAcervoFilter] = useState<string>("todos");
  const [acervoSearch, setAcervoSearch] = useState("");
  const [openCardMenu, setOpenCardMenu] = useState<string | null>(null);
  
  // ── Toast notification (P1: feedback) ──
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);
  
  // 🧠 1. Margem de Aprendizado & Perfeição Slider
  const [learningMargin, setLearningMargin] = useState(85);
  const [autoFreeTier, setAutoFreeTier] = useState(true);

  // ⚠️ 2. Real-time content character counter & dynamic models warning
  const [manualTitle, setManualTitle] = useState("");
  const [manualIdea, setManualIdea] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("hefesto");
  const [aiInstructions, setAiInstructions] = useState("");

  const estimatedCharacters = manualTitle.length + manualIdea.length + aiInstructions.length;
  const isApproachingLimit = estimatedCharacters > 500;

  // 📹 3. Dynamic Styles presets and Custom registration Form
  const [videoStyle, setVideoStyle] = useState<string>("tiktok");
  const [allPresets, setAllPresets] = useState<Record<string, VideoStylePreset>>(DEFAULT_PRESETS);
  const [showStyleCreator, setShowStyleCreator] = useState(false);
  
  // Custom Style Form inputs
  const [customStyleName, setCustomStyleName] = useState("");
  const [customStyleDuration, setCustomStyleDuration] = useState("");
  const [customStyleMusic, setCustomStyleMusic] = useState("");
  const [customStyleTransitions, setCustomStyleTransitions] = useState("");
  const [customStyleDirectives, setCustomStyleDirectives] = useState("");

  // 📥 4. Ingestão de Referências Multi-formato (imagens, vídeos, áudios, docs)
  const [referenceAssets, setReferenceAssets] = useState<ReferenceAsset[]>([]);
  const [referenceLink, setReferenceLink] = useState("");
  const [editingInstructions, setEditingInstructions] = useState("");

  // 🚀 5. High-resolution Ultra-HD Export & Publication Hub states
  const [videoStatus, setVideoStatus] = useState<"idle" | "analyzing" | "projecting" | "council_review" | "rendering" | "completed" | "rejected" | "exporting">("idle");
  const [progressVal, setProgressVal] = useState(0);
  const [exportPlatform, setExportPlatform] = useState<"4k" | "tiktok" | "reels" | "shorts" | null>(null);
  const [exportLogs, setExportLogs] = useState<string[]>([]);
  const [exportStep, setExportStep] = useState(0);
  
  // Collaborative Consensus Council
  const [rejectionError, setRejectionError] = useState("");
  const [absorbedFeedback, setAbsorbedFeedback] = useState<string[]>([]);
  const [councilMessages, setCouncilMessages] = useState<{agent: string, avatar: string, message: string, status: "thinking" | "approved"}[]>([]);

  // Video timeline cuts blueprint
  const [videoScriptTitle, setVideoScriptTitle] = useState("Como Economizar 100% de APIs com YGGNAROK");
  const [videoAspect, setVideoAspect] = useState<"916" | "169">("916");
  const [videoTimeline, setVideoTimeline] = useState([
    { id: "clip_1", title: "Hook de Vídeo (3s)", dur: "3s", script: "Você sabia que está jogando dinheiro fora usando IAs pagas para coisas simples?", type: "Hook" },
    { id: "clip_2", title: "Apresentação (12s)", dur: "12s", script: "Apresento o YGGNAROK OS, seu centro de controle neural. Ele seleciona e direciona o modelo gratuito ideal para cada tarefa automaticamente.", type: "Content" },
    { id: "clip_3", title: "Demonstração (15s)", dur: "15s", script: "[Mostrar tela do canvas visual n8n neon pulsando e os dados fluindo em tempo real pelo navegador]", type: "Visual" },
    { id: "clip_4", title: "CTA Final (10s)", dur: "10s", script: "Pare de ter surpresas na fatura de IA. Clique no link abaixo e inicie sua orquestra gratuita agora mesmo!", type: "CTA" },
  ]);

  // Simulated raw files upload
  const [rawFiles, setRawFiles] = useState<string[]>([
    "arquivo_bruto_intro_kotaro.mp4",
    "b-roll_canvas_nodes.mov"
  ]);
  const [newFileName, setNewFileName] = useState("");

  // ⚡ 6. Consciência Ativa de Trends e Gêneros
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

  const activeTabObj = tabs.find(t => t.id === activeTab) || tabs[0];
  const activePreset = allPresets[videoStyle] || DEFAULT_PRESETS["tiktok"];

  // ── Filtered Acervo (P2: filters) ──
  const filteredContents = contents.filter(c => {
    // Tab filter
    if (activeTab !== "ideias" && !c.content_type?.toLowerCase().includes(activeTab.slice(0, -1))) return false;
    // Status filter
    if (acervoFilter !== "todos") {
      const normalized = (c.status || "rascunho").toLowerCase().replace(/\s/g, "_");
      if (normalized !== acervoFilter && c.etapa_fluxo !== acervoFilter) return false;
    }
    // Search filter
    if (acervoSearch && !c.title.toLowerCase().includes(acervoSearch.toLowerCase())) return false;
    return true;
  });

  // ── Channel toggle helper ──
  const toggleChannel = (ch: string) => {
    setSelectedChannels(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch]);
  };

  // ── P1: Action handlers (save draft, review IA, generate full) ──
  const handleSaveDraft = async () => {
    if (!manualTitle.trim()) { showToast("Preencha o título operacional.", "error"); return; }
    setActionLoading("draft");
    // Simulate save — in production: Supabase insert
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
    showToast("Rascunho salvo com sucesso!");
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
    showToast("Enviado para revisão IA!");
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
    showToast("Pipeline de geração acionado! Acompanhe no Acervo.");
  };

  // ── Next action helper for Acervo cards ──
  const getNextAction = (item: ContentItem) => {
    const etapa = item.etapa_fluxo || "ideia";
    const status = (item.status || "rascunho").toLowerCase().replace(/\s/g, "_");
    if (status === "processando") return { label: "Processando...", disabled: true, spinning: true };
    if (status === "erro") return { label: "Tentar novamente", disabled: false, spinning: false };
    if (etapa === "ideia" && (status === "rascunho" || status === "pronto" || status === "idea" || status === "pendente")) return { label: "Gerar roteiro", disabled: false, spinning: false };
    if (etapa === "roteiro" && status === "pronto") return { label: "Gerar legenda", disabled: false, spinning: false };
    if (etapa === "legenda" && status === "pronto") return { label: "Gerar hashtags", disabled: false, spinning: false };
    if (etapa === "hashtag" && status === "pronto") return { label: "Preparar publicação", disabled: false, spinning: false };
    return { label: "Abrir", disabled: false, spinning: false };
  };

  const handleUpdateClipScript = (id: string, nextText: string) => {
    setVideoTimeline(prev => prev.map(c => c.id === id ? { ...c, script: nextText } : c));
  };

  const handleAddRawFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    setRawFiles([...rawFiles, newFileName.trim()]);
    setNewFileName("");
  };

  const handleRemoveRawFile = (index: number) => {
    setRawFiles(rawFiles.filter((_, i) => i !== index));
  };

  // Register a new Custom Style preset
  const handleCreateCustomStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStyleName.trim() || !customStyleDirectives.trim()) return;

    const styleKey = `custom_${Date.now()}`;
    const newPreset: VideoStylePreset = {
      name: `✨ ${customStyleName.trim()} (Estilo Único)`,
      duration: customStyleDuration.trim() || "Configuração Livre",
      trendingMusic: customStyleMusic ? customStyleMusic.split(",").map(m => m.trim()) : ["Músicas Customizadas"],
      trendingTransitions: customStyleTransitions ? customStyleTransitions.split(",").map(t => t.trim()) : ["Transições livres"],
      mostSearched: ["Configurações customizadas do Kotaro"],
      baseDirectives: customStyleDirectives.trim(),
      isCustom: true
    };

    setAllPresets(prev => ({
      ...prev,
      [styleKey]: newPreset
    }));
    setVideoStyle(styleKey);
    setShowStyleCreator(false);
    
    // Clear fields
    setCustomStyleName("");
    setCustomStyleDuration("");
    setCustomStyleMusic("");
    setCustomStyleTransitions("");
    setCustomStyleDirectives("");
  };

  // Simulate Smart Chunk Uploading of Reference Files (Images, Videos, Audios, Docs)
  const handleSimulateAssetUpload = (type: "image" | "video" | "audio" | "doc") => {
    const fileNamesMap = {
      image: "referencia_estilo_moodboard.png",
      video: "corte_exemplo_referencia.mp4",
      audio: "efeito_sonoro_swoosh.mp3",
      doc: "roteiro_planejado_vendas.pdf"
    };

    const nextAsset: ReferenceAsset = {
      id: `asset_${Date.now()}`,
      name: fileNamesMap[type],
      type,
      size: type === "video" ? "14.2 MB" : type === "image" ? "1.8 MB" : type === "audio" ? "600 KB" : "120 KB",
      status: "uploading",
      progress: 0
    };

    setReferenceAssets(prev => [...prev, nextAsset]);

    // Simulate chunk stream processing
    let prog = 0;
    const interval = setInterval(() => {
      prog += 25;
      setReferenceAssets(prev => prev.map(a => a.id === nextAsset.id ? { ...a, progress: prog } : a));

      if (prog >= 100) {
        clearInterval(interval);
        setReferenceAssets(prev => prev.map(a => a.id === nextAsset.id ? { ...a, status: "completed" } : a));
      }
    }, 400);
  };

  const handleRemoveAsset = (id: string) => {
    setReferenceAssets(referenceAssets.filter(a => a.id !== id));
  };

  // Autonomous Collaborative Multi-Agent video editing pipeline
  const runVideoEditingPipeline = () => {
    if (videoStatus !== "idle" && videoStatus !== "rejected") return;

    setProgressVal(10);
    setVideoStatus("analyzing");

    // 1. Analysis Phase (2 seconds)
    setTimeout(() => {
      setProgressVal(35);
      setVideoStatus("projecting");
      
      // 2. Projecting blueprint phase (2.5 seconds)
      setTimeout(() => {
        setProgressVal(60);
        setVideoStatus("council_review");
        
        // Load council dynamic reasoning commentary
        setCouncilMessages([
          { agent: "Isis (Edição & Pacing)", avatar: "✨", message: "Analisando cortes brutos... Proponho zoom digital rápido a cada 1.4 segundos para manter o ritmo hipnótico e prender a atenção do Kotaro.", status: "thinking" }
        ]);

        // Second comment
        setTimeout(() => {
          setCouncilMessages(prev => [
            ...prev.map(c => ({ ...c, status: "approved" as const })),
            { agent: "Morax (Ganchos de Venda)", avatar: "🔥", message: "O hook inicial de 3s está excelente. Injetando quebra de padrão visual no frame 1 com tela Amber escura e som swoosh para retenção máxima de leads.", status: "thinking" }
          ]);
        }, 1500);

        // Third comment
        setTimeout(() => {
          setCouncilMessages(prev => [
            ...prev.map(c => c.agent.includes("Morax") ? { ...c, status: "approved" as const } : c),
            { agent: "Hefesto (Tipografia & Estilo)", avatar: "🦾", message: "Fatos neurais carregados da LTM do Kotaro. Legenda em destaque duplo amarelo/branco aprovada. A tipografia será 'Inter' ultra-bold.", status: "thinking" }
          ]);
        }, 3000);

        // All approved
        setTimeout(() => {
          setCouncilMessages(prev => prev.map(c => ({ ...c, status: "approved" as const })));
          setProgressVal(80);
          setVideoStatus("rendering");

          // 3. Rendering / Simulation (2 seconds)
          setTimeout(() => {
            setProgressVal(100);
            setVideoStatus("completed");
          }, 2000);

        }, 4500);

      }, 2500);

    }, 2000);
  };

  // Rejection with cognitive learning
  const handleRejectVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionError.trim()) return;

    const errorFact = `[ERRO DE EDIÇÃO DE VÍDEO DETECTADO] Estilo: ${videoStyle}. Correção crítica exigida: ${rejectionError.trim()}`;
    const username = typeof window !== "undefined" ? (localStorage.getItem("yggnarok.username") || "kotaro") : "kotaro";
    const storedMems = localStorage.getItem(`yggnarok.${username}.ltm_memories`);
    let memoriesList = [];
    if (storedMems) {
      memoriesList = JSON.parse(storedMems);
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

  // Trigger high bitrate Ultra-HD 4K rendering & platform direct publication pipeline
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
        "Carregando vídeo original ProRes via Chunk Uploading...",
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
    <main className="min-h-screen text-foreground relative overflow-hidden bg-radial-gradient">
      
      {/* Visual dynamic overlay keyframes */}
      <style>{`
        @keyframes floatAlert {
          0% { transform: translateY(5px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-alert-pop {
          animation: floatAlert 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes progressGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-glow-bar {
          background-size: 200% 200%;
          animation: progressGlow 2s ease infinite;
        }
      `}</style>

      {/* Glow ambient effects */}
      <div className="absolute top-0 right-1/4 size-96 rounded-full bg-brand/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 size-80 rounded-full bg-orange-600/5 blur-3xl pointer-events-none" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        
        {/* ── Toast Notification (P1: feedback) ── */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg animate-alert-pop ${
            toast.type === "success" 
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" 
              : "border-rose-500/30 bg-rose-500/10 text-rose-400"
          }`}>
            {toast.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {toast.message}
          </div>
        )}

        {/* ── Header with YGN Seal (P2: identity) ── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-brand" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">創作工房 · Kobo</p>
              <span className="ml-1 inline-flex items-center gap-1 rounded-md border border-brand/30 bg-brand/10 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-brand">YGN</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
              Estúdio de Criação &amp; Vídeos
            </h1>
            <p className="mt-2 text-sm text-muted">
              Engine de inteligência criativa, roteiros e linha do tempo de vídeo integrada.
            </p>
          </div>
          
          {/* ── Step Navigation (kept as primary nav — P1: stepper) ── */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
            {tabs.map((tab, idx) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeTab === tab.id ? "text-brand bg-brand/10" : "text-muted hover:text-foreground"
                }`}
              >
                <span className="size-4 rounded bg-slate-100 dark:bg-neutral-800 grid place-items-center text-[10px]">{idx + 1}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Compact Metric Counters (P1: replaces redundant large cards) ── */}
        <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {tabs.map((tab) => {
            const count = contents.filter(c => tab.id === "ideias" ? true : tab.id === "videos" ? false : c.content_type?.toLowerCase().includes(tab.id.slice(0, -1))).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 rounded-xl border p-3 transition duration-200 ${
                  activeTab === tab.id
                    ? "border-brand/40 bg-brand/5"
                    : "border-line bg-surface/30 hover:border-brand/20"
                }`}
              >
                <div className={`grid size-9 place-items-center rounded-lg transition ${
                  activeTab === tab.id 
                    ? "bg-brand text-neutral-950" 
                    : "bg-surface-strong text-muted group-hover:text-foreground"
                }`}>
                  <tab.icon size={16} />
                </div>
                <div className="text-left">
                  <p className={`text-xs font-bold tracking-tight transition ${activeTab === tab.id ? "text-brand" : "text-foreground"}`}>
                    {tab.label}
                  </p>
                  <p className="text-[10px] text-muted font-semibold tabular-nums">{count} {count === 1 ? "item" : "itens"}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Mobile Tab Selector (visible only on small screens) ── */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface/40 p-1 lg:hidden">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === tab.id ? "bg-brand text-neutral-950" : "text-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Main interactive split workspace ── */}
        <div className="grid gap-6 lg:grid-cols-[430px_1fr]">
          
          {/* LEFT SIDEBAR: CREATION ENGINE + NEW PERFECTION CONTROLS */}
          <div className="space-y-6">
            
            {/* 🧬 CREATIVE MARGIN & AUTO-ECONOMIC SETTINGS PANEL */}
            <section className="relative overflow-hidden rounded-2xl border border-brand/20 bg-brand/5 p-6 shadow-xl backdrop-blur-md">
              <div className="absolute right-0 top-0 size-24 bg-brand/10 blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders size={16} className="text-brand animate-pulse" />
                  <h2 className="text-sm font-bold tracking-wider uppercase text-brand">Evolução &amp; Perfeição</h2>
                </div>
                <div title="Ajuste a tolerância de caos ou rigidez criativa de aprendizado">
                  <HelpCircle size={14} className="text-brand opacity-60" />
                </div>
              </div>

              <div className="space-y-4">
                {/* 1. Perfection vs Caos Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted font-semibold">Tolerância Criativa</span>
                    <span className="text-brand font-bold">{learningMargin}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={learningMargin}
                    onChange={(e) => setLearningMargin(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand"
                  />
                  <div className="flex justify-between text-[9px] text-muted font-mono uppercase tracking-wider">
                    <span>Perfeição Rígida</span>
                    <span>Modo Caos</span>
                  </div>
                  <p className="text-[10px] text-muted leading-relaxed mt-1">
                    {learningMargin < 30 ? (
                      <span className="text-amber-400 font-semibold">⚡ Perfeição Máxima: Os agentes seguirão diretrizes estritas do Kotaro sem desviar ou tentar termos novos.</span>
                    ) : learningMargin < 75 ? (
                      <span>⚖️ Equilibrado: Combina aprendizados históricos com pequenos ganchos experimentais controlados.</span>
                    ) : (
                      <span className="text-rose-400 font-semibold">🔥 Caos Criativo: Permite novos ângulos dramáticos, conceitos ousados e exploração total de palavras.</span>
                    )}
                  </p>
                </div>

                {/* 2. Auto-Free fallback switch */}
                <div className="pt-2 border-t border-brand/10 flex items-center justify-between">
                  <div className="max-w-[240px]">
                    <span className="text-xs font-bold text-foreground block">Auto-Economia Ativa</span>
                    <span className="text-[9px] text-muted leading-tight block mt-0.5">Sempre forçar modelos livres avançados (Llama 3.3/Nemo) para esboços e rascunhos.</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setAutoFreeTier(!autoFreeTier)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${autoFreeTier ? "bg-brand" : "bg-neutral-800"}`}
                  >
                    <span className={`pointer-events-none inline-block size-4 transform rounded-full bg-neutral-950 shadow ring-0 transition duration-200 ease-in-out ${autoFreeTier ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                {/* ⚠️ 3. Token/Character Limit Warning Banner */}
                {isApproachingLimit && (
                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 text-[10px] text-amber-200 animate-alert-pop flex items-start gap-2 leading-relaxed">
                    <AlertTriangle size={15} className="text-brand shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <strong>Alerta de Carga Neural:</strong> Você está prestes a gerar conteúdos demais de uma só vez ({estimatedCharacters} chrs). 
                      <span className="block mt-1 text-[9px] text-amber-400 font-bold">✓ Modo Inteligente Ativo: Roteamento travado no modelo FREE evoluído (Llama 3.3 70B Free Tier) para evitar sustos com tokens!</span>
                    </div>
                  </div>
                )}

              </div>
            </section>

            {/* ── P1: Creation Panel with Manual / IA Tabs ── */}
            {activeTab !== "videos" ? (
              <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md">
                <div className="absolute right-0 top-0 size-24 bg-brand/5 blur-2xl pointer-events-none" />
                
                {/* ── Mode Switcher (P1: clear separation) ── */}
                <div className="flex items-center gap-1 rounded-lg bg-surface-strong/60 border border-line p-1 mb-5">
                  <button
                    type="button"
                    onClick={() => setCreationMode("manual")}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition ${
                      creationMode === "manual" ? "bg-brand text-neutral-950 shadow-sm" : "text-muted hover:text-foreground"
                    }`}
                  >
                    <Layers size={13} />
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreationMode("ia")}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition ${
                      creationMode === "ia" ? "bg-brand text-neutral-950 shadow-sm" : "text-muted hover:text-foreground"
                    }`}
                  >
                    <Brain size={13} />
                    IA Especializada
                  </button>
                </div>

                {/* Mode description */}
                <p className="text-[11px] text-muted mb-4 leading-relaxed">
                  {creationMode === "manual" 
                    ? "Estruture e salve uma ideia sem acionar geração automática." 
                    : "Use agentes para gerar, revisar ou expandir conteúdo com IA."}
                </p>

                <div className="space-y-4">
                  {/* ── Title ── */}
                  <Field label="Título Operacional">
                    <input 
                      className={`${inputClass} border-line bg-surface-strong focus:border-brand`} 
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      required 
                      placeholder="Ex: Masterclass de Engenharia de Prompt" 
                    />
                  </Field>
                  
                  {/* ── Type + Channel (P0: proper dropdowns) ── */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Tipo de Conteúdo">
                      <select 
                        className={`${inputClass} border-line bg-surface-strong text-xs font-semibold`}
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                      >
                        {CONTENT_TYPES.map(ct => (
                          <option key={ct.value} value={ct.value}>{ct.label}</option>
                        ))}
                      </select>
                    </Field>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Canal / Rede</label>
                      <div className="flex flex-wrap gap-1.5">
                        {CHANNELS.map(ch => (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => toggleChannel(ch)}
                            className={`rounded-md px-2 py-1 text-[10px] font-bold border transition ${
                              selectedChannels.includes(ch) 
                                ? "border-brand/40 bg-brand/10 text-brand" 
                                : "border-line bg-surface-strong text-muted hover:text-foreground"
                            }`}
                          >
                            {ch}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* ── Briefing ── */}
                  <Field label="Briefing Criativo / Direcionamento">
                    <textarea 
                      className={`${textareaClass} border-line bg-surface-strong focus:border-brand text-xs`} 
                      value={manualIdea}
                      onChange={(e) => setManualIdea(e.target.value)}
                      placeholder="Explique objetivo, público, promessa central, tom desejado, referências e CTA." 
                      rows={4} 
                    />
                  </Field>

                  {/* ── IA-specific fields (only when IA mode) ── */}
                  {creationMode === "ia" && (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="Agente Executor">
                          <select 
                            className={`${inputClass} border-line bg-surface-strong text-xs font-semibold`} 
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                          >
                            <option value="hefesto">Hefesto (Redator Estrela)</option>
                            <option value="amber">Amber AI (Análise Profunda)</option>
                            <option value="local">Local / Ollama (Fallback)</option>
                            <option value="openrouter">OpenRouter (Multi-modelo)</option>
                          </select>
                        </Field>
                        <Field label="Modo Operacional">
                          <select 
                            className={`${inputClass} border-line bg-surface-strong text-xs`}
                            value={autoFreeTier ? "fast" : "deep"}
                            disabled={autoFreeTier}
                            onChange={() => {}}
                          >
                            <option value="fast">Rápido (Free Forçado)</option>
                            <option value="deep">Profundo (Amber AI)</option>
                          </select>
                        </Field>
                      </div>
                      
                      <Field label="Instruções de Refinamento">
                        <textarea 
                          className={`${textareaClass} border-line bg-surface-strong focus:border-brand text-xs`} 
                          value={refinementInstructions}
                          onChange={(e) => setRefinementInstructions(e.target.value)}
                          placeholder="Ex: tom direto, foco em conversão, CTA para link na bio, evitar linguagem genérica." 
                          rows={3} 
                        />
                      </Field>
                    </>
                  )}
                  
                  {/* ── P1: Unified Action Bar ── */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-line/50">
                    {creationMode === "manual" ? (
                      <>
                        <button 
                          type="button" 
                          onClick={handleSaveDraft}
                          disabled={actionLoading !== null}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-neutral-950 shadow-md shadow-brand/10 transition duration-300 hover:bg-brand-strong disabled:opacity-50"
                        >
                          {actionLoading === "draft" ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                          Salvar rascunho
                        </button>
                        <button 
                          type="button" 
                          onClick={handleSendForReview}
                          disabled={actionLoading !== null}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand/40 bg-surface py-2.5 text-xs font-bold text-brand transition hover:bg-brand hover:text-neutral-950 disabled:opacity-50"
                        >
                          {actionLoading === "review" ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                          Enviar para revisão IA
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          type="button"
                          onClick={handleGenerateContent}
                          disabled={actionLoading !== null}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-neutral-950 shadow-md shadow-brand/10 transition duration-300 hover:bg-brand-strong disabled:opacity-50"
                        >
                          {actionLoading === "generate" ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
                          🚀 Gerar roteiro + legenda + hashtags
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={actionLoading !== null}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface py-2 text-xs font-semibold text-muted transition hover:text-foreground hover:border-brand/30 disabled:opacity-50"
                          >
                            {actionLoading === "draft" ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                            Salvar rascunho
                          </button>
                          <button 
                            type="button"
                            onClick={handleSendForReview}
                            disabled={actionLoading !== null}
                            className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface py-2 text-xs font-semibold text-muted transition hover:text-foreground hover:border-brand/30 disabled:opacity-50"
                          >
                            {actionLoading === "review" ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
                            Revisão IA
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </section>
            ) : (
              // 📹 DYNAMIC VIDEO METADATA & RAW INGESTION SIDEBAR (VOID & AMBER)
              <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video size={16} className="text-rose-400" />
                    <h2 className="text-sm font-bold uppercase text-foreground">Ingestão de Mídia Bruta</h2>
                  </div>
                  
                  {/* + Criar Estilo Único trigger button */}
                  <button 
                    type="button"
                    onClick={() => setShowStyleCreator(!showStyleCreator)}
                    className="inline-flex items-center gap-1 text-[9px] font-bold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded hover:bg-brand/25 transition"
                  >
                    <Plus size={10} /> Novo Estilo
                  </button>
                </div>
                
                {/* collapsible style registration drawer form */}
                {showStyleCreator && (
                  <form onSubmit={handleCreateCustomStyle} className="rounded-xl border border-brand/25 bg-brand/5 p-4 space-y-3 animate-alert-pop">
                    <div className="flex justify-between items-center border-b border-brand/10 pb-2">
                      <span className="text-[10px] font-bold text-brand uppercase tracking-wider">Criar Estilo Único</span>
                      <button type="button" onClick={() => setShowStyleCreator(false)}><X size={12} className="text-muted hover:text-foreground" /></button>
                    </div>
                    <Field label="Nome do Estilo">
                      <input 
                        className={`${inputClass} border-line bg-surface-strong text-xs`}
                        placeholder="Ex: Minimalista Dark Kotaro"
                        value={customStyleName}
                        onChange={(e) => setCustomStyleName(e.target.value)}
                        required
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Duração Alvo">
                        <input className={`${inputClass} border-line bg-surface-strong text-[11px]`} placeholder="Ex: 30s - 45s" value={customStyleDuration} onChange={(e) => setCustomStyleDuration(e.target.value)} />
                      </Field>
                      <Field label="Músicas (Separadas por vírgula)">
                        <input className={`${inputClass} border-line bg-surface-strong text-[11px]`} placeholder="Synthwave, Lofi" value={customStyleMusic} onChange={(e) => setCustomStyleMusic(e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Transições e Efeitos">
                      <input className={`${inputClass} border-line bg-surface-strong text-xs`} placeholder="Zoom, fade rápido..." value={customStyleTransitions} onChange={(e) => setCustomStyleTransitions(e.target.value)} />
                    </Field>
                    <Field label="Diretrizes Estruturais / Formatos">
                      <textarea 
                        className={`${textareaClass} border-line bg-surface-strong text-xs`}
                        placeholder="Insira as regras exclusivas deste estilo (ex: cortes agressivos, sem música no hook, etc)..."
                        rows={3}
                        value={customStyleDirectives}
                        onChange={(e) => setCustomStyleDirectives(e.target.value)}
                        required
                      />
                    </Field>
                    <button className="w-full py-2 bg-brand text-neutral-950 text-xs font-bold rounded-lg shadow hover:bg-brand-strong transition">
                      Salvar Novo Estilo
                    </button>
                  </form>
                )}

                {/* Style Preset Selector */}
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Estilo e Base de Conhecimento</label>
                  <select 
                    className={`${inputClass} border-line bg-surface-strong text-xs font-semibold text-brand`}
                    value={videoStyle}
                    onChange={(e) => setVideoStyle(e.target.value)}
                  >
                    {Object.entries(allPresets).map(([key, preset]) => (
                      <option key={key} value={key}>{preset.name}</option>
                    ))}
                  </select>
                </div>

                {/* Raw Files List upload Simulation */}
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Arquivos Brutos Enviados</label>
                  
                  <form onSubmit={handleAddRawFile} className="flex gap-1.5 mb-2">
                    <input 
                      className={`${inputClass} border-line bg-surface-strong text-xs py-1.5`} 
                      placeholder="Adicione clip_bruto.mp4..."
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                    />
                    <button className="px-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition text-xs font-bold shrink-0">
                      Inserir
                    </button>
                  </form>

                  <div className="space-y-1.5 max-h-[110px] overflow-y-auto border border-line/40 rounded-xl bg-surface-strong/30 p-2">
                    {rawFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[10px] bg-surface-strong/60 p-1.5 rounded border border-line/30 font-mono text-muted">
                        <span className="truncate max-w-[170px]">{file}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveRawFile(idx)}
                          className="text-rose-400 hover:text-rose-500 px-1 font-sans font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {rawFiles.length === 0 && (
                      <span className="text-[10px] text-muted/60 text-center block py-3">Nenhum arquivo bruto adicionado.</span>
                    )}
                  </div>
                </div>

                {/* Editing instructions and reference examples */}
                <div className="space-y-3">
                  <Field label="Orientações e Exemplos de Referência">
                    <textarea 
                      className={`${textareaClass} border-line bg-surface-strong text-xs`}
                      rows={3}
                      placeholder="Adicione links de referências ou explique o tom desejado (Ex: 'Quero corte de silêncio agressivo como no canal X')..."
                      value={editingInstructions}
                      onChange={(e) => setEditingInstructions(e.target.value)}
                    />
                  </Field>
                  
                  <Field label="Link de Exemplo (Opcional)">
                    <input 
                      className={`${inputClass} border-line bg-surface-strong text-xs`}
                      placeholder="https://tiktok.com/@exemplo/video/..."
                      value={referenceLink}
                      onChange={(e) => setReferenceLink(e.target.value)}
                    />
                  </Field>
                </div>

                {/* Aspect ratio frame selection */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Formato</label>
                    <div className="grid grid-cols-2 gap-1 p-0.5 bg-surface-strong border border-line rounded-lg">
                      <button 
                        type="button" 
                        onClick={() => setVideoAspect("916")}
                        className={`py-1 text-[9px] font-bold rounded transition ${videoAspect === "916" ? "bg-brand text-neutral-950" : "text-muted hover:text-foreground"}`}
                      >
                        9:16
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setVideoAspect("169")}
                        className={`py-1 text-[9px] font-bold rounded transition ${videoAspect === "169" ? "bg-brand text-neutral-950" : "text-muted hover:text-foreground"}`}
                      >
                        16:9
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Duração Alvo</label>
                    <div className="py-1.5 px-3 bg-surface-strong border border-line rounded-lg text-xs font-bold font-mono text-center">
                      {activePreset.duration}
                    </div>
                  </div>
                </div>

                {/* Free tier notification */}
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-[10px] text-emerald-400 flex items-center gap-1.5">
                  <Cpu size={12} className="animate-pulse" />
                  <span>Corte e Inteligência de tendências via <strong>Gemini 2.0 Flash (Free)</strong>.</span>
                </div>
              </section>
            )}

            {/* ── P1: Compact Agent Status Panel (replaces old Diretoria IA form) ── */}
            {activeTab !== "videos" && (
              <section className="relative overflow-hidden rounded-2xl border border-brand/25 bg-gradient-to-b from-brand/5 to-surface/20 p-5 shadow-xl backdrop-blur-md">
                <div className="absolute right-0 top-0 size-24 bg-brand/10 blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain size={14} className="text-brand" />
                    <h2 className="text-xs font-bold tracking-wider uppercase text-brand">Painel do Agente</h2>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Online</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] bg-surface-strong/40 p-2.5 rounded-lg border border-line/30">
                    <span className="text-muted font-medium">Agente ativo</span>
                    <span className="font-bold text-foreground capitalize">{selectedAgent}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-surface-strong/40 p-2.5 rounded-lg border border-line/30">
                    <span className="text-muted font-medium">Modo</span>
                    <span className="font-bold text-foreground">{autoFreeTier ? "Rápido (Free)" : "Profundo"}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-surface-strong/40 p-2.5 rounded-lg border border-line/30">
                    <span className="text-muted font-medium">Modelo</span>
                    <span className="font-bold text-foreground text-[10px]">{autoFreeTier ? "Llama 3.3 70B (Free)" : "Amber AI Pro"}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-surface-strong/40 p-2.5 rounded-lg border border-line/30">
                    <span className="text-muted font-medium">Fila</span>
                    <span className="font-bold text-brand tabular-nums">{contents.filter(c => c.status === "na_fila" || c.status === "processando").length} jobs</span>
                  </div>
                </div>

                <p className="mt-3 text-[9px] text-muted leading-relaxed">
                  <strong className="text-brand">Hefesto:</strong> estruturação criativa · <strong className="text-brand">Amber:</strong> análise profunda · <strong className="text-brand">Local:</strong> fallback gratuito
                </p>
              </section>
            )}

            {/* 📡 ACTIVE TRENDS & GENRES CONSCIOUSNESS CARD (MIMIR) */}
            {activeTab === "videos" && (
              <section className="relative overflow-hidden rounded-2xl border border-brand/20 bg-brand/5 p-6 shadow-xl backdrop-blur-md space-y-4">
                <div className="absolute right-0 top-0 size-20 bg-brand/5 blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio size={16} className="text-brand animate-pulse" />
                    <h2 className="text-sm font-bold tracking-wider uppercase text-brand">Radar de Gênero &amp; Trends</h2>
                  </div>
                  <Brain size={14} className="text-brand opacity-60" />
                </div>

                <p className="text-[11px] text-muted leading-relaxed">
                  Configura a consciência do motor IA. Permite alternar entre explorar tendências voláteis ou travar em estilos fixos de marca.
                </p>

                {/* Video Genre target selection */}
                <div>
                  <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Gênero Alvo do Vídeo</label>
                  <select 
                    className={`${inputClass} border-line bg-surface-strong text-xs font-semibold`}
                    value={videoGenre}
                    onChange={(e) => setVideoGenre(e.target.value as any)}
                  >
                    <option value="viral">Trends &amp; Virais (Frenesi de Engajamento)</option>
                    <option value="educational">Vídeos Educativos / Tutoriais</option>
                    <option value="comedy">Humor &amp; Comédia (Quebra de Padrão)</option>
                    <option value="documentary">Cinematográfico / Documentários</option>
                    <option value="serious">Sérios &amp; Pautas Corporativas</option>
                    <option value="sales">VSL / Vídeos de Alta Conversão</option>
                  </select>
                </div>

                {/* Adaptation mode toggle */}
                <div>
                  <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1.5">Modo de Adaptação de Pacing</label>
                  <div className="grid grid-cols-2 gap-1 p-0.5 bg-surface-strong border border-line rounded-lg">
                    <button 
                      type="button" 
                      onClick={() => setAdaptationMode("liquid")}
                      className={`py-1 text-[9px] font-bold rounded transition ${adaptationMode === "liquid" ? "bg-brand text-neutral-950" : "text-muted hover:text-foreground"}`}
                      title="Sintoniza com as trends de áudio e ritmo mais quentes das últimas 24h"
                    >
                      Algoritmo Líquido
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setAdaptationMode("fixed")}
                      className={`py-1 text-[9px] font-bold rounded transition ${adaptationMode === "fixed" ? "bg-brand text-neutral-950" : "text-muted hover:text-foreground"}`}
                      title="Ignora trends voláteis e trava 100% nas diretrizes estéticas estáticas de marca"
                    >
                      Estilo Fixo Rígido
                    </button>
                  </div>
                </div>

                {/* Dynamic radar status logs */}
                <div className="space-y-1.5 p-2.5 rounded-xl bg-neutral-950 border border-line/30 font-mono text-[9px] text-muted">
                  <span className="text-[8px] font-bold uppercase text-brand block mb-1">Mapeamento de Algoritmo Ativo:</span>
                  {trendRadarLogs.map((log, idx) => (
                    <p key={idx} className="flex items-center gap-1.5 truncate">
                      <span className="text-brand">•</span>
                      <span>{log}</span>
                    </p>
                  ))}
                </div>

                {/* Radar trigger scan button */}
                <button
                  type="button"
                  onClick={runActiveTrendScan}
                  disabled={isScanningTrends}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-brand/40 bg-surface px-4 py-2 text-xs font-bold text-brand hover:bg-brand hover:text-neutral-950 transition duration-300"
                >
                  <RefreshCw size={11} className={isScanningTrends ? "animate-spin" : ""} />
                  {isScanningTrends ? "Sintonizando Trends..." : "Atualizar Consciência de Trends"}
                </button>
              </section>
            )}

            {/* 📈 NEURAL EVOLUTION SUPERVISOR CARD (ODIN) */}
            <section className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 shadow-xl backdrop-blur-md">
              <div className="absolute right-0 top-0 size-24 bg-emerald-500/10 blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-emerald-400 animate-pulse" />
                  <h2 className="text-sm font-bold tracking-wider uppercase text-emerald-400">Supervisor de Evolução (Odin)</h2>
                </div>
                <Brain size={14} className="text-emerald-400" />
              </div>

              <p className="text-[11px] text-muted leading-relaxed mb-4">
                Monitora falhas de edição armazenadas na LTM e atualiza o system prompt dos modelos gratuitos automaticamente para estabilizar os cortes sem desvios.
              </p>

              {/* Targets and status indicators */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-[10px] bg-neutral-900/60 p-2 rounded-lg border border-line/20 font-mono text-muted">
                  <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-400 animate-ping" /> Gemini 2.0 Flash (Free)</span>
                  <span className="text-emerald-400 font-bold">Evoluindo</span>
                </div>
                <div className="flex items-center justify-between text-[10px] bg-neutral-900/60 p-2 rounded-lg border border-line/20 font-mono text-muted">
                  <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-sky-400" /> Qwen 2.5 VL (Free)</span>
                  <span className="text-sky-400 font-bold">Estável</span>
                </div>
                <div className="flex items-center justify-between text-[10px] bg-neutral-900/60 p-2 rounded-lg border border-line/20 font-mono text-muted">
                  <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-purple-400 animate-pulse" /> Llama 3.3 70B (Free)</span>
                  <span className="text-purple-400 font-bold">Otimizado</span>
                </div>
              </div>

              {/* Tuning action button */}
              <button 
                type="button"
                onClick={() => {
                  const username = typeof window !== "undefined" ? (localStorage.getItem("yggnarok.username") || "kotaro") : "kotaro";
                  alert(`[ODIN EVOLUTION PIPELINE] Lendo base de rejeições LTM do usuário '${username}'...\n\n1. Consolidando correções de transição rápida no Qwen 2.5-VL.\n2. Reajustando ganchos de persuasão no Llama 3.3.\n3. Parâmetros de pesos e sistema sintonizados a custo $0.00!`);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-surface px-4 py-2.5 text-xs font-bold text-emerald-400 transition duration-300 hover:bg-emerald-500 hover:text-neutral-950"
              >
                <RefreshCw size={13} className="animate-spin" />
                Auto-Sintonizar e Ajustar Modelos (Free)
              </button>
            </section>
          </div>

          {/* RIGHT COLUMN: DIGITAL ASSETS GRID OR VIDEO STUDIO WORKSPACE */}
          <div className="space-y-6">
            {activeTab !== "videos" ? (
              <section className="rounded-2xl border border-line bg-surface/40 p-6 shadow-xl backdrop-blur-md">
                
                {/* ── Header of Acervo ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-4 mb-4 gap-2">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                      <Layers size={18} className="text-brand" />
                      Acervo Operacional
                    </h2>
                    <p className="text-xs text-muted">Acompanhe seu fluxo de ideias, roteiros e legendas</p>
                  </div>
                  <span className="self-start rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-[11px] font-bold text-brand uppercase">
                    {filteredContents.length} {filteredContents.length === 1 ? "item" : "itens"}
                  </span>
                </div>

                {/* ── Toolbar: Search + Filter Tabs (P2: Filters) ── */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                    <input
                      type="text"
                      placeholder="Buscar por título..."
                      value={acervoSearch}
                      onChange={(e) => setAcervoSearch(e.target.value)}
                      className="h-9 w-full rounded-lg border border-line bg-surface-strong pl-9 pr-3 text-xs text-foreground outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition"
                    />
                  </div>
                  <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0">
                    {["todos", "rascunho", "na_fila", "processando", "pronto", "erro"].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setAcervoFilter(f)}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition shrink-0 ${
                          acervoFilter === f 
                            ? "border-brand bg-brand/10 text-brand" 
                            : "border-line bg-surface text-muted hover:text-foreground"
                        }`}
                      >
                        {f.replace("_", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Digital Assets Grid ── */}
                <div className="grid gap-4">
                  {filteredContents.length ? (
                    filteredContents.map((item) => {
                      const normalizedStatus = (item.status || "rascunho").toLowerCase().replace(/\s/g, "_");
                      const config = STATUS_CONFIG[normalizedStatus] || STATUS_CONFIG["rascunho"];
                      const etapa = item.etapa_fluxo || "ideia";
                      const etapaConf = ETAPA_CONFIG[etapa] || ETAPA_CONFIG["ideia"];
                      const nextAct = getNextAction(item);

                      return (
                        <article 
                          key={item.id} 
                          className={`group relative overflow-hidden rounded-xl border p-5 shadow-sm transition duration-300 hover:bg-surface-strong/60 ${config.bg}`}
                        >
                          {/* Yggdrasil background texture detail for brand aesthetic (opacity 0.03) */}
                          <div className="absolute right-0 top-0 size-20 bg-brand/5 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Card Top: Metadata & Secondary Menu Dropdown */}
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-bold text-foreground group-hover:text-brand transition duration-300">
                                  {item.title}
                                </h3>
                                <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${config.color} border-current/25 bg-current/5`}>
                                  {config.label}
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-muted">
                                <span className="capitalize px-1.5 py-0.5 rounded bg-surface-strong/80 border border-line">{item.content_type || "Ideia"}</span>
                                <span className="uppercase text-brand px-1.5 py-0.5 rounded bg-brand/5 border border-brand/10">{item.platform || "Multicanais"}</span>
                                {item.origem && (
                                  <span className="uppercase text-sky-400 px-1.5 py-0.5 rounded bg-sky-500/5 border border-sky-500/10 flex items-center gap-1">
                                    <Cpu size={10} />
                                    {item.origem}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Secondary Action Dropdown */}
                            <div className="relative">
                              <button 
                                type="button"
                                onClick={() => setOpenCardMenu(openCardMenu === item.id ? null : item.id)}
                                className="p-1 rounded-lg border border-line bg-surface hover:bg-surface-strong hover:text-foreground transition text-muted"
                              >
                                <MoreVertical size={14} />
                              </button>
                              
                              {openCardMenu === item.id && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setOpenCardMenu(null)}
                                    className="fixed inset-0 z-10"
                                  />
                                  <div className="absolute right-0 mt-1 w-36 rounded-lg border border-line bg-surface-strong shadow-xl p-1 z-20 animate-alert-pop">
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        setManualTitle(item.title);
                                        setManualIdea(item.idea);
                                        setOpenCardMenu(null);
                                        showToast("Dados do item carregados no formulário!");
                                      }}
                                      className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-sidebar-hover transition"
                                    >
                                      <Copy size={12} />
                                      Editar / Duplicar
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        showToast("Processo de atualização de etapa iniciado...");
                                        setOpenCardMenu(null);
                                      }}
                                      className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-semibold text-brand hover:bg-sidebar-hover transition"
                                    >
                                      <RotateCcw size={12} />
                                      Reprocessar
                                    </button>
                                    <div className="my-1 border-t border-line" />
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        setContents(prev => prev.filter(c => c.id !== item.id));
                                        showToast("Item removido com sucesso!");
                                        setOpenCardMenu(null);
                                      }}
                                      className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
                                    >
                                      <Trash2 size={12} />
                                      Excluir
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Briefing Idea Preview */}
                          <p className="text-xs text-muted leading-relaxed line-clamp-2 mt-2 bg-surface-strong/20 p-2 rounded-lg border border-line/10">
                            {item.idea || "Sem briefing detalhado definido."}
                          </p>

                          {/* Card Bottom: Core Stage Stepper Line + Primary Action Button */}
                          <div className="mt-4 pt-3 border-t border-line/30 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                            {/* Visual stage micro-stepper */}
                            <div className="flex items-center gap-1">
                              {["ideia", "roteiro", "legenda", "hashtag"].map((stg) => {
                                const stgConf = ETAPA_CONFIG[stg];
                                const isCurrent = etapa === stg;
                                const isDone = ["roteiro", "legenda", "hashtag", "publicacao"].indexOf(etapa) > ["ideia", "roteiro", "legenda", "hashtag"].indexOf(stg);
                                return (
                                  <div 
                                    key={stg} 
                                    title={`Etapa: ${stgConf.label}`}
                                    className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold border transition ${
                                      isCurrent 
                                        ? "border-brand/40 bg-brand/10 text-brand scale-105" 
                                        : isDone 
                                          ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" 
                                          : "border-line bg-surface-strong text-muted/50"
                                    }`}
                                  >
                                    <stgConf.icon size={10} />
                                    <span className="hidden xs:inline uppercase">{stgConf.label}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Dynamic Action Button */}
                            <button 
                              type="button" 
                              disabled={nextAct.disabled}
                              onClick={async () => {
                                if (nextAct.spinning) return;
                                showToast(`Iniciando ação: ${nextAct.label}...`);
                                // Simulate transition
                                setContents(prev => prev.map(c => c.id === item.id ? { ...c, status: "processando" } : c));
                                await new Promise(r => setTimeout(r, 1500));
                                setContents(prev => prev.map(c => {
                                  if (c.id === item.id) {
                                    const currentIdx = ["ideia", "roteiro", "legenda", "hashtag", "publicacao"].indexOf(etapa);
                                    const nextStage = ["ideia", "roteiro", "legenda", "hashtag", "publicacao"][currentIdx + 1] || etapa;
                                    return { ...c, status: "pronto", etapa_fluxo: nextStage as EtapaFluxo };
                                  }
                                  return c;
                                }));
                                showToast("Transição de etapa concluída!");
                              }}
                              className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-sm ${
                                nextAct.disabled
                                  ? "bg-line text-muted cursor-not-allowed"
                                  : "bg-brand text-neutral-950 hover:bg-brand-strong"
                              }`}
                            >
                              {nextAct.spinning ? <Loader2 size={12} className="animate-spin" /> : <ChevronRight size={12} />}
                              {nextAct.label}
                            </button>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-line rounded-2xl bg-surface/10">
                      <div className="grid size-14 place-items-center rounded-2xl bg-brand/5 text-brand/60 mb-4 animate-pulse">
                        <activeTabObj.icon size={26} />
                      </div>
                      <h3 className="text-sm font-bold text-foreground">Nenhum item nesta pauta</h3>
                      <p className="mt-1 text-xs text-muted max-w-xs">Gere novos conceitos ou pautas usando o formulário inteligente ao lado.</p>
                    </div>
                  )}
                </div>
              </section>
            ) : (
              
              // 📹 INTERACTIVE VIDEO EDITING STUDIO CORE WORKSPACE
              <section className="rounded-2xl border border-line bg-surface/40 p-6 shadow-xl backdrop-blur-md space-y-6">
                
                {/* 1. Header with dynamic progress indicators */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-4 gap-4">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                      <Film size={18} className="text-rose-400" /> Mesa de Edição Colaborativa (Council OS)
                    </h2>
                    <p className="text-xs text-muted">Conselho de Agentes avalia e projeta cortes baseado no seu acervo e tendências</p>
                  </div>
                  
                  {videoStatus === "idle" && (
                    <button 
                      onClick={runVideoEditingPipeline}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold px-5 transition shadow-lg shadow-rose-500/10 animate-pulse"
                    >
                      <Wand2 size={13} /> Disparar Orquestra de Edição (Free)
                    </button>
                  )}

                  {videoStatus !== "idle" && videoStatus !== "completed" && videoStatus !== "rejected" && videoStatus !== "exporting" && (
                    <div className="flex items-center gap-2 text-xs font-bold text-brand">
                      <RefreshCw size={13} className="animate-spin text-rose-400" />
                      <span>{videoStatus === "analyzing" ? "Analisando Arquivos..." : videoStatus === "projecting" ? "Projetando Linha de Corte..." : videoStatus === "council_review" ? "Conselho Deliberando..." : "Renderizando Mídia..."}</span>
                    </div>
                  )}

                  {videoStatus === "completed" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                      <CheckCircle size={12} /> Render Concluído!
                    </span>
                  )}
                  
                  {videoStatus === "rejected" && (
                    <button 
                      onClick={runVideoEditingPipeline}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-extrabold px-4 transition"
                    >
                      <RefreshCw size={11} /> Re-renderizar com Aprendizados
                    </button>
                  )}
                </div>

                {/* Progress bar representing workflow status */}
                {(videoStatus !== "idle" && videoStatus !== "exporting") && (
                  <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500 animate-glow-bar" 
                      style={{ width: `${progressVal}%` }}
                    />
                  </div>
                )}

                {/* 2. Style Preset & Localized Trends Base Grid */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-line bg-surface-strong/30 p-3 space-y-1">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                      <Radio size={10} className="animate-pulse" /> Tendências Locais
                    </span>
                    <span className="text-[10px] text-foreground font-bold block mt-1">Sons Virais (Brasil):</span>
                    <div className="text-[9px] text-muted space-y-0.5">
                      {activePreset.trendingMusic.map((music, idx) => (
                        <p key={idx} className="flex items-center gap-1 truncate"><Music size={8} /> {music}</p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-line bg-surface-strong/30 p-3 space-y-1">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Scissors size={10} /> Padrões de Edição
                    </span>
                    <span className="text-[10px] text-foreground font-bold block mt-1">Transições em Alta:</span>
                    <div className="text-[9px] text-muted space-y-0.5">
                      {activePreset.trendingTransitions.map((tran, idx) => (
                        <p key={idx} className="truncate">• {tran}</p>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-line bg-surface-strong/30 p-3 space-y-1">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                      <Star size={10} /> Diretriz do Estilo
                    </span>
                    <span className="text-[10px] text-foreground font-bold block mt-1">Regras de Negócio:</span>
                    <p className="text-[9px] text-muted line-clamp-3 leading-relaxed">
                      {activePreset.baseDirectives}
                    </p>
                  </div>
                </div>

                {/* 3. CORE COLLABORATION PIPELINE DISPLAY */}
                <div className="grid gap-6 lg:grid-cols-[160px_1fr]">
                  
                  {/* Left Aspect Ratio Preview (Static and Reactive to state) */}
                  <div className="flex flex-col items-center justify-start border-r border-line/20 pr-4">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-2">Simulação Final</span>
                    
                    <div className={`relative border-2 border-white/10 bg-neutral-950 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                      videoAspect === "916" ? "h-[220px] w-[124px]" : "h-[124px] w-[220px]"
                    }`}>
                      {videoStatus === "rendering" || videoStatus === "analyzing" ? (
                        <div className="absolute inset-0 bg-neutral-950/80 flex flex-col items-center justify-center gap-2 z-20">
                          <RefreshCw size={24} className="text-rose-400 animate-spin" />
                          <span className="text-[8px] text-rose-300 font-mono tracking-widest animate-pulse">RENDER...</span>
                        </div>
                      ) : null}
                      
                      <div className="absolute inset-0 border border-dashed border-white/5 grid grid-cols-3 grid-rows-3 pointer-events-none" />
                      <Video className="text-rose-400/40 size-8" />
                      <div className="absolute bottom-2 left-2 right-2 text-[7px] font-mono text-center text-white/50 truncate">
                        {videoScriptTitle}
                      </div>
                      <div className="absolute top-2 right-2 rounded bg-rose-500/25 px-1 py-0.5 text-[5px] font-mono text-rose-300 tracking-wider">
                        REC 4K
                      </div>
                    </div>
                  </div>

                  {/* Right Collaborative Reasoning Council Space */}
                  <div className="space-y-4">
                    
                    {/* Simulated Timeline cuts display (Caminho Projetado) */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Caminho Projetado (Linha do Tempo de Roteiro)</span>
                      
                      <div className="flex border border-line bg-surface-strong/30 rounded-xl p-2 gap-1.5 overflow-x-auto select-none">
                        {videoTimeline.map((clip, idx) => (
                          <div 
                            key={clip.id} 
                            className={`flex-grow min-w-[90px] rounded-lg border p-2 text-center transition cursor-pointer relative ${
                              videoStatus === "rendering" || videoStatus === "completed" ? "border-emerald-500/30 bg-emerald-950/5" : "border-rose-500/10 bg-rose-950/5"
                            }`}
                          >
                            <span className={`text-[6px] font-bold uppercase block tracking-wider ${videoStatus === "completed" ? "text-emerald-400" : "text-rose-400"}`}>{clip.type}</span>
                            <span className="text-[10px] font-extrabold text-foreground truncate block mt-0.5">{clip.dur}</span>
                            <span className="text-[8px] text-muted block truncate mt-1">Corte #{idx+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Council reviews chats list */}
                    {videoStatus === "council_review" || videoStatus === "rendering" || videoStatus === "completed" ? (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Pareceres da Mesa de IAs (Conselho)</span>
                        <div className="space-y-2 bg-surface-strong/30 rounded-xl p-3 border border-line max-h-[160px] overflow-y-auto">
                          {councilMessages.map((msg, idx) => (
                            <div key={idx} className="text-[11px] leading-relaxed flex items-start gap-2 animate-alert-pop">
                              <span className="size-5 rounded-full bg-rose-500/10 border border-rose-500/20 grid place-items-center text-[10px] shrink-0">{msg.avatar}</span>
                              <div className="flex-grow">
                                <span className="font-bold text-foreground block">{msg.agent}</span>
                                <p className="text-muted text-[10px] mt-0.5">{msg.message}</p>
                              </div>
                              <span className={`text-[8px] font-bold uppercase shrink-0 px-1 py-0.5 rounded ${msg.status === "approved" ? "text-emerald-400 bg-emerald-500/5" : "text-amber-400 bg-amber-500/5 animate-pulse"}`}>
                                {msg.status === "approved" ? "Aprovado" : "Revisando"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Idle workflow presentation instructions
                      <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-line rounded-xl bg-surface/10">
                        <Cpu className="text-rose-400/40 size-10 mb-2" />
                        <h3 className="text-xs font-bold text-foreground">Orquestração Multi-Agente Pronta</h3>
                        <p className="text-[10px] text-muted mt-1 max-w-sm">Insira seus clipes brutos, escolha o preset acima e clique em "Disparar Orquestra" para que o conselho de IAs desenhe e delibere o plano de edição.</p>
                      </div>
                    )}

                  </div>
                </div>

                {/* 📂 MULTI-FORMAT REFERENCE ASSETS UPLOADER CARD */}
                {activeTab === "videos" && (
                  <div className="border-t border-line/50 pt-5 space-y-4">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Adicionar Arquivos de Referência para Análise</span>
                    
                    {/* File type trigger buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      <button 
                        type="button"
                        onClick={() => handleSimulateAssetUpload("image")}
                        className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1.5"
                      >
                        <Image size={16} className="text-amber-400" />
                        <span className="text-[9px] font-bold text-muted">Imagens (Mood)</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleSimulateAssetUpload("video")}
                        className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1.5"
                      >
                        <Play size={16} className="text-rose-400" />
                        <span className="text-[9px] font-bold text-muted">Vídeos (Ref)</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleSimulateAssetUpload("audio")}
                        className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1.5"
                      >
                        <Music size={16} className="text-sky-400" />
                        <span className="text-[9px] font-bold text-muted">Áudios (Vibe)</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleSimulateAssetUpload("doc")}
                        className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1.5"
                      >
                        <FileText size={16} className="text-emerald-400" />
                        <span className="text-[9px] font-bold text-muted">Docs (Estudo)</span>
                      </button>
                    </div>

                    {/* Upload explanation informative bubble */}
                    <div className="rounded-xl border border-line bg-surface-strong/20 p-3 text-[9px] text-muted leading-relaxed flex items-start gap-2">
                      <HelpCircle size={14} className="text-brand shrink-0 mt-0.5" />
                      <div>
                        <strong>Como é feito o Ingest de Arquivos?</strong> Os arquivos enviados são divididos em fluxos de bytes (Chunk API Stream) e guardados em nuvem criptografada (YGG Cloud Object Storage). O conselho de IAs mapeia e analisa sensorialmente esses arquivos em nível de vetor visual para garantir cópias e ritmos perfeitos!
                      </div>
                    </div>

                    {/* Active uploaded items list with progress indicators */}
                    {referenceAssets.length > 0 && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {referenceAssets.map((asset) => (
                          <div key={asset.id} className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-surface-strong/50">
                            <div className="flex items-center gap-2 truncate">
                              <span className="size-6 rounded-lg bg-surface-strong border border-line flex items-center justify-center text-xs shrink-0">
                                {asset.type === "image" ? "🖼️" : asset.type === "video" ? "📹" : asset.type === "audio" ? "🎵" : "📄"}
                              </span>
                              <div className="truncate">
                                <span className="text-[10px] font-bold text-foreground block truncate max-w-[150px]">{asset.name}</span>
                                <span className="text-[8px] text-muted block">{asset.size}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {asset.status === "uploading" ? (
                                <span className="text-[9px] text-brand font-mono font-bold animate-pulse">{asset.progress}%</span>
                              ) : (
                                <span className="text-[8px] font-bold uppercase text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">Pronto</span>
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
                )}

                {/* 🚀 ULTRA-HD 4K EXPORT & DIRECT PUBLICATION PLATFORMS HUB */}
                {videoStatus === "completed" && (
                  <div className="border-t border-line pt-5 space-y-4 animate-alert-pop">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Hub de Exportação &amp; Publicação Ultra-HD (Sem Compactação)</span>
                    
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <button 
                        onClick={() => triggerPlatformPublish("4k")}
                        className="flex flex-col items-center justify-center p-3 border border-brand/20 bg-brand/5 hover:border-brand/40 hover:bg-brand/10 rounded-xl transition gap-1 text-center"
                      >
                        <Film size={18} className="text-brand animate-pulse" />
                        <span className="text-[10px] font-bold text-foreground block">Exportar ProRes 4K</span>
                        <span className="text-[8px] text-muted block">Qualidade Máxima Local</span>
                      </button>
                      <button 
                        onClick={() => triggerPlatformPublish("tiktok")}
                        className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1 text-center"
                      >
                        <MessageSquare size={18} className="text-pink-400" />
                        <span className="text-[10px] font-bold text-foreground block">Publicar TikTok</span>
                        <span className="text-[8px] text-muted block">API Original HD</span>
                      </button>
                      <button 
                        onClick={() => triggerPlatformPublish("reels")}
                        className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1 text-center"
                      >
                        <Heart size={18} className="text-rose-400" />
                        <span className="text-[10px] font-bold text-foreground block">Agendar Reels</span>
                        <span className="text-[8px] text-muted block">Instagram Ultra HDR</span>
                      </button>
                      <button 
                        onClick={() => triggerPlatformPublish("shorts")}
                        className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1 text-center"
                      >
                        <Play size={18} className="text-red-400" />
                        <span className="text-[10px] font-bold text-foreground block">YouTube Shorts</span>
                        <span className="text-[8px] text-muted block">Sem perdas de bits</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Simulated publishing progress logs */}
                {videoStatus === "exporting" && exportPlatform && (
                  <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 space-y-3 animate-alert-pop">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={14} className="animate-spin text-brand" />
                      <span className="text-[10px] font-bold text-brand uppercase tracking-wider">Pipeline de Renderização de Alta Fidelidade ativo</span>
                    </div>

                    <div className="space-y-1 border border-line/40 rounded-lg p-2.5 bg-neutral-950 font-mono text-[9px] text-muted">
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

                {/* 4. USER REVIEWS LOOP & COGNITIVE ERROR ABSORPTION FORM */}
                {videoStatus === "completed" && (
                  <div className="border-t border-line pt-5 space-y-4 animate-alert-pop">
                    
                    <div className="bg-surface-strong/40 rounded-xl p-4 border border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                          <Award size={14} className="text-brand" /> Revisão do Vídeo Finalizada
                        </h4>
                        <p className="text-[11px] text-muted">Assista ao corte final simulado e dê seu parecer. IAs aprenderão com rejeições.</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => setVideoStatus("idle")}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-600 transition"
                        >
                          ✓ Aceitar Vídeo &amp; Salvar no Acervo
                        </button>
                        <button 
                          onClick={() => setVideoStatus("rejected")}
                          className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition"
                        >
                          ✕ Rejeitar (Apontar Erros)
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* If user rejected the video, force them to input error feedback */}
                {videoStatus === "rejected" && (
                  <form onSubmit={handleRejectVideo} className="border-t border-line pt-5 space-y-3 animate-alert-pop">
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 space-y-2">
                      <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <ShieldAlert size={14} /> Absorção Cognitiva de Erro Exigida
                      </h4>
                      <p className="text-[10px] text-muted leading-relaxed">
                        Para rejeitar a edição, você deve apontar detalhadamente o que as IAs erraram (ex: cortes rápidos demais, legenda cortada, som agressivo). Esse erro será gravado na sua **Long-Term Memory** para que os agentes se refinem e nunca mais repitam esse erro.
                      </p>
                    </div>

                    <textarea
                      required
                      className="w-full rounded-xl border border-line bg-surface-strong/30 p-3 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
                      rows={3}
                      value={rejectionError}
                      onChange={(e) => setRejectionError(e.target.value)}
                      placeholder="Descreva o que as IAs devem corrigir no vídeo..."
                    />

                    <div className="flex justify-end">
                      <button className="flex items-center gap-1.5 rounded-xl bg-brand py-2 px-4 text-xs font-bold text-neutral-950 shadow-md transition hover:bg-brand-strong">
                        <Wand2 size={12} /> Absorver Feedback &amp; Lançar Nova Versão
                      </button>
                    </div>
                  </form>
                )}

                {/* Show absorbed feedback history logs */}
                {absorbedFeedback.length > 0 && (
                  <div className="rounded-xl border border-brand/20 bg-brand/5 p-3 space-y-1.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand flex items-center gap-1">
                      <Brain size={10} className="animate-pulse" /> Histórico de Absorções LTM Recentes
                    </span>
                    <div className="text-[9px] text-muted space-y-1">
                      {absorbedFeedback.map((fb, idx) => (
                        <p key={idx} className="flex items-center gap-1.5">
                          <span className="text-brand font-bold">•</span>
                          <span>Fato neural injetado na LTM: <em>"Corrigir: {fb}"</em></span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Editable scripts timeline previews list */}
                {videoStatus === "completed" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Falas Finais do Roteiro (Editável)</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {videoTimeline.map((clip, idx) => (
                        <div key={clip.id} className="rounded-xl border border-line bg-surface-strong/20 p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-foreground">Corte #{idx+1} ({clip.type})</span>
                            <span className="font-mono text-[8px] text-rose-400 font-bold bg-rose-500/5 px-1 py-0.5 rounded">{clip.dur}</span>
                          </div>
                          <textarea
                            rows={2}
                            value={clip.script}
                            onChange={(e) => handleUpdateClipScript(clip.id, e.target.value)}
                            className="w-full rounded-lg border border-line bg-surface/30 p-1.5 text-[11px] text-foreground focus:border-brand focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </section>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}
