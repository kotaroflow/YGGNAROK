export type IntentClassification = {
  category: "chat" | "n8n_flow" | "local_execution" | "admin_task" | "content_generation" | "architecture_analysis";
  requiresAdmin: boolean;
  riskLevel: "low" | "medium" | "high";
};

/**
 * Faz uma triagem leve no backend do YGGNAROK antes de enviar ao Hermes.
 * Se houver palavras-chave óbvias de execução ou administração, marcamos
 * o risco. O Hermes fará o raciocínio real, mas o YGGNAROK mantém a fronteira física.
 */
export function classifyIntent(message: string): IntentClassification {
  const text = message.toLowerCase();

  // Tarefas Administrativas
  if (text.includes("apague o sistema") || text.includes("altere a senha") || text.includes("permissão")) {
    return { category: "admin_task", requiresAdmin: true, riskLevel: "high" };
  }

  // Execução Local (scripts, build, install)
  if (text.includes("pnpm install") || text.includes("build") || text.includes("powershell") || text.includes("script")) {
    return { category: "local_execution", requiresAdmin: true, riskLevel: "high" };
  }

  // Acionamento de n8n explícito
  if (text.includes("n8n") || text.includes("webhook") || text.includes("automação")) {
    return { category: "n8n_flow", requiresAdmin: true, riskLevel: "medium" }; // Pode ser liberado dependendo do ambiente
  }

  // Geração de Conteúdo e Chat
  if (text.includes("gerar roteiro") || text.includes("escreva")) {
    return { category: "content_generation", requiresAdmin: false, riskLevel: "low" };
  }

  return { category: "chat", requiresAdmin: false, riskLevel: "low" };
}

// Stub para compatibilidade legada
export function routeHomeIntent(prompt: string, isAdmin = false) {
  const classification = classifyIntent(prompt);

  const detectedType = prompt.toLowerCase().includes("video")
    ? "video"
    : prompt.toLowerCase().includes("imagem") || prompt.toLowerCase().includes("image")
      ? "image"
      : "text";

  return {
    ...classification,
    detectedType,
    canAutopilot: isAdmin && classification.riskLevel !== "high",
  };
}
