import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth-frame";
import { getRandomAuthArt } from "@/lib/auth-art";
import { signUp } from "@/server/actions/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Criar Conta",
  description: "Crie seu workspace YGGNAROK com segurança via Supabase Auth e RLS. Gerencie conteúdo, IA e vendas num só lugar.",
};

export default async function CadastroPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const art = getRandomAuthArt();

  return (
    <AuthFrame
      variant="cadastro"
      title="Criar conta"
      description="Seu workspace é criado automaticamente com segurança via Supabase Auth e RLS."
      error={getCadastroError(params.error)}
      action={signUp}
      buttonLabel="Criar conta"
      footerLabel="Ja tem acesso?"
      footerHref="/login"
      footerAction="Entrar"
      art={art}
    />
  );
}

function getCadastroError(error?: string) {
  if (error === "validacao") return "Use um e-mail valido e uma senha com pelo menos 8 caracteres.";
  if (error === "cadastro") return "Nao foi possivel criar a conta. Tente entrar se esse e-mail ja foi cadastrado.";
  if (error === "configuracao") return "Configuracao do Supabase indisponivel neste ambiente.";
  if (error) return "Nao foi possivel criar a conta.";
  return undefined;
}
