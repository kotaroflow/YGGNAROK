# AGENTS.md - YGGNAROK

## Regra principal

Este arquivo e curto de proposito. O contrato operacional completo dos agentes esta em:

`C:\Users\Administrador\DIABLO\MCP_SHARED\YGN_AGENT_IDE_OPERATING_CONTRACT.md`

Em caso de conflito, a precedencia e:

1. decisao humana explicita;
2. evidencia real observavel;
3. `MCP_SHARED`;
4. PR mergeado;
5. estado de `origin/main`;
6. documentacao auxiliar;
7. memoria, conversa ou resumo nao confirmado.

Nenhum agente deve usar autonomia, memoria, documentacao auxiliar ou este arquivo para contrariar decisao humana, evidencia real ou `MCP_SHARED`.

## Workspace principal

Workspace principal:

`C:\Users\Administrador\DIABLO\YGGNAROK`

Este workspace deve ser tratado como sujo e fora do fluxo normal de execucao.

No workspace principal, e proibido:

- alterar arquivos;
- fazer staging;
- fazer commit;
- executar `pull`, `merge` ou `rebase`;
- limpar arquivos;
- sincronizar para "arrumar" estado;
- executar diagnosticos que gerem artefatos.

Leitura e auditoria read-only sao permitidas quando necessarias.

## Execucao por pacote

Toda execucao real deve ocorrer em worktree limpa dedicada em:

`C:\Users\Administrador\DIABLO\YGGNAROK_WORKTREES`

Cada pacote deve ter:

- objetivo unico;
- classificacao LOW-RISK, MEDIUM-RISK ou HIGH-RISK;
- branch dedicada;
- paths permitidos;
- paths proibidos;
- validacao antes e depois;
- relatorio em `MCP_SHARED`.

Sem pacote claro, limite-se a leitura, auditoria, plano ou relatorio.

## Classificacao de risco

LOW-RISK: documentacao, plano, auditoria ou relatorio sem codigo executavel e sem area critica. Pode seguir automaticamente ate commit, push e abertura de PR quando houver pacote claro, worktree limpa, paths permitidos, validacoes aprovadas e relatorio em MCP_SHARED. Automatico nunca inclui merge, bypass, deploy, delecao de branch/worktree, limpeza ou alteracao fora do escopo.

MEDIUM-RISK: `AGENTS.md`, `README.md`, scripts, workers, regra operacional, mudanca visual nao critica ou refatoracao sem auth/security. Exige autorizacao humana antes de escrita, commit, push, PR ou merge.

HIGH-RISK: auth, login, cadastro, API, Supabase, RLS, RBAC, dados sensiveis, `.github`, CI/CD, branch protection, Vercel, deploy, secrets/env, `package.json`, lockfile, `next.config.ts`, push/merge direto na `main`, bypass, delecao de branch/worktree ou limpeza. Bloqueia ate autorizacao humana explicita.

## Proibicoes absolutas

E proibido:

- `git add .`;
- `git add -A`;
- commit no workspace principal;
- push direto na `main`;
- `pull`, `merge` ou `rebase` no workspace principal;
- alterar fora dos paths autorizados;
- abrir PR sem autorizacao quando nao for LOW-RISK;
- fazer merge sem autorizacao e validacao;
- usar bypass sem decisao humana e registro;
- deletar branch sem pacote de housekeeping aprovado;
- remover worktree sem pacote de housekeeping aprovado;
- alterar `.env`, tokens, chaves ou segredos;
- registrar segredo em relatorio;
- corrigir problema fora do escopo por iniciativa propria.

## Agentes

Zed e o executor/orquestrador local principal quando houver fluxo humano aprovado.

Codex, Antigravity, ChatGPT e agentes futuros sao auxiliares restritos. Eles podem auditar, planejar, validar e executar subtarefas delimitadas quando autorizados.

Agentes auxiliares nao criam verdade oficial sozinhos. Relatorios auxiliares sao insumos, nao decisao final.

Agentes auxiliares nao devem abrir PR, fazer merge, usar bypass, deletar branch, remover worktree, fazer deploy ou tocar no workspace principal sujo sem autorizacao humana explicita.

## Relatorios e MCP_SHARED

Toda auditoria, validacao ou mudanca deve gerar ou atualizar relatorio em:

`C:\Users\Administrador\DIABLO\MCP_SHARED`

Acoes manuais, UI, GitHub, Vercel, bypass, merge manual, alteracoes externas ou acoes fora do MCP devem ser registradas em:

`C:\Users\Administrador\DIABLO\MCP_SHARED\README_MUDANCAS_FORA_DO_MCP.md`

Nao copie nem registre segredos, tokens, chaves privadas ou `.env`.

## Politica de parada

Pare e registre o motivo quando:

- o risco subir;
- aparecer path fora do escopo;
- surgir segredo ou dado sensivel;
- uma validacao obrigatoria falhar;
- houver conflito entre fontes de autoridade;
- for necessario tocar no workspace principal;
- for necessario PR, merge, bypass, deploy, delecao de branch/worktree ou limpeza sem autorizacao;
- o problema encontrado estiver fora do pacote.

Ao parar, informe a decisao humana necessaria e o proximo passo seguro.
