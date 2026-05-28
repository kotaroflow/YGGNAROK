export const operationalTags = {
  tipo: ["venda", "afiliado", "conteudo", "comunidade", "autoridade", "teste"],
  objetivo: ["lucro", "crescimento", "engajamento", "retencao", "parceria", "portfolio"],
  status: ["ativo", "pausado", "teste", "arquivado"],
  risco: ["seguro", "atencao", "alto_risco"],
  fluxo: ["ideia", "roteiro", "midia", "revisao", "aprovado", "postagem_manual", "publicado", "analisado"],
  plataforma: ["tiktok", "instagram", "youtube", "kwai", "pinterest", "facebook"],
} as const;

export type OperationalTagGroup = keyof typeof operationalTags;
