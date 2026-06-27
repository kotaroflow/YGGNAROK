"use server";

import { redirect } from "next/navigation";
import { authSchema } from "@/lib/validators/schemas";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthAppUrl, isExplicitAuthDevBypassEnabled } from "@/lib/supabase/env";

export async function signIn(formData: FormData) {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/login?error=validacao");
  }

  if (isExplicitAuthDevBypassEnabled()) {
    redirect("/");
  }

  const input = parsed.data;
  const supabase = await createAuthClientOrRedirect("/login?error=configuracao");
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
  const supabase = await createAuthClientOrRedirect("/cadastro?error=configuracao");
  const { data, error } = await supabase.auth.signUp({
    ...input,
    options: {
      emailRedirectTo: `${getAuthAppUrlOrRedirect("/cadastro?error=configuracao")}/setup`,
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

export async function signOut() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Configuração ausente não deve impedir a saída da interface.
  }

  redirect("/login");
}

async function createAuthClientOrRedirect(errorUrl: string) {
  try {
    return await createSupabaseServerClient();
  } catch {
    redirect(errorUrl);
  }
}

function getAuthAppUrlOrRedirect(errorUrl: string) {
  try {
    return getAuthAppUrl();
  } catch {
    redirect(errorUrl);
  }
}
