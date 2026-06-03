import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { assertPublicSupabaseEnv } from "./env";
import { createStubClient } from "./stub";

let cachedAdmin: ReturnType<typeof createClient<Database>> | null = null;

export function createSupabaseServiceClient() {
  if (cachedAdmin) return cachedAdmin;

  const env = assertPublicSupabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!serviceKey || env.url.includes("example.supabase.co")) {
    return createStubClient<Database>() as unknown as ReturnType<typeof createClient<Database>>;
  }

  cachedAdmin = createClient<Database>(env.url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedAdmin;
}
