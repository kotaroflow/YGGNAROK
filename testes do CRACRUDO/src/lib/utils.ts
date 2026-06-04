import { useEffect, useState, useCallback } from "react";

/**
 * Throttle: limita a execução de uma função a uma vez a cada `delay` milissegundos
 * Útil para eventos de mouse, scroll, resize que disparam muitas vezes
 */
export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  delay: number = 50
): T {
  let lastCall = 0;
  
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}

/**
 * Hook para gerenciar toasts/notificações temporárias
 * Centraliza timeouts e evita memory leaks
 */
export function useToast(duration: number = 3000) {
  const [toast, setToast] = useState<string | null>(null);
  
  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);
  
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);
  
  useEffect(() => {
    if (!toast) return;
    
    const timer = setTimeout(() => {
      setToast(null);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [toast, duration]);
  
  return {
    toast,
    showToast,
    hideToast,
    setToast
  };
}

/**
 * Hook para centralizar cleanup de intervals
 */
export function useInterval(callback: () => void, delay: number) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}

/**
 * Helper para classes condicionais de forma segura
 */
export function clsx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Logger semântico que pode ser desligado em produção
 */
export const logger = {
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(...args);
    }
  },
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args)
};

/**
 * Helper para pegar disco de forma segura no servidor/cliente
 */
export function getDocument(): Document | null {
  if (typeof window === "undefined") return null;
  return document;
}

/**
 * Helper para pegar localStorage de forma segura
 */
export function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

/**
 * Theme types para evitar any's e unknowns
 */
export type ThemeMode = "light" | "dark";

/**
 * Hook para detectar se é mobile (ponteira grosseira)
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const update = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  
  return isMobile;
}
