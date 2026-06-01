# Proposta YGGNAROK — Ajuste Visual e Otimização do Espaço Morto

## Arquivos Alterados
* `src/components/criar-conteudo-client.tsx`
* `staging/src/components/criar-conteudo-client.tsx` (Espelho de Staging)

## Objetivos das Modificações
1. **Otimização do Espaço Central (Preenchimento de Espaço Morto):**
   * Expandimos a altura do campo de **Briefing Principal** no Console Operacional (`rows={7}` -> `rows={16}`).
   * Essa alteração preenche verticalmente a lacuna vazia no centro da tela de alta densidade, criando uma simetria perfeita com o painel lateral do **Supervisor Odin** e o **Radar de Tendências**.
2. **Correção do Bug Visual de Coexistência Temática (Void & Amber):**
   * Eliminamos o fundo preto estático (`bg-neutral-950`) e as cores de texto fixadas (`text-white`, `text-neutral-100`) que causavam um conflito visual grave quando o sistema entrava no modo claro (Sidebar em tom âmbar e página congelada no Void escuro).
   * Introduzimos tokens dinâmicos nativos do ecossistema YGGNAROK (`bg-background`, `text-foreground`, `bg-surface/30` e `bg-surface-strong/95`).
   * A partir de agora, a página inteira responde em perfeita sintonia e elegância com o alternador de temas, apresentando designs deslumbrantes tanto no modo escuro **Void** quanto no modo claro **Amber**.

## Novas Dependências
* Nenhuma.
