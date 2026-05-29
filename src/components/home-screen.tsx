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

const categories = [
  { label: "Escrever", icon: PenLine, href: "/criar-conteudo" },
  { label: "Aprender", icon: BookOpen, href: "/biblioteca" },
  { label: "Codigo", icon: Code2, href: "/prompts" },
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
    const params = new URLSearchParams({ q: value.trim() });
    router.push(`/chat?${params}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center px-4 py-12">
      {/* Saudacao */}
      <div className="mb-10 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          <span className="mr-3 inline-block text-[var(--brand)]">✦</span>
          Como posso ajudar?
        </h1>
      </div>

      {/* Caixa de input */}
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] shadow-lg transition focus-within:border-[var(--brand)]/40 focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand)_12%,transparent)]"
        >
          <div className="flex items-start gap-3 px-4 pt-4 pb-2">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Como posso ajudar voce hoje?"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-[var(--muted)] focus:outline-none leading-relaxed"
              aria-label="Mensagem para o assistente"
            />
          </div>

          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--line)] hover:text-foreground"
                aria-label="Anexar arquivo"
              >
                <Plus size={17} />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--line)] hover:text-foreground"
                aria-label="Usar microfone"
              >
                <Mic size={17} />
              </button>
            </div>

            <button
              type="submit"
              disabled={!value.trim()}
              className="grid size-8 place-items-center rounded-lg bg-[var(--brand)] text-neutral-950 shadow-sm transition hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Enviar mensagem"
            >
              <ArrowUp size={17} strokeWidth={2.5} />
            </button>
          </div>
        </form>

        {/* Chips de categoria */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {categories.map(({ label, icon: Icon, href }) => (
            <button
              key={label}
              type="button"
              onClick={() => router.push(href)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:border-[var(--brand)]/40 hover:bg-[var(--surface-strong)] hover:text-foreground"
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
