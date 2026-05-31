import { AppShell } from "@/components/app-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentPermissionContext } from "@/server/permissions/context";
import { MeuPerfilClient } from "./client";

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
      <MeuPerfilClient email={email} initial={initial} plan={plan} />
    </AppShell>
  );
}
