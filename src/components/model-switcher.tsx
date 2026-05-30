"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Zap, Scale, Brain, Check } from "lucide-react";
import {
  AI_MODELS,
  type AIModel,
  type ModelTier,
  TIER_LABELS,
  loadSelectedModel,
  saveSelectedModel,
  getModel,
} from "@/lib/models";

const TIER_ICON: Record<ModelTier, React.ReactNode> = {
  fast: <Zap size={11} />,
  balanced: <Scale size={11} />,
  powerful: <Brain size={11} />,
};

const TIER_CLASS: Record<ModelTier, string> = {
  fast: "text-emerald-600 bg-emerald-50 border-emerald-200",
  balanced: "text-amber-600 bg-amber-50 border-amber-200",
  powerful: "text-purple-600 bg-purple-50 border-purple-200",
};

// Group models by provider
const PROVIDER_ORDER = ["OpenAI", "Anthropic", "Google", "Meta", "DeepSeek", "Mistral", "xAI (Grok)", "Qwen", "Perplexity", "Cohere", "Nous Research"];
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
  const [selectedId, setSelectedId] = useState(loadSelectedModel);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const model = getModel(selectedId);
  const groups = groupByProvider(AI_MODELS);

  // Sync with localStorage on mount
  useEffect(() => {
    setSelectedId(loadSelectedModel());
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
        <span className="font-medium">{shortName}</span>
        <ChevronDown
          size={11}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-[340px] rounded-xl border border-line bg-white/98 dark:bg-neutral-950/98 backdrop-blur-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-line px-4 py-3">
            <p className="text-[12px] font-semibold text-foreground">Selecionar modelo</p>
            <p className="text-[11px] text-muted mt-0.5">Powered by OpenRouter</p>
          </div>

          {/* Model list */}
          <div className="max-h-[380px] overflow-y-auto">
            {groups.map(({ provider, models }) => (
              <div key={provider}>
                <div className="sticky top-0 bg-surface/95 px-4 py-1.5 backdrop-blur-sm">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {provider}
                  </span>
                </div>
                <div className="pb-2">
                  {models.map((m) => {
                    const isSelected = m.id === selectedId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => select(m.id)}
                        className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition hover:bg-line/30 ${
                          isSelected ? "bg-brand/5" : ""
                        }`}
                      >
                        {/* Left info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[13px] font-medium ${isSelected ? "text-brand" : "text-foreground"}`}>
                              {m.name}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${TIER_CLASS[m.tier]}`}
                            >
                              {TIER_ICON[m.tier]}
                              {TIER_LABELS[m.tier]}
                            </span>
                            {m.free ? (
                              <span className="rounded-full border border-emerald-200/60 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                                Grátis
                              </span>
                            ) : (
                              <span className="rounded-full border border-amber-200/60 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400 font-semibold shadow-sm">
                                Pago
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-muted leading-relaxed">{m.description}</p>
                          <p className="mt-0.5 text-[10px] text-muted/70">{m.contextK}K ctx · {m.id}</p>
                        </div>

                        {/* Checkmark */}
                        {isSelected && (
                          <Check size={14} className="mt-0.5 shrink-0 text-brand" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
