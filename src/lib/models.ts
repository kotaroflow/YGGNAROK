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
    description: "Melhor custo-benefício da OpenAI. Multimodal e rápido.",
    tier: "balanced",
    contextK: 128,
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    description: "Ultra-rápido e econômico para tarefas simples.",
    tier: "fast",
    contextK: 128,
  },
  {
    id: "openai/o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    description: "Raciocínio avançado compacto. Ótimo para código e matemática.",
    tier: "powerful",
    contextK: 128,
  },

  // — Anthropic —
  {
    id: "anthropic/claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    description: "O melhor do Claude para uso geral. Rápido e inteligente.",
    tier: "balanced",
    contextK: 200,
  },
  {
    id: "anthropic/claude-opus-4-5",
    name: "Claude Opus 4.5",
    provider: "Anthropic",
    description: "Máxima capacidade da Anthropic para tarefas complexas.",
    tier: "powerful",
    contextK: 200,
  },
  {
    id: "anthropic/claude-haiku-3-5",
    name: "Claude Haiku 3.5",
    provider: "Anthropic",
    description: "O mais rápido e econômico da família Claude.",
    tier: "fast",
    contextK: 200,
  },

  // — Google —
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Multimodal de alta velocidade. Suporta imagem e áudio.",
    tier: "fast",
    contextK: 1000,
  },
  {
    id: "google/gemini-2.5-pro-preview",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    description: "O mais capaz do Google. Contexto de 1M de tokens.",
    tier: "powerful",
    contextK: 1000,
  },

  // — Meta (Open) —
  {
    id: "meta-llama/llama-3.1-8b-instruct",
    name: "Llama 3.1 8B",
    provider: "Meta",
    description: "Modelo open-source rápido e gratuito.",
    tier: "fast",
    contextK: 128,
    free: true,
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "Meta",
    description: "Open-source poderoso. Excelente para raciocínio.",
    tier: "balanced",
    contextK: 128,
    free: true,
  },

  // — Mistral —
  {
    id: "mistralai/mistral-nemo",
    name: "Mistral Nemo",
    provider: "Mistral",
    description: "Compacto, rápido e gratuito. Ótimo para PT-BR.",
    tier: "fast",
    contextK: 128,
    free: true,
  },
  {
    id: "mistralai/mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    description: "Modelo premium da Mistral. Forte em código e análise.",
    tier: "balanced",
    contextK: 128,
  },

  // — DeepSeek —
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description: "Raciocínio em cadeia. Forte alternativa open-source.",
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
