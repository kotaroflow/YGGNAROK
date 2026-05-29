import { AppShell } from "@/components/app-shell";
import { ProjectsPage } from "@/components/projects-page";

export default function ProjetosPage() {
  return (
    <AppShell hideTopBar>
      <ProjectsPage />
    </AppShell>
  );
}
