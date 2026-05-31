import { AppShell } from "@/components/app-shell";
import { getDeletedLibraryItems } from "@/server/data/dashboard";
import { restoreLibraryItem, deleteLibraryItemPermanently } from "@/server/actions/content";
import { Trash2, RefreshCw, AlertTriangle, FileText } from "lucide-react";

const MOCK_NOW = Date.now();
const MOCK_FALLBACKS = [
  { id: "mock-1", title: "Roteiro Antigo - Vendas Exponenciais", type: "Roteiro", body: "Roteiro focado em gerar escassez imediata...", deleted_at: new Date(MOCK_NOW - 86400000 * 2).toISOString() },
  { id: "mock-2", title: "Pauta de Conteúdo: Inteligência Artificial no Cotidiano", type: "Ideia", body: "Uma pauta abordando como a IA otimiza tarefas diárias...", deleted_at: new Date(MOCK_NOW - 86400000 * 5).toISOString() },
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
          <div className="space-y-3">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-line bg-surface/40 p-5 shadow-sm backdrop-blur transition duration-300 hover:border-brand/20 hover:bg-surface-strong/30"
              >
                {item.isMock && (
                  <span className="absolute top-2 right-2 rounded bg-surface px-1.5 py-0.5 text-[8px] font-bold text-muted uppercase tracking-widest border border-line">
                    Demonstração
                  </span>
                )}
                
                <div className="flex items-start gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-strong text-muted group-hover:bg-brand/10 group-hover:text-brand transition duration-300">
                    <FileText size={20} />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-foreground truncate group-hover:text-brand transition duration-300">
                        {item.title}
                      </h3>
                      <span className="inline-flex rounded-md border border-line bg-surface-strong/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted font-mono">
                        {item.type}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                      {item.body || "Sem descrição disponível."}
                    </p>
                    
                    <p className="mt-3 text-[10px] text-muted">
                      Descartado em {new Date(item.deleted_at).toLocaleDateString("pt-BR")} às {new Date(item.deleted_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {/* Actions (Forms using server actions) */}
                  <div className="flex shrink-0 gap-2 items-center">
                    {item.isMock ? (
                      <>
                        <button
                          type="button"
                          className="flex size-9 place-items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-brand/40 hover:text-brand"
                          title="Restaurar (Demo)"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          type="button"
                          className="flex size-9 place-items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-red-500/40 hover:text-red-500"
                          title="Excluir Permanentemente (Demo)"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <form action={async () => {
                          "use server";
                          await restoreLibraryItem(item.id);
                        }}>
                          <button
                            type="submit"
                            className="flex size-9 place-items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-brand/40 hover:text-brand"
                            title="Restaurar para a Biblioteca"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </form>
                        
                        <form action={async () => {
                          "use server";
                          await deleteLibraryItemPermanently(item.id);
                        }}>
                          <button
                            type="submit"
                            className="flex size-9 place-items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-red-500/40 hover:text-red-500"
                            title="Excluir Definitivamente"
                          >
                            <Trash2 size={14} />
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {displayItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-line rounded-2xl bg-surface/10">
                <div className="grid size-16 place-items-center rounded-2xl bg-brand/5 text-brand mb-4">
                  <Trash2 size={28} />
                </div>
                <h3 className="text-sm font-bold text-foreground">A lixeira está vazia</h3>
                <p className="mt-1 text-xs text-muted">Nenhum item descartado recentemente.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
