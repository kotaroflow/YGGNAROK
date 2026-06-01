# Proposta de Alteração: Transforme "Recentes" em Histórico Dinâmico

## Arquivos Alterados em `staging/`
- `staging/src/components/sidebar.tsx`

## Objetivo das Modificações
Transformar a seção "Recentes" da sidebar de apenas um título estático para um histórico dinâmico que lista os chats recentes, similar à implementação do componente `RecentsTab` já existente no código.

### Problema Identificado
Na aba "Chat" da sidebar, após o botão "Novo chat" e a seção de projetos, era exibido apenas o título "Recentes" seguido de um espaço vazio (onde `tabItems` era null para a aba chat). Isso fazia com que a lista de chats recentes não fosse exibida, apesar do componente `RecentsTab` já estar implementado e funcional.

### Solução Implementada
Substitui o componente `<ProjectsSection collapsed={collapsed} />` dentro da condicional `{activeTab === "chat"}` pelo componente `<RecentsTab />`, que já estava disponível no mesmo arquivo e responsável por exibir a lista dinâmica de chats recentes com todas as funcionalidades de fixação, renomeação, exclusão e adição a projetos.

Dessa forma, ao acessar a aba "Chat" da sidebar, os usuários agora veem:
1. Botão "Novo chat"
2. Lista de chats recentes (com avatares, opções de fixar, renomear, excluir, adicionar a projetos)
3. Título "Recentes" 
4. Conteúdo das abas "Criação & IA" ou "Comercial" quando apropriado

## Novas Dependências
Nenhuma nova dependência foi introduzida. A alteração apenas reutilizou componentes já existentes no códigobase:
- `RecentsTab` (definido linhas 235-278)
- `RecentChatItem` (definido linhas 56-230)
- Hooks e utilitários já importados (`useChatWorkspace`, etc.)

## Benefícios
- Melhora a experiência do usuário ao fornecer acesso rápido aos chats recentes
- Aproveita código já existente e testado
- Mantém consistência com a identidade visual já estabelecida para os itens de chat
- Não introduz riscos de quebras já que component foi reutilizado