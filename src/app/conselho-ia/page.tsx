import { AppShell } from "@/components/app-shell";
import { getFreeCouncilJobs } from "@/server/ai-council/free-runtime";
import { ConselhoIaClient } from "./client";

export default async function ConselhoIaPage({ searchParams }: { searchParams: Promise<{ job?: string }> }) {
  const [{ job: selectedId }, jobs] = await Promise.all([searchParams, getFreeCouncilJobs()]);
  const selected = jobs.find((j) => j.id === selectedId) ?? jobs[0] ?? null;

  return (
    <AppShell>
      <ConselhoIaClient initialJobs={jobs} selectedJob={selected} />
    </AppShell>
  );
}
