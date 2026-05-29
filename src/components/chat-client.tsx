"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowUp, StopCircle, Trash2, Bot, User } from "lucide-react";
import { ModelSwitcher } from "@/components/model-switcher";
import { loadSelectedModel, saveSelectedModel } from "@/lib/models";
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const apiMessages = useMemo(
    () => messages.map((m) => ({ role: m.role, content: m.content })),
    [messages],
  );

  async function send(contentOverride?: string) {
    const content = (contentOverride ?? input).trim();
    if (!content || !convId) return;

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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...apiMessages, { role: "user", content }],
          model: selectedModel,
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

  if (!convId || !hydrated) {
    return (
      <div className="grid flex-1 place-items-center text-sm text-muted">
        Carregando conversa…
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
        <div>
          <h1 className="text-base font-semibold text-foreground">YGGNAROK Assistente</h1>
          <p className="text-xs text-muted">Void &amp; Amber · Modelo Base</p>
        </div>
        {visibleMessages.length > 0 && (
          <button
            type="button"
            onClick={() => void clearChat()}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted transition hover:bg-surface hover:text-red-600 dark:hover:text-red-400"
            title="Nova conversa"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Nova conversa</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-36 pt-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {visibleMessages.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-sidebar-active text-brand">
                <Bot size={32} />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Como posso ajudar hoje?
              </h2>
              <p className="mt-2 text-sm text-muted">
                Operações, conteúdo, vendas e trabalhos — respostas em português.
              </p>
            </div>
          ) : (
            visibleMessages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`grid size-8 shrink-0 place-items-center rounded-xl ${
                    m.role === "user"
                      ? "bg-surface-strong text-muted ring-1 ring-line"
                      : "bg-brand text-neutral-950"
                  }`}
                >
                  {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-surface-strong text-foreground ring-1 ring-line"
                      : "text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))
          )}

          {error && (
            <div className="rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background to-transparent px-4 pb-5 pt-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="relative flex items-end gap-2 rounded-2xl border border-line bg-surface-strong shadow-sm transition focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/15">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Envie uma mensagem…"
              rows={1}
              className="max-h-[200px] min-h-[56px] w-full resize-none bg-transparent py-4 pl-4 pr-28 text-sm text-foreground placeholder:text-muted focus:outline-none"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <ModelSwitcher
                compact
                onModelChange={(id) => {
                  setSelectedModel(id);
                  saveSelectedModel(id);
                }}
              />
              {status === "streaming" ? (
                <button
                  type="button"
                  onClick={stop}
                  className="grid size-9 place-items-center rounded-xl bg-foreground text-background transition hover:opacity-90"
                  title="Parar geração"
                >
                  <StopCircle size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void send()}
                  disabled={!input.trim()}
                  className="grid size-9 place-items-center rounded-xl bg-brand text-neutral-950 transition hover:bg-brand-strong disabled:opacity-40"
                  title="Enviar"
                >
                  <ArrowUp size={16} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted">
            O YGGNAROK IA pode cometer erros. Verifique informações críticas.
          </p>
        </div>
      </div>
    </div>
  );
}
