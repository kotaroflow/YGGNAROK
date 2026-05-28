import { AuthFrame } from "@/components/auth-frame";
import { getRandomAuthArt } from "@/lib/auth-art";
import { signIn } from "@/server/actions/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const params = await searchParams;
  const art = getRandomAuthArt();

  return (
    <AuthFrame
      title="Entrar"
      description="Acesse seus perfis, jobs de IA, biblioteca, midias e fila de postagem manual."
      error={getLoginError(params.error)}
      status={getLoginStatus(params.status)}
      action={signIn}
      buttonLabel="Entrar"
      footerLabel="Ainda sem acesso?"
      footerHref="/cadastro"
      footerAction="Criar conta"
      art={art}
    />
  );
}

function getLoginError(error?: string) {
  if (error === "validacao") return "Informe um e-mail valido e uma senha com pelo menos 8 caracteres.";
  if (error === "credenciais") return "E-mail ou senha incorretos.";
  if (error === "sessao") return "Entre na sua conta para acessar o YGGNAROK.";
  if (error === "configuracao") return "Configuracao do Supabase indisponivel neste ambiente.";
  if (error) return "Nao foi possivel entrar agora.";
  return undefined;
}

function getLoginStatus(status?: string) {
  if (status === "confirmar-email") return "Conta criada. Confirme seu e-mail antes de entrar, se o Supabase pedir confirmacao.";
  if (status) return "Conta criada. Entre para continuar o setup automatico.";
  return undefined;
}
