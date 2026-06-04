import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { assertPublicSupabaseEnv } from "./env";

let cachedClient: ReturnType<typeof createServerClient<Database>> | null = null;

export async function createSupabaseServerClient() {
  if (cachedClient) return cachedClient;

  const cookieStore = await cookies();
  const env = assertPublicSupabaseEnv();

  cachedClient = createServerClient<Database>(env.url, env.anonKey, {
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

  return cachedClient;
}
