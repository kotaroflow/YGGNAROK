"use client";

import { useState } from "react";
import { Search, Copy, Check, ExternalLink, Sparkles, Code, FileText, TrendingUp, Video, Globe } from "lucide-react";
import { BackButton } from "@/components/back-button";

interface PromptItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ size?: number }>;
  description: string;
  promptText: string;
}

const CURATED_PROMPTS: PromptItem[] = [
  {
    id: "software-engineer",
    title: "Engenheiro de Software",
    category: "Programação",
    icon: Code,
    description: "Especialista em Next.js, React, Tailwind CSS e TypeScript. Focado em código limpo, modular e de alta performance.",
    promptText: "Você é um Engenheiro de Software Sênior especialista em Next.js, React, Tailwind CSS e TypeScript. Escreva códigos limpos, modulares, altamente performáticos e com tratamento de erros robusto. Explique as decisões de arquitetura de forma concisa e direta."
  },
  {
    id: "copywriter",
    title: "Copywriter de Conversão",
    category: "Marketing",
    icon: FileText,
    description: "Cria copies persuasivas baseadas em gatilhos mentais e estruturas validadas (AIDA, PAS) focadas em conversão.",
    promptText: "Você é um Copywriter de Conversão de elite. Escreva textos persuasivos para anúncios, e-mails de vendas ou landing pages focados em prender a atenção do leitor e gerar conversões. Use técnicas como AIDA (Atenção, Interesse, Desejo, Ação) ou PAS (Problema, Agitação, Solução)."
  },
  {
    id: "business-strategist",
    title: "Estrategista de Negócios",
    category: "Estratégia",
    icon: TrendingUp,
    description: "Analista comercial pronto para criar planos de negócios, estratégias de vendas e otimização de funil.",
    promptText: "Você é um Estrategista de Negócios e Desenvolvedor Comercial Sênior. Ajude-me a analisar oportunidades de mercado, desenhar funis de vendas de alta performance, planejar lançamentos e otimizar processos comerciais para escalar o faturamento."
  },
  {
    id: "video-script",
    title: "Roteirista de Redes Sociais",
    category: "Criação",
    icon: Video,
    description: "Cria roteiros dinâmicos e virais para TikTok, Instagram Reels e YouTube, estruturados com ganchos fortes.",
    promptText: "Você é um Roteirista de Vídeos Virais especialista em redes sociais (TikTok, Reels, Shorts). Crie roteiros dinâmicos que comecem com um gancho ('hook') irresistível nos primeiros 3 segundos, seguidos de entrega rápida de valor e finalizando com uma chamada para ação (CTA) natural."
  },
  {
    id: "universal-translator",
    title: "Tradutor Localizado",
    category: "Utilidades",
    icon: Globe,
    description: "Traduz textos com fluidez, mantendo a gíria local, o tom de voz original e o contexto cultural perfeito.",
    promptText: "Você é um Tradutor Universal e Especialista em Localização Cultural. Traduza o texto fornecido mantendo fielmente o tom, as nuances, as gírias apropriadas do idioma de destino e o contexto cultural original, evitando traduções literais e robóticas."
  },
  {
    id: "seo-expert",
    title: "Especialista em SEO",
    category: "Marketing",
    icon: Sparkles,
    description: "Otimiza conteúdos e estruturas de páginas para ranquear no topo dos mecanismos de busca de forma orgânica.",
    promptText: "Você é um Especialista em SEO (Search Engine Optimization). Analise o tema fornecido e me dê sugestões de palavras-chave primárias e secundárias, títulos otimizados, meta-descriptions persuasivas e uma estrutura de tópicos (H1, H2, H3) ideal para ranquear organicamente no Google."
  }
];

export function PromptsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ["Todos", "Programação", "Marketing", "Estratégia", "Criação", "Utilidades"];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = CURATED_PROMPTS.filter((prompt) => {
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-6xl">
      <BackButton />
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-xs font-medium mb-3 select-none">
          <Sparkles size={12} className="animate-pulse" />
          <span>YGGNAROK Prompt Studio</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-foreground to-neutral-400 bg-clip-text text-transparent">
          Biblioteca de Prompts
        </h1>
        <p className="mt-2 text-sm text-muted max-w-xl">
          Coleção de prompts de alto desempenho testados e validados para extrair o máximo de inteligência das nossas IAs especialistas.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-neutral-900">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            placeholder="Buscar prompts especialistas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-neutral-850 bg-neutral-900/50 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-brand/40 focus:ring-1 focus:ring-brand/20"
          />
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-brand text-neutral-950 font-semibold"
                  : "bg-neutral-900 border border-neutral-850 text-muted hover:border-neutral-700 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-900 rounded-2xl bg-neutral-900/10">
          <p className="text-sm text-muted">Nenhum prompt encontrado para os filtros selecionados.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => {
            const IconComponent = prompt.icon;
            return (
              <div
                key={prompt.id}
                className="group relative flex flex-col rounded-2xl border border-neutral-850 bg-neutral-900/30 p-5 transition-all duration-300 hover:border-brand/20 hover:bg-neutral-900/50 hover:shadow-[0_4px_20px_-4px_rgba(245,158,11,0.03)]"
              >
                {/* Icon & Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="grid size-9 place-items-center rounded-xl bg-brand/10 text-brand">
                    <IconComponent size={18} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted bg-neutral-900 px-2 py-0.5 rounded border border-neutral-850">
                    {prompt.category}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-brand transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed flex-1 mb-5">
                  {prompt.description}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-neutral-900">
                  <button
                    type="button"
                    onClick={() => handleCopy(prompt.id, prompt.promptText)}
                    className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-medium transition-all ${
                      copiedId === prompt.id
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-500"
                        : "bg-neutral-900 border border-neutral-850 hover:border-neutral-700 hover:text-foreground"
                    }`}
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check size={13} />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copiar Prompt</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`/chat?q=${encodeURIComponent("Use este prompt especialista: " + prompt.promptText + "\n\nOlá! Como posso te ajudar hoje?")}`}
                    className="flex items-center justify-center size-9 rounded-lg bg-brand text-neutral-950 hover:bg-brand-strong transition-colors"
                    title="Iniciar chat com este prompt"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
