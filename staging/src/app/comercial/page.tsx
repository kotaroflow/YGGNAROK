import { AppShell } from "@/components/app-shell";
import { UraIchibaClient } from "../../components/ura-ichiba-client";

export default async function ComercialPage() {
  return (
    <AppShell>
      <UraIchibaClient />
    </AppShell>
  );
}
