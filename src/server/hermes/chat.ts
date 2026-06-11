import { executeHermesCli } from "./connectors";
import { checkHermesPermission } from "./permissions";
import { classifyIntent } from "./intent";
import { recordBridgeLog } from "./local-store";

export type HermesChatRequest = {
  message: string;
  userRole: "user" | "admin";
  userId: string;
  contextFiles?: string[];
  systemOverride?: string;
};

export type HermesChatResponse = {
  response: string;
  intent: string;
  wasBlocked: boolean;
  blockReason?: string;
};

/**
 * Envia uma mensagem para o Hermes Agent, passando pela camada de intenção
 * e permissões antes de acionar a CLI do Hermes.
 */
export async function sendChatMessage(req: HermesChatRequest): Promise<HermesChatResponse> {
  const { message, userRole, userId, contextFiles } = req;

  // 1. Classificação e Proteção Mínima
  const intent = classifyIntent(message);
  const permission = checkHermesPermission(intent, userRole);

  if (!permission.allowed) {
    await recordBridgeLog(userId, "chat_blocked", { message, intent, reason: permission.reason });
    return {
      response: "Ação bloqueada pelas políticas do YGGNAROK.",
      intent: intent.category,
      wasBlocked: true,
      blockReason: permission.reason,
    };
  }

  // 2. Montar o comando CLI
  // O comando "hermes chat -q" faz uma chamada não interativa.
  const args = ["chat", "-q", message];
  
  if (contextFiles && contextFiles.length > 0) {
    // Hermes permite passar contexto
    args.push("--context", ...contextFiles);
  }

  if (req.systemOverride && userRole === "admin") {
    // Administradores podem forçar system prompts específicos do YGGNAROK
    args.push("--system", req.systemOverride);
  }

  // 3. Execução Física via Ponte
  const result = await executeHermesCli(args, { timeoutMs: 120000 }); // 2 minutos máx

  // 4. Registro de Auditoria do YGGNAROK
  await recordBridgeLog(userId, "chat_success", { 
    messagePreview: message.substring(0, 50),
    success: result.success,
    error: result.error,
  });

  if (!result.success) {
    return {
      response: `Falha na comunicação com o Hermes Agent: ${result.error}`,
      intent: intent.category,
      wasBlocked: false,
    };
  }

  return {
    response: result.output,
    intent: intent.category,
    wasBlocked: false,
  };
}

// Stub legado para autopilot
export async function runHermesChat(prompt: string, contextFiles: string[] = []): Promise<string> {
  void prompt;
  void contextFiles;
  return "Autopilot mock";
}
