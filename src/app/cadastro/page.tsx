import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { CadastroForm } from "@/components/auth/cadastro-form";
import { getRandomAuthArt } from "@/lib/auth-art";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie seu workspace YGGNAROK com segurança via Supabase Auth e RLS. Gerencie conteúdo, IA e vendas num só lugar.",
};

export default async function CadastroPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const art = getRandomAuthArt();

  return (
    <AuthShell art={art}>
      <CadastroForm error={params.error} />
    </AuthShell>
  );
}
