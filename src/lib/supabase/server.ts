import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { assertPublicSupabaseEnv, getPublicSupabaseEnv, isExplicitAuthDevBypassEnabled, isPlaceholderSupabaseUrl } from "./env";
import { createStubClient } from "./stub";

export async function createSupabaseServerClient() {
  const currentEnv = getPublicSupabaseEnv();
  if ((!currentEnv.url || !currentEnv.anonKey || isPlaceholderSupabaseUrl(currentEnv.url)) && isExplicitAuthDevBypassEnabled()) {
    return createStubClient<Database>() as unknown as ReturnType<typeof createServerClient<Database>>;
  }

  const env = assertPublicSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
