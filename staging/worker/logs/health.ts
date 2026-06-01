import { supabaseAdmin } from "../src/supabase";

export async function writeHealthLog(status: "info" | "warning" | "error" | "critical", message: string, metadata = {}) {
  await supabaseAdmin.from("health_logs" as never).insert({
    source: "worker",
    status,
    message,
    metadata,
  } as never);
}
