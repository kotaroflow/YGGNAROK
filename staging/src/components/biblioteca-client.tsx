"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  BookOpen,
  Check,
  Copy,
  Cpu,
  FileText,
  FolderOpen,
  Image,
  Layers3,
  Megaphone,
  Plus,
  ScrollText,
  Search,
  Sparkles,
  Star,
  WandSparkles,
  X,
} from "lucide-react";
import { Field, inputClass, textareaClass } from "@/components/field";

interface Profile {
  id: string;
  name: string;
}

interface LibraryItem {
  id: string;
  title: string;
  type: string;
  body: string | null;
  status: string;
}

interface BibliotecaClientProps {
  profiles: Profile[];
  items: LibraryItem[];
  createLibraryItemAction: (formData: FormData) => void;
  createGuidedAiJobAction: (formData: FormData) => void;
}

type VaultTone = "amber" | "violet" | "blue" | "emerald";

const vaultFolders = [
  { name: "Prompts", countLabel: "Núcleo IA", icon: WandSparkles, tone: "amber" },
  { name: "Campanhas", countLabel: "Mercado", icon: Megaphone, tone: "violet" },
  { name: "Roteiros", countLabel: "Narrativa", icon: ScrollText, tone: "blue" },
  { name: "Referências", countLabel: "Visual", icon: Image, tone: "emerald" },
  { name: "Personagens", countLabel: "Lore", icon: Star, tone: "amber" },
  { name: "Projetos", countLabel: "Vault", icon: FolderOpen, tone: "violet" },
] satisfies { name: string; countLabel: string; icon: typeof Archive; tone: VaultTone }[];

const archiveFallbacks: LibraryItem[] = [
  {
    id: "archive-seed-1",
    title: "Prompt Mestre de Transformação",
    type: "prompt",
    body: "Estruture uma ideia bruta em ativos reutilizáveis: hook, promessa, prova, roteiro curto, variação visual e CTA.",
    status: "Modelo",
  },
  {
    id: "archive-seed-2",
    title: "Mapa de Campanha YGN",
    type: "campaign",
    body: "Sequência de campanha com descoberta, desejo, objeção, prova social e fechamento em múltiplos canais.",
    status: "Inspiração",
  },
  {
    id: "archive-seed-3",
    title: "Banco de Cenas Cinemáticas",
    type: "visual",
    body: "Referências de luz âmbar, monólitos de interface, artefatos metálicos, selos e ambientes de arquivo neural.",
    status: "Referência",
  },
  {
    id: "archive-seed-4",
    title: "Roteiro Curto de Alta Retenção",
    type: "script",
    body: "Abertura em tensão, virada aos 4 segundos, prova visual, micro tutorial e saída com próxima ação clara.",
    status: "Favorito",
  },
  {
    id: "archive-seed-5",
    title: "Diretiva de Personagem",
    type: "character",
    body: "Persona criativa com voz, limites, vocabulário, memórias narrativas e função operacional dentro do ecossistema.",
    status: "Sistema",
  },
];

const typeMeta: Record<string, { label: string; icon: typeof FileText; tone: VaultTone; height: string }> = {
  prompt: { label: "Prompt", icon: Sparkles, tone: "amber", height: "min-h-[260px]" },
  campaign: { label: "Campanha", icon: Megaphone, tone: "violet", height: "min-h-[320px]" },
  script: { label: "Roteiro", icon: ScrollText, tone: "blue", height: "min-h-[290px]" },
  visual: { label: "Referência", icon: Image, tone: "emerald", height: "min-h-[340px]" },
  character: { label: "Personagem", icon: Star, tone: "amber", height: "min-h-[300px]" },
  ideia: { label: "Ideia", icon: BookOpen, tone: "violet", height: "min-h-[250px]" },
};

const toneClasses: Record<VaultTone, string> = {
  amber: "border-brand/25 bg-brand/[0.055] text-brand shadow-brand/10",
  violet: "border-violet-400/20 bg-violet-500/[0.07] text-violet-300 shadow-violet-500/10",
  blue: "border-sky-400/20 bg-sky-500/[0.07] text-sky-300 shadow-sky-500/10",
  emerald: "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300 shadow-emerald-500/10",
};

function normalizeType(type: string) {
  return type.toLowerCase().trim() || "prompt";
}

function getItemMeta(item: LibraryItem, index: number) {
  const normalized = normalizeType(item.type);
  const fallbackKeys = ["prompt", "campaign", "script", "visual", "character"];
  return typeMeta[normalized] ?? typeMeta[fallbackKeys[index % fallbackKeys.length]];
}

function getDiscoveryLabel(index: number) {
  const labels = ["Mais usado", "Criado recente", "Favorito", "Poderoso", "Salvo esta semana"];
  return labels[index % labels.length];
}

export function BibliotecaClient({
  profiles,
  items,
  createLibraryItemAction,
  createGuidedAiJobAction,
}: BibliotecaClientProps) {
  const [activeFormTab, setActiveFormTab] = useState<"manual" | "ai">("manual");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const displayItems = items.length > 0 ? items : archiveFallbacks;
  const isUsingFallback = items.length === 0;

  const types = useMemo(
    () => ["Todos", ...Array.from(new Set(displayItems.map((item) => item.type || "prompt")))],
    [displayItems],
  );

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return displayItems.filter((item) => {
      const matchesSearch =
        query.length === 0 ||
        item.title.toLowerCase().includes(query) ||
        (item.body || "").toLowerCase().includes(query);
      const matchesType = selectedType === "Todos" || item.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [displayItems, searchTerm, selectedType]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-72 w-[720px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-violet-500/10 blur-[110px]" />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-sky-500/10 blur-[100px]" />
      </div>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-6 border-b border-line/60 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-brand" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-brand">Creative Vault</p>
            </div>
            <h1 className="mt-3 font-divine text-3xl font-black tracking-[0.06em] text-foreground sm:text-4xl">
              Biblioteca de Ativos
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Arquivo vivo de prompts, roteiros, referências, campanhas e conceitos que sustentam a memória criativa do YGGNAROK.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center gap-3 rounded-xl border border-line bg-surface/50 px-4 backdrop-blur-md">
              <Archive size={16} className="text-brand" />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Ativos mapeados</p>
                <p className="text-sm font-black text-foreground">{items.length || "∞"} entradas</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-4 text-xs font-black uppercase tracking-wider text-neutral-950 shadow-lg shadow-brand/15 transition hover:bg-brand-strong"
            >
              <Plus size={16} />
              Nova entrada
            </button>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <section className="min-w-0 space-y-5">
            <div className="flex flex-col gap-3 rounded-xl border border-line/70 bg-surface/45 p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar no arquivo neural..."
                  className="h-11 w-full rounded-lg border border-line bg-surface-strong/50 pl-9 pr-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-brand/45"
                />
              </label>

              <div className="flex gap-1 overflow-x-auto pb-1 sm:max-w-[50%] sm:justify-end sm:pb-0">
                {types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`h-9 shrink-0 rounded-lg border px-3 text-[10px] font-black uppercase tracking-wide transition ${
                      selectedType === type
                        ? "border-brand bg-brand text-neutral-950"
                        : "border-line bg-surface-strong/35 text-muted hover:border-brand/35 hover:text-foreground"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {isUsingFallback ? (
              <div className="rounded-xl border border-brand/20 bg-brand/[0.045] px-4 py-3 text-xs font-semibold text-brand">
                O acervo real ainda está nascendo. Enquanto isso, o vault gera cartões de atmosfera para manter a sensação de arquivo vivo.
              </div>
            ) : null}

            <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
              {filteredItems.map((item, index) => {
                const meta = getItemMeta(item, index);
                const Icon = meta.icon;

                return (
                  <article
                    key={item.id}
                    className={`group mb-4 break-inside-avoid rounded-xl border p-4 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-xl ${toneClasses[meta.tone]} ${meta.height}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-current/20 bg-black/10">
                        <Icon size={17} />
                      </div>
                      <span className="rounded-full border border-current/20 px-2 py-1 text-[9px] font-black uppercase tracking-widest">
                        {getDiscoveryLabel(index)}
                      </span>
                    </div>

                    <div className="mt-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-75">{meta.label}</p>
                      <h2 className="mt-2 text-lg font-black leading-tight text-foreground">{item.title}</h2>
                    </div>

                    <div className="mt-5 rounded-lg border border-line/45 bg-surface-strong/35 p-3">
                      <p className="line-clamp-[10] whitespace-pre-wrap text-[12px] font-medium leading-relaxed text-muted">
                        {item.body || "Entrada preservada no vault, aguardando conteúdo detalhado."}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/40 pt-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted">{item.status || "Ativo"}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.id, item.body || item.title)}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface-strong/50 px-3 text-[10px] font-black uppercase tracking-wide text-foreground transition hover:border-brand/45"
                      >
                        {copiedId === item.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        {copiedId === item.id ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-xl border border-line bg-surface/45 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Layers3 size={16} className="text-brand" />
                <h2 className="text-sm font-black text-foreground">Vault Folders</h2>
              </div>
              <div className="mt-4 space-y-2">
                {vaultFolders.map((folder, index) => {
                  const Icon = folder.icon;
                  return (
                    <button
                      key={folder.name}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left shadow-sm transition hover:-translate-y-0.5 ${toneClasses[folder.tone]}`}
                      style={{ transform: `translateX(${index % 2 === 0 ? 0 : 8}px)` }}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={16} />
                        <span>
                          <span className="block text-xs font-black text-foreground">{folder.name}</span>
                          <span className="block text-[9px] font-bold uppercase tracking-widest opacity-75">{folder.countLabel}</span>
                        </span>
                      </span>
                      <FolderOpen size={14} className="opacity-70" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface/35 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-brand" />
                <h2 className="text-sm font-black text-foreground">Descoberta</h2>
              </div>
              <div className="mt-4 grid gap-3">
                {["Recently Used", "Most Powerful", "Creator Favorites"].map((label) => (
                  <div key={label} className="rounded-lg border border-line/60 bg-surface-strong/35 px-3 py-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-3 backdrop-blur-sm sm:items-center">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-surface-strong p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand">New Archive Entry</p>
                <h2 className="mt-1 text-xl font-black text-foreground">Adicionar ao vault</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:text-foreground"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface/50 p-1">
              <button
                type="button"
                onClick={() => setActiveFormTab("manual")}
                className={`flex h-10 items-center justify-center gap-2 rounded-lg text-xs font-black transition ${
                  activeFormTab === "manual" ? "bg-brand text-neutral-950" : "text-muted hover:text-foreground"
                }`}
              >
                <Plus size={14} />
                Salvar item
              </button>
              <button
                type="button"
                onClick={() => setActiveFormTab("ai")}
                className={`flex h-10 items-center justify-center gap-2 rounded-lg text-xs font-black transition ${
                  activeFormTab === "ai" ? "bg-brand text-neutral-950" : "text-muted hover:text-foreground"
                }`}
              >
                <Sparkles size={14} />
                Organizar IA
              </button>
            </div>

            {activeFormTab === "manual" ? (
              <form action={createLibraryItemAction} className="mt-5 space-y-4">
                <Field label="Perfil de Criação">
                  <select className={inputClass} name="profileId" required>
                    <option value="">Selecione um perfil...</option>
                    {profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>
                        {profile.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Tipo de Ativo">
                    <input className={inputClass} name="type" placeholder="prompt, visual, campanha" defaultValue="prompt" required />
                  </Field>
                  <Field label="Título Curto">
                    <input className={inputClass} name="title" placeholder="Gancho viral, cena, ideia..." required />
                  </Field>
                </div>
                <Field label="Conteúdo">
                  <textarea className={textareaClass} rows={7} name="body" placeholder="Cole o prompt, roteiro, referência ou conceito..." required />
                </Field>
                <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 text-xs font-black uppercase tracking-wider text-neutral-950 transition hover:bg-brand-strong">
                  <BookOpen size={14} />
                  Salvar na Biblioteca
                </button>
              </form>
            ) : (
              <form action={createGuidedAiJobAction} className="mt-5 space-y-4">
                <input type="hidden" name="type" value="library.organize" />
                <input type="hidden" name="agentKey" value="hotei" />
                <input type="hidden" name="source" value="library_page" />
                <Field label="Perfil para Vinculação">
                  <select className={inputClass} name="profileId" required>
                    <option value="">Selecione um perfil...</option>
                    {profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>
                        {profile.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Material Bruto para a IA Organizar">
                  <textarea className={textareaClass} rows={9} name="brief" placeholder="Cole ideias soltas, prompts quebrados, scripts, links ou referências para o Hotei organizar." required />
                </Field>
                <button type="submit" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 text-xs font-black uppercase tracking-wider text-neutral-950 transition hover:bg-brand-strong">
                  <Sparkles size={14} />
                  Organizar com IA
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
