# 🌌 MAPA DE INTEGRAÇÃO NEURAL: YGGNAROK V1
> **Documento de Auditoria e Arquitetura de Colaboração Multi-Agente**  
> **Data:** 2026-06-02  
> **Versão:** 1.0 (Comando Supremo)

Este relatório descreve detalhadamente o ecossistema de ferramentas, softwares, bancos de dados, modelos de IA e scripts configurados para colaborar e dar vida ao **YGGNAROK**. A arquitetura foi desenhada sob a filosofia de ser **100% autônoma, local-first (sem custos) e resiliente**.

---

## 🗺️ 1. DIAGRAMA DE ARQUITETURA E FLUXO DE DADOS

O ecossistema divide-se em três camadas principais: **Operação Local (Offline/GPU)**, **Orquestração de Código/Ambiente** e a **Interface Next.js (YGGNAROK)**.

```mermaid
graph TD
    subgraph Camada de Desenvolvimento [VS Code & Antigravity]
        VSCode[VS Code Workspace]
        AntiG[Antigravity IA / Gemini 3.5]
    end

    subgraph Camada de Monitoramento [War Room]
        WarRoom[war-room.ps1 Dashboard]
        LogErr[dev.err.log / tsc compile errors]
    end

    subgraph Provedores de IA Local [Ollama, Msty & LM Studio]
        Ollama[Ollama :11434]
        Msty[Msty API Proxy :10000]
        LMStudio[LM Studio API]
    end

    subgraph Automação e Gráficos [n8n, ComfyUI & LobeChat]
        n8n[n8n Workflow Engine :5678]
        Comfy[ComfyUI Image Gen :8188]
        Lobe[LobeHub Chat Interface]
    end

    subgraph Banco, Nuvem e Documentação [Supabase, Cloudflare & Obsidian]
        Supa[Supabase Database & Auth]
        R2[Cloudflare R2 Storage]
        Obsidian[Obsidian Vaults: Admin/User]
    end

    %% Relações e Fluxos
    VSCode -->|Gera logs e código| LogErr
    WarRoom -->|Monta painel visual| WarRoomDash[War Room Dashboard :3333]
    
    AntiG -->|Manipula código e design| VSCode
    
    VSCode -->|Invoca geração de imagem via @img| Comfy
    Comfy -->|Salva PNG gerado por GPU local| R2
    
    YGG[Next.js App / YGGNAROK] -->|Ingere dados via Canvas Node| n8n
    YGG -->|Exporta nós Markdown| Obsidian
    YGG -->|Conexão e Permissões RLS| Supa
    
    Lobe -->|Proxy local| Msty
```

---

## 🛠️ 2. MAPEAMENTO MINUCIOSO DE COMPONENTES E PROGRAMAS

### 2.1. O PROVEDOR DE IA E ASSISTENTE: ANTIGRAVITY (Você)
*   **Papel:** Agente de IA operando no VS Code do usuário.
*   **Integração:** 
    *   Tem visibilidade total dos arquivos abertos, cursor, terminal e status de compilação.
    *   Possui capacidade de propor e executar scripts PowerShell (como `war-room.ps1` ou `start-n8n.ps1`).
    *   Carrega a skill de design de alta fidelidade `@huashu-design` para construir telas orientadas à estética **Seinen/Otaku Premium** (Void & Amber), aplicando os protocolos de assets e animações.

### 2.2. O GATEWAY INTERNO: OPENCODE
*   **Papel:** Cliente desktop que atua como orquestrador multi-agente centralizado e ponte de comunicação entre a extensão e o ecossistema YGGNAROK.
*   **Integração:**
    *   Gerencia o ambiente local e se comunica via chamadas RPC para verificar a integridade da fila de jobs do Supabase.

### 2.3. OS PROVEDORES DE MODELOS LOCAIS: OLLAMA, MSTY E LM STUDIO
Para economizar em custos de API e garantir operação offline, as chamadas de IA do projeto são distribuídas em cascata:
*   **Ollama (Porta `11434`):**
    *   Hospeda localmente os modelos `qwen3:8b` (para chamadas rápidas e tool calling dos agentes), `qwen2.5-coder` (em versões de 3b, 7b e 14b para geração de código) e `nomic-embed-text` (para geração de embeddings locais).
*   **Msty (Porta `10000`):**
    *   Atua como servidor proxy local com formato compatível à API da OpenAI.
    *   Serve como ponte para que ferramentas como o Lobe Chat se conectem com as GPUs locais da máquina.
*   **LM Studio:**
    *   Configurado como provedor alternativo para o carregamento de LLMs de desenvolvimento de grande escala.

### 2.4. O MOTOR DE IMAGEM NEURAL: COMFYUI
*   **Papel:** Geração local de assets visuais sem a necessidade de APIs pagas como Midjourney.
*   **Integração:**
    *   O ComfyUI é integrado na porta `8188` para renderizar imagens de alta fidelidade via GPU local, ajudando na geração automática de assets visuais para a plataforma.
    *   **Modelo Utilizado:** Utiliza o modelo **Anything V5** (anime retro / cell-shaded style) para manter a identidade visual Otaku/Seinen.

### 2.5. A INTERFACE DE DESIGN E CHAT: LOBEHUB (Lobe Chat)
*   **Papel:** Playground conversacional para testar agentes e debater arquiteturas de design.
*   **Integração:**
    *   Conecta-se na porta `:10000` do Msty para usar modelos locais gratuitos.
    *   Configurado com a persona personalizada:
        *   🏮 `Huashu-Art-Director.json` (focado na curadoria visual Seinen/Void & Amber).

### 2.7. A AUTOMAÇÃO DE FLUXOS: n8n (`start-n8n.ps1`)
*   **Papel:** Ingestão de conteúdo de mídia, sync de dados e webhooks externos.
*   **Integração:**
    *   **Autenticação e Inicialização Automática:** O script `scripts/start-n8n.ps1` mata processos fantasmas do Node, inicia o n8n na porta `5678`, cria a conta do proprietário administrativo (`admin@yggnarok.local` / `Yggnarok123!`), importa e ativa o workflow `n8n-webhook-yggnarok.json` ("YGGNAROK - Agente de Ingestão") e testa a comunicação do webhook `http://127.0.0.1:5678/webhook/yggnarok-hub`.
    *   **Integração com Canvas:** O componente React `YggNexusCanvas.tsx` dispara dados de nós (nodes) criados no editor gráfico diretamente para os webhooks do n8n para deploy e scraping de mídia.

### 2.8. A BASE DE CONHECIMENTO CÉLULA: OBSIDIAN
*   **Papel:** Repositório local de notas, grimórios operacionais e documentação offline da equipe.
*   **Integração:**
    *   **Arquitetura Dual-Vault (Admin & User):** Configurado em `src/services/integrations/obsidian.ts` com caminhos de vaults separados para o Administrador (vault central de controle) e Usuários (vault pessoal).
    *   **Exportador Markdown:** Quando o usuário clica em "Obsidian" no painel ou no inspector do `YggNexusCanvas`, o YGGNAROK roda o módulo `markdownBuilders.ts` para converter o nó do canvas em um documento Markdown formatado com metadados (YAML frontmatter) e salva diretamente no diretório do Obsidian.

### 2.8. O MONITOR VISUAL: WAR ROOM DASHBOARD (`war-room.ps1` & `dashboard-server.ps1`)
*   **Papel:** Painel tático ao vivo para monitoramento de todos os processos e serviços.
*   **Integração:**
    *   O script `scripts/war-room.ps1` roda testes de ping e listeners ativos de rede. Ele varre as portas de rede locais para verificar o status de: Ollama (11434), n8n (5678), Next.js (3000) e o próprio Dashboard (3333).
    *   Roda também `npm run typecheck`, `npm run lint` e `npm run build`.
    *   Gera um arquivo de status de saúde (`.hermes-daemon/orchestra/state.json`) e renderiza um dashboard HTML cibernético (`dashboard.html`), que é servido localmente em `http://localhost:3333` por um script HTTP PowerShell (`dashboard-server.ps1`).

### 2.10. O SUPORTE DE HISTÓRICO PERSISTENTE: `run-ia.ps1`
*   **Papel:** Isolamento e persistência das conversas da IA nos terminais de comando.
*   **Integração:**
    *   Cria e lê arquivos JSON na pasta `/memory` usando um `sessionId` único gerado com timestamp (ex: `session_YYYYMMDD_HHMMSS_<random>`).
    *   Toda vez que você digita no terminal, ele anexa o histórico ao JSON antes de iniciar a execução da IA, permitindo retomar discussões passadas a qualquer momento via parâmetro `-sessionId`.

### 2.11. CODEX (Legado das IAs)
*   **Papel:** A base histórica de conhecimento compilada e consolidada de assistentes anteriores (Gemini, Claude, OpenCode).
*   **Integração:**
    *   Suas decisões arquiteturais e design systems de sessões passadas foram consolidadas nos arquivos `AGENTS.md`, `DESIGN.md` e `AI_ARCHITECTURE.md`, servindo como a "memória de longa duração" que impede os novos modelos de repetir erros antigos.

---

## 🔐 3. RESUMO DE CREDENCIAIS E LOCALIZAÇÃO DE ENDPOINTS

| Serviço | URL / Endpoint Local | Arquivo de Configuração Principal | Credenciais / Métricas padrão |
| :--- | :--- | :--- | :--- |
| **Next.js App** | `http://localhost:3000` | `src/app/` | Porta `:3000` |
| **War Room** | `http://localhost:3333` | `scripts/war-room.ps1` | Porta `:3333` |
| **Ollama** | `http://localhost:11434` | `worker/agents/provider.ts` | Modelos: Qwen2.5-Coder, Nomic-Embed |
| **Msty Proxy** | `http://localhost:10000/v1` | `worker/agents/provider.ts` | Key fake: `msty` |
| **n8n Automation** | `http://127.0.0.1:5678` | `scripts/start-n8n.ps1` | `admin@yggnarok.local` / `Yggnarok123!` |
| **ComfyUI API** | `http://127.0.0.1:8188` | Configuração local | Porta `:8188` |
| **Obsidian Vaults**| Local Filesystem | `src/services/integrations/obsidian.ts`| Variáveis env: `OBSIDIAN_ADMIN_VAULT_PATH` |

---

## 🦾 4. COMO ELES COOPERAM PARA DAR VIDA AO YGGNAROK

Imagine o seguinte fluxo de trabalho diário no desenvolvimento e operação:

1. **Desenvolvimento no VS Code (VS Code + Antigravity):**
   Você cria e desenvolve componentes no ambiente de desenvolvimento, enquanto o Antigravity ajuda a refinar a lógica de Next.js/TypeScript e a estética de design Void & Amber.
2. **Criação de Conteúdo & Visual (Next.js + ComfyUI):**
   Dentro da tela de Criação do YGGNAROK, prompts de imagens são enviados localmente para a GPU do ComfyUI, que gera e injeta os assets PNG diretamente no ecossistema.
4. **Exportação e Deploy (Next.js + n8n + Obsidian):**
   Você abre o **Agent Node Studio (YggNexusCanvas)**, arrasta blocos para estruturar uma automação de vendas. 
   Ao clicar em "Exportar", os dados vão em Markdown para o seu **Obsidian** (para arquivamento offline e documentação interna) e, ao mesmo tempo, acionam uma série de webhooks no **n8n** na porta `:5678` para executar chamadas de automação externas.
5. **Monitoramento (War Room Dashboard):**
   Tudo isso rodando de forma estável é validado a cada 5 minutos pelo script da Sala de Guerra, mostrando no painel `http://localhost:3333` se algum serviço (como Ollama, n8n ou o próprio Next.js) caiu e precisa de reinicialização.
