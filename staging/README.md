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
