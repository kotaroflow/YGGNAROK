/**
 * Grid calculator: clean default layout for nodes.
 * Desktop: 4 columns, Tablet: 2, Mobile: 1.
 * Minimum 24px gap. No node spawns at (0,0).
 */

import type { YggNode } from "@/types/yggnarok";

const GAP = 24;
const CARD_W = 220; // approximate card width
const CARD_H = 160; // approximate card height

function getCols(): number {
  if (typeof window === "undefined") return 4;
  const w = window.innerWidth;
  if (w >= 1280) return 4;
  if (w >= 768) return 2;
  return 1;
}

export function calculateGridPositions(nodes: YggNode[]): Map<string, { x: number; y: number }> {
  const cols = getCols();
  const map = new Map<string, { x: number; y: number }>();

  // Group by type if grouping key exists, otherwise just order as-is
  const typedOrder: string[][] = [];
  const seen = new Set<string>();

  // Collect all types in order first appearance
  const typeOrder: string[] = [];
  for (const node of nodes) {
    if (!typeOrder.includes(node.type)) typeOrder.push(node.type);
  }

  for (const t of typeOrder) {
    const group = nodes.filter((n) => n.type === t && !seen.has(n.id));
    if (group.length > 0) {
      typedOrder.push(group.map((n) => n.id));
      group.forEach((n) => seen.add(n.id));
    }
  }

  // Any nodes not caught (fallback)
  const remaining = nodes.filter((n) => !seen.has(n.id));
  if (remaining.length > 0) {
    typedOrder.push(remaining.map((n) => n.id));
  }

  let currentY = GAP * 2;
  let maxRowHeight = 0;

  for (const group of typedOrder) {
    let rowX = GAP * 2;
    let rowY = currentY;
    let itemsInRow = 0;

    for (const id of group) {
      const node = nodes.find((n) => n.id === id);
      if (!node) continue;

      const w = node.dimensions?.width || CARD_W;
      const h = node.dimensions?.height || CARD_H;

      if (itemsInRow >= cols) {
        rowY += maxRowHeight + GAP;
        rowX = GAP * 2;
        itemsInRow = 0;
        maxRowHeight = 0;
      }

      map.set(id, { x: rowX, y: rowY });
      rowX += w + GAP;
      maxRowHeight = Math.max(maxRowHeight, h);
      itemsInRow++;
    }

    currentY = rowY + maxRowHeight + GAP * 2; // extra gap between groups
  }

  return map;
}

/**
 * Auto-fit zoom and pan so all nodes are comfortably visible.
 */
export function fitView(
  nodes: YggNode[],
  containerW: number,
  containerH: number
): { scale: number; pan: { x: number; y: number } } {
  if (nodes.length === 0) return { scale: 1, pan: { x: 0, y: 0 } };

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const node of nodes) {
    const w = node.dimensions?.width || CARD_W;
    const h = node.dimensions?.height || CARD_H;
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + w);
    maxY = Math.max(maxY, node.position.y + h);
  }

  const contentW = maxX - minX + GAP * 4;
  const contentH = maxY - minY + GAP * 4;

  const scaleX = containerW / contentW;
  const scaleY = containerH / contentH;
  const scale = Math.min(scaleX, scaleY, 1.2); // never zoom in beyond 1.2x

  const panX = (containerW - contentW * scale) / 2 - minX * scale + GAP;
  const panY = (containerH - contentH * scale) / 2 - minY * scale + GAP;

  return { scale, pan: { x: panX, y: panY } };
}
