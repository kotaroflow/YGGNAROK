import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/types/database";
import { workerConfig } from "./config";

export const supabaseAdmin = createClient<Database>(workerConfig.supabaseUrl, workerConfig.serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
