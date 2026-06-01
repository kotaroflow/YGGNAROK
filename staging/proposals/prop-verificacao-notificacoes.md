# Proposta: Verificação de notificações

## Arquivos alterados
- `staging/src/components/chat-client.tsx`
- `staging/src/app/meu-perfil/client.tsx`
- `staging/src/components/criar-conteudo-client.tsx`
- `staging/src/components/sidebar.tsx`
- `staging/src/lib/notification-sound.ts`

## Objetivo
- Documentar uma versão atualizada do aviso sobre a confiabilidade da IA na UI de chat para que a equipe de integração possa avaliar a mudança antes de aplicar em `src` principal.
- Garantir que a tela de notificações/usuário lê o perfil salvo e preenche os campos sem disparar setState dentro dos efeitos, mantendo o `localStorage` consistente.
- Substituir o hook de memória LTM por um `useMemo` que reprocessa o rastreamento sempre que surgem toasts, eliminando efeitos que disparavam `setState` diretamente.
- Derivar a aba ativa da sidebar a partir do path em vez de alterar o estado durante o efeito, mantendo o controle manual do usuário e resolvendo o alerta do linter.
- Adicionar feedback sonoro leve via Web Audio API a cada toast (perfil ou criação de conteúdo) utilizando um helper centralizado.

## Testes automatizados
- `npm run lint` *(falha)* — os erros reportados ainda dizem respeito aos arquivos principais (`src/app/meu-perfil/client.tsx`, `src/components/estudio-video-client.tsx`, `src/components/criar-conteudo-client.tsx`, `src/components/sidebar.tsx` e outros), logo a execução continua caindo antes de finalizar; nenhum dos arquivos tocados dentro de `staging/` aparece no erro bloqueante mais recente.
- `npx eslint staging/src --max-warnings=0` *(falha)* — o lint da pasta `staging/src` gera apenas avisos de importações/variáveis não utilizadas herdadas do repositório e não erros; continua sendo preciso ajustar o linter principal que ainda exige `max-warnings=0`.

## Novas dependências
- Nenhuma.
