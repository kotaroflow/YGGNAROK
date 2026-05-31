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
} from "@/lib/models";

const TIER_ICON: Record<ModelTier, React.ReactNode> = {
  fast: <Zap size={11} />,
  balanced: <Scale size={11} />,
  powerful: <Brain size={11} />,
};

const TIER_CLASS: Record<ModelTier, string> = {
  fast: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800/50",
  balanced: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800/50",
  powerful: "text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-950/30 dark:border-purple-800/50",
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
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"recommended" | "all">("recommended");
  const menuRef = useRef<HTMLDivElement>(null);
  
  const model = getModel(selectedId);

  // Compute filtered models
  const filteredModels = filter === "recommended"
    ? AI_MODELS.filter((m) => m.sectors.includes(sector))
    : AI_MODELS;

  const recommendedCount = AI_MODELS.filter((m) => m.sectors.includes(sector)).length;
  const groups = groupByProvider(filteredModels);

  // Sync with localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedId(loadSelectedModel());
    }, 0);
    return () => clearTimeout(timer);
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
        className={`flex items-center gap-1.5 rounded-full border transition ${
          compact
            ? "px-3 py-1.5 text-[12px]"
            : "px-3 py-2 text-[13px]"
        } ${
          open
            ? "border-brand/40 bg-brand/8 text-brand"
            : "border-line bg-surface/80 text-foreground hover:border-brand/30 hover:bg-brand/5"
        }`}
      >
        <span className="font-mono text-[9px] uppercase tracking-wider text-brand font-bold bg-brand/10 px-1.5 py-0.5 rounded border border-brand/20 shrink-0">
          {SECTOR_LABELS[sector].split(" & ")[0]}
        </span>
        <span className="font-medium truncate max-w-[120px] sm:max-w-none">{shortName}</span>
        <ChevronDown
          size={11}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-[350px] rounded-xl border border-line bg-white/98 dark:bg-neutral-950/98 backdrop-blur-xl shadow-xl overflow-hidden">
          {/* Header & Sector Context */}
          <div className="border-b border-line px-4 py-3 bg-surface-strong/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-brand" /> Setor Ativo
              </span>
              <span className="rounded-full bg-brand/15 border border-brand/25 px-2 py-0.5 text-[10px] font-extrabold text-brand uppercase tracking-wider">
                {SECTOR_LABELS[sector]}
              </span>
            </div>

            {/* Premium Selector Tabs */}
            <div className="mt-3 flex gap-1 rounded-lg bg-black/10 dark:bg-black/30 p-0.5 border border-line/40">
              <button
                type="button"
                onClick={() => setFilter("recommended")}
                className={`flex-grow rounded-md py-1.5 text-center text-[11px] font-bold transition duration-200 ${
                  filter === "recommended"
                    ? "bg-brand text-neutral-950 shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Recomendados ({recommendedCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`flex-grow rounded-md py-1.5 text-center text-[11px] font-bold transition duration-200 ${
                  filter === "all"
                    ? "bg-brand text-neutral-950 shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Todos ({AI_MODELS.length})
              </button>
            </div>
          </div>

          {/* Model list */}
          <div className="max-h-[340px] overflow-y-auto">
            {groups.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-muted">
                Nenhum modelo recomendado neste setor. Mude para a aba &quot;Todos&quot;.
              </div>
            ) : (
              groups.map(({ provider, models }) => (
                <div key={provider}>
                  <div className="sticky top-0 bg-surface/95 dark:bg-neutral-900/95 px-4 py-1.5 backdrop-blur-sm border-b border-line/30">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted">
                      {provider}
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
                          className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition hover:bg-line/30 dark:hover:bg-white/5 ${
                            isSelected ? "bg-brand/5 dark:bg-brand/5 border-l-2 border-brand" : ""
                          }`}
                        >
                          {/* Left info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[12.5px] font-semibold ${isSelected ? "text-brand" : "text-foreground"}`}>
                                {m.name}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold ${TIER_CLASS[m.tier]}`}
                              >
                                {TIER_ICON[m.tier]}
                                {TIER_LABELS[m.tier]}
                              </span>
                              {m.free ? (
                                <span className="rounded-full border border-emerald-200/50 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                                  Grátis
                                </span>
                              ) : (
                                <span className="rounded-full border border-amber-200/50 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 shadow-sm">
                                  Pago
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[11px] text-muted leading-relaxed line-clamp-2">{m.description}</p>
                            <p className="mt-1 text-[9px] text-muted/70 font-mono">{m.contextK}K ctx · {m.id}</p>
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
