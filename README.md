# YGGNAROK / YGN V1

V1 limpa do YGGNAROK para perfis, criação de conteúdo, vendas, biblioteca, postagem manual, jobs assíncronos, mídia no Cloudflare R2, logs e relatórios básicos.

## Stack
- Next.js + TypeScript + Tailwind CSS
- Supabase Auth, PostgreSQL, RLS e Realtime
- Cloudflare R2 para mídia pesada
- Worker TypeScript separado da Vercel
- Vercel para frontend inicial
- Hetzner + Coolify preparado para worker 24/7

## Comandos

```bash
npm run dev
npm run lint
npm run typecheck
npm run worker:once
npm run worker:dev
```

## Variáveis

Copie `.env.example` para `.env.local` no ambiente local e preencha sem commitar segredos reais.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

Frontend usa apenas:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

Worker/backend privado usa service role, R2 e chaves de IA. Nenhuma chave privada deve ir ao frontend.

## Banco

As migrations ficam em `supabase/migrations`. A migration inicial cria tabelas V1, índices, roles, permissões, RLS, funções de permissão e funções de worker para claim/recovery de jobs.

## Worker

O worker fica em `worker/` e processa `ai_jobs` por polling:
1. Recupera zombie jobs.
2. Chama `claim_next_ai_job()` no Postgres.
3. Processa fora da transação.
4. Salva `agent_runs`.
5. Marca o job como `completed`, `pending` ou `failed`.

## Regras V1

- Sem Firebase.
- Sem fragmentos.
- Sem modos MATHEUS, KOTARO ou MOMONGA.
- Sem publicação automática.
- Sem base64 no banco.
- Sem service role ou chaves R2/IA no frontend.

## Persistência de Memória das IAs

Este projeto agora suporta memória persistente por sessão para as IAs iniciadas nos terminais.

### Estrutura de Arquivos
- `memory/` - diretório onde são armazenados arquivos JSON com o histórico de cada sessão.
- Cada sessão recebe um identificador único, por exemplo `session_20240601_183000_1234.json`.

### Como Iniciar uma Sessão
Execute o script `scripts\run-ia.ps1`:
```powershell
.\scripts\run-ia.ps1
```
O script gerará um `sessionId` único e iniciará a IA com essa sessão. O histórico será salvo automaticamente em `memory\<sessionId>.json`.

### Como Retomar uma Sessão Existente
Se você deseja retomar uma sessão anterior, copie o identificador da sessão (encontrado no nome do arquivo JSON) e execute:
```powershell
.\scripts\run-ia.ps1 -sessionId session_20240601_183000_1234
```

### Estrutura do Arquivo de Memória
```json
{
  "sessionId": "session_20240601_183000_1234",
  "createdAt": "2026-06-01T18:30:00.000Z",
  "messages": [
    {"role":"user","content":"..."},
    {"role":"assistant","content":"..."}
  ]
}
```

### Notas
- Cada terminal/IA tem seu próprio arquivo de memória, garantindo isolamento.
- O histórico é salvo após cada resposta, assegurando persistência entre sessões.
- Caso queira limpar o histórico, basta excluir o respectivo arquivo JSON na pasta `memory/`.
# Uso rápido com Antigravity CLI

Depois de criar o script `scripts/antigravity-cli.ps1`, carregue-o no seu terminal PowerShell:
```powershell
. .\scripts\antigravity-cli.ps1
```

Agora você tem os seguintes atalhos disponíveis:
- `dev` – inicia o servidor de desenvolvimento Next.js (`npm run dev`).
- `lint` – executa o lint (`npm run lint`).
- `worker` – executa o worker uma única vez (`npm run worker:once`).
- `hermes <prompt>` – envia um prompt ao agente Hermes e exibe a resposta.

### Exemplo de uso
```powershell
hermes "Qual é a estrutura de diretórios deste projeto?"
```

Esses atalhos facilitam o fluxo de trabalho e garantem que Antigravity e Hermes estejam sempre em sintonia.

---
