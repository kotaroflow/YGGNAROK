/**
 * useRecentChats — gerencia o histórico de chats recentes da sidebar
 * Persiste em localStorage com suporte a pin, rename e delete.
 */
import { useState, useEffect, useCallback } from "react";

export type RecentChat = {
  id: string;
  title: string;
  href: string;
  pinned?: boolean;
  updatedAt: number;
};

const STORAGE_KEY = "yggnarok.recent-chats.v1";

function load(): RecentChat[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentChat[]) : [];
  } catch {
    return [];
  }
}

const SYNC_EVENT = "yggnarok-recent-chats-sync";

function save(chats: RecentChat[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(SYNC_EVENT));
    }
  } catch {}
}

/** Sorts: pinned first, then by updatedAt desc */
function sorted(chats: RecentChat[]): RecentChat[] {
  return [...chats].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });
}

export function useRecentChats() {
  const [chats, setChats] = useState<RecentChat[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChats(load());
    setMounted(true);

    function refresh() {
      setChats(load());
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };

    window.addEventListener(SYNC_EVENT, refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SYNC_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (mounted) save(chats);
  }, [chats, mounted]);

  const pin = useCallback((id: string) => {
    setChats((prev) =>
      sorted(prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)))
    );
  }, []);

  const rename = useCallback((id: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: Date.now() } : c))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addChat = useCallback((chat: Omit<RecentChat, "updatedAt">) => {
    setChats((prev) => sorted([{ ...chat, updatedAt: Date.now() }, ...prev.filter((c) => c.id !== chat.id)]));
  }, []);

  return { chats: sorted(chats), mounted, pin, rename, remove, addChat };
}
