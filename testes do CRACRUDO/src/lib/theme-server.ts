import type { NextRequest } from "next/server";
import type { ThemeMode } from "@/lib/utils";

/**
 * Server-side theme detection from cookies
 * Usado no RootLayout para evitar script inline gambiarra
 */
export function getServerTheme(req: NextRequest): ThemeMode {
  const cookie = req.cookies.get("ygn-theme")?.value;
  
  if (cookie === "dark" || cookie === "light") {
    return cookie as ThemeMode;
  }
  
  // Check user-agent for prefers-color-scheme (basic detection)
  const userAgent = req.headers.get("user-agent") || "";
  const isDark = userAgent.includes("Dark") || 
    userAgent.includes("dark") || 
    (req.headers.get("sec-ch-prefers-color-scheme") === "dark");
    
  return isDark ? "dark" : "light";
}

/**
 * Generate theme class string for HTML element
 */
export function getThemeClasses(theme: ThemeMode): { themeAttr: string; darkClass: string } {
  return {
    themeAttr: theme,
    darkClass: theme === "dark" ? "dark" : ""
  };
}

/**
 * Create theme cookie options
 */
export const THEME_COOKIE = {
  name: "ygn-theme",
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/"
} as const;