import { ensureInitialWorkspace } from "@/server/setup/initial-workspace";

export default async function SetupPage() {
  await ensureInitialWorkspace();

  return null;
}
