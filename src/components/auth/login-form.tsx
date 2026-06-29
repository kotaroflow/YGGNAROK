import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { signIn } from "@/server/actions/auth";

export function LoginForm({
  error,
  status,
}: {
  error?: string;
  status?: string;
}) {
  return (
    <form action={signIn} className="w-full max-w-md">
      <div className="mb-9 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 shadow-sm dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200">
        <ShieldCheck size={14} />
        YGGNAROK / YGN V1
      </div>

      <h1 className="text-4xl font-semibold tracking-tight text-text-primary">Entrar</h1>
      <p className="mt-4 max-w-sm text-sm leading-6 text-text-muted">
        Acesse seus perfis, trabalhos de IA, biblioteca e fila de postagem.
      </p>

      {error ? <p className="mt-5 rounded-2xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">{getLoginError(error)}</p> : null}
      {status ? <p className="mt-5 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">{getLoginStatus(status)}</p> : null}

      <label className="mt-8 block text-sm font-medium text-text-secondary">
        E-mail
        <span className="relative mt-2 block">
          <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input name="email" type="email" required placeholder="name@email.com" className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-sm text-on-surface shadow-sm outline-none transition placeholder:text-text-muted focus:border-focus-ring focus:ring-4 focus:ring-focus-ring/40 dark:border-white/10 dark:bg-neutral-900/70 dark:focus:ring-focus-ring/20" />
        </span>
      </label>

      <label className="mt-5 block text-sm font-medium text-text-secondary">
        Senha
        <span className="relative mt-2 block">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input name="password" type="password" required minLength={8} placeholder="********" className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-sm text-on-surface shadow-sm outline-none transition placeholder:text-text-muted focus:border-focus-ring focus:ring-4 focus:ring-focus-ring/40 dark:border-white/10 dark:bg-neutral-900/70 dark:focus:ring-focus-ring/20" />
        </span>
      </label>

      <button
        type="submit"
        className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(100deg,#f8d40d_0%,#e2c73b_38%,#4a7be8_100%)] px-4 text-sm font-semibold text-white shadow-lg shadow-blue-400/20 transition hover:brightness-105"
      >
        Entrar
        <ArrowRight size={17} />
      </button>

      <p className="mt-6 text-center text-sm text-text-muted">
        Ainda sem acesso? <Link className="font-medium text-amber-700 dark:text-amber-300" href="/cadastro">Criar conta</Link>
      </p>
    </form>
  );
}

function getLoginError(error: string) {
  if (error === "validacao") return "Informe um e-mail valido e uma senha com pelo menos 8 caracteres.";
  if (error === "credenciais") return "E-mail ou senha incorretos.";
  if (error === "sessao") return "Entre na sua conta para acessar o YGGNAROK.";
  if (error === "configuracao") return "Configuracao do Supabase indisponivel neste ambiente.";
  return "Nao foi possivel entrar agora.";
}

function getLoginStatus(status: string) {
  if (status === "confirmar-email") return "Conta criada. Confirme seu e-mail antes de entrar, se o Supabase pedir confirmacao.";
  return "Conta criada. Entre para continuar o setup automatico.";
}
