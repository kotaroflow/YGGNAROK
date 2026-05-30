/**
 * Catálogo de modelos disponíveis via OpenRouter
 * Agrupados por fornecedor, com badge de velocidade/qualidade
 */

export type ModelTier = "fast" | "balanced" | "powerful";

export type AIModel = {
  id: string;           // OpenRouter model ID
  name: string;         // Display name
  provider: string;     // Fornecedor (OpenAI, Anthropic...)
  description: string;
  tier: ModelTier;
  contextK: number;     // Contexto em K tokens
  free?: boolean;       // Disponível gratuitamente
};

export const AI_MODELS: AIModel[] = [
  // — OpenAI —
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Modelo flagship da OpenAI. Multimodal, rápido e altamente inteligente.",
    tier: "balanced",
    contextK: 128,
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    description: "Ultra-rápido, leve e econômico para tarefas cotidianas.",
    tier: "fast",
    contextK: 128,
  },
  {
    id: "openai/o1",
    name: "o1",
    provider: "OpenAI",
    description: "Raciocínio complexo avançado com cadeia de pensamento profunda.",
    tier: "powerful",
    contextK: 200,
  },
  {
    id: "openai/o1-mini",
    name: "o1-mini",
    provider: "OpenAI",
    description: "Raciocínio lógico rápido e focado em programação/ciências.",
    tier: "balanced",
    contextK: 128,
  },
  {
    id: "openai/o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    description: "Modelo mais recente de raciocínio lógico rápido e atualizado.",
    tier: "powerful",
    contextK: 200,
  },

  // — Anthropic —
  {
    id: "anthropic/claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "O modelo de maior excelência da Anthropic. Líder absoluto em escrita e código.",
    tier: "balanced",
    contextK: 200,
  },
  {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Modelo ultra-criativo e profundo para análises literárias e estratégia comercial.",
    tier: "powerful",
    contextK: 200,
  },
  {
    id: "anthropic/claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    description: "Velocidade impressionante combinada com raciocínio ágil.",
    tier: "fast",
    contextK: 200,
  },

  // — Google —
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Modelo multimodal em tempo real com excelente velocidade.",
    tier: "fast",
    contextK: 1000,
  },
  {
    id: "google/gemini-2.0-pro-exp-05-26",
    name: "Gemini 2.0 Pro",
    provider: "Google",
    description: "Modelo experimental avançado com enorme contexto e alta capacidade de código.",
    tier: "powerful",
    contextK: 1000,
  },
  {
    id: "google/gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    description: "Forte em processamento de longos documentos com janela de 1 milhão de tokens.",
    tier: "balanced",
    contextK: 1000,
  },

  // — Meta —
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    name: "Llama 3.1 8B",
    provider: "Meta",
    description: "Modelo open-source rápido e gratuito de uso geral.",
    tier: "fast",
    contextK: 128,
    free: true,
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "Meta",
    description: "Excelente inteligência open-source balanceada.",
    tier: "balanced",
    contextK: 128,
    free: true,
  },
  {
    id: "meta-llama/llama-3.1-405b-instruct",
    name: "Llama 3.1 405B",
    provider: "Meta",
    description: "O maior modelo open-source do mundo com inteligência equiparável ao GPT-4.",
    tier: "powerful",
    contextK: 128,
  },

  // — Mistral —
  {
    id: "mistralai/mistral-nemo",
    name: "Mistral Nemo",
    provider: "Mistral",
    description: "Excelente inteligência em português desenvolvida pela Mistral AI.",
    tier: "fast",
    contextK: 128,
    free: true,
  },
  {
    id: "mistralai/mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    description: "Modelo flagship da Mistral. Muito forte em multilíngue.",
    tier: "balanced",
    contextK: 128,
  },

  // — DeepSeek —
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    description: "Modelo de chat super inteligente com custo-benefício incrível.",
    tier: "balanced",
    contextK: 64,
  },
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description: "Primeiro modelo de raciocínio lógico avançado em código aberto comparável ao o1.",
    tier: "powerful",
    contextK: 64,
    free: true,
  },
];

export const DEFAULT_MODEL_ID = "meta-llama/llama-3.1-8b-instruct";

export const MODEL_STORAGE_KEY = "yggnarok.selected-model.v1";

export function getModel(id: string): AIModel {
  return AI_MODELS.find((m) => m.id === id) ?? AI_MODELS[0];
}

/** Lê o modelo salvo no localStorage */
export function loadSelectedModel(): string {
  if (typeof window === "undefined") return DEFAULT_MODEL_ID;
  return localStorage.getItem(MODEL_STORAGE_KEY) || DEFAULT_MODEL_ID;
}

/** Salva o modelo selecionado */
export function saveSelectedModel(id: string) {
  localStorage.setItem(MODEL_STORAGE_KEY, id);
}

export const TIER_LABELS: Record<ModelTier, string> = {
  fast: "Rápido",
  balanced: "Balanceado",
  powerful: "Poderoso",
};

export const TIER_COLORS: Record<ModelTier, string> = {
  fast: "text-emerald-600 bg-emerald-50",
  balanced: "text-amber-600 bg-amber-50",
  powerful: "text-purple-600 bg-purple-50",
};
