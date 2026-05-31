"use client";
 
import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore, useCallback } from "react";
 
export type Theme = "light" | "dark";
 
const storageKey = "ygn-theme";
const themeChangeEvent = "ygn-theme-change";
 
function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}
 
function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(storageKey);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
 
function subscribeToTheme(callback: () => void) {
  window.addEventListener(themeChangeEvent, callback);
  window.addEventListener("storage", callback);
 
  return () => {
    window.removeEventListener(themeChangeEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribeToTheme, getThemeSnapshot, () => "light");

  const setTheme = useCallback((nextTheme: Theme) => {
    window.localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return [theme, setTheme] as const;
}
 
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useTheme();
 
  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }
 
  const Icon = theme === "dark" ? Moon : Sun;
  const label = theme === "dark" ? "Modo escuro" : "Modo claro";
 
  return (
    <button
      type="button"
      className={[
        "inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/80 bg-white/70 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-neutral-900/70 dark:text-stone-200 dark:hover:bg-neutral-900",
        compact ? "w-10 px-0" : "px-4",
      ].join(" ")}
      onClick={toggleTheme}
      aria-label={`Trocar tema. Atual: ${label}`}
      title={`Trocar tema. Atual: ${label}`}
    >
      <Icon size={18} />
      {compact ? null : <span>{label}</span>}
    </button>
  );
}
