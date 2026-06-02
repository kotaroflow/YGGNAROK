"use client";

import { useEffect } from "react";
import { throttle, logger } from "@/lib/utils";

/**
 * Componente que rastreia o cursor do mouse e atualiza variáveis CSS
 * para efeitos de gradiente. Inclui throttle para performance e detecta
 * dispositivos mobile para evitar processamento desnecessário.
 */
export function AmberCursorTracker() {
  useEffect(() => {
    // Mobile detection - não necessário em dispositivos touch
    if (typeof window === "undefined") return;
    
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) {
      logger.debug("AmberCursorTracker: Mobile detected, skipping mouse tracking");
      return;
    }

    let rafId: number | null = null;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      
      if (rafId !== null) return;
      
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mouse-x", `${lastX}px`);
        document.documentElement.style.setProperty("--mouse-y", `${lastY}px`);
        rafId = null;
      });
    };

    const throttledHandler = throttle(handleMouseMove, 50);
    window.addEventListener("mousemove", throttledHandler);
    
    logger.debug("AmberCursorTracker: Mouse tracking enabled");

    return () => {
      window.removeEventListener("mousemove", throttledHandler);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return null;
}