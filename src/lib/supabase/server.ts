import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { assertPublicSupabaseEnv } from "./env";
import { createStubClient } from "./stub";

let cachedClient: ReturnType<typeof createServerClient<Database>> | null = null;

function isPlaceholderUrl(url: string) {
  return !url || url.includes("example.supabase.co") || url === "https://placeholder.supabase.co";
}

export async function createSupabaseServerClient() {
  if (cachedClient) return cachedClient;

  const env = assertPublicSupabaseEnv();
  if (isPlaceholderUrl(env.url)) {
    return createStubClient<Database>() as unknown as ReturnType<typeof createServerClient<Database>>;
  }

  const cookieStore = await cookies();

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
