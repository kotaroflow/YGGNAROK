"use client";

export default function CalendarioError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-xl">
        <p className="text-4xl">📅</p>
        <h2 className="mt-4 text-lg font-bold text-foreground">Erro ao carregar calendário</h2>
        <p className="mt-2 text-sm text-muted">{error.message || "Não foi possível carregar seus conteúdos."}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-brand-strong"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
