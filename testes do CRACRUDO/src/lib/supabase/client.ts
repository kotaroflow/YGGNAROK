"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { assertPublicSupabaseEnv } from "./env";

export function createSupabaseBrowserClient() {
  const env = assertPublicSupabaseEnv();
  return createBrowserClient<Database>(env.url, env.anonKey);
}
