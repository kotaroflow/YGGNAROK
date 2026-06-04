import { AppShell } from "@/components/app-shell";
import { ProjectsPage } from "@/components/projects-page";

export default async function ProjetosPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  return (
    <AppShell hideTopBar>
      <ProjectsPage />
    </AppShell>
  );
}
