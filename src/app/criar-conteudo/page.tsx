import { AppShell } from "@/components/app-shell";
import { getContentItems, getProfiles } from "@/server/data/dashboard";
import { CriarConteudoClient } from "@/components/criar-conteudo-client";
import type { Profile, ContentItem } from "@/types/dashboard";

export default async function CriarConteudoPage({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const [profiles, contents] = (await Promise.all([getProfiles(), getContentItems()])) as [Profile[], ContentItem[]];
  const { aba } = await searchParams;
  const activeTab = aba || "ideias";

  const sanitizedProfiles = profiles.map(p => ({
    id: p.id,
    name: p.name
  }));

  const sanitizedContents = contents.map(c => ({
    id: c.id,
    profile_id: c.profile_id || "",
    title: c.title || "Sem título",
    content_type: c.content_type || "ideia",
    platform: c.platform || "Multicanais",
    idea: c.idea || "",
    status: c.status || "Pendente",
    created_at: c.created_at || new Date().toISOString()
  }));

  return (
    <AppShell>
      <CriarConteudoClient 
        profiles={sanitizedProfiles} 
        initialContents={sanitizedContents} 
        activeTab={activeTab} 
      />
    </AppShell>
  );
}
