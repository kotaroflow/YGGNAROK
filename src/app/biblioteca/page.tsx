import { AppShell } from "@/components/app-shell";
import { createLibraryItem } from "@/server/actions/content";
import { createGuidedAiJob } from "@/server/actions/jobs";
import { getLibraryItems, getProfiles } from "@/server/data/dashboard";
import { BibliotecaClient } from "@/components/biblioteca-client";
import type { Profile, LibraryItem } from "@/types/dashboard";

export default async function BibliotecaPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  const [profiles, items] = (await Promise.all([getProfiles(), getLibraryItems()])) as [Profile[], LibraryItem[]];

  return (
    <AppShell>
      <BibliotecaClient
        profiles={profiles}
        items={items}
        createLibraryItemAction={createLibraryItem}
        createGuidedAiJobAction={createGuidedAiJob}
      />
    </AppShell>
  );
}