"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowUp, StopCircle, Trash2, Bot, User } from "lucide-react";
import { ModelSwitcher } from "@/components/model-switcher";
import { loadSelectedModel, saveSelectedModel, DEFAULT_MODEL_ID, getModel, getSectorFromPath } from "@/lib/models";
import { useChatWorkspace } from "@/components/chat-workspace-provider";
import {
  CHAT_SYSTEM_MESSAGE,
  clearConversation,
  loadConversation,
  newConversationId,
  saveConversation,
  type ChatMessage,
} from "@/lib/chat-storage";

function uid() {
  return newConversationId();
}

export function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const convId = searchParams.get("conv") ?? "";
  const initialQuery = searchParams.get("q");
  const { addChat, createConversation, mode } = useChatWorkspace();

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

  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialQuerySentRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (convId) return;
    void createConversation({ title: "Nova conversa" }).then((id) => {
      const q = searchParams.get("q");
      const query = q ? `&q=${encodeURIComponent(q)}` : "";
      router.replace(`/chat?conv=${id}${query}`);
    });
  }, [convId, router, searchParams, createConversation]);

  useEffect(() => {
    if (!convId || mode !== "remote") return;
    void fetch("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: convId, title: "Nova conversa" }),
    });
  }, [convId, mode]);

  useEffect(() => {
    if (!convId) return;
    let cancelled = false;
    setHydrated(false);
    void loadConversation(convId).then((loaded) => {
      if (!cancelled) {
        setMessages(loaded);
        setHydrated(true);
      }
    });
    return () => {
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
    setSelectedModel(DEFAULT_MODEL_ID);
    saveSelectedModel(DEFAULT_MODEL_ID);
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
      /\b(function|const|let|import|javascript|typescript|python|html|css|sql|api|nextjs|react|código|programar|programação|bug|erro|compilar)\b/.test(textForRouting);
      
    // Rule 3: Business, Marketing & Strategic reasoning (Llama 3.3 70B - Free)
    const isBusinessRequest = /\b(campanha|estratégia|marketing|copywriting|vendas|negócio|copy|redigir|vender|análise de mercado|plano de negócios|estratégico|lançamento|conversão)\b/.test(textForRouting);

    // Rule 4: Deep Logic, Mathematics & Science (DeepSeek R1 - Free Reasoning)
    const isLogicRequest = /\b(calcule|equação|lógica|matemática|raciocínio|científico|algoritmo|fórmula|física|química|resolver problema)\b/.test(textForRouting);

    // Rule 5: Greetings & basic messages (Llama 3.1 8B - Fast & Free)
    const isSimpleGreeting = 
      content.length < 15 || 
      /\b(oi|olá|ola|bom dia|boa tarde|boa noite|opa|valeu|obrigado|obrigada|hey|hello|hi|tudo bem|tudo bom)\b/.test(textForRouting);

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

    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    setError(null);
    setStatus("streaming");

    const userMessage: ChatMessage = { id: uid(), role: "user", content };
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
    let enrichedMessages = [...apiMessages];
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
              prefFacts.map((m, idx) => `• ${m.fact}`).join("\n  ");
          }
          if (copyFacts.length > 0) {
            additionalInstructions += `\n\n  🎨 Namespace: [COPYWRITING, REDAÇÃO & TOM DE ESCRITA]\n  ` + 
              copyFacts.map((m, idx) => `• ${m.fact}`).join("\n  ");
          }
          if (techFacts.length > 0) {
            additionalInstructions += `\n\n  💻 Namespace: [DIRETRIZES TÉCNICAS, CÓDIGO & INFRA]\n  ` + 
              techFacts.map((m, idx) => `• ${m.fact}`).join("\n  ");
          }
          if (salesFacts.length > 0) {
            additionalInstructions += `\n\n  📈 Namespace: [METAS DE CONVERSÃO, CRO & VENDAS]\n  ` + 
              salesFacts.map((m, idx) => `• ${m.fact}`).join("\n  ");
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
    } catch (e) {
      // fallback
    }

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
        setMessages((current) =>
          current.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        );
      }

      setStatus("idle");
    } catch (err) {
      if (abort.signal.aborted) return;
      setStatus("error");
      setError(err instanceof Error ? err.message : "Falha desconhecida.");
    }
  }

  useEffect(() => {
    if (!initialQuery || !hydrated || !convId || initialQuerySentRef.current || status !== "idle") {
      return;
    }
    const hasUser = messages.some((m) => m.role === "user");
    if (hasUser) return;

    initialQuerySentRef.current = true;
    void send(initialQuery);
    router.replace(`/chat?conv=${convId}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, hydrated, convId]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

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

  if (!convId || !hydrated) {
    return (
      <div className="grid flex-1 place-items-center text-sm text-muted">
        Carregando conversa…
      </div>
    );
  }

  const renderInputBox = (centered: boolean) => (
    <div className={`mx-auto w-full ${centered ? "max-w-2xl" : "max-w-3xl"}`}>
      <div className={`relative flex flex-col rounded-2xl border border-line shadow-sm transition focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/15 ${centered ? "bg-surface-strong/50 backdrop-blur-md" : "bg-surface-strong"}`}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={centered ? "Como o YGGNAROK pode ajudar?" : "Envie uma mensagem..."}
          rows={1}
          className={`w-full resize-none bg-transparent px-4 py-4 text-sm text-foreground placeholder:text-muted focus:outline-none ${centered ? "min-h-[120px]" : "max-h-[250px] min-h-[60px]"}`}
        />
        <div className="flex items-center justify-between p-2 pt-0">
          <div className="flex items-center gap-1">
            <ModelSwitcher
              compact
              onModelChange={(id) => {
                setSelectedModel(id);
                saveSelectedModel(id);
              }}
            />
            {spentCost > 0 && (
              <div className="flex items-center gap-1.5 ml-2 px-2 py-1 rounded-lg border border-line bg-surface/50 text-[11px] font-medium select-none shadow-sm transition-all duration-300">
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
              className="grid size-8 place-items-center rounded-lg bg-foreground text-background transition hover:opacity-90"
              title="Parar geração"
            >
              <StopCircle size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void send()}
              disabled={!input.trim()}
              className="grid size-8 place-items-center rounded-lg bg-brand text-neutral-950 transition hover:bg-brand-strong disabled:opacity-40"
              title="Enviar"
            >
              <ArrowUp size={15} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">
        O YGGNAROK IA pode cometer erros. Verifique informações críticas.
      </p>
    </div>
  );

  if (isEmpty) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

    return (
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl text-center">
          <h2 className="mb-8 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {greeting}. Como posso ajudar?
          </h2>
          {renderInputBox(true)}
          
          <div className="mt-8 flex flex-wrap justify-center gap-2">
             <button onClick={() => setInput("Me ajude a planejar uma campanha comercial estratégica.")} className="rounded-full border border-line bg-surface px-4 py-2 text-xs text-muted transition hover:border-brand/30 hover:text-foreground">Planejar campanha</button>
             <button onClick={() => setInput("Escreva um roteiro curto para um vídeo no Instagram sobre...")} className="rounded-full border border-line bg-surface px-4 py-2 text-xs text-muted transition hover:border-brand/30 hover:text-foreground">Escrever roteiro</button>
             <button onClick={() => setInput("Quais são os passos para otimizar conversão de vendas?")} className="rounded-full border border-line bg-surface px-4 py-2 text-xs text-muted transition hover:border-brand/30 hover:text-foreground">Otimizar vendas</button>
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
                <p className="whitespace-pre-wrap">{m.content}</p>
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
