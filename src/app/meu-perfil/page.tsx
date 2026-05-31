import { User, Mail, Shield, Key, Bell, Palette, Globe } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentPermissionContext } from "@/server/permissions/context";
import { BackButton } from "@/components/back-button";
 
const sections = [
  { id: "perfil", label: "Perfil", icon: User, description: "Nome, avatar e informações pessoais" },
  { id: "email", label: "E-mail", icon: Mail, description: "E-mail e verificação de conta" },
  { id: "seguranca", label: "Segurança", icon: Shield, description: "Senha e autenticação" },
  { id: "api", label: "Chaves de API", icon: Key, description: "OpenRouter, Supabase e integrações" },
  { id: "notificacoes", label: "Notificações", icon: Bell, description: "Preferências de alertas" },
  { id: "aparencia", label: "Aparência", icon: Palette, description: "Tema, cores e layout" },
  { id: "idioma", label: "Idioma", icon: Globe, description: "Idioma e região" },
];
 
export default async function MeuPerfilPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const permissions = await getCurrentPermissionContext();

  const email = user?.email ?? "visitante@yggnarok.com";
  const initial = email.charAt(0).toUpperCase();
  const isOwner = permissions?.roles.includes("owner");
  const plan = isOwner ? "Plano Premium / Admin" : "Plano Free / Colaborador";

  return (
    <AppShell>
      <main className="min-h-screen text-foreground">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:px-8">
          <BackButton />
          {/* Header with avatar */}
          <div className="mb-8 flex items-center gap-5">
            <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand text-2xl font-bold text-neutral-950">
              {initial}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
              <p className="mt-1 text-sm text-muted">{email} · {plan}</p>
            </div>
          </div>

          {/* Settings sections */}
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className="group flex w-full items-center gap-4 rounded-xl border border-line bg-surface p-5 text-left shadow-sm backdrop-blur transition hover:border-brand/30 hover:shadow-md"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand/20">
                  <section.icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{section.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{section.description}</p>
                </div>
                <svg className="size-4 shrink-0 text-muted transition group-hover:text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          {/* Danger zone */}
          <div className="mt-10 rounded-xl border border-red-200/50 bg-red-50/50 p-6 dark:border-red-900/30 dark:bg-red-950/20">
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">Zona de perigo</h3>
            <p className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
              Ações irreversíveis. Tenha certeza antes de prosseguir.
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              Excluir minha conta
            </button>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
