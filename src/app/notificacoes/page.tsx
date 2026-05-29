import { Bell, Check, MessageSquare, AlertTriangle, Info, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const mockNotifications = [
  { id: "1", type: "info" as const, title: "Bem-vindo ao YGGNAROK", message: "Seu workspace foi criado com sucesso. Explore as ferramentas de criação.", time: "agora", read: false },
  { id: "2", type: "success" as const, title: "Deploy concluído", message: "A versão mais recente foi publicada na Vercel.", time: "2min", read: false },
  { id: "3", type: "warning" as const, title: "API Key ausente", message: "Configure OPENROUTER_API_KEY para ativar respostas reais da IA.", time: "1h", read: true },
];

const iconMap = {
  info: Info,
  success: Check,
  warning: AlertTriangle,
  message: MessageSquare,
};

const colorMap = {
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  message: "bg-brand/10 text-brand",
};

export default function NotificacoesPage() {
  return (
    <AppShell>
      <main className="min-h-screen text-foreground">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Sistema</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Notificações</h1>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted transition hover:text-foreground"
            >
              <Check size={14} />
              Marcar todas como lidas
            </button>
          </div>

          <div className="space-y-2">
            {mockNotifications.map((notif) => {
              const Icon = iconMap[notif.type];
              return (
                <div
                  key={notif.id}
                  className={`group flex items-start gap-4 rounded-xl border p-4 shadow-sm backdrop-blur transition hover:shadow-md ${
                    notif.read
                      ? "border-line bg-surface/50"
                      : "border-brand/20 bg-surface"
                  }`}
                >
                  <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${colorMap[notif.type]}`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{notif.title}</p>
                      {!notif.read && <span className="size-2 rounded-full bg-brand" />}
                    </div>
                    <p className="mt-1 text-sm text-muted">{notif.message}</p>
                    <p className="mt-2 text-xs text-muted">{notif.time}</p>
                  </div>
                  <button
                    type="button"
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-muted opacity-0 transition hover:bg-surface-strong hover:text-red-500 group-hover:opacity-100"
                    title="Descartar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {mockNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-brand/10 text-brand">
                <Bell size={28} />
              </div>
              <h2 className="mt-5 text-lg font-semibold">Tudo tranquilo</h2>
              <p className="mt-2 text-sm text-muted">Nenhuma notificação no momento.</p>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
