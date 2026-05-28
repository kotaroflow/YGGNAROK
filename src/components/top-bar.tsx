import Link from "next/link";
import { Bell, CircleUserRound, PenLine, Search } from "lucide-react";
import { signOut } from "@/server/actions/auth";
import { ThemeToggle } from "./theme-toggle";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-black/5 bg-white/72 px-4 pl-16 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/72 lg:pl-6">
      <label className="relative hidden max-w-xl flex-1 items-center sm:flex">
        <Search className="pointer-events-none absolute left-3 text-slate-400" size={18} />
        <input
          className="h-10 w-full rounded-full border border-slate-200/80 bg-white/80 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 transition focus:border-amber-300 focus:ring-4 focus:ring-amber-200/35 dark:border-white/10 dark:bg-neutral-900/75 dark:text-stone-100 dark:focus:ring-amber-900/20"
          placeholder="Buscar perfis, conteudo, jobs e midia"
          type="search"
        />
      </label>

      <Link
        href="/criar-conteudo"
        className="inline-flex h-10 items-center gap-2 rounded-full bg-amber-300 px-4 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-amber-200"
      >
        <PenLine size={17} />
        <span className="hidden sm:inline">Criar</span>
      </Link>

      <Link
        href="/alertas"
        className="grid size-10 place-items-center rounded-full border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-900/75 dark:text-stone-200"
        aria-label="Avisos"
        title="Avisos"
      >
        <Bell size={19} />
      </Link>

      <ThemeToggle compact />

      <form action={signOut}>
        <button
          type="submit"
          className="grid size-10 place-items-center rounded-full border border-slate-200/80 bg-white/80 text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-900/75 dark:text-stone-200"
          aria-label="Sair"
          title="Sair"
        >
          <CircleUserRound size={20} />
        </button>
      </form>
    </header>
  );
}
