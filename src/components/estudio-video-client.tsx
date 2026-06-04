"use client";

import { useState, useRef, useEffect, useCallback, type CSSProperties } from "react";
import {
  Film, Play, AlertTriangle, CheckCircle, RefreshCw, Plus, X, FileText, Image, Video,
  Wand2, Brain, Radio, Music, Scissors, Star, Cpu, Award, Heart, MessageSquare,
  Layers, Type, Waves, Zap, ChevronRight, Search, Clock, Send, Download,
  Undo2, Redo2, Copy, Trash2, Split, ZoomIn, ZoomOut, Settings,
  Maximize2, Minimize2, SkipBack, SkipForward, Volume2, Subtitles, Palette,
  Filter, Sliders, Hash, Globe, BookOpen, ChevronDown, ChevronUp,
  Pause, SkipBack as Rewind, Eye, TrendingUp, Folder, Upload, Mic, AlignLeft, Sparkles,
} from "lucide-react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type Platform = "tiktok" | "youtube" | "shorts" | "instagram" | "kwai" | "twitter" | "facebook";
type InstaMode = "reels" | "feed";
type FbMode = "reels" | "feed";

type PlatformConfig = {
  label: string;
  icon: typeof Film;
  ratio: string;
  ratioClass: string;
  resolution: string;
  idealDuration: string;
  maxDuration: string;
  fps: string;
  timelineScale: "seconds" | "minutes";
  aiHints: string[];
  color: string;
};

type ReferenceAsset = {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "doc";
  size: string;
  status: "uploading" | "completed";
  progress: number;
};

type TimelineClip = {
  id: string;
  title: string;
  dur: string;
  seconds: number;
  type: "Hook" | "Content" | "Visual" | "CTA" | "Intro";
};

type VideoStatus = "idle" | "analyzing" | "projecting" | "council_review" | "rendering" | "completed" | "rejected" | "exporting";

type VideoStylePreset = {
  name: string;
  duration: string;
  trendingMusic: string[];
  trendingTransitions: string[];
  mostSearched: string[];
  baseDirectives: string;
  isCustom?: boolean;
  color: string;
  icon: typeof Wand2;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PLATFORMS: PlatformConfig[] = [
  { label: "TikTok", icon: MessageSquare, ratio: "9:16", ratioClass: "aspect-[9/16]", resolution: "1080×1920", idealDuration: "15–30s", maxDuration: "60s", fps: "30 FPS", timelineScale: "seconds", color: "text-pink-400", aiHints: ["Hook forte nos primeiros 2.5s", "Impacto visual imediato", "Retenção acelerada", "Pacing rápido com cortes densos", "Legendas destacadas", "Loop no final"] },
  { label: "YouTube", icon: Film, ratio: "16:9", ratioClass: "aspect-video", resolution: "1920×1080", idealDuration: "5–12 min", maxDuration: "30 min+", fps: "30/60 FPS", timelineScale: "minutes", color: "text-red-400", aiHints: ["Título SEO otimizado", "Miniatura atraente", "Introdução com gancho", "Curva de retenção", "Capítulos sugeridos", "Pacing e ritmo", "Descrição detalhada", "End screen + CTA"] },
  { label: "Shorts", icon: Play, ratio: "9:16", ratioClass: "aspect-[9/16]", resolution: "1080×1920", idealDuration: "15–60s", maxDuration: "60s", fps: "30 FPS", timelineScale: "seconds", color: "text-red-300", aiHints: ["Hook direto", "Retenção máxima", "Título curto", "Loop contínuo", "Legenda resumida", "Descoberta no Shorts"] },
  { label: "Instagram", icon: Heart, ratio: "9:16", ratioClass: "aspect-[9/16]", resolution: "1080×1920", idealDuration: "15–60s", maxDuration: "90s", fps: "30 FPS", timelineScale: "seconds", color: "text-purple-400", aiHints: ["Polimento visual", "Legenda envolvente", "Hashtags estratégicas", "CTA claro", "Tom da marca", "Compartilhamento"] },
  { label: "Kwai", icon: Zap, ratio: "9:16", ratioClass: "aspect-[9/16]", resolution: "1080×1920", idealDuration: "15–30s", maxDuration: "60s", fps: "30 FPS", timelineScale: "seconds", color: "text-orange-400", aiHints: ["Contexto imediato", "Clareza visual simples", "Retenção direta", "Vídeo curto popular"] },
  { label: "X / Twitter", icon: Hash, ratio: "16:9", ratioClass: "aspect-video", resolution: "1920×1080", idealDuration: "30–120s", maxDuration: "140s", fps: "30 FPS", timelineScale: "seconds", color: "text-sky-400", aiHints: ["Compressão de mensagem", "Texto de gancho forte", "Compartilhável", "Legenda curta"] },
  { label: "Facebook", icon: Globe, ratio: "9:16", ratioClass: "aspect-[9/16]", resolution: "1080×1920", idealDuration: "15–60s", maxDuration: "120s", fps: "30 FPS", timelineScale: "seconds", color: "text-blue-400", aiHints: ["Clareza", "Adequação ao público", "Legenda envolvente", "Compartilhável"] },
];

const PLATFORM_MAP: Record<Platform, PlatformConfig> = {
  tiktok: PLATFORMS[0], youtube: PLATFORMS[1], shorts: PLATFORMS[2],
  instagram: PLATFORMS[3], kwai: PLATFORMS[4], twitter: PLATFORMS[5], facebook: PLATFORMS[6],
};

const DEFAULT_PRESETS: Record<string, VideoStylePreset> = {
  tiktok: {
    name: "TikTok · Retenção Acelerada", duration: "15s – 60s",
    trendingMusic: ["Void Echoes (Lofi Synthwave)", "Amber Pulse (Techno Melodic)", "Kotaro Vibe (Acoustic Trap)"],
    trendingTransitions: ["Zoom Rápido 1.5s", "Legendas Neon Central", "Swoosh Sonoro"],
    mostSearched: ["Engenharia de Prompt IA", "IAs Gratuitas", "Automação no Navegador"],
    baseDirectives: "Ritmo frenético, hook de impacto nos primeiros 2.5s, zero pausas, paleta Void & Amber, legendas de duas palavras por frame.",
    color: "from-pink-500/20 to-rose-500/10", icon: Zap,
  },
  youtube: {
    name: "YouTube · Engajamento Profundo", duration: "5m – 12m",
    trendingMusic: ["Cyber Coffee (Chill Beats)", "Infinite Drift (Ambient Synth)"],
    trendingTransitions: ["Cortes Secos Estruturados", "B-Rolls Neon", "Zoom Lento de Ênfase"],
    mostSearched: ["Agente de autoaprendizado", "Supabase vs LocalStorage", "Estúdio de Nodes Neon"],
    baseDirectives: "Pacing conversacional premium, transição explicativa visual a cada 10s, introdução estruturada, cards informativos sobrepostos.",
    color: "from-red-500/20 to-orange-500/10", icon: Film,
  },
  cinematic: {
    name: "Documentário · Imersão Dramática", duration: "2m – 5m",
    trendingMusic: ["Odyssey Orchestral (Dramático)", "Deep Void (Soundscape)"],
    trendingTransitions: ["Fade to Black Suave", "Texturas de Luz", "Sound Design Sub-grave"],
    mostSearched: ["Evolução Sistemas AI", "Privacidade Digital", "História do YGGNAROK"],
    baseDirectives: "Estética de mistério, cores âmbar escuras, pausas dramáticas com trilha subindo de volume.",
    color: "from-amber-500/20 to-yellow-500/10", icon: Eye,
  },
  sales: {
    name: "VSL · Alta Conversão", duration: "3m – 8m",
    trendingMusic: ["Ascension (Tensão Crescente)", "Resolution (Heroica)"],
    trendingTransitions: ["Quebras de Padrão Agressivas", "Lettering Amber Piscante", "Máquina de Escrever"],
    mostSearched: ["Economizar R$15k em APIs", "Agentes para vendas", "Roteamento inteligente"],
    baseDirectives: "Copy focada na dor, quebra de objeção a cada 4 frames, música de suspense crescendo até a revelação da oferta.",
    color: "from-emerald-500/20 to-teal-500/10", icon: TrendingUp,
  },
};

const TIMELINE_CLIPS: TimelineClip[] = [
  { id: "clip_1", title: "Hook de Abertura", dur: "3s", seconds: 3, type: "Hook" },
  { id: "clip_2", title: "Apresentação do Problema", dur: "12s", seconds: 12, type: "Intro" },
  { id: "clip_3", title: "Demonstração YGGNAROK", dur: "15s", seconds: 15, type: "Visual" },
  { id: "clip_4", title: "CTA Final", dur: "10s", seconds: 10, type: "CTA" },
];

const YOUTUBE_TIMELINE_CLIPS: TimelineClip[] = [
  { id: "yt_1", title: "Intro & Hook", dur: "30s", seconds: 30, type: "Hook" },
  { id: "yt_2", title: "Contexto do Problema", dur: "1m30s", seconds: 90, type: "Intro" },
  { id: "yt_3", title: "Demonstração Principal", dur: "3m", seconds: 180, type: "Visual" },
  { id: "yt_4", title: "Casos de Uso", dur: "2m", seconds: 120, type: "Content" },
  { id: "yt_5", title: "Encerramento & CTA", dur: "45s", seconds: 45, type: "CTA" },
];

const CLIP_COLORS: Record<string, string> = {
  Hook: "bg-rose-500/25 border-rose-500/40 text-rose-300",
  Intro: "bg-amber-500/25 border-amber-500/40 text-amber-300",
  Visual: "bg-brand/25 border-brand/40 text-brand",
  Content: "bg-sky-500/25 border-sky-500/40 text-sky-300",
  CTA: "bg-emerald-500/25 border-emerald-500/40 text-emerald-300",
};

const EDITOR_BUTTONS = [
  { icon: Undo2, label: "Desfazer", key: "ctrl+z" },
  { icon: Redo2, label: "Refazer", key: "ctrl+y" },
  { icon: Copy, label: "Copiar", key: "ctrl+c" },
  { icon: Trash2, label: "Excluir", key: "del" },
  { icon: Split, label: "Dividir", key: "s" },
  { icon: ZoomIn, label: "Zoom +" },
  { icon: ZoomOut, label: "Zoom -" },
];

function formatDuration(totalSeconds: number): string {
  if (totalSeconds >= 60) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m${s > 0 ? `${s}s` : ""}`;
  }
  return `${totalSeconds}s`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function EstudioVideoClient() {
  // ── Platform ──
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("tiktok");
  const [instaMode, setInstaMode] = useState<InstaMode>("reels");
  const [fbMode, setFbMode] = useState<FbMode>("reels");
  const platform = PLATFORM_MAP[selectedPlatform];

  // ── Left Panel Tabs ──
  const [leftTab, setLeftTab] = useState<"references" | "files" | "briefing">("references");
  const [rightTab, setRightTab] = useState<"ai" | "style" | "trend" | "export">("ai");

  // ── Refs ──
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const assetIdCounterRef = useRef(0);
  const playheadRef = useRef<HTMLDivElement>(null);

  // ── Reference Assets ──
  const [referenceLink, setReferenceLink] = useState("");
  const [referenceAssets, setReferenceAssets] = useState<ReferenceAsset[]>([]);

  // ── Briefing ──
  const [ideaDescription, setIdeaDescription] = useState("");

  // ── AI Analysis ──
  const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<string[]>([]);

  // ── Style / Presets ──
  const [videoStyle, setVideoStyle] = useState<string>("tiktok");
  const [allPresets, setAllPresets] = useState<Record<string, VideoStylePreset>>(DEFAULT_PRESETS);
  const [showStyleCreator, setShowStyleCreator] = useState(false);
  const [customStyleName, setCustomStyleName] = useState("");
  const [customStyleDuration, setCustomStyleDuration] = useState("");
  const [customStyleMusic, setCustomStyleMusic] = useState("");
  const [customStyleTransitions, setCustomStyleTransitions] = useState("");
  const [customStyleDirectives, setCustomStyleDirectives] = useState("");

  // ── Raw Files ──
  const [rawFiles, setRawFiles] = useState<string[]>(["arquivo_bruto_intro.mp4", "b-roll_canvas_nodes.mov", "trilha_ambient.mp3"]);
  const [newFileName, setNewFileName] = useState("");

  // ── Trend Radar ──
  const [trendRadarLogs, setTrendRadarLogs] = useState<string[]>([
    "Gancho mais retentivo: Zoom Rápido no segundo 1.8.",
    "Batida Recomendada: Synthwave Melodic (124BPM).",
    "Hashtag em alta: #YGGNAROK #AutomaçãoIA",
  ]);
  const [isScanningTrends, setIsScanningTrends] = useState(false);

  // ── Video Pipeline ──
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("idle");
  const [progressVal, setProgressVal] = useState(0);
  const [exportLogs, setExportLogs] = useState<string[]>([]);
  const [rejectionError, setRejectionError] = useState("");
  const [absorbedFeedback, setAbsorbedFeedback] = useState<string[]>([]);
  const [councilMessages, setCouncilMessages] = useState<{ agent: string; avatar: string; message: string; status: "thinking" | "approved" }[]>([]);

  // ── Player ──
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPos, setPlayheadPos] = useState(0);
  const [volume, setVolume] = useState(80);

  // ── Export ──
  const [showExportPopover, setShowExportPopover] = useState(false);
  const [exportPopoverStyle, setExportPopoverStyle] = useState<CSSProperties>({});
  const [, setExportStep] = useState(0);

  // ── Toast ──
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const timelineClips = selectedPlatform === "youtube" ? YOUTUBE_TIMELINE_CLIPS : TIMELINE_CLIPS;
  const isYouTube = selectedPlatform === "youtube";
  const isVertical = platform.ratio === "9:16";
  const activePreset = allPresets[videoStyle] || DEFAULT_PRESETS["tiktok"];
  const timelineTotalSeconds = timelineClips.reduce((sum, c) => sum + c.seconds, 0);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Playhead animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayheadPos(prev => {
        if (prev >= 100) { setIsPlaying(false); return 0; }
        return prev + 0.3;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Export Popover click-outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        exportBtnRef.current && !exportBtnRef.current.contains(e.target as Node)) {
        setShowExportPopover(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowExportPopover(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const toggleExportPopover = useCallback(() => {
    if (!showExportPopover && exportBtnRef.current) {
      const rect = exportBtnRef.current.getBoundingClientRect();
      setExportPopoverStyle({
        bottom: `${window.innerHeight - rect.top + 8}px`,
        right: `${window.innerWidth - rect.right}px`,
      });
    }
    setShowExportPopover(open => !open);
  }, [showExportPopover]);

  const runAiAnalysis = () => {
    setAiAnalysisRunning(true);
    setAiAnalysisResults([]);
    const hints = platform.aiHints;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < hints.length) {
        setAiAnalysisResults(prev => [...prev, hints[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setAiAnalysisRunning(false);
        showToast(`Análise IA para ${platform.label} concluída!`);
      }
    }, 500);
  };

  const scanTrends = () => {
    setIsScanningTrends(true);
    setTimeout(() => {
      setTrendRadarLogs(prev => [
        `[${new Date().toLocaleTimeString("pt-BR")}] Hook atualizado: Zoom + Shake nos primeiros 1.5s`,
        `[${new Date().toLocaleTimeString("pt-BR")}] Música em alta: Lo-Fi Cinematic (112BPM)`,
        ...prev.slice(0, 4),
      ]);
      setIsScanningTrends(false);
    }, 2000);
  };

  const runVideoEditingPipeline = () => {
    if (videoStatus !== "idle" && videoStatus !== "rejected") return;
    setProgressVal(10);
    setVideoStatus("analyzing");
    setTimeout(() => {
      setProgressVal(35);
      setVideoStatus("projecting");
      setTimeout(() => {
        setProgressVal(60);
        setVideoStatus("council_review");
        setCouncilMessages([{ agent: "Isis (Edição & Pacing)", avatar: "✨", message: `Analisando cortes brutos para ${platform.label}... Proponho ritmo otimizado.`, status: "thinking" }]);
        setTimeout(() => {
          setCouncilMessages(prev => [...prev.map(c => ({ ...c, status: "approved" as const })), { agent: "Morax (Ganchos)", avatar: "🔥", message: `Hook inicial otimizado para retenção em ${platform.label}.`, status: "thinking" }]);
        }, 1500);
        setTimeout(() => {
          setCouncilMessages(prev => [...prev.map(c => c.agent.includes("Morax") ? { ...c, status: "approved" as const } : c), { agent: "Hefesto (Tipografia)", avatar: "🦾", message: "Legendas e sobreposição aprovadas. Inter Ultra-Bold aplicado.", status: "thinking" }]);
        }, 3000);
        setTimeout(() => {
          setCouncilMessages(prev => prev.map(c => ({ ...c, status: "approved" as const })));
          setProgressVal(80);
          setVideoStatus("rendering");
          setTimeout(() => { setProgressVal(100); setVideoStatus("completed"); showToast("Render concluído com sucesso!", "success"); }, 2000);
        }, 4500);
      }, 2500);
    }, 2000);
  };

  const handleCreateCustomStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStyleName.trim() || !customStyleDirectives.trim()) return;
    const styleKey = `custom_${Date.now()}`;
    setAllPresets(prev => ({
      ...prev, [styleKey]: {
        name: `✨ ${customStyleName.trim()}`, duration: customStyleDuration.trim() || "Livre",
        trendingMusic: customStyleMusic ? customStyleMusic.split(",").map(m => m.trim()) : ["Música customizada"],
        trendingTransitions: customStyleTransitions ? customStyleTransitions.split(",").map(t => t.trim()) : ["Transição livre"],
        mostSearched: ["Configurações customizadas"], baseDirectives: customStyleDirectives.trim(),
        isCustom: true, color: "from-violet-500/20 to-purple-500/10", icon: Sparkles,
      }
    }));
    setVideoStyle(styleKey);
    setShowStyleCreator(false);
    setCustomStyleName(""); setCustomStyleDuration(""); setCustomStyleMusic("");
    setCustomStyleTransitions(""); setCustomStyleDirectives("");
    showToast("Estilo customizado criado!");
  };

  const handleSimulateAssetUpload = (type: "image" | "video" | "audio" | "doc") => {
    const fileNamesMap = { image: "referencia_moodboard.png", video: "corte_referencia.mp4", audio: "efeito_swoosh.mp3", doc: "roteiro_vendas.pdf" };
    assetIdCounterRef.current += 1;
    const nextAsset: ReferenceAsset = { id: `asset_${assetIdCounterRef.current}`, name: fileNamesMap[type], type, size: type === "video" ? "14.2 MB" : type === "image" ? "1.8 MB" : type === "audio" ? "600 KB" : "120 KB", status: "uploading", progress: 0 };
    setReferenceAssets(prev => [...prev, nextAsset]);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setReferenceAssets(prev => prev.map(a => a.id === nextAsset.id ? { ...a, progress: prog } : a));
      if (prog >= 100) { clearInterval(interval); setReferenceAssets(prev => prev.map(a => a.id === nextAsset.id ? { ...a, status: "completed" } : a)); }
    }, 300);
  };

  const handleRemoveAsset = (id: string) => setReferenceAssets(referenceAssets.filter(a => a.id !== id));

  const handleRejectVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionError.trim()) return;
    const errorFact = `[ERRO EDIÇÃO] Estilo: ${videoStyle}. Correção: ${rejectionError.trim()}`;
    const username = typeof window !== "undefined" ? (localStorage.getItem("yggnarok.username") || "kotaro") : "kotaro";
    const storedMems = typeof window !== "undefined" ? localStorage.getItem(`yggnarok.${username}.ltm_memories`) : null;
    let memoriesList: { id: string; category: string; fact: string; timestamp: string; confidence: number }[] = [];
    if (storedMems) memoriesList = JSON.parse(storedMems);
    if (typeof window !== "undefined") {
      localStorage.setItem(`yggnarok.${username}.ltm_memories`, JSON.stringify([{ id: `mem_video_error_${Date.now()}`, category: "tecnico", fact: errorFact, timestamp: new Date().toISOString(), confidence: 100 }, ...memoriesList]));
    }
    setAbsorbedFeedback([rejectionError.trim(), ...absorbedFeedback]);
    setVideoStatus("rejected"); setRejectionError(""); setProgressVal(0); setCouncilMessages([]);
    showToast("Feedback absorvido pela memória dos agentes.");
  };

  const handleExportConfirm = () => {
    setShowExportPopover(false);
    const steps = ["Preparando arquivo...", "Otimizando codec e resolução...", "✓ Pronto para exportar!"];
    setVideoStatus("exporting");
    setExportLogs([steps[0]]);
    setExportStep(0);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < steps.length) { setExportStep(idx); setExportLogs(prev => [...prev, steps[idx]]); }
      else { clearInterval(interval); setTimeout(() => { setVideoStatus("idle"); setExportLogs([]); showToast("Exportação concluída!"); }, 2500); }
    }, 1200);
  };

  const exportInfo = () => {
    switch (selectedPlatform) {
      case "tiktok": return ["✓ TikTok · 9:16 vertical", "✓ Resolução: 1080×1920", `✓ Duração: ${platform.idealDuration}`, `✓ FPS: ${platform.fps}`];
      case "youtube": return ["✓ YouTube · 16:9 horizontal", "✓ Resolução: 1920×1080", "✓ FPS: 30/60 disponível", "⚠ Lembrete: miniatura + título"];
      case "shorts": return ["✓ YouTube Shorts · 9:16", "✓ Resolução: 1080×1920", `✓ Duração: ${platform.idealDuration}`];
      case "instagram": return instaMode === "reels" ? ["✓ Reels · 9:16", "✓ 1080×1920", "⚠ Legenda otimizada"] : ["✓ Feed Instagram", "✓ 1:1 ou 4:5", "⚠ Hashtags + CTA"];
      case "kwai": return ["✓ Kwai · 9:16", "✓ 1080×1920", "✓ Vídeo curto otimizado"];
      case "twitter": return ["✓ X/Twitter configurável", "⚠ Legenda + contexto"];
      case "facebook": return fbMode === "reels" ? ["✓ Facebook Reels · 9:16", "✓ 1080×1920"] : ["✓ Facebook Feed · 16:9", "⚠ Legenda + engajamento"];
    }
  };

  const videoScriptTitle = "Como Economizar 100% de APIs com YGGNAROK";

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <main className="min-h-screen text-foreground relative bg-background select-none overflow-hidden">
      <style>{`
        @keyframes floatAlert { 0% { transform: translateY(6px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .animate-alert-pop { animation: floatAlert 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes progressGlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-glow-bar { background-size: 200% 200%; animation: progressGlow 2s ease infinite; }
        @keyframes playheadPulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
        .playhead-line { animation: playheadPulse 1s ease-in-out infinite; }
        .scrollbar-thin::-webkit-scrollbar { width: 3px; height: 3px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(248,195,102,0.25); border-radius: 99px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(248,195,102,0.5); }
        @keyframes scanLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(600%); } }
        .scan-line { animation: scanLine 3s linear infinite; opacity: 0.04; }
        .tab-active { position: relative; }
        .tab-active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--brand); border-radius: 1px; }
        @keyframes councilEntry { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .council-entry { animation: councilEntry 0.3s ease forwards; }
      `}</style>

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand/6 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-amber-500/6 blur-[120px] rounded-full pointer-events-none" />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[var(--z-toast)] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-extrabold shadow-2xl backdrop-blur-xl animate-alert-pop ${toast.type === "success" ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-400" : "border-rose-500/30 bg-rose-950/90 text-rose-400"}`}>
          {toast.type === "success" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col h-screen px-3 py-3 gap-2.5 max-w-[1800px] mx-auto">

        {/* ═══════════ HEADER ═══════════ */}
        <div className="shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand/75 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-brand">Estúdio de Vídeo · Odin OS</span>
            </div>
            <h1 className="font-serif text-lg font-black tracking-widest bg-gradient-to-r from-brand via-amber-200 to-brand-strong bg-clip-text text-transparent">
              Video Creation Studio
            </h1>
          </div>

          {/* Platform Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin flex-1 justify-center">
            {(Object.entries(PLATFORM_MAP) as [Platform, PlatformConfig][]).map(([key, p]) => {
              const Icon = p.icon;
              const isActive = selectedPlatform === key;
              return (
                <div key={key} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => { setSelectedPlatform(key); setShowExportPopover(false); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border transition-all duration-200 ${isActive
                      ? "border-brand bg-brand/10 text-brand shadow-[0_0_12px_rgba(248,195,102,0.12)]"
                      : "border-line/30 bg-black/20 text-muted hover:text-foreground hover:border-line/50"
                    }`}
                  >
                    <Icon size={12} className={isActive ? "text-brand" : p.color} />
                    <span>{p.label}</span>
                    <span className="text-[7px] opacity-40">{p.ratio}</span>
                  </button>
                  {isActive && (key === "instagram" || key === "facebook") && (
                    <div className="absolute top-full left-0 mt-1 flex gap-0.5 z-10">
                      {["reels", "feed"].map(mode => (
                        <button key={mode} type="button"
                          onClick={() => key === "instagram" ? setInstaMode(mode as InstaMode) : setFbMode(mode as FbMode)}
                          className={`px-2 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider border transition ${(key === "instagram" ? instaMode : fbMode) === mode ? "border-brand/40 bg-brand/15 text-brand" : "border-line/20 bg-black/40 text-muted"}`}
                        >{mode}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {EDITOR_BUTTONS.slice(0, 4).map(b => (
              <button key={b.label} type="button" title={`${b.label}${b.key ? ` (${b.key})` : ""}`}
                className="size-7 rounded-lg border border-line/20 bg-black/20 grid place-items-center text-muted hover:text-white hover:border-line/40 transition">
                <b.icon size={12} />
              </button>
            ))}
            <div className="h-4 w-px bg-line/30" />
            <button type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand/25 bg-brand/8 text-[9px] font-bold text-brand hover:bg-brand/15 transition">
              <Brain size={11} /> Geração IA
            </button>
            <button ref={exportBtnRef} type="button" onClick={toggleExportPopover}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-neutral-950 text-[9px] font-black hover:bg-brand-strong transition shadow-lg shadow-brand/20">
              <Send size={11} /> ENVIAR
            </button>
          </div>
        </div>

        {/* ═══════════ MAIN AREA: 3 COLUMNS ═══════════ */}
        <div className="flex-1 min-h-0 flex gap-2.5">

          {/* ─── LEFT PANEL ─── */}
          <div className="w-[240px] shrink-0 flex flex-col gap-2 rounded-xl border border-line/25 bg-surface/30 backdrop-blur-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-line/20 px-2 pt-2 gap-0 shrink-0">
              {[
                { id: "references" as const, icon: Search, label: "Refs" },
                { id: "files" as const, icon: Folder, label: "Arquivos" },
                { id: "briefing" as const, icon: AlignLeft, label: "Briefing" },
              ].map(tab => (
                <button key={tab.id} type="button" onClick={() => setLeftTab(tab.id)}
                  className={`flex items-center gap-1 px-2.5 pb-2 text-[9px] font-bold uppercase tracking-wider transition ${leftTab === tab.id ? "tab-active text-brand" : "text-muted hover:text-foreground"}`}>
                  <tab.icon size={10} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-2.5 space-y-2">

              {/* REFERENCES TAB */}
              {leftTab === "references" && (
                <div className="space-y-2">
                  <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Link de Referência</p>
                  <div className="flex gap-1">
                    <input type="text" placeholder="TikTok, YouTube..." value={referenceLink}
                      onChange={e => setReferenceLink(e.target.value)}
                      className="flex-1 h-7 rounded-lg border border-line/20 bg-black/30 px-2 text-[10px] text-foreground outline-none focus:border-brand/40 transition placeholder:text-muted/40" />
                    <button type="button" className="size-7 rounded-lg bg-brand/10 border border-brand/20 grid place-items-center text-brand hover:bg-brand/20 transition">
                      <Plus size={11} />
                    </button>
                  </div>
                  <p className="text-[9px] text-muted font-bold uppercase tracking-wider pt-1">Assets de Referência</p>
                  <div className="grid grid-cols-2 gap-1">
                    {(["image", "video", "audio", "doc"] as const).map(type => {
                      const icons = { image: Image, video: Video, audio: Music, doc: FileText };
                      const Icon = icons[type];
                      return (
                        <button key={type} type="button" onClick={() => handleSimulateAssetUpload(type)}
                          className="flex flex-col items-center gap-1 rounded-lg border border-line/20 bg-black/20 py-2 px-1 text-[8px] font-bold text-muted hover:text-white hover:border-line/40 transition">
                          <Icon size={14} />
                          <span className="capitalize">{type}</span>
                        </button>
                      );
                    })}
                  </div>
                  {referenceAssets.length > 0 && (
                    <div className="space-y-1">
                      {referenceAssets.map(a => (
                        <div key={a.id} className="rounded-lg border border-line/15 bg-black/20 p-1.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[8px] text-muted truncate max-w-[130px]">{a.name}</span>
                            <button type="button" onClick={() => handleRemoveAsset(a.id)} className="text-rose-400 hover:text-rose-300">
                              <X size={9} />
                            </button>
                          </div>
                          {a.status === "uploading" ? (
                            <div className="h-0.5 bg-black/30 rounded-full overflow-hidden">
                              <div className="h-full bg-brand rounded-full transition-all duration-300" style={{ width: `${a.progress}%` }} />
                            </div>
                          ) : (
                            <span className="text-[7px] text-emerald-400 flex items-center gap-0.5"><CheckCircle size={8} /> {a.size}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* FILES TAB */}
              {leftTab === "files" && (
                <div className="space-y-2">
                  <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Arquivos Brutos</p>
                  <div className="space-y-1">
                    {rawFiles.map((f, i) => {
                      const ext = f.split(".").pop() || "";
                      const isVideo = ["mp4", "mov", "avi"].includes(ext);
                      const isAudio = ["mp3", "wav", "ogg"].includes(ext);
                      return (
                        <div key={i} className="flex items-center gap-1.5 rounded-lg border border-line/15 bg-black/20 px-2 py-1.5 group">
                          {isVideo ? <Video size={10} className="text-amber-400 shrink-0" /> : isAudio ? <Music size={10} className="text-emerald-400 shrink-0" /> : <FileText size={10} className="text-sky-400 shrink-0" />}
                          <span className="text-[8px] text-muted flex-1 truncate">{f}</span>
                          <button type="button" onClick={() => setRawFiles(rawFiles.filter((_, j) => j !== i))}
                            className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 transition">
                            <X size={9} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-1">
                    <input type="text" placeholder="nome-do-arquivo.mp4" value={newFileName}
                      onChange={e => setNewFileName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && newFileName.trim()) { setRawFiles(prev => [...prev, newFileName.trim()]); setNewFileName(""); } }}
                      className="flex-1 h-7 rounded-lg border border-line/20 bg-black/30 px-2 text-[10px] text-foreground outline-none focus:border-brand/40 transition placeholder:text-muted/40" />
                    <button type="button"
                      onClick={() => { if (newFileName.trim()) { setRawFiles(prev => [...prev, newFileName.trim()]); setNewFileName(""); } }}
                      className="size-7 rounded-lg bg-brand/10 border border-brand/20 grid place-items-center text-brand hover:bg-brand/20 transition">
                      <Plus size={11} />
                    </button>
                  </div>
                  <button type="button"
                    className="w-full py-2 rounded-lg border border-dashed border-line/20 text-[9px] text-muted hover:text-white hover:border-line/40 transition flex items-center justify-center gap-1.5">
                    <Upload size={11} /> Importar Arquivo
                  </button>
                </div>
              )}

              {/* BRIEFING TAB */}
              {leftTab === "briefing" && (
                <div className="space-y-2">
                  <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Ideia / Briefing</p>
                  <textarea placeholder="Descreva sua ideia para o vídeo, objetivo, público-alvo, mensagem principal..."
                    value={ideaDescription} onChange={e => setIdeaDescription(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-line/20 bg-black/30 px-2.5 py-2 text-[10px] text-foreground outline-none focus:border-brand/40 transition placeholder:text-muted/40 resize-none" />
                  <p className="text-[9px] text-muted font-bold uppercase tracking-wider pt-1">Instruções de Edição</p>
                  <textarea placeholder="Instruções específicas para os agentes de IA editarem o vídeo..."
                    rows={4}
                    className="w-full rounded-lg border border-line/20 bg-black/30 px-2.5 py-2 text-[10px] text-foreground outline-none focus:border-brand/40 transition placeholder:text-muted/40 resize-none" />
                  <button type="button" className="w-full py-1.5 rounded-lg bg-brand/10 border border-brand/20 text-[9px] font-bold text-brand hover:bg-brand/20 transition flex items-center justify-center gap-1.5">
                    <Wand2 size={11} /> Salvar Briefing
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ─── CENTER: PREVIEW + TIMELINE + TRACKS ─── */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">

            {/* VIDEO PREVIEW */}
            <div className="flex-1 min-h-0 rounded-xl border border-line/25 bg-black/50 backdrop-blur-sm overflow-hidden relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/3 via-transparent to-amber-500/3 pointer-events-none" />
              {/* Scan line effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="scan-line w-full h-12 bg-gradient-to-b from-transparent via-brand/5 to-transparent" />
              </div>

              {/* Preview window */}
              <div className={`${isVertical ? "h-full max-h-[calc(100%-2rem)]" : "w-full max-w-[calc(100%-2rem)]"} ${isVertical ? (isYouTube ? "aspect-video max-w-[90%]" : "aspect-[9/16] max-w-[120px]") : "aspect-video"} rounded-xl border border-line/20 bg-black/80 flex items-center justify-center relative overflow-hidden group transition-all duration-300`}
                style={isVertical && !isYouTube ? { maxHeight: "100%", height: "auto" } : {}}>

                {/* Preview content */}
                <div className="flex flex-col items-center gap-3 z-10">
                  {videoStatus === "rendering" ? (
                    <>
                      <RefreshCw size={32} className="text-brand animate-spin" />
                      <span className="text-[9px] text-brand font-mono tracking-widest animate-pulse">RENDERIZANDO...</span>
                    </>
                  ) : videoStatus === "completed" ? (
                    <>
                      <CheckCircle size={28} className="text-emerald-400" />
                      <span className="text-[9px] text-emerald-400 font-mono tracking-widest">RENDER COMPLETO</span>
                    </>
                  ) : videoStatus === "exporting" ? (
                    <>
                      <Download size={28} className="text-sky-400 animate-bounce" />
                      <span className="text-[9px] text-sky-400 font-mono tracking-widest">EXPORTANDO...</span>
                    </>
                  ) : (
                    <>
                      <div className="size-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                        <Play size={20} className="text-brand/50 translate-x-0.5" />
                      </div>
                      <span className="text-[8px] text-white/30 font-mono">{platform.ratio} · {platform.resolution}</span>
                    </>
                  )}
                </div>

                {/* Overlay info */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-[7px] text-white/40 font-mono truncate max-w-[60%]">{videoScriptTitle}</span>
                  <span className="text-[7px] text-white/30 font-mono">{platform.fps}</span>
                </div>

                {/* Corner editor buttons on hover */}
                <div className="absolute top-2 left-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition duration-200">
                  {EDITOR_BUTTONS.slice(0, 4).map(b => (
                    <button key={b.label} type="button" title={b.label}
                      className="size-6 rounded-md bg-black/70 border border-white/10 grid place-items-center text-white/50 hover:text-white hover:border-white/30 transition">
                      <b.icon size={10} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform badge */}
              <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-md bg-black/60 border border-line/20 ${platform.color}`}>
                  {platform.label}
                </span>
                <span className="text-[7px] font-mono text-muted bg-black/40 px-1.5 py-0.5 rounded">{platform.ratio}</span>
                {videoStatus !== "idle" && videoStatus !== "completed" && videoStatus !== "exporting" && (
                  <div className="flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5 border border-amber-500/20">
                    <RefreshCw size={8} className="text-amber-400 animate-spin" />
                    <span className="text-[7px] text-amber-400 font-mono">{Math.round(progressVal)}%</span>
                  </div>
                )}
              </div>

              {/* Video playback controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col gap-1.5 opacity-0 hover:opacity-100 group-hover:opacity-100 transition duration-200">
                {/* Seek bar */}
                <div className="relative w-full h-1 bg-white/10 rounded-full cursor-pointer" onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setPlayheadPos(((e.clientX - rect.left) / rect.width) * 100);
                }}>
                  <div className="h-full bg-brand rounded-full transition-all duration-100" style={{ width: `${playheadPos}%` }} />
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-2.5 rounded-full bg-brand shadow-lg shadow-brand/50" style={{ left: `${playheadPos}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => setPlayheadPos(0)} className="text-white/60 hover:text-white"><SkipBack size={12} /></button>
                    <button type="button" onClick={() => setIsPlaying(p => !p)}
                      className="size-6 rounded-full bg-brand/20 border border-brand/30 grid place-items-center text-brand hover:bg-brand/30 transition">
                      {isPlaying ? <Pause size={11} /> : <Play size={11} className="translate-x-0.5" />}
                    </button>
                    <button type="button" className="text-white/60 hover:text-white"><SkipForward size={12} /></button>
                    <span className="text-[8px] text-white/50 font-mono ml-1">{formatDuration(Math.round(timelineTotalSeconds * playheadPos / 100))} / {formatDuration(timelineTotalSeconds)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Volume2 size={10} className="text-white/40" />
                    <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))}
                      className="w-14 accent-brand h-0.5" />
                    <span className="text-[7px] text-white/40 font-mono w-6">{volume}%</span>
                    <Maximize2 size={11} className="text-white/40 hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* TIMELINE RULER */}
            <div className="shrink-0 rounded-xl border border-line/20 bg-black/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Clock size={9} /> Timeline · {formatDuration(timelineTotalSeconds)}
                </span>
                <div className="flex items-center gap-1">
                  {EDITOR_BUTTONS.slice(5).map(b => (
                    <button key={b.label} type="button" title={b.label}
                      className="size-6 rounded-md border border-line/15 bg-black/30 grid place-items-center text-muted hover:text-white hover:border-line/40 transition">
                      <b.icon size={10} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative overflow-x-auto scrollbar-thin" style={{ height: "70px" }}>
                <div className="relative" style={{ minWidth: `${Math.max(timelineClips.length * 120, 600)}px`, height: "100%" }}>
                  {/* Ruler */}
                  <div className="absolute top-0 left-0 right-0 h-4 flex items-end">
                    {Array.from({ length: 9 }, (_, i) => {
                      const t = Math.round((i / 8) * timelineTotalSeconds);
                      return (
                        <div key={i} className="absolute flex flex-col items-center" style={{ left: `${(i / 8) * 100}%` }}>
                          <span className="text-[6px] font-mono text-muted/50">{formatDuration(t)}</span>
                          <div className="h-2 w-px bg-line/20 mt-0.5" />
                        </div>
                      );
                    })}
                  </div>
                  {/* Playhead */}
                  <div ref={playheadRef} className="absolute top-0 bottom-0 w-px bg-brand playhead-line z-10" style={{ left: `${playheadPos}%` }}>
                    <div className="absolute -top-0.5 -translate-x-1/2 size-1.5 rounded-full bg-brand shadow-sm shadow-brand/50" />
                  </div>
                  {/* Clips */}
                  <div className="absolute top-4 left-0 right-0 bottom-0 flex gap-0.5">
                    {timelineClips.map(clip => {
                      const widthPct = (clip.seconds / timelineTotalSeconds) * 100;
                      return (
                        <div key={clip.id}
                          className={`relative h-full rounded-md border flex items-center justify-center cursor-pointer group hover:brightness-125 transition flex-shrink-0 ${CLIP_COLORS[clip.type] || "bg-brand/15 border-brand/30 text-brand"}`}
                          style={{ width: `${Math.max(widthPct, 6)}%` }}>
                          <div className="flex flex-col items-center gap-0.5 px-1">
                            <span className="text-[6px] font-extrabold uppercase tracking-wide truncate w-full text-center">{clip.type}</span>
                            <span className="text-[5px] font-mono opacity-70">{clip.dur}</span>
                          </div>
                          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-md transition" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* TRACK LANES */}
            <div className="shrink-0 rounded-xl border border-line/20 bg-black/40 p-3">
              <span className="text-[8px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1.5 mb-2">
                <Layers size={9} /> Tracks
              </span>
              <div className="space-y-1.5">
                {[
                  { icon: Video, label: "Vídeo", color: "text-amber-400 bg-amber-500/8 border-amber-500/15", clips: [{ id: "t1", label: "Clip principal", dur: "25s", w: 45 }, { id: "t2", label: "B-Roll", dur: "15s", w: 28 }] },
                  { icon: Subtitles, label: "Texto / Legendas", color: "text-sky-400 bg-sky-500/8 border-sky-500/15", clips: [{ id: "c1", label: "Legenda principal", dur: "25s", w: 45 }, { id: "c2", label: "CTA sobreposto", dur: "10s", w: 18 }] },
                  { icon: Volume2, label: "Áudio", color: "text-emerald-400 bg-emerald-500/8 border-emerald-500/15", clips: [{ id: "a1", label: "Trilha de fundo", dur: "40s", w: 72 }, { id: "a2", label: "Efeito", dur: "2s", w: 5 }] },
                  { icon: Zap, label: "Efeitos", color: "text-rose-400 bg-rose-500/8 border-rose-500/15", clips: [{ id: "e1", label: "Zoom", dur: "1.5s", w: 5 }, { id: "e2", label: "Fade", dur: "1s", w: 4 }] },
                ].map(track => {
                  const Icon = track.icon;
                  return (
                    <div key={track.label} className="flex items-center gap-2">
                      <div className="w-[100px] shrink-0 flex items-center gap-1.5">
                        <Icon size={10} className={track.color.split(" ")[0]} />
                        <span className={`text-[7px] font-bold uppercase tracking-wider ${track.color.split(" ")[0]}`}>{track.label}</span>
                      </div>
                      <div className="flex-1 h-6 rounded-md bg-black/30 border border-line/10 relative overflow-hidden flex items-center gap-0.5 px-0.5">
                        {track.clips.map(c => (
                          <div key={c.id} className={`h-[80%] rounded border flex items-center px-1 cursor-pointer hover:brightness-125 transition ${track.color}`}
                            style={{ width: `${c.w}%`, minWidth: "20px" }}>
                            <span className="text-[6px] font-medium truncate">{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── RIGHT PANEL ─── */}
          <div className="w-[260px] shrink-0 flex flex-col gap-2 rounded-xl border border-line/25 bg-surface/30 backdrop-blur-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-line/20 px-2 pt-2 gap-0 shrink-0">
              {[
                { id: "ai" as const, icon: Brain, label: "IA" },
                { id: "style" as const, icon: Palette, label: "Estilo" },
                { id: "trend" as const, icon: TrendingUp, label: "Trend" },
                { id: "export" as const, icon: Download, label: "Export" },
              ].map(tab => (
                <button key={tab.id} type="button" onClick={() => setRightTab(tab.id)}
                  className={`flex items-center gap-1 px-2.5 pb-2 text-[9px] font-bold uppercase tracking-wider transition ${rightTab === tab.id ? "tab-active text-brand" : "text-muted hover:text-foreground"}`}>
                  <tab.icon size={10} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin p-2.5 space-y-2">

              {/* AI ANALYSIS TAB */}
              {rightTab === "ai" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                      <Brain size={10} className="text-brand" /> Análise IA · {platform.label}
                    </p>
                    <button type="button" onClick={runAiAnalysis} disabled={aiAnalysisRunning}
                      className="flex items-center gap-1 rounded-md bg-brand/10 border border-brand/20 px-2 py-0.5 text-[8px] font-bold text-brand hover:bg-brand/20 transition disabled:opacity-50">
                      <RefreshCw size={9} className={aiAnalysisRunning ? "animate-spin" : ""} />
                      {aiAnalysisRunning ? "Analisando..." : "Analisar"}
                    </button>
                  </div>
                  <div className="space-y-1 max-h-[180px] overflow-y-auto scrollbar-thin">
                    {aiAnalysisResults.length > 0 ? aiAnalysisResults.map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5 council-entry">
                        <CheckCircle size={9} className="text-emerald-400 mt-0.5 shrink-0" />
                        <p className="text-[9px] text-foreground/80 leading-tight">{r}</p>
                      </div>
                    )) : (
                      <p className="text-[9px] text-muted/50 italic">Clique em &quot;Analisar&quot; para obter dicas de IA para {platform.label}.</p>
                    )}
                  </div>

                  {/* Absorbed Feedback */}
                  {absorbedFeedback.length > 0 && (
                    <>
                      <div className="h-px bg-line/20" />
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                        <Cpu size={10} /> Memória dos Agentes
                      </p>
                      <div className="space-y-1 max-h-[100px] overflow-y-auto scrollbar-thin">
                        {absorbedFeedback.slice(0, 5).map((f, i) => (
                          <div key={i} className="text-[8px] text-amber-400/70 flex items-start gap-1">
                            <span className="text-amber-500/50">▸</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Council messages */}
                  {councilMessages.length > 0 && (
                    <>
                      <div className="h-px bg-line/20" />
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                        <Award size={10} /> Conselho IA
                      </p>
                      <div className="space-y-1.5 max-h-[120px] overflow-y-auto scrollbar-thin">
                        {councilMessages.map((m, i) => (
                          <div key={i} className={`flex items-start gap-1.5 rounded-lg p-1.5 border council-entry ${m.status === "approved" ? "border-emerald-500/15 bg-emerald-500/5" : "border-amber-500/15 bg-amber-500/5"}`}>
                            <span className="text-sm shrink-0">{m.avatar}</span>
                            <div className="flex-1 min-w-0">
                              <span className={`text-[7px] font-bold block ${m.status === "approved" ? "text-emerald-400" : "text-amber-400 animate-pulse"}`}>{m.agent}</span>
                              <p className="text-[7px] text-muted/80 leading-tight mt-0.5">{m.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STYLE TAB */}
              {rightTab === "style" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] text-muted font-bold uppercase tracking-wider">Estilos / Presets</p>
                    <button type="button" onClick={() => setShowStyleCreator(!showStyleCreator)}
                      className="flex items-center gap-1 rounded-md bg-brand/10 border border-brand/20 px-1.5 py-0.5 text-[8px] font-bold text-brand hover:bg-brand/20 transition">
                      <Plus size={9} /> Novo
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {Object.entries(allPresets).map(([key, preset]) => {
                      const PresetIcon = preset.icon;
                      const isActive = videoStyle === key;
                      return (
                        <button key={key} type="button" onClick={() => setVideoStyle(key)}
                          className={`w-full text-left rounded-xl border p-2.5 transition-all duration-200 ${isActive ? `border-brand/40 bg-gradient-to-br ${preset.color} shadow-lg shadow-brand/5` : "border-line/15 bg-black/20 hover:border-line/30 hover:bg-black/30"}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <PresetIcon size={11} className={isActive ? "text-brand" : "text-muted"} />
                            <span className={`text-[9px] font-black truncate ${isActive ? "text-brand" : "text-foreground/80"}`}>{preset.name}</span>
                            {isActive && <CheckCircle size={9} className="text-brand ml-auto shrink-0" />}
                          </div>
                          <span className="text-[7px] text-muted font-mono">{preset.duration}</span>
                          {isActive && (
                            <div className="mt-2 space-y-1">
                              <p className="text-[7px] text-muted/70 leading-tight line-clamp-2">{preset.baseDirectives}</p>
                              <div className="flex flex-wrap gap-0.5 mt-1">
                                {preset.trendingTransitions.slice(0, 2).map((t, i) => (
                                  <span key={i} className="text-[6px] bg-brand/10 border border-brand/20 text-brand px-1 py-0.5 rounded">{t}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom style creator */}
                  {showStyleCreator && (
                    <form onSubmit={handleCreateCustomStyle} className="rounded-xl border border-brand/20 bg-brand/5 p-2.5 space-y-2">
                      <p className="text-[9px] text-brand font-bold flex items-center gap-1"><Sparkles size={10} /> Criar Estilo</p>
                      <input required placeholder="Nome do estilo *" value={customStyleName} onChange={e => setCustomStyleName(e.target.value)}
                        className="w-full h-7 rounded-lg border border-line/20 bg-black/40 px-2 text-[10px] outline-none focus:border-brand/40 transition placeholder:text-muted/40" />
                      <input placeholder="Duração ideal" value={customStyleDuration} onChange={e => setCustomStyleDuration(e.target.value)}
                        className="w-full h-7 rounded-lg border border-line/20 bg-black/40 px-2 text-[10px] outline-none focus:border-brand/40 transition placeholder:text-muted/40" />
                      <textarea required placeholder="Diretrizes base *" value={customStyleDirectives} onChange={e => setCustomStyleDirectives(e.target.value)}
                        rows={2} className="w-full rounded-lg border border-line/20 bg-black/40 px-2 py-1.5 text-[10px] outline-none focus:border-brand/40 transition placeholder:text-muted/40 resize-none" />
                      <div className="flex gap-1">
                        <button type="submit" className="flex-1 py-1.5 rounded-lg bg-brand text-neutral-950 text-[9px] font-black hover:bg-brand-strong transition">Criar</button>
                        <button type="button" onClick={() => setShowStyleCreator(false)} className="px-3 py-1.5 rounded-lg border border-line/20 text-[9px] text-muted hover:text-white transition"><X size={11} /></button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TREND RADAR TAB */}
              {rightTab === "trend" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                      <Radio size={10} className="text-brand" /> Trend Radar
                    </p>
                    <button type="button" onClick={scanTrends} disabled={isScanningTrends}
                      className="flex items-center gap-1 rounded-md bg-brand/10 border border-brand/20 px-1.5 py-0.5 text-[8px] font-bold text-brand hover:bg-brand/20 transition disabled:opacity-50">
                      <RefreshCw size={9} className={isScanningTrends ? "animate-spin" : ""} />
                      Scan
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto scrollbar-thin">
                    {trendRadarLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-1.5 rounded-lg border border-line/10 bg-black/20 p-1.5">
                        <TrendingUp size={9} className="text-brand shrink-0 mt-0.5" />
                        <p className="text-[8px] text-muted/80 leading-tight">{log}</p>
                      </div>
                    ))}
                  </div>

                  {/* Most searched for active preset */}
                  <div className="h-px bg-line/20" />
                  <p className="text-[9px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                    <Search size={9} /> Temas em Alta
                  </p>
                  <div className="space-y-1">
                    {activePreset.mostSearched.map((topic, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[8px] text-muted">
                        <span className="text-brand font-mono">#{i + 1}</span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-line/20" />
                  <p className="text-[9px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                    <Music size={9} /> Música em Alta
                  </p>
                  <div className="space-y-1">
                    {activePreset.trendingMusic.map((m, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[8px] text-muted">
                        <Waves size={9} className="text-brand shrink-0" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXPORT TAB */}
              {rightTab === "export" && (
                <div className="space-y-2">
                  <p className="text-[9px] text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                    <Send size={10} /> Exportar · {platform.label}
                  </p>
                  <div className="rounded-xl border border-line/15 bg-black/20 p-2.5 space-y-1.5">
                    {(exportInfo() || []).map((line, i) => {
                      const isWarning = line.startsWith("⚠");
                      return (
                        <div key={i} className={`flex items-center gap-1.5 text-[9px] ${isWarning ? "text-amber-400/80" : "text-muted"}`}>
                          <span className={isWarning ? "text-amber-400" : "text-emerald-400"}>{isWarning ? "⚠" : "▸"}</span>
                          <span>{line.replace(/^[✓⚠]\s/, "")}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* YouTube checklist */}
                  {isYouTube && (
                    <>
                      <p className="text-[9px] text-muted font-bold uppercase tracking-wider flex items-center gap-1 pt-1">
                        <CheckCircle size={9} /> Checklist YouTube
                      </p>
                      <div className="space-y-1">
                        {["Título otimizado", "Miniatura definida", "Descrição pronta", "Capítulos sugeridos", "Legendas adicionadas", "End screen", "CTA incluído"].map(item => (
                          <label key={item} className="flex items-center gap-1.5 cursor-pointer group">
                            <input type="checkbox" className="accent-brand size-2.5" />
                            <span className="text-[8px] text-muted group-hover:text-white transition">{item}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}

                  <button type="button" onClick={() => { handleExportConfirm(); setRightTab("ai"); }}
                    className="w-full py-2.5 rounded-xl bg-brand text-neutral-950 text-[10px] font-black hover:bg-brand-strong transition flex items-center justify-center gap-1.5 mt-2 shadow-lg shadow-brand/20">
                    <Download size={12} /> Confirmar & Exportar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════ BOTTOM: PIPELINE + STATUS BAR ═══════════ */}
        <div className="shrink-0 flex items-center gap-3 rounded-xl border border-line/20 bg-black/30 px-4 py-2.5">
          {/* Status info */}
          <div className="flex items-center gap-3 text-[8px] font-mono text-muted">
            <span className="flex items-center gap-1"><Clock size={9} /> {formatDuration(timelineTotalSeconds)}</span>
            <span className="flex items-center gap-1"><Film size={9} /> {platform.ratio}</span>
            <span className="flex items-center gap-1"><Zap size={9} /> {platform.fps}</span>
            <span className="flex items-center gap-1"><Cpu size={9} /> {activePreset.name.split(" · ")[0]}</span>
          </div>

          <div className="h-4 w-px bg-line/20" />

          {/* Pipeline trigger */}
          {videoStatus === "idle" && (
            <button type="button" onClick={runVideoEditingPipeline}
              className="flex items-center gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-extrabold px-4 py-1.5 transition shadow-lg shadow-rose-500/10">
              <Wand2 size={13} /> Disparar Orquestra de Edição
            </button>
          )}

          {videoStatus !== "idle" && videoStatus !== "completed" && videoStatus !== "rejected" && videoStatus !== "exporting" && (
            <div className="flex items-center gap-2.5">
              <RefreshCw size={13} className="text-rose-400 animate-spin shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-brand">
                  {videoStatus === "analyzing" ? "Analisando cortes..." : videoStatus === "projecting" ? "Projetando edição..." : videoStatus === "council_review" ? "Conselho deliberando..." : "Renderizando..."}
                </span>
                <div className="w-40 h-1 bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500 animate-glow-bar" style={{ width: `${progressVal}%` }} />
                </div>
              </div>
              <span className="text-[9px] font-mono text-brand">{Math.round(progressVal)}%</span>
            </div>
          )}

          {videoStatus === "completed" && (
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[9px] font-bold text-emerald-400">
                <CheckCircle size={11} /> Render Concluído
              </span>
              <button type="button" onClick={() => setVideoStatus("idle")}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 text-[9px] font-bold hover:bg-emerald-600 transition">✓ Aceitar</button>
              <button type="button" onClick={() => setVideoStatus("rejected")}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[9px] font-bold hover:bg-rose-500/20 transition">✕ Rejeitar</button>
            </div>
          )}

          {videoStatus === "rejected" && (
            <form onSubmit={handleRejectVideo} className="flex items-center gap-2 flex-1">
              <input required
                className="flex-1 rounded-lg border border-line bg-black/40 px-3 py-1.5 text-[10px] text-foreground outline-none focus:border-brand/40 transition placeholder:text-muted/40"
                placeholder="Descreva o que os agentes devem corrigir..."
                value={rejectionError} onChange={e => setRejectionError(e.target.value)} />
              <button type="submit"
                className="flex items-center gap-1 rounded-lg bg-brand py-1.5 px-3 text-[9px] font-bold text-neutral-950 hover:bg-brand-strong transition">
                <Wand2 size={11} /> Absorver & Reeditar
              </button>
            </form>
          )}

          {videoStatus === "exporting" && exportLogs.length > 0 && (
            <div className="flex items-center gap-2 text-[8px] font-mono text-sky-400/80">
              <Download size={11} className="animate-bounce shrink-0" />
              <span>{exportLogs[exportLogs.length - 1]}</span>
            </div>
          )}

          {/* Spacer + right buttons */}
          <div className="ml-auto flex items-center gap-2">
            <button type="button" title="Configurações"
              className="size-7 rounded-lg border border-line/20 bg-black/20 grid place-items-center text-muted hover:text-white transition">
              <Settings size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Export popover */}
      {showExportPopover && (
        <div ref={popoverRef} className="fixed z-[var(--z-popover)] w-[280px] rounded-xl border border-brand/30 bg-black/92 backdrop-blur-xl shadow-2xl shadow-brand/10 animate-alert-pop" style={exportPopoverStyle}>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-line/20 pb-2">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand flex items-center gap-1.5">
                <Send size={11} /> Exportar para {platform.label}
              </span>
              <button type="button" onClick={() => setShowExportPopover(false)} className="text-muted hover:text-white"><X size={12} /></button>
            </div>
            <div className="space-y-1">
              {(exportInfo() || []).map((line, i) => {
                const isWarning = line.startsWith("⚠");
                return (
                  <p key={i} className={`text-[10px] font-medium flex items-center gap-1.5 ${isWarning ? "text-amber-400/80" : "text-muted"}`}>
                    <span className={isWarning ? "text-amber-400" : "text-emerald-400"}>{isWarning ? "⚠" : "▸"}</span>
                    {line.replace(/^[✓⚠]\s/, "")}
                  </p>
                );
              })}
            </div>
            <button type="button" onClick={handleExportConfirm}
              className="w-full py-2 rounded-lg bg-brand text-neutral-950 text-[10px] font-black hover:bg-brand-strong transition flex items-center justify-center gap-1.5">
              <Download size={11} /> Confirmar & Preparar Exportação
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
