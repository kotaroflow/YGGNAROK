import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { getCurrentPermissionContext } from "@/server/permissions/context";

export async function AppShell({
  children,
  hideTopBar = false,
}: {
  children: React.ReactNode;
  hideTopBar?: boolean;
}) {
  const permissions = await getCurrentPermissionContext();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar user={permissions} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {hideTopBar ? null : <TopBar />}
        {children}
      </div>
    </div>
  );
}
