"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X, LogOut, MessageSquare, Briefcase, Terminal, Plus, Library, Bot, RefreshCw, ArrowRight, Settings, Globe, HelpCircle, ArrowUpCircle, Download, Info, FolderOpen, FolderPlus, MoreHorizontal, Pin, Pencil, FolderSymlink, Trash2, Moon, Sun } from "lucide-react";
import { Suspense, useEffect, useMemo, useState, useRef, useCallback } from "react";
import { hasPermission, type PermissionContext } from "@/lib/permissions";
import { sidebarGroups } from "@/lib/navigation";
import { ThemeToggle } from "./theme-toggle";
import { signOut } from "@/server/actions/auth";
import { useChatWorkspace } from "@/components/chat-workspace-provider";
import type { RecentChat } from "@/lib/use-recent-chats";

const storageKey = "ygn-sidebar-state";
const mobileStorageKey = "ygn-sidebar-mobile-open";

const visibleItemLimits: Record<string, number> = {
  iriguchi: 4,
  "ura-ichiba": 3,
  "sosaku-kobo": 6,
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
  width?: number;
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

// ─── Recent Chat Item (Claude-style) ────────────────────────────────────────

function RecentChatItem({
  chat,
  onDelete,
  onRename,
  onPin,
  onAddToProject,
  projects,
}: {
  chat: RecentChat & { active?: boolean };
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onPin: (id: string) => void;
  onAddToProject: (chatId: string, projectId: string) => void;
  projects: { id: string; name: string }[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(chat.title);
  const menuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setShowProjectPicker(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus input when renaming starts
  useEffect(() => {
    if (isRenaming) renameInputRef.current?.focus();
  }, [isRenaming]);

  function submitRename() {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== chat.title) onRename(chat.id, trimmed);
    setIsRenaming(false);
  }

  return (
    <div
      className={`group relative mx-1 flex min-h-9 items-center rounded-lg px-3 text-[13px] transition ${
        chat.active
          ? "bg-sidebar-active text-sidebar-text font-medium"
          : "text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text"
      }`}
    >
      {/* Circle / pin indicator */}
      <button
        type="button"
        onClick={() => onPin(chat.id)}
        title={chat.pinned ? "Desafixar" : "Fixar"}
        className={`mr-2.5 flex size-3.5 shrink-0 items-center justify-center rounded-full border transition hover:border-brand ${
          chat.pinned ? "border-brand bg-brand/10" : chat.active ? "border-brand" : "border-sidebar-text-muted/40"
        }`}
      >
        {chat.pinned && <span className="size-1.5 rounded-full bg-brand" />}
      </button>

      {/* Title / Rename input */}
      {isRenaming ? (
        <input
          ref={renameInputRef}
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onBlur={submitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") submitRename();
            if (e.key === "Escape") { setRenameValue(chat.title); setIsRenaming(false); }
          }}
          className="flex-1 truncate bg-transparent text-[13px] text-sidebar-text focus:outline-none"
        />
      ) : (
        <Link href={chat.href} className="flex-1 truncate">
          {chat.title}
        </Link>
      )}

      {/* ⋮ Menu */}
      <div ref={menuRef} className="relative ml-1 shrink-0">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); setMenuOpen((v) => !v); setShowProjectPicker(false); }}
          className={`grid size-6 place-items-center rounded-md transition ${
            menuOpen
              ? "bg-sidebar-hover text-sidebar-text opacity-100"
              : "text-muted opacity-0 group-hover:opacity-100 hover:bg-sidebar-hover hover:text-sidebar-text"
          }`}
          aria-label="Opções"
        >
          <MoreHorizontal size={13} />
        </button>

        {/* Context Menu */}
        {menuOpen && !showProjectPicker && (
          <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl border border-sidebar-hover bg-sidebar shadow-lg overflow-hidden py-1">
            <button
              type="button"
              onClick={() => { onPin(chat.id); setMenuOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-sidebar-text hover:bg-sidebar-hover transition"
            >
              <Pin size={13} className="text-muted" />
              {chat.pinned ? "Desafixar" : "Fixar"}
            </button>
            <button
              type="button"
              onClick={() => { setIsRenaming(true); setMenuOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-sidebar-text hover:bg-sidebar-hover transition"
            >
              <Pencil size={13} className="text-muted" /> Mudar o nome
            </button>
            <button
              type="button"
              onClick={() => setShowProjectPicker(true)}
              className="flex w-full items-center justify-between gap-2.5 px-3 py-2 text-[13px] text-sidebar-text hover:bg-sidebar-hover transition"
            >
              <span className="flex items-center gap-2.5">
                <FolderSymlink size={13} className="text-muted" /> Adicionar ao projeto
              </span>
              <ChevronRight size={11} className="text-muted" />
            </button>
            <div className="mx-3 my-1 h-px bg-sidebar-hover" />
            <button
              type="button"
              onClick={() => { onDelete(chat.id); setMenuOpen(false); }}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-red-400 hover:bg-sidebar-hover transition"
            >
              <Trash2 size={13} /> Apagar
            </button>
          </div>
        )}

        {/* Project Picker submenu */}
        {menuOpen && showProjectPicker && (
          <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl border border-sidebar-hover bg-sidebar shadow-lg overflow-hidden py-1">
            <button
              type="button"
              onClick={() => setShowProjectPicker(false)}
              className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-muted hover:bg-sidebar-hover transition"
            >
              <ChevronLeft size={12} /> Voltar
            </button>
            <div className="mx-3 mb-1 h-px bg-sidebar-hover" />
            {projects.length === 0 ? (
              <Link
                href="/projetos"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-brand hover:bg-sidebar-hover transition"
              >
                <FolderPlus size={13} /> Criar projeto
              </Link>
            ) : (
              projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { onAddToProject(chat.id, p.id); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-[13px] text-sidebar-text hover:bg-sidebar-hover transition"
                >
                  <FolderOpen size={13} className="shrink-0 text-brand/70" />
                  <span className="truncate">{p.name}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Recent chats list ───────────────────────────────────────────────────────

function RecentsTab() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeConv = searchParams.get("conv");
  const { recents: chats, mounted, pinChat: pin, renameChat: rename, removeChat: remove, projects, addConversationToProject } =
    useChatWorkspace();

  function handleAddToProject(chatId: string, projectId: string) {
    const chat = chats.find((c) => c.id === chatId);
    if (!chat) return;
    addConversationToProject(projectId, chatId, chat.title);
  }

  if (!mounted) {
    return <p className="px-3 py-2 text-[12px] text-stone-500">Carregando…</p>;
  }

  if (!chats.length) {
    return <p className="px-3 py-2 text-[12px] text-stone-500">Nenhum chat recente.</p>;
  }

  const projectOptions = projects.map((p) => ({ id: p.id, name: p.name }));

  return (
    <>
      {chats.map((chat) => (
        <RecentChatItem
          key={chat.id}
          chat={{
            ...chat,
            active:
              pathname === "/chat" &&
              (activeConv ? activeConv === chat.id : chats[0]?.id === chat.id),
          }}
          onDelete={remove}
          onRename={rename}
          onPin={pin}
          onAddToProject={handleAddToProject}
          projects={projectOptions}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ProjectsSection({ collapsed }: { collapsed: boolean }) {
  const { projects, mounted } = useChatWorkspace();
  const [expanded, setExpanded] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  function toggleProject(id: string) {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (!mounted || collapsed) {
    return (
      <Link
        href="/projetos"
        className="flex h-9 items-center gap-2.5 rounded-lg px-3 mx-1 text-[13px] font-medium text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text transition"
        title="Projetos"
      >
        <FolderOpen size={16} className="text-muted" />
        {!collapsed && "Projetos"}
      </Link>
    );
  }

  return (
    <div className="mx-1">
      {/* Section header */}
      <div className="flex h-9 items-center justify-between rounded-lg px-3 hover:bg-sidebar-hover group transition">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex flex-1 items-center gap-2.5 text-[13px] font-medium text-sidebar-text-muted hover:text-sidebar-text"
        >
          <FolderOpen size={16} className="text-muted" />
          Projetos
        </button>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
          <Link
            href="/projetos"
            className="grid size-5 place-items-center rounded text-muted hover:text-sidebar-text transition"
            title="Ver todos os projetos"
          >
            <FolderPlus size={13} />
          </Link>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="grid size-5 place-items-center rounded text-muted hover:text-sidebar-text transition"
          >
            {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        </div>
      </div>

      {/* Projects list */}
      {expanded && (
        <div className="mt-0.5 space-y-0.5">
          {projects.length === 0 ? (
            <Link
              href="/projetos"
              className="flex h-8 items-center gap-2 rounded-lg px-3 ml-2 text-[12px] text-muted hover:text-sidebar-text transition"
            >
              <span className="text-muted">Nenhum projeto —</span>
              <span className="text-brand">criar</span>
            </Link>
          ) : (
            projects.map((project) => (
              <div key={project.id}>
                <button
                  onClick={() => toggleProject(project.id)}
                  className="flex w-full h-8 items-center gap-2 rounded-lg px-3 ml-2 text-[12px] font-medium text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text transition"
                >
                  {expandedProjects[project.id] ? (
                    <ChevronDown size={11} className="shrink-0 text-muted" />
                  ) : (
                    <ChevronRight size={11} className="shrink-0 text-muted" />
                  )}
                  <FolderOpen size={13} className="shrink-0 text-brand/70" />
                  <span className="truncate flex-1 text-left">{project.name}</span>
                </button>

                {expandedProjects[project.id] && (
                  <div className="ml-6 mt-0.5 space-y-0.5">
                    {project.conversations.length === 0 ? (
                      <Link
                        href={`/chat?project=${project.id}`}
                        className="flex h-7 items-center gap-2 rounded-lg px-3 text-[11px] text-muted hover:text-sidebar-text transition"
                      >
                        Nenhum chat
                      </Link>
                    ) : (
                      project.conversations.slice(0, 5).map((conv) => (
                        <Link
                          key={conv.id}
                          href={`/chat?project=${project.id}&conv=${conv.id}`}
                          className="flex h-7 items-center gap-2 rounded-lg px-3 text-[12px] text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text transition"
                        >
                          <MessageSquare size={11} className="shrink-0 text-muted" />
                          <span className="truncate">{conv.title}</span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Theme Toggle (inline for sidebar popover) ──────────────────────────────

function ThemeToggleInline() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("ygn-theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("ygn-theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[13px] text-sidebar-text hover:bg-sidebar-hover"
    >
      <div className="flex items-center gap-2">
        {dark ? <Moon size={14} className="text-muted" /> : <Sun size={14} className="text-muted" />}
        {dark ? "Modo escuro" : "Modo claro"}
      </div>
      <div className="flex h-5 w-9 items-center rounded-full bg-sidebar-hover p-0.5 transition">
        <div className={`size-4 rounded-full bg-brand shadow-sm transition-transform ${dark ? "translate-x-4" : "translate-x-0"}`} />
      </div>
    </button>
  );
}

export function Sidebar({ 
  user,
  defaultCollapsed = false,
  defaultWidth = 288
}: { 
  user: PermissionContext | null;
  defaultCollapsed?: boolean;
  defaultWidth?: number;
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(defaultExpandedGroups);
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const [sidebarWidth, setSidebarWidth] = useState(defaultWidth);
  const [isMounted, setIsMounted] = useState(false);
  const [transitionsEnabled, setTransitionsEnabled] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSidebarClick = (e: React.MouseEvent) => {
    // Triple click detector: opens/expands the sidebar
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    
    if (clickCountRef.current === 3) {
      clickCountRef.current = 0;
      if (collapsed) {
        setCollapsed(false);
        if (typeof window !== "undefined") {
          const current = readSavedSidebarState();
          localStorage.setItem(storageKey, JSON.stringify({ ...current, collapsed: false }));
        }
      }
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 400);

    // Empty space click detector: closes/collapses the sidebar
    if (!collapsed) {
      let target = e.target as HTMLElement | null;
      let isInteractive = false;
      while (target && target !== sidebarRef.current) {
        const tagName = target.tagName.toUpperCase();
        if (
          tagName === "A" || 
          tagName === "BUTTON" || 
          tagName === "INPUT" || 
          tagName === "TEXTAREA" ||
          tagName === "FORM" ||
          target.getAttribute("role") === "button" ||
          target.classList.contains("cursor-pointer") ||
          target.classList.contains("cursor-col-resize")
        ) {
          isInteractive = true;
          break;
        }
        target = target.parentElement;
      }

      if (!isInteractive) {
        setCollapsed(true);
        if (typeof window !== "undefined") {
          const current = readSavedSidebarState();
          localStorage.setItem(storageKey, JSON.stringify({ ...current, collapsed: true }));
        }
      }
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedState = readSavedSidebarState();
    if (savedState.collapsed !== undefined) {
      setCollapsed(savedState.collapsed);
    }
    if (savedState.width !== undefined) {
      setSidebarWidth(savedState.width);
    }
    if (savedState.expandedGroups !== undefined) {
      setExpandedGroups(prev => ({ ...prev, ...savedState.expandedGroups }));
    }
    if (savedState.showAll !== undefined) {
      setShowAll(savedState.showAll);
    }
    setMobileOpen(readSavedMobileOpen());

    // Enable transitions after a tiny delay to avoid the hydration/mount visual flash
    const timer = setTimeout(() => {
      setTransitionsEnabled(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(220, Math.min(e.clientX, 500));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

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
    if (!isMounted) return;
    if (typeof window === "undefined") {
      return;
    }

    // Save to localStorage as backup
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        collapsed,
        expandedGroups,
        showAll,
        width: sidebarWidth,
      }),
    );

    // Save to cookies to prevent SSR/hydration visual flash (F5 bug)
    document.cookie = `ygn_sidebar_collapsed=${collapsed}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `ygn_sidebar_width=${sidebarWidth}; path=/; max-age=31536000; SameSite=Lax`;
  }, [collapsed, expandedGroups, showAll, sidebarWidth, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(mobileStorageKey, String(mobileOpen));
  }, [mobileOpen, isMounted]);

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

  // Derive active tab from pathname OR saved preference
  const pathname = usePathname();
  const [activeTab, setActiveTabRaw] = useState<"chat" | "criacao" | "mercado">(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("ygn-sidebar-tab");
      if (saved === "chat" || saved === "criacao" || saved === "mercado") return saved;
    }
    return "chat";
  });

  // Persist active tab
  const setActiveTab = useCallback((tab: "chat" | "criacao" | "mercado") => {
    setActiveTabRaw(tab);
    if (typeof window !== "undefined") window.localStorage.setItem("ygn-sidebar-tab", tab);
  }, []);

  // Auto-switch tab based on current pathname
  useEffect(() => {
    if (!isMounted) return;
    const criacaoHrefs = ["/criar-conteudo", "/postagem-manual", "/biblioteca", "/midias", "/agentes-ia", "/continuidade-ia", "/ideias", "/roteiros", "/prompts", "/legendas", "/hashtags", "/lixeira-inteligente"];
    const mercadoHrefs = ["/vendas", "/produtos", "/afiliados", "/links", "/campanhas", "/comissoes", "/oportunidades", "/relatorios-comerciais"];
    if (criacaoHrefs.some(h => pathname.startsWith(h))) {
      setActiveTabRaw("criacao");
    } else if (mercadoHrefs.some(h => pathname.startsWith(h))) {
      setActiveTabRaw("mercado");
    }
  }, [pathname, isMounted]);

  const sidebar = (
    <aside
      ref={sidebarRef}
      onClick={handleSidebarClick}
      style={{ 
        width: collapsed ? "4.5rem" : `${sidebarWidth}px`, 
        transition: (isResizing || !transitionsEnabled) ? "none" : "width 0.2s" 
      }}
      className="relative flex h-[calc(100%-16px)] my-2 ml-2 flex-col bg-sidebar text-sidebar-text-muted shrink-0 rounded-xl"
    >
      {/* Resizer Handle */}
      {!collapsed && (
        <div
          onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
          className="absolute top-0 right-0 bottom-0 w-1.5 cursor-col-resize hover:bg-brand/50 z-50"
        />
      )}
      {/* Top Header (Brand & Collapse Button) */}
      <div className="flex h-14 shrink-0 items-center justify-between px-4">
        {!collapsed ? (
          <>
            <div className="text-[12px] font-semibold text-brand tracking-wide">YGGNAROK</div>
            <button
              onClick={() => setCollapsed(true)}
              className="grid size-8 place-items-center rounded-lg hover:bg-sidebar-hover text-sidebar-text-muted hover:text-sidebar-text transition"
              title="Recolher Sidebar"
            >
              <Menu size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto grid size-8 place-items-center rounded-lg hover:bg-sidebar-hover text-sidebar-text-muted hover:text-sidebar-text transition"
            title="Expandir Sidebar"
          >
            <Menu size={16} />
          </button>
        )}
      </div>

      {!collapsed && (
        <>
          {/* Tabs */}
          <div className="px-3 pb-2">
            <div className="flex h-9 rounded-lg bg-black/20 p-1">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 rounded-md text-[12px] font-medium flex items-center justify-center gap-1.5 transition ${activeTab === "chat" ? "bg-sidebar-hover text-sidebar-text shadow-sm" : "text-sidebar-text-muted hover:text-sidebar-text"}`}
              >
                <MessageSquare size={14} />
                Chat
              </button>
              <button
                onClick={() => setActiveTab("criacao")}
                className={`flex-1 rounded-md text-[12px] font-medium flex items-center justify-center gap-1.5 transition ${activeTab === "criacao" ? "bg-sidebar-hover text-sidebar-text shadow-sm" : "text-sidebar-text-muted hover:text-sidebar-text"}`}
              >
                <Bot size={14} />
                Criação
              </button>
              <button
                onClick={() => setActiveTab("mercado")}
                className={`flex-1 rounded-md text-[12px] font-medium flex items-center justify-center gap-1.5 transition ${activeTab === "mercado" ? "bg-sidebar-hover text-sidebar-text shadow-sm" : "text-sidebar-text-muted hover:text-sidebar-text"}`}
              >
                <Briefcase size={14} />
                Mercado
              </button>
            </div>
          </div>

          {/* Main Links */}
          <div className="px-2 py-2 space-y-0.5">
            <Link href="/chat" className="flex h-9 items-center gap-2.5 rounded-lg px-3 mx-1 text-[13px] font-medium text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text transition">
              <Plus size={16} className="text-muted" />
              Novo chat
            </Link>
            <ProjectsSection collapsed={collapsed} />
          </div>

          {/* Recents / Dynamic List */}
          <div className="mt-4 flex-1 overflow-y-auto px-2 overscroll-contain">
            <p className="px-3 pb-1.5 text-[10px] uppercase tracking-[0.06em] font-medium text-muted">
              {activeTab === "chat" ? "Recentes" : activeTab === "criacao" ? "Criação & IA" : "Comercial"}
            </p>
            <div className="space-y-0.5">
              {activeTab === "chat" ? (
              <Suspense fallback={<p className="px-3 py-2 text-[12px] text-stone-500">Carregando…</p>}>
                <RecentsTab />
              </Suspense>
              ) : activeTab === "criacao" ? (
                visibleGroups.filter(g => g.id === "sosaku-kobo").flatMap(g => g.items).map(item => (
                  <Link key={item.href} href={item.href} className="flex min-h-9 items-center gap-2.5 rounded-lg px-3 mx-1 text-[13px] font-medium text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text transition">
                    <item.icon size={14} className="shrink-0 text-muted" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))
              ) : activeTab === "mercado" ? (
                visibleGroups.filter(g => g.id === "ura-ichiba").flatMap(g => g.items).map(item => (
                  <Link key={item.href} href={item.href} className="flex min-h-9 items-center gap-2.5 rounded-lg px-3 mx-1 text-[13px] font-medium text-sidebar-text-muted hover:bg-sidebar-hover hover:text-sidebar-text transition">
                    <item.icon size={14} className="shrink-0 text-muted" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))
              ) : null}
            </div>
          </div>
        </>
      )}

      {/* Bottom Area */}
      <div className="mt-auto p-3">
        <div className="group relative flex items-center justify-between px-2 py-1.5 cursor-pointer rounded-lg hover:bg-sidebar-hover transition">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="grid size-6 place-items-center rounded-md bg-brand text-[12px] font-semibold text-white">
                K
              </div>
              <span className="text-[13px] font-medium text-sidebar-text">
                kotaro <span className="text-sidebar-text-muted opacity-80">· Free</span>
              </span>
            </div>
          ) : (
             <div className="mx-auto grid size-7 place-items-center rounded-md bg-brand text-[12px] font-semibold text-white">
                K
              </div>
          )}
          
          {/* Profile Menu Popover - opens to the RIGHT to avoid sidebar clipping */}
          <div className="absolute bottom-0 left-full ml-2 z-50 w-64 origin-bottom-left rounded-xl border border-sidebar-hover bg-sidebar p-1.5 opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible shadow-none">
            <div className="px-2 py-1.5 text-[12px] text-sidebar-text-muted select-none border-b border-sidebar-hover mb-1.5">
              naoteemteresa@gmail.com
            </div>
            
            <div className="space-y-0.5">
              <Link href="/meu-perfil" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-sidebar-text hover:bg-sidebar-hover transition-colors">
                <Globe size={14} className="text-muted" />
                <span>Meu Perfil</span>
              </Link>
              
              <Link href="/sistema" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-sidebar-text hover:bg-sidebar-hover transition-colors">
                <Settings size={14} className="text-muted" />
                <span>Configurações do OS</span>
              </Link>
              
              <Link href="/prompts" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-sidebar-text hover:bg-sidebar-hover transition-colors">
                <Library size={14} className="text-muted" />
                <span>Biblioteca de Prompts</span>
              </Link>

              <ThemeToggleInline />
            </div>
            
            <div className="my-1 border-t border-sidebar-hover"></div>
            
            <div className="space-y-0.5">
              <button 
                type="button"
                onClick={() => {
                  if (confirm("Deseja mesmo limpar todo o cache e histórico local do sistema?")) {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  }
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-red-600 dark:text-red-400 hover:bg-sidebar-hover transition-colors"
              >
                <RefreshCw size={14} />
                <span>Limpar Cache do OS</span>
              </button>
            </div>

            <div className="my-1 border-t border-sidebar-hover"></div>
            
            <form action={signOut}>
              <button type="submit" className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-sidebar-text hover:bg-sidebar-hover transition-colors">
                <LogOut size={14} className="text-muted" />
                <span>Sair</span>
              </button>
            </form>
          </div>
        </div>
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
