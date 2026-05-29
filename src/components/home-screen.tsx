"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PenLine,
  BookOpen,
  Code2,
  Sparkles,
  ArrowUp,
  Plus,
  Mic,
} from "lucide-react";
import { newConversationId } from "@/lib/chat-storage";

const categories = [
  { label: "Escrever", icon: PenLine, href: "/criar-conteudo" },
  { label: "Aprender", icon: BookOpen, href: "/biblioteca" },
  { label: "Código", icon: Code2, href: "/prompts" },
  { label: "Ideias", icon: Sparkles, href: "/ideias" },
];

export function HomeScreen() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    const conv = newConversationId();
    const params = new URLSearchParams({ conv, q: value.trim() });
    router.push(`/chat?${params}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-8">
      <div className="mb-8 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">YGGNAROK</p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          <span className="mr-2 text-brand">✦</span>
          Como posso ajudar?
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">
          Calma, foco e confiança — comece pelo chat ou escolha um fluxo abaixo.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl border border-line bg-surface-strong shadow-sm transition focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/15"
        >
          <div className="px-4 pt-4 pb-2">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Como posso ajudar você hoje?"
              rows={1}
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted focus:outline-none"
              aria-label="Mensagem para o assistente"
            />
          </div>

          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-sidebar-hover hover:text-foreground"
                aria-label="Anexar arquivo"
              >
                <Plus size={17} />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-sidebar-hover hover:text-foreground"
                aria-label="Usar microfone"
              >
                <Mic size={17} />
              </button>
            </div>

            <button
              type="submit"
              disabled={!value.trim()}
              className="grid size-9 place-items-center rounded-xl bg-brand text-neutral-950 transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Enviar mensagem"
            >
              <ArrowUp size={17} strokeWidth={2.5} />
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {categories.map(({ label, icon: Icon, href }) => (
            <button
              key={label}
              type="button"
              onClick={() => router.push(href)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition hover:border-brand/40 hover:text-foreground"
            >
              <Icon size={14} className="text-brand" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
