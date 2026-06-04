import { AppShell } from "@/components/app-shell";
import { findNavigationItem } from "@/lib/navigation";

export default async function ModuleFallbackPage({ params, searchParams }: { params: Promise<{ slug: string[] }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { slug } = await params;
  await searchParams;
  const pathname = `/${slug.join("/")}`;
  const active = findNavigationItem(pathname);

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <p className="text-sm font-medium text-brand">{active?.group.title ?? "YGGNAROK"}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{active?.item.label ?? "Módulo"}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Este módulo está na navegação oficial do YGGNAROK. Os fluxos funcionais estão em Perfis, Criar conteúdo,
          Biblioteca, Postagem Manual e Trabalhos.
        </p>
      </main>
    </AppShell>
  );
}
