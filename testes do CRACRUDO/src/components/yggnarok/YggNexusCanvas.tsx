"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import {
  MousePointer2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Undo2,
  Redo2,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import { useNodeGraph } from "@/hooks/useNodeGraph";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";
import { NodeCard } from "./NodeCard";
import { EdgeLayer } from "./edges/EdgeLayer";
import { NodeInspector } from "./NodeInspector";
import { fitView } from "@/utils/gridCalculator";
import { n8nService } from "@/services/integrations/n8n";
import { obsidianService } from "@/services/integrations/obsidian";
import { logger, clsx, useToast } from "@/lib/utils";
import type { YggNodeType, User } from "@/types/yggnarok";

const NODE_TYPES: { type: YggNodeType; label: string }[] = [
  { type: "image", label: "Imagem" },
  { type: "video", label: "Video" },
  { type: "prompt", label: "Prompt" },
  { type: "chat", label: "Chat" },
  { type: "campaign", label: "Campanha" },
  { type: "project", label: "Projeto" },
  { type: "reference", label: "Referencia" },
  { type: "idea", label: "Ideia" },
];

export function YggNexusCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    selectedNode,
    selectedNodeId,
    connectingFromId,
    addNode,
    deleteNode,
    moveNode,
    updateNode,
    selectNode,
    startConnection,
    finishConnection,
    cancelConnection,
    deleteEdge,
    applyGridLayout,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useNodeGraph();

  const {
    scale,
    pan,
    isPanning,
    setScale,
    setPan,
    handleWheel,
    onPointerDownCanvas,
    onPointerMoveCanvas,
    onPointerUpCanvas,
  } = useCanvasInteraction(containerRef);

  const { toast, showToast } = useToast(3000);

  const draggingRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origNodeX: number;
    origNodeY: number;
  } | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (e.key === "Escape") {
        if (connectingFromId) cancelConnection();
        else selectNode(null);
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNodeId) {
          deleteNode(selectedNodeId);
          selectNode(null);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, connectingFromId, cancelConnection, selectedNodeId, deleteNode, selectNode]);

  const onNodePointerDown = useCallback(
    (e: React.PointerEvent, id: string) => {
      const node = nodes.find((n) => n.id === id);
      if (!node) return;

      if (connectingFromId) {
        finishConnection(id);
        return;
      }

      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      draggingRef.current = {
        id,
        startX: e.clientX,
        startY: e.clientY,
        origNodeX: node.position.x,
        origNodeY: node.position.y,
      };
      selectNode(id);
    },
    [nodes, connectingFromId, finishConnection, selectNode]
  );

  const onNodePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      const { id, startX, startY, origNodeX, origNodeY } = draggingRef.current;
      const dx = (e.clientX - startX) / scale;
      const dy = (e.clientY - startY) / scale;
      moveNode(id, { x: origNodeX + dx, y: origNodeY + dy });
    },
    [scale, moveNode]
  );

  const onNodePointerUp = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = null;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, []);

  const onCanvasClick = useCallback(() => {
    if (connectingFromId) cancelConnection();
    else selectNode(null);
  }, [connectingFromId, cancelConnection, selectNode]);

  useEffect(() => {
    if (nodes.length === 0 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const { scale: s, pan: p } = fitView(nodes, rect.width, rect.height);
    setScale(s);
    setPan(p);
  }, [nodes.length]);

  const handleConnectAction = useCallback(() => {
    if (!selectedNodeId) return;
    startConnection(selectedNodeId);
  }, [selectedNodeId, startConnection]);

  const handleSendObsidian = useCallback(async () => {
    if (!selectedNode) return;
    const user: User = { id: "current-user", role: "admin" };
    try {
      const res = await obsidianService.sendToObsidian(selectedNode, user);
      showToast(res.message);
    } catch (err) {
      showToast("Erro ao enviar para Obsidian");
      logger.error(err);
    }
  }, [selectedNode, showToast]);

  const handleSendN8n = useCallback(async () => {
    if (!selectedNode) return;
    const user: User = { id: "current-user", role: "admin" };
    try {
      const res = await n8nService.sendToN8n(selectedNode, selectedNode.type, user);
      showToast(res.message);
    } catch (err) {
      showToast("Erro ao enviar para n8n");
      logger.error(err);
    }
  }, [selectedNode, showToast]);

  const toolbarBtn =
    "inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface/60 px-3 text-[11px] font-bold text-foreground hover:bg-surface-strong hover:text-brand transition backdrop-blur-sm";

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <div className="relative flex-1 overflow-hidden bg-background">
        <div
          ref={containerRef}
          className={clsx(
            "absolute inset-0",
            isPanning ? "cursor-grabbing" : "cursor-default"
          )}
          onWheel={handleWheel}
          onPointerDown={(e) => {
            onPointerDownCanvas(e);
            onCanvasClick();
          }}
          onPointerMove={(e) => {
            onPointerMoveCanvas(e);
            onNodePointerMove(e);
          }}
          onPointerUp={(e) => {
            onPointerUpCanvas(e);
            onNodePointerUp(e);
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, var(--foreground) 1px, transparent 1px)`,
              backgroundSize: `${24 * scale}px ${24 * scale}px`,
              transform: `translate(${pan.x % (24 * scale)}px, ${pan.y % (24 * scale)}px)`,
            }}
          />

          <EdgeLayer
            nodes={nodes}
            edges={edges}
            scale={scale}
            pan={pan}
            onEdgeClick={(id) => deleteEdge(id)}
          />

          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: "0 0",
            }}
          >
            {nodes.map((node) => (
              <NodeCard
                key={node.id}
                node={node}
                isSelected={node.id === selectedNodeId}
                isConnectingSource={node.id === connectingFromId}
                scale={scale}
                onSelect={selectNode}
                onPointerDown={onNodePointerDown}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-xl border border-line bg-surface/80 backdrop-blur-xl px-2 py-1.5 shadow-lg z-[var(--z-dropdown)]">
          <button type="button" className={toolbarBtn} onClick={() => setScale((s) => Math.max(0.25, s * 0.85))} title="Zoom out">
            <ZoomOut size={14} />
          </button>
          <span className="text-[10px] font-mono text-muted w-10 text-center">{Math.round(scale * 100)}%</span>
          <button type="button" className={toolbarBtn} onClick={() => setScale((s) => Math.min(2.0, s * 1.15))} title="Zoom in">
            <ZoomIn size={14} />
          </button>
          <div className="w-px h-5 bg-line mx-1" />
          <button type="button" className={toolbarBtn} onClick={undo} disabled={!canUndo} title="Desfazer (Ctrl+Z)">
            <Undo2 size={14} />
          </button>
          <button type="button" className={toolbarBtn} onClick={redo} disabled={!canRedo} title="Refazer (Ctrl+Shift+Z)">
            <Redo2 size={14} />
          </button>
          <div className="w-px h-5 bg-line mx-1" />
          <button type="button" className={toolbarBtn} onClick={applyGridLayout} title="Organizar em grade">
            <Grid3X3 size={14} />
          </button>
          <button
            type="button"
            className={clsx(toolbarBtn, connectingFromId && "ring-1 ring-brand bg-brand/10 text-brand")}
            onClick={handleConnectAction}
            title="Conectar nodes"
          >
            <LinkIcon size={14} />
          </button>
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {NODE_TYPES.map((nt) => (
            <button
              key={nt.type}
              type="button"
              onClick={() =>
                addNode(nt.type, {
                  x: -pan.x / scale + 60,
                  y: -pan.y / scale + 40,
                })
              }
              className="group flex items-center gap-2 rounded-lg border border-line bg-surface/80 backdrop-blur-xl px-2.5 py-1.5 text-[10px] font-bold text-foreground hover:bg-surface-strong hover:text-brand transition shadow-sm"
              title={`Adicionar ${nt.label}`}
            >
              <Plus size={10} className="text-brand opacity-60 group-hover:opacity-100" />
              {nt.label}
            </button>
          ))}
        </div>

        {toast && (
          <div className="absolute top-4 right-4 z-[var(--z-toast)]">
            <div className="rounded-xl border border-brand/20 bg-surface-overlay backdrop-blur-xl px-4 py-2.5 text-xs font-medium text-brand shadow-lg">{toast}</div>
          </div>
        )}
      </div>

      <aside className="w-[380px] border-l border-line bg-surface/40 backdrop-blur-md flex flex-col shrink-0 overflow-hidden">
        <div className="h-12 border-b border-line px-4 flex items-center shrink-0">
          <MousePointer2 size={14} className="text-brand mr-2" />
          <span className="text-xs font-bold text-foreground">Node Inspector</span>
          <span className="ml-auto text-[10px] text-muted font-mono">{nodes.length} nodes / {edges.length} links</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NodeInspector
            node={selectedNode}
            onUpdate={(patch) => {
              if (selectedNodeId) updateNode(selectedNodeId, patch);
            }}
            onDuplicate={() => {
              if (!selectedNode) return;
              addNode(selectedNode.type, {
                x: selectedNode.position.x + 30,
                y: selectedNode.position.y + 30,
              });
            }}
            onDelete={() => {
              if (selectedNodeId) {
                deleteNode(selectedNodeId);
                selectNode(null);
              }
            }}
            onConnect={handleConnectAction}
            onSendObsidian={handleSendObsidian}
            onSendN8n={handleSendN8n}
          />
        </div>
      </aside>
    </div>
  );
}
