import { ensureInitialWorkspace } from "@/server/setup/initial-workspace";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  try {
    await ensureInitialWorkspace();
  } catch (error) {
    console.error("Erro no setup inicial:", error);
    redirect("/");
  }

  return null;
}
