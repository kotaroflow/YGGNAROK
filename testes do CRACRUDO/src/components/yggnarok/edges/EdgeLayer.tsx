"use client";

import { useMemo } from "react";
import type { YggNode, YggEdge } from "@/types/yggnarok";
import { getNodeTypeDef } from "@/utils/nodeTypeRegistry";
import {
  computeOrthogonalPath,
  pointsToSvgPath,
  midpointOfPath,
} from "@/utils/orthogonalPathfinding";
import { NODE_TYPE_REGISTRY } from "@/utils/nodeTypeRegistry";
import { clsx } from "@/lib/utils";

export const CONNECTION_STYLES: Record<
  YggEdge["type"],
  { label: string; dashArray: string; dotAtSource: boolean; arrow: boolean; diamond: boolean }
> = {
  related_to: { label: "relacionado", dashArray: "0", dotAtSource: false, arrow: false, diamond: false },
  derived_from: { label: "derivado de", dashArray: "0", dotAtSource: false, arrow: true, diamond: false },
  inspires: { label: "inspira", dashArray: "4 4", dotAtSource: false, arrow: false, diamond: false },
  depends_on: { label: "depende de", dashArray: "0", dotAtSource: true, arrow: false, diamond: false },
  contains: { label: "contem", dashArray: "0", dotAtSource: false, arrow: false, diamond: true },
};

export function EdgeLayer({
  nodes,
  edges,
  scale,
  pan,
  onEdgeClick,
}: {
  nodes: YggNode[];
  edges: YggEdge[];
  scale: number;
  pan: { x: number; y: number };
  onEdgeClick?: (edgeId: string) => void;
}) {
  const nodeMap = useMemo(() => {
    const m = new Map<string, YggNode>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <g
        transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}
      >
        {edges.map((edge) => {
          const source = nodeMap.get(edge.sourceId);
          const target = nodeMap.get(edge.targetId);
          if (!source || !target) return null;

          const srcRect = {
            x: source.position.x,
            y: source.position.y,
            width: source.dimensions?.width || 220,
            height: source.dimensions?.height || 160,
          };
          const tgtRect = {
            x: target.position.x,
            y: target.position.y,
            width: target.dimensions?.width || 220,
            height: target.dimensions?.height || 160,
          };

          const points = computeOrthogonalPath(srcRect, tgtRect);
          const d = pointsToSvgPath(points);
          const mid = midpointOfPath(points);
          const style = CONNECTION_STYLES[edge.type];

          return (
            <g key={edge.id} pointerEvents="auto" className="cursor-pointer group"
              onClick={() => onEdgeClick?.(edge.id)}
            >
              {/* glow line on hover */}
              <path
                d={d}
                fill="none"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                stroke="rgba(248, 195, 102,0.35)"
                strokeWidth={4}
              />
              {/* main line */}
              <path
                d={d}
                fill="none"
                stroke="rgba(248, 195, 102,0.5)"
                strokeWidth={1.5}
                strokeDasharray={style.dashArray}
                className="transition-all duration-200 group-hover:stroke-[2px]"
              />
              {/* type label pill at midpoint */}
              {scale > 0.6 && (
                <g transform={`translate(${mid.x}, ${mid.y})`}>
                  <rect
                    x={-style.label.length * 2.8}
                    y={-9}
                    width={style.label.length * 5.6}
                    height={18}
                    rx={9}
                    fill="rgba(15,15,20,0.85)"
                    stroke="rgba(248, 195, 102,0.25)"
                    strokeWidth={0.5}
                  />
                  <text
                    y={4}
                    textAnchor="middle"
                    fill="#F59E0B"
                    fontSize={9}
                    fontFamily="var(--font-mono), monospace"
                    fontWeight={600}
                  >
                    {style.label}
                  </text>
                </g>
              )}
              {/* source dot */}
              {style.dotAtSource && points.length > 0 && (
                <circle cx={points[0].x} cy={points[0].y} r={3} fill="#F59E0B" />
              )}
              {/* arrow at target */}
              {style.arrow && points.length > 1 && (
                <polygon
                  points={`${points[points.length - 1].x - 6},${points[points.length - 1].y - 3} ${points[points.length - 1].x},${points[points.length - 1].y} ${points[points.length - 1].x - 6},${points[points.length - 1].y + 3}`}
                  fill="#F59E0B"
                />
              )}
              {/* diamond at target */}
              {style.diamond && points.length > 1 && (
                <polygon
                  points={`${points[points.length - 1].x},${points[points.length - 1].y - 4} ${points[points.length - 1].x + 4},${points[points.length - 1].y} ${points[points.length - 1].x},${points[points.length - 1].y + 4} ${points[points.length - 1].x - 4},${points[points.length - 1].y}`}
                  fill="#F59E0B"
                />
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
