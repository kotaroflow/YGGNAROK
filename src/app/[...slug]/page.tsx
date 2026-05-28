import { AppShell } from "@/components/app-shell";
import { findNavigationItem } from "@/lib/navigation";

export default async function ModuleFallbackPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const pathname = `/${slug.join("/")}`;
  const active = findNavigationItem(pathname);

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">{active?.group.title ?? "YGN V1"}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{active?.item.label ?? "Módulo"}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-stone-300">
          Este módulo está na navegação oficial da V1. Os fluxos já funcionais estão em Perfis, Criar conteúdo,
          Biblioteca, Postagem Manual e Jobs.
        </p>
      </main>
    </AppShell>
  );
}
