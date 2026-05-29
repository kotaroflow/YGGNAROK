import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export default function CalendarioPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const cells = generateCalendarDays(year, month);

  return (
    <AppShell>
      <main className="min-h-screen text-foreground">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Criação</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Calendário de Conteúdo</h1>
              <p className="mt-2 text-sm text-muted">Planeje e visualize suas postagens e campanhas.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-brand-strong"
            >
              <Plus size={16} />
              Agendar postagem
            </button>
          </div>

          {/* Month navigation */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-line bg-surface p-4 shadow-sm backdrop-blur">
            <button type="button" className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-strong hover:text-foreground">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-brand" />
              <span className="text-lg font-semibold">{monthNames[month]} {year}</span>
            </div>
            <button type="button" className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-strong hover:text-foreground">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm backdrop-blur">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-line">
              {days.map((day) => (
                <div key={day} className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7">
              {cells.map((day, i) => (
                <div
                  key={i}
                  className={`min-h-[100px] border-b border-r border-line p-2 transition hover:bg-surface-strong ${
                    day === null ? "bg-surface-strong/30" : ""
                  }`}
                >
                  {day !== null && (
                    <>
                      <span className={`inline-flex size-7 items-center justify-center rounded-lg text-sm font-medium ${
                        day === today ? "bg-brand text-neutral-950" : "text-foreground"
                      }`}>
                        {day}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
