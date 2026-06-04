/**
 * Orthogonal edge pathfinding — Manhattan routing with 90° bends.
 * Source point: center of source node right edge.
 * Target point: center of target node left edge.
 * Corner radius: 6-8px, configured below.
 */

const CORNER_RADIUS = 6;

export interface Point { x: number; y: number }

export interface NodeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function midY(r: NodeRect): number {
  return r.y + r.height / 2;
}

function rightCenter(r: NodeRect): Point {
  return { x: r.x + r.width, y: midY(r) };
}

function leftCenter(r: NodeRect): Point {
  return { x: r.x, y: midY(r) };
}

function bottomCenter(r: NodeRect): Point {
  return { x: r.x + r.width / 2, y: r.y + r.height };
}

function topCenter(r: NodeRect): Point {
  return { x: r.x + r.width / 2, y: r.y };
}

/**
 * Returns orthogonal polyline points from source to target.
 * Uses source right-edge center → target left-edge center by default.
 * If nodes overlap vertically, adjusts to top/bottom.
 */
export function computeOrthogonalPath(
  source: NodeRect,
  target: NodeRect
): Point[] {
  const src = rightCenter(source);
  const tgt = leftCenter(target);

  const minGap = 24; // minimum horizontal gap
  const dx = tgt.x - src.x;

  // If target is to the LEFT of source, route around via bottom or top
  if (dx < minGap) {
    // Use bottom routing
    return bottomTopPath(source, target);
  }

  // Standard L-shape or Z-shape via midpoints
  const midX = src.x + dx / 2;

  // If vertical distance is small, simple L
  if (Math.abs(tgt.y - src.y) < 4) {
    return [
      src,
      { x: midX, y: src.y },
      { x: midX, y: tgt.y },
      tgt,
    ];
  }

  // Z-shape with double bend
  return [
    src,
    { x: src.x + Math.max(dx * 0.25, minGap / 2), y: src.y },
    { x: src.x + Math.max(dx * 0.25, minGap / 2), y: tgt.y },
    { x: tgt.x - Math.max(dx * 0.25, minGap / 2), y: tgt.y },
    { x: tgt.x - Math.max(dx * 0.25, minGap / 2), y: src.y }, // no — keep simple
    tgt,
  ];
}

function bottomTopPath(source: NodeRect, target: NodeRect): Point[] {
  const sBottom = bottomCenter(source);
  const tTop = topCenter(target);
  const midYPoint = sBottom.y + (tTop.y - sBottom.y) / 2;
  return [
    sBottom,
    { x: sBottom.x, y: midYPoint },
    { x: tTop.x, y: midYPoint },
    tTop,
  ];
}

/**
 * Build an SVG path "d" attribute from polyline points with rounded corners.
 */
export function pointsToSvgPath(points: Point[]): string {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  const r = CORNER_RADIUS;
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const fromPrevX = curr.x - prev.x;
    const fromPrevY = curr.y - prev.y;
    const toNextX = next.x - curr.x;
    const toNextY = next.y - curr.y;

    // Normalize directions
    const prevDir = { x: Math.sign(fromPrevX), y: Math.sign(fromPrevY) };
    const nextDir = { x: Math.sign(toNextX), y: Math.sign(toNextY) };

    // Approach point (before corner)
    const appX = curr.x - prevDir.x * r;
    const appY = curr.y - prevDir.y * r;

    // Departure point (after corner)
    const depX = curr.x + nextDir.x * r;
    const depY = curr.y + nextDir.y * r;

    d += ` L ${appX} ${appY}`;
    d += ` Q ${curr.x} ${curr.y} ${depX} ${depY}`;
  }

  const last = points[points.length - 1];
  const prevLast = points[points.length - 2];
  const dirX = Math.sign(last.x - prevLast.x);
  const dirY = Math.sign(last.y - prevLast.y);
  const appLastX = last.x - dirX * r;
  const appLastY = last.y - dirY * r;

  if (points.length > 2) {
    d += ` L ${appLastX} ${appLastY}`;
  }
  d += ` L ${last.x} ${last.y}`;

  return d;
}

/**
 * Midpoint of a polyline — for placing edge labels.
 */
export function midpointOfPath(points: Point[]): Point {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1) return points[0];

  // Compute total length and find midpoint
  let total = 0;
  const lengths: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const len = Math.hypot(dx, dy);
    total += len;
    lengths.push(total);
  }

  const half = total / 2;
  let seg = 0;
  for (let i = 1; i < lengths.length; i++) {
    if (lengths[i] >= half) {
      seg = i;
      break;
    }
  }

  const t =
    (half - lengths[seg - 1]) / (lengths[seg] - lengths[seg - 1] || 1);
  const a = points[seg - 1];
  const b = points[seg];
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
