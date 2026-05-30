/**
 * Catálogo de modelos disponíveis via OpenRouter
 * Agrupados por fornecedor, com badge de velocidade/qualidade e direcionamento por setor.
 */

export type ModelTier = "fast" | "balanced" | "powerful";

export type SectorId = "iriguchi" | "ura-ichiba" | "sosaku-kobo" | "sakusen-honbu";

export type AIModel = {
  id: string;           // OpenRouter model ID
  name: string;         // Display name
  provider: string;     // Fornecedor (OpenAI, Anthropic...)
  description: string;
  tier: ModelTier;
  contextK: number;     // Contexto em K tokens
  free?: boolean;       // Disponível gratuitamente
  sectors: SectorId[];  // Setores direcionados e recomendados
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
    sectors: ["iriguchi", "ura-ichiba", "sosaku-kobo"],
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    description: "Ultra-rápido, leve e econômico para tarefas cotidianas.",
    tier: "fast",
    contextK: 128,
    sectors: ["iriguchi", "ura-ichiba"],
  },
  {
    id: "openai/o1",
    name: "o1",
    provider: "OpenAI",
    description: "Raciocínio complexo avançado com cadeia de pensamento profunda.",
    tier: "powerful",
    contextK: 200,
    sectors: ["sakusen-honbu"],
  },
  {
    id: "openai/o1-mini",
    name: "o1-mini",
    provider: "OpenAI",
    description: "Raciocínio lógico rápido e focado em programação/ciências.",
    tier: "balanced",
    contextK: 128,
    sectors: ["sakusen-honbu"],
  },
  {
    id: "openai/o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    description: "Modelo mais recente de raciocínio lógico rápido e atualizado.",
    tier: "powerful",
    contextK: 200,
    sectors: ["sakusen-honbu"],
  },

  // — Anthropic —
  {
    id: "anthropic/claude-3.7-sonnet:thinking",
    name: "Claude 3.7 Sonnet (Thinking)",
    provider: "Anthropic",
    description: "Claude 3.7 com modo de raciocínio estendido ativo. A inteligência criativa e analítica definitiva.",
    tier: "powerful",
    contextK: 200,
    sectors: ["sosaku-kobo", "sakusen-honbu"],
  },
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    provider: "Anthropic",
    description: "O mais novo modelo flagship com raciocínio híbrido excepcional, redação premium e alta inteligência.",
    tier: "powerful",
    contextK: 200,
    sectors: ["sosaku-kobo", "sakusen-honbu"],
  },
  {
    id: "anthropic/claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "O modelo de maior excelência da Anthropic. Líder absoluto em escrita e código.",
    tier: "balanced",
    contextK: 200,
    sectors: ["sosaku-kobo", "sakusen-honbu"],
  },
  {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    description: "Modelo ultra-criativo e profundo para análises literárias e estratégia comercial.",
    tier: "powerful",
    contextK: 200,
    sectors: ["sosaku-kobo", "ura-ichiba"],
  },
  {
    id: "anthropic/claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    description: "Velocidade impressionante combinada com raciocínio ágil.",
    tier: "fast",
    contextK: 200,
    sectors: ["iriguchi", "sosaku-kobo"],
  },

  // — Google —
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Modelo multimodal em tempo real com excelente velocidade.",
    tier: "fast",
    contextK: 1000,
    sectors: ["iriguchi", "sosaku-kobo"],
  },
  {
    id: "google/gemini-2.0-flash-thinking-exp",
    name: "Gemini 2.0 Thinking",
    provider: "Google",
    description: "Raciocínio experimental profundo em cadeia com ótimo tempo de resposta e alta lógica.",
    tier: "powerful",
    contextK: 1000,
    free: true,
    sectors: ["sakusen-honbu"],
  },
  {
    id: "google/gemini-2.0-pro-exp-05-26",
    name: "Gemini 2.0 Pro",
    provider: "Google",
    description: "Modelo experimental avançado com enorme contexto e alta capacidade de código.",
    tier: "powerful",
    contextK: 1000,
    sectors: ["sakusen-honbu", "sosaku-kobo"],
  },
  {
    id: "google/gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    description: "Forte em processamento de longos documentos com janela de 1 milhão de tokens.",
    tier: "balanced",
    contextK: 1000,
    sectors: ["sakusen-honbu"],
  },
  {
    id: "google/gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    description: "Modelo super-rápido para análise rápida de mídias e documentos longos.",
    tier: "fast",
    contextK: 1000,
    free: true,
    sectors: ["iriguchi", "sosaku-kobo"],
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
    sectors: ["iriguchi"],
  },
  {
    id: "meta-llama/llama-3.2-3b-instruct",
    name: "Llama 3.2 3B",
    provider: "Meta",
    description: "Modelo open-source ultra-leve ideal para respostas instantâneas.",
    tier: "fast",
    contextK: 128,
    free: true,
    sectors: ["iriguchi"],
  },
  {
    id: "meta-llama/llama-3.2-1b-instruct",
    name: "Llama 3.2 1B",
    provider: "Meta",
    description: "O modelo mais leve do catálogo, ideal para respostas imediatas sem custos.",
    tier: "fast",
    contextK: 128,
    free: true,
    sectors: ["iriguchi"],
  },
  {
    id: "meta-llama/llama-3.2-11b-vision-instruct",
    name: "Llama 3.2 11B Vision",
    provider: "Meta",
    description: "Modelo visual em código aberto para leitura inteligente de imagens e gráficos.",
    tier: "fast",
    contextK: 128,
    free: true,
    sectors: ["sosaku-kobo", "iriguchi"],
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "Meta",
    description: "Excelente inteligência open-source balanceada.",
    tier: "balanced",
    contextK: 128,
    free: true,
    sectors: ["ura-ichiba", "iriguchi"],
  },
  {
    id: "meta-llama/llama-3.1-405b-instruct",
    name: "Llama 3.1 405B",
    provider: "Meta",
    description: "O maior modelo open-source do mundo com inteligência equiparável ao GPT-4.",
    tier: "powerful",
    contextK: 128,
    sectors: ["sosaku-kobo", "ura-ichiba"],
  },

  // — Microsoft —
  {
    id: "microsoft/phi-4",
    name: "Phi-4",
    provider: "Microsoft",
    description: "Modelo compacto da Microsoft com impressionante raciocínio lógico e científico.",
    tier: "balanced",
    contextK: 16,
    free: true,
    sectors: ["sakusen-honbu", "iriguchi"],
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
    sectors: ["iriguchi", "sosaku-kobo"],
  },
  {
    id: "mistralai/pixtral-12b",
    name: "Pixtral 12B",
    provider: "Mistral",
    description: "O modelo de visão da Mistral AI, projetado para entender imagens complexas e PDFs.",
    tier: "fast",
    contextK: 128,
    sectors: ["sosaku-kobo"],
  },
  {
    id: "mistralai/codestral-2501",
    name: "Codestral 25B",
    provider: "Mistral",
    description: "Modelo especializado em programação altamente refinado pela Mistral AI.",
    tier: "balanced",
    contextK: 32,
    sectors: ["sakusen-honbu"],
  },
  {
    id: "mistralai/mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    description: "Modelo flagship da Mistral. Muito forte em multilíngue.",
    tier: "balanced",
    contextK: 128,
    sectors: ["ura-ichiba"],
  },

  // — NVIDIA —
  {
    id: "nvidia/llama-3.1-nemotron-70b-instruct",
    name: "Nemotron 70B (NVIDIA)",
    provider: "NVIDIA",
    description: "Customização da NVIDIA do Llama 3.1. Extremamente conversacional e detalhado nas respostas.",
    tier: "balanced",
    contextK: 128,
    free: true,
    sectors: ["sosaku-kobo", "ura-ichiba"],
  },

  // — DeepSeek —
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    description: "Modelo de chat super inteligente com custo-benefício incrível.",
    tier: "balanced",
    contextK: 64,
    sectors: ["iriguchi", "ura-ichiba"],
  },
  {
    id: "deepseek/deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 Llama 70B",
    provider: "DeepSeek",
    description: "Modelo R1 destilado pela DeepSeek sob a base robusta do Llama 3.1 70B.",
    tier: "balanced",
    contextK: 128,
    free: true,
    sectors: ["sakusen-honbu"],
  },
  {
    id: "deepseek/deepseek-r1-distill-qwen-32b",
    name: "DeepSeek R1 Qwen 32B",
    provider: "DeepSeek",
    description: "Modelo R1 destilado pela DeepSeek sob a base especializada de programação Qwen.",
    tier: "balanced",
    contextK: 64,
    free: true,
    sectors: ["sakusen-honbu"],
  },
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
    provider: "DeepSeek",
    description: "Primeiro modelo de raciocínio lógico avançado em código aberto comparável ao o1.",
    tier: "powerful",
    contextK: 64,
    free: true,
    sectors: ["sakusen-honbu"],
  },

  // — xAI —
  {
    id: "x-ai/grok-3",
    name: "Grok 3",
    provider: "xAI (Grok)",
    description: "O mais recente modelo super-inteligente da xAI com excelente raciocínio geral e dados atuais.",
    tier: "powerful",
    contextK: 128,
    sectors: ["ura-ichiba", "sosaku-kobo", "sakusen-honbu"],
  },
  {
    id: "x-ai/grok-2",
    name: "Grok 2",
    provider: "xAI (Grok)",
    description: "Modelo oficial da xAI (Grok). Inteligente e atualizado em tempo real.",
    tier: "balanced",
    contextK: 128,
    sectors: ["ura-ichiba", "iriguchi"],
  },

  // — Qwen —
  {
    id: "qwen/qwq-32b-preview",
    name: "QwQ 32B (Reasoning)",
    provider: "Qwen",
    description: "Modelo de raciocínio profundo focado em matemática complexa e lógica avançada do laboratório Qwen.",
    tier: "powerful",
    contextK: 32,
    free: true,
    sectors: ["sakusen-honbu"],
  },
  {
    id: "qwen/qwen-2.5-coder-32b-instruct",
    name: "Qwen 2.5 Coder 32B",
    provider: "Qwen",
    description: "Um dos melhores modelos do mundo especializados em programação e código.",
    tier: "balanced",
    contextK: 32,
    free: true,
    sectors: ["sakusen-honbu"],
  },
  {
    id: "qwen/qwen-2.5-coder-7b-instruct",
    name: "Qwen 2.5 Coder 7B",
    provider: "Qwen",
    description: "Modelo super ágil e focado em escrita de código rápida e depuração de lógicas simples.",
    tier: "fast",
    contextK: 128,
    free: true,
    sectors: ["sakusen-honbu"],
  },
  {
    id: "qwen/qwen-2.5-72b-instruct",
    name: "Qwen 2.5 72B",
    provider: "Qwen",
    description: "Excelente modelo de propósito geral desenvolvido pela Alibaba Cloud.",
    tier: "balanced",
    contextK: 64,
    sectors: ["ura-ichiba", "sosaku-kobo"],
  },

  // — Perplexity —
  {
    id: "perplexity/sonar",
    name: "Perplexity Sonar",
    provider: "Perplexity",
    description: "Modelo otimizado para respostas rápidas com pesquisa na web em tempo real.",
    tier: "fast",
    contextK: 32,
    sectors: ["ura-ichiba", "iriguchi"],
  },
  {
    id: "perplexity/sonar-reasoning",
    name: "Perplexity Sonar Reasoning",
    provider: "Perplexity",
    description: "Pesquisa avançada na internet com raciocínio lógico em cadeia integrado.",
    tier: "powerful",
    contextK: 128,
    sectors: ["sakusen-honbu"],
  },

  // — Cohere —
  {
    id: "cohere/command-r-plus",
    name: "Command R+",
    provider: "Cohere",
    description: "Líder em RAG, processamento de múltiplos documentos e execução de ferramentas.",
    tier: "balanced",
    contextK: 128,
    sectors: ["ura-ichiba", "sosaku-kobo"],
  },
  {
    id: "cohere/command-r",
    name: "Command R",
    provider: "Cohere",
    description: "Modelo ágil focado em respostas multilingues e fluxos RAG de alta fidelidade.",
    tier: "balanced",
    contextK: 128,
    sectors: ["ura-ichiba", "sosaku-kobo"],
  },

  // — Nous Research —
  {
    id: "nousresearch/hermes-3-llama-3-8b",
    name: "Hermes 3 8B",
    provider: "Nous Research",
    description: "Modelo altamente customizado, sem censura e excelente para agentes e diálogos livres.",
    tier: "fast",
    contextK: 32,
    free: true,
    sectors: ["sosaku-kobo"],
  },

  // — Dedicated Free Endpoints —
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1 (Free Tier)",
    provider: "DeepSeek",
    description: "Modelo oficial de raciocínio profundo DeepSeek R1 em cota de uso gratuita.",
    tier: "powerful",
    contextK: 64,
    free: true,
    sectors: ["sakusen-honbu", "iriguchi"],
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B (Free Tier)",
    provider: "Meta",
    description: "Raciocínio de 70B parâmetros sob endpoint 100% livre de custos.",
    tier: "powerful",
    contextK: 128,
    free: true,
    sectors: ["ura-ichiba", "iriguchi"],
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash (Free Tier)",
    provider: "Google",
    description: "Excelente performance e velocidade multimodal do Google sem custos de API.",
    tier: "fast",
    contextK: 1048,
    free: true,
    sectors: ["iriguchi", "sosaku-kobo"],
  },
  {
    id: "qwen/qwen-2.5-72b-instruct:free",
    name: "Qwen 2.5 72B (Free Tier)",
    provider: "Qwen",
    description: "O modelo principal de 72B da Alibaba Cloud rodando em cota 100% gratuita.",
    tier: "powerful",
    contextK: 64,
    free: true,
    sectors: ["ura-ichiba", "sosaku-kobo"],
  },
  {
    id: "qwen/qwen-2.5-vl-72b-instruct:free",
    name: "Qwen 2.5 VL 72B (Free Tier)",
    provider: "Qwen",
    description: "Modelo de visão computacional de alta fidelidade para análise temporal de vídeos e transições a custo zero.",
    tier: "powerful",
    contextK: 64,
    free: true,
    sectors: ["sosaku-kobo"],
  },
  {
    id: "meta-llama/llama-3.2-11b-vision-instruct:free",
    name: "Llama 3.2 Vision 11B (Free Tier)",
    provider: "Meta",
    description: "Modelo visual leve e extremamente rápido da Meta para processamento de frames a custo zero.",
    tier: "fast",
    contextK: 128,
    free: true,
    sectors: ["sosaku-kobo"],
  },
  {
    id: "google/gemini-2.0-flash-thinking-exp:free",
    name: "Gemini 2.0 Thinking (Free Tier)",
    provider: "Google",
    description: "Modelo experimental da Google com capacidade avançada de raciocínio lógico em flash de alta velocidade.",
    tier: "powerful",
    contextK: 1048,
    free: true,
    sectors: ["sosaku-kobo", "sakusen-honbu"],
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

/**
 * Determina o setor ativo a partir do pathname atual e do localStorage
 */
export function getSectorFromPath(pathname: string): SectorId {
  if (
    pathname.startsWith("/criar-conteudo") || 
    pathname.startsWith("/calendario") ||
    pathname.startsWith("/postagem-manual") ||
    pathname.startsWith("/biblioteca") ||
    pathname.startsWith("/midias") ||
    pathname.startsWith("/agentes-ia") ||
    pathname.startsWith("/continuidade-ia") ||
    pathname.startsWith("/prompts") ||
    pathname.startsWith("/analise-site") ||
    pathname.startsWith("/lixeira-inteligente")
  ) {
    return "sosaku-kobo";
  }

  if (pathname.startsWith("/comercial")) {
    return "ura-ichiba";
  }

  if (
    pathname.startsWith("/admin") || 
    pathname.startsWith("/jobs") || 
    pathname.startsWith("/conselho-ia") || 
    pathname.startsWith("/momonga")
  ) {
    return "sakusen-honbu";
  }

  // Se estiver no chat ou na home, checa o activeTab da sidebar
  if (typeof window !== "undefined") {
    const savedTab = localStorage.getItem("ygn-sidebar-tab");
    if (savedTab === "criacao") return "sosaku-kobo";
    if (savedTab === "mercado") return "ura-ichiba";
  }

  return "iriguchi";
}

export const SECTOR_LABELS: Record<SectorId, string> = {
  iriguchi: "Entrada & Geral",
  "ura-ichiba": "Mercado & Vendas",
  "sosaku-kobo": "Criação & IA",
  "sakusen-honbu": "Operação & Auditoria",
};
