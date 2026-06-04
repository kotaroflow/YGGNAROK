"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { clsx, getLocalStorage, logger } from "@/lib/utils";

export type Theme = "light" | "dark";

const STORAGE_KEY = "ygn-theme";
const THEME_CHANGE_EVENT = "ygn-theme-change";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.setAttribute("data-theme", theme);
  logger.debug("Theme applied:", theme);
}

/**
 * Hook customizado para gerenciar tema com localStorage e sincronização
 * MAIS SIMPLES que useSyncExternalStore e sem duplicação de aplicação
 */
export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>("light");

  // Initialize from localStorage or system preference
  useEffect(() => {
    const saved = getLocalStorage()?.getItem(STORAGE_KEY);
    const systemIsDark = typeof window !== "undefined" && 
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = saved === "dark" || saved === "light" 
      ? saved 
      : systemIsDark ? "dark" : "light";
    
    setThemeState(initialTheme as Theme);
    applyTheme(initialTheme as Theme);
  }, []);

  // Listen for theme changes from other tabs
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const newTheme = (e.newValue || "light") as Theme;
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    const handleThemeChange = () => {
      const saved = getLocalStorage()?.getItem(STORAGE_KEY) as Theme;
      if (saved && saved !== theme) {
        setThemeState(saved);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    getLocalStorage()?.setItem(STORAGE_KEY, nextTheme);
    setThemeState(nextTheme);
    applyTheme(nextTheme);
    
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    }
  }, []);

  return [theme, setTheme];
}

/**
 * Theme toggle button with compact/full variants
 * 
 * @param compact - Show icon only without label
 */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useTheme();

  const handleToggle = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    logger.debug("Theme toggled:", nextTheme);
  }, [theme, setTheme]);

  const Icon = theme === "dark" ? Moon : Sun;
  const label = theme === "dark" ? "Void" : "Amber"; // Voltando ao nome original

  return (
    <button
      type="button"
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line bg-surface text-sm font-medium text-foreground shadow-sm transition hover:bg-surface-strong",
        compact ? "w-10 px-0" : "px-4"
      )}
      onClick={handleToggle}
      aria-label={`Trocar tema. Atual: ${label}`}
      title={`Trocar tema. Atual: ${label}`}
    >
      <Icon size={18} />
      {!compact && <span>{label}</span>}
    </button>
  );
}