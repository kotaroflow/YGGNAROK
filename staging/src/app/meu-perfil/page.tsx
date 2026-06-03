import { AppShell } from "@/components/app-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentPermissionContext } from "@/server/permissions/context";
import { MeuPerfilClient } from "./client";

export default async function MeuPerfilPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  let user = null;
  try {
    const supabase = await createSupabaseServerClient();
    const res = await supabase.auth.getUser();
    user = res.data.user;
  } catch (err) {
    // Graceful local development fallback
  }

  const permissions = await getCurrentPermissionContext();
  const email = permissions?.email ?? user?.email ?? "visitante@yggnarok.com";
  const initial = email.charAt(0).toUpperCase();
  const isOwner = permissions?.roles.includes("owner");
  const plan = isOwner ? "Plano Premium / Admin" : "Plano Free / Colaborador";

  return (
    <AppShell>
      <MeuPerfilClient email={email} initial={initial} plan={plan} />
    </AppShell>
  );
}
