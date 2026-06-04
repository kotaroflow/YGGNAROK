"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles, Search, Copy, Check, Calendar, ExternalLink,
  Cpu, Plus, Clock, Send, Globe, AlertCircle, Layers,
  TrendingUp, Target, BarChart3, Filter, X, Loader2
} from "lucide-react";
import { Field, buttonClass, inputClass, textareaClass } from "@/components/field";

// ─── Types ───────────────────────────────────────────────

interface Profile {
  id: string;
  name: string;
}

interface ContentItem {
  id: string;
  title: string;
}

interface ManualPostingItem {
  id: string;
  profile_id: string | null;
  content_id: string | null;
  platform: string;
  status: string;
  planned_date: string | null;
  posted_at: string | null;
  caption_to_copy: string | null;
  hashtags_to_copy: string[] | null;
  post_url: string | null;
  created_at: string | null;
}

interface PostagemManualClientProps {
  profiles: Profile[];
  contents: ContentItem[];
  queue: ManualPostingItem[];
  createManualPostingItemAction: (formData: FormData) => void;
  createGuidedAiJobAction: (formData: FormData) => void;
  markManualPostAsPublishedAction: (formData: FormData) => void;
}

// ─── Visual Tokens ───────────────────────────────────────

const PROFILE_PALETTE = [
  { dot: "bg-violet-500", bg: "bg-violet-500/8", border: "border-violet-500/20", text: "text-violet-500", light: "bg-violet-500/6" },
  { dot: "bg-amber-500", bg: "bg-amber-500/8", border: "border-amber-500/20", text: "text-amber-500", light: "bg-amber-500/6" },
  { dot: "bg-emerald-500", bg: "bg-emerald-500/8", border: "border-emerald-500/20", text: "text-emerald-500", light: "bg-emerald-500/6" },
  { dot: "bg-sky-500", bg: "bg-sky-500/8", border: "border-sky-500/20", text: "text-sky-500", light: "bg-sky-500/6" },
  { dot: "bg-rose-500", bg: "bg-rose-500/8", border: "border-rose-500/20", text: "text-rose-500", light: "bg-rose-500/6" },
  { dot: "bg-cyan-500", bg: "bg-cyan-500/8", border: "border-cyan-500/20", text: "text-cyan-500", light: "bg-cyan-500/6" },
];

const PLATFORM_STYLES: Record<string, { icon: string; color: string; bg: string }> = {
  instagram: { icon: "📸", color: "text-pink-500", bg: "bg-pink-500/10" },
  youtube: { icon: "🎬", color: "text-red-500", bg: "bg-red-500/10" },
  tiktok: { icon: "🎵", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  twitter: { icon: "🐦", color: "text-sky-500", bg: "bg-sky-500/10" },
  linkedin: { icon: "💼", color: "text-blue-600", bg: "bg-blue-500/10" },
  facebook: { icon: "👍", color: "text-blue-500", bg: "bg-blue-500/10" },
  threads: { icon: "🧵", color: "text-amber-500", bg: "bg-amber-500/10" },
  default: { icon: "📱", color: "text-muted", bg: "bg-surface-strong/30" },
};

const STAGE_CONFIG = [
  { key: "overdue", label: "Atrasado", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/8" },
  { key: "today", label: "Hoje", icon: Target, color: "text-brand", bg: "bg-brand/8" },
  { key: "upcoming", label: "Agendado", icon: Clock, color: "text-sky-500", bg: "bg-sky-500/8" },
  { key: "posted", label: "Publicado", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/8" },
];

// ─── Helpers ─────────────────────────────────────────────

function getProfileStyle(name: string) {
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return PROFILE_PALETTE[hash % PROFILE_PALETTE.length];
}

function getPlatformStyle(platform: string) {
  const key = platform.toLowerCase().trim();
  return PLATFORM_STYLES[key] ?? PLATFORM_STYLES.default;
}

function getItemStage(item: ManualPostingItem): string {
  if (item.status === "posted") return "posted";
  if (!item.planned_date) return "upcoming";
  const planned = new Date(item.planned_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = planned.getTime() - today.getTime();
  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  return "upcoming";
}

// ─── Component ───────────────────────────────────────────

export function PostagemManualClient({
  profiles,
  contents,
  queue,
  createManualPostingItemAction,
  createGuidedAiJobAction,
  markManualPostAsPublishedAction
}: PostagemManualClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);
  const [activeStageFilter, setActiveStageFilter] = useState<string | null>(null);
  const [activeProfileFilter, setActiveProfileFilter] = useState<string | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<"manual" | "ai">("manual");

  // ── Derived data ──

  const filteredQueue = useMemo(() => {
    return queue.filter(item => {
      const matchesSearch =
        item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.caption_to_copy || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = activeStageFilter ? getItemStage(item) === activeStageFilter : true;
      const matchesProfile = activeProfileFilter ? item.profile_id === activeProfileFilter : true;
      return matchesSearch && matchesStage && matchesProfile;
    });
  }, [queue, searchTerm, activeStageFilter, activeProfileFilter]);

  const groupedByProfile = useMemo(() => {
    const groups: Record<string, ManualPostingItem[]> = {};
    for (const item of filteredQueue) {
      const pid = item.profile_id ?? "unknown";
      if (!groups[pid]) groups[pid] = [];
      groups[pid].push(item);
    }
    return groups;
  }, [filteredQueue]);

  const stats = useMemo(() => {
    const total = queue.length;
    const posted = queue.filter(i => i.status === "posted").length;
    const pending = total - posted;
    const overdue = queue.filter(i => getItemStage(i) === "overdue").length;
    const today = queue.filter(i => getItemStage(i) === "today").length;
    const uniquePlatforms = new Set(queue.map(i => i.platform.toLowerCase())).size;
    return { total, posted, pending, overdue, today, uniquePlatforms };
  }, [queue]);

  const handleCopyCaption = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaptionId(id);
    setTimeout(() => setCopiedCaptionId(null), 2000);
  };

  const getProfileName = (pid: string | null) => {
    if (!pid) return "Sem perfil";
    return profiles.find(p => p.id === pid)?.name ?? "Perfil desconhecido";
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 space-y-8">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              流通管理局 — Ryūtsū Kanrikyoku
            </p>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground via-foreground to-muted bg-clip-text text-transparent">
            Content Distribution Bureau
          </h1>
          <p className="text-sm text-muted max-w-xl">
            Monitor, control and distribute content across all channels.
            Track pipeline status, profile activity, and publishing intelligence.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewPostModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white dark:text-neutral-950 transition hover:bg-brand-strong shadow-sm shadow-brand/20 shrink-0"
        >
          <Plus size={16} />
          Nova Postagem
        </button>
      </div>

      {/* ── Operational Cards ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Fila Pendente", value: stats.pending, icon: Layers, color: "text-amber-500", bg: "bg-amber-500/8", border: "border-amber-500/20" },
          { label: "Publicados", value: stats.posted, icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/8", border: "border-emerald-500/20" },
          { label: "Entregas Hoje", value: stats.today, icon: Target, color: "text-brand", bg: "bg-brand/8", border: "border-brand/20" },
          { label: "Atrasados", value: stats.overdue, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/8", border: "border-red-500/20" },
        ].map((card) => {
          const Icon = card.icon;
          const isCritical = card.label === "Atrasados" && card.value > 0;
          return (
            <div
              key={card.label}
              className={`relative rounded-2xl border ${isCritical ? "border-red-500/40 bg-red-500/5" : `${card.border} ${card.bg}`} p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${isCritical ? "shadow-[0_0_20px_-8px_rgba(239,68,68,0.2)]" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${card.color}`}>
                  {card.label}
                </span>
                <Icon size={16} className={card.color} />
              </div>
              <span className={`text-3xl font-black tracking-tight ${isCritical ? "text-red-500 animate-pulse" : "text-foreground"}`}>
                {card.value}
              </span>
              {card.label === "Fila Pendente" && stats.uniquePlatforms > 0 && (
                <p className="text-[9px] text-muted/60 mt-1 font-semibold">
                  {stats.uniquePlatforms} {stats.uniquePlatforms === 1 ? "plataforma" : "plataformas"}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Filters ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1">
          <Filter size={12} /> Filtros
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveStageFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition border ${
              activeStageFilter === null
                ? "bg-brand text-white dark:text-neutral-950 border-brand"
                : "bg-surface-strong/30 text-muted border-line hover:border-brand/30 hover:text-foreground"
            }`}
          >
            Todos
          </button>
          {STAGE_CONFIG.map(stage => {
            const Icon = stage.icon;
            const count = queue.filter(i => getItemStage(i) === stage.key).length;
            if (count === 0) return null;
            return (
              <button
                key={stage.key}
                type="button"
                onClick={() => setActiveStageFilter(stage.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition border ${
                  activeStageFilter === stage.key
                    ? `${stage.bg} ${stage.color} border-current`
                    : "bg-surface-strong/30 text-muted border-line hover:border-brand/30 hover:text-foreground"
                }`}
              >
                <Icon size={12} />
                {stage.label}
                <span className="ml-0.5 opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
        <div className="h-5 w-px bg-line mx-1 hidden md:block" />
        {profiles.map(profile => {
          const style = getProfileStyle(profile.name);
          const count = queue.filter(i => i.profile_id === profile.id).length;
          if (count === 0) return null;
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => setActiveProfileFilter(activeProfileFilter === profile.id ? null : profile.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition border ${
                activeProfileFilter === profile.id
                  ? `${style.border} ${style.text} border-current`
                  : "bg-surface-strong/30 text-muted border-line hover:border-brand/30 hover:text-foreground"
              }`}
            >
              <span className={`size-1.5 rounded-full ${style.dot}`} />
              {profile.name}
            </button>
          );
        })}
        <div className="relative ml-auto w-full md:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar na fila..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-line bg-surface-strong/20 text-xs text-foreground placeholder:text-muted/60 outline-none transition focus:border-brand/40"
          />
        </div>
      </div>

      {/* ── Content Pipeline ──────────────────────────── */}
      {Object.keys(groupedByProfile).length === 0 ? (
        /* ── Empty State ──────────────────────────────── */
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-line bg-surface/10 p-12">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-brand/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/8" />

          <div className="relative flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-brand/10 to-violet-500/10 text-brand mb-6 ring-1 ring-brand/10">
              <Layers size={28} />
            </div>
            <h3 className="text-lg font-bold text-foreground">Nenhum conteudo em distribuicao</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              O pipeline de distribuicao esta vazio. Crie sua primeira postagem ou gere legendas com IA para comecar a operacao.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <button
                type="button"
                onClick={() => setShowNewPostModal(true)}
                className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface/40 p-4 text-center transition hover:border-brand/30 hover:bg-brand/5 hover:-translate-y-0.5"
              >
                <div className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand">
                  <Plus size={18} />
                </div>
                <span className="text-xs font-bold text-foreground">Adicionar Postagem</span>
                <span className="text-[9px] text-muted">Agende conteudo manualmente</span>
              </button>

              <button
                type="button"
                onClick={() => { setShowNewPostModal(true); setActiveFormTab("ai"); }}
                className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface/40 p-4 text-center transition hover:border-brand/30 hover:bg-brand/5 hover:-translate-y-0.5"
              >
                <div className="grid size-10 place-items-center rounded-lg bg-violet-500/10 text-violet-500">
                  <Sparkles size={18} />
                </div>
                <span className="text-xs font-bold text-foreground">Gerar com Yomi AI</span>
                <span className="text-[9px] text-muted">Crie legendas com assistencia neural</span>
              </button>

              <Link
                href="/criar-conteudo"
                className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface/40 p-4 text-center transition hover:border-brand/30 hover:bg-brand/5 hover:-translate-y-0.5"
              >
                <div className="grid size-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Cpu size={18} />
                </div>
                <span className="text-xs font-bold text-foreground">Ir para Criacao</span>
                <span className="text-[9px] text-muted">Produza conteudo no Estudio</span>
              </Link>
            </div>

            <p className="mt-8 text-[10px] text-muted/50 font-mono">
              Dica: Acesse a Central de Criacao para produzir conteudo, depois distribua aqui.
            </p>
          </div>
        </div>
      ) : (
        /* ── Pipeline by Profile ──────────────────────── */
        <div className="space-y-8">
          {Object.entries(groupedByProfile).map(([profileId, items]) => {
            const profileName = getProfileName(profileId);
            const style = getProfileStyle(profileName);
            const stageCounts = {
              overdue: items.filter(i => getItemStage(i) === "overdue").length,
              today: items.filter(i => getItemStage(i) === "today").length,
              upcoming: items.filter(i => getItemStage(i) === "upcoming").length,
              posted: items.filter(i => getItemStage(i) === "posted").length,
            };

            return (
              <div key={profileId} className="relative">
                {/* Profile header */}
                <div className={`flex items-center gap-3 px-5 py-3 rounded-t-2xl border border-line ${style.light} border-b-0 bg-surface/40`}>
                  <span className={`size-2.5 rounded-full ${style.dot} shadow-[0_0_6px_${style.dot.replace("bg-", "")}/0.5]`} />
                  <h3 className="text-sm font-bold text-foreground tracking-tight">{profileName}</h3>
                  <div className="flex items-center gap-2 ml-auto">
                    {stageCounts.overdue > 0 && (
                      <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">{stageCounts.overdue} atrasado{stageCounts.overdue > 1 ? "s" : ""}</span>
                    )}
                    {stageCounts.today > 0 && (
                      <span className="text-[9px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">{stageCounts.today} hoje</span>
                    )}
                    <span className="text-[10px] text-muted font-semibold">{items.length} {items.length === 1 ? "item" : "itens"}</span>
                  </div>
                </div>

                {/* Mini pipeline bar */}
                <div className="flex h-1.5 overflow-hidden bg-surface-strong/30 border-x border-line">
                  {stageCounts.overdue > 0 && <div className="bg-red-500 transition-all duration-500" style={{ width: `${(stageCounts.overdue / items.length) * 100}%` }} />}
                  {stageCounts.today > 0 && <div className="bg-brand transition-all duration-500" style={{ width: `${(stageCounts.today / items.length) * 100}%` }} />}
                  {stageCounts.upcoming > 0 && <div className="bg-sky-500 transition-all duration-500" style={{ width: `${(stageCounts.upcoming / items.length) * 100}%` }} />}
                  {stageCounts.posted > 0 && <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${(stageCounts.posted / items.length) * 100}%` }} />}
                </div>

                {/* Items */}
                <div className="border border-line rounded-b-2xl bg-surface/20 divide-y divide-line/40">
                  {items.map((item) => {
                    const stage = getItemStage(item);
                    const stageConfig = STAGE_CONFIG.find(s => s.key === stage)!;
                    const platform = getPlatformStyle(item.platform);
                    const StageIcon = stageConfig.icon;

                    return (
                      <div
                        key={item.id}
                        className="group relative p-5 transition-all duration-200 hover:bg-surface-strong/30"
                      >
                        <div className="flex flex-col xl:flex-row xl:items-start gap-5">
                          {/* Left: Main content */}
                          <div className="flex-1 min-w-0 space-y-3">
                            {/* Stage badge + platform + status */}
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-widest ${stageConfig.bg} ${stageConfig.color} border border-current/20`}>
                                <StageIcon size={10} />
                                {stageConfig.label}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${platform.bg} ${platform.color}`}>
                                <span>{platform.icon}</span>
                                {item.platform}
                              </span>
                              {item.planned_date && (
                                <span className="text-[9px] text-muted font-mono font-bold flex items-center gap-1">
                                  <Calendar size={10} className="text-muted/60" />
                                  {new Date(item.planned_date).toLocaleDateString("pt-BR")}
                                </span>
                              )}
                            </div>

                            {/* Caption */}
                            <div className="rounded-xl border border-line/30 bg-surface-strong/30 p-3.5">
                              <p className="text-[11px] text-muted leading-relaxed font-medium whitespace-pre-wrap line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                                {item.caption_to_copy || (
                                  <span className="italic text-muted/40">Sem legenda associada.</span>
                                )}
                              </p>
                              {item.hashtags_to_copy?.length ? (
                                <p className="mt-2 text-[9px] font-mono font-bold text-brand/80 truncate">
                                  {item.hashtags_to_copy.join(" ")}
                                </p>
                              ) : null}
                            </div>

                            {/* Copy button */}
                            {item.caption_to_copy && (
                              <button
                                type="button"
                                onClick={() => handleCopyCaption(item.id, `${item.caption_to_copy}\n\n${(item.hashtags_to_copy || []).join(" ")}`)}
                                className={`inline-flex items-center gap-1.5 px-3.5 h-8 rounded-xl text-[10px] font-bold transition-all ${
                                  copiedCaptionId === item.id
                                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-500"
                                    : "bg-surface-strong/60 border border-line hover:border-brand/40 hover:text-foreground"
                                }`}
                              >
                                {copiedCaptionId === item.id ? (
                                  <><Check size={12} /> Copiado para publicacao</>
                                ) : (
                                  <><Copy size={12} /> Copiar Legenda + Hashtags</>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Right: Action panel */}
                          <div className="xl:w-56 shrink-0">
                            {item.status !== "posted" ? (
                              <form action={markManualPostAsPublishedAction} className="space-y-2.5 p-3.5 rounded-xl bg-surface-strong/20 border border-line/50">
                                <input type="hidden" name="queueId" value={item.id} />
                                <p className="text-[9px] font-extrabold text-brand uppercase tracking-wider flex items-center gap-1">
                                  <Send size={10} /> Confirmar Envio
                                </p>
                                <div className="space-y-2">
                                  <input
                                    className="w-full h-8 rounded-lg border border-line bg-surface-strong/30 px-2.5 text-[10px] text-foreground placeholder:text-muted/50 outline-none focus:border-brand/40"
                                    name="postUrl"
                                    placeholder="Cole o link do post..."
                                    required
                                  />
                                  <button className="w-full h-8 rounded-lg bg-brand text-white dark:text-neutral-950 text-[9px] font-extrabold uppercase tracking-wider hover:bg-brand-strong transition flex items-center justify-center gap-1">
                                    <Send size={10} />
                                    <span>Finalizar</span>
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <div className="p-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 text-center">
                                <p className="text-[9px] font-extrabold text-emerald-500 uppercase tracking-wider mb-2">
                                  Publicado com Sucesso
                                </p>
                                <a
                                  className="inline-flex items-center justify-center gap-1.5 w-full h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 hover:bg-emerald-500/20 transition-all"
                                  href={item.post_url ?? "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink size={11} />
                                  <span>Abrir Postagem</span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ── Summary bar ─────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface/30 p-4">
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <span className="text-muted uppercase tracking-wider">Pipeline Summary</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500" /> {stats.overdue} atrasados</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-brand" /> {stats.today} hoje</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-sky-500" /> {stats.pending - stats.overdue - stats.today} agendados</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" /> {stats.posted} publicados</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted font-semibold">
              <TrendingUp size={12} className="text-brand" />
              {stats.total > 0
                ? `${Math.round((stats.posted / stats.total) * 100)}% de conclusao`
                : "Nenhum item no pipeline"}
            </div>
          </div>
        </div>
      )}

      {/* ── New Post Modal ──────────────────────────────── */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-brand via-brand-strong to-violet-500" />

            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Plus size={18} className="text-brand" />
                    Nova Postagem
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    Adicione conteudo a fila de distribuicao
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="rounded-lg p-1 text-muted hover:bg-surface-strong hover:text-foreground transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tab selector */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-surface-strong/60 border border-line rounded-xl mb-5">
                <button
                  type="button"
                  onClick={() => setActiveFormTab("manual")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeFormTab === "manual"
                      ? "bg-brand text-white dark:text-neutral-950 shadow-md"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Plus size={14} />
                  <span>Adicionar Post</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab("ai")}
                  className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                    activeFormTab === "ai"
                      ? "bg-brand text-white dark:text-neutral-950 shadow-md"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <Sparkles size={14} />
                  <span>Legenda via IA</span>
                </button>
              </div>

              {/* Manual form */}
              {activeFormTab === "manual" ? (
                <form action={(fd) => { createManualPostingItemAction(fd); setShowNewPostModal(false); }} className="space-y-4">
                  <Field label="Perfil Alvo">
                    <select className={inputClass} name="profileId" required>
                      <option value="">Selecione um perfil...</option>
                      {profiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>{profile.name}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Selecionar Ativo da Criacao">
                    <select className={inputClass} name="contentId" required>
                      <option value="">Selecione o conteudo...</option>
                      {contents.map((content) => (
                        <option key={content.id} value={content.id}>{content.title}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Plataforma">
                      <input className={inputClass} name="platform" placeholder="Ex: Instagram, TikTok" required />
                    </Field>
                    <Field label="Planejado Para">
                      <input className={inputClass} name="plannedDate" type="date" />
                    </Field>
                  </div>

                  <Field label="Legenda Pronta">
                    <textarea className={textareaClass} rows={3} name="caption" placeholder="Escreva a legenda..." />
                  </Field>

                  <Field label="Hashtags Sugeridas">
                    <input className={inputClass} name="hashtags" placeholder="#tag #marketing" />
                  </Field>

                  <button type="submit" className={`${buttonClass} w-full py-3 text-xs font-extrabold tracking-wider bg-brand text-white dark:text-neutral-950 hover:bg-brand-strong rounded-xl transition shadow-md flex items-center justify-center gap-2`}>
                    <Calendar size={14} />
                    <span>Agendar Postagem</span>
                  </button>
                </form>
              ) : (
                /* AI form */
                <form action={(fd) => { createGuidedAiJobAction(fd); setShowNewPostModal(false); }} className="space-y-4">
                  <input type="hidden" name="type" value="posting.prepare" />
                  <input type="hidden" name="agentKey" value="yomi" />
                  <input type="hidden" name="source" value="posting_page" />

                  <Field label="Perfil para Yomi AI">
                    <select className={inputClass} name="profileId" required>
                      <option value="">Selecione o perfil...</option>
                      {profiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>{profile.name}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Diretrizes do Briefing de Distribuicao">
                    <textarea
                      className={textareaClass}
                      rows={6}
                      name="brief"
                      placeholder="Especifique o tom, topicos, objetivo do video/publicacao, ganchos emocionais e CTA."
                      required
                    />
                  </Field>

                  <div className="rounded-xl bg-brand/5 border border-brand/15 p-3 text-[10px] text-brand leading-relaxed font-bold flex items-start gap-2">
                    <Cpu size={14} className="shrink-0 mt-0.5 animate-pulse" />
                    <span>A assistente neural <strong>Yomi</strong> cria legendas magneticas com emojis e hashtags para retencao organica.</span>
                  </div>

                  <button type="submit" className={`${buttonClass} w-full py-3 text-xs font-extrabold tracking-wider bg-brand text-white dark:text-neutral-950 hover:bg-brand-strong rounded-xl transition shadow-md flex items-center justify-center gap-2`}>
                    <Sparkles size={14} />
                    <span>Gerar com Yomi AI</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
