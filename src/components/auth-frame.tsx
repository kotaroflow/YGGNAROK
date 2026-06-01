import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import type { AuthArt } from "@/lib/auth-art";
import { ThemeToggle } from "./theme-toggle";

export function AuthFrame({
  title,
  description,
  error,
  status,
  action,
  buttonLabel,
  footerLabel,
  footerHref,
  footerAction,
  art,
  variant = "login",
}: {
  title: string;
  description: string;
  error?: string;
  status?: string;
  action: (formData: FormData) => void | Promise<void>;
  buttonLabel: string;
  footerLabel: string;
  footerHref: string;
  footerAction: string;
  art: AuthArt;
  variant?: "login" | "cadastro";
}) {
  const backgroundStyle = {
    "--auth-from": art.from,
    "--auth-mid": art.mid,
    "--auth-to": art.to,
    "--auth-panel": art.panel,
    "--auth-focus": art.focus,
  } as CSSProperties;

  return (
    <main
      style={backgroundStyle}
      className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--auth-panel)] px-4 py-8 text-slate-950 dark:text-stone-50"
    >
      <div className="pointer-events-none fixed inset-0">
        <Image
          src={art.backgroundSrc}
          alt=""
          fill
          priority
          quality={60}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
          className="scale-[1.02] object-cover opacity-[0.58] saturate-110"
          style={{ objectPosition: "var(--auth-focus)" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,color-mix(in_srgb,var(--auth-to)_30%,transparent)_0%,transparent_32%),linear-gradient(120deg,color-mix(in_srgb,var(--auth-from)_70%,black)_0%,color-mix(in_srgb,var(--auth-mid)_42%,transparent)_48%,color-mix(in_srgb,var(--auth-to)_46%,white)_100%)] opacity-[0.72]" />
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-white/12 dark:bg-black/32" />
      </div>

      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <section className="relative z-10 grid w-full max-w-7xl overflow-hidden rounded-[30px] border border-white/80 bg-white/78 p-3 shadow-[0_32px_90px_rgba(22,16,36,0.28)] backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/74 lg:min-h-[560px] lg:grid-cols-[0.76fr_1.34fr]">
        <div className="flex items-center px-6 py-10 sm:px-10 lg:px-12 xl:px-14">
          <form action={action} className="w-full max-w-md">
            <div className={`mb-9 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${
              variant === "cadastro"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-200"
                : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200"
            }`}>
              <ShieldCheck size={14} />
              {variant === "cadastro" ? "YGGNAROK / Novo Acesso" : "YGGNAROK / YGN V1"}
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{description}</p>

            {error ? <p className="mt-5 rounded-2xl bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">{error}</p> : null}
            {status ? <p className="mt-5 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">{status}</p> : null}

            <label className="mt-8 block text-sm font-medium text-slate-700 dark:text-stone-200">
              E-mail
              <span className="relative mt-2 block">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="email" type="email" required placeholder="name@email.com" className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/40 dark:border-white/10 dark:bg-neutral-900/70 dark:text-stone-100 dark:focus:ring-amber-900/20" />
              </span>
            </label>

            <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-stone-200">
              Senha
              <span className="relative mt-2 block">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input name="password" type="password" required minLength={8} placeholder="********" className="h-12 w-full rounded-2xl border border-slate-200 bg-white/80 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-amber-300 focus:ring-4 focus:ring-amber-200/40 dark:border-white/10 dark:bg-neutral-900/70 dark:text-stone-100 dark:focus:ring-amber-900/20" />
              </span>
            </label>

            <button
              type="submit"
              className={`mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 ${
                variant === "cadastro"
                  ? "bg-[linear-gradient(100deg,#0ea872_0%,#2ca86b_38%,#2c7be8_100%)] shadow-emerald-400/20"
                  : "bg-[linear-gradient(100deg,#f8d40d_0%,#e2c73b_38%,#4a7be8_100%)] shadow-blue-400/20"
              }`}
            >
              {buttonLabel}
              <ArrowRight size={17} />
            </button>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-stone-300">
              {footerLabel} <Link className="font-medium text-amber-700 dark:text-amber-300" href={footerHref}>{footerAction}</Link>
            </p>
          </form>
        </div>

        <aside className="relative hidden min-h-[536px] lg:block">
          <div className="relative h-full overflow-hidden rounded-[24px] bg-[var(--auth-panel)] shadow-[inset_0_0_90px_rgba(0,0,0,0.30)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,transparent_0%,transparent_45%,rgba(0,0,0,0.28)_100%)]" />
            <Image
              src={art.src}
              alt="Arte visual YGGNAROK"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 0vw"
              className="object-cover object-[var(--auth-focus)]"
              style={{ objectPosition: "var(--auth-focus)" }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/20" />
          </div>
        </aside>
      </section>
    </main>
  );
}
