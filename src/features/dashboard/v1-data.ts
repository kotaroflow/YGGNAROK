import { sidebarGroups } from "@/lib/navigation";
import { operationalTags } from "@/lib/tags";

export const v1Stats = [
  { label: "Perfis ativos", value: "0", detail: "Criar o primeiro perfil habilita conteúdo e biblioteca." },
  { label: "Jobs pendentes", value: "0", detail: "IA pesada fica fora da Vercel e entra na fila." },
  { label: "Postagens manuais", value: "0", detail: "A V1 guia postagem, cópia e registro do link." },
  { label: "Alertas", value: "0", detail: "Falhas técnicas e ações críticas aparecem aqui." },
];

export const v1Workflows = [
  "Criar perfil com tags operacionais",
  "Criar conteúdo e aprovar revisão",
  "Enviar item aprovado para postagem manual",
  "Criar job assíncrono e acompanhar via Realtime",
  "Registrar mídia no R2 usando metadata no Supabase",
  "Auditar ações críticas em audit_logs",
];

export const moduleIndex = sidebarGroups.flatMap((group) =>
  group.items.map((item) => ({
    group: group.title,
    groupPurpose: group.purpose,
    ...item,
  })),
);

export const tagRows = Object.entries(operationalTags).map(([group, tags]) => ({
  group,
  tags: [...tags],
}));
