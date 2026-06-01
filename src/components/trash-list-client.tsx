"use client";

import { useState } from "react";
import { Trash2, RefreshCw, FileText, Eye, AlertCircle } from "lucide-react";
import { restoreLibraryItem, deleteLibraryItemPermanently } from "@/server/actions/content";

interface TrashItem {
  id: string;
  title: string;
  type: string;
  body: string;
  deleted_at: string;
  isMock: boolean;
}

export function TrashListClient({ items }: { items: TrashItem[] }) {
  const [readingItem, setReadingItem] = useState<TrashItem | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item) => (
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
              
              <div className="mt-3 flex items-center gap-3">
                <p className="text-[10px] text-muted">
                  Descartado em {new Date(item.deleted_at).toLocaleDateString("pt-BR")} às {new Date(item.deleted_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <button
                  type="button"
                  onClick={() => setReadingItem(item)}
                  className="text-[10px] font-bold text-brand hover:underline flex items-center gap-1.5"
                >
                  <Eye size={12} />
                  <span>Ler Conteúdo</span>
                </button>
              </div>
            </div>

            {/* Actions (Forms using server actions with .bind) */}
            <div className="flex shrink-0 gap-2 items-center">
              {item.isMock ? (
                <>
                  <button
                    type="button"
                    onClick={() => alert("Demonstração: Item restaurado com sucesso!")}
                    className="flex size-9 place-items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-brand/40 hover:text-brand"
                    title="Restaurar (Demo)"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("Demonstração: Item deletado permanentemente!")}
                    className="flex size-9 place-items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-red-500/40 hover:text-red-500"
                    title="Excluir Permanentemente (Demo)"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              ) : (
                <>
                  <form action={restoreLibraryItem.bind(null, item.id)}>
                    <button
                      type="submit"
                      className="flex size-9 place-items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-brand/40 hover:text-brand"
                      title="Restaurar para a Biblioteca"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </form>
                  
                  <form action={deleteLibraryItemPermanently.bind(null, item.id)}>
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

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-line rounded-2xl bg-surface/10">
          <div className="grid size-16 place-items-center rounded-2xl bg-brand/5 text-brand mb-4">
            <Trash2 size={28} />
          </div>
          <h3 className="text-sm font-bold text-foreground">A lixeira está vazia</h3>
          <p className="mt-1 text-xs text-muted">Nenhum item descartado recentemente.</p>
        </div>
      )}

      {/* Stunning Interactive Glassmorphic Inspect Modal */}
      {readingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 border border-brand/20 px-2.5 py-0.5 text-[10px] font-bold text-brand uppercase tracking-wider">
                  {readingItem.type}
                </span>
                <h3 className="mt-2.5 text-base font-bold text-foreground">{readingItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setReadingItem(null)}
                className="rounded-lg p-1 text-muted hover:bg-surface-strong hover:text-foreground transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-line bg-surface-strong p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText size={12} className="text-brand" /> Conteúdo do Item
                </p>
                <div className="text-xs leading-relaxed text-foreground whitespace-pre-wrap font-medium">
                  {readingItem.body || "Nenhum conteúdo salvo neste item."}
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-brand/5 border border-brand/15 p-3 text-[10px] text-brand font-bold leading-normal">
                <AlertCircle size={14} className="shrink-0 animate-pulse" />
                <span>Para editar ou utilizar este material, você deve restaurá-lo clicando no ícone de recuperação.</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReadingItem(null)}
                className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-bold hover:bg-surface-strong transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
