"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Plus, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { hasPermission, type PermissionContext } from "@/lib/permissions";
import { sidebarGroups } from "@/lib/navigation";
import { ThemeToggle } from "./theme-toggle";
import { signOut } from "@/server/actions/auth";

const mobileStorageKey = "ygn-sidebar-mobile-open";

function readSavedMobileOpen() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(mobileStorageKey) === "true";
}

export function Sidebar({ user }: { user: PermissionContext | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(readSavedMobileOpen);

  const visibleGroups = sidebarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.permission || hasPermission(user, item.permission)),
    }))
    .filter((group) => group.items.length > 0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(mobileStorageKey, String(mobileOpen));
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
    window.sessionStorage.setItem(mobileStorageKey, "false");
  }

  const handleNewChat = () => {
    router.push("/chat");
    closeMobile();
  };

  const sidebar = (
    <aside className="flex h-full flex-col border-r border-white/10 bg-neutral-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="text-lg font-semibold text-white">YGGNAROK</div>
        <button
          type="button"
          className="grid size-8 place-items-center rounded-md text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          onClick={closeMobile}
          aria-label="Fechar navegacao"
        >
          <X size={18} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4 pb-3">
        <button
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <Plus size={18} />
          Nova Conversa
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {/* Main Menu */}
        <div className="mb-6 space-y-2">
          {visibleGroups[0]?.items.slice(0, 5).map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* History/Other Groups */}
        {visibleGroups.map((group, idx) => {
          if (idx === 0) return null;
          return (
            <div key={group.id} className="mb-6">
              <div className="mb-2 px-3 text-xs font-semibold uppercase text-gray-500">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.slice(0, 4).map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                        active
                          ? "bg-white/15 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-3 space-y-2">
        <ThemeToggle compact={false} />
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 grid size-10 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir navegacao"
      >
        <Menu size={20} />
      </button>
      <div className="hidden h-screen lg:block">{sidebar}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Fechar navegacao"
            onClick={closeMobile}
          />
          <div className="relative h-full w-64">{sidebar}</div>
        </div>
      ) : null}
    </>
  );
}
