import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

export async function assertPermission(permission: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Você não tem permissão para acessar esta área.");
  }

  const allowed = await userHasPermission(user.id, permission);

  if (!allowed) {
    const admin = createSupabaseServiceClient();
    await admin.from("audit_logs").insert({
      user_id: user.id,
      action: "permission.denied",
      resource_type: "permission",
      resource_id: permission,
      reason: "backend_validation",
    });
    throw new Error("Esta ação precisa de permissão.");
  }

  return { supabase, user };
}

async function userHasPermission(userId: string, permission: string) {
  const admin = createSupabaseServiceClient();
  const { data: memberships } = await admin
    .from("profile_members")
    .select("role_id")
    .eq("user_id", userId)
    .eq("status", "active");
  const roleIds = memberships?.map((membership) => membership.role_id).filter(Boolean) ?? [];

  if (!roleIds.length) {
    return false;
  }

  const adminLax = admin as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        in: (column: string, values: string[]) => {
          eq: (column: string, value: string) => {
            then: <T>(onfulfilled?: (value: { data: T[] | null; error: { message: string } | null }) => T[]) => Promise<T[]>;
          };
        };
      };
    };
  };

  const permissionsData = await adminLax
    .from("role_permissions")
    .select("roles!inner(id),permissions!inner(key)")
    .in("role_id", roleIds)
    .eq("permissions.key", permission);

   return Boolean(permissionsData?.data?.length);
}
