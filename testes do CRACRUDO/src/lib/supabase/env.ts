export function getPublicSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function assertPublicSupabaseEnv() {
  const env = getPublicSupabaseEnv();

  if (!env.url || !env.anonKey) {
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
