import { AppShell } from "@/components/app-shell";
import { InteractiveCalendar } from "@/components/interactive-calendar";
import { getContentItems } from "@/server/data/dashboard";
import type { ContentItem } from "@/types/dashboard";

export const dynamic = "force-dynamic";

export default async function CalendarioPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  const contents = await getContentItems() as ContentItem[];

  // Map backend structure to the frontend structure
  const mappedContents = contents.map((item) => ({
    id: item.id,
    profile_id: item.profile_id,
    title: item.title,
    content_type: item.content_type,
    status: item.status,
    platform: item.platform,
    idea: item.idea,
    caption: item.caption,
    hashtags: item.hashtags,
    scheduled_for: item.scheduled_for || null,
    created_at: item.created_at,
  }));

  return (
    <AppShell>
      <main className="min-h-screen text-foreground">
        <InteractiveCalendar initialContents={mappedContents} />
      </main>
    </AppShell>
  );
}
