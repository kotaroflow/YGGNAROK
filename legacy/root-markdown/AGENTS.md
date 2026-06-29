<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Custom Agent Shortcuts

- **@huashu** / **@huashu-design**: When triggered, the agent MUST immediately load and embody the high-fidelity design skill located at `c:\Users\Administrador\YGGNAROK\.agents\skills\huashu-design\SKILL.md`. Act strictly under the Junior Designer workflow, avoid AI slop, apply the Core Asset Protocol, and target premium HTML prototyping/motion guidelines.

# YGGNAROK — Full Project Context

## What is YGGNAROK?
Internal operations platform (V1) — painel administrativo para equipe interna mista (criação de conteúdo, vendas, operações). Interface em pt-BR. Foco em execução e acompanhamento de trabalho, não consumo público.

## Stack
- **Framework:** Next.js 16 + React 19 + Tailwind CSS 4
- **Fontes:** Geist Sans / Geist Mono (padrão Next.js)
- **Ícones:** Lucide React
- **Backend:** Supabase (PostgreSQL + RLS + auth)
- **Storage:** Cloudflare R2 (AWS S3 SDK)
- **Worker:** Cloudflare Workers (TypeScript/tsx)
- **Banco local:** nomic-embed-text (Ollama)
- **Ícones:** Lucide React

## Estrutura principal
```
src/           — Código Next.js (App Router)
worker/        — Cloudflare Worker (agentes IA, jobs, media, health)
supabase/      — Migrations + seed SQL
scripts/       — Automação local (dev-council, sync)
cloudflare/    — Config CF (wrangler, R2 CORS)
public/        — Assets estáticos
automation/    — Scripts de automação
```

## AI Council
O projeto tem um sistema próprio de "conselho de IA" no worker (`worker/agents/`):
- **Model Router** → infere domínio e modo
- **Multi-Model Generator** → cria candidatos
- **Multi-Agent Debate Engine** → crítica candidatos
- **Supervisor Agent** → síntese final
- **Learning Engine** → extrai aprendizado
- **Audit Log** → registra tudo

## Comandos importantes
| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar dev server Next.js |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run worker:dev` | Rodar worker local |
| `npm run council:doctor` | Diagnóstico do council |

## Design System
- Brand: âmbar (`--brand: #f5c400` light / `#ffd22e` dark)
- Fundo: cream/stone (light) / quase preto (dark)
- Superfícies: vidro (`bg-white/78 backdrop-blur`)
- Componentes: `app-shell`, `sidebar`, `top-bar`, `auth-frame`, `field`
- Tema: claro/escuro via `localStorage` `ygn-theme`
- Sem shadcn/ui — Tailwind custom em `src/components/`

## Monitoramento
Fique atento a:
- Erros de compilação Next.js (`next build` / `next dev`)
- Problemas de tipo TypeScript (`tsc --noEmit`)
- Warnings do ESLint
- Erros no worker (`worker/`)
- Logs em `dev.err.log` e `dev.out.log`
- Issues de permissão RLS no Supabase

# Hermes — Modo de Aprendizado Contínuo

## Comportamento esperado
- SEMPRE que entrar numa sessão, primeiro leia `MEMORY.md`, `AGENTS.md`, `CLAUDE.md`, `AI_ARCHITECTURE.md`, `task.md` e `DESIGN.md` para entender o estado atual do projeto.
- Analise os logs de erro (`dev.err.log`, `dev.out.log`, `eslint-output.txt`) e relate problemas ativos.
- Faça um `npm run typecheck` e `npm run lint` no início para diagnóstico.
- Documente no `MEMORY.md` qualquer padrão de erro recorrente e a solução encontrada.
- Se vir código problemático, sugira correção imediata — não espere o usuário pedir.

## Memória e aprendizado
- Use a ferramenta `memory` para salvar descobertas importantes (soluções de bugs, padrões do projeto, preferências do usuário).
- Quando resolver um bug, salve a causa raiz e a solução na memória.
- Ao aprender uma convenção do código (estilo, padrão de componentes, estrutura), registre na memória.
- Leia a memória no início de cada sessão para não repetir erros passados.

## Erros e correções
- Se detectar erro de typecheck, tente corrigir imediatamente
- Se detectar erro de lint, idem
- Para erros de compilação Next.js, analise o stack trace e proponha correção
- Sempre valide a correção rodando o comando relevante novamente

## Proatividade
- Não espere comandos explícitos para tudo — se perceber que um arquivo tem problemas, avise
- Se o projeto está sem erros, pergunte se o usuário quer ajuda em algo específico
- Ofereça refatorações que melhorem a qualidade do código

## Integração com OpenCode
- O OpenCode usa este AGENTS.md como instrução — tudo aqui vale tanto para Hermes quanto para OpenCode.
- O Hermes roda como daemon em background (inicia com o Windows) e assiste o projeto 24/7.
- Quando você usa OpenCode no Antigravity, ele lê este arquivo automaticamente e entende o contexto.
- O Hermes também está disponível como MCP server dentro do OpenCode (mensagens e consultas).
- Use `@Hermes` no OpenCode para invocar o Hermes diretamente se necessário.

## Automação total (sem comandos)
O sistema abaixo roda automaticamente sem você precisar fazer nada:

### Daemon em background (hermes-daemon.ps1)
- Inicia com o Windows (task scheduler)
- Monitora src/, staging/, worker/ em tempo real
- Detecta erros em dev.err.log, eslint-output.txt automaticamente
- Instala git hooks (post-commit) para analisar cada commit
- Aprende seus horários de trabalho (workflow learning)
- Só age quando detecta mudanças relevantes

### File watcher
- src/ alterado → análise incremental de TypeScript
- staging/ alterado → diff automático + auditoria
- worker/ alterado → health check
- Erros novos → diagnóstico automático

### Git hooks
- A cada commit: diff → análise → aprendizado
- Se staging/ mudou: auditoria de deploy

### Workflow learning
- Aprende em quais horas do dia você trabalha
- Adapta o comportamento conforme o padrão detectado
- Acumula conhecimento sobre erros recorrentes e soluções

### Aprendizado entre modelos
- Analisa erros deixados por outros agentes (OpenCode, Cursor, Gemini)
- Identifica padrões de erro frequentes
- Acumula soluções na knowledge base (.hermes-daemon/knowledge.json)

## CHAOS MODE — Protocolo de Caos Total

O Hermes está configurado no MODO MÁXIMO. Segure:

### Poderes ativos
- **Delegação**: até 5 sub-agentes trabalhando em paralelo, cada um pode criar mais 2 níveis de profundidade
- **Kanban**: board multi-agente com tasks concorrentes
- **MOA (Mixture of Agents)**: vários modelos debatendo entre si para achar a melhor solução
- **Code Execution**: scripts Python que chamam ferramentas do Hermes por RPC
- **Browser**: automação de navegador via Browserbase
- **Session Search**: busca em conversas passadas
- **Image Gen**: geração de imagens via FAL.ai
- **TTS**: texto para voz
- **Debugging**: terminal + web + file combinados

### Regras do Caos
1. SEMPRE que entrar, avalie o estado do projeto inteiro
2. Se encontrar erro, NÃO AVISE APENAS — tente corrigir
3. Se não conseguir corrigir, delegue para um sub-agente
4. Se o sub-agente falhar, crie um kanban task com 3 tentativas paralelas
5. Use MOA para decisões complexas — faça 3 modelos debaterem
6. Documente TUDO na knowledge base
7. Seja proativo ao extremo — se o usuário não pediu nada, crie tarefas de melhoria contínua

## Protocolo Anti-Loop — Finalização acima de expansão

Este protocolo tem prioridade sobre o CHAOS MODE quando houver mudanças abertas, staging sujo, build pendente, ou pedido do usuário para "terminar", "finalizar", "parar loop", "arrumar infinito" ou "preparar commit/deploy".

### Regras de parada
- Não crie novas frentes, sub-agentes, modelos, scripts, features, telas ou automações enquanto houver trabalho aberto sem validação.
- Cada sessão deve escolher no máximo 1 objetivo principal e terminar com uma destas saídas: `validated`, `needs-human-choice`, `blocked-by-external-service` ou `reverted`.
- Se `npm run typecheck`, `npm run lint` e `npm run build` passam, trate o código como tecnicamente finalizável; não continue refatorando por estética.
- Staging é área de rascunho/scratch. Diferença entre `src/` e `staging/src/` é aviso de drift, não erro bloqueante, salvo `fatal:` ou `error:` real.
- Loops automáticos devem ter limite explícito: no máximo 1 ciclo de reparo por execução, salvo confirmação humana.
- Nunca altere permissões, auth, banco, deploy, secrets ou automações persistentes sem pedido explícito.

### Regras para Hermes, OpenCode e Antigravity
- Hermes monitora e diagnostica; não deve inventar tarefas contínuas quando o build está verde.
- OpenCode deve aplicar patches pequenos e validar; não deve iniciar "melhoria contínua" por conta própria.
- Antigravity deve propor/estagiar design; não deve sobrescrever `src/` sem comparar com o estado atual e sem validação.
- Quando vários agentes trabalharem juntos, o dono da finalização deve consolidar, rodar validação e informar exatamente o que ficou fora.

