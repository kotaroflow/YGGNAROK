"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { hasPermission, type PermissionContext } from "@/lib/permissions";
import { sidebarGroups } from "@/lib/navigation";
import { ThemeToggle } from "./theme-toggle";
import { signOut } from "@/server/actions/auth";

const storageKey = "ygn-sidebar-collapsed";
const mobileStorageKey = "ygn-sidebar-mobile-open";

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(storageKey) === "true";
}

function readSavedMobileOpen(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(mobileStorageKey) === "true";
}

// Ordem desejada: Entrada, Criacao, Mercado, Operacao
const GROUP_ORDER = ["iriguchi", "sosaku-kobo", "ura-ichiba", "sakusen-honbu"];

export function Sidebar({ user }: { user: PermissionContext | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(readSavedMobileOpen);

  const visibleGroups = GROUP_ORDER
    .map((id) => sidebarGroups.find((g) => g.id === id))
    .filter(Boolean)
    .map((group) => ({
      ...group!,
      items: group!.items.filter((item) => !item.permission || hasPermission(user, item.permission)),
    }))
    .filter((group) => group.items.length > 0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    <aside
      className={[
        "relative flex h-full flex-col border-r border-white/10 bg-neutral-950 transition-[width] duration-200",
        collapsed ? "w-[60px]" : "w-[200px]",
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-3">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-wide text-white">YGGNAROK</span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className={[
            "grid size-8 shrink-0 place-items-center rounded-md text-gray-400 transition hover:bg-white/10 hover:text-white",
            collapsed ? "mx-auto" : "ml-auto",
          ].join(" ")}
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button
          type="button"
          className="grid size-8 place-items-center rounded-md text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          onClick={closeMobile}
          aria-label="Fechar navegacao"
        >
          <X size={16} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className={["py-3", collapsed ? "px-2" : "px-3"].join(" ")}>
        <button
          onClick={handleNewChat}
          title="Nova Conversa"
          className={[
            "flex w-full items-center gap-2 rounded-md border border-white/20 bg-white/5 py-2 text-sm font-medium text-white transition hover:bg-white/10",
            collapsed ? "justify-center px-2" : "px-3",
          ].join(" ")}
        >
          <Plus size={16} className="shrink-0" />
          {!collapsed && <span>Nova Conversa</span>}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-1">
        {visibleGroups.map((group, idx) => {
          // Grupo "Entrada" (iriguchi) sem label de secao
          const showLabel = group.id !== "iriguchi";

          return (
            <div key={group.id} className={idx > 0 ? "mt-4" : ""}>
              {showLabel && !collapsed && (
                <div className="mb-1 px-4 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {group.title}
                </div>
              )}
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      title={collapsed ? item.label : undefined}
                      className={[
                        "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition",
                        collapsed ? "justify-center" : "",
                        active
                          ? "bg-white/15 text-white"
                          : "text-gray-400 hover:bg-white/8 hover:text-white",
                      ].join(" ")}
                    >
                      <Icon size={16} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-2 py-2 space-y-1">
        <ThemeToggle compact={collapsed} />
        <form action={signOut}>
          <button
            type="submit"
            title={collapsed ? "Sair" : undefined}
            className={[
              "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <LogOut size={16} />
            {!collapsed && <span>Sair</span>}
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
          <div className="relative h-full">{sidebar}</div>
        </div>
      ) : null}
    </>
  );
}
