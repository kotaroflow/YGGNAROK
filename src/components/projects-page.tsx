"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  FolderPlus,
  Trash2,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Edit3,
} from "lucide-react";
import { useProjects } from "@/lib/use-projects";

export function ProjectsPage() {
  const router = useRouter();
  const { projects, mounted, createProject, updateProject, deleteProject } = useProjects();

  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPath, setNewPath] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const project = createProject(newName.trim(), newDescription.trim() || undefined, newPath.trim() || undefined);
    setNewName("");
    setNewDescription("");
    setNewPath("");
    setShowNewForm(false);
    setExpandedProjects((prev) => ({ ...prev, [project.id]: true }));
  }

  function toggleExpand(id: string) {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function startEdit(id: string, currentName: string) {
    setEditingId(id);
    setEditName(currentName);
  }

  function saveEdit(id: string) {
    if (editName.trim()) updateProject(id, { name: editName.trim() });
    setEditingId(null);
  }

  if (!mounted) return null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-8 py-5">
        <div>
          <h1 className="text-[18px] font-semibold text-foreground">Projetos</h1>
          <p className="mt-0.5 text-[13px] text-muted">
            Organize suas conversas em projetos — como pastas de trabalho dedicadas.
          </p>
        </div>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-[13px] font-medium text-foreground transition hover:bg-brand-strong"
        >
          <FolderPlus size={15} />
          Novo projeto
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {/* New Project Form */}
        {showNewForm && (
          <div className="mb-6 rounded-xl border border-brand/40 bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-foreground">Novo Projeto</h2>
              <button onClick={() => setShowNewForm(false)} className="text-muted hover:text-foreground transition">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-muted">Nome do projeto *</label>
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex.: YGGNAROK, codex2, prompts e reescritas..."
                  className="w-full rounded-lg border border-line bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-muted">
                  Caminho / Local <span className="text-muted font-normal">(opcional)</span>
                </label>
                <input
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  placeholder="Ex.: C:\projetos\meu-app ou /workspace/yggnarok"
                  className="w-full rounded-lg border border-line bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted focus:border-brand focus:outline-none font-mono"
                />
                <p className="mt-1 text-[11px] text-muted">
                  Referência ao local das conversas deste projeto
                </p>
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-muted">
                  Descrição <span className="text-muted font-normal">(opcional)</span>
                </label>
                <input
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Breve descrição do projeto..."
                  className="w-full rounded-lg border border-line bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted focus:border-brand focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowNewForm(false)}
                  className="rounded-lg border border-line px-4 py-2 text-[13px] text-foreground transition hover:bg-line/30"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="rounded-lg bg-brand px-4 py-2 text-[13px] font-medium text-foreground transition hover:bg-brand-strong disabled:opacity-40"
                >
                  Criar projeto
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects list */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 grid size-16 place-items-center rounded-2xl bg-line/40">
              <FolderOpen size={28} className="text-muted" />
            </div>
            <p className="text-[15px] font-medium text-foreground">Nenhum projeto ainda</p>
            <p className="mt-1 text-[13px] text-muted">
              Crie um projeto para organizar suas conversas por contexto ou área de trabalho.
            </p>
            <button
              onClick={() => setShowNewForm(true)}
              className="mt-5 flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-brand-strong"
            >
              <Plus size={15} />
              Criar primeiro projeto
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => {
              const isExpanded = expandedProjects[project.id];
              return (
                <div
                  key={project.id}
                  className="rounded-xl border border-line bg-surface overflow-hidden"
                >
                  {/* Project header */}
                  <div className="flex items-center gap-3 p-4">
                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="flex flex-1 items-center gap-3 text-left"
                    >
                      <div className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand">
                        <FolderOpen size={17} />
                      </div>
                      <div className="flex-1 min-w-0">
                        {editingId === project.id ? (
                          <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={() => saveEdit(project.id)}
                            onKeyDown={(e) => e.key === "Enter" && saveEdit(project.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full rounded border border-brand bg-background px-2 py-0.5 text-[14px] font-semibold text-foreground focus:outline-none"
                          />
                        ) : (
                          <p className="text-[14px] font-semibold text-foreground truncate">{project.name}</p>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                          {project.path && (
                            <span className="text-[11px] font-mono text-muted truncate">{project.path}</span>
                          )}
                          <span className="text-[11px] text-muted">
                            {project.conversations.length === 0
                              ? "Nenhum chat"
                              : `${project.conversations.length} chat${project.conversations.length > 1 ? "s" : ""}`}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={15} className="text-muted shrink-0" />
                      ) : (
                        <ChevronRight size={15} className="text-muted shrink-0" />
                      )}
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(project.id, project.name)}
                        className="grid size-7 place-items-center rounded-md text-muted hover:bg-line/40 hover:text-foreground transition"
                        title="Renomear"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => router.push(`/chat?project=${project.id}`)}
                        className="grid size-7 place-items-center rounded-md text-muted hover:bg-line/40 hover:text-foreground transition"
                        title="Novo chat neste projeto"
                      >
                        <Plus size={13} />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="grid size-7 place-items-center rounded-md text-muted hover:bg-red-50 hover:text-red-500 transition"
                        title="Excluir projeto"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Conversations */}
                  {isExpanded && (
                    <div className="border-t border-line">
                      {project.conversations.length === 0 ? (
                        <div className="flex items-center justify-between px-5 py-4">
                          <p className="text-[12px] text-muted">Nenhum chat neste projeto ainda.</p>
                          <button
                            onClick={() => router.push(`/chat?project=${project.id}`)}
                            className="flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-[12px] font-medium text-brand transition hover:bg-brand/20"
                          >
                            <Plus size={12} />
                            Novo chat
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-line">
                          {project.conversations.map((conv) => (
                            <button
                              key={conv.id}
                              onClick={() => router.push(`/chat?project=${project.id}&conv=${conv.id}`)}
                              className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-line/20 transition"
                            >
                              <MessageSquare size={14} className="shrink-0 text-muted" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-foreground truncate">{conv.title}</p>
                                {conv.lastMessage && (
                                  <p className="text-[11px] text-muted truncate">{conv.lastMessage}</p>
                                )}
                              </div>
                              <span className="text-[11px] text-muted shrink-0">
                                {new Date(conv.updatedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
