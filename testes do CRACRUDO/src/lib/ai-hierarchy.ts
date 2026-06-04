import {
  yggnarokCanonicalAiAgents,
  yggnarokExtendedAiCatalog,
  yggnarokPrimaryAiAgents,
} from "./ai-entity-catalog";

export const YGGNAROK_ADMIN_AUTHORITY = {
  key: "adm_master",
  label: "Administrador Master",
  owner: "Administrador",
  authority: "final_human_decision",
  rule: "O usuario administrador sempre tem autoridade maxima sobre aprovacao, rejeicao, retrabalho, publicacao, gastos, exclusao e automacoes persistentes.",
} as const;

export const YGGNAROK_ADMIN_IDENTIFIERS = [
  "kotaro",
  "naoteemteresa",
  "naoteemteresa@gmail.com",
] as const;

export const YGGNAROK_AI_ARCHITECTURE = "YGGNAROK_LUCID_MULTI_AGENT_HIERARCHY" as const;

export const YGGNAROK_AI_IMPLEMENTATION_GUARDRAILS = [
  "IAs sao agentes/modulos registrados com funcao, contexto, regras, limites, permissoes e formato de resposta.",
  "Nao criar um backend, chat, tela ou avatar independente dentro do site para cada IA na V1; mapas visuais no n8n sao permitidos quando ajudarem o admin a enxergar o fluxo.",
  "Heimdall roteia; Janus controla estado, aprovacao e retrabalho; as IAs especialistas atuam somente dentro do escopo registrado.",
  "Toda IA pode sugerir; poucas podem executar; acoes criticas exigem aprovacao explicita do Administrador Master.",
  "Publicacao, exclusao, mudanca de permissao, alteracao estrutural de banco, gasto, auth e automacao persistente nunca sao autonomos.",
  "Respostas de agentes devem ser JSON estruturado com summary, items, next_actions, risk, needs_admin_approval e metadata.",
  "Lore, personagens e cargos visuais nao viram permissao real sem regra explicita no backend.",
  "Kotaro OS, KCO e KCOS sao nomes legados; o produto atual deve ser tratado como YGGNAROK / YGN.",
] as const;

export const YGGNAROK_PERSISTENT_MEMORY_POLICY = {
  storage: [
    "library_items(type=ai_learning)",
    "ai_memory_candidates",
    "ai_vector_memory",
    "agent_runs",
    "audit_logs",
  ],
  remember: [
    "preferencias do admin",
    "decisoes aprovadas",
    "estrategias que funcionaram",
    "alertas recorrentes",
    "rotas de agente eficazes",
    "regras de permissao e aprovacao",
    "falhas e correcoes repetiveis",
  ],
  neverRemember: [
    "segredos",
    "tokens",
    "senhas",
    "dados sensiveis sem necessidade",
    "hipoteses nao aprovadas como se fossem fatos",
    "acoes rejeitadas pelo admin",
  ],
  approval: {
    low: "pode virar memoria ativa automaticamente quando a confianca for alta",
    medium: "fica pendente quando aprendizado supervisionado estiver ativo",
    high: "sempre exige aprovacao do Administrador Master",
  },
} as const;

export const YGGNAROK_CONTINUOUS_EVOLUTION_LOOP = [
  {
    key: "capture",
    name: "Capturar",
    duty: "Registrar job, entrada, agente, modelo, resultado, risco e contexto recente.",
  },
  {
    key: "reflect",
    name: "Refletir",
    duty: "Extrair aprendizado operacional sem gravar segredo nem transformar hipotese em fato.",
  },
  {
    key: "propose",
    name: "Propor",
    duty: "Criar candidato de memoria, melhoria de prompt, ajuste de rota ou alerta de risco.",
  },
  {
    key: "approve",
    name: "Aprovar",
    duty: "Enviar risco medio/alto para revisao do Administrador Master antes de ativar.",
  },
  {
    key: "apply",
    name: "Aplicar",
    duty: "Reusar memorias aprovadas em novas execucoes como contexto recente.",
  },
  {
    key: "audit",
    name: "Auditar",
    duty: "Manter rastro em audit_logs, agent_runs e decisoes do conselho.",
  },
] as const;

export type YggnarokHierarchyLayer =
  | "entrada"
  | "lucidez"
  | "coordenacao"
  | "bases_divergentes"
  | "juizo_mediano"
  | "critica_especialista"
  | "equipe_especializada"
  | "saida_auditoria";

export type YggnarokAgentNode = {
  key: string;
  name: string;
  layer: YggnarokHierarchyLayer;
  duty: string;
  receives: string[];
  outputs: string[];
  gate?: "auto" | "retrabalho" | "admin";
};

export const yggnarokNamedCouncilAgents = yggnarokPrimaryAiAgents.map((agent) => ({
  key: agent.key,
  name: agent.name,
  area: agent.area,
  duty: agent.area ?? "Especialidade definida no catalogo mestre.",
}));

export const yggnarokLocalRuntimeAgents = [
  {
    key: "huashu",
    name: "Huashu",
    duty: "Direcao visual, design, prototipagem e refinamento estetico.",
  },
  {
    key: "impeccable",
    name: "Impeccable",
    duty: "Polimento, revisao final e padrao de qualidade impecavel.",
  },
] as const;

export const yggnarokAgentHierarchy: YggnarokAgentNode[] = [
  {
    key: "entrada_usuario",
    name: "Entrada do Usuario",
    layer: "entrada",
    duty: "Capturar pensamento bruto, objetivo, rigor e formato final sem interpretar demais.",
    receives: ["mensagem_usuario", "contexto_do_site"],
    outputs: ["pensamento_bruto", "objetivo", "nivel_de_rigor", "formato_final"],
    gate: "auto",
  },
  {
    key: "agente_lucidez",
    name: "Ísis / Triagem e Lucidez",
    layer: "lucidez",
    duty: "Entender o pedido do usuario, reunir fragmentos, identificar intencao e transformar pensamento confuso em missao clara.",
    receives: ["pensamento_bruto", "objetivo"],
    outputs: ["missao_lucida", "criterios_de_fidelidade", "restricoes", "sinais_de_desvio"],
    gate: "auto",
  },
  {
    key: "coordenador",
    name: "Heimdall + Janus / Roteamento e Fluxos",
    layer: "coordenacao",
    duty: "Heimdall decide quais IAs entram; Janus controla passagem entre estados, aprovacoes e retrabalho.",
    receives: ["missao_lucida", "criterios_de_fidelidade"],
    outputs: ["plano_de_delegacao", "politica_de_retrabalho", "ordem_de_execucao"],
    gate: "auto",
  },
  {
    key: "arquiteto_sistemico",
    name: "Athena + Daedalus / Estratégia e Base Técnica",
    layer: "bases_divergentes",
    duty: "Criar base estrutural, etapas, dependencias, contratos e pontos de controle.",
    receives: ["missao_lucida", "plano_de_delegacao"],
    outputs: ["base_sistemica", "riscos_estruturais", "evidencia_de_fidelidade"],
    gate: "auto",
  },
  {
    key: "estrategista_produto",
    name: "Gaia + Fuxi + Inari / Monetização, Nicho e Oferta",
    layer: "bases_divergentes",
    duty: "Avaliar utilidade, valor, clareza e experiencia da entrega final.",
    receives: ["missao_lucida", "plano_de_delegacao"],
    outputs: ["base_produto", "criterios_de_valor", "evidencia_de_fidelidade"],
    gate: "auto",
  },
  {
    key: "critico_coerencia",
    name: "Ma’at + Ísis / Justiça e Coerência",
    layer: "bases_divergentes",
    duty: "Encontrar contradicoes, premissas inventadas e desvios da fala original.",
    receives: ["pensamento_bruto", "missao_lucida", "bases_parciais"],
    outputs: ["alertas_de_desvio", "evidencia_de_fidelidade"],
    gate: "retrabalho",
  },
  {
    key: "engenheiro_execucao",
    name: "Hefesto + Daedalus / Prompt, Ideias e Geração Técnica",
    layer: "bases_divergentes",
    duty: "Traduzir a base em recursos reais do YGGNAROK: rotas, worker, logs, modelos e UI.",
    receives: ["missao_lucida", "plano_de_delegacao"],
    outputs: ["base_executavel", "dependencias_tecnicas", "evidencia_de_fidelidade"],
    gate: "auto",
  },
  {
    key: "juizes_medianos",
    name: "Ma’at + Anúbis / Juízes Medianos",
    layer: "juizo_mediano",
    duty: "Comparar bases divergentes contra a ideia original e aprovar somente o que ficou coerente.",
    receives: ["pensamento_bruto", "missao_lucida", "bases_divergentes"],
    outputs: ["status", "pontuacao_fidelidade", "pontuacao_coerencia", "feedback_para_retrabalho"],
    gate: "retrabalho",
  },
  {
    key: "critico_especialista",
    name: "Anúbis + Themis + Nemesis / Crítica Especialista",
    layer: "critica_especialista",
    duty: "Validar se a tarefa segue exatamente a intencao do usuario e se pode ir para especialistas.",
    receives: ["juizo_mediano", "bases_aprovadas", "missao_lucida"],
    outputs: ["parecer_de_exatidao", "lacunas", "exigencias_para_equipe_final"],
    gate: "retrabalho",
  },
  {
    key: "especialista_arquitetura",
    name: "Athena + Daedalus / Especialista em Arquitetura",
    layer: "equipe_especializada",
    duty: "Consolidar componentes, contratos, dependencias e ordem final.",
    receives: ["contexto_aprovado"],
    outputs: ["arquitetura_final"],
    gate: "auto",
  },
  {
    key: "especialista_prompt",
    name: "Hefesto + Wenchang / Especialista em Prompt e Biblioteca",
    layer: "equipe_especializada",
    duty: "Refinar instrucoes dos agentes e contratos JSON.",
    receives: ["arquitetura_final"],
    outputs: ["prompts_finais"],
    gate: "auto",
  },
  {
    key: "especialista_n8n",
    name: "Janus + Hermes / Especialista em Fluxos, n8n e Distribuição",
    layer: "equipe_especializada",
    duty: "Mapear automacoes, webhooks, subfluxos, retries e auditoria.",
    receives: ["prompts_finais", "arquitetura_final"],
    outputs: ["plano_automacao"],
    gate: "auto",
  },
  {
    key: "especialista_qualidade",
    name: "Pandora + Susanoo + Zhong Kui / Testes, Segurança e Conteúdo Problemático",
    layer: "equipe_especializada",
    duty: "Aprovar apenas entregas fieis, coerentes, executaveis e rastreaveis.",
    receives: ["plano_automacao", "contexto_aprovado"],
    outputs: ["parecer_qualidade", "riscos_restantes"],
    gate: "retrabalho",
  },
  {
    key: "especialista_entrega",
    name: "Omoikane + Gabriel + Sarutahiko / Relatório, Notificação e Postagem Manual",
    layer: "equipe_especializada",
    duty: "Consolidar a resposta final no formato pedido pelo usuario.",
    receives: ["parecer_qualidade", "contexto_aprovado"],
    outputs: ["entrega_final", "auditoria"],
    gate: "auto",
  },
  {
    key: "auditoria",
    name: "Saida e Auditoria",
    layer: "saida_auditoria",
    duty: "Registrar status, decisoes, riscos, modelos e evidencias de fidelidade.",
    receives: ["entrega_final", "parecer_qualidade"],
    outputs: ["resposta_final", "metadata_ai_orchestration"],
    gate: "admin",
  },
] as const;

export function hierarchySummary() {
  const layers: YggnarokHierarchyLayer[] = [
    "entrada",
    "lucidez",
    "coordenacao",
    "bases_divergentes",
    "juizo_mediano",
    "critica_especialista",
    "equipe_especializada",
    "saida_auditoria",
  ];

  return layers.map((layer) => ({
    layer,
    agents: yggnarokAgentHierarchy
      .filter((agent) => agent.layer === layer)
      .map(({ key, name, duty, gate }) => ({ key, name, duty, gate })),
  }));
}

export function hierarchySystemPrompt() {
  return [
    "Voce opera dentro da hierarquia real de IAs do YGGNAROK.",
    `Arquitetura: ${YGGNAROK_AI_ARCHITECTURE}.`,
    `Autoridade maxima: ${YGGNAROK_ADMIN_AUTHORITY.label}. ${YGGNAROK_ADMIN_AUTHORITY.rule}`,
    `Guardrails de implementacao: ${YGGNAROK_AI_IMPLEMENTATION_GUARDRAILS.join(" ")}`,
    `Memoria persistente: lembrar ${YGGNAROK_PERSISTENT_MEMORY_POLICY.remember.join(", ")}; nunca lembrar ${YGGNAROK_PERSISTENT_MEMORY_POLICY.neverRemember.join(", ")}.`,
    `Evolucao constante: ${YGGNAROK_CONTINUOUS_EVOLUTION_LOOP.map((step) => `${step.name}=${step.duty}`).join(" | ")}.`,
    `Conselho nomeado do produto: ${yggnarokNamedCouncilAgents.map((agent) => `${agent.name}=${agent.duty}`).join(" | ")}.`,
    `Runtime local coordenado: ${yggnarokLocalRuntimeAgents.map((agent) => `${agent.name}=${agent.duty}`).join(" | ")}.`,
    "Antes de executar, transforme a fala do usuario em missao lucida, preserve criterios de fidelidade e nao invente outro objetivo.",
    "Se detectar incoerencia, lacuna grave ou risco alto, sinalize retrabalho ou aprovacao do admin em vez de fingir certeza.",
    "A entrega deve carregar rastreabilidade: objetivo entendido, decisoes, riscos e proximo passo executavel.",
  ].join(" ");
}

export function orchestrationMetadata(extra: Record<string, unknown> = {}) {
  return {
    architecture: YGGNAROK_AI_ARCHITECTURE,
    admin_authority: YGGNAROK_ADMIN_AUTHORITY,
    hierarchy: hierarchySummary(),
    implementation_guardrails: YGGNAROK_AI_IMPLEMENTATION_GUARDRAILS,
    persistent_memory_policy: YGGNAROK_PERSISTENT_MEMORY_POLICY,
    continuous_evolution_loop: YGGNAROK_CONTINUOUS_EVOLUTION_LOOP,
    named_council_agents: yggnarokNamedCouncilAgents,
    primary_ai_agents: yggnarokPrimaryAiAgents,
    extended_catalog_count: yggnarokExtendedAiCatalog.length,
    canonical_ai_agents: yggnarokCanonicalAiAgents,
    local_runtime_agents: yggnarokLocalRuntimeAgents,
    ...extra,
  };
}

export function isYggnarokAdminIdentity(value: string | null | undefined) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return false;

  const localPart = normalized.split("@")[0] ?? normalized;
  return YGGNAROK_ADMIN_IDENTIFIERS.some((identity) => {
    const candidate = identity.toLowerCase();
    return normalized === candidate || localPart === candidate;
  });
}
