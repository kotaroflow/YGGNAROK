import { AppShell } from "@/components/app-shell";
import { AdminClient } from "@/components/admin-client";
import {
  getDashboardCounts,
  getProfiles,
  getJobs,
  getHealthLogs,
  getAuditLogs,
  getRolesAndPermissions,
} from "@/server/data/dashboard";
import type { Profile, Job, HealthLog, AuditLog } from "@/types/dashboard";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  const { aba } = await searchParams;
  const activeTab = aba ?? "geral";

  const [counts, profiles, jobs, healthLogs, auditLogs, { roles, permissions }] = await Promise.all([
    getDashboardCounts(),
    getProfiles(),
    getJobs(),
    getHealthLogs(),
    getAuditLogs(),
    getRolesAndPermissions(),
  ]);

  return (
    <AppShell>
      <AdminClient
        activeTab={activeTab}
        counts={counts}
        profiles={profiles}
        jobs={jobs}
        healthLogs={healthLogs}
        auditLogs={auditLogs}
        roles={roles}
        permissions={permissions}
      />
    </AppShell>
  );
}
