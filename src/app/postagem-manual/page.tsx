import { AppShell } from "@/components/app-shell";
import { createGuidedAiJob } from "@/server/actions/jobs";
import { createManualPostingItem, markManualPostAsPublished } from "@/server/actions/posting";
import { getContentItems, getManualPostingItems, getProfiles } from "@/server/data/dashboard";
import { PostagemManualClient } from "@/components/postagem-manual-client";

export default async function PostagemManualPage() {
  const [profiles, contents, queue] = await Promise.all([getProfiles(), getContentItems(), getManualPostingItems()]);

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
