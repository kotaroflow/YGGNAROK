import { AppShell } from "@/components/app-shell";
import { createLibraryItem } from "@/server/actions/content";
import { createGuidedAiJob } from "@/server/actions/jobs";
import { getLibraryItems, getProfiles } from "@/server/data/dashboard";
import { BibliotecaClient } from "@/components/biblioteca-client";

export default async function BibliotecaPage() {
  const [profiles, items] = await Promise.all([getProfiles(), getLibraryItems()]);

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