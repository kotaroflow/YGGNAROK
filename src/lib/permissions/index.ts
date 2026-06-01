import type { PermissionKey, RoleKey } from "./keys";

export type PermissionContext = {
  userId: string;
  email?: string | null;
  roles: RoleKey[];
  permissions: PermissionKey[];
  profileIds: string[];
};

export function hasPermission(user: PermissionContext | null | undefined, permission: PermissionKey | string) {
  const result = Boolean(user?.permissions.includes(permission as PermissionKey));
  console.log(`hasPermission for ${permission}:`, { user, permissions: user?.permissions, result });
  return result;
}

export function hasRole(user: PermissionContext | null | undefined, role: RoleKey | string) {
  return Boolean(user?.roles.includes(role as RoleKey));
}

export function canAccessProfile(user: PermissionContext | null | undefined, profileId: string) {
  return Boolean(user?.profileIds.includes(profileId) || hasRole(user, "owner") || hasRole(user, "admin"));
}

export function canEditContent(
  user: PermissionContext | null | undefined,
  content: { profile_id: string },
) {
  return canAccessProfile(user, content.profile_id) && hasPermission(user, "content.edit");
}

export function canCreateJob(user: PermissionContext | null | undefined) {
  return hasPermission(user, "ai_jobs.create");
}

export function canAccessAdmin(user: PermissionContext | null | undefined) {
  return hasPermission(user, "admin.access");
}

export function canManagePosting(user: PermissionContext | null | undefined, profileId: string) {
  return canAccessProfile(user, profileId) && hasPermission(user, "posting.manage");
}

export function canViewReports(user: PermissionContext | null | undefined, profileId: string) {
  return canAccessProfile(user, profileId) && hasPermission(user, "reports.view");
}
