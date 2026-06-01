"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react";

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

const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function InteractiveCalendar({ initialContents }: { initialContents: ContentItem[] }) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contents, setContents] = useState<ContentItem[]>(initialContents);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [schedulingDate, setSchedulingDate] = useState<Date | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  // Navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar grid
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  // Filter content for this month/year
  const getItemsForDay = (day: number) => {
    return contents.filter(item => {
      if (!item.scheduled_for) return false;
      const d = new Date(item.scheduled_for);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Criação</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Calendário de Conteúdo</h1>
          <p className="mt-2 text-sm text-muted">Acompanhe seu fluxo de agendamentos e postagens.</p>
        </div>
        <button
          type="button"
          onClick={() => setSchedulingDate(new Date())}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-brand-strong"
        >
          <Plus size={16} />
          Agendar Conteúdo
        </button>
      </div>

      {/* Month Selector */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-line bg-surface p-4 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={prevMonth}
          className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-strong hover:text-foreground"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-brand" />
          <span className="text-lg font-semibold text-foreground">
            {monthNames[month]} {year}
          </span>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-strong hover:text-foreground"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm backdrop-blur">
        <div className="grid grid-cols-7 border-b border-line bg-surface-strong/30">
          {daysOfWeek.map((day) => (
            <div key={day} className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 divide-x divide-y divide-line">
          {cells.map((day, i) => {
            const isToday = 
              day === today.getDate() && 
              month === today.getMonth() && 
              year === today.getFullYear();
            
            const dayItems = day ? getItemsForDay(day) : [];

            return (
              <div
                key={i}
                onClick={() => {
                  if (day !== null) {
                    setSchedulingDate(new Date(year, month, day));
                  }
                }}
                className={`min-h-[110px] p-2 transition hover:bg-surface-strong/30 flex flex-col justify-between cursor-pointer ${
                  day === null ? "bg-surface-strong/10 opacity-30 cursor-default" : "bg-surface"
                }`}
              >
                {day !== null ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex size-6 items-center justify-center rounded-lg text-xs font-semibold ${
                          isToday
                            ? "bg-brand text-neutral-950 shadow-md ring-2 ring-brand/50"
                            : dayItems.length > 0
                            ? "text-sky-700 dark:text-sky-300 bg-sky-500/10 dark:bg-sky-700/20"
                            : "text-foreground"
                        }`}
                      >
                        {day}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 flex-1 overflow-y-auto max-h-[70px]">
                      {dayItems.map((item) => {
                        const statusColor = 
                          item.status === "idea" ? "border-slate-500/30 text-slate-400 bg-slate-500/5" :
                          item.status === "published" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" :
                          "border-brand/30 text-brand bg-brand/5";

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className={`w-full text-left truncate text-[10px] font-semibold border rounded px-1.5 py-0.5 transition hover:brightness-125 ${statusColor}`}
                          >
                            [{item.platform || "Multi"}] {item.title}
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Drawer / Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                {(() => {
                  const st = selectedItem.status;
                  const stColor = 
                    st === "idea" ? "bg-slate-500/10 text-slate-400 border border-slate-500/20" :
                    st === "published" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                    "bg-brand/10 text-brand border border-brand/20";
                  return (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${stColor}`}>
                      {st === "idea" ? "Ideia" : st === "published" ? "Publicado" : "Pendente"}
                    </span>
                  );
                })()}
                <h3 className="mt-2 text-lg font-bold text-foreground">{selectedItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="rounded-lg p-1 text-muted hover:bg-surface-strong hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted">
                <Clock size={14} className="text-brand" />
                <span>Agendado para: {selectedItem.scheduled_for ? new Date(selectedItem.scheduled_for).toLocaleDateString("pt-BR") : "Não agendado"}</span>
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
                className="rounded-lg border border-line bg-surface px-4 py-2 text-xs font-semibold hover:bg-surface-strong"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draft "Sticky Note" Modal (Void & Amber Style) */}
      {schedulingDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-line bg-surface shadow-xl animate-in fade-in zoom-in-95 duration-150 relative overflow-hidden">
            {/* Top accent bar (Sticky Note aesthetic) */}
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
                  onClick={() => {
                    setSchedulingDate(null);
                    setDraftTitle("");
                    setDraftNote("");
                  }}
                  className="rounded-lg p-1 text-muted hover:bg-surface-strong hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título do conteúdo ou lembrete..."
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface-strong p-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
                
                <textarea
                  rows={4}
                  placeholder="Escreva a ideia, notas ou rascunho aqui..."
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  className="w-full resize-none rounded-lg border border-line bg-surface-strong p-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
                />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push("/criar-conteudo")}
                  className="text-xs font-semibold text-muted hover:text-brand transition underline decoration-dashed underline-offset-4"
                >
                  Abrir no Estúdio IA
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSchedulingDate(null);
                      setDraftTitle("");
                      setDraftNote("");
                    }}
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
                    className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-neutral-950 transition hover:bg-brand-strong disabled:opacity-50"
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
