import { hasPermission, type PermissionContext } from "@/lib/permissions";

type PermissionGateProps = {
  user: PermissionContext | null;
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function PermissionGate({ user, permission, children, fallback = null }: PermissionGateProps) {
  if (!hasPermission(user, permission)) {
    return fallback;
  }

  return children;
}
