import { AuthFrame } from "@/components/auth-frame";
import { getRandomAuthArt } from "@/lib/auth-art";
import { signUp } from "@/server/actions/auth";

export const dynamic = "force-dynamic";

export default async function CadastroPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const art = getRandomAuthArt();

  return (
    <AuthFrame
      title="Criar conta"
      description="A V1 cria seu workspace inicial automaticamente e protege os dados com Supabase Auth e RLS."
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
  if (error) return "Nao foi possivel criar a conta.";
  return undefined;
}
