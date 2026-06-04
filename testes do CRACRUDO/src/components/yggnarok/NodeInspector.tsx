"use client";

import { useState } from "react";
import type { YggNode } from "@/types/yggnarok";
import { getNodeTypeDef } from "@/utils/nodeTypeRegistry";

export function NodeInspector({
  node,
  onUpdate,
  onDuplicate,
  onDelete,
  onConnect,
  onSendObsidian,
  onSendN8n,
}: {
  node: YggNode | null;
  onUpdate: (patch: Partial<YggNode>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onConnect: () => void;
  onSendObsidian: () => void;
  onSendN8n: () => void;
}) {
  if (!node) return <EmptyInspector />;

  const def = getNodeTypeDef(node.type);
  const Icon = def.icon;

  return (
    <aside className="w-full h-full overflow-y-auto space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className={cn("grid size-8 place-items-center rounded-lg", def.bg, def.border)}>
          <Icon size={16} className={def.color} />
        </div>
        <div className="min-w-0">
          <input
            className="w-full bg-transparent text-sm font-bold text-foreground outline-none border-b border-transparent focus:border-brand placeholder:text-muted"
            value={(node.data.title as string) || ""}
            onChange={(e) => onUpdate({ data: { ...node.data, title: e.target.value } })}
            placeholder="Titulo..."
          />
          <p className="text-[10px] text-muted font-mono">{node.id}</p>
        </div>
      </div>

      {/* Tags */}
      <TagsEditor
        tags={node.metadata.tags}
        onChange={(tags) =>
          onUpdate({ metadata: { ...node.metadata, tags } })
        }
      />

      {/* Type-specific content */}
      <div className="space-y-3">
        {node.type === "image" && <ImageContent node={node} onUpdate={onUpdate} />}
        {node.type === "video" && <VideoContent node={node} onUpdate={onUpdate} />}
        {node.type === "chat" && <ChatContent node={node} onUpdate={onUpdate} />}
        {node.type === "prompt" && <PromptContent node={node} onUpdate={onUpdate} />}
        {(node.type === "campaign" || node.type === "project") && (
          <CampaignContent node={node} onUpdate={onUpdate} />
        )}
        {(node.type === "reference" || node.type === "idea") && (
          <ReferenceContent node={node} onUpdate={onUpdate} />
        )}
      </div>

      {/* Related nodes */}
      {node.connections.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Relacionados</p>
          <div className="space-y-1">
            {node.connections.map((c) => (
              <div
                key={c.targetId}
                className="flex items-center gap-2 rounded-lg border border-line/30 bg-surface/30 px-2.5 py-1.5 text-[11px]"
              >
                <span className="text-brand font-mono text-[9px]">{c.connectionType}</span>
                <span className="text-foreground truncate">{c.targetId}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          type="button"
          onClick={onConnect}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-brand/10 border border-brand/20 text-brand px-3 py-2 text-[11px] font-bold hover:bg-brand/20 transition"
        >
          Conectar
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-surface border border-line text-foreground px-3 py-2 text-[11px] font-bold hover:bg-surface-strong transition"
        >
          Duplicar
        </button>
        <button
          type="button"
          onClick={onSendObsidian}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-surface border border-line text-foreground px-3 py-2 text-[11px] font-bold hover:bg-surface-strong transition"
        >
          📝 Obsidian
        </button>
        <button
          type="button"
          onClick={onSendN8n}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-surface border border-line text-foreground px-3 py-2 text-[11px] font-bold hover:bg-surface-strong transition"
        >
          ⚡ n8n
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 text-[11px] font-bold hover:bg-red-500/20 transition"
        >
          Apagar Node
        </button>
      </div>
    </aside>
  );
}

/* ─── Empty State ─── */
function EmptyInspector() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center gap-3">
      <div className="size-12 rounded-2xl bg-brand/5 border border-brand/10 grid place-items-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-foreground">Selecione um node para inspecionar</p>
      <p className="text-[11px] text-muted">Clique em qualquer card no canvas para editar</p>
    </div>
  );
}

/* ─── Tags Editor ─── */
function TagsEditor({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [val, setVal] = useState("");

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Tags</p>
      <div className="flex flex-wrap gap-1">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-md bg-surface border border-line px-1.5 py-0.5 text-[10px] text-foreground"
          >
            {t}
            <button
              type="button"
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="text-muted hover:text-red-400"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        className="w-full rounded-lg border border-line bg-surface-strong/30 px-2 py-1 text-[11px] text-foreground outline-none focus:border-brand"
        placeholder="Adicionar tag..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && val.trim()) {
            onChange([...tags, val.trim()]);
            setVal("");
          }
        }}
      />
    </div>
  );
}

/* ─── Content variants ─── */
function ImageContent({
  node,
  onUpdate,
}: {
  node: YggNode;
  onUpdate: (p: Partial<YggNode>) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Prompt</label>
      <textarea
        className="w-full min-h-[60px] rounded-lg border border-line bg-surface-strong/30 px-2.5 py-2 text-[11px] text-foreground outline-none focus:border-brand resize-none"
        value={(node.data.prompt as string) || ""}
        onChange={(e) => onUpdate({ data: { ...node.data, prompt: e.target.value } })}
        placeholder="Prompt que gerou esta imagem..."
      />
    </div>
  );
}

function VideoContent({
  node,
  onUpdate,
}: {
  node: YggNode;
  onUpdate: (p: Partial<YggNode>) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Script</label>
      <textarea
        className="w-full min-h-[80px] rounded-lg border border-line bg-surface-strong/30 px-2.5 py-2 text-[11px] text-foreground outline-none focus:border-brand resize-none"
        value={(node.data.script as string) || ""}
        onChange={(e) => onUpdate({ data: { ...node.data, script: e.target.value } })}
        placeholder="Roteiro..."
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          className="rounded-lg border border-line bg-surface-strong/30 px-2 py-1.5 text-[11px] outline-none focus:border-brand"
          placeholder="Plataforma"
          value={(node.data.platform as string) || ""}
          onChange={(e) => onUpdate({ data: { ...node.data, platform: e.target.value } })}
        />
        <input
          className="rounded-lg border border-line bg-surface-strong/30 px-2 py-1.5 text-[11px] outline-none focus:border-brand"
          placeholder="Categoria"
          value={(node.data.category as string) || ""}
          onChange={(e) => onUpdate({ data: { ...node.data, category: e.target.value } })}
        />
      </div>
    </div>
  );
}

function ChatContent({
  node,
  onUpdate,
}: {
  node: YggNode;
  onUpdate: (p: Partial<YggNode>) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Persona</label>
      <input
        className="w-full rounded-lg border border-line bg-surface-strong/30 px-2.5 py-1.5 text-[11px] outline-none focus:border-brand"
        value={(node.data.personaName as string) || ""}
        onChange={(e) => onUpdate({ data: { ...node.data, personaName: e.target.value } })}
        placeholder="Nome da IA / Persona"
      />
      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Resumo</label>
      <textarea
        className="w-full min-h-[60px] rounded-lg border border-line bg-surface-strong/30 px-2.5 py-2 text-[11px] resize-none outline-none focus:border-brand"
        value={(node.data.summary as string) || ""}
        onChange={(e) => onUpdate({ data: { ...node.data, summary: e.target.value } })}
        placeholder="Resumo da conversa..."
      />
    </div>
  );
}

function PromptContent({
  node,
  onUpdate,
}: {
  node: YggNode;
  onUpdate: (p: Partial<YggNode>) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Prompt</label>
      <textarea
        className="w-full min-h-[100px] rounded-lg border border-line bg-surface-strong/30 px-2.5 py-2 text-[11px] font-mono text-foreground outline-none focus:border-brand resize-none"
        value={(node.data.promptText as string) || ""}
        onChange={(e) => onUpdate({ data: { ...node.data, promptText: e.target.value } })}
        placeholder="Cole o prompt aqui..."
      />
      <input
        className="w-full rounded-lg border border-line bg-surface-strong/30 px-2.5 py-1.5 text-[11px] outline-none focus:border-brand"
        placeholder="Modelo (ex: GPT-4, Claude-3)"
        value={(node.data.model as string) || ""}
        onChange={(e) => onUpdate({ data: { ...node.data, model: e.target.value } })}
      />
    </div>
  );
}

function CampaignContent({
  node,
  onUpdate,
}: {
  node: YggNode;
  onUpdate: (p: Partial<YggNode>) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Status</label>
      <select
        className="w-full rounded-lg border border-line bg-surface-strong/30 px-2.5 py-1.5 text-[11px] outline-none focus:border-brand"
        value={(node.data.status as string) || "planejando"}
        onChange={(e) => onUpdate({ data: { ...node.data, status: e.target.value } })}
      >
        <option value="planejando">Planejando</option>
        <option value="ativo">Ativo</option>
        <option value="pausado">Pausado</option>
        <option value="concluido">Concluido</option>
      </select>

      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Progresso (%)</label>
      <input
        type="range"
        min={0}
        max={100}
        className="w-full"
        value={(node.data.progress as number) || 0}
        onChange={(e) =>
          onUpdate({ data: { ...node.data, progress: Number(e.target.value) } })
        }
      />
      <div className="flex justify-between text-[10px] text-muted">
        <span>0%</span>
        <span>{(node.data.progress as number) || 0}%</span>
        <span>100%</span>
      </div>

      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Deadline</label>
      <input
        type="date"
        className="w-full rounded-lg border border-line bg-surface-strong/30 px-2.5 py-1.5 text-[11px] outline-none focus:border-brand"
        value={(node.data.deadline as string) || ""}
        onChange={(e) => onUpdate({ data: { ...node.data, deadline: e.target.value } })}
      />
    </div>
  );
}

function ReferenceContent({
  node,
  onUpdate,
}: {
  node: YggNode;
  onUpdate: (p: Partial<YggNode>) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Conteudo</label>
      <textarea
        className="w-full min-h-[100px] rounded-lg border border-line bg-surface-strong/30 px-2.5 py-2 text-[11px] outline-none focus:border-brand resize-none"
        value={(node.data.content as string) || ""}
        onChange={(e) => onUpdate({ data: { ...node.data, content: e.target.value } })}
        placeholder="Conteudo da referencia ou ideia..."
      />
      <input
        className="w-full rounded-lg border border-line bg-surface-strong/30 px-2.5 py-1.5 text-[11px] outline-none focus:border-brand"
        placeholder="URL fonte (opcional)"
        value={(node.data.sourceUrl as string) || ""}
        onChange={(e) => onUpdate({ data: { ...node.data, sourceUrl: e.target.value } })}
      />
    </div>
  );
}

/* utility local */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
