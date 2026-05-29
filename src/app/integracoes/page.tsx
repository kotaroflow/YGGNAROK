import Link from "next/link";
import { Plug, Camera, Video, MessageCircle, Globe, ArrowUpRight, Check, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const integrations = [
  { id: "openrouter", name: "OpenRouter", description: "Modelos de IA (LLaMA, GPT, Claude)", icon: Plug, status: "connected" as const, color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { id: "supabase", name: "Supabase", description: "Banco de dados e autenticação", icon: Globe, status: "connected" as const, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: "cloudflare-r2", name: "Cloudflare R2", description: "Armazenamento de mídia", icon: Globe, status: "disconnected" as const, color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  { id: "instagram", name: "Instagram", description: "Publicação automática de conteúdo", icon: Camera, status: "disconnected" as const, color: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
  { id: "youtube", name: "YouTube", description: "Upload e gerenciamento de vídeos", icon: Video, status: "disconnected" as const, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  { id: "twitter", name: "X (Twitter)", description: "Posts e threads automatizados", icon: MessageCircle, status: "disconnected" as const, color: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { id: "whatsapp", name: "WhatsApp Business", description: "Automação de mensagens", icon: MessageCircle, status: "disconnected" as const, color: "bg-green-500/10 text-green-600 dark:text-green-400" },
];

export default function IntegracoesPage() {
  return (
    <AppShell>
      <main className="min-h-screen text-foreground">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand">Sistema</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Integrações</h1>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Conecte APIs, redes sociais e serviços externos ao seu workspace.
            </p>
          </div>

          {/* Status overview */}
          <div className="mb-8 flex gap-4">
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500" />
              {integrations.filter(i => i.status === "connected").length} conectadas
            </div>
            <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-muted">
              <span className="size-2 rounded-full bg-muted" />
              {integrations.filter(i => i.status === "disconnected").length} disponíveis
            </div>
          </div>

          {/* Integration cards */}
          <div className="space-y-3">
            {integrations.map((integration) => (
              <div
                key={integration.id}
                className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-5 shadow-sm backdrop-blur transition hover:border-brand/30 hover:shadow-md"
              >
                <div className={`grid size-12 shrink-0 place-items-center rounded-xl ${integration.color}`}>
                  <integration.icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{integration.name}</p>
                    {integration.status === "connected" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Check size={10} /> Conectado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-strong px-2 py-0.5 text-[10px] font-semibold text-muted">
                        <AlertCircle size={10} /> Desconectado
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{integration.description}</p>
                </div>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    integration.status === "connected"
                      ? "border border-line text-muted hover:text-foreground"
                      : "bg-brand text-neutral-950 hover:bg-brand-strong"
                  }`}
                >
                  {integration.status === "connected" ? "Gerenciar" : "Conectar"}
                  <ArrowUpRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
