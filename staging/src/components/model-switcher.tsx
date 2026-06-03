"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Zap, Scale, Brain, Check, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  AI_MODELS,
  type AIModel,
  type ModelTier,
  TIER_LABELS,
  loadSelectedModel,
  saveSelectedModel,
  getModel,
  getSectorFromPath,
  SECTOR_LABELS,
  getModelUsagePercent,
  getModelDailyLimit,
  getModelUsage,
} from "@/lib/models";

const TIER_ICON: Record<ModelTier, React.ReactNode> = {
  fast: <Zap size={10} className="shrink-0" />,
  balanced: <Scale size={10} className="shrink-0" />,
  powerful: <Brain size={10} className="shrink-0" />,
};

const TIER_CLASS: Record<ModelTier, string> = {
  fast: "text-emerald-600 bg-emerald-50 border-emerald-200/50 dark:text-emerald-400 dark:bg-emerald-950/45 dark:border-emerald-800/40",
  balanced: "text-amber-600 bg-amber-50 border-amber-200/50 dark:text-amber-400 dark:bg-amber-950/45 dark:border-amber-800/40",
  powerful: "text-purple-600 bg-purple-50 border-purple-200/50 dark:text-purple-400 dark:bg-purple-950/45 dark:border-purple-800/40",
};

// Group models by provider
const PROVIDER_ORDER = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Meta",
  "DeepSeek",
  "Mistral",
  "xAI (Grok)",
  "Qwen",
  "Perplexity",
  "Cohere",
  "Microsoft",
  "NVIDIA",
  "Nous Research",
];

function groupByProvider(models: AIModel[]) {
  const groups: Record<string, AIModel[]> = {};
  for (const model of models) {
    if (!groups[model.provider]) groups[model.provider] = [];
    groups[model.provider].push(model);
  }
  return PROVIDER_ORDER.filter((p) => groups[p]).map((p) => ({ provider: p, models: groups[p] }));
}

type Props = {
  onModelChange?: (modelId: string) => void;
  /** Compact mode for inline use inside chat input */
  compact?: boolean;
};

export function ModelSwitcher({ onModelChange, compact = false }: Props) {
  const pathname = usePathname() ?? "/";
  const sector = getSectorFromPath(pathname);

  const [selectedId, setSelectedId] = useState(loadSelectedModel);
  const [usageVersion, setUsageVersion] = useState(0);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"recommended" | "all">("recommended");
  const menuRef = useRef<HTMLDivElement>(null);
  
  const model = getModel(selectedId);
  const usage = getModelUsage(selectedId);
  const limit = getModelDailyLimit(selectedId);
  const pct = getModelUsagePercent(selectedId);

  // Compute filtered models
  const filteredModels = filter === "recommended"
    ? AI_MODELS.filter((m) => m.sectors.includes(sector))
    : AI_MODELS;

  const recommendedCount = AI_MODELS.filter((m) => m.sectors.includes(sector)).length;
  const groups = groupByProvider(filteredModels);

  // Sync with localStorage on mount and listen to real-time usage updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedId(loadSelectedModel());
    }, 0);

    function handleUsageChange() {
      setUsageVersion((v) => v + 1);
    }

    window.addEventListener("ygn-model-usage-change", handleUsageChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("ygn-model-usage-change", handleUsageChange);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function select(id: string) {
    setSelectedId(id);
    saveSelectedModel(id);
    onModelChange?.(id);
    setOpen(false);
  }

  // Shorten model name for compact display
  const shortName = compact
    ? model.name.replace("Claude ", "").replace("GPT-", "GPT-").replace("Gemini ", "Gemini ")
    : model.name;

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={`Consumo: ${Math.round(pct * 100)}% (${(usage.tokens / 1000).toFixed(1)}k / ${(limit / 1000).toFixed(0)}k tokens)`}
        className={`relative overflow-hidden flex items-center gap-2 rounded-full border transition-all duration-500 ease-out ${
          compact
            ? "px-3 py-1.5 text-[12px]"
            : "px-3.5 py-2 text-[13px]"
        } ${
          open
            ? "border-brand bg-brand/10 text-brand shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            : "border-line bg-surface/85 text-foreground hover:border-brand/40 shadow-sm"
        }`}
      >
        {/* Full-Button Progress Background Layer */}
        {!open && (
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out z-0"
            style={{
              background: `linear-gradient(to right, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0.12) 100%)`,
              width: `${usage.tokens > 0 ? Math.max(pct * 100, 5) : 0}%`,
              borderRight: usage.tokens > 0 ? '1px solid rgba(245, 158, 11, 0.4)' : 'none',
              boxShadow: usage.tokens > 0 ? '2px 0 8px rgba(245, 158, 11, 0.2)' : 'none'
            }}
          />
        )}
        
        {/* Content Layer */}
        <span className="relative z-10 font-mono text-[9.5px] uppercase tracking-wider text-brand font-extrabold bg-brand/10 dark:bg-brand/15 px-2 py-0.5 rounded border border-brand/25 shrink-0">
          {SECTOR_LABELS[sector].split(" & ")[0]}
        </span>
        <span className="relative z-10 font-semibold truncate max-w-[120px] sm:max-w-none">{shortName}</span>
        
        <ChevronDown
          size={12}
          className={`relative z-10 text-muted transition-transform duration-300 ${open ? "rotate-180 text-brand" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute bottom-full left-0 mb-2.5 z-[var(--z-dropdown)] w-[355px] rounded-xl border border-line bg-surface-strong/95 backdrop-blur-xl shadow-xl overflow-hidden">
          {/* Header & Sector Context */}
          <div className="border-b border-line px-4.5 py-3.5 bg-surface/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={11} className="text-brand animate-pulse" /> Setor Ativo
              </span>
              <span className="rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-[9px] font-extrabold text-brand uppercase tracking-wider">
                {SECTOR_LABELS[sector]}
              </span>
            </div>

            {/* Premium Selector Tabs */}
            <div className="mt-3 flex gap-1 rounded-lg bg-surface p-1 border border-line">
              <button
                type="button"
                onClick={() => setFilter("recommended")}
                className={`flex-grow rounded-md py-1.5 text-center text-[11px] font-bold transition duration-300 ${
                  filter === "recommended"
                    ? "bg-brand text-neutral-950 shadow-md transform scale-[1.02]"
                    : "text-muted hover:text-foreground hover:bg-surface-strong"
                }`}
              >
                Recomendados ({recommendedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`flex-grow rounded-md py-1.5 text-center text-[11px] font-bold transition duration-300 ${
                  filter === "all"
                    ? "bg-brand text-neutral-950 shadow-md transform scale-[1.02]"
                    : "text-muted hover:text-foreground hover:bg-surface-strong"
                }`}
              >
                Todos ({AI_MODELS.length})
              </button>
            </div>
          </div>

          {/* Model list */}
          <div className="max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-line/45 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand/50 scrollbar-thin">
            {groups.length === 0 ? (
              <div className="px-4.5 py-8 text-center text-xs text-muted">
                Nenhum modelo recomendado neste setor. Mude para a aba &quot;Todos&quot;.
              </div>
            ) : (
              groups.map(({ provider, models }) => (
                <div key={provider}>
                  <div className="sticky top-0 bg-surface-strong/95 px-4.5 py-1.5 backdrop-blur-md border-b border-line z-10 flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-brand/85">
                      {provider}
                    </span>
                    <span className="text-[8px] font-mono text-muted/50">
                      {models.length} {models.length === 1 ? "modelo" : "modelos"}
                    </span>
                  </div>
                  <div className="pb-1">
                    {models.map((m) => {
                      const isSelected = m.id === selectedId;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => select(m.id)}
                          className={`flex w-full items-start gap-3.5 px-4.5 py-3.5 text-left transition-all duration-200 hover:bg-surface ${
                            isSelected 
                              ? "bg-brand/[0.04] border-l-2 border-brand" 
                              : "border-l-2 border-transparent"
                          }`}
                        >
                          {/* Left info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap leading-none">
                              <span className={`text-[12.5px] font-bold ${isSelected ? "text-brand" : "text-foreground"}`}>
                                {m.name}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide leading-none shrink-0 ${TIER_CLASS[m.tier]}`}
                              >
                                {TIER_ICON[m.tier]}
                                {TIER_LABELS[m.tier]}
                              </span>
                              {m.free ? (
                                <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide leading-none text-emerald-500 shrink-0">
                                  Grátis
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide leading-none text-amber-500 shrink-0">
                                  Pago
                                </span>
                              )}
                            </div>
                            <p className="mt-1.5 text-[11px] text-muted leading-relaxed line-clamp-2">{m.description}</p>

                            {/* Symmetrical Usage & Metadata integrated bar */}
                            <UsageBar modelId={m.id} contextK={m.contextK} modelFullId={m.id} />
                          </div>

                          {/* Checkmark */}
                          {isSelected && (
                            <Check size={14} className="mt-1 shrink-0 text-brand" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UsageBar({ modelId, contextK, modelFullId }: { modelId: string; contextK: number; modelFullId: string }) {
  const pct = getModelUsagePercent(modelId);
  const usage = getModelUsage(modelId);
  const limit = getModelDailyLimit(modelId);

  return (
    <div className="mt-2.5 border-t border-line/10 pt-2">
      <div className="flex items-center justify-between text-[9px] text-muted/65 font-mono mb-1 select-none">
        <span>{contextK}K ctx · {modelFullId.split("/")[1] || modelFullId}</span>
        <span className="font-extrabold text-brand">{usage.requests}/{limit} req ({Math.round(pct * 100)}%)</span>
      </div>
      <div className="h-1 w-full rounded-full bg-line/25 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand/60 to-brand transition-all duration-700 ease-out"
          style={{ width: `${Math.min(pct * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}
