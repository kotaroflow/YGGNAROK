"use server";

import { redirect } from "next/navigation";
import { authSchema } from "@/lib/validators/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/login?error=validacao");
  }

  // Dev bypass: skip Supabase when URL is a placeholder
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("localhost")) {
    redirect("/");
  }

  const input = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(input);

  if (error) {
    redirect("/login?error=credenciais");
  }

  redirect("/setup");
}

export async function signUp(formData: FormData) {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/cadastro?error=validacao");
  }

  const input = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    ...input,
    options: {
      emailRedirectTo: `${getAppUrl()}/setup`,
    },
  });

  if (error) {
    redirect("/cadastro?error=cadastro");
  }

  if (data.session) {
    redirect("/setup");
  }

  const { error: signInError } = await supabase.auth.signInWithPassword(input);

  if (!signInError) {
    redirect("/setup");
  }

  redirect("/login?status=confirmar-email");
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://yggnarok-v1.vercel.app";
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
