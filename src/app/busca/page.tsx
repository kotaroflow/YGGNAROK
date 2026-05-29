import { AppShell } from "@/components/app-shell";
import { PageFrame, PagePanel } from "@/components/page-frame";

export default function BuscaPage() {
  return (
    <AppShell>
      <main className="min-h-screen">
        <PageFrame title="Busca" description="Esta seção está em construção.">
          <PagePanel>
            <p className="text-sm text-muted">
              Em breve: busca unificada em perfis, conteúdo, jobs e mídia.
            </p>
          </PagePanel>
        </PageFrame>
      </main>
    </AppShell>
  );
}
