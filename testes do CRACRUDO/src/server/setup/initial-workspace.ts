import { redirect } from "next/navigation";
import { createSupabaseServiceClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function ensureInitialWorkspace() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=sessao");
  }

  const admin = createSupabaseServiceClient();
  const isSystemOwner = await isFirstAuthUser(admin, user.id);

  if (!isSystemOwner) {
    const { data: primaryProfile } = await admin
      .from("profiles")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (primaryProfile?.id) {
      await ensureProfileMembership(admin, primaryProfile.id, user.id, "viewer");
    }

    redirect("/");
  }

  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1);

  if (existing?.length) {
    await ensureProfileMembership(admin, existing[0].id, user.id, "owner");
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
    redirect("/perfis");
  }

  await ensureProfileMembership(admin, profile.id, user.id, "owner");

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

async function ensureProfileMembership(
  admin: ReturnType<typeof createSupabaseServiceClient>,
  profileId: string,
  userId: string,
  roleKey: "owner" | "viewer",
) {
  const { data: roleData } = await admin.from("roles").select("id").eq("key", roleKey).single();
  const role = roleData as { id: string } | null;

  if (!role) {
    return;
  }

  const { data: existingMember } = await admin
    .from("profile_members")
    .select("id")
    .eq("profile_id", profileId)
    .eq("user_id", userId)
    .limit(1);

  if (existingMember?.length) {
    await admin
      .from("profile_members")
      .update({ role_id: role.id, status: "active" })
      .eq("id", existingMember[0].id);
    return;
  }

  await admin.from("profile_members").insert({
    profile_id: profileId,
    user_id: userId,
    role_id: role.id,
    status: "active",
  });
}

async function isFirstAuthUser(admin: ReturnType<typeof createSupabaseServiceClient>, userId: string) {
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
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
