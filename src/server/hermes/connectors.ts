import { execFile } from "child_process";
import { promisify } from "util";
import { getHermesCommand, getHermesWorkdir } from "./runtime";

const execFileAsync = promisify(execFile);

export type HermesCommandResult = {
  success: boolean;
  output: string;
  error?: string;
};

export type OpenRouterChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ConnectorHealth = {
  key: string;
  label: string;
  status: "online" | "degraded" | "offline";
  detail: string;
  urlConfigured: boolean;
};

/**
 * Executa um comando do Hermes localmente em modo CLI.
 * Esta é a ponte primária enquanto não ativamos o MCP ou Gateway local.
 */
export async function executeHermesCli(
  args: string[],
  options: { timeoutMs?: number; json?: boolean } = {}
): Promise<HermesCommandResult> {
  const hermesCmd = getHermesCommand();
  const cwd = getHermesWorkdir();

  try {
    const { stdout, stderr } = await execFileAsync(hermesCmd, args, {
      cwd,
      timeout: options.timeoutMs || 30000,
    });

    if (stderr && !stdout) {
      // Alguns comandos do Hermes (e Python) jogam logs no stderr mesmo com sucesso,
      // então a ausência total de stdout + presença de stderr pode indicar um erro real.
      return { success: false, output: stderr, error: stderr };
    }

    return { success: true, output: stdout.trim() };
  } catch (err: any) {
    return {
      success: false,
      output: err.stdout || "",
      error: err.stderr || err.message,
    };
  }
}

export async function executeOpenRouterChat(
  model: string,
  messages: OpenRouterChatMessage[],
  options: { temperature?: number; maxTokens?: number } = {},
): Promise<HermesCommandResult> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    return {
      success: false,
      output: "",
      error: "OPENROUTER_API_KEY is not configured.",
    };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_APP_URL || "http://localhost:3000",
        "X-Title": process.env.OPENROUTER_APP_NAME || "YGGNAROK",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
      }),
    });

    const body = await response.json().catch(() => null) as {
      choices?: Array<{ message?: { content?: unknown } }>;
      error?: { message?: unknown };
    } | null;

    if (!response.ok) {
      const detail = typeof body?.error?.message === "string" ? body.error.message : response.statusText;
      return {
        success: false,
        output: "",
        error: `OpenRouter failed (${response.status}): ${detail}`,
      };
    }

    const output = body?.choices?.[0]?.message?.content;
    if (typeof output !== "string" || !output.trim()) {
      return {
        success: false,
        output: "",
        error: "OpenRouter returned an empty response.",
      };
    }

    return {
      success: true,
      output: output.trim(),
    };
  } catch (err: any) {
    return {
      success: false,
      output: "",
      error: err?.message || "OpenRouter request failed.",
    };
  }
}

export async function checkConnectorsHealth(): Promise<ConnectorHealth[]> {
  return [
    {
      key: "hermes",
      label: "Prince Hermes",
      status: "online",
      detail: `Bridge local carregado ha ${Math.round(process.uptime())}s.`,
      urlConfigured: Boolean(process.env.HERMES_COMMAND || process.env.HERMES_WORKDIR),
    },
    {
      key: "n8n",
      label: "n8n Local",
      status: process.env.N8N_WEBHOOK_URL ? "online" : "degraded",
      detail: process.env.N8N_WEBHOOK_URL
        ? "Webhook configurado por ambiente."
        : "Sem N8N_WEBHOOK_URL; fallback local/simulado sera usado.",
      urlConfigured: Boolean(process.env.N8N_WEBHOOK_URL),
    },
    {
      key: "comfyui",
      label: "ComfyUI",
      status: process.env.COMFYUI_OUTPUT_DIR ? "online" : "degraded",
      detail: process.env.COMFYUI_OUTPUT_DIR
        ? "Diretorio de saida configurado."
        : "Sem diretorio dedicado; rota usa fallback local.",
      urlConfigured: Boolean(process.env.COMFYUI_OUTPUT_DIR),
    },
    {
      key: "supabase",
      label: "Supabase",
      status: process.env.NEXT_PUBLIC_SUPABASE_URL ? "online" : "offline",
      detail: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "Cliente Supabase disponivel no ambiente."
        : "Supabase nao configurado para este processo.",
      urlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    },
  ];
}
