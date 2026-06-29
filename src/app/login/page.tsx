import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getRandomAuthArt } from "@/lib/auth-art";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse o YGGNAROK — gerencie perfis, trabalhos de IA, biblioteca e fila de postagem num workspace premium.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const params = await searchParams;
  const art = getRandomAuthArt();

  return (
    <AuthShell art={art}>
      <LoginForm error={params.error} status={params.status} />
    </AuthShell>
  );
}
