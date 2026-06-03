"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

const settingsSchema = z.object({
  openrouterKey: z.string().optional(),
  geminiKey: z.string().optional(),
});

export type SettingsData = z.infer<typeof settingsSchema>;

/**
 * Persist settings server-side (future: Supabase settings table).
 * Currently validates and logs; localStorage handles the client-side persistence.
 * When Supabase is wired, this will write to a user_settings table.
 */
export async function saveSettings(formData: FormData) {
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    raw[key] = value;
  }

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Invalid settings data");
  }

  const settings = parsed.data;

  // In dev, log what would be saved
  if (process.env.NODE_ENV === "development") {
    console.log("[settings] Server save (dev):", {
      ...settings,
      openrouterKey: settings.openrouterKey ? "[REDACTED]" : undefined,
      geminiKey: settings.geminiKey ? "[REDACTED]" : undefined,
    });
  }

  // TODO: When Supabase is integrated, persist to user_settings table:
  // const supabase = await createSupabaseServerClient();
  // const { error } = await supabase.from("user_settings").upsert({
  //   user_id: (await supabase.auth.getUser()).data.user?.id,
  //   settings: settings,
  //   updated_at: new Date().toISOString(),
  // });

  return { success: true };
}
