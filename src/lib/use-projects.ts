/**
 * useProjects — hook para gerenciar projetos e conversas
 * Persiste em localStorage. Futuramente pode ser migrado para Supabase.
 */

import { useState, useEffect, useCallback } from "react";

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
  /** Label do caminho/local escolhido pelo usuário (ex.: "YGGNAROK", "codex2") */
  path?: string;
  createdAt: number;
  updatedAt: number;
  conversations: ProjectConversation[];
};

const STORAGE_KEY = "yggnarok.projects.v1";

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function load(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

function save(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {}
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProjects(load());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) save(projects);
  }, [projects, mounted]);

  const createProject = useCallback((name: string, description?: string, path?: string): Project => {
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
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Pick<Project, "name" | "description" | "path">>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addConversation = useCallback((projectId: string, title: string, lastMessage = "") => {
    const conv: ProjectConversation = {
      id: uid(),
      title,
      lastMessage,
      updatedAt: Date.now(),
    };
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, conversations: [conv, ...p.conversations], updatedAt: Date.now() }
          : p
      )
    );
    return conv;
  }, []);

  const removeConversation = useCallback((projectId: string, conversationId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, conversations: p.conversations.filter((c) => c.id !== conversationId) }
          : p
      )
    );
  }, []);

  return {
    projects,
    mounted,
    createProject,
    updateProject,
    deleteProject,
    addConversation,
    removeConversation,
  };
}
