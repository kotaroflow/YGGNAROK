import { redirect } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseAdminClient = ReturnType<typeof createSupabaseServiceClient>;

export async function ensureInitialWorkspace() {
  const supabase = await createSetupServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?error=sessao");
  }

  const admin = createSetupAdminClient();
  const existingMembership = await getActiveMembership(admin, user.id);

  if (existingMembership) {
    redirect("/");
  }

  const isSystemOwner = await isFirstAuthUser(admin, user.id);
  if (!isSystemOwner) {
    redirect("/login?error=sem-acesso");
  }

  const ownerRoleId = await getRequiredRoleId(admin, "owner");
  const existingOwner = await getExistingOwnerMembership(admin, ownerRoleId);

  if (existingOwner && existingOwner.user_id !== user.id) {
    redirect("/login?error=setup");
  }

  const { data: existing, error: existingProfileError } = await admin
    .from("profiles")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existingProfileError) {
    redirect("/login?error=setup");
  }

  if (existing?.id) {
    await ensureProfileMembership(admin, existing.id, user.id, ownerRoleId);
    await assertOwnerMembership(admin, user.id, ownerRoleId);
    redirect("/");
  }

  const slug = buildSlug(user.email ?? user.id);
  const { data: profile, error } = await admin
    .from("profiles")
    .insert({
      owner_id: user.id,
      name: "YGN Principal",
      slug,
      description: "Perfil inicial criado automaticamente pela V1.",
      status: "active",
    })
    .select("id")
    .single();

  if (error || !profile) {
    redirect("/login?error=setup");
  }

  await ensureProfileMembership(admin, profile.id, user.id, ownerRoleId);
  await assertOwnerMembership(admin, user.id, ownerRoleId);

  await admin.from("profile_tags").insert([
    { profile_id: profile.id, tag_group: "tipo", tag_key: "conteudo" },
    { profile_id: profile.id, tag_group: "objetivo", tag_key: "crescimento" },
    { profile_id: profile.id, tag_group: "status", tag_key: "ativo" },
    { profile_id: profile.id, tag_group: "risco", tag_key: "seguro" },
  ]);

  await admin.from("health_logs").insert({
    source: "setup",
    status: "info",
    message: "Workspace inicial criado automaticamente",
    metadata: { profile_id: profile.id, user_id: user.id },
  });

  redirect("/");
}

async function createSetupServerClient() {
  try {
    return await createSupabaseServerClient();
  } catch {
    redirect("/login?error=configuracao");
  }
}

function createSetupAdminClient() {
  try {
    return createSupabaseServiceClient();
  } catch {
    redirect("/login?error=configuracao");
  }
}

async function getActiveMembership(admin: SupabaseAdminClient, userId: string) {
  const { data, error } = await admin
    .from("profile_members")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) {
    redirect("/login?error=setup");
  }

  return data;
}

async function getRequiredRoleId(admin: SupabaseAdminClient, roleKey: "owner" | "viewer") {
  const { data, error } = await admin.from("roles").select("id").eq("key", roleKey).maybeSingle();
  const role = data as { id: string } | null;

  if (error || !role?.id) {
    redirect("/login?error=configuracao");
  }

  return role.id;
}

async function getExistingOwnerMembership(admin: SupabaseAdminClient, ownerRoleId: string) {
  const { data, error } = await admin
    .from("profile_members")
    .select("id, user_id")
    .eq("role_id", ownerRoleId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) {
    redirect("/login?error=setup");
  }

  return data;
}

async function ensureProfileMembership(
  admin: SupabaseAdminClient,
  profileId: string,
  userId: string,
  roleId: string,
) {
  const { data: existingMember, error: existingMemberError } = await admin
    .from("profile_members")
    .select("id")
    .eq("profile_id", profileId)
    .eq("user_id", userId)
    .limit(1);

  if (existingMemberError) {
    redirect("/login?error=setup");
  }

  if (existingMember?.length) {
    const { error } = await admin
      .from("profile_members")
      .update({ role_id: roleId, status: "active" })
      .eq("id", existingMember[0].id);

    if (error) {
      redirect("/login?error=setup");
    }

    return;
  }

  const { error } = await admin.from("profile_members").insert({
    profile_id: profileId,
    user_id: userId,
    role_id: roleId,
    status: "active",
  });

  if (error) {
    redirect("/login?error=setup");
  }
}

async function assertOwnerMembership(admin: SupabaseAdminClient, userId: string, ownerRoleId: string) {
  const { data, error } = await admin
    .from("profile_members")
    .select("id")
    .eq("user_id", userId)
    .eq("role_id", ownerRoleId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error || !data?.id) {
    redirect("/login?error=setup");
  }
}

async function isFirstAuthUser(admin: SupabaseAdminClient, userId: string) {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (error) {
    redirect("/login?error=setup");
  }

  const users = [...data.users].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  return users[0]?.id === userId;
}

function buildSlug(value: string) {
  const base = value
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `${base || "ygn"}-${crypto.randomUUID().slice(0, 8)}`;
}
