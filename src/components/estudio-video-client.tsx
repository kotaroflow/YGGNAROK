"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Film, Play, Sliders, AlertTriangle, 
  Trash2, ShieldAlert, Cpu, HelpCircle, ArrowRight, Video, Scissors,
  Upload, Music, Radio, Star, Award, Heart, MessageSquare, ThumbsUp, RefreshCw, Plus, X, FileText, Image, Check,
  MoreVertical, Copy, RotateCcw, Loader2, Filter, Search, Zap, ChevronRight, Wand2, CheckCircle, Brain
} from "lucide-react";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";

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

export function EstudioVideoClient() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showStyleCreator, setShowStyleCreator] = useState(false);
  
  // Custom Style Form inputs
  const [customStyleName, setCustomStyleName] = useState("");
  const [customStyleDuration, setCustomStyleDuration] = useState("");
  const [customStyleMusic, setCustomStyleMusic] = useState("");
  const [customStyleTransitions, setCustomStyleTransitions] = useState("");
  const [customStyleDirectives, setCustomStyleDirectives] = useState("");

  // Style Preset
  const [videoStyle, setVideoStyle] = useState<string>("tiktok");
  const [allPresets, setAllPresets] = useState<Record<string, VideoStylePreset>>(DEFAULT_PRESETS);

  // Ingestion
  const [referenceAssets, setReferenceAssets] = useState<ReferenceAsset[]>([]);
  const [referenceLink, setReferenceLink] = useState("");
  const [editingInstructions, setEditingInstructions] = useState("");
  const [videoAspect, setVideoAspect] = useState<"916" | "169">("916");

  // Odin neural states
  const [learningMargin, setLearningMargin] = useState(85);
  const [autoFreeTier, setAutoFreeTier] = useState(true);

  // Video timeline states
  const [videoStatus, setVideoStatus] = useState<"idle" | "analyzing" | "projecting" | "council_review" | "rendering" | "completed" | "rejected" | "exporting">("idle");
  const [progressVal, setProgressVal] = useState(0);
  const [exportPlatform, setExportPlatform] = useState<"4k" | "tiktok" | "reels" | "shorts" | null>(null);
  const [exportLogs, setExportLogs] = useState<string[]>([]);
  const [exportStep, setExportStep] = useState(0);

  const [rejectionError, setRejectionError] = useState("");
  const [absorbedFeedback, setAbsorbedFeedback] = useState<string[]>([]);
  const [councilMessages, setCouncilMessages] = useState<{agent: string, avatar: string, message: string, status: "thinking" | "approved"}[]>([]);

  const [videoScriptTitle, setVideoScriptTitle] = useState("Como Economizar 100% de APIs com YGGNAROK");
  const [videoTimeline, setVideoTimeline] = useState([
    { id: "clip_1", title: "Hook de Vídeo (3s)", dur: "3s", script: "Você sabia que está jogando dinheiro fora usando IAs pagas para coisas simples?", type: "Hook" },
    { id: "clip_2", title: "Apresentação (12s)", dur: "12s", script: "Apresento o YGGNAROK OS, seu centro de controle neural. Ele seleciona e direciona o modelo gratuito ideal para cada tarefa automaticamente.", type: "Content" },
    { id: "clip_3", title: "Demonstração (15s)", dur: "15s", script: "[Mostrar tela do canvas visual n8n neon pulsando e os dados fluindo em tempo real pelo navegador]", type: "Visual" },
    { id: "clip_4", title: "CTA Final (10s)", dur: "10s", script: "Pare de ter surpresas na fatura de IA. Clique no link abaixo e inicie sua orquestra gratuita agora mesmo!", type: "CTA" },
  ]);

  const [rawFiles, setRawFiles] = useState<string[]>([
    "arquivo_bruto_intro_kotaro.mp4",
    "b-roll_canvas_nodes.mov"
  ]);
  const [newFileName, setNewFileName] = useState("");

  const [videoGenre, setVideoGenre] = useState<"viral" | "educational" | "comedy" | "documentary" | "serious" | "sales">("viral");
  const [adaptationMode, setAdaptationMode] = useState<"liquid" | "fixed">("liquid");
  const [isScanningTrends, setIsScanningTrends] = useState(false);
  const [trendRadarLogs, setTrendRadarLogs] = useState<string[]>([
    "Gancho mais retentivo: Zoom Rápido no segundo 1.8.",
    "Batida Recomendada: Synthwave Melodic (124BPM).",
    "Estética do Algoritmo: Lettering Void & Amber piscante com ironia."
  ]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const activePreset = allPresets[videoStyle] || DEFAULT_PRESETS["tiktok"];

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

    setAllPresets(prev => ({ ...prev, [styleKey]: newPreset }));
    setVideoStyle(styleKey);
    setShowStyleCreator(false);
    
    setCustomStyleName("");
    setCustomStyleDuration("");
    setCustomStyleMusic("");
    setCustomStyleTransitions("");
    setCustomStyleDirectives("");
  };

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
        
        setCouncilMessages([
          { agent: "Isis (Edição & Pacing)", avatar: "✨", message: "Analisando cortes brutos... Proponho zoom digital rápido a cada 1.4 segundos para manter o ritmo hipnótico e prender a atenção do Kotaro.", status: "thinking" }
        ]);

        setTimeout(() => {
          setCouncilMessages(prev => [
            ...prev.map(c => ({ ...c, status: "approved" as const })),
            { agent: "Morax (Ganchos de Venda)", avatar: "🔥", message: "O hook inicial de 3s está excelente. Injetando quebra de padrão visual no frame 1 com tela Amber escura e som swoosh para retenção máxima de leads.", status: "thinking" }
          ]);
        }, 1500);

        setTimeout(() => {
          setCouncilMessages(prev => [
            ...prev.map(c => c.agent.includes("Morax") ? { ...c, status: "approved" as const } : c),
            { agent: "Hefesto (Tipografia & Estilo)", avatar: "🦾", message: "Fatos neurais carregados da LTM do Kotaro. Legenda em destaque duplo amarelo/branco aprovada. A tipografia será 'Inter' ultra-bold.", status: "thinking" }
          ]);
        }, 3000);

        setTimeout(() => {
          setCouncilMessages(prev => prev.map(c => ({ ...c, status: "approved" as const })));
          setProgressVal(80);
          setVideoStatus("rendering");

          setTimeout(() => {
            setProgressVal(100);
            setVideoStatus("completed");
          }, 2000);

        }, 4500);

      }, 2500);

    }, 2000);
  };

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

  return (
    <main className="min-h-screen text-foreground relative overflow-hidden bg-radial-gradient">
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
        
        {/* Toast */}
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

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-brand" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Estúdio de Edição · Odin OS</p>
              <span className="ml-1 inline-flex items-center gap-1 rounded-md border border-brand/30 bg-brand/10 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-brand">VIDEO</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
              Estúdio de Edição de Vídeos (Dedicated space)
            </h1>
            <p className="mt-2 text-sm text-muted">
              Corte, ritmo e orquestra multi-agente premium sem perdas e sem custos de infraestrutura.
            </p>
          </div>
        </div>

        {/* Splitted Workspace */}
        <div className="grid gap-6 lg:grid-cols-[430px_1fr]">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            
            {/* INGESTION */}
            <section className="relative overflow-hidden rounded-2xl border border-line bg-surface/50 p-6 shadow-xl backdrop-blur-md space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-rose-400" />
                  <h2 className="text-sm font-bold uppercase text-foreground">Ingestão de Mídia Bruta</h2>
                </div>
                
                <button 
                  type="button"
                  onClick={() => setShowStyleCreator(!showStyleCreator)}
                  className="inline-flex items-center gap-1 text-[9px] font-bold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded hover:bg-brand/25 transition"
                >
                  <Plus size={10} /> Novo Estilo
                </button>
              </div>
              
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
                    <Field label="Músicas">
                      <input className={`${inputClass} border-line bg-surface-strong text-[11px]`} placeholder="Synthwave, Lofi" value={customStyleMusic} onChange={(e) => setCustomStyleMusic(e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Transições e Efeitos">
                    <input className={`${inputClass} border-line bg-surface-strong text-xs`} placeholder="Zoom, fade rápido..." value={customStyleTransitions} onChange={(e) => setCustomStyleTransitions(e.target.value)} />
                  </Field>
                  <Field label="Diretrizes Estruturais / Formatos">
                    <textarea 
                      className={`${textareaClass} border-line bg-surface-strong text-xs`}
                      placeholder="Insira as regras exclusivas..."
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

              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Estilo e Diretrizes</label>
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

              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Clipes Brutos adicionados</label>
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
                </div>
              </div>

              <div className="space-y-3">
                <Field label="Orientações e Ganchos">
                  <textarea 
                    className={`${textareaClass} border-line bg-surface-strong text-xs`}
                    rows={3}
                    placeholder="Cole links ou descreva transições rápidas..."
                    value={editingInstructions}
                    onChange={(e) => setEditingInstructions(e.target.value)}
                  />
                </Field>
                <Field label="Link de Referência">
                  <input 
                    className={`${inputClass} border-line bg-surface-strong text-xs`}
                    placeholder="https://tiktok.com/@exemplo/video/..."
                    value={referenceLink}
                    onChange={(e) => setReferenceLink(e.target.value)}
                  />
                </Field>
              </div>

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
                  <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Duração Estilo</label>
                  <div className="py-1.5 px-3 bg-surface-strong border border-line rounded-lg text-xs font-bold font-mono text-center">
                    {activePreset.duration}
                  </div>
                </div>
              </div>
            </section>

            {/* RADAR */}
            <section className="relative overflow-hidden rounded-2xl border border-brand/20 bg-brand/5 p-6 shadow-xl backdrop-blur-md space-y-4">
              <div className="absolute right-0 top-0 size-20 bg-brand/5 blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio size={16} className="text-brand animate-pulse" />
                  <h2 className="text-sm font-bold tracking-wider uppercase text-brand">Radar de Gênero &amp; Trends</h2>
                </div>
                <Brain size={14} className="text-brand opacity-60" />
              </div>

              <div>
                <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1">Gênero Alvo</label>
                <select 
                  className={`${inputClass} border-line bg-surface-strong text-xs font-semibold`}
                  value={videoGenre}
                  onChange={(e) => setVideoGenre(e.target.value as any)}
                >
                  <option value="viral">Trends &amp; Virais</option>
                  <option value="educational">Educativos / Tutoriais</option>
                  <option value="comedy">Humor &amp; Comédia</option>
                  <option value="documentary">Cinematográfico / Mini-Doc</option>
                  <option value="serious">Sérios &amp; Corporativos</option>
                  <option value="sales">VSL / Alta Conversão</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-bold text-muted uppercase tracking-wider block mb-1.5">Adaptação de Pacing</label>
                <div className="grid grid-cols-2 gap-1 p-0.5 bg-surface-strong border border-line rounded-lg">
                  <button 
                    type="button" 
                    onClick={() => setAdaptationMode("liquid")}
                    className={`py-1 text-[9px] font-bold rounded transition ${adaptationMode === "liquid" ? "bg-brand text-neutral-950" : "text-muted hover:text-foreground"}`}
                  >
                    Algoritmo Líquido
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAdaptationMode("fixed")}
                    className={`py-1 text-[9px] font-bold rounded transition ${adaptationMode === "fixed" ? "bg-brand text-neutral-950" : "text-muted hover:text-foreground"}`}
                  >
                    Estilo Fixo Rígido
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 p-2.5 rounded-xl bg-neutral-950 border border-line/30 font-mono text-[9px] text-muted">
                {trendRadarLogs.map((log, idx) => (
                  <p key={idx} className="flex items-center gap-1.5 truncate">
                    <span className="text-brand">•</span>
                    <span>{log}</span>
                  </p>
                ))}
              </div>

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

            {/* ODIN SUPERVISOR */}
            <section className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-6 shadow-xl backdrop-blur-md">
              <div className="absolute right-0 top-0 size-24 bg-emerald-500/10 blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-emerald-400 animate-pulse" />
                  <h2 className="text-sm font-bold tracking-wider uppercase text-emerald-400">Supervisor de Evolução (Odin)</h2>
                </div>
              </div>
              <p className="text-[11px] text-muted leading-relaxed mb-4">
                Lê erros LTM de edições passadas e ajusta automaticamente as diretrizes técnicas dos modelos gratuitos.
              </p>
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

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            <section className="rounded-2xl border border-line bg-surface/40 p-6 shadow-xl backdrop-blur-md space-y-6">
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
                    <span>Reunindo e Renderizando...</span>
                  </div>
                )}

                {videoStatus === "completed" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                    <CheckCircle size={12} /> Render Concluído!
                  </span>
                )}
              </div>

              {(videoStatus !== "idle" && videoStatus !== "exporting") && (
                <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500 animate-glow-bar" 
                    style={{ width: `${progressVal}%` }}
                  />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-surface-strong/30 p-3 space-y-1">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                    <Radio size={10} className="animate-pulse" /> Tendências Locais
                  </span>
                  <div className="text-[9px] text-muted space-y-0.5 mt-1">
                    {activePreset.trendingMusic.map((music, idx) => (
                      <p key={idx} className="flex items-center gap-1 truncate"><Music size={8} /> {music}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-surface-strong/30 p-3 space-y-1">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Scissors size={10} /> Transições virais
                  </span>
                  <div className="text-[9px] text-muted space-y-0.5 mt-1">
                    {activePreset.trendingTransitions.map((tran, idx) => (
                      <p key={idx} className="truncate">• {tran}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-surface-strong/30 p-3 space-y-1">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Star size={10} /> Regras do Estilo
                  </span>
                  <p className="text-[9px] text-muted line-clamp-3 leading-relaxed mt-1">
                    {activePreset.baseDirectives}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[160px_1fr]">
                <div className="flex flex-col items-center justify-start border-r border-line/20 pr-4">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-2">Linha do tempo</span>
                  
                  <div className={`relative border-2 border-white/10 bg-neutral-950 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${
                    videoAspect === "916" ? "h-[220px] w-[124px]" : "h-[124px] w-[220px]"
                  }`}>
                    {videoStatus === "rendering" || videoStatus === "analyzing" ? (
                      <div className="absolute inset-0 bg-neutral-950/80 flex flex-col items-center justify-center gap-2 z-20">
                        <RefreshCw size={24} className="text-rose-400 animate-spin" />
                        <span className="text-[8px] text-rose-300 font-mono tracking-widest animate-pulse">RENDER...</span>
                      </div>
                    ) : null}
                    
                    <Video className="text-rose-400/40 size-8" />
                    <div className="absolute bottom-2 left-2 right-2 text-[7px] font-mono text-center text-white/50 truncate">
                      {videoScriptTitle}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Cortes e Segmentos Projetados</span>
                    <div className="flex border border-line bg-surface-strong/30 rounded-xl p-2 gap-1.5 overflow-x-auto">
                      {videoTimeline.map((clip, idx) => (
                        <div 
                          key={clip.id} 
                          className="flex-grow min-w-[90px] rounded-lg border border-line/40 bg-surface-strong/40 p-2 text-center"
                        >
                          <span className="text-[6px] font-bold uppercase block text-rose-400">{clip.type}</span>
                          <span className="text-[10px] font-extrabold text-foreground truncate block mt-0.5">{clip.dur}</span>
                          <span className="text-[8px] text-muted block truncate mt-1">Corte #{idx+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {videoStatus === "council_review" || videoStatus === "rendering" || videoStatus === "completed" ? (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Deliberação do Conselho de Agentes</span>
                      <div className="space-y-2 bg-surface-strong/30 rounded-xl p-3 border border-line max-h-[160px] overflow-y-auto">
                        {councilMessages.map((msg, idx) => (
                          <div key={idx} className="text-[11px] leading-relaxed flex items-start gap-2 animate-alert-pop">
                            <span className="size-5 rounded-full bg-rose-500/10 border border-rose-500/20 grid place-items-center text-[10px] shrink-0">{msg.avatar}</span>
                            <div className="flex-grow">
                              <span className="font-bold text-foreground block">{msg.agent}</span>
                              <p className="text-muted text-[10px] mt-0.5">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-line rounded-xl bg-surface/10">
                      <Cpu className="text-rose-400/40 size-10 mb-2" />
                      <p className="text-[10px] text-muted max-w-sm">Insira seus clipes, escolha o preset e clique em "Disparar Orquestra" para que o conselho de IAs execute a Mesa de Edição!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload simulation */}
              <div className="border-t border-line/50 pt-5 space-y-4">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Adicionar Arquivos de Referência</span>
                <div className="grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => handleSimulateAssetUpload("image")} className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1.5">
                    <Image size={16} className="text-amber-400" />
                    <span className="text-[9px] font-bold text-muted">Imagem</span>
                  </button>
                  <button type="button" onClick={() => handleSimulateAssetUpload("video")} className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1.5">
                    <Play size={16} className="text-rose-400" />
                    <span className="text-[9px] font-bold text-muted">Vídeo (Ref)</span>
                  </button>
                  <button type="button" onClick={() => handleSimulateAssetUpload("audio")} className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1.5">
                    <Music size={16} className="text-sky-400" />
                    <span className="text-[9px] font-bold text-muted">Áudio</span>
                  </button>
                  <button type="button" onClick={() => handleSimulateAssetUpload("doc")} className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1.5">
                    <FileText size={16} className="text-emerald-400" />
                    <span className="text-[9px] font-bold text-muted">Documento</span>
                  </button>
                </div>

                {referenceAssets.length > 0 && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {referenceAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-2.5 rounded-xl border border-line bg-surface-strong/50">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] font-bold text-foreground block truncate max-w-[150px]">{asset.name}</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveAsset(asset.id)} className="text-muted hover:text-rose-400 text-xs px-1">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 🚀 EXPORT PIPELINES */}
              {videoStatus === "completed" && (
                <div className="border-t border-line pt-5 space-y-4 animate-alert-pop">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Hub de Exportação Nativa (4K &amp; Redes)</span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <button onClick={() => triggerPlatformPublish("4k")} className="flex flex-col items-center justify-center p-3 border border-brand/20 bg-brand/5 hover:border-brand/40 hover:bg-brand/10 rounded-xl transition gap-1">
                      <Film size={18} className="text-brand animate-pulse" />
                      <span className="text-[10px] font-bold text-foreground">ProRes 4K</span>
                    </button>
                    <button onClick={() => triggerPlatformPublish("tiktok")} className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1">
                      <MessageSquare size={18} className="text-pink-400" />
                      <span className="text-[10px] font-bold text-foreground">TikTok HD</span>
                    </button>
                    <button onClick={() => triggerPlatformPublish("reels")} className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1">
                      <Heart size={18} className="text-rose-400" />
                      <span className="text-[10px] font-bold text-foreground">Reels HDR</span>
                    </button>
                    <button onClick={() => triggerPlatformPublish("shorts")} className="flex flex-col items-center justify-center p-3 border border-line bg-surface-strong/30 hover:border-brand/30 hover:bg-surface-strong/60 rounded-xl transition gap-1">
                      <Play size={18} className="text-red-400" />
                      <span className="text-[10px] font-bold text-foreground">Shorts UHD</span>
                    </button>
                  </div>
                </div>
              )}

              {videoStatus === "exporting" && exportPlatform && (
                <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 space-y-3 animate-alert-pop">
                  <div className="space-y-1 border border-line/40 rounded-lg p-2.5 bg-neutral-950 font-mono text-[9px] text-muted">
                    {exportLogs.map((log, idx) => (
                      <p key={idx} className="flex items-center gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{log}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Accept / Reject loops */}
              {videoStatus === "completed" && (
                <div className="border-t border-line pt-5 space-y-4 animate-alert-pop">
                  <div className="bg-surface-strong/40 rounded-xl p-4 border border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Award size={14} className="text-brand" /> Revisão de Qualidade Pronta
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setVideoStatus("idle")} className="px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-bold hover:bg-emerald-600 transition">
                        ✓ Aceitar Vídeo
                      </button>
                      <button onClick={() => setVideoStatus("rejected")} className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition">
                        ✕ Rejeitar (LTM Erro)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {videoStatus === "rejected" && (
                <form onSubmit={handleRejectVideo} className="border-t border-line pt-5 space-y-3 animate-alert-pop">
                  <textarea
                    required
                    className="w-full rounded-xl border border-line bg-surface-strong/30 p-3 text-xs text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
                    rows={3}
                    value={rejectionError}
                    onChange={(e) => setRejectionError(e.target.value)}
                    placeholder="Descreva o que as IAs devem corrigir no vídeo (LTM)..."
                  />
                  <div className="flex justify-end">
                    <button className="flex items-center gap-1.5 rounded-xl bg-brand py-2 px-4 text-xs font-bold text-neutral-950 shadow-md transition hover:bg-brand-strong">
                      <Wand2 size={12} /> Absorver Feedback &amp; Re-renderizar
                    </button>
                  </div>
                </form>
              )}

              {absorbedFeedback.length > 0 && (
                <div className="rounded-xl border border-brand/20 bg-brand/5 p-3 space-y-1.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-brand flex items-center gap-1">
                    <Brain size={10} /> Histórico de Rejeições Absorvidas LTM
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
            </section>
          </div>

        </div>

      </div>
    </main>
  );
}
