import type { ChatMessage } from "@/lib/chat-storage";

const PROJECTS_KEY = "yggnarok.projects.v1";
const RECENTS_KEY = "yggnarok.recent-chats.v1";
const HISTORY_PREFIX = "yggnarok.chat.history.v1.";
const LEGACY_HISTORY = "yggnarok.chat.history.v1";
const IMPORTED_KEY = "yggnarok.chat.remote-imported.v1";

export function wasRemoteImported() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(IMPORTED_KEY) === "1";
}

export function markRemoteImported() {
  try {
    localStorage.setItem(IMPORTED_KEY, "1");
  } catch {
    // ignore
  }
}

export function readLocalImportBundle() {
  if (typeof window === "undefined") {
    return { projects: [], recents: [], histories: {} as Record<string, ChatMessage[]> };
  }

  let projects: unknown[] = [];
  let recents: unknown[] = [];
  const histories: Record<string, ChatMessage[]> = {};

  try {
    const rawProjects = localStorage.getItem(PROJECTS_KEY);
    if (rawProjects) projects = JSON.parse(rawProjects) as unknown[];
  } catch {
    // ignore
  }

  try {
    const rawRecents = localStorage.getItem(RECENTS_KEY);
    if (rawRecents) recents = JSON.parse(rawRecents) as unknown[];
  } catch {
    // ignore
  }

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(HISTORY_PREFIX) || key === LEGACY_HISTORY) continue;
      const convId = key.slice(HISTORY_PREFIX.length);
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      histories[convId] = JSON.parse(raw) as ChatMessage[];
    }
    const legacy = localStorage.getItem(LEGACY_HISTORY);
    if (legacy && !Object.keys(histories).length) {
      histories.legacy = JSON.parse(legacy) as ChatMessage[];
    }
  } catch {
    // ignore
  }

  return { projects, recents, histories };
}
