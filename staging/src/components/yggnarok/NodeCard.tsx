"use client";

import { useCallback } from "react";
import type { YggNode } from "@/types/yggnarok";
import { getNodeTypeDef } from "@/utils/nodeTypeRegistry";
import { clsx } from "@/lib/utils";

export function NodeCard({
  node,
  isSelected,
  isConnectingSource,
  scale,
  onSelect,
  onPointerDown,
}: {
  node: YggNode;
  isSelected: boolean;
  isConnectingSource: boolean;
  scale: number;
  onSelect: (id: string) => void;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}) {
  const def = getNodeTypeDef(node.type);
  const Icon = def.icon;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      onPointerDown(e, node.id);
    },
    [node.id, onPointerDown]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(node.id);
    },
    [node.id, onSelect]
  );

  const w = node.dimensions?.width || def.defaultWidth;
  const h = node.dimensions?.height || def.defaultHeight;

  // Scale independent hover/active ring
  const glowClass = isSelected
    ? "ring-2 ring-brand shadow-[0_0_20px_rgba(245,158,11,0.25)]"
    : "hover:ring-1 hover:ring-brand/40 hover:shadow-[0_0_12px_rgba(245,158,11,0.12)]";

  return (
    <div
      className={clsx(
        "absolute rounded-xl border backdrop-blur-sm select-none cursor-grab active:cursor-grabbing transition-shadow duration-150",
        def.bg,
        def.border,
        glowClass,
        isConnectingSource && "ring-1 ring-dashed ring-brand/60 animate-pulse"
      )}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: w,
        height: h,
        zIndex: isSelected ? 50 : node.zIndex || 1,
        willChange: "transform",
      }}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      data-node-id={node.id}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-line/30">
        <Icon size={14} className={clsx("shrink-0", def.color)} />
        <span className={clsx("text-[11px] font-bold font-mono uppercase tracking-wider truncate", def.color)}>
          {(node.data.title as string) || def.label}
        </span>
        {node.metadata.tags?.length > 0 && (
          <span className="ml-auto text-[9px] text-muted bg-surface/40 px-1.5 py-0.5 rounded">
            {node.metadata.tags[0]}
          </span>
        )}
      </div>

      {/* Mini preview area — empty / placeholder until inspector fills data */}
      <div className="p-3 space-y-1.5">
        {node.type === "image" && (
          <div className="aspect-[4/3] rounded-lg bg-surface/30 border border-line/20 flex items-center justify-center text-muted">
            <span className="text-[10px]">Preview</span>
          </div>
        )}
        {node.type === "video" && (
          <div className="aspect-video rounded-lg bg-surface/30 border border-line/20 flex items-center justify-center text-muted">
            <span className="text-[10px]">Video</span>
          </div>
        )}
        {(node.type === "prompt" || node.type === "chat") && (
          <div className="text-[10px] text-muted font-mono line-clamp-3 leading-relaxed">
            {(node.data.promptText as string) || (node.data.content as string) || "Sem conteudo ainda..."}
          </div>
        )}
        {(node.type === "campaign" || node.type === "project") && (
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-surface/40 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${(node.data.progress as number) || 0}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-muted">
              <span>Status: {(node.data.status as string) || "planejando"}</span>
              <span>{(node.data.progress as number) || 0}%</span>
            </div>
          </div>
        )}
        {(node.type === "reference" || node.type === "idea") && (
          <div className="text-[10px] text-muted leading-relaxed line-clamp-4">
            {(node.data.content as string)?.substring(0, 120) || "Ideia capturada..."}
          </div>
        )}
      </div>

      {/* Node footer metadata */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 border-t border-line/20 flex items-center justify-between">
        <span className="text-[9px] text-muted font-mono">
          {node.connections.length} link{node.connections.length !== 1 ? "s" : ""}
        </span>
        <span className="text-[8px] text-muted/50">
          {new Date(node.metadata.createdAt).toLocaleDateString("pt-BR")}
        </span>
      </div>
    </div>
  );
}
