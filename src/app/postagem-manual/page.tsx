import { AppShell } from "@/components/app-shell";
import { createGuidedAiJob } from "@/server/actions/jobs";
import { createManualPostingItem, markManualPostAsPublished } from "@/server/actions/posting";
import { getContentItems, getManualPostingItems, getProfiles } from "@/server/data/dashboard";
import { PostagemManualClient } from "@/components/postagem-manual-client";
import type { Profile, ContentItem, ManualPostingItem } from "@/types/dashboard";

export default async function PostagemManualPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams; // Resolve searchParams
  const [profiles, contents, queue] = (await Promise.all([
    getProfiles(), 
    getContentItems(), 
    getManualPostingItems()
  ])) as [Profile[], ContentItem[], ManualPostingItem[]];

  return (
    <AppShell>
      <PostagemManualClient
        profiles={profiles}
        contents={contents}
        queue={queue}
        createManualPostingItemAction={createManualPostingItem}
        createGuidedAiJobAction={createGuidedAiJob}
        markManualPostAsPublishedAction={markManualPostAsPublished}
      />
    </AppShell>
  );
}
