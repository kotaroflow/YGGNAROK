"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface CanvasInteraction {
  scale: number;
  pan: { x: number; y: number };
  isPanning: boolean;
  isDraggingNode: boolean;
}

const MIN_SCALE = 0.25;
const MAX_SCALE = 2.0;

export function useCanvasInteraction(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanningRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const zoomTo = useCallback(
    (nextScale: number, centerX: number, centerY: number) => {
      setScale((prev) => {
        const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
        const ratio = clamped / prev;
        setPan((p) => ({
          x: centerX - (centerX - p.x) * ratio,
          y: centerY - (centerY - p.y) * ratio,
        }));
        return clamped;
      });
    },
    []
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;

      if (e.ctrlKey || e.metaKey) {
        // Zoom toward cursor
        const delta = -e.deltaY * 0.001;
        setScale((prev) => {
          const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev * (1 + delta)));
          const ratio = next / prev;
          setPan((p) => ({
            x: cx - (cx - p.x) * ratio,
            y: cy - (cy - p.y) * ratio,
          }));
          return next;
        });
      } else {
        // Pan
        setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
      }
    },
    [containerRef]
  );

  const onPointerDownCanvas = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 1 && e.button !== 2) return; // middle or right click
      e.preventDefault();
      isPanningRef.current = true;
      setIsPanning(true);
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    []
  );

  const onPointerMoveCanvas = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanningRef.current) return;
      const dx = e.clientX - lastPointerRef.current.x;
      const dy = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    },
    []
  );

  const onPointerUpCanvas = useCallback((e: React.PointerEvent) => {
    if (!isPanningRef.current) return;
    isPanningRef.current = false;
    setIsPanning(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "0") {
          e.preventDefault();
          setScale(1);
          setPan({ x: 0, y: 0 });
        } else if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          const container = containerRef.current;
          if (!container) return;
          const rect = container.getBoundingClientRect();
          zoomTo(scale * 1.15, rect.width / 2, rect.height / 2);
        } else if (e.key === "-") {
          e.preventDefault();
          const container = containerRef.current;
          if (!container) return;
          const rect = container.getBoundingClientRect();
          zoomTo(scale * 0.85, rect.width / 2, rect.height / 2);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [containerRef, scale, zoomTo]);

  return {
    scale,
    pan,
    isPanning,
    setScale,
    setPan,
    zoomTo,
    handleWheel,
    onPointerDownCanvas,
    onPointerMoveCanvas,
    onPointerUpCanvas,
  };
}
