import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const checks = [];

await check("Supabase URL", Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), "NEXT_PUBLIC_SUPABASE_URL ausente");
await check("Supabase anon", Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY), "NEXT_PUBLIC_SUPABASE_ANON_KEY ausente");
await check("Supabase service", Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY), "SUPABASE_SERVICE_ROLE_KEY ausente");
await check("OpenRouter key", Boolean(process.env.OPENROUTER_API_KEY), "OPENROUTER_API_KEY ausente");
await check("Paid AI disabled", process.env.ENABLE_OPENAI_GPT !== "true", "ENABLE_OPENAI_GPT=true pode gerar custo pago", true);
await checkEndpoint("OpenRouter free router", "https://openrouter.ai/api/v1/models", false, {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY ?? ""}`,
});

for (const item of checks) {
  const marker = item.ok ? "ok" : item.optional ? "warn" : "fail";
  console.log(`[${marker}] ${item.name}${item.message ? ` - ${item.message}` : ""}`);
}

const failed = checks.some((item) => !item.ok && !item.optional);
process.exit(failed ? 1 : 0);

async function check(name, ok, message, optional = false) {
  checks.push({ name, ok, message: ok ? "" : message, optional });
}

async function checkEndpoint(name, url, optional = false, headers = {}) {
  const startedAt = Date.now();
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000), headers });
    checks.push({
      name,
      ok: response.ok,
      message: response.ok ? `${Date.now() - startedAt}ms` : response.statusText,
      optional,
    });
  } catch (error) {
    checks.push({
      name,
      ok: false,
      message: error instanceof Error ? error.message : String(error),
      optional,
    });
  }
}
