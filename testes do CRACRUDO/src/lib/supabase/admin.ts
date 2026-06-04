import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { assertPrivateEnv } from "./env";

export function createSupabaseServiceClient() {
  return createClient<Database>(
    assertPrivateEnv("NEXT_PUBLIC_SUPABASE_URL"),
    assertPrivateEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
