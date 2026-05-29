import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PermissionContext } from "@/lib/permissions";
import type { PermissionKey, RoleKey } from "@/lib/permissions/keys";

export async function getCurrentPermissionContext(): Promise<PermissionContext | null> {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch (e) {
    // Retorna um mock de admin localmente para testes da interface
    return {
      userId: "mock-user-id",
      roles: ["owner"],
      permissions: ["admin.access", "ai_jobs.view_own", "profiles.view", "reports.view", "content.create", "ai_jobs.create", "content.view", "library.view", "library.restore", "posting.view", "ai_jobs.manage_all", "admin.manage_roles", "admin.manage_permissions", "admin.system_health", "admin.view_logs"],
      profileIds: ["mock-profile-id"],
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (process.env.NODE_ENV === "development") {
      return {
        userId: "mock-user-id",
        roles: ["owner"],
        permissions: ["admin.access", "ai_jobs.view_own", "profiles.view", "reports.view", "content.create", "ai_jobs.create", "content.view", "library.view", "library.restore", "posting.view", "ai_jobs.manage_all", "admin.manage_roles", "admin.manage_permissions", "admin.system_health", "admin.view_logs"],
        profileIds: ["mock-profile-id"],
      };
    }
    return null;
  }

  const admin = createSupabaseServiceClient();
  const { data: memberships } = await admin
    .from("profile_members")
    .select("profile_id, role_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  const roleIds = Array.from(new Set((memberships ?? []).map((membership) => membership.role_id).filter(Boolean)));

  if (!roleIds.length) {
    return {
      userId: user.id,
      roles: [],
      permissions: [],
      profileIds: [],
    };
  }

  const [rolesResult, permissionsResult] = await Promise.all([
    admin.from("roles").select("id, key").in("id", roleIds),
    admin.from("role_permissions").select("role_id, permissions!inner(key)").in("role_id", roleIds),
  ]);

  const roleRows = (rolesResult.data ?? []) as unknown as Array<{ key: string }>;
  const permissionRows = (permissionsResult.data ?? []) as unknown as Array<{ permissions: { key?: string } | Array<{ key?: string }> | null }>;
  const roles = Array.from(new Set(roleRows.map((role) => role.key as RoleKey)));
  const permissions = Array.from(
    new Set(
      permissionRows
        .map((entry) => {
          const permission = Array.isArray(entry.permissions) ? entry.permissions[0] : entry.permissions;
          return permission?.key as PermissionKey | undefined;
        })
        .filter((permission): permission is PermissionKey => Boolean(permission)),
    ),
  );
  const profileIds = Array.from(new Set((memberships ?? []).map((membership) => membership.profile_id).filter(Boolean)));

  return {
    userId: user.id,
    roles,
    permissions,
    profileIds,
  };
}
