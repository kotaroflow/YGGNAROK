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
    <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:py-20">
      {/* Saudacao */}
      <div className="mb-8 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 dark:text-stone-50 md:text-5xl">
          <span className="mr-3 inline-block text-amber-500">✦</span>
          Como posso ajudar?
        </h1>
      </div>

      {/* Caixa de input */}
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl border border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-xl transition focus-within:border-amber-400/50 focus-within:ring-4 focus-within:ring-amber-200/20 dark:border-white/10 dark:bg-neutral-900/60 dark:focus-within:border-amber-500/50 dark:focus-within:ring-amber-900/20"
        >
          <div className="flex items-start gap-3 px-4 pt-4 pb-2">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Como posso ajudar você hoje?"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed dark:text-stone-100 dark:placeholder:text-stone-500"
              aria-label="Mensagem para o assistente"
            />
          </div>

          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-stone-500 dark:hover:bg-neutral-800 dark:hover:text-stone-300"
                aria-label="Anexar arquivo"
              >
                <Plus size={17} />
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-stone-500 dark:hover:bg-neutral-800 dark:hover:text-stone-300"
                aria-label="Usar microfone"
              >
                <Mic size={17} />
              </button>
            </div>

            <button
              type="submit"
              disabled={!value.trim()}
              className="grid size-8 place-items-center rounded-lg bg-amber-400 text-neutral-950 shadow-sm transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-amber-500 dark:hover:bg-amber-400"
              aria-label="Enviar mensagem"
            >
              <ArrowUp size={17} strokeWidth={2.5} />
            </button>
          </div>
        </form>

        {/* Chips de categoria */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {categories.map(({ label, icon: Icon, href }) => (
            <button
              key={label}
              type="button"
              onClick={() => router.push(href)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/50 px-4 py-2 text-sm font-medium text-slate-500 transition hover:border-amber-300/50 hover:bg-white hover:text-slate-900 hover:shadow-sm dark:border-white/10 dark:bg-neutral-900/40 dark:text-stone-400 dark:hover:border-amber-700/50 dark:hover:bg-neutral-900 dark:hover:text-stone-200"
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
