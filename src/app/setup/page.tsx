import { ensureInitialWorkspace } from "@/server/setup/initial-workspace";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  await ensureInitialWorkspace();

  return null;
}
