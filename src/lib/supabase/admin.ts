import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { assertPublicSupabaseEnv, getPublicSupabaseEnv, isExplicitAuthDevBypassEnabled, isPlaceholderSupabaseUrl } from "./env";
import { createStubClient } from "./stub";

let cachedAdmin: ReturnType<typeof createClient<Database>> | null = null;

export function createSupabaseServiceClient() {
  if (cachedAdmin) return cachedAdmin;

  const currentEnv = getPublicSupabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if ((!currentEnv.url || !currentEnv.anonKey || !serviceKey || isPlaceholderSupabaseUrl(currentEnv.url)) && isExplicitAuthDevBypassEnabled()) {
    return createStubClient<Database>() as unknown as ReturnType<typeof createClient<Database>>;
  }

  const env = assertPublicSupabaseEnv();
  if (!serviceKey) {
    throw new Error("Supabase service role nao configurada para operacao server-side.");
  }

  cachedAdmin = createClient<Database>(env.url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedAdmin;
}
