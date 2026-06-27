# YGGNAROK V2 Working Draft

> **Status:** working draft não canônico.
>
> Este arquivo é um rascunho controlado de trabalho. Ele preserva material histórico, diagnóstico, hipóteses, arquitetura-alvo e propostas extraídas do arquivo local `YGGNAROK_V2_WORKING.md`.
>
> Este arquivo **não é documento oficial**, **não é fonte única da verdade** e **não autoriza execução automática** por agentes, ferramentas, MCPs ou assistentes.
>
> A fonte operacional de verdade continua sendo:
>
> 1. decisão humana explícita;
> 2. evidência verificada;
> 3. pacote isolado;
> 4. revisão;
> 5. PR;
> 6. merge em `origin/main`.
>
> Decisões humanas mais recentes, registros em `MCP_SHARED`, PRs mergeados e estado real de `origin/main` têm precedência sobre qualquer trecho deste rascunho.
>
> Este arquivo pode conter trechos desatualizados, linguagem normativa antiga e referências a documentos que já foram movidos para `legacy/root-markdown/`.
>
> Uso permitido: matéria-prima para extração de subpacotes futuros.
>
> Uso proibido: tratar como documento canônico, política oficial, ordem executável ou autorização para alterar código.
>
> Baseline já incorporada antes deste draft:
>
> - P1 Governança/CI — PR #6 mergeado.
> - P2A Docs/Legacy Archive — PR #7 mergeado.
>
> Próximas alterações derivadas deste arquivo devem ser feitas em pacotes menores, com revisão humana explícita.

---

# YGGNAROK pré-ALPHA V2.0
## Rascunho consolidado de trabalho para análise, preservação e extração de subpacotes de Estado Atual, Arquitetura, Governança e Ações de Implementação

**Versão:** YGN-PREALPHA-V2.0
**Data-base consolidada:** 16 de junho de 2026
**Status do documento:** working draft não canônico
**Objetivo:** substituir dispersão documental, reduzir ambiguidade, separar estado real de arquitetura-alvo e definir o que permanece, o que sai e o que precisa ser corrigido imediatamente.

---

## 0. Mandato e forma correta de ler este documento

Este documento não é lore, não é brainstorm e não é catálogo de fantasia.
Ele é uma **referência de trabalho para diagnóstico, preservação histórica e extração de subpacotes sujeitos a aprovação humana** para reorganizar o YGGNAROK sem regressão.

Ele separa quatro camadas que antes estavam misturadas:

1. **Estado real hoje**: o que está comprovadamente configurado, rodando, quebrado, exposto, legado ou órfão.
2. **Estrutura canônica pré-Alpha**: como o projeto deve ficar nomeado, dividido e governado.
3. **Plano de correção**: o que precisa mudar no código, no runtime e nos processos.
4. **Plano de descarte/congelamento**: o que não deve continuar ativo.

A regra central deste documento é simples:

**execução vence lore, segurança vence estética, arquitetura funcional vence nome bonito, evidência vence memória.**

---

## 1. Escopo, fontes analisadas e regra de precedência

### 1.1 Fontes analisadas
Este documento consolida quatro grupos de fonte:

1. **Auditoria forense atual (Codex pt1, pt2 e pt3)**
   Estado local/remoto do repositório, runtime, Vercel, GitHub, Supabase, n8n, Obsidian, agente local legado, R2, storage e resíduos.

2. **Diagnóstico técnico-forense do Antigravity**
   Arquitetura real, incoerências, branches, Bunker Mode, stubs, lixo técnico e fluxo operacional observado.

3. **Pacote de dossiês individuais de 02/06/2026**
   Base operacional da V1: execução técnica, cemitério de features, segurança de IA, governança/memória, design system, biblioteca de assets, nodes/n8n/Obsidian, runbook, custos, permissões, jurídico/IP e prompt mestre.

4. **Pacote Alpha / inventário máximo / plano operacional implementável**
   Arquitetura distribuída-alvo, leis anti-alucinação, controladores, júri, contratos, storage quente/frio e inventário expandido de funções.

### 1.2 Precedência da verdade neste documento
Quando houver conflito, vale esta ordem:

1. **Decisão humana mais recente do Admin**
2. **Evidência real de runtime/ambiente**
3. **Config efetiva e código atual**
4. **Este documento pré-Alpha V2.0**
5. **Dossiês de 02/06/2026**
6. **Documento Mestre Alpha / inventário máximo**
7. **Lore, nomenclatura histórica e material congelado**

### 1.3 Modelo de confiança usado
Cada afirmação abaixo deve ser lida em uma destas classes:

- **Confirmado por evidência**: apareceu em auditoria local/remota, arquivo, config, runtime ou material explícito.
- **Consolidado por decisão**: já está estabelecido nos dossiês/plano e não conflita com a evidência atual.
- **Recomendado neste documento**: proposta técnica para corrigir a arquitetura e organizar o projeto.
- **Ambíguo / precisa validação**: não há prova suficiente para cravar.

### 1.4 Diretriz provisória de consolidação documental
**Este arquivo não é fonte única da verdade e não substitui decisões humanas, evidências verificadas, PRs mergeados ou registros oficiais em MCP_SHARED.**

- Qualquer novo documento deve ser:
  1. Anexado a este como seção ou apêndice, **ou**
  2. Substituí-lo formalmente, com justificativa, data e versionamento.
- Todo documento paralelo deve ser classificado aqui antes de qualquer remoção como:
  - `canonical_source` — origina conteúdo ainda válido;
  - `legacy` — consolidado, mantido só para rastro;
  - `removed` — 100% redundante e descartável.
- Nenhuma decisão nova pode permanecer apenas em arquivo paralelo: primeiro ela entra neste mestre, depois os legados podem ser arquivados ou removidos.

---

## 2. Decisão-mestre: o que o YGGNAROK é e o que ele não é

### 2.1 Definição correta do projeto
O YGGNAROK é, hoje, melhor descrito como um **OS criativo-operacional distribuído**, com um site Next.js como interface principal, um núcleo de autorização e dados em Supabase, storage binário externo, rotas assíncronas de IA, integrações locais e remotas, e uma arquitetura em transição de “site com recursos de IA” para “plataforma operacional com plano de controle, plano de execução e plano de memória”.

### 2.2 O que ele não deve mais ser
O YGGNAROK **não deve mais ser tratado** como:

- site temático guiado por lore;
- painel decorativo com IA simulada;
- sistema com múltiplas verdades operacionais paralelas;
- coleção de scripts pessoais implícitos sem governança;
- repositório com features semi-vivas “para depois”.

### 2.3 Princípio filosófico consolidado
A filosofia correta do projeto, extraída do material total, é esta:

- **o núcleo é governança operacional com criatividade assistida;**
- **a IA serve ao sistema, não governa o sistema;**
- **memória sem auditoria contamina;**
- **integração sem contrato vira risco;**
- **visual sem dado real vira mentira;**
- **nome mítico só entra quando a função já está correta.**

---

## 3. Diagnóstico executivo: estado real do YGGNAROK em 16/06/2026

### 3.1 Resumo direto
O projeto está **tecnicamente promissor, mas operacionalmente fraturado**.

O front e o TypeScript estão saudáveis, mas a operação real está dividida entre:

- runtime web/worker planejado no repositório;
- automações ativas fora do repositório;
- integrações locais parcialmente reais e parcialmente stub;
- permissões reais em Supabase misturadas com atalhos/hardcodes;
- scripts e tarefas locais com drift de caminho e responsabilidade.

### 3.2 Fatos confirmados principais
- `pnpm typecheck` passa sem erros.
- `pnpm lint` passa sem erros.
- `pnpm build` gera build completa com sucesso.
- O deploy de produção na Vercel está `READY`, vindo da branch `main`.
- O projeto Vercel local aponta para `yggnarok-v1`.
- O repositório GitHub `kotaroflow/YGGNAROK` é público.
- Há workflow de CI preparado em `.github/workflows/ci.yml` com jobs de `typecheck`, `lint` e `build`; a primeira execução remota ainda não foi comprovada neste snapshot.
- Não há branch protection confirmada na UI do GitHub; existe apenas configuração local em `.github/bp.json`.
- O Supabase remoto está linkado; o Supabase local não está rodando.
- O Next local não está rodando.
- O Ollama local não está rodando.
- O n8n real ativo está fora do repo, em `KOTARO_OBSIDIAN_BRIDGE`, porta `5678`.
- O workflow real ativo do n8n não é o JSON do repo.
- O endpoint `/api/obsidian` ainda escreve no filesystem local, mas agora exige autenticação, rate limit, validação de origem e contenção de path.
- O endpoint `/api/n8n` foi migrado para webhook por variável de ambiente; o hardcode anterior foi removido.
- O conceito “agente local legado” existe em múltiplas camadas diferentes e conflita semanticamente.
- Há resíduos grandes e claros: `testes do CRACRUDO`, arquivos HTML/export antigos, worktree órfão, remote local inválido, scripts quebrados por path absoluto, `.temp` do Supabase versionado.

### 3.3 Veredito executivo
**Estado geral atual:** `funcional em partes`, `operacionalmente inconsistente`, `arquiteturalmente recuperável`, `governança insuficiente para pré-Alpha seguro`.

---

## 4. Rotulagem e nomenclatura canônica

Esta seção é um **contrato técnico de nomeação**, não uma lista de sugestões.
Cada regra tem critério verificável. A ausência de critério verificável é, por definição, uma regra fraca.

O problema histórico do YGGNAROK não foi falta de nomes — foi excesso de nomes sem fronteira:
- `agente local legado` nomeava simultaneamente um runtime local, um módulo de servidor, uma rota de API e um worker de fila.
- `Maestro` nomeava ao mesmo tempo o orquestrador geral e o controlador de jobs.
- `vinculativos` misturava autorização real (RBAC) com estado de UI (canvas de nós).
- `Bunker Mode` era um fallback técnico que virou identidade do sistema.
- `MOMONGA`, conceito de lore, vazou para bypass de segurança em código de produção.

As regras abaixo foram construídas para fechar as lacunas que permitiram cada um desses casos.

---

### 4.1 Regras de nomenclatura canônica pré-Alpha V2.0

As regras estão agrupadas em três camadas: **arquitetura**, **código** e **operação**.

---

#### Camada 1 — Arquitetura e identidade de componentes

**Regra 1 — Nome oficial descreve responsabilidade técnica**
O nome oficial de qualquer componente deve descrever **o que ele faz**, não quem o usa, não a metáfora que o inspirou, não o estado emocional do sprint.
- ✅ `Controlador de Jobs e Estado`
- ✅ `Adaptador Oficial n8n`
- ❌ `Orquestrador Supremo das Missões Ativas`
- ❌ `agente local legado` (sem qualificador)
- ❌ `Maestro` (sem qualificador)

**Critério verificável:** leia o nome em voz alta e responda: "o que exatamente este componente faz?". Se a resposta depender de contexto externo ou memória de projeto, o nome está errado.

---

**Regra 2 — Alias legado existe mas não governa e tem escopo declarado**
Um alias legado (nome antigo de um componente) pode ser mantido temporariamente para facilitar a transição, mas:
- não pode aparecer em nomes de arquivo, nomes de função, variável de ambiente ou rota de API;
- só pode aparecer em: comentários de código com tag `@legacy`, documentação histórica, logs de diagnóstico com prefixo `[legacy]`;
- deve ter prazo de remoção registrado no documento canônico.

**Critério verificável:** `grep -r "agente local legado\|Maestro\|vinculativo\|bunker" src/` — qualquer ocorrência fora de comentário `@legacy` é violação.

---

**Regra 3 — Alias mitológico é metadado com localização declarada**
Um alias mitológico (nome do CSV, como Thoth, Heimdall, Ma'at) só pode existir como metadado após promoção formal (ver seção 4.6). Antes da promoção, não pode aparecer em nenhum artefato técnico. Após a promoção, só pode aparecer em:
- campo `alias` de configuração declarada do componente;
- UI visual (nome exibido ao usuário);
- documentação narrativa;
- `SOUL.md` e arquivos de identidade de agente.

**Proibido mesmo após promoção:** nome de arquivo, nome de função, variável de ambiente, rota de URL, nome de tabela de banco.

---

**Regra 4 — Unicidade de nome e unicidade de alias**
Dois componentes não podem:
- ter o mesmo nome funcional;
- compartilhar o mesmo alias mitológico;
- ter nomes tão próximos que dependam de contexto para diferenciação.

Isso se aplica a componentes de qualquer prefixo. A violação mais comum é promover o mesmo alias mitológico a dois componentes de domínios diferentes.

**Critério verificável:** para qualquer alias candidato, execute: "existe outro componente ativo que já usa este nome ou poderia usá-lo com a mesma justificativa?" Se sim, o alias está em conflito e não pode ser promovido.

---

**Regra 5 — "Vinculativos" fora do vocabulário técnico**
O termo `vinculativos` e qualquer variação (`vinculativo`, `binding`, `vínculo genérico`) está banido do vocabulário técnico. Substitua pelo termo preciso (ver seção 4.4).

**Critério verificável:** `grep -r "vinculativ" .` — zero ocorrências permitidas fora de comentário histórico.

---

**Regra 6 — "agente local legado" e "Maestro" exigem qualificador técnico obrigatório**
Os termos `agente local legado` e `Maestro` não podem aparecer sem qualificador técnico em: nomes de arquivo, funções, variáveis, rotas de URL, nomes de tabela, comentários ativos ou documentação de arquitetura.
Qualificadores aceitos estão listados na tabela 4.3.

**Critério verificável:** `grep -rn "\bagente local legado\b\|\bMaestro\b" src/ worker/ scripts/` — cada ocorrência deve ter um qualificador técnico adjacente ou ser comentário `@legacy`.

---

**Regra 7 — Registro canônico retroativo e prospectivo**
Todo componente — **novo ou existente** — que:
- recebe chamadas de outros componentes,
- persiste estado, ou
- executa em background,

deve ter um ID canônico no formato `YGN-[PREFIXO]-[NNN]`, número sequencial com zero-padding de 3 dígitos. **O ID é imutável.** Renomear o componente não muda o ID.

**Para componentes novos:** o ID é atribuído antes de o componente entrar em produção. Um componente sem ID não pode receber novas dependências.

**Para componentes existentes sem ID — dívida de nomenclatura:**
Componentes já em produção sem ID são **dívida de nomenclatura** (naming debt). A dívida segue este protocolo obrigatório:
1. **Identificar** — mapear todos os componentes que cumpram os critérios acima e não estejam na tabela da seção 8.4.
2. **Classificar** — atribuir ID preliminar e nome canônico proposto seguindo as regras 1–6.
3. **Registrar** — adicionar à tabela da seção 8.4 with campo `status: legacy_pending`.
4. **Transição** — o nome antigo move para alias `@legacy` com prazo de remoção explícito.
5. **Substituir** — atualizar todas as referências (código, docs, rotas, vars) para o novo ID/nome.

**A dívida de nomenclatura tem prioridade sobre qualquer nova feature.** Nenhum componente em dívida pode receber nova funcionalidade antes de ter seu ID atribuído e suas referências atualizadas.

**Critério verificável:** a seção 8.4 é o registro canônico. Qualquer componente de núcleo ausente dessa tabela é dívida de nomenclatura.

---

**Regra 8 — Escopo do sistema de prefixos é explícito, não implícito**
O sistema de prefixos `YGN-` cobre: serviços, controladores, agentes, workers, integrações e a autoridade humana.
Ele **não cobre automaticamente**: rotas de API, tabelas de banco, arquivos de código, variáveis de ambiente, módulos de UI, subagentes. Essas camadas têm regras próprias nas seções 4.1 (Camada 2) e 4.7. A ausência de ID canônico nessas camadas é intencional, não lacuna.

---

#### Camada 2 — Código, arquivos e estrutura técnica

**Regra 9 — Proibição de identidade pessoal em código**
Nenhum email, username pessoal, apelido de colaborador, nome próprio de pessoa real ou identificador pessoal pode aparecer em: nome de arquivo, constante, variável, enum value, configuração hardcoded ou comentário ativo de lógica de negócio.
- ❌ `if (user.email === 'matheus.art1@gmail.com')`
- ❌ `const ADMIN_EMAIL = 'admin@yggnarok.local'` (hardcoded)
- ✅ `if (hasPermission(user, 'system.local_sensitive.execute'))`
- ✅ `const ADMIN_EMAIL = process.env.BOOTSTRAP_ADMIN_EMAIL`

**Critério verificável:** `grep -rn "@gmail\|@hotmail\|@yahoo\|matheus\|kotaro\|administrador" src/ worker/ scripts/` — zero ocorrências permitidas.

---

**Regra 10 — Nome de arquivo descreve responsabilidade, não agente**
O nome de um arquivo de código descreve **o que ele implementa**, não o agente ou serviço que o consome. O agente é detalhe de implementação, não parte do nome.
- ❌ `worker/agents/local-agent-legacy-chat.ts` → ✅ `worker/agents/chat-job-processor.ts`
- ❌ `src/server/local-agent-legacy/permissions.ts` → ✅ `src/server/auth/admin-permission-check.ts`
- ❌ `src/server/local-agent-legacy/runtime.ts` → ✅ `src/server/integrations/local-agent/bridge.ts`
- ❌ `n8n-webhook-yggnarok.json` → ✅ `n8n-workflow-content-ingestion.json`

**Critério verificável:** leia o nome do arquivo e responda: "este nome seria válido se o componente que o consome fosse renomeado amanhã?" Se não, o nome está errado.

---

**Regra 11 — Stub nunca se camufla de implementação real**
Qualquer arquivo com implementação stub, mock, fallback ou offline deve ter qualificador explícito:
sufixo `.stub.ts`, sufixo `.mock.ts`, ou estar dentro de diretório `stubs/` ou `mocks/`.
É proibido que um stub e sua implementação real compartilhem o mesmo nome base em diretórios próximos.
- ❌ `src/services/integrations/obsidian.ts` (stub silencioso)
- ✅ `src/services/stubs/obsidian.stub.ts` (stub explícito)
- ✅ `src/services/integrations/obsidian.ts` (implementação real)

**Critério verificável:** `grep -rn "console.log\|STUB\|\[stub\]\|\[mock\]" src/services/integrations/` — qualquer ocorrência neste diretório é candidata a violação.

---

**Regra 12 — Variável de ambiente descreve condition técnica, não metáfora**
Variáveis de ambiente descrevem o **estado técnico que controlam**. São proibidos nomes que descrevem um "modo com nome próprio" ou metáfora operacional.
- ❌ `YGGNAROK_LOCAL_BUNKER_MODE` → ✅ `YGGNAROK_STUB_BACKEND_ENABLED`
- ❌ `LOCAL_AGENT_GODMODE` → ✅ `LOCAL_AGENT_SKIP_AUTH_CHECK`
- ❌ `NAZARICK_LOCKDOWN` → ✅ `YGGNAROK_MAINTENANCE_MODE`
- ✅ `N8N_WEBHOOK_URL`, `N8N_MODE`, `OBSIDIAN_VAULT_ROOT` (descrevem recurso e condição)

**Critério verificável:** todo nome de variável de ambiente deve responder à pergunta "o quê está ligado/desligado/configurado?" sem precisar de contexto adicional.

---

**Regra 13 — Nome de módulo exige qualificador de escopo, não apenas diretório**
Um arquivo dentro de um diretório de domínio nomeado (`/local-agent-legacy/`, `/n8n/`, `/supabase/`) deve incluir no próprio nome o aspecto específico que implementa.
Nomes genéricos (`permissions.ts`, `handler.ts`, `utils.ts`, `helpers.ts`, `index.ts`) são proibidos dentro de diretórios de domínio a menos que o diretório seja suficientemente específico.
- ❌ `src/server/local-agent-legacy/permissions.ts` (genérico dentro de domínio)
- ✅ `src/server/auth/admin-permission-check.ts` (específico)
- ✅ `src/server/permissions/assert.ts` (o diretório já é o domínio; `assert` é a ação)

---

**Regra 14 — Sem diretórios com nome de sessão, experimento ou apelido**
Nenhum diretório no repositório pode usar: nome de sessão de trabalho, experimento numerado, apelido de desenvolvedor, estado emocional de sprint ou nome japonês que esconde função administrativa.
Diretórios legados ou arquivados usam prefixo `legacy/` com data ISO obrigatória.
- ❌ `testes do CRACRUDO/`
- ❌ `agents/ola-mundo`
- ❌ `sakusen-honbu/` (esconde área de admin)
- ✅ `legacy/snapshot-20240615/`
- ✅ `archive/2024-06-hotfix-auth/`

---

#### Camada 3 — Operação e fluxo

**Regra 15 — Rota de API nomeada pelo recurso, não pelo agente**
O caminho de uma rota de API identifica o **recurso** que expõe, não o serviço ou agente que a implementa internamente.
- ❌ `/api/local-agent-legacy/jobs` → ✅ `/api/jobs/chat`
- ❌ `/api/maestro/status` → ✅ `/api/system/status`
- ✅ `/api/profiles/[id]/members` (recurso = perfil)
- ✅ `/api/jobs/[id]/status` (recurso = job)

---

**Regra 16 — Modo degradado é condição técnica verificável, não identidade**
Qualquer lógica de fallback, degradação ou modo offline deve ser expressa como condição de infraestrutura (`!supabaseAvailable`, `process.env.YGGNAROK_STUB_BACKEND_ENABLED === 'true'`).
É proibido criar um "modo" referenciado por identidade nomeada (`isBunkerMode`, `isGodMode`, `isEmergencyProtocol`). A constant pode ter nome, mas o nome deve descrever a condição, não o modo.
- ❌ `if (isBunkerMode) { return mockClient() }`
- ✅ `if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('example.supabase.co')) { return stubClient() }`
- ❌ `const BUNKER_MODE = process.env.YGGNAROK_LOCAL_BUNKER_MODE`
- ✅ `const STUB_BACKEND = process.env.YGGNAROK_STUB_BACKEND_ENABLED === 'true'`

---

### 4.2 Prefixos oficiais com critérios de fronteira

A tabela abaixo define cada prefixo com: significado, critério de uso e a **pergunta de teste** — uma única pergunta binária que qualquer desenvolvedor pode responder para decidir o prefixo correto.

| Prefixo | Significado | Quando usar | Pergunta de teste |
|---|---|---|---|
| `YGN-HUM` | Autoridade humana | Entidade humana com decisão final, não delegável a IA | "Esta entidade é uma pessoa que aprova decisões que nenhuma IA pode tomar sozinha?" |
| `YGN-SVC` | Serviço 24/7 / ponto de entrada | Componente disponível continuamente, recebe comandos de HUM ou de outros SVC, coordena ao nível de plataforma inteira | "Este componente existe em no máximo 3 instâncias no sistema e pode receber instrução direta do Admin Humano?" |
| `YGN-CTRL` | Controlador de domínio | Governa um domínio específico: prioriza, roteia, bloqueia, arbitra dentro desse domínio | "Este componente pode bloquear, pausar ou redirecionar o fluxo dentro de seu domínio?" |
| `YGN-AGT` | Agente especialista | Produz output criativo, analítico ou especializado usando raciocínio de LLM; pode "surpreender" com resultado válido mas não previsto | "Este componente usa LLM para raciocinar e pode produzir output inesperado mas válido?" |
| `YGN-WKR` | Worker executor | Consome fila e executa transformação mecânica com contrato fixo de entrada/saída; só falha tecnicamente, nunca "criativamente" | "Este componente executa mecanicamente um job da fila com contrato fixo de entrada e saída?" |
| `YGN-MEM` | Repositório de memória | Persiste e recupera memórias/precedentes **passivamente**, sem decidir o que vale ser lembrado | "Este componente apenas persiste e recupera dados de memória sem tomar decisão sobre eles?" |
| `YGN-AUD` | Auditoria append-only | Registra eventos **sem interferir** no fluxo; append-only, não pode bloquear nem redirecionar | "Este componente apenas registra o que aconteceu, sem poder alterar, bloquear ou redirecionar nada?" |
| `YGN-JDG` | Juiz / participante de júri | Entidade que **participa** de um processo de deliberação: emite voto, parecer ou avaliação | "Este componente é um participante do júri que emite voto ou parecer (não a infraestrutura que gerencia o processo)?" |
| `YGN-INT` | Integração / adaptador | Traduz protocolo entre o núcleo YGN e um serviço externo (n8n, Obsidian, R2, etc.) | "Este componente faz bridge entre o sistema YGN e um serviço externo com protocolo diferente?" |
| `YGN-STO` | Storage | Persiste dados dentro do perímetro do sistema (banco, objeto storage, índice) | "Este componente é o ponto de persistência de dados dentro do sistema?" |
| `YGN-ENV` | Ambiente / configuração | Define variáveis, segredos ou condições de execução de um ambiente específico | "Este componente configura o ambiente de execução de outros componentes?" |
| `YGN-LEG` | Legado / congelado / removido | Componente desativado, congelado ou removido. **LEG descreve estado, não função** — ver regra de migração abaixo | "Este componente foi desativado e precisa ter seu histórico preservado?" |

#### Regra de migração para LEG

Quando um componente é congelado ou removido, seu ID original é preservado e recebe entrada na tabela de migração:

```
YGN-[PREFIXO]-[NNN] → YGN-LEG-[NNN]   (mantém o número original)
Data de migração: YYYY-MM-DD
Motivo: [descrição técnica]
Substituto: YGN-[PREFIXO]-[MMM] ou "sem substituto"
```

O ID original **não é reaproveitado** para novos componentes.

#### Pares confusos — distinções críticas

**SVC vs. CTRL**
- SVC: nível de plataforma, escopo global, até 3 instâncias, recebe instrução direta de HUM.
- CTRL: nível de domínio, escopo específico, múltiplas instâncias possíveis, recebe instrução de SVC.
- Regra: se o componente pode ser chamado diretamente pelo Admin Humano sem passar por outro componente, é SVC. Se só pode ser chamado por SVC ou outro CTRL, é CTRL.

**AGT vs. WKR**
- AGT: usa LLM, output pode ser criativo e imprevisível (mas válido), não tem contrato rígido de saída.
- WKR: sem LLM no loop principal, contrato fixo de entrada/saída, falha apenas tecnicamente.
- Regra: se o componente pode "surpreender" com o resultado sem estar errado, é AGT. Se toda surpresa é erro, é WKR.

**MEM vs. CTRL-004**
- MEM: persiste e recupera passivamente, sem critério de promoção ou revogação.
- CTRL-004 (Controlador de Memória e Precedentes): decide o que promover, quando revogar memória contaminada, como aplicar precedentes.
- Regra: se o componente apenas guarda e devolve, é MEM. Se toma decisões sobre o que vale ser lembrado, é CTRL.

**JDG vs. CTRL-008**
- CTRL-008 (Controlador de Júri): abre o caso, registra votos, organiza o veredito — infraestrutura do processo.
- JDG: participante individual que emite voto ou parecer — Ma'at, Shamash, Forseti são JDG.
- Regra: se cria e gerencia o processo deliberativo, é CTRL. Se participa emitindo opinião, é JDG.

**AUD vs. CTRL-007**
- AUD: append-only, não interfere, não bloqueia.
- CTRL-007 (Controlador de Dados e Métricas): pode acionar alertas, verificar consistência, intervir no fluxo.
- Regra: se pode bloquear ou acionar alguma ação, é CTRL. Se só registra, é AUD.

---

### 4.3 Tabela de renomeação obrigatória

| Termo legado / encontrado | Nome canônico pré-Alpha V2.0 | ID canônico | Decisão |
|---|---|---|---|
| agente local legado (solto) | **proibido sem qualificador** | — | remover ambiguidade — ver Regra 6 |
| Agente local legado externo | **Serviço Local Sensível** | YGN-SVC-003 | alias `Agente local legado` permitido apenas em comentário @legacy |
| Chat backend legado / chat.routing | **Serviço Assíncrono de Chat** | YGN-SVC-001 (parcial) | separar completamente do runtime local |
| Maestro | **Orquestrador Central** | YGN-SVC-002 | alias `Maestro` apenas em comentário @legacy |
| Maestro de jobs | **Controlador de Jobs e Estado** | YGN-CTRL-001 | alias `Maestro` apenas em comentário @legacy |
| vinculativos | **ver seção 4.4** | — | substituir pelo termo preciso |
| MOMONGA / Admin | **Admin Humano Supremo** | YGN-HUM-001 | MOMONGA permanece como alias interno não técnico |
| MATHEUS / KOTARO / fragmentos | **modos operacionais do Admin** | — | não confundir com RBAC; não entram em código |
| Diretoria IA | **Painel Operacional de IA** | módulo UI | renomear por clareza |
| Creation Nexus | **Hub de Criação e Constelações** | módulo UI | manter visualmente; não é fonte de verdade arquitetural |
| Bunker Mode | **modo degradado / stub explícito** | — | não usar como identidade; ver Regra 16 |
| sakusen-honbu | **Painel de Administração** | módulo UI | renomear; nome japonês esconde área crítica |
| testes do CRACRUDO | **legacy/snapshot-[data]** | — | mover para legacy/ ou remover |
| `worker/agents/local-agent-legacy-chat.ts` | `worker/agents/chat-job-processor.ts` | — | ver Regra 10 |
| `src/app/api/local-agent-legacy/jobs/route.ts` | `src/app/api/jobs/chat/route.ts` | — | ver Regra 15 |
| `src/server/local-agent-legacy/permissions.ts` | `src/server/auth/admin-permission-check.ts` | — | ver Regra 10 + 13 |
| `src/server/local-agent-legacy/runtime.ts` | `src/server/integrations/local-agent/bridge.ts` | — | ver Regra 10 |
| `YGGNAROK_LOCAL_BUNKER_MODE` | `YGGNAROK_STUB_BACKEND_ENABLED` | — | ver Regra 12 |

---

### 4.4 Renomeação do conceito "vinculativos"

O termo deve sair completamente do vocabulário porque mistura quatro conceitos técnicos distintos.
Substitua sempre pelo termo preciso:

| Conceito real | Termo canônico | Localização técnica |
|---|---|---|
| Associação usuário ↔ perfil ↔ cargo | **membership canônico** | tabela `profile_members` |
| Tag de contexto operacional | **tag contextual** | tabela `profile_tags` |
| Escopo de entidade por perfil | **escopo de perfil** | coluna `profile_id` nas tabelas de negócio |
| Relação visual entre nós no canvas | **edge** ou **node_relation** | estado de frontend — nunca autorização |
| Relação transitória de UI | **estado de UI** | frontend apenas — nunca persiste como permissão |

**Critério verificável:** `grep -rn "vinculativ" .` — zero ocorrências.

---

### 4.5 Conflitos de alias mitológico identificados no CSV

Os seguintes aliases têm candidatura em dois ou mais domínios no CSV e **não podem ser promovidos** até que o conflito seja resolvido formalmente:

| Alias | Conflito | Resolução recomendada |
|---|---|---|
| **Hefesto** | AGT-001 (Geração de Prompts) E domínio Código/Infra | Reservar para AGT-001 apenas. Criar `Hefesto-CLI` como subagente de código se necessário, com sufixo obrigatório |
| **Janus** | SVC-002 (Orquestrador) E CTRL-001 (Jobs e Estado) | Reservar para CTRL-001. SVC-002 deve avaliar Heimdall (INV-021) como candidato prioritário |
| **Raphael** | AGT-010 (Recuperação e Rollback) E família de subagentes de backup físico (Raphael-Supabase, Raphael-R2, etc.) | AGT-010 recebe alias distinto (avaliar Osiris, INV-124). Família Raphael fica exclusiva para backup físico |
| **Vishvakarma** | CTRL-006 (Controlador de Integrações) E subagentes de CI/CD (Vishvakarma-Typecheck, Vishvakarma-Lint) | Vishvakarma fica exclusivo para subagentes de CI/CD. CTRL-006 avalia Arachne (INV-134) como candidato alternativo |

**Regra adicional:** o campo `status` do CSV com valor `conflito` é bloqueador de promoção. Um alias marcado como `conflito` no CSV não pode ser promovido sem resolução documentada do conflito.

---

### 4.6 Protocolo de promoção de alias mitológico

Um alias mitológico candidato (do CSV) só passa de "candidato" para "alias oficial de componente ativo" quando todas estas condições forem satisfeitas:

#### Condições de promoção

1. **Unicidade confirmada:** nenhum outro componente ativo tem o mesmo alias ou um alias com a mesma raiz.
2. **Domínio único:** o candidato está listado em apenas um domínio no CSV, OU o conflito de domínio foi resolvido formalmente (ver seção 4.5).
3. **Status permitido no CSV:** o campo `status` do candidato deve ser `avaliar forte` ou `nome alternativo`. Status `conflito`, `pesquisa bruta` ou `legacy_note` bloqueiam promoção.
4. **Aprovação por YGN-HUM-001:** a promoção é registrada pelo Admin Humano Supremo.
5. **Registro formal:** a promoção é documentada na tabela abaixo com ID canônico, alias, data e aprovador.

#### Tabela de aliases promovidos

| ID canônico | Nome funcional | Alias oficial | Data de promoção | Aprovado por |
|---|---|---|---|---|
| _(nenhum promovido ainda)_ | — | — | — | — |

#### Onde o alias pode aparecer após promoção

| Local | Permitido? |
|---|---|
| Campo `alias` em arquivo de configuração do componente | ✅ |
| UI visual (nome exibido ao usuário) | ✅ |
| Documentação narrativa e SOUL.md | ✅ |
| Comentários de código (não em identificadores) | ✅ |
| Nome de arquivo | ❌ |
| Nome de função ou variável | ❌ |
| Variável de ambiente | ❌ |
| Rota de URL | ❌ |
| Nome de tabela de banco | ❌ |

---

### 4.7 Camadas fora do escopo do sistema de prefixos YGN-

O sistema de prefixos `YGN-` **não se aplica automaticamente** a estas camadas. Cada uma tem suas próprias convenções:

| Camada | Convenção canônica | Referência |
|---|---|---|
| **Rotas de API** | `/api/[recurso]/[ação]` — nunca `/api/[agente]/[recurso]` | Regra 15 |
| **Módulos de UI / páginas** | Nome funcional em português ou inglês técnico; sem nome de personagem ou alias mitológico | Regra 1 |
| **Arquivos de código** | Nome descreve responsabilidade, não agente; kebab-case para arquivos, PascalCase para componentes React | Regra 10 |
| **Tabelas de banco** | snake_case; nome do recurso de negócio no plural; sem prefixo YGN- | Decisão de schema — documentar separadamente |
| **Variáveis de ambiente** | SCREAMING_SNAKE_CASE; prefixo `YGGNAROK_` para vars globais, prefixo de serviço para vars de integração (`N8N_`, `OBSIDIAN_`, `SUPABASE_`) | Regra 12 |
| **Subagentes com sufixo** | `[Alias]-[Função]` apenas após alias promovido; sufixo deve ser substantivo técnico em inglês | Regra 4 (unicidade) |
| **Stubs e mocks** | Sufixo `.stub.ts` / `.mock.ts` obrigatório ou diretório `stubs/` | Regra 11 |
| **Diretórios de legado** | Prefixo `legacy/` + data ISO obrigatória | Regra 14 |

---

### 4.8 Correções obrigatórias de nomenclatura interna do documento V2.0

Os seguintes itens no próprio documento V2.0 violam as regras acima e devem ser corrigidos antes de o documento ser congelado como canônico:

| Item no V2.0 | Violação | Correção |
|---|---|---|
| `YGN-SVC-003` nome: "Controlador Local Sensível" | A palavra "Controlador" no nome de um SVC contradiz a distinção SVC/CTRL — cria expectativa de que deveria ser CTRL | Renomear para **"Serviço Local Sensível"** |
| `YGN-WKR-002` nome: "Worker de Avaliação" | Faz scoring com rubrica = raciocínio analítico = função de AGT, não WKR | Promover para **`YGN-AGT-011 — Agente de Avaliação e Scoring`** |
| Prefixos `MEM, AUD, JDG, STO, ENV` na tabela 4.2 sem nenhum componente no 8.4 | Prefixos definidos sem uso geram colisão futura com componentes CTRL existentes | Explicitar que MEM/AUD/JDG são reservados para sub-entidades específicas (ver critérios de fronteira na seção 4.2) |
| Regra "Não promover sem domínio+história+função+legado+sem duplicação" no CSV | Checklist moral, não protocolo técnico verificável | Substituído pelo protocolo formal da seção 4.6 |

---

### 4.9 Dívida de nomenclatura atual — componentes sem ID

Lista de componentes confirmados no código que cumprem os critérios da Regra 7 mas não estão na tabela 8.4. Devem receber IDs antes de qualquer nova feature:

| Componente atual | Localização | Nome canônico proposto | ID preliminar | Status |
|---|---|---|---|---|
| Chat backend legado | `src/server/local-agent-legacy/` | Módulo de Chat e Roteamento | YGN-MOD-001 | `legacy_pending` |
| Fila de jobs de chat | `src/server/local-agent-legacy/jobs.ts` + `worker/agents/local-agent-legacy-chat.ts` | Agente Processador de Jobs de Chat | YGN-AGT-011 | `legacy_pending` |
| Catálogo de agentes IA | `src/lib/ai-entity-catalog.ts` | Catálogo de Agentes Operacionais | YGN-MOD-002 | `legacy_pending` |
| Daemon local legado documentado, não implementado | `DOCUMENTO_1_RESUMO.md`, `DOCUMENTO_2_DETALHADO.md` | — | — | `remover — nunca foi implementado` |

---

## 5. Estado real por componente

### 5.1 Matriz operacional consolidada
| Componente | Estado atual | Classe | Decisão pré-Alpha |
|---|---|---|---|
| Next.js app | código saudável; runtime local parado | ativo com risco | manter |
| Supabase remoto | linkado e usado como verdade operacional quando env real existe | ativo com risco | manter |
| Supabase local | não está rodando | quebrado/ausente | decidir se volta ou se sai do fluxo local |
| Vercel produção | pronta e ligada à `main` | ativo | manter |
| Vercel preview | sem paridade completa de R2/AI runner | ativo com lacuna | corrigir |
| GitHub repo público | ativo; workflow de CI preparado no repo, mas branch protection ainda não confirmada | ativo com risco | endurecer governança e ativar proteção na UI |
| n8n do repo | JSON inativo/stub; endpoint `/api/n8n` já consome webhook por env | órfão/parcial | formalizar adapter oficial e remover drift operacional |
| n8n real local | ativo fora do repo | ativo com risco | formalizar como integração externa |
| Obsidian via `/api/obsidian` | grava direto no disco, agora com autenticação, origin check, rate limit e contenção de path | ativo com risco médio/alto | substituir por adaptador seguro |
| Obsidian bridge local | ativo em outro vault | ativo com risco | alinhar vault oficial |
| Agente local legado externo | existe localmente, sem processo confirmado neste snapshot | ativo com risco conceitual | formalizar ou desacoplar |
| `/api/local-agent-legacy/jobs` | citado historicamente no dossiê, mas ausente no código atual verificado | inconsistente/documental | decidir se será implementado como legado ou substituído oficialmente por `/api/jobs/chat` |
| Worker local | planejado/implementado, mas dependente de ambiente consistente | parcial | manter e estabilizar |
| Cloudflare R2 | configurado para mídia | configurado/ativo | manter |
| Cloudflare AI runner | cron configurado, deploy não comprovado aqui | ambíguo | validar |
| Ollama local | parado | inativo | manter como fallback opcional |
| `.vercel/project.json` | binding local conhecido | metadado exposto | revisar versionamento |
| `supabase/.temp/*` | versionado com metadados do projeto remoto | risco operacional | remover do Git |
| `testes do CRACRUDO` | cópia legada grande | lixo técnico | remover/quarentenar |

### 5.2 O que está funcionando de verdade
**Funciona ou está comprovadamente configurado:**
- front/repo/typecheck/lint;
- deploy de produção via Vercel;
- Supabase remoto linkado;
- storage R2 configurado;
- n8n local externo rodando;
- Obsidian desktop rodando;
- auth/UI/RBAC base existem em código.

### 5.3 O que está mascarado, quebrado ou incoerente
**Está quebrado, incompleto ou enganoso:**
- Supabase local;
- scripts PowerShell com path absoluto antigo;
- webhook do n8n hardcoded;
- escrita direta do Obsidian via API local;
- bootstrap de perfil conflitando entre server action e RLS;
- permissões agente local legado fora do RBAC;
- múltiplas verdades para n8n/Obsidian/agente local legado;
- preview sem cobertura de envs de mídia/runner;
- branch governance praticamente inexistente.

---

## 6. Arquitetura real hoje: como o sistema realmente se comporta

### 6.1 Visão factual atual
A arquitetura real hoje não é uma única linha limpa. Ela é uma composição híbrida:

```text
Navegador
  -> Next.js App Router
      -> rotas internas / UI / server actions
      -> /api/chat
      -> /api/n8n
      -> /api/obsidian

Observação verificada em código:
  -> /api/local-agent-legacy/jobs não existe no snapshot atual
  -> /api/jobs/chat existe no snapshot atual e retorna `202` para criação de job pendente

Next.js / Worker
  -> Supabase remoto (quando env real existe)
  -> stubs / fallback / localStorage / bunker-like behavior (quando env não fecha)
  -> OpenRouter / OpenAI / Ollama (dependendo do runtime)

Mídia
  -> Cloudflare R2 via gateway/token

Automação local real (fora do repo)
  -> KOTARO_OBSIDIAN_BRIDGE
  -> n8n local
  -> Obsidian Local REST API / vault local

Camada local sensível
  -> Agente local legado externo
  -> arquivos locais
  -> caches, auth.json, state.db, memories, sessions
```

### 6.2 Fluxo real do chat e jobs
Fluxo observado hoje, simplificado:

1. usuário entra no site;
2. Next processa UI e rotas;
3. dependendo do ambiente, a app usa Supabase real ou entra em fallback/stub;
4. não há rota HTTP de jobs de chat implementada no App Router atual para substituir `/api/chat`;
5. worker/processador depende de Supabase e env válidos;
6. parte do ecossistema “agente local legado” existe no repo, outra fora do repo.

### 6.2.1 Gap verificado e contrato técnico proposto
**Gap verificado:** o documento histórico menciona `/api/local-agent-legacy/jobs`, mas a rota não existe no código atual. A substituição canônica por `/api/jobs/chat` já foi implementada no snapshot atual.

**Contrato técnico implementado como baseline no snapshot atual:**
- `POST /api/jobs/chat`
- **Entrada mínima:**
  ```json
  {
    "message": "texto do usuário",
    "profileId": "uuid-opcional",
    "conversationId": "uuid-opcional",
    "context": {
      "source": "chat-ui"
    }
  }
  ```
- **Saída mínima síncrona:**
  ```json
  {
    "jobId": "uuid",
    "status": "pending"
  }
  ```
- **Responsabilidade:** registrar/enfileirar um job de chat para processamento assíncrono, sem carregar branding legado no path.
- **Dependências esperadas:** autenticação válida, persistência em `ai_jobs` e worker capaz de consumir a fila.

### 6.3 Fluxo real de n8n
Hoje existem **três camadas de n8n**, o que é incorreto como arquitetura:

1. **n8n do repo** — JSON inativo, sem prova de uso real;
2. **rota `/api/n8n`** — chama webhook cloud hardcoded;
3. **n8n real ativo** — roda localmente fora do repo, em bridge separado, na porta `5678`.

Conclusão: hoje o projeto não tem **um** n8n oficial; tem três rastros conflitantes.

### 6.4 Fluxo real de Obsidian
Hoje também existem **três modelos de Obsidian**:

1. stub de frontend;
2. rota de API que escreve direto no filesystem local;
3. bridge externo que usa Obsidian Local REST API e outro vault.

Conclusão: hoje o projeto não tem **um** caminho oficial de memória/vault; tem três caminhos diferentes.

### 6.5 Fluxo real de permissões
O RBAC existe e é sério no banco, mas está poluído por exceções paralelas:

- roles/permissions/profile_members existem;
- `assertPermission()` existe;
- RLS existe;
- mas há conflito de bootstrap de perfil;
- e há hardcode de admin por e-mail na camada agente local legado.

Conclusão: a direção está certa; a aplicação está incompleta.

---

## 7. Contradições arquiteturais que precisam ser eliminadas

### 7.1 Matriz das contradições críticas
| Contradição | Impacto | Severidade | Veredito |
|---|---|---|---|
| n8n oficial inexistente | automação imprevisível | crítica | decidir uma topologia oficial |
| Obsidian oficial inexistente | memória/vault divergente | crítica | decidir um vault e um adaptador |
| agente local legado nomeia coisas diferentes | responsabilidade difusa | crítica | renomear e separar camadas |
| bootstrap de perfil conflita com RLS | onboarding pode falhar ou exigir atalho | crítica | corrigir agora |
| hardcoded admin emails | bypass fora do RBAC | crítica | remover agora |
| webhook cloud hardcoded | dependência pessoal e opaca | crítica | trocar por env + assinatura |
| escrita direta em vault por API | risco local e ausência de guard-rail | crítica | encapsular em adaptador |
| scripts com paths quebrados | automação local falsa | alta | corrigir ou remover |
| repo público sem proteção | risco de regressão/alteração indevida | alta | endurecer governança |
| Supabase `.temp` versionado | expõe metadado operacional | média/alta | remover do Git |
| preview sem envs de mídia/runner | testes enganosos | média/alta | alinhar política de preview |
| stubs/bunker mascarando persistência | falsa sensação de estabilidade | alta | restringir stub a modo explícito de dev |

### 7.2 Diagnóstico central
O maior problema não é a stack.
O maior problema é **drift de verdade operacional**.

Hoje há drift entre:

- runtime e repo;
- repo e scripts;
- scripts e máquina;
- máquina e produção;
- plano arquitetural e implementação;
- nomenclatura e responsabilidade.

Pré-Alpha V2.0 existe para acabar com isso.

---

## 8. Arquitetura canônica pré-Alpha V2.0

### 8.1 Princípio estrutural
A arquitetura canônica daqui para frente deve ser dividida em cinco planos:

1. **Plano humano de autoridade**
2. **Plano de controle**
3. **Plano de execução**
4. **Plano de dados e storage**
5. **Plano de interface e observabilidade**

### 8.2 Arquitetura-alvo limpa
```text
Admin Humano Supremo
  ->
Serviço Central 24/7
  ->
Orquestrador Central 24/7
  ->
Controladores por domínio
  ->
Agentes especialistas e workers
  ->
Integrações/adaptadores
  ->
Supabase / R2 / backups / logs / métricas
  ->
Interface web e painéis operacionais
```

### 8.3 Separação obrigatória
| Plano | Faz | Não faz |
|---|---|---|
| Humano | aprova, decide exceção, governa risco | não executa rotina mecânica |
| Controle | prioriza, roteia, bloqueia, arbitra, mede custo, abre júri | não faz tudo sozinho |
| Execução | gera, transforma, pesquisa, analisa, publica pacote | não define política suprema |
| Dados | persiste verdade operacional, permissões, jobs, artefatos e auditoria | não resolve UX ou governança sozinho |
| Interface | expõe estado, formulário, painel, interação humana | não executa jobs longos nem define segurança final |

### 8.4 Núcleo ativo recomendado do pré-Alpha
O projeto não deve tentar operacionalizar 300+ itens agora.
O núcleo ativo pré-Alpha deve ser **enxuto, explícito e auditável**.

#### Autoridade humana
| ID | Nome oficial | Papel |
|---|---|---|
| YGN-HUM-001 | Admin Humano Supremo | regra final, exceção, aprovação crítica |

#### Serviços centrais
| ID | Nome oficial | Alias legado permitido | Papel |
|---|---|---|---|
| YGN-SVC-001 | Serviço Central 24/7 | agente local legado Principal | entrada de missão, síntese, coordenação superior |
| YGN-SVC-002 | Orquestrador Central 24/7 | Maestro | distribuição de jobs, recomposição, retry, cobrança de estado |
| YGN-SVC-003 | Controlador Local Sensível | Agente local legado | execução local de alto risco no PC |

#### Controladores obrigatórios
| ID | Nome oficial | Papel |
|---|---|---|
| YGN-CTRL-001 | Controlador de Jobs e Estado | fila, lock, timeout, retry, cancelamento, zombie recovery |
| YGN-CTRL-002 | Controlador de Permissões e Policy | escopo, autorização, menor privilégio, gates e compliance |
| YGN-CTRL-003 | Controlador de Segurança e Risco | bloqueio, anomalia, contenção, segredos e abuso |
| YGN-CTRL-004 | Controlador de Memória e Precedentes | memória promovida, lições, decisões e reversão |
| YGN-CTRL-005 | Controlador de Custos e Quotas | budget, ledger, freio financeiro e limites |
| YGN-CTRL-006 | Controlador de Integrações | contratos, adapters, webhooks e modos local/cloud |
| YGN-CTRL-007 | Controlador de Dados e Métricas | relatórios, manifests, lineage e consistência |
| YGN-CTRL-008 | Controlador de Júri e Deliberação | abre júri, registra votos, organiza veredito |
| YGN-CTRL-009 | Controlador de Publicação Manual | prepara pacote; nunca autopublica no pré-Alpha |

#### Agentes mínimos de primeira onda
| ID | Nome oficial | Papel |
|---|---|---|
| YGN-AGT-001 | Agente de Geração de Prompts | cria prompts estruturados e reutilizáveis |
| YGN-AGT-002 | Agente de Texto e Roteiro | textos, roteiros, legendas, variações |
| YGN-AGT-003 | Agente de Copy e Oferta | CTA, oferta, descrição e venda assistida |
| YGN-AGT-004 | Agente de Pesquisa e Verificação | fatos, fontes, benchmarking, validação |
| YGN-AGT-005 | Agente de Imagem e Thumbnail | imagem, composição, variação e thumbnail |
| YGN-AGT-006 | Agente de Vídeo e Pacote | pacote de vídeo, storyboard, corte lógico |
| YGN-AGT-007 | Agente de Áudio e Voz | voz, TTS, STT, pacotes de áudio |
| YGN-AGT-008 | Agente de QA e Checklist | checklist técnico antes de entrega |
| YGN-AGT-009 | Agente de IP e Compliance | classifica risco de uso, fan-art, originalidade |
| YGN-AGT-010 | Agente de Recuperação e Rollback | rollback lógico, repair e apoio a incidentes |

#### Workers/adaptadores mínimos
| ID | Nome oficial | Papel |
|---|---|---|
| YGN-WKR-001 | Worker Runner de Jobs | consome `ai_jobs` e processa com contratos |
| YGN-INT-001 | Adaptador Oficial n8n | único ponto oficial para n8n |
| YGN-INT-002 | Adaptador Oficial Obsidian | único ponto oficial para vault/knowledge |
| YGN-INT-003 | Gateway Oficial de Mídia | upload/download de binários e manifests |
| YGN-WKR-002 | Worker de Avaliação | scoring, rubrica, pós-processamento |

### 8.5 Endpoints de Health
| Endpoint | Responsabilidade | Status | Evidência |
|----------|------------------|--------|-----------|
| `/api/health` | Verificação de saúde dos workers e dependências | ✅ Implementado | `curl http://localhost:3000/api/health` |

### 8.6 Regra de ouro para o inventário expandido
O inventário 300+/328 não é descartado; ele vira **banco de possibilidades**, não arquitetura ativa.
No pré-Alpha V2.0, somente o núcleo acima pode ser tratado como vivo.

---

## 9. Cargos, RBAC e vínculos de contexto

### 9.1 O que está confirmado
A classificação técnica real de cargos no banco é RBAC, com estes papéis confirmados:

- `owner`
- `admin`
- `manager`
- `creator`
- `editor`
- `viewer`

E a relação central é:

```text
users
  -> profile_members
      -> roles
          -> role_permissions
              -> permissions
```

### 9.2 O que precisa ser separado conceitualmente
Há dois níveis diferentes que estavam sendo confundidos:

1. **RBAC real do sistema**
   roles, permissions, memberships, RLS, `assertPermission`.

2. **Persona/governança humana do projeto**
   MOMONGA, MATHEUS, KOTARO, modos do Admin, fragmentos históricos.

Esses dois níveis não podem ocupar a mesma camada.

### 9.3 Regra canônica
- **RBAC oficial do produto**: fica no banco.
- **Persona operacional do dono**: fica fora do RBAC público.
- **Admin Humano Supremo**: pode se mapear para `owner/admin` no banco, mas sua camada humana não substitui o modelo formal.

### 9.4 Renomeação oficial de “vinculativos”
O termo correto no documento passa a ser:

**vínculos de contexto operacionais**

Subdivididos em:

- **membership canônico**: usuário + perfil + role (`profile_members`)
- **escopo por perfil**: `profile_id`
- **tag contextual**: `profile_tags`
- **relação visual de node**: `node_relations` ou `edges`, nunca “vinculativo” genérico

### 9.5 Defeito crítico de bootstrap
Há conflito entre:
- migration que permite criação inicial por `owner_id = auth.uid()`;
- server action que exige `profiles.create`;
- mudança posterior em `private.user_has_permission` baseada só em `profile_members`.

**Veredito:** o bootstrap inicial precisa virar fluxo explícito.

### 9.6 Solução recomendada
**Fluxo único de bootstrap do primeiro perfil:**
1. endpoint/setup ou script de bootstrap controlado;
2. usa service role **uma única vez** para criar o primeiro owner/profile;
3. grava audit log;
4. desativa bootstrap aberto;
5. a partir daí, toda criação passa pelo RBAC normal.

Isso elimina a gambiarra implícita e alinha app + RLS + onboarding.

---

## 10. Integrações e o que deve acontecer com cada uma

## 10.1 Supabase
### Confirmado
- é a fonte de verdade operacional pretendida;
- projeto remoto está linkado;
- RBAC/RLS existem;
- local não está rodando;
- `.temp` está versionado.

### Decisão
**Manter como autoridade de dados e autorização.**

### Corrigir
- remover `supabase/.temp/*` do Git;
- decidir oficialmente entre `dev remoto controlado` ou `Supabase local suportado`;
- corrigir bootstrap de perfil;
- revisar paridade entre migrations e server actions;
- garantir que stubs nunca mascarem produção.

### Não fazer
- não usar service role no browser;
- não usar Supabase local quebrado como se fosse ambiente suportado;
- não deixar fallback se passar por persistência real.

## 10.2 Vercel
### Confirmado
- produção está pronta;
- build atual vem de `main`;
- preview não espelha mídia/AI runner por completo;
- projeto local `.vercel/project.json` aponta para `yggnarok-v1`.

### Decisão
**Manter como hosting principal do front/API fino.**

### Corrigir
- documentar matriz de env por ambiente;
- alinhar preview com política clara: ou cobre integrações críticas, ou desabilita explicitamente com flags;
- adicionar health endpoints e runbook de rollback;
- avaliar se `.vercel/` fica versionado.

### Não fazer
- não tratar preview como ambiente válido se ele não cobre integrações críticas;
- não esconder ausência de env essencial.

## 10.3 GitHub
### Confirmado
- repo público;
- sem workflows ativos;
- sem branch protection confirmada;
- branches diversas e worktree órfão;
- remote extra inválido.

### Decisão
**Manter GitHub como SCM oficial, mas endurecer imediatamente.**

### Corrigir
- branch protection em `main`;
- PR obrigatório;
- CI mínimo (`typecheck`, `lint`, `build`);
- remover remote `yggnarok-cursor` se inválido;
- limpar worktree `agents/ola-mundo`;
- definir estratégia de branches real;
- registrar ambientes e owners.

### Não fazer
- não operar produção só por push solto em repo público sem proteção;
- não confiar na Vercel como único guard-rail.

## 10.4 n8n
### Confirmado
- n8n real ativo está fora do repo;
- JSON do repo está inativo;
- API do app chama webhook cloud hardcoded.

### Decisão
**O projeto deve ter um único adaptador oficial para n8n.**

### Arquitetura recomendada
```text
Next/API
  -> Adaptador Oficial n8n
      -> modo cloud OU modo local
      -> assinatura/token/idempotência
      -> logs/audit
```

### Corrigir
- trocar hardcode por `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_TOKEN` e modo `local|cloud|disabled`;
- formalizar se o bridge externo é dependência oficial ou ferramenta pessoal;
- se o workflow do repo não será usado, remover ou mover para `legacy/`.

### Não fazer
- não manter três topologias oficiais ao mesmo tempo;
- não usar `webhook-test` como rota canônica.

## 10.5 Obsidian
### Confirmado
- há stub de frontend;
- há API que escreve direto no disco;
- há bridge externo com outro vault;
- há plugin REST API ativo em outro vault.

### Decisão
**Obsidian deve permanecer memória legível humana, nunca banco transacional.**

### Arquitetura recomendada
```text
Next/API
  -> Adaptador Oficial Obsidian
      -> modo rest_api OU filesystem controlado
      -> vault allowlisted
      -> auth + permission + audit
```

### Corrigir
- remover default silencioso para `Documents\Obsidian Vault`;
- declarar `OBSIDIAN_VAULT_ROOT` e `OBSIDIAN_MODE`;
- permitir apenas caminhos dentro de allowlist;
- registrar quem escreveu o quê;
- decidir um vault oficial.

### Não fazer
- não permitir escrita arbitrária no filesystem;
- não deixar dois vaults concorrerem como “fonte real”.

## 10.6 agente local legado local
### Confirmado
- existe instalação/dados locais amplos;
- não havia processo ativo confirmado no snapshot do Codex pt2;
- runtime atual do repo aponta para executável externo;
- permissões por e-mail hardcoded existem na camada agente local legado;
- o nome agente local legado está sobrecarregado.

### Decisão
**Formalizar como Controlador Local Sensível, fora da semântica oficial do chat/serviço central.**

### Corrigir
- remover hardcode de admin por e-mail;
- tornar Agente local legado externo uma dependência explícita e opcional;
- documentar o que ele pode e o que ele não pode tocar;
- separar completamente:
  - serviço central da plataforma,
  - serviço assíncrono de chat,
  - runtime local sensível,
  - worker `local-agent-legacy-chat`.

### Não fazer
- não tratar “agente local legado” como se fosse um único componente.

## 10.7 Cloudflare R2 e AI Runner
### Confirmado
- bucket de mídia existe em config;
- gateway R2/token é referenciado;
- AI runner tem cron configurado;
- deploy efetivo do worker não ficou provado neste pacote.

### Decisão
**Manter R2 como storage quente de binários.**

### Corrigir
- validar deploy e secrets do AI runner;
- registrar artifacts manifests;
- padronizar lifecycle de mídia;
- separar storage quente (R2) de backup frio.

### Não fazer
- não deixar o sistema depender de worker configurado mas não validado.

## 10.8 Drive 5 TB / backup frio
### Estado
**Planejado nos materiais Alpha, mas não validado no runtime atual.**

### Decisão
**Manter como alvo recomendado, não como componente ativo já comprovado.**

---

## 11. Storage e verdade operacional

### 11.1 Mapa canônico de storage
| Camada | Componente | Papel oficial |
|---|---|---|
| verdade operacional | Supabase Postgres | jobs, permissões, perfis, creative items, manifests, logs, memória formal |
| binário quente | Cloudflare R2 | imagens, vídeos, anexos, outputs pesados |
| conhecimento legível | Obsidian | notas, memória humana, referência, documentação viva controlada |
| estado local sensível | agente local legado local / n8n sqlite / caches | runtime local, sessões, memórias próprias, automação local |
| código-fonte | Git/GitHub | verdade do software |
| backup frio | Drive ou storage equivalente | snapshots, arquivamento, restore |

### 11.2 Regra forte
Nenhum destes deve invadir a função do outro:

- Obsidian não é banco transacional;
- R2 não define permissão;
- Git não é banco operacional;
- n8n sqlite não é verdade do produto;
- agente local legado local não é fonte global de autorização;
- stubs não são persistência.

### 11.3 O que precisa ser registrado em manifests
Todo artefato importante de IA deve poder apontar para:
- dono;
- origem;
- job_id;
- prompt_hash;
- provider/model;
- custo estimado;
- risco/IP status;
- URI do artefato.

---

## 12. Fluxos canônicos pré-estabelecidos

## 12.1 Fluxo de criação e IA
```text
UI
  -> valida PermissionGate
  -> API/server action valida permissão
  -> grava draft em Supabase
  -> cria ai_job
  -> Worker consome
  -> Controlador de custos valida orçamento
  -> selector escolhe provider/modelo
  -> resultado vai para Supabase + R2
  -> status volta para UI
  -> auditoria registra
```

### Regras
- draft, pending, processing, completed, failed, retrying, cancelled, zombie são estados oficiais;
- request web nunca executa trabalho longo;
- cada job tem `idempotency_key`, `correlation_id`, `policy_version`, `schema_version`.

## 12.2 Fluxo de mídia
```text
UI/API
  -> valida tipo/tamanho/ownership
  -> upload via gateway oficial
  -> binário em R2
  -> metadado + permission em Supabase
  -> artifact manifest vincula uso
```

## 12.3 Fluxo de automação n8n
```text
UI/API
  -> Adaptador Oficial n8n
  -> assinatura/token/idempotência
  -> n8n local ou cloud
  -> callback/webhook autenticado
  -> event log / audit
```

## 12.4 Fluxo de Obsidian
```text
UI/API
  -> Adaptador Oficial Obsidian
  -> auth + permission
  -> modo REST ou filesystem controlado
  -> vault allowlisted
  -> log + referência cruzada
```

## 12.5 Fluxo de decisão crítica / júri
```text
risco detectado
  -> bloqueio preventivo
  -> abertura de jury_case
  -> coleta de pareceres/agentes
  -> juízes auxiliares / controlador central
  -> decisão
  -> execução ou manutenção do bloqueio
  -> precedente/memória
```

## 12.6 Fluxo de deploy
```text
branch protegida
  -> PR
  -> CI (typecheck, lint, build)
  -> preview coerente
  -> checklist manual
  -> produção
  -> incident note se falhar
  -> rollback previsível
```

---

## 13. Segurança, governança e regras reforçadas

### 13.1 Regras que viram lei operacional
1. **Sem hardcode de endpoint externo pessoal em código de produção.**
2. **Sem admin por e-mail hardcoded.**
3. **Sem escrita arbitrária em disco local a partir de rota pública.**
4. **Sem Service Role fora de server/worker controlado.**
5. **Sem feature congelada no fluxo vivo.**
6. **Sem nome oficial ambíguo.**
7. **Sem múltiplas fontes de verdade para a mesma integração.**
8. **Sem saída de IA executada sem validação.**
9. **Sem job longo em request síncrona.**
10. **Sem preview “verde” enganando teste crítico.**
11. **Sem aprendizado/memória promovido sem trilha de auditoria.**
12. **Sem publicação automática no pré-Alpha.**

### 13.2 Tripla proteção obrigatória
Para qualquer ação sensível:
- UI gate;
- server check;
- RLS ou regra equivalente no dado.

### 13.3 Menor privilégio
Cada adaptador, worker, agente e integração precisa ter:
- escopo próprio;
- chave própria;
- logs próprios;
- revogação independente.

### 13.4 Modo degradado
Modo degradado pode existir, mas:
- precisa ser explícito;
- não pode fingir persistência;
- não pode se comportar como produção;
- deve estampar estado degradado na UI e nos logs.

---

## 14. O que manter, o que congelar, o que remover, o que substituir

## 14.1 Manter
| Item | Motivo |
|---|---|
| Next.js + TypeScript + Tailwind | base coerente e saudável |
| Supabase com RBAC/RLS | direção correta de autorização |
| ai_jobs + worker model | padrão correto para IA assíncrona |
| R2 para mídia | boa separação entre metadado e binário |
| PermissionGate triplo | princípio correto do produto |
| Void/Amber | identidade visual útil e controlável |
| Nodes/constelações como visual de dado real | conceito válido se dirigido por dados |
| publicação manual | reduz risco no pré-Alpha |

## 14.2 Congelar
| Item | Motivo |
|---|---|
| visual próprio de cada IA | polui a V1/pré-Alpha |
| gamificação visual (XP/rank/cards) | fora do núcleo operacional |
| pets | fantasia sem ganho operacional |
| simulação avançada | alto ruído e risco |
| Overlord/Nazarick como estrutura ativa | conflita com arquitetura funcional atual |
| auto-publicação | risco alto demais agora |
| world items/poderes especiais | governança ainda imatura |

## 14.3 Remover ou quarentenar
| Item | Motivo |
|---|---|
| `testes do CRACRUDO/` | duplicado legadão e ruído |
| HTMLs/export antigos (`preview*.html`, `production-home.html`, `standalone-audit.html`) | resíduos não canônicos |
| scripts/local-agent-legacy inexistentes referenciados em menu/tarefas | automação fantasma |
| remote `yggnarok-cursor` inválido | ruído operacional |
| worktree órfão `agents/ola-mundo` | ruído operacional |
| `supabase/.temp/*` versionado | exposição de metadado operacional |
| workflow n8n do repo sem uso confirmado | manter só se virar oficial; senão mover para legacy |

## 14.4 Substituir
| Item atual | Substituição |
|---|---|
| `/api/n8n` hardcoded | adaptador com env, assinatura e modo explícito |
| `/api/obsidian` com write direto | adaptador com allowlist, auth, audit e modo |
| admin agente local legado por e-mail | permissão formal por RBAC |
| path absoluto em PowerShell | resolução relativa via `$PSScriptRoot` |
| nome solto agente local legado/orquestrador | nomes funcionais oficiais |
| “vinculativos” | vínculos de contexto / memberships / node relations |

---

## 15. Arquivos e pontos de código que exigem mudança imediata

### 15.1 Classe A — corrigir agora
| Arquivo/local | Problema | Ação |
|---|---|---|
| `src/app/api/n8n/route.ts` | webhook cloud hardcoded | trocar por env + assinatura + modo |
| `src/app/api/obsidian/route.ts` | gravação direta em disco | encapsular em adaptador seguro |
| `src/server/local-agent-legacy/permissions.ts` | admin por e-mail hardcoded | migrar para RBAC/permission key |
| `src/server/actions/profiles.ts` | conflita com bootstrap | alinhar com fluxo de setup |
| `supabase/migrations/202605230002_allow_initial_profile_create.sql` | bootstrap especial implícito | revisar com fluxo explícito |
| `supabase/migrations/202605260001_tighten_role_permission_separation.sql` | altera regra efetiva de permissão | revisar conjunto com server action |
| `scripts/menu.ps1` | path absoluto e referências mortas | corrigir ou reescrever |
| `scripts/start-n8n.ps1` | path absoluto + credencial hardcoded | corrigir e remover segredo |
| `scripts/war-room.ps1` | path absoluto antigo | corrigir |
| `src/lib/permissions/index.ts` | log indevido de contexto de permissão | remover |

### 15.2 Classe B — revisar e decidir
| Arquivo/local | Ação recomendada |
|---|---|
| `.vercel/project.json` | decidir se fica versionado |
| `n8n-webhook-yggnarok.json` | promover a oficial ou mover para legacy |
| `src/services/integrations/n8n.ts` | revisar se permanece stub visível |
| `src/services/integrations/obsidian.ts` | revisar se permanece stub visível |
| `src/server/local-agent-legacy/runtime.ts` | formalizar dependência externa ou remover acoplamento |
| `worker/agents/local-agent-legacy-chat.ts` | renomear e documentar papel real |
| ausência de `src/app/api/local-agent-legacy/jobs/route.ts` e de `src/app/api/jobs/chat/route.ts` | decidir contrato, implementar a rota canônica e só então remover a referência legada do dossiê |
| `.vscode/tasks.json` e scripts agente local legado faltantes | atualizar ou limpar |
| `.git/config` remotes/worktrees | saneamento operacional |

### 15.3 Classe C — remover/quarentenar
| Item | Ação |
|---|---|
| `testes do CRACRUDO/` | mover para `legacy/` fora do repo ou apagar |
| HTMLs exportados na raiz | mover para `scratch/exports` ou apagar |
| metadados transitórios do Supabase | remover do Git |
| assets/notes sem owner claro | classificar antes de manter |

---

## 16. Exemplos de mudança limpa

## 16.1 Exemplo 1 — `/api/n8n`
**Errado hoje:** endpoint fixo pessoal no código.
**Certo no pré-Alpha:**

```ts
const mode = process.env.N8N_MODE ?? "disabled";
const webhookUrl = process.env.N8N_WEBHOOK_URL;
const webhookToken = process.env.N8N_WEBHOOK_TOKEN;

if (mode === "disabled") return 503;
requirePermission("automation.trigger");
validatePayload(input);
signAndSend(webhookUrl, webhookToken, payload, idempotencyKey);
audit("n8n.trigger", actorId, payloadMeta);
```

## 16.2 Exemplo 2 — `/api/obsidian`
**Errado hoje:** rota escreve em vault default local diretamente.
**Certo no pré-Alpha:**

```ts
const mode = process.env.OBSIDIAN_MODE ?? "disabled";
const vaultRoot = process.env.OBSIDIAN_VAULT_ROOT;

requirePermission("knowledge.write");
assertAllowedPath(vaultRoot, relativePath);
writeViaAdapter({ mode, vaultRoot, note, actorId });
audit("obsidian.write", actorId, { relativePath });
```

## 16.3 Exemplo 3 — PowerShell relativo
**Errado hoje:** caminho fixo para pasta antiga.
**Certo no pré-Alpha:**

```powershell
$RepoRoot = (Resolve-Path "$PSScriptRoot\..").Path
Set-Location $RepoRoot
```

## 16.4 Exemplo 4 — permissão do agente local legado local
**Errado hoje:** e-mails hardcoded.
**Certo no pré-Alpha:**

```ts
return hasPermission(context, "system.local_sensitive.execute");
```

---

## 17. O que não precisa ser feito agora

### 17.1 Não precisa no pré-Alpha
- tematizar todos os agentes;
- operacionalizar 300+ itens do inventário;
- criar visual antropomórfico para IA;
- reativar simulador, pets, XP, rank, cards;
- introduzir auto-publicação;
- inventar novos domínios sem dono;
- espalhar model selector por toda a app;
- transformar Obsidian em core transacional;
- manter 3 topologias paralelas de n8n;
- manter 2 ou mais vaults concorrendo como oficiais;
- abrir novas features antes de fechar governança, env e fluxo de job.

### 17.2 O que precisa continuar simples
- produção manual;
- painel de saúde objetivo;
- acervo útil com metadado de ação;
- diretoria IA baseada em dados reais;
- naming funcional;
- número de serviços centrais contido.

---

## 18. Implementações urgentes e ordem correta

## 18.1 Bloqueadores de pré-Alpha (P0)
1. decidir a topologia oficial de desenvolvimento: `Supabase local suportado` ou `desenvolvimento remoto controlado`;
2. decidir a topologia oficial de n8n;
3. decidir o vault oficial do Obsidian;
4. remover hardcodes de endpoint, e-mail admin e credencial em script;
5. corrigir bootstrap de perfil;
6. corrigir paths absolutos de scripts;
7. remover/quarentenar resíduos grandes;
8. endurecer GitHub e CI;
9. padronizar contratos de job, webhook, logs e audit.

## 18.2 Próximos 7 dias
- branch protection em `main`;
- CI mínimo;
- `.gitignore` e saneamento de metadados transitórios;
- adaptador oficial n8n;
- adaptador oficial Obsidian;
- saneamento agente local legado;
- endpoint de health;
- tabela formal de `ai_jobs`, `job_events`, `audit_logs`, `artifacts_manifest`, `jury_cases` se ainda não estiverem coerentes;
- remover Bunker/stub enganoso ou deixá-lo explicitamente isolado.

## 18.3 Próximos 30 dias
- ledger de custo;
- allowlist de modelos por classe;
- restore drill;
- replay/DLQ para jobs;
- painel operacional de IA com custo/status/model/provider;
- revisão RLS ponta a ponta;
- registry de prompts, assets e políticas;
- runbook de incidentes dentro do repo.

## 18.4 Próximos 90 dias
- memória auditável com precedentes;
- júri técnico realmente funcional;
- backup frio e testes de restauração;
- score/rubrica por agente;
- adaptação do inventário 300+ para catálogo curado, não arquitetura ativa;
- eventual entrada de gateway central de modelos mais robusto, se a operação justificar.

---

## 19. Coisas que faltaram antes e agora ficam explícitas

### 19.1 Pontos que o Antigravity deixou fracos ou incompletos
- runtime local real do n8n fora do repo;
- natureza oficial do vault Obsidian;
- superfície real de permissões locais do agente local legado;
- drift entre repo, schedulers e workspace;
- diferenciação limpa entre stubs, rotas reais e automação ativa;
- governança de GitHub/Vercel em profundidade;
- storage/dispersão local sensível;
- saneamento de nomenclatura.

### 19.2 Pontos que estavam confusos no pacote Alpha
- uso de nomes míticos cedo demais;
- inventário máximo tratado perto demais da arquitetura viva;
- contagem divergente entre narrativa 303 e CSV 328;
- mistura entre itens core, alternativas, anti-padrões e banco de possibilidades.

### 19.3 Decisão desta versão
No pré-Alpha V2.0:
- o **nome funcional** vira oficial;
- o **inventário expandido** vira apêndice consultivo;
- a **arquitetura viva** fica limitada ao núcleo ativo;
- o **runtime atual** passa a ser explicitamente rotulado por estado.

---

## 20. Discrepâncias documentais encontradas

### 20.1 303 vs 328 itens
O pacote Alpha narra um catálogo de **303 itens**, mas o CSV extraído contém **328 linhas**.
A leitura mais segura é:

- **303** = subconjunto narrativo/curado citado no plano;
- **328** = inventário bruto incluindo alternativas, anti-padrões, legados e itens não ativos.

**Decisão:** usar o inventário apenas como banco de possibilidades, não como arquitetura.

### 20.2 MOMONGA/Admin vs RBAC real
Os dossiês de 02/06 fixam MOMONGA/Admin como autoridade máxima.
A auditoria do código confirma RBAC técnico por roles.
**Decisão:** manter MOMONGA/Admin como camada humana de soberania; RBAC formal continua no banco.

### 20.3 agente local legado/orquestrador vs arquitetura funcional
O pacote Alpha ainda usa nomes legados como referência.
**Decisão:** manter apenas como alias de transição.

---

## 21. Veredito final por área

| Área | Veredito |
|---|---|
| stack base | correta |
| arquitetura atual | útil, mas fraturada |
| autenticação/autorização | base correta, implementação incompleta |
| integrações locais | poderosas, porém sem governança suficiente |
| storage | conceito correto, execução dispersa |
| UI/design | boa direção, sem prioridade sobre segurança |
| modelo de jobs | correto e deve ser preservado |
| nomenclatura | precisa saneamento urgente |
| documentação | rica, porém dispersa e por vezes conflitante |
| risco operacional | alto, mas controlável com reorganização curta e dura |

---

## 22. Síntese provisória de encerramento

A partir deste documento, o YGGNAROK deve ser tratado assim:

- **um sistema operacional criativo-operacional distribuído;**
- **com autoridade humana explícita;**
- **com plano de controle separado do plano de execução;**
- **com Supabase como autoridade de dados e acesso;**
- **com R2 como binário quente;**
- **com integrações locais encapsuladas em adaptadores;**
- **com nomenclatura funcional oficial;**
- **com inventário expandido tratado como banco de possibilidades, não como realidade ativa;**
- **com publicação manual como padrão;**
- **com segurança, custo, auditoria e reversibilidade acima de fantasia, improviso e nostalgia.**

Se este documento conflitar com material antigo, o material antigo deve ser marcado como:
`legacy`, `frozen`, `removed`, `historical` ou `pending validation`.

---

## Apêndice A — Source map resumido
- Auditoria atual: Codex pt1, pt2, pt3.
- Diagnóstico forense: Antigravity.
- Base operacional: dossiês 00–12 de 02/06/2026.
- Arquitetura-alvo e inventário: Documento Mestre Alpha + plano operacional implementável.

## Apêndice B — Lista curta de itens de prova forte
- `src/app/api/n8n/route.ts`
- `src/app/api/obsidian/route.ts`
- `src/server/local-agent-legacy/permissions.ts`
- `src/server/local-agent-legacy/runtime.ts`
- `src/server/actions/profiles.ts`
- `supabase/migrations/202605210001_ygn_v1_base.sql`
- `supabase/migrations/202605230002_allow_initial_profile_create.sql`
- `supabase/migrations/202605260001_tighten_role_permission_separation.sql`
- `scripts/menu.ps1`
- `scripts/start-n8n.ps1`
- `scripts/war-room.ps1`
- `.vercel/project.json`
- `supabase/.temp/*`
- `n8n-webhook-yggnarok.json`
- `worker/agents/local-agent-legacy-chat.ts`
- referência histórica a `src/app/api/local-agent-legacy/jobs/route.ts` no dossiê, embora o arquivo não exista no snapshot atual

## Apêndice C — Linha vermelha do pré-Alpha
**Nada novo entra antes de:**
- governança de branches;
- topologia oficial de n8n/Obsidian;
- bootstrap de perfil corrigido;
- hardcodes removidos;
- stubs/Bunker reduzidos a modo explícito;
- nomenclatura saneada;
- runbook mínimo publicado.

## Apêndice D — Consolidação histórica de `DOCUMENTO_2_DETALHADO.md`
**Conteúdo consolidado de:** `DOCUMENTO_2_DETALHADO.md`

### D.1 Origem e motivação do projeto
O YGGNAROK nasceu para unificar operação, conteúdo, perfis, vendas, publicação manual assistida, jobs de IA e relatórios básicos em uma única plataforma.

### D.2 Linha do tempo arquitetural consolidada
- **2026-05-21 — Fundação:** base de banco com `roles`, `permissions`, `profiles`, `profile_members`, `content_items`, `media_assets`, `library_items`, `ai_jobs`, `manual_posting_queue`, `audit_logs` e `health_logs`.
- **2026-05-21 — Segurança inicial:** RLS habilitado, funções de permissão e triggers de `updated_at`.
- **2026-05-21 — IA inicial:** fluxo simples de `ai_jobs` com worker, retry e recuperação de jobs zumbis.
- **2026-05-23 — Expansão:** ajustes de permissão para criação inicial de perfis e índices de performance.
- **2026-05-25 — Conselho de IA:** mudança para arquitetura multiagente com supervisor, aprendizagem e auditoria.
- **2026-05-25 — Memória persistente:** introdução de tabelas para candidatos de memória, vetor, custo e automações.
- **2026-05-29 — Design system:** consolidação estética funcional com base âmbar/creme/stone.
- **2026-06 em diante — Integrações:** formalização de adaptadores, automação e fronteiras operacionais.

### D.3 Valor preservado
O conteúdo detalhado de SQL, fases e decisão histórica permanece como referência de origem no arquivo legado arquivado para rastreabilidade.

## Apêndice E — Consolidação de `YGGNAROK_INTEGRATION_MAP.md`
**Conteúdo consolidado de:** `YGGNAROK_INTEGRATION_MAP.md`

### E.1 Mapa canônico de integrações
| Serviço | Endereço / Forma | Papel canônico | Status baseline |
|---|---|---|---|
| Next.js App | `http://localhost:3000` | Interface principal do YGGNAROK | ativo quando em execução |
| Supabase | remoto / local conforme env | Banco, auth e RLS | autoridade de dados |
| Cloudflare R2 | via env | storage binário e mídia | ativo como storage quente |
| n8n | endpoint externo/VPS via `N8N_WEBHOOK_URL` | automação e webhooks | não administrar localmente |
| ComfyUI | `http://127.0.0.1:8188` | geração de imagem local | opcional / dependente do ambiente |
| Ollama | `http://localhost:11434` | modelos locais e tool calling | disponível apenas se rodando |
| Msty Proxy | `http://localhost:10000/v1` | proxy compatível com OpenAI | ponte local opcional |
| Obsidian | vault oficial pausado | memória externa / documentação | não ativo no baseline local |
| War Room | removido do baseline | monitoramento legado | legado arquivado |

### E.2 Contratos e fronteiras
- Integração sem `env` configurada não é integração válida.
- n8n só entra por endpoint externo/VPS, nunca como bootstrap implícito local.
- Memória externa e War Room permanecem pausados/legados até nova decisão formal.
- Qualquer fluxo novo deve registrar contrato, credencial, owner e modo antes de sair do legado.