import Link from "next/link";
import { Bell, PenLine, Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface/80 px-4 pl-16 shadow-sm backdrop-blur-xl lg:pl-6">
      <form action="/busca" method="GET" className="relative hidden max-w-xl flex-1 items-center sm:flex">
        <Search className="pointer-events-none absolute left-3 text-muted" size={18} />
        <input
          name="q"
          className="h-10 w-full rounded-full border border-line bg-surface-strong pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted transition focus:border-brand/50 focus:ring-2 focus:ring-brand/15"
          placeholder="Buscar perfis, conteúdo, trabalhos e mídia"
          type="search"
        />
      </form>

      <Link
        href="/criar-conteudo"
        className="inline-flex h-9 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-neutral-950 transition hover:bg-brand-strong"
      >
        <PenLine size={16} />
        <span className="hidden sm:inline">Criar</span>
      </Link>

      <Link
        href="/sistema"
        className="grid size-9 place-items-center rounded-full border border-line bg-surface-strong text-muted transition hover:text-foreground"
        aria-label="Sistema"
        title="Sistema"
      >
        <Bell size={18} />
      </Link>
    </header>
  );
}
