import { AppShell } from "@/components/app-shell";
import { getDeletedLibraryItems } from "@/server/data/dashboard";
import { AlertTriangle } from "lucide-react";
import { TrashListClient } from "@/components/trash-list-client";

const MOCK_NOW = Date.now();
const MOCK_FALLBACKS = [
  { id: "mock-1", title: "Roteiro Antigo - Vendas Exponenciais", type: "Roteiro", body: "Roteiro focado em gerar escassez imediata com gatilhos de copy do YGGNAROK.", deleted_at: new Date(MOCK_NOW - 86400000 * 2).toISOString() },
  { id: "mock-2", title: "Pauta de Conteúdo: Inteligência Artificial no Cotidiano", type: "Ideia", body: "Uma pauta abordando como a IA otimiza tarefas diárias e maximiza escala nos negócios.", deleted_at: new Date(MOCK_NOW - 86400000 * 5).toISOString() },
];

export default async function LixeiraInteligentePage() {
  const deletedItems = await getDeletedLibraryItems();

  const displayItems = deletedItems.length > 0 
    ? deletedItems.map(item => ({
        id: item.id,
        title: item.title,
        type: item.type,
        body: item.body || "",
        deleted_at: item.deleted_at || new Date().toISOString(),
        isMock: false
      }))
    : MOCK_FALLBACKS.map(item => ({
        ...item,
        isMock: true
      }));

  return (
    <AppShell>
      <main className="min-h-screen text-foreground relative overflow-hidden bg-radial-gradient">
        {/* Ambient glows */}
        <div className="absolute top-0 right-1/4 size-96 rounded-full bg-brand/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 size-80 rounded-full bg-red-900/5 blur-3xl pointer-events-none" />

        <div className="mx-auto w-full max-w-4xl px-4 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-brand" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Governança</p>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
              Lixeira Inteligente
            </h1>
            <p className="mt-2 text-sm text-muted">
              Recupere materiais descartados ou delete-os permanentemente da nuvem.
            </p>
          </div>

          {/* Retention Alert Box */}
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-sm backdrop-blur">
            <AlertTriangle className="size-5 shrink-0 text-amber-500 mt-0.5" />
            <div className="text-xs leading-relaxed text-amber-600 dark:text-amber-400">
              <span className="font-bold">Política de Retenção:</span> Os arquivos removidos permanecem nesta lixeira por até <span className="font-bold">30 dias</span> antes de serem eliminados de forma definitiva dos servidores do YGGNAROK automaticamente.
            </div>
          </div>

          {/* Content list */}
          <TrashListClient items={displayItems} />
        </div>
      </main>
    </AppShell>
  );
}
