export const permissionKeys = [
  "profiles.view",
  "profiles.create",
  "profiles.edit",
  "profiles.delete",
  "content.view",
  "content.create",
  "content.edit",
  "content.approve",
  "content.delete",
  "library.view",
  "library.create",
  "library.restore",
  "library.delete",
  "posting.view",
  "posting.manage",
  "reports.view",
  "reports.global_view",
  "ai_jobs.create",
  "ai_jobs.view_own",
  "ai_jobs.manage_all",
  "admin.access",
  "admin.manage_roles",
  "admin.manage_permissions",
  "admin.view_logs",
  "admin.system_health",
] as const;

export type PermissionKey = (typeof permissionKeys)[number];

export const roleKeys = ["owner", "admin", "manager", "creator", "editor", "viewer"] as const;

export type RoleKey = (typeof roleKeys)[number];
