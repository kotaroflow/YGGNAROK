"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PenLine,
  BookOpen,
  Code2,
  Sparkles,
  ArrowUp,
  Mic,
  Paperclip,
} from "lucide-react";
import { useChatWorkspace } from "@/components/chat-workspace-provider";

const categories = [
  { label: "Escrever", icon: PenLine, href: "/criar-conteudo" },
  { label: "Aprender", icon: BookOpen, href: "/biblioteca" },
  { label: "Código", icon: Code2, href: "/prompts" },
  { label: "Ideias", icon: Sparkles, href: "/ideias" },
];

export function HomeScreen() {
  const router = useRouter();
  const { createConversation } = useChatWorkspace();
  const [value, setValue] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
    setCurrentHour(new Date().getHours());
  }, [value]);

  async function goToChat(text: string) {
    const conv = await createConversation({ title: text.slice(0, 52) });
    const params = new URLSearchParams({ conv, q: text.trim() });
    router.push(`/chat?${params}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    void goToChat(value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  function handleAttachClick() {
    fileRef.current?.click();
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const names = Array.from(files)
      .slice(0, 3)
      .map((f) => f.name)
      .join(", ");
    setHint(`Anexo registrado (${names}). Envie a mensagem para abrir o chat — upload completo em breve.`);
  }

  function handleMic() {
    const SpeechRecognitionCtor =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognitionCtor) {
      setHint("Seu navegador não suporta ditado por voz. Digite a mensagem normalmente.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "pt-BR";
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript).trim());
    };

    recognition.onerror = () => {
      setHint("Não foi possível captar o áudio. Tente de novo ou digite.");
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setHint("Ditado finalizado. Revise o texto e envie.");
    };

    recognition.start();
    setHint("Ouvindo… fale agora (clique no microfone para parar).");
  }

  function getGreeting(hour: number): string {
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  return (
    <div className="flex w-full flex-col items-center justify-center px-4 py-8">
       <div className="mb-8 text-center">
         <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand font-divine">YGGNAROK</p>
         <h1 className="text-balance text-4xl font-light tracking-tight text-foreground md:text-5xl font-heading">
           <span className="mr-2 text-brand drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">✦</span>
           {getGreeting(currentHour)}
         </h1>
         <p className="mx-auto mt-3 max-w-md text-sm text-muted font-body">
           Calma, foco e confiança — comece pelo chat ou escolha um fluxo abaixo.
         </p>
       </div>

      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-2xl border-2 border-line bg-surface-strong/60 backdrop-blur-md shadow-md transition-all duration-300 focus-within:border-brand/40 focus-within:ring-4 focus-within:ring-brand/10 focus-within:shadow-[0_0_50px_-12px_rgba(234,179,8,0.25)]"
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            multiple
            accept="image/*,.pdf,.txt,.md,.json"
            onChange={(e) => handleFiles(e.target.files)}
          />

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
                onClick={handleAttachClick}
                className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-sidebar-hover hover:text-foreground"
                aria-label="Anexar arquivo"
                title="Anexar arquivo"
              >
                <Paperclip size={17} />
              </button>
              <button
                type="button"
                onClick={handleMic}
                className="grid size-8 place-items-center rounded-lg text-muted transition hover:bg-sidebar-hover hover:text-foreground"
                aria-label="Ditado por voz"
                title="Ditado por voz"
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

        {hint ? (
          <p className="mt-3 rounded-lg border border-line bg-surface px-3 py-2 text-center text-xs text-muted">
            {hint}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {categories.map(({ label, icon: Icon, href }) => (
            <button
              key={label}
              type="button"
              onClick={() => router.push(href)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-bold text-muted transition-all duration-200 hover:border-brand/40 hover:bg-brand/[0.03] hover:text-foreground hover:-translate-y-0.5 shadow-sm hover:shadow-md"
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
