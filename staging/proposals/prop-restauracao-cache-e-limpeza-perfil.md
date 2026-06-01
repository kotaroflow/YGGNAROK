# Proposta de Ajuste: Restauração do Cache e Remoção de Exclusão de Conta no Perfil

## Arquivos Alterados em `staging/`
- `staging/src/components/sidebar.tsx`
- `staging/src/app/meu-perfil/client.tsx`

## Objetivo das Modificações
Esta proposta visa atender à solicitação de reverter a substituição da opção de "Limpar Cache" e remover a implementação experimental de exclusão de conta que havia sido sugerida para a página de perfil.

### Alterações Realizadas

#### 1. Sidebar (`src/components/sidebar.tsx`)
- **Restauração:** A opção "Limpar Cache do OS" foi restaurada à sua posição original na base do menu de perfil na sidebar.
- **Limpeza:** Removido o componente experimental `AccountDeletionConfirm` e suas referências, garantindo que a sidebar retorne ao comportamento padrão estável para estas ações.
- **Consistência:** Mantida a integração com o popover de perfil conforme as diretrizes visuais do Kotaro OS.

#### 2. Página de Perfil (`src/app/meu-perfil/client.tsx`)
- **Remoção:** O card "Zona de Perigo Crítico" que continha a opção "Excluir Minha Conta" foi removido inteiramente da página de perfil.
- **Simplificação:** A página agora foca exclusivamente na gestão de preferências de usuário, e-mail, segurança, API e aparência, eliminando ações irreversíveis que não possuem backend definitivo neste ambiente.

## Novas Dependências
Nenhuma. Foram utilizadas apenas as bibliotecas já presentes no projeto.

## Benefícios
- Recuperação de funcionalidade essencial (Limpar Cache) solicitada pelo usuário.
- Remoção de código "morto" ou experimental (exclusão de conta) que não era desejado na página de perfil.
- Maior estabilidade e alinhamento com as expectativas do usuário para o Kotaro OS.
