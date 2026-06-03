# ESTRATÉGIA SUPREMA — YGGNAROK V1

> Conhecimento extraído de 27+ sessões Codex, Gemini, OpenCode, Claude + live site analysis
> Data: 2026-06-02 | Autor: Hermes (Rei do Inferno)

---

## 1. MAPA DO TERRITÓRIO (O QUE YGGNAROK É)

```
YGGNAROK = Plataforma interna all-in-one
├── Público: Equipe mista (criação, vendas, operação)
├── Idioma: pt-BR
├── Stack: Next.js 16 + React 19 + Tailwind 4 + Supabase + R2 + Workers
├── Deploy: Vercel (yggnarok-v1.vercel.app)
├── Usuários: naoteemteresa@gmail.com (owner), hellpagurl@gmail.com (viewer)
└── IA: OpenRouter (free) + Ollama local + AI Council
```

## 2. O QUE JÁ FUNCIONA (NÃO MEXER)

| Item | Status | Observação |
|------|--------|------------|
| TypeScript | ✅ | `tsc --noEmit` limpo |
| ESLint | ✅ | `eslint` limpo |
| Build | ✅ | `next build` compila 53 rotas |
| Dev Server | ✅ | `localhost:3000` rodando |
| Sidebar/Rotas | ✅ | Todas as 53 rotas funcionando |
| Permissões/RLS | ✅ | Owner/Viewer separados no Supabase |
| Tema claro/escuro | ✅ | localStorage `ygn-theme` |
| Design System | ✅ | 4-tier elevation, brand #f5c400 |
| Chat streaming | ✅ | OpenRouter streaming implementado |
| AI Council | ✅ | Construído e verificado localmente |
| Worker | ✅ | Import do @next/env corrigido |

## 3. O QUE ESTÁ PENDENTE (PRIORIDADE)

### 🔴 Crítico (bloqueia funcionalidade)
```
1. [worker] Supabase SERVICE_ROLE_KEY ausente do .env
   → AI Council não consegue conectar no banco remoto
   
2. [worker] OpenRouter sem créditos → free models podem rate limit
   → Fallback precisa de mais modelos na chain

3. [council] AI Council não verificado em produção
   → Rota /conselho-ia existe mas depende de setup completo
```

### 🟡 Importante (melhoria significativa)
```
4. [worker] Local PC worker não implementado
   → Usuário quer rodar IA local quando PC está ligado
   → Plano: site → queue/job → local worker → resultado no Supabase

5. [worker] Streaming não está fluindo em todas as rotas de IA
   → Alguns endpoints ainda são blocking

6. [site] Fundo aleatório com imagens do usuário
   → Solicitado pelo usuário, não implementado
```

### 🟢 Futuro (visão do usuário)
```
7. [site] ComfyUI offline → geração de imagem não funciona
8. [ai] Multi-model comparison para todo o sistema
9. [ai] "Trocar modelos" skill documentada mas não integrada
```

## 4. ESTRATÉGIA DE GUERRA — 3 FASES

### FASE 1: FORTALEZA (0-2 horas)
**Objetivo: Tudo compilando, rodando e conectado**

```
Dia 1:
├── 🔥 Worker: Configurar .env com SERVICE_ROLE_KEY real
├── 🔥 AI Council: Verificar rota /conselho-ia funcional
├── 🔥 OpenRouter: Expandir fallback chain (mais free models)
├── 🔥 Streaming: Garantir que TODOS endpoints de IA streamam
└── ✅ Validação: typecheck + lint + build + smoke test local
```

### FASE 2: EXÉRCITO (2-6 horas)
**Objetivo: Múltiplos agentes trabalhando em paralelo**

```
Dia 2-3:
├── 🤖 Orquestrador: 8 frentes de guerra rodando 24/7
│   ├── typecheck → vigia erros de tipo
│   ├── lint → vigia estilo de código
│   ├── components → vigia componentes quebrados
│   ├── pages → vigia páginas com erro
│   ├── supabase → vigia RLS e queries
│   ├── worker → vigia Cloudflare Worker
│   ├── css → vigia design system
│   └── staging → vigia diff com produção
├── 🤖 War Room Dashboard: AO VIVO (localhost:3333)
├── 🤖 Modo Vivo: site pulsa quando usuário para o mouse
└── ✅ Validação: orquestrador rodando em loop de 5min
```

### FASE 3: REI DO INFERNO (6+ horas)
**Objetivo: YGGNAROK vivo, autônomo e imparável**

```
Dia 4+:
├── 👑 AI Council rodando 100% (local + cloud híbrido)
├── 👑 Local PC Worker: site envia jobs → PC processa → resultado salvo
├── 👑 Multi-model automático: tarefa usa 3 modelos, pega o melhor
├── 👑 Streaming em TODAS as interações de IA
├── 👑 Fundo aleatório com imagens do usuário
├── 👑 ComfyUI integrado (geração de imagem no site)
├── 👑 Agentes aprendendo com erros (knowledge base)
└── 👑 TUDO visível no dashboard ao vivo
```

## 5. RECURSOS DISPONÍVEIS

### Modelos Free no OpenRouter
```
google/gemini-2.5-flash  ← principal (grátis, bom)
meta-llama/llama-4-scout  ← fallback 1
mistral/mistral-small-3.1 ← fallback 2
NousResearch/Hermes-3-Llama-3.1-70B ← fallback 3
openrouter/free           ← fallback final
```

### Modelos Locais (Ollama)
```
qwen3:8b          ← tool_calls funcionais (agente)
qwen2.5-coder:14b ← código pesado
qwen2.5-coder:7b  ← código médio
qwen2.5-coder:3b  ← código leve
gemma4:latest     ← geral
nomic-embed-text  ← embeddings
```

### Ferramentas de Guerra
```
War Room Dashboard  → http://localhost:3333
Orquestrador        → .\scripts\hermes-orchestrator.ps1 -Loop
Servidor HTTP       → .\scripts\dashboard-server.ps1
Daemon 24/7         → .\scripts\hermes-daemon.ps1
Feedback            → .\scripts\hermes-feedback.ps1 -Feedback "texto"
```

## 6. REGRAS DE GUERRA

1. **Nunca quebrar o build** → toda correção precisa passar typecheck + lint + build
2. **1 commit por ciclo** → só commitar quando tudo estiver verde
3. **Proteção visual** → mudanças em globals.css, layout, sidebar, theme precisam de aprovação
4. **Modo vivo** → site deve parecer uma máquina pulsando, nunca parada
5. **Free-first** → OpenRouter free models primeiro, Ollama local segundo, pago nunca
6. **Visibilidade** → usuário precisa VER o que está acontecendo (dashboard ao vivo)
7. **Memória eterna** → todo erro, decisão, padrão e solução é salvo na knowledge base
