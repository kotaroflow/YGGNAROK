/**
 * YGGNAROK OS - Hermes Bridge Local Store
 * 
 * Este arquivo NÃO substitui nem duplica a memória longa e habilidades do Hermes Agent.
 * O Hermes Agent (Nous Research) mantém sua própria memória contextual e skills ativas.
 * 
 * Aqui guardamos apenas:
 * - Logs operacionais da ponte (auditoria de chamadas feitas a partir do YGGNAROK).
 * - Último status de saúde do bridge.
 * - Metadados de sessões YGGNAROK.
 */

type BridgeLogEntry = {
  timestamp: string;
  userId: string;
  action: string;
  details: Record<string, unknown>;
};

export type LocalBunkerState = {
  status: string;
  generation_requests: Record<string, unknown>[];
  campaigns: Record<string, unknown>[];
  content_items: Record<string, unknown>[];
  post_queue: Record<string, unknown>[];
  ai_jobs: Record<string, unknown>[];
  assets: Record<string, unknown>[];
  publishing_logs: Record<string, unknown>[];
  updated_at?: string;
};

type LocalGenerationRequestInput = Record<string, unknown> & {
  title?: string;
  prompt?: string;
  contentType?: string;
  platform?: string | null;
  autopilotEnabled?: boolean;
};

// Em produção real da V1, este store pode se conectar ao Supabase do YGGNAROK
// na tabela `audit_logs` ou `agent_runs`.
// Aqui mantemos em memória temporária ou log file apenas para a ponte não quebrar.

const inMemoryBridgeLogs: BridgeLogEntry[] = [];
const inMemoryBunkerState: LocalBunkerState = {
  status: "offline_mock",
  generation_requests: [],
  campaigns: [],
  content_items: [],
  post_queue: [],
  ai_jobs: [],
  assets: [],
  publishing_logs: [],
};

export async function recordBridgeLog(userId: string, action: string, details: Record<string, unknown>) {
  const log: BridgeLogEntry = {
    timestamp: new Date().toISOString(),
    userId,
    action,
    details,
  };
  
  inMemoryBridgeLogs.push(log);

  // Exemplo de debug local
  if (process.env.NODE_ENV === "development") {
    console.log(`[YGGNAROK->HERMES] ${action} (${userId}):`, details);
  }
}

export async function getBridgeLogs(): Promise<BridgeLogEntry[]> {
  return inMemoryBridgeLogs;
}

// ---------------------------------------------------------
// Compatibilidade Legada: Stubs para Rotas Anteriores
// ---------------------------------------------------------

export async function readLocalBunkerState(): Promise<LocalBunkerState> {
  return inMemoryBunkerState;
}

export async function writeLocalBunkerState(data: Partial<LocalBunkerState>) {
  Object.assign(inMemoryBunkerState, data, { updated_at: new Date().toISOString() });
  return true;
}

export async function appendLocalMediaAsset(asset: Record<string, unknown>) {
  inMemoryBunkerState.assets.push(asset);
  return true;
}

export async function createLocalGenerationRequest(request: LocalGenerationRequestInput) {
  const now = new Date().toISOString();
  const generationRequest = {
    id: `req_${crypto.randomUUID()}`,
    status: "queued",
    created_at: now,
    updated_at: now,
    ...request,
  };

  const contentItem = {
    id: `content_${crypto.randomUUID()}`,
    generation_request_id: generationRequest.id,
    title: request.title ?? "Conteudo gerado pelo Hermes",
    idea: request.prompt,
    caption: "",
    content_type: request.contentType ?? "text",
    platform: request.platform ?? null,
    status: request.autopilotEnabled ? "approved" : "draft",
    created_at: now,
    updated_at: now,
  };

  const queueItem = {
    id: `queue_${crypto.randomUUID()}`,
    content_id: contentItem.id,
    platform: request.platform ?? "local",
    status: request.autopilotEnabled ? "waiting" : "draft",
    caption_to_copy: "",
    created_at: now,
    updated_at: now,
  };

  const campaign = request.autopilotEnabled
    ? {
        id: `campaign_${crypto.randomUUID()}`,
        title: request.title ?? "Campanha local Hermes",
        status: "active",
        created_at: now,
        updated_at: now,
      }
    : null;

  inMemoryBunkerState.generation_requests.push(generationRequest);
  inMemoryBunkerState.content_items.push(contentItem);
  inMemoryBunkerState.post_queue.push(queueItem);

  if (campaign) {
    inMemoryBunkerState.campaigns.push(campaign);
  }

  return { generationRequest, campaign, contentItem, queueItem };
}
