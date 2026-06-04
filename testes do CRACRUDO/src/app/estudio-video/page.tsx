import { AppShell } from "@/components/app-shell";
import { EstudioVideoClient } from "@/components/estudio-video-client";

export default async function EstudioVideoPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;

  return (
    <AppShell>
      <EstudioVideoClient />
    </AppShell>
  );
}
