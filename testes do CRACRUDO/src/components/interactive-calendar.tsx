"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar, ChevronLeft, ChevronRight, Plus, Clock, Award, Target,
  Zap, TrendingUp, AlertCircle
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────

interface ContentItem {
  id: string;
  profile_id: string;
  title: string;
  content_type: string;
  status: string;
  platform: string | null;
  idea: string | null;
  caption: string | null;
  hashtags: string[] | null;
  scheduled_for: string | null;
  created_at: string;
}

interface CommissionWeek {
  start: string;
  end: string;
  label: string;
  value: string;
}

interface DeliveryDay {
  date: string;
  label: string;
  type: "delivery" | "milestone" | "campaign" | "deadline";
}

interface ImportantDay {
  date: string;
  label: string;
  type: "launch" | "strategic" | "reminder" | "content";
}

// ─── Simulated Operations Data ───────────────────────────

const COMMISSION_WEEKS: CommissionWeek[] = [
  { start: "2026-06-01", end: "2026-06-07", label: "Campanha de Inverno", value: "R$ 8.000+" },
  { start: "2026-06-22", end: "2026-06-28", label: "Lançamento Coleção Esportiva", value: "R$ 12.000+" },
  { start: "2026-07-13", end: "2026-07-19", label: "Parceria Marca X", value: "R$ 15.000+" },
  { start: "2026-07-27", end: "2026-08-02", label: "Campanha de Midia", value: "R$ 6.000+" },
];

const DELIVERY_DAYS: DeliveryDay[] = [
  { date: "2026-06-05", label: "Entrega Cliente", type: "delivery" },
  { date: "2026-06-15", label: "Marco do Projeto", type: "milestone" },
  { date: "2026-07-01", label: "Lancamento Campanha", type: "campaign" },
  { date: "2026-07-20", label: "Prazo Final Relatorio", type: "deadline" },
  { date: "2026-08-10", label: "Entreza Projeto Beta", type: "delivery" },
];

const IMPORTANT_DAYS: ImportantDay[] = [
  { date: "2026-06-10", label: "Push de Conteudo", type: "content" },
  { date: "2026-06-18", label: "Reuniao Estrategica", type: "strategic" },
  { date: "2026-07-05", label: "Lancamento Produto", type: "launch" },
  { date: "2026-07-25", label: "Revisao Mensal", type: "reminder" },
  { date: "2026-08-01", label: "Meta de Vendas", type: "strategic" },
  { date: "2026-08-15", label: "Evento de Networking", type: "launch" },
];

// ─── Helpers ─────────────────────────────────────────────

function fmt(d: number, m: number, y: number): string {
  return `${y}-${(m + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
}

function isInCommissionWeek(day: number, month: number, year: number): CommissionWeek | null {
  const dateStr = fmt(day, month, year);
  return COMMISSION_WEEKS.find(w => dateStr >= w.start && dateStr <= w.end) || null;
}

function getDeliveryDay(day: number, month: number, year: number): DeliveryDay | null {
  const dateStr = fmt(day, month, year);
  return DELIVERY_DAYS.find(d => d.date === dateStr) || null;
}

function getImportantDay(day: number, month: number, year: number): ImportantDay | null {
  const dateStr = fmt(day, month, year);
  return IMPORTANT_DAYS.find(d => d.date === dateStr) || null;
}

function getMonthSummary(month: number, year: number, items: ContentItem[]): { total: number; deliveries: number; ideas: number; published: number } {
  const monthItems = items.filter(item => {
    if (!item.scheduled_for) return false;
    const d = new Date(item.scheduled_for);
    return d.getMonth() === month && d.getFullYear() === year;
  });
  return {
    total: monthItems.length,
    deliveries: monthItems.filter(i => i.status === "scheduled" || i.status === "in_progress").length,
    ideas: monthItems.filter(i => i.status === "idea").length,
    published: monthItems.filter(i => i.status === "published").length,
  };
}

function getMonthPersonality(month: number): { emoji: string; vibe: string } {
  const personalities = [
    { emoji: "🌀", vibe: "Renovacao" },
    { emoji: "💜", vibe: "Intuicao" },
    { emoji: "🌱", vibe: "Crescimento" },
    { emoji: "🔥", vibe: "Execucao" },
    { emoji: "💎", vibe: "Prosperidade" },
    { emoji: "☀️", vibe: "Expansao" },
    { emoji: "⚡", vibe: "Acao" },
    { emoji: "🌊", vibe: "Fluxo" },
    { emoji: "🍂", vibe: "Colheita" },
    { emoji: "🔮", vibe: "Visao" },
    { emoji: "🌌", vibe: "Reflexao" },
    { emoji: "❄️", vibe: "Finalizacao" },
  ];
  return personalities[month] ?? personalities[0];
}

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const monthNames = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// ─── Visual Tokens (VOID / AMBER) ────────────────────────

const TODAY_GLOW_VOID = "0 0 14px rgba(139,92,246,0.35), 0 0 28px rgba(139,92,246,0.12)";
const TODAY_GLOW_AMBER = "0 0 14px rgba(248, 195, 102,0.4), 0 0 28px rgba(248, 195, 102,0.15)";
const TODAY_PULSE_VOID = `
  @keyframes cal-today-pulse {
    0%, 100% { box-shadow: 0 0 10px rgba(139,92,246,0.25), 0 0 20px rgba(139,92,246,0.08); }
    50% { box-shadow: 0 0 18px rgba(139,92,246,0.4), 0 0 36px rgba(139,92,246,0.15); }
  }
`;
const TODAY_PULSE_AMBER = `
  @keyframes cal-today-pulse {
    0%, 100% { box-shadow: 0 0 10px rgba(248, 195, 102,0.3), 0 0 20px rgba(248, 195, 102,0.1); }
    50% { box-shadow: 0 0 18px rgba(248, 195, 102,0.45), 0 0 36px rgba(248, 195, 102,0.18); }
  }
`;

// ─── Main Component ──────────────────────────────────────

export function InteractiveCalendar({ initialContents }: { initialContents: ContentItem[] }) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contents, setContents] = useState<ContentItem[]>(initialContents);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [schedulingDate, setSchedulingDate] = useState<Date | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [previewDay, setPreviewDay] = useState<number | null>(null);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  // Month personality
  const monthVibe = getMonthPersonality(month);
  const monthSummary = getMonthSummary(month, year, contents);
  const totalCommValue = COMMISSION_WEEKS
    .filter(w => w.start.startsWith(`${year}-${(month + 1).toString().padStart(2, "0")}`))
    .reduce((acc, w) => acc + parseInt(w.value.replace(/\D/g, "")), 0);

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Grid generation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getItemsForDay = (day: number) => {
    return contents.filter(item => {
      if (!item.scheduled_for) return false;
      const d = new Date(item.scheduled_for);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const openPreview = (day: number, e: React.MouseEvent) => {
    const rect = gridRef.current?.getBoundingClientRect();
    if (rect) {
      setPreviewPos({
        x: Math.min(e.clientX - rect.left + 12, rect.width - 260),
        y: e.clientY - rect.top - 10,
      });
    }
    setPreviewDay(day);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8">
      {/* Inline calendar animations */}
      <style>{isDark ? TODAY_PULSE_AMBER : TODAY_PULSE_VOID}</style>

      {/* ── Header ───────────────────────────────────── */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">
            {monthVibe.emoji} Central de Operacoes
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            Calendario Estrategico
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} className="text-brand" />
              {monthSummary.total} itens agendados
            </span>
            {monthSummary.deliveries > 0 && (
              <span className="inline-flex items-center gap-1">
                <Target size={12} className="text-brand/70" />
                {monthSummary.deliveries} entregas
              </span>
            )}
            {totalCommValue > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <TrendingUp size={12} />
                R$ {(totalCommValue / 1000).toFixed(1)}k em comissoes
              </span>
            )}
            <span className="text-[10px] uppercase tracking-wider text-muted/60">
              {monthVibe.vibe}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSchedulingDate(new Date())}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white dark:text-neutral-950 transition hover:bg-brand-strong shadow-sm shadow-brand/20 shrink-0"
        >
          <Plus size={16} />
          Agendar Conteudo
        </button>
      </div>

      {/* ── Month Selector ────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-line bg-surface/80 p-3 shadow-sm backdrop-blur-sm">
        <button
          type="button"
          onClick={prevMonth}
          className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-strong hover:text-foreground"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-brand" />
          <div className="text-center">
            <span className="text-lg font-bold text-foreground">
              {monthNames[month]}
            </span>
            <span className="ml-2 text-sm font-medium text-muted">{year}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-strong hover:text-foreground"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Calendar Grid ─────────────────────────────── */}
      <div
        ref={gridRef}
        className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-sm"
      >
        {/* Month Atmosphere — subtle background depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/[0.02] via-transparent to-brand/[0.01] dark:from-violet-500/[0.03] dark:via-transparent dark:to-amber-500/[0.02]" />

        {/* Day-of-week header */}
        <div className="relative grid grid-cols-7 border-b border-line bg-surface-strong/30">
          {daysOfWeek.map((day) => (
            <div key={day} className="px-2 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="relative grid grid-cols-7 divide-x divide-y divide-line">
          {cells.map((day, i) => {
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            const commissionWeek = day ? isInCommissionWeek(day, month, year) : null;
            const deliveryDay = day ? getDeliveryDay(day, month, year) : null;
            const importantDay = day ? getImportantDay(day, month, year) : null;
            const dayItems = day ? getItemsForDay(day) : [];

            // Visual priority chain:
            // 1. Today      2. Delivery   3. Commission week   4. Important day   5. Normal

            return (
              <div
                key={i}
                onClick={() => {
                  if (day !== null) setSchedulingDate(new Date(year, month, day));
                }}
                onMouseEnter={(e) => {
                  if (day !== null && (dayItems.length > 0 || deliveryDay || importantDay)) {
                    openPreview(day, e);
                  }
                }}
                onMouseMove={(e) => {
                  if (day !== null && previewDay === day) {
                    const rect = gridRef.current?.getBoundingClientRect();
                    if (rect) setPreviewPos({ x: Math.min(e.clientX - rect.left + 12, rect.width - 260), y: e.clientY - rect.top - 10 });
                  }
                }}
                onMouseLeave={() => setPreviewDay(null)}
                className={`relative min-h-[110px] p-1.5 transition-all duration-200 flex flex-col cursor-pointer group
                  ${day === null ? "bg-surface-strong/10 opacity-30 cursor-default" : "bg-surface hover:bg-surface-strong/20 hover:shadow-inner"}
                  ${commissionWeek ? "" : ""}
                `}
              >
                {day !== null && (
                  <>
                    {/* Commission Week Background */}
                    {commissionWeek && (
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] via-transparent to-amber-500/[0.02] dark:from-violet-500/[0.07] dark:via-transparent dark:to-amber-500/[0.03]" />
                    )}

                    {/* Top row: date number + badges */}
                    <div className="relative flex items-center justify-between">
                      {/* Date Number */}
                      <span
                        className={`relative inline-flex size-7 items-center justify-center rounded-lg text-xs font-bold transition-all duration-300
                          ${isToday
                            ? "bg-brand text-white dark:text-neutral-950 shadow-[0_0_12px_rgba(139,92,246,0.3)] dark:shadow-[0_0_12px_rgba(248,195,102,0.35)] scale-105 z-10"
                            : deliveryDay
                            ? "text-amber-700 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-500/15 ring-1 ring-amber-500/30"
                            : importantDay
                            ? "text-foreground bg-surface-strong ring-1 ring-brand/20"
                            : commissionWeek
                            ? "text-foreground font-semibold"
                            : dayItems.length > 0
                            ? "text-sky-700 dark:text-sky-300 bg-sky-500/10 dark:bg-sky-700/20"
                            : "text-muted/80"
                          }
                          ${isToday ? "animate-[cal-today-pulse_3s_ease-in-out_infinite]" : ""}
                        `}
                        style={isToday ? { boxShadow: isDark ? TODAY_GLOW_AMBER : TODAY_GLOW_VOID } : {}}
                      >
                        {day}
                      </span>

                      {/* Delivery Badge — small corner marker */}
                      {deliveryDay && !isToday && (
                        <span className="shrink-0 flex items-center justify-center size-4 rounded-full bg-amber-500 dark:bg-amber-400 shadow-[0_0_6px_rgba(248, 195, 102,0.4)]" title={deliveryDay.label}>
                          <Award size={9} className="text-neutral-950" strokeWidth={3} />
                        </span>
                      )}
                    </div>

                    {/* Event Items */}
                    <div className="relative mt-1.5 space-y-0.5 flex-1 overflow-y-auto max-h-[60px]">
                      {dayItems.slice(0, 3).map((item) => {
                        const statusColor =
                          item.status === "idea" ? "border-slate-500/20 text-slate-500 dark:text-slate-400 bg-slate-500/5" :
                          item.status === "published" ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5" :
                          "border-brand/30 text-brand bg-brand/5";
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                            className={`w-full truncate text-[9px] font-semibold border rounded px-1 py-0.5 transition hover:brightness-125 ${statusColor}`}
                          >
                            {item.title}
                          </button>
                        );
                      })}
                      {dayItems.length > 3 && (
                        <div className="text-[8px] text-muted/60 font-semibold px-1">
                          +{dayItems.length - 3} mais
                        </div>
                      )}

                      {/* Empty state — ambient dots suggesting potential */}
                      {dayItems.length === 0 && !deliveryDay && !importantDay && !commissionWeek && (
                        <div className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-40 transition-opacity duration-300">
                          <span className="size-1 rounded-full bg-muted/30" />
                          <span className="size-1 rounded-full bg-muted/20" />
                        </div>
                      )}
                    </div>

                    {/* Important day ring indicator (subtle bottom border) */}
                    {importantDay && !isToday && !deliveryDay && (
                      <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-brand/30 via-brand/50 to-brand/30" />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Hover Preview Tooltip ─────────────────────── */}
      {previewDay !== null && (() => {
        const dayItems = getItemsForDay(previewDay);
        const delivery = getDeliveryDay(previewDay, month, year);
        const important = getImportantDay(previewDay, month, year);
        const dateStr = new Date(year, month, previewDay);

        return (
          <div
            className="fixed z-50 w-64 rounded-xl border border-line bg-surface-strong/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] p-3 pointer-events-none animate-fade-in"
            style={{ left: previewPos.x, top: previewPos.y }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground">
                {dateStr.toLocaleDateString("pt-BR", { weekday: "long" })}
              </span>
              <span className="text-[10px] font-semibold text-muted">
                {previewDay} de {monthNames[month]}
              </span>
            </div>

            {delivery && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 dark:bg-amber-500/15 px-2.5 py-1.5 mb-1.5 border border-amber-500/20">
                <Award size={12} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">{delivery.label}</span>
              </div>
            )}

            {important && !delivery && (
              <div className="flex items-center gap-2 rounded-lg bg-brand/10 px-2.5 py-1.5 mb-1.5 border border-brand/20">
                <AlertCircle size={12} className="text-brand shrink-0" />
                <span className="text-[11px] font-semibold text-foreground">{important.label}</span>
              </div>
            )}

            {commissionWeekFor(previewDay, month, year) && (
              <div className="flex items-center gap-2 rounded-lg bg-violet-500/10 dark:bg-violet-500/15 px-2.5 py-1.5 mb-1.5 border border-violet-500/20">
                <TrendingUp size={12} className="text-violet-600 dark:text-violet-400 shrink-0" />
                <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300">
                  {commissionWeekFor(previewDay, month, year)!.label} — {commissionWeekFor(previewDay, month, year)!.value}
                </span>
              </div>
            )}

            {dayItems.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted/70">
                  Conteudo ({dayItems.length})
                </p>
                {dayItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2 text-[11px] text-foreground/80">
                    <span className="size-1.5 rounded-full bg-brand/60 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </div>
                ))}
              </div>
            )}

            {dayItems.length === 0 && !delivery && !important && (
              <p className="text-[11px] text-muted/50 italic">Nenhum evento agendado</p>
            )}
          </div>
        );
      })()}

      {/* ── Item Detail Modal ─────────────────────────── */}
      {selectedItem && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand uppercase">
                  {selectedItem.status}
                </span>
                <h3 className="mt-2 text-lg font-bold text-foreground">{selectedItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-lg p-1 text-muted hover:bg-surface-strong hover:text-foreground transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted">
                <Clock size={14} className="text-brand" />
                <span>Agendado para: {selectedItem.scheduled_for ? new Date(selectedItem.scheduled_for).toLocaleDateString("pt-BR") : "Nao agendado"}</span>
              </div>
              <div className="rounded-lg border border-line bg-surface-strong p-3">
                <p className="text-xs font-semibold text-brand uppercase tracking-wider">Briefing / Ideia</p>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  {selectedItem.idea || "Sem briefing detalhado."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-lg border border-line bg-surface px-4 py-2 text-xs font-semibold hover:bg-surface-strong transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Scheduling Modal ──────────────────────────── */}
      {schedulingDate && (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-line bg-surface-overlay shadow-xl animate-in fade-in zoom-in-95 duration-150 relative overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-brand to-brand-strong" />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                    <Plus size={18} />
                    Novo Agendamento
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    <Clock size={12} className="inline mr-1" />
                    Para: {schedulingDate.toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSchedulingDate(null); setDraftTitle(""); setDraftNote(""); }}
                  className="rounded-lg p-1 text-muted hover:bg-surface-strong hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Titulo do conteudo ou lembrete..."
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface p-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
                <textarea
                  rows={4}
                  placeholder="Escreva a ideia, notas ou rascunho aqui..."
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  className="w-full resize-none rounded-lg border border-line bg-surface p-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push("/criar-conteudo")}
                  className="text-xs font-semibold text-muted hover:text-brand transition underline decoration-dashed underline-offset-4"
                >
                  Abrir no Estudio IA
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setSchedulingDate(null); setDraftTitle(""); setDraftNote(""); }}
                    className="rounded-lg border border-line bg-surface px-4 py-2 text-xs font-semibold text-muted hover:bg-surface-strong hover:text-foreground transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSaving(true);
                      setTimeout(() => {
                        if (schedulingDate) {
                          const newId = `post-it-${Date.now()}`;
                          const newItem: ContentItem = {
                            id: newId,
                            profile_id: "demo",
                            title: draftTitle,
                            content_type: "post-it",
                            status: "idea",
                            platform: "Instagram",
                            idea: draftNote || "Sem briefing detalhado.",
                            caption: null,
                            hashtags: null,
                            scheduled_for: schedulingDate.toISOString(),
                            created_at: new Date().toISOString()
                          };
                          setContents(prev => [newItem, ...prev]);
                        }
                        setIsSaving(false);
                        setSchedulingDate(null);
                        setDraftTitle("");
                        setDraftNote("");
                      }, 600);
                    }}
                    disabled={isSaving || !draftTitle.trim()}
                    className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white dark:text-neutral-950 transition hover:bg-brand-strong disabled:opacity-50"
                  >
                    {isSaving ? "Salvando..." : "Salvar Post-it"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Standalone helper for the tooltip (needs to be callable outside component scope)
function commissionWeekFor(day: number, month: number, year: number): CommissionWeek | null {
  const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  return COMMISSION_WEEKS.find(w => dateStr >= w.start && dateStr <= w.end) || null;
}
