"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Film, Play, AlertTriangle, CheckCircle, RefreshCw, Plus, X, FileText, Image, Video,
  Wand2, Brain, Radio, Music, Scissors, Star, Cpu, Award, Heart, MessageSquare,
  Layers, Type, Waves, Zap, ChevronRight, Search, Clock, Send, Download,
  Undo2, Redo2, Copy, Trash2, Split, ZoomIn, ZoomOut, Settings, HelpCircle,
  Maximize2, Minimize2, SkipBack, SkipForward, Volume2, Subtitles, Palette,
  Filter, Sliders, Hash, Globe, BookOpen
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
  thumbnail?: string;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PLATFORM CONFIG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PLATFORMS: PlatformConfig[] = [
  { label: "TikTok", icon: MessageSquare, ratio: "9:16", ratioClass: "aspect-[9/16]", resolution: "1080×1920", idealDuration: "15–30s", maxDuration: "60s", fps: "30 FPS", timelineScale: "seconds", aiHints: ["Hook forte nos primeiros 2.5s", "Impacto visual imediato", "Retenção acelerada", "Pacing rápido com cortes densos", "Legendas destacadas", "Loop no final"] },
  { label: "YouTube", icon: Film, ratio: "16:9", ratioClass: "aspect-video", resolution: "1920×1080", idealDuration: "5–12 min", maxDuration: "30 min+", fps: "30/60 FPS", timelineScale: "minutes", aiHints: ["Título SEO otimizado", "Miniatura atraente", "Introdução com gancho", "Curva de retenção", "Capítulos sugeridos", "Pacing e ritmo", "Descrição detalhada", "End screen + CTA"] },
  { label: "Shorts", icon: Play, ratio: "9:16", ratioClass: "aspect-[9/16]", resolution: "1080×1920", idealDuration: "15–60s", maxDuration: "60s", fps: "30 FPS", timelineScale: "seconds", aiHints: ["Hook direto", "Retenção máxima", "Título curto", "Loop contínuo", "Legenda resumida", "Descoberta no Shorts"] },
  { label: "Instagram", icon: Heart, ratio: "9:16", ratioClass: "aspect-[9/16]", resolution: "1080×1920", idealDuration: "15–60s", maxDuration: "90s", fps: "30 FPS", timelineScale: "seconds", aiHints: ["Polimento visual", "Legenda envolvente", "Hashtags estratégicas", "CTA claro", "Tom da marca", "Potencial de compartilhamento"] },
  { label: "Kwai", icon: Zap, ratio: "9:16", ratioClass: "aspect-[9/16]", resolution: "1080×1920", idealDuration: "15–30s", maxDuration: "60s", fps: "30 FPS", timelineScale: "seconds", aiHints: ["Contexto imediato", "Clareza visual simples", "Retenção direta", "Comportamento popular de vídeo curto"] },
  { label: "X / Twitter", icon: Hash, ratio: "16:9", ratioClass: "aspect-video", resolution: "1920×1080", idealDuration: "30–120s", maxDuration: "140s", fps: "30 FPS", timelineScale: "seconds", aiHints: ["Compressão de mensagem", "Texto de gancho forte", "Compartilhável", "Verificação de controvérsia/risco", "Legenda curta"] },
  { label: "Facebook", icon: Globe, ratio: "9:16", ratioClass: "aspect-[9/16]", resolution: "1080×1920", idealDuration: "15–60s", maxDuration: "120s", fps: "30 FPS", timelineScale: "seconds", aiHints: ["Clareza", "Adequação ao público", "Legenda envolvente", "Potencial de engajamento", "Compartilhável"] },
];

const PLATFORM_MAP: Record<Platform, PlatformConfig> = {
  tiktok: PLATFORMS[0], youtube: PLATFORMS[1], shorts: PLATFORMS[2],
  instagram: PLATFORMS[3], kwai: PLATFORMS[4], twitter: PLATFORMS[5], facebook: PLATFORMS[6],
};

type VideoStylePreset = {
  name: string; duration: string; trendingMusic: string[];
  trendingTransitions: string[]; mostSearched: string[]; baseDirectives: string; isCustom?: boolean;
};

const DEFAULT_PRESETS: Record<string, VideoStylePreset> = {
  tiktok: {
    name: "Estilo TikTok & Reels (Retenção Acelerada)", duration: "15s - 60s (Alta Frequência)",
    trendingMusic: ["'Void Echoes' (Lofi Synthwave)", "'Amber Pulse' (Techno Melodic)", "'Kotaro Vibe' (Acoustic Trap)"],
    trendingTransitions: ["Zoom Rápido a cada 1.5s", "Legendas de Destaque Neon Central", "Efeitos Sonoros 'Swoosh'"],
    mostSearched: ["Engenharia de Prompt Inteligente", "IAs Gratuitas sem Limites", "Automação no Navegador"],
    baseDirectives: "Ritmo frenético, hook de impacto nos primeiros 2.5 segundos, zero pausas respiratórias, paleta Void & Amber vibrante com legendas de duas palavras por frame."
  },
  youtube: {
    name: "Estilo Vlogging / Explicativo no YouTube", duration: "5m - 12m (Engajamento Profundo)",
    trendingMusic: ["'Cyber Coffee' (Chill Beats)", "'Infinite Drift' (Ambient Synth)"],
    trendingTransitions: ["Cortes Secos Estruturados", "B-Rolls de Softwares Neon", "Zoom Lento de Ponto de Ênfase"],
    mostSearched: ["Como criar agente de autoaprendizado", "Supabase vs LocalStorage no NextJS", "Estúdio de Nodes Neon"],
    baseDirectives: "Pacing conversacional premium, transição explicativa visual a cada 10s, introdução estruturada do problema, tela limpa com cards informativos sobrepostos."
  },
  cinematic: {
    name: "Estilo Documentário & Mini-Histórias", duration: "2m - 5m (Imersão Dramática)",
    trendingMusic: ["'Odyssey Orchestral' (Dramático)", "'Deep Void' (Soundscape Cinematográfico)"],
    trendingTransitions: ["Fade to Black Suave", "Sobreposição de Texturas de Luz", "Sound Design Sub-grave"],
    mostSearched: ["Evolução de Sistemas AI", "Privacidade Digital Multi-tenant", "História do YGGNAROK"],
    baseDirectives: "Foco estético em mistério, gradação de cores âmbar escuras, pausas dramáticas com trilha subindo de volume."
  },
  sales: {
    name: "VSL de Vendas de Alta Conversão", duration: "3m - 8m (Persuasão & Neuro-copy)",
    trendingMusic: ["'Ascension' (Trilha de Tensão Crescente)", "'Resolution' (Trilha Heroica de Fechamento)"],
    trendingTransitions: ["Quebras de Padrão Agressivas", "Lettering Amber Piscante", "Efeito de Máquina de Escrever"],
    mostSearched: ["Como economizar R$15.000 em APIs", "Melhores agentes para vendas automática", "Roteamento inteligente de modelos"],
    baseDirectives: "Copy focada na dor imediata, quebra de objeção a cada 4 frames, música de suspense crescendo até a revelação da oferta."
  }
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function EstudioVideoClient() {
  // ── Platform State ──
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("tiktok");
  const [instaMode, setInstaMode] = useState<InstaMode>("reels");
  const [fbMode, setFbMode] = useState<FbMode>("reels");
  const platform = PLATFORM_MAP[selectedPlatform];

  // ── Export Popover State ──
  const [showExportPopover, setShowExportPopover] = useState(false);
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // ── Top Zone State ──
  const [referenceLink, setReferenceLink] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);
  const [aiAnalysisResults, setAiAnalysisResults] = useState<string[]>([]);

  // ── Editor State (preserved from original) ──
  const [videoStyle, setVideoStyle] = useState<string>("tiktok");
  const [allPresets, setAllPresets] = useState<Record<string, VideoStylePreset>>(DEFAULT_PRESETS);
  const [referenceAssets, setReferenceAssets] = useState<ReferenceAsset[]>([]);
  const [showStyleCreator, setShowStyleCreator] = useState(false);
  const [customStyleName, setCustomStyleName] = useState("");
  const [customStyleDuration, setCustomStyleDuration] = useState("");
  const [customStyleMusic, setCustomStyleMusic] = useState("");
  const [customStyleTransitions, setCustomStyleTransitions] = useState("");
  const [customStyleDirectives, setCustomStyleDirectives] = useState("");

  const [videoStatus, setVideoStatus] = useState<"idle" | "analyzing" | "projecting" | "council_review" | "rendering" | "completed" | "rejected" | "exporting">("idle");
  const [progressVal, setProgressVal] = useState(0);
  const [exportLogs, setExportLogs] = useState<string[]>([]);
  const [, setExportStep] = useState(0);
  const [rejectionError, setRejectionError] = useState("");
  const [absorbedFeedback, setAbsorbedFeedback] = useState<string[]>([]);
  const [councilMessages, setCouncilMessages] = useState<{agent: string; avatar: string; message: string; status: "thinking" | "approved"}[]>([]);
  const [rawFiles, setRawFiles] = useState<string[]>(["arquivo_bruto_intro.mp4", "b-roll_canvas_nodes.mov"]);
  const [newFileName, setNewFileName] = useState("");
  const [editingInstructions, setEditingInstructions] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [trendRadarLogs, setTrendRadarLogs] = useState<string[]>(["Gancho mais retentivo: Zoom Rápido no segundo 1.8.", "Batida Recomendada: Synthwave Melodic (124BPM)."]);
  const [, setIsScanningTrends] = useState(false);

  const timelineClips = selectedPlatform === "youtube" ? YOUTUBE_TIMELINE_CLIPS : TIMELINE_CLIPS;
  const isYouTube = selectedPlatform === "youtube";
  const isVertical = platform.ratio === "9:16";
  const activePreset = allPresets[videoStyle] || DEFAULT_PRESETS["tiktok"];

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Export Popover click-outside + Escape ──
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

  // ── AI Analysis Runner ──
  const runAiAnalysis = () => {
    setAiAnalysisRunning(true);
    setAiAnalysisResults([]);
    const hints = platform.aiHints;
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < hints.length) {
        setAiAnalysisResults(prev => [...prev, `✓ ${hints[idx]}`]);
        idx++;
      } else {
        clearInterval(interval);
        setAiAnalysisRunning(false);
      }
    }, 600);
  };

  // ── Video Pipeline (preserved) ──
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
        setCouncilMessages([{ agent: "Isis (Edição & Pacing)", avatar: "✨", message: `Analisando cortes brutos para formato ${platform.label}... Proponho ritmo otimizado para ${platform.ratio}.`, status: "thinking" }]);
        setTimeout(() => {
          setCouncilMessages(prev => [...prev.map(c => ({ ...c, status: "approved" as const })), { agent: "Morax (Ganchos)", avatar: "🔥", message: `Hook inicial otimizado para retenção em ${platform.label}.`, status: "thinking" }]);
        }, 1500);
        setTimeout(() => {
          setCouncilMessages(prev => [...prev.map(c => c.agent.includes("Morax") ? { ...c, status: "approved" as const } : c), { agent: "Hefesto (Tipografia)", avatar: "🦾", message: "Legendas e sobreposição aprovadas. Tipografia 'Inter' ultra-bold.", status: "thinking" }]);
        }, 3000);
        setTimeout(() => {
          setCouncilMessages(prev => prev.map(c => ({ ...c, status: "approved" as const })));
          setProgressVal(80);
          setVideoStatus("rendering");
          setTimeout(() => { setProgressVal(100); setVideoStatus("completed"); }, 2000);
        }, 4500);
      }, 2500);
    }, 2000);
  };

  // ── Helpers (preserved) ──
  const handleCreateCustomStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStyleName.trim() || !customStyleDirectives.trim()) return;
    const styleKey = `custom_${Date.now()}`;
    setAllPresets(prev => ({ ...prev, [styleKey]: { name: `✨ ${customStyleName.trim()} (Estilo Único)`, duration: customStyleDuration.trim() || "Configuração Livre", trendingMusic: customStyleMusic ? customStyleMusic.split(",").map(m => m.trim()) : ["Músicas Customizadas"], trendingTransitions: customStyleTransitions ? customStyleTransitions.split(",").map(t => t.trim()) : ["Transições livres"], mostSearched: ["Configurações customizadas"], baseDirectives: customStyleDirectives.trim(), isCustom: true } }));
    setVideoStyle(styleKey);
    setShowStyleCreator(false);
    setCustomStyleName(""); setCustomStyleDuration(""); setCustomStyleMusic(""); setCustomStyleTransitions(""); setCustomStyleDirectives("");
  };

  const handleSimulateAssetUpload = (type: "image" | "video" | "audio" | "doc") => {
    const fileNamesMap = { image: "referencia_estilo_moodboard.png", video: "corte_exemplo_referencia.mp4", audio: "efeito_sonoro_swoosh.mp3", doc: "roteiro_planejado_vendas.pdf" };
    const nextAsset: ReferenceAsset = { id: `asset_${Date.now()}`, name: fileNamesMap[type], type, size: type === "video" ? "14.2 MB" : type === "image" ? "1.8 MB" : type === "audio" ? "600 KB" : "120 KB", status: "uploading", progress: 0 };
    setReferenceAssets(prev => [...prev, nextAsset]);
    let prog = 0;
    const interval = setInterval(() => { prog += 25; setReferenceAssets(prev => prev.map(a => a.id === nextAsset.id ? { ...a, progress: prog } : a)); if (prog >= 100) { clearInterval(interval); setReferenceAssets(prev => prev.map(a => a.id === nextAsset.id ? { ...a, status: "completed" } : a)); } }, 400);
  };

  const handleRemoveAsset = (id: string) => setReferenceAssets(referenceAssets.filter(a => a.id !== id));
  const handleRemoveRawFile = (index: number) => setRawFiles(rawFiles.filter((_, i) => i !== index));

  const handleRejectVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionError.trim()) return;
    const errorFact = `[ERRO DE EDIÇÃO DE VÍDEO DETECTADO] Estilo: ${videoStyle}. Correção crítica exigida: ${rejectionError.trim()}`;
    const username = typeof window !== "undefined" ? (localStorage.getItem("yggnarok.username") || "kotaro") : "kotaro";
    const storedMems = localStorage.getItem(`yggnarok.${username}.ltm_memories`);
    let memoriesList: { id: string; category: string; fact: string; timestamp: string; confidence: number }[] = [];
    if (storedMems) memoriesList = JSON.parse(storedMems);
    localStorage.setItem(`yggnarok.${username}.ltm_memories`, JSON.stringify([{ id: `mem_video_error_${Date.now()}`, category: "tecnico", fact: errorFact, timestamp: "Absorbido via Feedback de Edição", confidence: 100 }, ...memoriesList]));
    setAbsorbedFeedback([rejectionError.trim(), ...absorbedFeedback]);
    setVideoStatus("rejected"); setRejectionError(""); setProgressVal(0); setCouncilMessages([]);
  };

  // ── Export popover content per platform ──
  const exportInfo = () => {
    switch (selectedPlatform) {
      case "tiktok":
        return { lines: ["✓ TikTok · 9:16 vertical", "✓ Resolução: 1080×1920", `✓ Duração ideal: ${platform.idealDuration}`, `✓ Máx recomendado: ${platform.maxDuration}`, `✓ FPS: ${platform.fps}`] };
      case "youtube":
        return { lines: ["✓ YouTube · 16:9 horizontal", "✓ Resolução: 1920×1080", "✓ Duração: conforme projeto", "✓ FPS: 30/60 FPS disponível", "⚠ Lembrete: miniatura", "⚠ Lembrete: título + descrição"] };
      case "shorts":
        return { lines: ["✓ YouTube Shorts · 9:16 vertical", "✓ Resolução: 1080×1920", `✓ Duração ideal: ${platform.idealDuration}`, "✓ FPS: 30 FPS"] };
      case "instagram":
        return instaMode === "reels"
          ? { lines: ["✓ Instagram Reels · 9:16 vertical", "✓ Resolução: 1080×1920", "✓ Duração: 15–60s", "✓ FPS: 30 FPS", "⚠ Lembrete: legenda otimizada"] }
          : { lines: ["✓ Instagram Feed", "✓ Formato: 1:1 ou 4:5", "✓ Composição visual refinada", "⚠ Lembrete: hashtags + CTA"] };
      case "kwai":
        return { lines: ["✓ Kwai · 9:16 vertical", "✓ Resolução: 1080×1920", "✓ Otimizado para vídeos curtos", "✓ FPS: 30 FPS"] };
      case "twitter":
        return { lines: [`✓ X / Twitter · formato configurável`, "✓ Duração: curta", "⚠ Lembrete: legenda + contexto"] };
      case "facebook":
        return fbMode === "reels"
          ? { lines: ["✓ Facebook Reels · 9:16 vertical", "✓ Resolução: 1080×1920", "✓ FPS: 30 FPS"] }
          : { lines: ["✓ Facebook Feed · 16:9 horizontal", "✓ Resolução: 1920×1080", "⚠ Lembrete: legenda + engajamento"] };
    }
  };

  const handleExportConfirm = () => {
    setShowExportPopover(false);
    const exportSteps = ["Preparando arquivo para exportação...", "Otimizando codec e resolução...", "✓ Pronto para exportar!"];
    setVideoStatus("exporting");
    setExportLogs([exportSteps[0]]);
    setExportStep(0);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < exportSteps.length) {
        setExportStep(idx);
        setExportLogs(prev => [...prev, exportSteps[idx]]);
      } else {
        clearInterval(interval);
        setTimeout(() => { setVideoStatus("idle"); setExportLogs([]); }, 2500);
      }
    }, 1200);
  };

  const timelineTotalSeconds = timelineClips.reduce((sum, c) => sum + c.seconds, 0);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <main className="min-h-screen text-foreground relative bg-background select-none">
      <style>{`
        @keyframes floatAlert { 0% { transform: translateY(5px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .animate-alert-pop { animation: floatAlert 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes progressGlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-glow-bar { background-size: 200% 200%; animation: progressGlow 2s ease infinite; }
        @keyframes trackPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        .track-pulse { animation: trackPulse 2s ease-in-out infinite; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.2); border-radius: 99px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(245,158,11,0.4); }
      `}</style>

      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-[1600px] px-4 py-4 lg:px-6 flex flex-col h-[calc(100vh-4rem)] gap-3">

        {/* ─── TOAST ─── */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-[var(--z-toast)] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-extrabold shadow-2xl backdrop-blur-xl animate-alert-pop ${toast.type === "success" ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-400" : "border-rose-500/30 bg-rose-950/90 text-rose-400"}`}>
            {toast.type === "success" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* ════════════════════════════════════════════════
           TOP PREPARATION ZONE (~38%)
           ════════════════════════════════════════════════ */}
        <div className="shrink-0 flex flex-col gap-3" style={{ maxHeight: "38%" }}>

          {/* ── Studio Header ── */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand/75 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span></span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand">Estúdio de Vídeo · Odin OS</span>
              </div>
              <h1 className="font-divine text-xl sm:text-2xl font-black tracking-widest bg-gradient-to-r from-brand via-amber-200 to-brand-strong bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                Video Creation Studio
              </h1>
            </div>
          </div>

          {/* ── Platform Selector ── */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {(Object.entries(PLATFORM_MAP) as [Platform, PlatformConfig][]).map(([key, p]) => {
              const Icon = p.icon;
              const isActive = selectedPlatform === key;
              const isInsta = key === "instagram";
              const isFb = key === "facebook";
              return (
                <div key={key} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => { setSelectedPlatform(key); setShowExportPopover(false); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border transition-all duration-200 ${
                      isActive
                        ? "border-brand bg-brand/10 text-brand shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                        : "border-line/30 bg-black/30 text-muted hover:text-white hover:border-line/60"
                    }`}
                  >
                    <Icon size={13} />
                    <span>{p.label}</span>
                    <span className="text-[7px] opacity-50 ml-0.5">{p.ratio}</span>
                  </button>
                  {isActive && (isInsta || isFb) && (
                    <div className="absolute top-full left-0 mt-1 flex gap-1 z-10">
                      <button
                        type="button"
                        onClick={() => isInsta ? setInstaMode("reels") : setFbMode("reels")}
                        className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border transition ${
                          (isInsta && instaMode === "reels") || (isFb && fbMode === "reels")
                            ? "border-brand/40 bg-brand/15 text-brand" : "border-line/20 bg-black/40 text-muted"
                        }`}
                      >Reels</button>
                      <button
                        type="button"
                        onClick={() => isInsta ? setInstaMode("feed") : setFbMode("feed")}
                        className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border transition ${
                          (isInsta && instaMode === "feed") || (isFb && fbMode === "feed")
                            ? "border-brand/40 bg-brand/15 text-brand" : "border-line/20 bg-black/40 text-muted"
                        }`}
                      >Feed</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Preparation Panel (Reference + Idea + AI) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* References */}
            <section className="rounded-xl border border-line/30 bg-surface/40 p-3 backdrop-blur-md space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-muted">
                <Search size={11} />
                <span>Referências</span>
              </div>
              <input
                type="text"
                placeholder="Link de referência (TikTok, YouTube...)"
                value={referenceLink}
                onChange={(e) => setReferenceLink(e.target.value)}
                className="w-full h-8 rounded-lg border border-line/20 bg-black/30 px-2.5 text-[10px] text-foreground outline-none focus:border-brand/40 transition placeholder:text-muted/40"
              />
              <div className="flex gap-1">
                {(["image", "video", "audio"] as const).map(type => (
                  <button key={type} type="button" onClick={() => handleSimulateAssetUpload(type)}
                    className="flex items-center gap-1 rounded-md border border-line/20 bg-black/30 px-2 py-1 text-[8px] font-bold text-muted hover:text-white transition">
                    {type === "image" ? <Image size={10} /> : type === "video" ? <Play size={10} /> : <Music size={10} />}
                    <span>{type}</span>
                  </button>
                ))}
              </div>
              {referenceAssets.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {referenceAssets.map(a => (
                    <span key={a.id} className="inline-flex items-center gap-1 rounded-md bg-black/40 border border-line/20 px-1.5 py-0.5 text-[8px] text-muted">
                      {a.name}
                      <button type="button" onClick={() => handleRemoveAsset(a.id)} className="text-rose-400 hover:text-rose-300">✕</button>
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Idea & Briefing */}
            <section className="rounded-xl border border-line/30 bg-surface/40 p-3 backdrop-blur-md space-y-2">
              <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-muted">
                <Wand2 size={11} />
                <span>Ideia / Briefing</span>
              </div>
              <textarea
                placeholder="Descreva sua ideia para o vídeo..."
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-line/20 bg-black/30 px-2.5 py-1.5 text-[10px] text-foreground outline-none focus:border-brand/40 transition placeholder:text-muted/40 resize-none"
              />
            </section>

            {/* AI Analysis */}
            <section className="rounded-xl border border-line/30 bg-surface/40 p-3 backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-muted">
                  <Brain size={11} className="text-brand" />
                  <span>Análise IA · {platform.label}</span>
                </div>
                <button
                  type="button"
                  onClick={runAiAnalysis}
                  disabled={aiAnalysisRunning}
                  className="flex items-center gap-1 rounded-md bg-brand/10 border border-brand/20 px-2 py-0.5 text-[8px] font-bold text-brand hover:bg-brand/20 transition"
                >
                  <RefreshCw size={9} className={aiAnalysisRunning ? "animate-spin" : ""} />
                  <span>{aiAnalysisRunning ? "Analisando..." : "Analisar"}</span>
                </button>
              </div>
              <div className="space-y-0.5 max-h-[80px] overflow-y-auto scrollbar-thin">
                {aiAnalysisResults.length > 0 ? aiAnalysisResults.map((r, i) => (
                  <p key={i} className="text-[9px] text-muted leading-tight">{r}</p>
                )) : (
                  <p className="text-[9px] text-muted/50 italic">Clique em "Analisar" para otimização para {platform.label}.</p>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
           BOTTOM EDITOR ZONE (~62%)
           ════════════════════════════════════════════════ */}
        <div className="flex-1 min-h-0 flex flex-col gap-3">

          {/* ── EDITOR HEADER ── */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded-md bg-brand/10 border border-brand/30 text-[10px] font-black text-brand">4</span>
              <h2 className="text-sm font-black tracking-wider text-foreground">Editor & Preview</h2>
              <span className="text-[10px] text-muted font-mono font-bold">— {platform.label} ({platform.ratio})</span>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" className="px-2.5 py-1.5 rounded-lg border border-line/20 bg-black/30 text-[9px] font-bold text-muted hover:text-white hover:border-line/40 transition">Cortar</button>
              <button type="button" className="px-2.5 py-1.5 rounded-lg border border-line/20 bg-black/30 text-[9px] font-bold text-muted hover:text-white hover:border-line/40 transition">Legendas</button>
              <button type="button" className="px-2.5 py-1.5 rounded-lg border border-line/20 bg-black/30 text-[9px] font-bold text-muted hover:text-white hover:border-line/40 transition">Transição</button>
              <button type="button" className="px-2.5 py-1.5 rounded-lg border border-line/20 bg-black/30 text-[9px] font-bold text-muted hover:text-white hover:border-line/40 transition">Efeitos</button>
              <button type="button" className="px-2.5 py-1.5 rounded-lg border border-line/20 bg-black/30 text-[9px] font-bold text-muted hover:text-white hover:border-line/40 transition">Filtros</button>
              <button type="button" className="px-2.5 py-1.5 rounded-lg border border-line/20 bg-black/30 text-[9px] font-bold text-muted hover:text-white hover:border-line/40 transition">Música</button>
              <button type="button" className="px-2.5 py-1.5 rounded-lg border border-brand/20 bg-brand/5 text-[9px] font-bold text-brand hover:bg-brand/15 transition flex items-center gap-1">
                <Brain size={11} /> IA
              </button>
              <button
                ref={exportBtnRef}
                type="button"
                onClick={() => setShowExportPopover(!showExportPopover)}
                className="px-3 py-1.5 rounded-lg bg-brand text-neutral-950 text-[9px] font-black hover:bg-brand-strong transition flex items-center gap-1 shadow-lg shadow-brand/20"
              >
                <Send size={11} /> ENVIAR
              </button>
            </div>
          </div>

          {/* ── YOUTUBE: Large preview layout ── */}
          {isYouTube ? (
            <div className="flex-1 min-h-0 flex flex-col gap-3">
              {/* Large 16:9 preview */}
              <div className="flex-1 min-h-0 rounded-xl border border-line/30 bg-black/50 overflow-hidden flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand/3 to-transparent pointer-events-none" />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full max-w-3xl aspect-video rounded-lg border border-line/20 bg-black/70 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play size={48} className="text-amber-500/30" />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] text-white/60 font-mono">
                      <span>{videoScriptTitle}</span>
                      <span>{platform.ratio} · {platform.resolution}</span>
                    </div>
                    <div className="absolute top-3 left-3 flex gap-1">
                      {EDITOR_BUTTONS.map(b => (
                        <button key={b.label} type="button" className="size-7 rounded-md bg-black/60 border border-white/10 grid place-items-center text-white/50 hover:text-white hover:border-white/30 transition" title={b.label}>
                          <b.icon size={12} />
                        </button>
                      ))}
                    </div>
                    {videoStatus === "rendering" && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 z-20">
                        <RefreshCw size={28} className="text-amber-400 animate-spin" />
                        <span className="text-[9px] text-amber-300 font-mono tracking-widest animate-pulse">RENDERIZANDO...</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[9px] text-muted">
                    <span className="flex items-center gap-1"><Clock size={10} /> {formatDuration(timelineTotalSeconds)}</span>
                    <span className="flex items-center gap-1"><Film size={10} /> {platform.resolution}</span>
                    <span className="flex items-center gap-1"><Zap size={10} /> {platform.fps}</span>
                  </div>
                </div>
              </div>

              {/* YouTube: Timeline + compact checklist side-by-side */}
              <div className="shrink-0 grid grid-cols-[1fr_220px] gap-3">
                <TimelineSection clips={timelineClips} totalSeconds={timelineTotalSeconds} scale="minutes" isYouTube />
                <YouTubeChecklist />
              </div>
            </div>
          ) : (
            /* ── SHORT-FORM: Preview left + Timeline right ── */
            <div className="flex-1 min-h-0 flex gap-3">
              {/* Preview (left) */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className={`${isVertical ? "h-[280px] w-[158px]" : "h-[158px] w-[280px]"} rounded-xl border border-line/30 bg-black/60 flex items-center justify-center relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/3 to-transparent pointer-events-none" />
                  <div className="flex flex-col items-center gap-2">
                    <Play size={28} className="text-amber-500/20" />
                    <span className="text-[7px] text-white/30 font-mono">{platform.ratio}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-[6px] font-mono text-white/40 truncate text-center">{videoScriptTitle}</div>
                  {videoStatus === "rendering" && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <RefreshCw size={20} className="text-amber-400 animate-spin" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
                    {EDITOR_BUTTONS.slice(0, 3).map(b => (
                      <button key={b.label} type="button" className="size-6 rounded bg-black/60 border border-white/10 grid place-items-center text-white/50 hover:text-white text-[9px]" title={b.label}>
                        <b.icon size={10} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[8px] text-muted font-mono">
                  <span className="flex items-center gap-1"><Clock size={9} /> {formatDuration(timelineTotalSeconds)}</span>
                  <span>{platform.fps}</span>
                </div>
              </div>

              {/* Timeline + Tracks (right, fills remaining space) */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                {/* Editor buttons bar */}
                <div className="flex items-center gap-1 shrink-0">
                  {EDITOR_BUTTONS.map(b => (
                    <button key={b.label} type="button" className="size-8 rounded-lg border border-line/15 bg-black/30 grid place-items-center text-muted hover:text-white hover:border-line/40 transition" title={b.label}>
                      <b.icon size={13} />
                    </button>
                  ))}
                </div>

                {/* Timeline */}
                <TimelineSection clips={timelineClips} totalSeconds={timelineTotalSeconds} scale="seconds" isYouTube={false} />

                {/* Tracks */}
                <TrackSection />
              </div>
            </div>
          )}

          {/* ── Bottom Controls ── */}
          <BottomControls progressVal={progressVal} videoStatus={videoStatus} platform={platform} />

          {/* ── Pipeline Trigger / Council / Export / Reject (preserved from original) ── */}
          <PipelineSection
            videoStatus={videoStatus}
            progressVal={progressVal}
            platform={platform}
            runVideoEditingPipeline={runVideoEditingPipeline}
            councilMessages={councilMessages}
            rejectionError={rejectionError}
            setRejectionError={setRejectionError}
            handleRejectVideo={handleRejectVideo}
            absorbedFeedback={absorbedFeedback}
            setVideoStatus={setVideoStatus}
            exportLogs={exportLogs}
            showToast={showToast}
          />
        </div>

        {/* ── ENVIAR EXPORT POPOVER ── */}
        {showExportPopover && (
          <div ref={popoverRef} className="fixed z-[var(--z-popover)] w-[280px] rounded-xl border border-brand/30 bg-black/90 backdrop-blur-xl shadow-2xl shadow-brand/10 animate-alert-pop" style={{ bottom: exportBtnRef.current ? window.innerHeight - exportBtnRef.current.getBoundingClientRect().top + 8 + exportBtnRef.current.offsetHeight : "auto", right: exportBtnRef.current ? window.innerWidth - exportBtnRef.current.getBoundingClientRect().right : "auto" }}>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-line/20 pb-2">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand flex items-center gap-1.5">
                  <Send size={11} /> Exportar para {platform.label}
                </span>
                <button type="button" onClick={() => setShowExportPopover(false)} className="text-muted hover:text-white">
                  <X size={12} />
                </button>
              </div>
              <div className="space-y-1">
                {exportInfo().lines.map((line, i) => {
                  const isWarning = line.startsWith("⚠");
                  return (
                    <p key={i} className={`text-[10px] font-medium flex items-center gap-1.5 ${isWarning ? "text-amber-400/80" : "text-muted"}`}>
                      <span className={isWarning ? "text-amber-400" : "text-emerald-400"}>{isWarning ? "⚠" : "▸"}</span>
                      {line.replace(/^[✓⚠]\s/, "")}
                    </p>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={handleExportConfirm}
                className="w-full py-2 rounded-lg bg-brand text-neutral-950 text-[10px] font-black hover:bg-brand-strong transition flex items-center justify-center gap-1.5"
              >
                <Download size={11} />
                <span>Confirmar & Preparar Exportação</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUB-COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const EDITOR_BUTTONS = [
  { icon: Undo2, label: "Desfazer" },
  { icon: Redo2, label: "Refazer" },
  { icon: Copy, label: "Copiar" },
  { icon: Trash2, label: "Excluir" },
  { icon: Split, label: "Dividir" },
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

function TimelineSection({ clips, totalSeconds, scale, isYouTube }: { clips: TimelineClip[]; totalSeconds: number; scale: "seconds" | "minutes"; isYouTube: boolean }) {
  const timeMarkers = scale === "minutes"
    ? [0, 1, 2, 3, 5, 8, 10, 15].filter(t => t <= Math.ceil(totalSeconds / 60) + 1)
    : [0, 5, 10, 15, 20, 30, 45, 60].filter(t => t <= totalSeconds + 5);

  const unit = scale === "minutes" ? "m" : "s";

  return (
    <div className={`rounded-xl border border-line/20 bg-black/40 p-3 ${isYouTube ? "" : "flex-1 min-h-0"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[8px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1">
          <Clock size={9} /> Timeline
        </span>
        <span className="text-[8px] font-mono text-muted">{formatDuration(totalSeconds)} total</span>
      </div>
      <div className="relative overflow-x-auto scrollbar-thin" style={{ maxHeight: isYouTube ? "80px" : undefined }}>
        <div className="relative" style={{ minWidth: `${Math.max(clips.length * 100, 400)}px`, height: isYouTube ? "60px" : "56px" }}>
          {/* Time markers */}
          <div className="absolute top-0 left-0 right-0 flex text-[7px] font-mono text-muted/50">
            {timeMarkers.map((t, i) => (
              <div key={i} className="absolute" style={{ left: `${(t / Math.max(...timeMarkers)) * 100}%`, transform: "translateX(-50%)" }}>
                <span>{t}{unit}</span>
              </div>
            ))}
          </div>
          {/* Clip blocks */}
          <div className="absolute top-4 left-0 right-0 bottom-0 flex gap-0.5">
            {clips.map((clip, i) => {
              const widthPct = (clip.seconds / Math.max(...timeMarkers, totalSeconds)) * 100;
              return (
                <div key={clip.id} className="relative h-full rounded-md border border-brand/20 bg-brand/8 flex items-center justify-center group cursor-pointer hover:bg-brand/15 transition flex-shrink-0" style={{ width: `${Math.max(widthPct, 8)}%` }}>
                  <span className="text-[6px] font-bold text-brand/60 truncate px-0.5 leading-tight text-center">{clip.type}</span>
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[6px] font-mono text-muted/40 whitespace-nowrap">{clip.dur}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackSection() {
  const tracks = [
    { icon: Video, label: "Vídeo", color: "text-amber-400", clips: [{ id: "t1", label: "Clip principal", dur: "25s" }, { id: "t2", label: "B-Roll", dur: "15s" }] },
    { icon: Subtitles, label: "Texto / Legendas", color: "text-sky-400", clips: [{ id: "c1", label: "Legenda principal", dur: "25s" }, { id: "c2", label: "CTA sobreposto", dur: "10s" }] },
    { icon: Volume2, label: "Áudio", color: "text-emerald-400", clips: [{ id: "a1", label: "Trilha de fundo", dur: "40s" }, { id: "a2", label: "Efeito sonoro", dur: "2s" }] },
    { icon: Zap, label: "Efeitos / Transições", color: "text-rose-400", clips: [{ id: "e1", label: "Zoom rápido", dur: "1.5s" }, { id: "e2", label: "Fade", dur: "1s" }] },
  ];

  return (
    <div className="rounded-xl border border-line/20 bg-black/40 p-3 flex-1 min-h-0 overflow-y-auto scrollbar-thin">
      <span className="text-[8px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1 mb-2"><Layers size={9} /> Tracks</span>
      <div className="space-y-1.5">
        {tracks.map(track => {
          const Icon = track.icon;
          return (
            <div key={track.label} className="rounded-lg border border-line/15 bg-black/30 p-1.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={10} className={track.color} />
                <span className={`text-[7px] font-bold uppercase tracking-wider ${track.color}`}>{track.label}</span>
              </div>
              <div className="flex gap-1">
                {track.clips.map(c => (
                  <div key={c.id} className="h-5 rounded border border-line/20 bg-black/50 px-1.5 flex items-center gap-1 hover:bg-brand/10 transition cursor-pointer">
                    <span className="text-[6px] text-muted truncate max-w-[50px]">{c.label}</span>
                    <span className="text-[6px] font-mono text-muted/50">{c.dur}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YouTubeChecklist() {
  const items = ["Título otimizado", "Miniatura definida", "Descrição pronta", "Capítulos sugeridos", "Legendas adicionadas", "End screen sugerido", "CTA incluído"];
  return (
    <div className="rounded-xl border border-line/20 bg-black/40 p-3 overflow-y-auto scrollbar-thin">
      <span className="text-[8px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1 mb-2"><CheckCircle size={9} /> YouTube Checklist</span>
      <div className="space-y-1">
        {items.map(item => (
          <label key={item} className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" className="accent-brand size-2.5" />
            <span className="text-[8px] text-muted group-hover:text-white transition">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function BottomControls({ progressVal, videoStatus, platform }: { progressVal: number; videoStatus: string; platform: PlatformConfig }) {
  return (
    <div className="shrink-0 flex items-center justify-between bg-black/30 rounded-xl border border-line/15 px-4 py-2">
      <div className="flex items-center gap-3 text-[9px] text-muted font-mono">
        <span className="flex items-center gap-1"><Undo2 size={11} /></span>
        <span className="flex items-center gap-1"><Redo2 size={11} /></span>
        <span className="h-3 w-px bg-line/30" />
        <span className="flex items-center gap-1"><Copy size={11} /></span>
        <span className="flex items-center gap-1"><Trash2 size={11} /></span>
        <span className="flex items-center gap-1"><Split size={11} /></span>
        <span className="h-3 w-px bg-line/30" />
        <span className="flex items-center gap-1"><ZoomIn size={11} /></span>
        <span className="flex items-center gap-1"><ZoomOut size={11} /></span>
      </div>
      <div className="flex items-center gap-4 text-[9px] font-mono text-muted">
        <span className="flex items-center gap-1"><Clock size={10} /> {platform.idealDuration}</span>
        <span className="flex items-center gap-1"><Film size={10} /> {platform.ratio}</span>
        <span className="flex items-center gap-1"><Zap size={10} /> {platform.fps}</span>
      </div>
    </div>
  );
}

const videoScriptTitle = "Como Economizar 100% de APIs com YGGNAROK";

function PipelineSection({
  videoStatus, progressVal, platform, runVideoEditingPipeline,
  councilMessages, rejectionError, setRejectionError,
  handleRejectVideo, absorbedFeedback, setVideoStatus, exportLogs, showToast
}: {
  videoStatus: string; progressVal: number; platform: PlatformConfig;
  runVideoEditingPipeline: () => void;
  councilMessages: { agent: string; avatar: string; message: string; status: string }[];
  rejectionError: string; setRejectionError: (v: string) => void;
  handleRejectVideo: (e: React.FormEvent) => void;
  absorbedFeedback: string[]; setVideoStatus: (v: any) => void;
  exportLogs: string[]; showToast: (msg: string, type?: "success" | "error") => void;
}) {
  return (
    <div className="shrink-0 flex items-center gap-3">
      {/* Pipeline trigger */}
      {videoStatus === "idle" && (
        <button onClick={runVideoEditingPipeline} className="flex items-center gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-extrabold px-4 py-2 transition shadow-lg shadow-rose-500/10">
          <Wand2 size={13} /> Disparar Orquestra de Edição
        </button>
      )}

      {videoStatus !== "idle" && videoStatus !== "completed" && videoStatus !== "rejected" && videoStatus !== "exporting" && (
        <div className="flex items-center gap-2 text-[10px] font-bold text-brand">
          <RefreshCw size={13} className="animate-spin text-rose-400" />
          <span>Processando...</span>
          <div className="w-24 h-1 bg-neutral-900 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-full transition-all duration-500 animate-glow-bar" style={{ width: `${progressVal}%` }} />
          </div>
        </div>
      )}

      {/* Council messages inline */}
      {videoStatus === "council_review" || videoStatus === "rendering" ? (
        <div className="flex items-center gap-2 overflow-hidden max-w-md">
          {councilMessages.filter(m => m.status === "approved").slice(-2).map((m, i) => (
            <span key={i} className="text-[8px] text-emerald-400/70 truncate">✓ {m.agent.split(" ")[0]}</span>
          ))}
          {councilMessages.some(m => m.status === "thinking") && (
            <span className="text-[8px] text-amber-400/70 animate-pulse">Deliberando...</span>
          )}
        </div>
      ) : null}

      {/* Completed actions */}
      {videoStatus === "completed" && (
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[9px] font-bold text-emerald-400"><CheckCircle size={11} /> Render Concluído</span>
          <button onClick={() => setVideoStatus("idle")} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-neutral-950 text-[9px] font-bold hover:bg-emerald-600 transition">✓ Aceitar</button>
          <button onClick={() => setVideoStatus("rejected")} className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[9px] font-bold hover:bg-rose-500/20 transition">✕ Rejeitar</button>
        </div>
      )}

      {/* Rejection form */}
      {videoStatus === "rejected" && (
        <form onSubmit={handleRejectVideo} className="flex items-center gap-2 flex-1">
          <input
            required
            className="flex-1 rounded-lg border border-line bg-black/40 px-3 py-1.5 text-[10px] text-foreground outline-none focus:border-brand/40 transition placeholder:text-muted/40"
            placeholder="Descreva o que as IAs devem corrigir..."
            value={rejectionError}
            onChange={(e) => setRejectionError(e.target.value)}
          />
          <button className="flex items-center gap-1 rounded-lg bg-brand py-1.5 px-3 text-[9px] font-bold text-neutral-950 hover:bg-brand-strong transition"><Wand2 size={11} /> Absorver</button>
        </form>
      )}

      {/* Export logs */}
      {videoStatus === "exporting" && exportLogs.length > 0 && (
        <div className="flex items-center gap-2 text-[8px] font-mono text-emerald-400/70 truncate max-w-xs">
          {exportLogs.map((l, i) => (<span key={i} className="truncate">{l}</span>))}
        </div>
      )}
    </div>
  );
}
