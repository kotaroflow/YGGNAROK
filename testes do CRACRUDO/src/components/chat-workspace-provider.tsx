"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ChatConversationRow, ChatProjectRow } from "@/server/chat/repository";
import { markRemoteImported, readLocalImportBundle, wasRemoteImported } from "@/lib/chat-local-backup";

export type ProjectConversation = {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: number;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  path?: string;
  createdAt: number;
  updatedAt: number;
  conversations: ProjectConversation[];
};

export type RecentChat = {
  id: string;
  title: string;
  href: string;
  pinned?: boolean;
  updatedAt: number;
  projectId?: string | null;
};

type WorkspaceMode = "loading" | "local" | "remote";

type WorkspaceContextValue = {
  mode: WorkspaceMode;
  projects: Project[];
  recents: RecentChat[];
  mounted: boolean;
  refresh: () => Promise<void>;
  createProject: (name: string, description?: string, path?: string) => Project;
  updateProject: (id: string, updates: Partial<Pick<Project, "name" | "description" | "path">>) => void;
  deleteProject: (id: string) => void;
  addConversationToProject: (projectId: string, conversationId: string, title: string) => void;
  removeConversationFromProject: (projectId: string, conversationId: string) => void;
  addChat: (chat: Omit<RecentChat, "updatedAt">, skipRemote?: boolean) => void;
  pinChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  removeChat: (id: string) => void;
  createConversation: (input?: { title?: string; projectId?: string | null }) => Promise<string>;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const PROJECTS_KEY = "yggnarok.projects.v1";
const RECENTS_KEY = "yggnarok.recent-chats.v1";

function uid() {
  return crypto.randomUUID();
}

function loadLocalProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

function saveLocalProjects(projects: Project[]) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch {
    // ignore
  }
}

function loadLocalRecents(): RecentChat[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    return raw ? (JSON.parse(raw) as RecentChat[]) : [];
  } catch {
    return [];
  }
}

function saveLocalRecents(recents: RecentChat[]) {
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
  } catch {
    // ignore
  }
}

function sortRecents(recents: RecentChat[]) {
  return [...recents].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });
}

function mapRemote(projects: ChatProjectRow[], conversations: ChatConversationRow[]) {
  const recents: RecentChat[] = conversations.map((c) => ({
    id: c.id,
    title: c.title,
    href: `/chat?conv=${c.id}`,
    pinned: c.pinned,
    updatedAt: new Date(c.updated_at).getTime(),
    projectId: c.project_id,
  }));

  const projectsMapped: Project[] = projects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    path: p.path_label ?? undefined,
    createdAt: new Date(p.created_at).getTime(),
    updatedAt: new Date(p.updated_at).getTime(),
    conversations: conversations
      .filter((c) => c.project_id === p.id)
      .map((c) => ({
        id: c.id,
        title: c.title,
        lastMessage: c.last_message_preview ?? "",
        updatedAt: new Date(c.updated_at).getTime(),
      })),
  }));

  return { projects: projectsMapped, recents: sortRecents(recents) };
}

export function ChatWorkspaceProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<WorkspaceMode>("loading");
  const [projects, setProjects] = useState<Project[]>([]);
  const [recents, setRecents] = useState<RecentChat[]>([]);
  const [mounted, setMounted] = useState(false);

  const applyLocal = useCallback(() => {
    setMode("local");
    setProjects(loadLocalProjects());
    setRecents(sortRecents(loadLocalRecents()));
    setMounted(true);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/workspace", { cache: "no-store" });
      if (res.status === 401) {
        applyLocal();
        return;
      }
      if (!res.ok) throw new Error("workspace fetch failed");

      let payload = (await res.json()) as {
        mode: "remote";
        projects: ChatProjectRow[];
        conversations: ChatConversationRow[];
        idMap?: Record<string, string>;
      };

      if (!wasRemoteImported()) {
        const bundle = readLocalImportBundle();
        const hasLocal =
          bundle.projects.length > 0 ||
          bundle.recents.length > 0 ||
          Object.keys(bundle.histories).length > 0;

        if (hasLocal) {
          const importRes = await fetch("/api/chat/workspace", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bundle),
          });
          if (importRes.ok) {
            payload = (await importRes.json()) as typeof payload;
            markRemoteImported();
          }
        } else {
          markRemoteImported();
        }
      }

      const mapped = mapRemote(payload.projects ?? [], payload.conversations ?? []);
      setMode("remote");
      setProjects(mapped.projects);
      setRecents(mapped.recents);
      setMounted(true);
    } catch {
      applyLocal();
    }
  }, [applyLocal]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void refresh();
    }, 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  useEffect(() => {
    if (!mounted) return;
    saveLocalProjects(projects);
  }, [projects, mounted]);

  useEffect(() => {
    if (!mounted) return;
    saveLocalRecents(recents);
  }, [recents, mounted]);

  const createProject = useCallback(
    (name: string, description?: string, path?: string): Project => {
      if (mode === "remote") {
        const optimistic: Project = {
          id: uid(),
          name,
          description,
          path,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          conversations: [],
        };
        setProjects((prev) => [optimistic, ...prev]);
        void fetch("/api/chat/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, path_label: path }),
        }).then(() => refresh());
        return optimistic;
      }

      const project: Project = {
        id: uid(),
        name,
        description,
        path,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        conversations: [],
      };
      setProjects((prev) => [project, ...prev]);
      return project;
    },
    [mode, refresh],
  );

  const updateProject = useCallback(
    (id: string, updates: Partial<Pick<Project, "name" | "description" | "path">>) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...updates,
                updatedAt: Date.now(),
              }
            : p,
        ),
      );
      if (mode === "remote") {
        void fetch("/api/chat/projects", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            name: updates.name,
            description: updates.description,
            path_label: updates.path,
          }),
        }).then(() => refresh());
      }
    },
    [mode, refresh],
  );

  const deleteProject = useCallback(
    (id: string) => {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (mode === "remote") {
        void fetch(`/api/chat/projects?id=${encodeURIComponent(id)}`, { method: "DELETE" }).then(() =>
          refresh(),
        );
      }
    },
    [mode, refresh],
  );

  const addConversationToProject = useCallback(
    (projectId: string, conversationId: string, title: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== projectId) return p;
          const exists = p.conversations.some((c) => c.id === conversationId);
          const conversations = exists
            ? p.conversations
            : [
                {
                  id: conversationId,
                  title,
                  lastMessage: "",
                  updatedAt: Date.now(),
                },
                ...p.conversations,
              ];
          return { ...p, conversations, updatedAt: Date.now() };
        }),
      );

      setRecents((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, projectId, title } : c)),
      );

      if (mode === "remote") {
        void fetch("/api/chat/conversations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: conversationId, project_id: projectId, title }),
        }).then(() => refresh());
      }
    },
    [mode, refresh],
  );

  const removeConversationFromProject = useCallback(
    (projectId: string, conversationId: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                conversations: p.conversations.filter((c) => c.id !== conversationId),
              }
            : p,
        ),
      );
      if (mode === "remote") {
        void fetch("/api/chat/conversations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: conversationId, project_id: null }),
        }).then(() => refresh());
      }
    },
    [mode, refresh],
  );

  const addChat = useCallback(
    (chat: Omit<RecentChat, "updatedAt">, skipRemote = false) => {
      setRecents((prev) =>
        sortRecents([{ ...chat, updatedAt: Date.now() }, ...prev.filter((c) => c.id !== chat.id)]),
      );
      if (mode === "remote" && !skipRemote) {
        // If it already exists in the recents list, let's PATCH it to update the title!
        // Otherwise, if it's completely new, we can POST it to create it.
        const exists = recents.some((c) => c.id === chat.id);
        if (exists) {
          void fetch("/api/chat/conversations", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: chat.id,
              title: chat.title,
              project_id: chat.projectId !== undefined ? chat.projectId : undefined,
              last_message_preview: chat.title,
            }),
          }).then(() => refresh());
        } else {
          void fetch("/api/chat/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: chat.id,
              title: chat.title,
              project_id: chat.projectId ?? null,
              last_message_preview: chat.title,
            }),
          }).then(() => refresh());
        }
      }
    },
    [mode, recents, refresh],
  );

  const pinChat = useCallback(
    (id: string) => {
      setRecents((prev) =>
        sortRecents(
          prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned, updatedAt: Date.now() } : c)),
        ),
      );
      const chat = recents.find((c) => c.id === id);
      if (mode === "remote" && chat) {
        void fetch("/api/chat/conversations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, pinned: !chat.pinned }),
        }).then(() => refresh());
      }
    },
    [mode, recents, refresh],
  );

  const renameChat = useCallback(
    (id: string, title: string) => {
      setRecents((prev) => prev.map((c) => (c.id === id ? { ...c, title, updatedAt: Date.now() } : c)));
      setProjects((prev) =>
        prev.map((p) => ({
          ...p,
          conversations: p.conversations.map((c) => (c.id === id ? { ...c, title } : c)),
        })),
      );
      if (mode === "remote") {
        void fetch("/api/chat/conversations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, title }),
        }).then(() => refresh());
      }
    },
    [mode, refresh],
  );

  const removeChat = useCallback(
    (id: string) => {
      setRecents((prev) => prev.filter((c) => c.id !== id));
      setProjects((prev) =>
        prev.map((p) => ({
          ...p,
          conversations: p.conversations.filter((c) => c.id !== id),
        })),
      );
      if (mode === "remote") {
        void fetch(`/api/chat/conversations?id=${encodeURIComponent(id)}`, { method: "DELETE" }).then(
          () => refresh(),
        );
      }
    },
    [mode, refresh],
  );

  const createConversation = useCallback(
    async (input?: { title?: string; projectId?: string | null }) => {
      if (mode === "remote") {
        try {
          const res = await fetch("/api/chat/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: input?.title ?? "Nova conversa",
              project_id: input?.projectId ?? null,
            }),
          });
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          const payload = (await res.json()) as { conversation: { id: string; title: string } };
          const id = payload.conversation.id;
          addChat({
            id,
            title: payload.conversation.title,
            href: `/chat?conv=${id}`,
            projectId: input?.projectId ?? null,
          }, true); // skip remote sync because it was just POSTed!
          await refresh();
          return id;
        } catch (e) {
          console.warn("Falha ao criar conversa no banco remoto, criando localmente:", e);
        }
      }

      const id = uid();
      addChat({
        id,
        title: input?.title ?? "Nova conversa",
        href: `/chat?conv=${id}`,
        projectId: input?.projectId ?? null,
      });
      return id;
    },
    [addChat, mode, refresh],
  );

  const value = useMemo(
    () => ({
      mode,
      projects,
      recents,
      mounted,
      refresh,
      createProject,
      updateProject,
      deleteProject,
      addConversationToProject,
      removeConversationFromProject,
      addChat,
      pinChat,
      renameChat,
      removeChat,
      createConversation,
    }),
    [
      mode,
      projects,
      recents,
      mounted,
      refresh,
      createProject,
      updateProject,
      deleteProject,
      addConversationToProject,
      removeConversationFromProject,
      addChat,
      pinChat,
      renameChat,
      removeChat,
      createConversation,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useChatWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useChatWorkspace deve ser usado dentro de ChatWorkspaceProvider");
  return ctx;
}

/** @deprecated use useChatWorkspace — mantido para imports existentes */
export function useProjects() {
  const ws = useChatWorkspace();
  return {
    projects: ws.projects,
    mounted: ws.mounted,
    createProject: ws.createProject,
    updateProject: ws.updateProject,
    deleteProject: ws.deleteProject,
    addConversation: (projectId: string, title: string, lastMessage = "") => {
      const convId = crypto.randomUUID();
      ws.addConversationToProject(projectId, convId, title);
      return {
        id: convId,
        title,
        lastMessage,
        updatedAt: Date.now(),
      };
    },
    removeConversation: ws.removeConversationFromProject,
  };
}

/** @deprecated use useChatWorkspace */
export function useRecentChats() {
  const ws = useChatWorkspace();
  return {
    chats: ws.recents,
    mounted: ws.mounted,
    pin: ws.pinChat,
    rename: ws.renameChat,
    remove: ws.removeChat,
    addChat: ws.addChat,
  };
}
