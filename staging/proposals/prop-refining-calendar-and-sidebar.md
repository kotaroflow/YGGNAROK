# 📋 Proposta: Refinamento do Calendário Interativo e Ajuste de Tamanho do YGN Coin na Sidebar
*Criado por: Antigravity-Agent*

## 🎯 Objetivo
1. **Calendário Interativo (`interactive-calendar.tsx`)**:
   - Ajustar o fluxo de salvamento de rascunhos (Post-its) para atualizar dinamicamente o estado do calendário na UI sem depender de reload.
   - Refatorar a filtragem de itens agendados para usar o estado local reativo (`contents`), inicializado a partir de `initialContents`.
   - Adicionar suporte a salvamento de novos post-its com data, título, tipo de conteúdo, plataforma padrão (Instagram) e notas descritivas.
2. **Visualização do YGN Coin na Sidebar (`sidebar.tsx`)**:
   - Ajustar e sintonizar os estilos de background-image do ícone do YGN Coin no cabeçalho e rodapé da sidebar para garantir excelente alinhamento e precisão visual tanto no modo expandido quanto no colapsado.
   - Definir cor de fundo preta (`bg-black`) no contêiner do YGN Coin e recalibrar o `backgroundPosition` (4.5% para o expandido e 95.5% para o colapsado) e `backgroundSize` (220%) para obter um corte perfeito do sprite da moeda.

## 📁 Arquivos Modificados/Adicionados em Staging
- `staging/src/components/interactive-calendar.tsx` (modificado)
- `staging/src/components/sidebar.tsx` (modificado)

## 💡 Detalhes de Implementação & Lógica
- **interactive-calendar.tsx**:
  - Introdução do estado `contents` via `useState` carregando `initialContents`.
  - Atualização do método de exibição de itens `getItemsForDay` para usar `contents`.
  - No botão "Salvar Post-it", caso a data esteja definida, um novo objeto `ContentItem` é adicionado ao estado reativo `contents` no callback de finalização de salvamento simulado.
- **sidebar.tsx**:
  - Correção cirúrgica da renderização do componente da moeda YGN Coin.
  - Alinhamento de background reposicionado para centralização perfeita e ampliação suave.

## ⚠️ Pontos de Atenção para o Integrador
- Os arquivos foram verificados com sucesso localmente usando `npm run typecheck` e `npm run build`.
- Nenhuma dependência externa nova foi adicionada.
