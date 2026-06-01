import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";

type LooseDb = {
  from: (table: string) => {
    select: (columns: string) => LooseQuery;
    insert: (values: object) => Promise<{ error: { message: string } | null }>;
  };
};

type LooseQuery = {
  eq: (column: string, value: string) => LooseQuery;
  in: (column: string, values: string[]) => LooseQuery;
  single: () => Promise<{ data: Record<string, string> | null; error: { message: string } | null }>;
  then: <TResult1 = { data: Array<Record<string, string>> | null; error: { message: string } | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: Array<Record<string, string>> | null; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) => Promise<TResult1 | TResult2>;
};

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
    const admin = createSupabaseServiceClient() as unknown as LooseDb;
    await admin.from("audit_logs").insert({
      user_id: user.id,
      action: "permission.denied",
      resource_type: "permission",
      resource_id: permission,
      reason: "backend_validation",
    } as never);
    throw new Error("Esta ação precisa de permissão.");
  }

  return { supabase, user };
}

async function userHasPermission(userId: string, permission: string) {
  const admin = createSupabaseServiceClient() as unknown as LooseDb;
  const { data: memberships } = await admin.from("profile_members").select("role_id").eq("user_id", userId).eq("status", "active");
  const roleIds = memberships?.map((membership) => membership.role_id).filter(Boolean) ?? [];

  if (!roleIds.length) {
    return false;
  }

  const { data: permissions } = await admin
    .from("role_permissions")
    .select("roles!inner(id),permissions!inner(key)")
    .in("role_id", roleIds)
    .eq("permissions.key", permission);

  return Boolean(permissions?.length);
}
