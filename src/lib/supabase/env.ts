export function getPublicSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function isPlaceholderSupabaseUrl(url: string) {
  return !url || url.includes("example.supabase.co") || url === "https://placeholder.supabase.co";
}

export function isLocalRuntime() {
  return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
}

export function isExplicitAuthDevBypassEnabled() {
  return isLocalRuntime() && process.env.YGN_AUTH_DEV_BYPASS === "true";
}

export function hasUsablePublicSupabaseEnv() {
  const env = getPublicSupabaseEnv();
  return Boolean(env.url && env.anonKey && !isPlaceholderSupabaseUrl(env.url));
}

export function assertPublicSupabaseEnv() {
  const env = getPublicSupabaseEnv();

  if (!env.url || !env.anonKey || isPlaceholderSupabaseUrl(env.url)) {
    throw new Error("Supabase publico nao configurado. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return env;
}

export function assertPrivateEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variavel privada ausente: ${name}`);
  }

  return value;
}

export function getAuthAppUrl() {
  const value = process.env.NEXT_PUBLIC_APP_URL ?? "";

  if (value) {
    try {
      return new URL(value).origin;
    } catch {
      throw new Error("NEXT_PUBLIC_APP_URL invalida para redirecionamento de auth.");
    }
  }

  if (isLocalRuntime()) {
    return "http://localhost:3000";
  }

  throw new Error("NEXT_PUBLIC_APP_URL ausente para redirecionamento de auth.");
}
