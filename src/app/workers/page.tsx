import { AppShell } from "@/components/app-shell";
import { getHealthLogs, getJobs } from "@/server/data/dashboard";
import { WorkersClient } from "./client";
import type { HealthLog, Job } from "@/types/dashboard";

export default async function WorkersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await searchParams;
  const [logs, jobs] = (await Promise.all([getHealthLogs(), getJobs()])) as [HealthLog[], Job[]];
  const pending = jobs.filter((job) => job.status === "pending").length;
  const processing = jobs.filter((job) => job.status === "processing").length;

  return (
    <AppShell>
      <WorkersClient initialLogs={logs} initialPending={pending} initialProcessing={processing} />
    </AppShell>
  );
}
