"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { hasPermission, type PermissionContext } from "@/lib/permissions";
import { sidebarGroups } from "@/lib/navigation";
import { ThemeToggle } from "./theme-toggle";

const storageKey = "ygn-sidebar-state";
const mobileStorageKey = "ygn-sidebar-mobile-open";

const visibleItemLimits: Record<string, number> = {
  iriguchi: 3,
  "ura-ichiba": 4,
  "sosaku-kobo": 4,
  "sakusen-honbu": 4,
};

const defaultExpandedGroups: Record<string, boolean> = {
  iriguchi: true,
  "ura-ichiba": true,
  "sosaku-kobo": true,
  "sakusen-honbu": false,
};

type SavedSidebarState = {
  collapsed?: boolean;
  expandedGroups?: Record<string, boolean>;
  showAll?: Record<string, boolean>;
};

function readSavedSidebarState(): SavedSidebarState {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? (JSON.parse(saved) as SavedSidebarState) : {};
  } catch {
    return {};
  }
}

function readSavedMobileOpen() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(mobileStorageKey) === "true";
}

export function Sidebar({ user }: { user: PermissionContext | null }) {
  const pathname = usePathname();
  const savedState = useMemo(() => readSavedSidebarState(), []);
  const [collapsed, setCollapsed] = useState(savedState.collapsed ?? false);
  const [mobileOpen, setMobileOpen] = useState(readSavedMobileOpen);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    ...defaultExpandedGroups,
    ...savedState.expandedGroups,
  });
  const [showAll, setShowAll] = useState<Record<string, boolean>>(savedState.showAll ?? {});

  const visibleGroups = useMemo(
    () =>
      sidebarGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => !item.permission || hasPermission(user, item.permission)),
        }))
        .filter((group) => group.items.length > 0),
    [user],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        collapsed,
        expandedGroups,
        showAll,
      }),
    );
  }, [collapsed, expandedGroups, showAll]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(mobileStorageKey, String(mobileOpen));
  }, [mobileOpen]);

  function toggleGroup(id: string) {
    setExpandedGroups((current) => ({ ...current, [id]: !current[id] }));
  }

  function toggleShowAll(id: string) {
    setShowAll((current) => ({ ...current, [id]: !current[id] }));
    setExpandedGroups((current) => ({ ...current, [id]: true }));
  }

  function closeMobile() {
    setMobileOpen(false);
    window.sessionStorage.setItem(mobileStorageKey, "false");
  }

  const sidebar = (
    <aside
      className={[
        "flex h-full flex-col border-r border-black/5 bg-white/90 shadow-sm backdrop-blur-xl transition-[width] duration-200 dark:border-white/10 dark:bg-neutral-950/88",
        collapsed ? "w-20" : "w-[19rem]",
      ].join(" ")}
    >
      <div className="flex h-16 items-center gap-3 border-b border-black/5 px-4 dark:border-white/10">
        <div className="grid size-10 place-items-center rounded-md bg-slate-950 text-sm font-bold text-amber-300 shadow-sm dark:bg-amber-300 dark:text-neutral-950">
          YG
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-950 dark:text-stone-50">YGGNAROK</p>
            <p className="truncate text-xs text-slate-500 dark:text-stone-400">Painel de operacao</p>
          </div>
        ) : null}
        <button
          type="button"
          className="ml-auto hidden size-9 place-items-center rounded-md border border-slate-200/80 bg-white/70 text-slate-500 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-900/60 dark:text-stone-300 dark:hover:bg-neutral-900 lg:grid"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button
          type="button"
          className="ml-auto grid size-9 place-items-center rounded-md border border-slate-200/80 bg-white/70 text-slate-500 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-900/60 dark:text-stone-300 dark:hover:bg-neutral-900 lg:hidden"
          onClick={closeMobile}
          aria-label="Fechar navegacao"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {visibleGroups.map((group) => {
          const expanded = expandedGroups[group.id];
          const collapsedItemLimit = visibleItemLimits[group.id] ?? 5;
          const limit = showAll[group.id] ? group.items.length : collapsedItemLimit;
          const items = group.items.slice(0, limit);
          const hiddenCount = group.items.length - items.length;

          return (
            <section key={group.id} className="mb-2">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs font-semibold uppercase text-slate-500 transition hover:bg-slate-950/[0.04] dark:text-stone-400 dark:hover:bg-white/[0.05]"
                onClick={() => toggleGroup(group.id)}
                title={group.title}
              >
                <ChevronDown className={expanded ? "shrink-0" : "shrink-0 -rotate-90"} size={16} />
                {!collapsed ? (
                  <>
                    <span className="min-w-0 flex-1 truncate">{group.title}</span>
                    <span className="rounded-md bg-slate-950/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-white/[0.08] dark:text-stone-400">
                      {group.items.length}
                    </span>
                  </>
                ) : (
                  <span>{group.subtitle.slice(0, 2)}</span>
                )}
              </button>

              {expanded ? (
                <div className="mt-1 space-y-1">
                  {items.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={[
                          "group flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                          active
                            ? "bg-amber-200/85 text-slate-950 shadow-sm ring-1 ring-amber-300/60 dark:bg-amber-300 dark:text-neutral-950 dark:ring-amber-200/20"
                            : "text-slate-600 hover:bg-slate-950/[0.05] dark:text-stone-300 dark:hover:bg-white/[0.06]",
                        ].join(" ")}
                        title={`${item.label} - ${item.description}`}
                      >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed ? (
                          <span className="min-w-0">
                            <span className="block truncate font-semibold">{item.label}</span>
                            <span
                              className={[
                                "block truncate text-xs",
                                active
                                  ? "text-slate-700/70 dark:text-neutral-950/65"
                                  : "text-slate-500 group-hover:text-slate-600 dark:text-stone-500 dark:group-hover:text-stone-300",
                              ].join(" ")}
                            >
                              {item.description}
                            </span>
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}

                  {!collapsed && group.items.length > collapsedItemLimit ? (
                    <button
                      type="button"
                      className="ml-1 flex w-[calc(100%-0.25rem)] items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-950/[0.05] dark:text-stone-300 dark:hover:bg-white/[0.06]"
                      onClick={() => toggleShowAll(group.id)}
                    >
                      <Menu size={16} />
                      <span className="min-w-0 flex-1 text-left">{showAll[group.id] ? "Mostrar menos" : "Mostrar mais"}</span>
                      {!showAll[group.id] && hiddenCount > 0 ? <span className="text-xs">+{hiddenCount}</span> : null}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </section>
          );
        })}
      </nav>

      <div className="border-t border-black/5 p-3 dark:border-white/10">
        <ThemeToggle compact={collapsed} />
      </div>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-3 top-3 z-40 grid size-10 place-items-center rounded-full border border-slate-200/80 bg-white/85 shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-950/85 lg:hidden"
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
            className="absolute inset-0 bg-black/45"
            aria-label="Fechar navegacao"
            onClick={closeMobile}
          />
          <div className="relative h-full">{sidebar}</div>
        </div>
      ) : null}
    </>
  );
}
