"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowUp, StopCircle, Trash2, Bot, User, Paperclip, Image, FileText, X, Video, Code, Lightbulb, HelpCircle, MessageSquare, SendHorizontal, ThumbsUp, ThumbsDown } from "lucide-react";
import { ModelSwitcher } from "@/components/model-switcher";
import { loadSelectedModel, saveSelectedModel, DEFAULT_MODEL_ID, getModel, getSectorFromPath, incrementModelUsage } from "@/lib/models";
import { useChatWorkspace } from "@/components/chat-workspace-provider";
import {
  CHAT_SYSTEM_MESSAGE,
  clearConversation,
  loadConversation,
  newConversationId,
  saveConversation,
  type ChatMessage,
} from "@/lib/chat-storage";

function cleanAssistantContent(content: string): string {
  if (!content) return "";
  // Strip lines starting with [FATO NEURAL DETECTADO: ...] or other bracketed memories
  let cleaned = content.replace(/\[FATO NEURAL DETECTADO:\s*[\s\S]*?\]/gi, "");
  cleaned = cleaned.replace(/\[MEMÓRIA DO CONTEXTO ANTERIOR[\s\S]*?\]/gi, "");
  return cleaned.trim();
}

function parseMessageFiles(content: string) {
  const fileRegex = /\[Arquivo Anexo:\s*([^\]]+)\s*\(([^)]+)\)\]/g;
  const files: { name: string; type: string }[] = [];
  let match;
  while ((match = fileRegex.exec(content)) !== null) {
    files.push({ name: match[1], type: match[2] });
  }
  const cleanContent = content.replace(fileRegex, "").trim();
  return { files, cleanContent };
}

function uid() {
  return newConversationId();
}

export function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const convId = searchParams.get("conv") ?? "";
  const initialQuery = searchParams.get("q");
  const { addChat, createConversation } = useChatWorkspace();

  const [messages, setMessages] = useState<ChatMessage[]>([CHAT_SYSTEM_MESSAGE]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(() => {
    const fromUrl = searchParams.get("model");
    return fromUrl || loadSelectedModel();
  });
  const [status, setStatus] = useState<"idle" | "streaming" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [spentCost, setSpentCost] = useState(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("yggnarok.kotaro.spent-cost") || "0");
  });

  const [feedbacks, setFeedbacks] = useState<Record<string, 'like' | 'dislike'>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("yggnarok.chat-feedback.v1");
      if (raw) {
        try {
          const list = JSON.parse(raw) as { messageId: string; rating: 'like' | 'dislike' }[];
          const map: Record<string, 'like' | 'dislike'> = {};
          list.forEach(f => { map[f.messageId] = f.rating; });
          setFeedbacks(map);
        } catch (_) {}
      }
    }
  }, []);

  const handleFeedback = (messageId: string, rating: 'like' | 'dislike') => {
    setFeedbacks(prev => {
      const next = { ...prev };
      if (next[messageId] === rating) {
        delete next[messageId];
      } else {
        next[messageId] = rating;
      }
      
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("yggnarok.chat-feedback.v1");
        let list: { messageId: string; rating: 'like' | 'dislike'; timestamp: string; model: string }[] = [];
        if (raw) {
          try { list = JSON.parse(raw); } catch (_) {}
        }
        
        list = list.filter(item => item.messageId !== messageId);
        
        if (next[messageId]) {
          list.push({
            messageId,
            rating,
            timestamp: new Date().toISOString(),
            model: selectedModel
          });
        }
        localStorage.setItem("yggnarok.chat-feedback.v1", JSON.stringify(list));
      }
      
      return next;
    });
  };

  const [feedbackTextId, setFeedbackTextId] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");

  const handleFeedbackCommentSubmit = (messageId: string) => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("yggnarok.chat-feedback.v1");
      let list: any[] = [];
      if (raw) {
        try { list = JSON.parse(raw); } catch (_) {}
      }
      
      list = list.map(item => {
        if (item.messageId === messageId) {
          return { 
            ...item, 
            comment: feedbackComment, 
            commentTimestamp: new Date().toISOString() 
          };
        }
        return item;
      });
      
      localStorage.setItem("yggnarok.chat-feedback.v1", JSON.stringify(list));
    }
    setFeedbackTextId(null);
    setFeedbackComment("");
  };

  const [attachedFiles, setAttachedFiles] = useState<{ id: string; name: string; type: string; url?: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [phrases] = useState<string[]>(() => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
    return [
      `${greeting}. Como posso ajudar?`,
      "O que você gostaria de criar hoje?",
      "Em que posso ser útil?",
      "Pronto para criar algo incrível?",
      "Vamos transformar suas ideias em conteúdo?",
      "Qual é o seu próximo grande projeto?",
      "Como posso impulsionar sua criatividade?",
    ];
  });

  function handleAttachClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    const newFiles = Array.from(files).map(file => {
      const isImage = file.type.startsWith("image/");
      return {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        type: file.type,
        url: isImage ? URL.createObjectURL(file) : undefined
      };
    });

    setAttachedFiles(prev => [...prev, ...newFiles]);
    e.target.value = "";
  }

  function removeAttachedFile(id: string) {
    setAttachedFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target?.url) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter(f => f.id !== id);
    });
  }

  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialQuerySentRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isCreatingRef = useRef(false);

  useEffect(() => {
    if (convId) {
      isCreatingRef.current = false;
      return;
    }
    if (isCreatingRef.current) return;
    isCreatingRef.current = true;

    const newId = newConversationId();
    const q = searchParams.get("q");
    const query = q ? `&q=${encodeURIComponent(q)}` : "";
    router.replace(`/chat?conv=${newId}${query}`);
  }, [convId, router, searchParams]);


  useEffect(() => {
    if (!convId) return;
    let cancelled = false;
    const timer = setTimeout(() => setHydrated(false), 0);
    void loadConversation(convId).then((loaded) => {
      if (!cancelled) {
        setMessages(loaded);
        setHydrated(true);
      }
    });
    return () => {
      clearTimeout(timer);
      cancelled = true;
    };
  }, [convId]);

  useEffect(() => {
    if (!hydrated || !convId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void saveConversation(convId, messages);
    }, 400);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [messages, convId, hydrated]);

  // AUTO-RESET RULE: Reset selected model back to default free model when active conversation context changes
  useEffect(() => {
    if (!convId) return;
    const timer = setTimeout(() => {
      setSelectedModel(DEFAULT_MODEL_ID);
      saveSelectedModel(DEFAULT_MODEL_ID);
    }, 0);
    return () => clearTimeout(timer);
  }, [convId]);

  // IDLE WATCHDOG: Reset selected model back to default free model on 15 minutes of user inactivity/idle
  useEffect(() => {
    if (typeof window === "undefined") return;

    const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
    const lastActiveKey = "yggnarok.chat.last-active";

    const updateActivity = () => {
      localStorage.setItem(lastActiveKey, String(Date.now()));
    };

    updateActivity();
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);

    const interval = setInterval(() => {
      const lastActive = Number(localStorage.getItem(lastActiveKey) || Date.now());
      const elapsed = Date.now() - lastActive;

      if (elapsed > IDLE_TIMEOUT_MS) {
        setSelectedModel((current) => {
          if (current !== DEFAULT_MODEL_ID) {
            saveSelectedModel(DEFAULT_MODEL_ID);
            return DEFAULT_MODEL_ID;
          }
          return current;
        });
      }
    }, 30000);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Sliding Window Memory: limit sent history to the last 20 messages to protect API costs
  const apiMessages = useMemo(() => {
    const raw = messages.map((m) => ({ role: m.role, content: m.content }));
    if (raw.length <= 20) return raw;

    // Always keep system prompt (index 0) and append only the last 19 messages
    const systemMsg = raw.find((m) => m.role === "system") || raw[0];
    const rest = raw.filter((m) => m.role !== "system").slice(-19);
    return [systemMsg, ...rest];
  }, [messages]);

  async function send(contentOverride?: string) {
    const content = (contentOverride ?? input).trim();
    if (!content || !convId) return;

    // Detect Active Sector
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
    const sector = getSectorFromPath(pathname);

    // --- SMART COST & QUALITY ROUTER (Front-end Firewall) ---
    const textForRouting = content.toLowerCase();
    
    // Rule 1: Image Request Interception
    const isImageRequest = /\b(gerar imagem|crie uma imagem|criar imagem|desenhe|gerar foto|criar foto|generate image|create image)\b/.test(textForRouting);
    
    // Rule 2: Code detection (Qwen 2.5 Coder 32B - Free)
    const isCodeRequest = 
      textForRouting.includes("```") || 
      /\b(function|const|let|import|javascript|typescript|python|html|css|sql|api|nextjs|react|código|programar|programação|bug|erro|compilar|site|página|layout|front-end|frontend|backend|componente|tela|estilizar|style|class|div|button|link|input|span|pages|route|db|database|supabase|vercel|deploy|build|npm|yarn|package|json|git|github|console|log|alert|window|document|href|target)\b/.test(textForRouting);
      
    // Rule 3: Business, Marketing & Strategic reasoning (Llama 3.3 70B - Free)
    const isBusinessRequest = /\b(campanha|estratégia|marketing|copywriting|vendas|negócio|copy|redigir|vender|análise de mercado|plano de negócios|estratégico|lançamento|conversão|monetização|precificação|produto|funil|lead|tráfego|anúncio|ads|seo)\b/.test(textForRouting);

    // Rule 4: Deep Logic, Mathematics & Science (DeepSeek R1 - Free Reasoning)
    const isLogicRequest = /\b(calcule|equação|lógica|matemática|raciocínio|científico|algoritmo|fórmula|física|química|resolver problema|complexo|matemático|filosofia|dedução|indução)\b/.test(textForRouting);

    // Rule 5: Greetings & basic messages (Llama 3.1 8B - Fast & Free)
    const isSimpleGreeting = 
      content.length < 15 || 
      /\b(oi|olá|ola|bom dia|boa tarde|boa noite|opa|valeu|obrigado|obrigada|hey|hello|hi|tudo bem|tudo bom)\b/.test(textForRouting);

    // Rule 6: Specific detailed query
    const isSpecificQuery = 
      content.length > 50 || 
      /\b(como|por que|porque|explique|diferença|quais|qual|passos|analise|comparação|vantagens|desvantagens|tutorial|passo a passo)\b/.test(textForRouting);

    const premiumModels = [
      "openai/gpt-4o",
      "openai/o1",
      "openai/o3-mini",
      "anthropic/claude-3-5-sonnet",
      "anthropic/claude-3-7-sonnet",
      "anthropic/claude-3-7-sonnet:thinking",
      "anthropic/claude-3-opus",
      "google/gemini-2.0-pro-exp-05-26",
      "x-ai/grok-3"
    ];

    let modelToUse = selectedModel;

    // --- SECTOR SPECIFIC AND DIRECTED ROUTING (Avoids out-of-bounds queries) ---
    if (isImageRequest) {
      modelToUse = "google/gemini-2.0-flash-001";
    } else if (sector === "sosaku-kobo") {
      // Criação & IA Sector: prioritize creative writing, copywriting, scripts
      if (isCodeRequest) {
        modelToUse = "qwen/qwen-2.5-coder-32b-instruct"; // Free & specialized
      } else if (isLogicRequest) {
        modelToUse = "google/gemini-2.0-flash-thinking-exp"; // Free reasoning
      } else if (isSpecificQuery || isBusinessRequest) {
        modelToUse = "meta-llama/llama-3.3-70b-instruct"; // Free market flagship for specific/business questions
      } else if (premiumModels.includes(selectedModel)) {
        // Respect thinking/creative custom choices if already Anthropic or Grok 3
        if (selectedModel.startsWith("anthropic/") || selectedModel === "x-ai/grok-3") {
          modelToUse = selectedModel;
        } else {
          modelToUse = "anthropic/claude-3.7-sonnet"; // Default premium creator
        }
      } else {
        modelToUse = "mistralai/mistral-nemo"; // Free excellent creative
      }
    } else if (sector === "ura-ichiba") {
      // Mercado & Vendas Sector: prioritize CRO, copy, sales campaigns, analytics
      if (isLogicRequest) {
        modelToUse = "deepseek/deepseek-r1"; // Free reasoning
      } else if (isSpecificQuery || isBusinessRequest) {
        modelToUse = "meta-llama/llama-3.3-70b-instruct"; // Free market flagship
      } else if (premiumModels.includes(selectedModel)) {
        if (selectedModel === "x-ai/grok-3" || selectedModel === "openai/gpt-4o" || selectedModel.startsWith("anthropic/claude-3-opus")) {
          modelToUse = selectedModel;
        } else {
          modelToUse = "x-ai/grok-3"; // Default premium market intelligence
        }
      } else {
        modelToUse = "meta-llama/llama-3.3-70b-instruct"; // Free market flagship
      }
    } else if (sector === "sakusen-honbu") {
      // Operação & Auditoria Sector: prioritize code audit, database structures, heavy logic
      if (isCodeRequest) {
        modelToUse = "qwen/qwen-2.5-coder-32b-instruct";
      } else if (isLogicRequest || selectedModel === "deepseek/deepseek-r1") {
        modelToUse = "deepseek/deepseek-r1";
      } else if (premiumModels.includes(selectedModel)) {
        if (selectedModel.startsWith("openai/o") || selectedModel === "deepseek/deepseek-r1" || selectedModel.startsWith("anthropic/claude-3.7-sonnet")) {
          modelToUse = selectedModel;
        } else {
          modelToUse = "openai/o3-mini"; // Default premium engineering logic
        }
      } else {
        modelToUse = "google/gemini-2.0-flash-thinking-exp"; // Free advanced logic
      }
    } else {
      // Entrada & Geral Sector: balanced fast models
      if (isCodeRequest) {
        modelToUse = "qwen/qwen-2.5-coder-32b-instruct";
      } else if (isLogicRequest) {
        modelToUse = "deepseek/deepseek-r1";
      } else if (isBusinessRequest) {
        modelToUse = "meta-llama/llama-3.3-70b-instruct";
      } else if (isSpecificQuery) {
        modelToUse = "meta-llama/llama-3.3-70b-instruct"; // Switch to high-capacity 70B for specific queries
      } else if (isSimpleGreeting) {
        modelToUse = "meta-llama/llama-3.2-3b-instruct"; // Ultra fast free
      } else if (premiumModels.includes(selectedModel)) {
        modelToUse = "openai/gpt-4o";
      } else {
        modelToUse = "meta-llama/llama-3.1-8b-instruct";
      }
    }

    // Auto-update model UI dropdown on selection change
    if (modelToUse !== selectedModel) {
      setSelectedModel(modelToUse);
      saveSelectedModel(modelToUse);
    }
    // ---------------------------------------------------------

    // --- USER PREMIUM PAID MODEL QUOTA CONTROL & ADMIN BYPASS ---
    const modelObj = getModel(modelToUse);
    if (!modelObj.free) {
      const username = typeof window !== "undefined" ? (localStorage.getItem("yggnarok.username") || "kotaro") : "kotaro";
      const isKotaro = username === "kotaro";

      if (isKotaro) {
        // Kotaro gets unlimited usage! But we track their total spent cost in USD
        const currentCost = Number(localStorage.getItem("yggnarok.kotaro.spent-cost") || "0");
        const nextCost = currentCost + 0.015; // Estimate average cost of $0.015 USD per prompt
        localStorage.setItem("yggnarok.kotaro.spent-cost", String(nextCost));
        setSpentCost(nextCost);
      } else {
        // Regular user quota validation
        const QUOTA_KEY = "yggnarok.user.paid-quota.v1";
        const rawQuota = localStorage.getItem(QUOTA_KEY);
        const currentQuota = rawQuota !== null ? Number(rawQuota) : 10;

        if (currentQuota <= 0) {
          setError("Sua cota gratuita de testes para modelos pagos foi atingida. Continue usando nossos excelentes modelos Open-Source gratuitos ou adquira o plano Pro para créditos premium ilimitados!");
          setStatus("error");

          setSelectedModel(DEFAULT_MODEL_ID);
          saveSelectedModel(DEFAULT_MODEL_ID);
          return; // Block execution
        } else {
          localStorage.setItem(QUOTA_KEY, String(currentQuota - 1));
        }
      }
    }
    // ------------------------------------------------------------

    let finalContent = content;
    if (attachedFiles.length > 0) {
      const fileListStr = attachedFiles.map(f => `[Arquivo Anexo: ${f.name} (${f.type})]`).join("\n");
      finalContent = `${fileListStr}\n\n${content}`;
      setAttachedFiles([]);
    }

    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    setError(null);
    setStatus("streaming");

    const userMessage: ChatMessage = { id: uid(), role: "user", content: finalContent };
    const assistantId = uid();

    setMessages((current) => [
      ...current,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");

    const title = content.length > 52 ? `${content.slice(0, 52)}…` : content;
    addChat({
      id: convId,
      title,
      href: `/chat?conv=${convId}`,
    });

    // Enrich system context with high-capacity cognitive memories and financial self-awareness context
    const enrichedMessages = [...apiMessages];
    try {
      const username = typeof window !== "undefined" ? (localStorage.getItem("yggnarok.username") || "kotaro") : "kotaro";
      const storedMems = localStorage.getItem(`yggnarok.${username}.ltm_memories`);
      const totalSpent = Number(localStorage.getItem("yggnarok.kotaro.spent-cost") || "0");
      const QUOTA_KEY = "yggnarok.user.paid-quota.v1";
      const remainingQuota = Number(localStorage.getItem(QUOTA_KEY) || "10");
      const activeModelName = modelObj.name;
      const activeModelPrice = modelObj.free ? "GRÁTIS (Totalmente livre de custo)" : "PAGO (Consome saldo financeiro premium)";
      
      let additionalInstructions = "";

      // 1. Add advanced cognitive semantic memories hierarchy if available
      if (storedMems) {
        const memoriesList = JSON.parse(storedMems) as { category: string; fact: string }[];
        if (memoriesList.length > 0) {
          additionalInstructions += `\n\n[SISTEMA DE MEMÓRIA COGNITIVA DEDICADA DE LONGO PRAZO (LTM) - CAPACIDADE VASTA]:` +
            `\nVocê possui uma base de dados cognitiva dedicada e permanente de aprendizados acumulados. Utilize estas memórias e diretrizes para personalizar, lapidar e guiar suas respostas de forma contínua ao usuário Kotaro sem que ele precise repetir preferências.`;
          
          // Categorize and isolate facts for extreme clarity in large context windows
          const copyFacts = memoriesList.filter(m => m.category === "copy");
          const techFacts = memoriesList.filter(m => m.category === "tecnico");
          const salesFacts = memoriesList.filter(m => m.category === "comercial");
          const prefFacts = memoriesList.filter(m => m.category === "preferencias");

          if (prefFacts.length > 0) {
            additionalInstructions += `\n\n  🧬 Namespace: [PREFERÊNCIAS & IDENTIDADE DO KOTARO]\n  ` + 
              prefFacts.map((m) => `• ${m.fact}`).join("\n  ");
          }
          if (copyFacts.length > 0) {
            additionalInstructions += `\n\n  🎨 Namespace: [COPYWRITING, REDAÇÃO & TOM DE ESCRITA]\n  ` + 
              copyFacts.map((m) => `• ${m.fact}`).join("\n  ");
          }
          if (techFacts.length > 0) {
            additionalInstructions += `\n\n  💻 Namespace: [DIRETRIZES TÉCNICAS, CÓDIGO & INFRA]\n  ` + 
              techFacts.map((m) => `• ${m.fact}`).join("\n  ");
          }
          if (salesFacts.length > 0) {
            additionalInstructions += `\n\n  📈 Namespace: [METAS DE CONVERSÃO, CRO & VENDAS]\n  ` + 
              salesFacts.map((m) => `• ${m.fact}`).join("\n  ");
          }
        }
      }

      // 2. Add dynamic cognitive self-evolution directive
      additionalInstructions += `\n\n[DIRETRIZ DE AUTO-EVOLUÇÃO RECURSIVA]:` +
        `\nVocê é parte de um cérebro neural dinâmico e cumulativo. Se, durante esta conversa com Kotaro, você detectar um novo padrão de preferência técnica, um tom de escrita que o usuário aprovou explicitamente, ou uma restrição comercial crítica de negócios, você deve sugerir a assimilação deste aprendizado de forma discreta adicionando ao final da sua resposta a linha exata:` +
        `\n[FATO NEURAL DETECTADO: <categoria> | <descrição do aprendizado>]` +
        `\n(Opções de categoria: "copy", "tecnico", "comercial", "preferencias". O Supervisor de Reflexão lerá esta linha e persistirá o fato permanentemente na sua memória de longo prazo!)`;

      // 3. Add financial self-awareness context
      additionalInstructions += `\n\n[CONTEXTO OPERACIONAL DE GASTOS & BUDGET DO SISTEMA]:` +
        `\n- Usuário ativo: Kotaro (Administrador Master com bypass de cota)` +
        `\n- Modelo ativo que você está rodando agora: "${activeModelName}" (${activeModelPrice})` +
        `\n- Total financeiro acumulado gasto por Kotaro no ecossistema: $${totalSpent.toFixed(3)} USD` +
        `\n- Cota restante para usuários comuns (não-admins): ${remainingQuota} chamadas` +
        `\n- DIRETRIZ FINANCEIRA CRÍTICA: Você possui autoconsciência financeira. Se você estiver rodando em um modelo PAGO e a solicitação do usuário for excessivamente simples (como saudações "oi", interações curtas, agradecimentos ou tarefas banais), responda de forma muito concisa e eduque o usuário de forma amigável sobre os custos de tokens do modelo ativo, sugerindo que ele selecione uma opção GRÁTIS excelente (como Mistral Nemo, Qwen Coder ou Llama 3.3) no switcher acima para poupar orçamento. Seja um parceiro na economia de tokens!`;

      const systemIndex = enrichedMessages.findIndex((m) => m.role === "system");
      if (systemIndex !== -1) {
        enrichedMessages[systemIndex] = {
          ...enrichedMessages[systemIndex],
          content: enrichedMessages[systemIndex].content + additionalInstructions
        };
      } else {
        enrichedMessages.unshift({
          role: "system",
          content: CHAT_SYSTEM_MESSAGE + additionalInstructions
        });
      }
    } catch {
      // fallback
    }

    let accumulatedContent = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...enrichedMessages, { role: "user", content }],
          model: modelToUse,
        }),
        signal: abort.signal,
      });

      if (!response.ok || !response.body) {
        const detail = await response.text().catch(() => "");
        throw new Error(detail || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        accumulatedContent += chunk;
        setMessages((current) =>
          current.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        );
      }

      const promptTokens = Math.ceil((input || "").length / 3.5);
      const responseTokens = Math.ceil(accumulatedContent.length / 3.5);
      const totalTokens = promptTokens + responseTokens;
      setStatus("idle");
      incrementModelUsage(modelToUse, totalTokens);

      // Save conversation immediately after streaming finishes successfully!
      const finalMessages: ChatMessage[] = [
        ...messages,
        userMessage,
        { id: assistantId, role: "assistant", content: accumulatedContent }
      ];
      void saveConversation(convId, finalMessages);
    } catch (err) {
      if (abort.signal.aborted) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Falha desconhecida.");

      if (accumulatedContent.length > 0) {
        const finalMessages: ChatMessage[] = [
          ...messages,
          userMessage,
          { id: assistantId, role: "assistant", content: accumulatedContent }
        ];
        void saveConversation(convId, finalMessages);
      }
    }
  }

  useEffect(() => {
    if (!initialQuery || !hydrated || !convId || initialQuerySentRef.current || status !== "idle") {
      return;
    }
    const hasUser = messages.some((m) => m.role === "user");
    if (hasUser) return;

    initialQuerySentRef.current = true;
    const timer = setTimeout(() => {
      void send(initialQuery);
    }, 0);
    router.replace(`/chat?conv=${convId}`);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, hydrated, convId]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeyDownCallback = useEffect(() => {}, []);

  function stop() {
    abortRef.current?.abort();
    setStatus("idle");
  }

  async function clearChat() {
    abortRef.current?.abort();
    setStatus("idle");
    setError(null);
    setInput("");
    clearConversation(convId);
    const id = await createConversation({ title: "Nova conversa" });
    setMessages([CHAT_SYSTEM_MESSAGE]);
    router.replace(`/chat?conv=${id}`);
  }

  const visibleMessages = messages.filter((m) => m.role !== "system");
  const isEmpty = visibleMessages.length === 0;

  useEffect(() => {
    if (!isEmpty) return;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const cycle = () => {
      setFading(true);
      timeout = setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setFading(false);
      }, 300);
    };
    const interval = setInterval(cycle, 5000);
    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [isEmpty, phrases]);

  if (!convId || !hydrated) {
    return (
      <div className="grid flex-1 place-items-center text-sm text-muted">
        Carregando conversa…
      </div>
    );
  }

  const renderInputBox = (centered: boolean) => (
    <div className={`mx-auto w-full ${centered ? "max-w-2xl" : "max-w-3xl"}`}>
      <div className={`relative flex flex-col rounded-2xl border-2 border-line/35 shadow-md hover:shadow-lg transition-all duration-300 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15 focus-within:shadow-[0_0_50px_-12px_rgba(234,179,8,0.25)] ${centered ? "bg-surface-strong/60 backdrop-blur-md" : "bg-surface-strong"}`}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
        />

        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 pb-2 pt-4 border-b border-line/10">
            {attachedFiles.map((file) => (
              <div key={file.id} className="relative flex items-center gap-2 rounded-xl border border-line bg-surface/80 px-2.5 py-1.5 text-xs text-foreground shadow-sm">
                {file.type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.url} alt={file.name} className="h-5 w-5 rounded object-cover" />
                ) : (
                  <FileText size={13} className="text-brand shrink-0" />
                )}
                <span className="max-w-[100px] truncate font-medium">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachedFile(file.id)}
                  className="ml-1 text-muted hover:text-red-500 transition-colors cursor-pointer"
                  title="Remover arquivo"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={centered ? "Como o YGGNAROK pode ajudar?" : "Envie uma mensagem..."}
          rows={1}
          className={`w-full resize-none bg-transparent px-5 py-5 text-base text-foreground placeholder:text-muted focus:outline-none ${centered ? "min-h-[140px]" : "max-h-[250px] min-h-[75px]"}`}
        />
        <div className="flex items-center justify-between p-3 pt-0">
          <div className="flex items-center gap-1.5">
            <ModelSwitcher
              compact
              onModelChange={(id) => {
                setSelectedModel(id);
                saveSelectedModel(id);
              }}
            />
            <button
              type="button"
              onClick={handleAttachClick}
              className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-sidebar-hover hover:text-foreground cursor-pointer"
              title="Anexar arquivos ou imagens"
            >
              <Paperclip size={16} />
            </button>
            {spentCost > 0 && (
              <div className="flex items-center gap-1.5 ml-2 px-2.5 py-1.5 rounded-xl border border-line bg-surface/50 text-[11px] font-semibold select-none shadow-sm transition-all duration-300">
                {spentCost < 2.00 ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    Consumo: ${spentCost.toFixed(2)}
                  </span>
                ) : spentCost < 5.00 ? (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                    </span>
                    Consumo Médio: ${spentCost.toFixed(2)}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold animate-pulse">
                    <span>🚨</span> Consumo Alto: ${spentCost.toFixed(2)}
                  </span>
                )}
                
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("yggnarok.kotaro.spent-cost", "0");
                    setSpentCost(0);
                  }}
                  className="ml-1 text-[9px] hover:text-foreground text-muted underline cursor-pointer"
                  title="Zerar rastreador de gastos"
                >
                  Zerar
                </button>
              </div>
            )}
          </div>
          {status === "streaming" ? (
            <button
              type="button"
              onClick={stop}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background font-bold text-xs transition duration-300 hover:opacity-90 shadow-sm cursor-pointer animate-pulse"
              title="Parar geração"
            >
              <span>Parar</span>
              <StopCircle size={14} strokeWidth={2.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void send()}
              disabled={!input.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-neutral-950 font-bold text-xs transition duration-300 hover:bg-brand-strong disabled:opacity-40 shadow-sm cursor-pointer"
              title="Enviar"
            >
              <span>Enviar</span>
              <SendHorizontal size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">
        O YGGNAROK IA esforça-se para acertar, mas ainda pode errar. Confirme dados críticos antes de agir.
      </p>
    </div>
  );

  if (isEmpty) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 overflow-y-auto animate-[pulse_20s_infinite]">
        <div className="w-full max-w-2xl text-center space-y-8 my-auto">
          {/* Header */}
          <div>
            <h2
              className="bg-gradient-to-r from-foreground to-muted bg-clip-text text-2xl font-extrabold tracking-tighter text-transparent transition-all duration-300 sm:text-4xl"
              style={{ opacity: fading ? 0.3 : 1, transform: fading ? "translateY(4px)" : "translateY(0)" }}
            >
              {phrases[phraseIndex]}
            </h2>
            <p className="text-xs text-muted mt-2 font-medium">Selecione uma sugestão operacional ou digite sua instrução abaixo.</p>
          </div>
          
          {/* Exemplos de uso Cards Grid */}
          <div className="text-left space-y-3">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest pl-1">Exemplos de uso</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  title: "Criar um roteiro",
                  desc: "Estruture roteiros de alta retenção para YouTube e Reels.",
                  prompt: "Escreva um roteiro completo de alta conversão sobre: ",
                  icon: Video,
                  color: "border-brand/20 hover:border-brand/60 bg-brand/5 hover:bg-brand/10 text-brand"
                },
                {
                  title: "Analisar código",
                  desc: "Revise algoritmos, otimize consultas SQL e cace bugs.",
                  prompt: "Analise o seguinte trecho de código em busca de erros e otimizações:\n\n```\n\n```",
                  icon: Code,
                  color: "border-purple-500/20 hover:border-purple-500/60 bg-purple-500/5 hover:bg-purple-500/10 text-purple-500"
                },
                {
                  title: "Gerar ideias criativas",
                  desc: "Faça brainstorm de negócios, marketing e novas campanhas.",
                  prompt: "Faça um brainstorm estratégico com 5 ideias inovadoras para: ",
                  icon: Lightbulb,
                  color: "border-amber-500/20 hover:border-amber-500/60 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500"
                },
                {
                  title: "Responder perguntas",
                  desc: "Esclareça dúvidas complexas e sintetize relatórios técnicos.",
                  prompt: "Explique de forma didática e aprofundada como funciona: ",
                  icon: HelpCircle,
                  color: "border-sky-500/20 hover:border-sky-500/60 bg-sky-500/5 hover:bg-sky-500/10 text-sky-500"
                }
              ].map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInput(card.prompt);
                      textareaRef.current?.focus();
                    }}
                    className={`group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${card.color}`}
                  >
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface border border-line/25 shadow-sm group-hover:scale-110 transition duration-300">
                      <CardIcon size={16} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-foreground group-hover:text-brand transition duration-200">{card.title}</h3>
                      <p className="text-[11px] text-muted leading-relaxed font-medium">{card.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Box in the middle of screen */}
          <div className="pt-2">
            {renderInputBox(true)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-sm font-semibold text-foreground">YGGNAROK Assistente</h1>
        </div>
        <button
          type="button"
          onClick={() => void clearChat()}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-surface hover:text-red-600 dark:hover:text-red-400"
          title="Nova conversa"
        >
          <Trash2 size={15} />
          <span className="hidden sm:inline">Limpar chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-40 pt-2">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {visibleMessages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`mt-1 grid size-7 shrink-0 place-items-center rounded-lg ${
                  m.role === "user"
                    ? "bg-surface-strong text-muted ring-1 ring-line"
                    : "bg-brand text-neutral-950"
                }`}
              >
                {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div
                className={`max-w-[85%] text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-surface-strong text-foreground ring-1 ring-line rounded-2xl px-4 py-3"
                    : "text-foreground pt-1.5"
                }`}
              >
                {m.role === "user" ? (() => {
                  const { files, cleanContent } = parseMessageFiles(m.content);
                  return (
                    <>
                      {files.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-2">
                          {files.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 rounded-lg border border-line bg-surface/50 px-2.5 py-1 text-xs text-foreground font-medium select-none shadow-sm">
                              {file.type.startsWith("image/") ? (
                                <Image size={13} className="text-brand shrink-0" />
                              ) : (
                                <FileText size={13} className="text-brand shrink-0" />
                              )}
                              <span className="max-w-[120px] truncate">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{cleanContent}</p>
                    </>
                  );
                })() : (
                  <div className="space-y-3">
                    <p className="whitespace-pre-wrap">{cleanAssistantContent(m.content)}</p>
                    
                    {/* Feedback Rating Buttons */}
                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-line/10 select-none">
                      <button
                        type="button"
                        onClick={() => handleFeedback(m.id, 'like')}
                        className={`p-1.5 rounded-lg border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                          feedbacks[m.id] === 'like'
                            ? "bg-amber-500/10 dark:bg-brand/15 border-amber-500/30 dark:border-brand/40 text-amber-600 dark:text-brand scale-110 shadow-sm"
                            : "bg-transparent border-transparent text-muted hover:border-line/40 hover:bg-surface-strong hover:text-foreground"
                        }`}
                        title="Gostei da resposta"
                      >
                        <ThumbsUp size={13} className={feedbacks[m.id] === 'like' ? "fill-current" : ""} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFeedback(m.id, 'dislike')}
                        className={`p-1.5 rounded-lg border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                          feedbacks[m.id] === 'dislike'
                            ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 scale-110 shadow-sm"
                            : "bg-transparent border-transparent text-muted hover:border-line/40 hover:bg-surface-strong hover:text-foreground"
                        }`}
                        title="Não gostei da resposta"
                      >
                        <ThumbsDown size={13} className={feedbacks[m.id] === 'dislike' ? "fill-current" : ""} />
                      </button>
                      
                      {feedbacks[m.id] && (
                        <span className="text-[10px] text-brand/80 font-semibold tracking-wide animate-fade-in pl-1 select-none">
                          Feedback coletado! Obrigado.
                        </span>
                      )}
                    </div>

                    {/* Conditional Suggestion Input Box */}
                    {feedbacks[m.id] === 'dislike' && (
                      <div className="animate-fade-in mt-2 p-3 rounded-xl border border-line bg-surface/40 backdrop-blur-sm space-y-2 max-w-md shadow-sm">
                        <div className="text-[10px] font-bold text-muted uppercase tracking-wider select-none">
                          Como podemos melhorar esta resposta?
                        </div>
                        <textarea
                          rows={2}
                          value={feedbackTextId === m.id ? feedbackComment : ""}
                          onChange={(e) => {
                            setFeedbackTextId(m.id);
                            setFeedbackComment(e.target.value);
                          }}
                          placeholder="Ex: Erro no código, tom inadequado, informação incorreta..."
                          className="w-full text-xs bg-surface-strong border border-line rounded-lg p-2.5 focus:border-brand focus:ring-1 focus:ring-brand/35 text-foreground placeholder:text-muted/60 outline-none resize-none"
                        />
                        <div className="flex items-center gap-2 select-none">
                          <button
                            type="button"
                            onClick={() => handleFeedbackCommentSubmit(m.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-brand hover:bg-brand-strong text-neutral-950 text-[10px] font-extrabold transition-all duration-200 cursor-pointer shadow-sm shadow-brand/10 hover:shadow-brand/20"
                          >
                            Enviar Sugestão
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackTextId(null);
                              setFeedbackComment("");
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-transparent text-muted hover:text-foreground text-[10px] font-semibold transition-all duration-200 cursor-pointer"
                          >
                            Ignorar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {error && (
            <div className="rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background to-transparent px-4 pb-5 pt-12 pointer-events-none">
        <div className="pointer-events-auto">
          {renderInputBox(false)}
        </div>
      </div>
    </div>
  );
}
