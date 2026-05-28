import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { getCurrentPermissionContext } from "@/server/permissions/context";

export async function AppShell({ children, hideTopBar = false }: { children: React.ReactNode; hideTopBar?: boolean }) {
  const permissions = await getCurrentPermissionContext();

  return (
    <div className="flex min-h-screen text-slate-700 dark:text-stone-100">
      <Sidebar user={permissions} />
      <div className="min-w-0 flex-1">
        {hideTopBar ? null : <TopBar />}
        {children}
      </div>
    </div>
  );
}
