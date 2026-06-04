"use client";

import { useChatWorkspace } from "@/components/chat-workspace-provider";
import { useState, useMemo } from "react";
import { Search, MessageSquare, ArrowRight, Sparkles, FolderOpen, Calendar } from "lucide-react";
import Link from "next/link";

export function BuscaClient() {
  const { recents: chats, projects, mounted } = useChatWorkspace();
  const [query, setQuery] = useState("");

  const filteredChats = useMemo(() => {
    if (!query.trim()) return [];
    return chats.filter((chat) => 
      chat.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [chats, query]);

  const filteredProjects = useMemo(() => {
    if (!query.trim()) return [];
    return projects.filter((project) => 
      project.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [projects, query]);

  const hasResults = filteredChats.length > 0 || filteredProjects.length > 0;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/20 bg-brand/5 text-brand text-xs font-medium mb-3 select-none">
          <Sparkles size={12} className="animate-pulse" />
          <span>YGGNAROK Global Search</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-foreground to-neutral-400 bg-clip-text text-transparent">
          Busca Unificada
        </h1>
        <p className="mt-2 text-sm text-muted max-w-xl">
          Procure de forma rápida e integrada em todos os seus chats recentes, tópicos e projetos ativos no OS.
        </p>
      </div>

      {/* Search Box */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <input
          type="text"
          placeholder="Digite o título do chat, palavra-chave ou projeto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-14 pl-12 pr-4 rounded-2xl border border-neutral-850 bg-neutral-900/40 text-base text-foreground placeholder:text-muted outline-none transition focus:border-brand/40 focus:ring-1 focus:ring-brand/20 shadow-md"
          autoFocus
        />
      </div>

      {/* Results section */}
      {!mounted ? (
        <div className="text-center py-12 text-sm text-muted">Carregando índice de busca…</div>
      ) : !query.trim() ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-neutral-900 rounded-2xl bg-neutral-900/10">
          <div className="grid size-12 place-items-center rounded-2xl bg-neutral-900 text-muted mb-4">
            <Search size={22} />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Inicie a sua busca</h3>
          <p className="text-xs text-muted max-w-xs leading-relaxed">
            Digite acima para varrer instantaneamente o seu histórico de conversas e estruturas organizadas do sistema.
          </p>
        </div>
      ) : !hasResults ? (
        <div className="text-center py-16 border border-dashed border-neutral-900 rounded-2xl bg-neutral-900/10">
          <p className="text-sm text-muted">Nenhum resultado encontrado para &quot;{query}&quot;.</p>
          <p className="text-xs text-muted/60 mt-1">Verifique a ortografia ou tente palavras-chave diferentes.</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-wider font-semibold text-brand mb-3 flex items-center gap-2">
                <FolderOpen size={13} />
                <span>Projetos Encontrados ({filteredProjects.length})</span>
              </h2>
              <div className="grid gap-3">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projetos`}
                    className="flex items-center justify-between p-4 rounded-xl border border-neutral-850 bg-neutral-900/20 hover:bg-neutral-900/50 hover:border-brand/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand">
                        <FolderOpen size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-muted">
                          {project.conversations.length} conversações associadas
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Chats Results */}
          {filteredChats.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-wider font-semibold text-brand mb-3 flex items-center gap-2">
                <MessageSquare size={13} />
                <span>Chats Recentes ({filteredChats.length})</span>
              </h2>
              <div className="grid gap-3">
                {filteredChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat?conv=${chat.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-neutral-850 bg-neutral-900/20 hover:bg-neutral-900/50 hover:border-brand/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-lg bg-neutral-900 text-muted">
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                          {chat.title}
                        </h3>
                        <p className="text-xs text-muted flex items-center gap-1.5 mt-0.5">
                          <Calendar size={11} />
                          <span>Conversa Recente</span>
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
