# Auditoria e Refinamento do Sistema de Design (Kotaro OS - Fase 1)

## Arquivos Alterados em `staging/`
- `staging/src/components/sidebar.tsx`
- `staging/src/components/model-switcher.tsx`
- `staging/src/components/home-screen.tsx`
- `staging/src/components/chat-client.tsx`

## Objetivo das Modificações
Realizar uma revisão completa na interface para unificar a gramática visual, elevar a percepção de qualidade premium e eliminar padrões genéricos ("AI slop"), seguindo as diretrizes do Huashu-Design.

### Melhorias Implementadas:

#### 1. Unificação de Geometria e Interação
-   **Padronização de Bordas**: Estabelecido `rounded-2xl` para containers principais (inputs, cards de home) e `rounded-xl` para elementos secundários.
-   **Aura de Foco Amber**: O efeito de brilho (*amber glow*) foi estendido para todos os campos de entrada principais, criando um feedback tátil-visual consistente em todo o sistema.

#### 2. Tipografia de Alto Impacto
-   **Ajuste de Kerning**: Aplicado `tracking-tighter` e `font-extrabold` em cabeçalhos de exibição (H1/H2) para uma estética editorial moderna.
-   **Micro-tipografia**: Refinados os labels de modelos e setores para usarem `font-black` e `tracking-widest`, aumentando a legibilidade em tamanhos pequenos.

#### 3. Refinamento de Componentes Críticos
-   **Model Switcher**:
    -   Simplificação visual do botão de acionamento.
    -   Redução da "sujeira visual" nas barras de progresso de tokens, tornando-as mais integradas ao design.
    -   Melhoria no contraste dos badges de status (Grátis/Pago).
-   **Cards de Sugestão (Empty State)**:
    -   Abandono do layout genérico por uma abordagem mais estruturada com títulos em uppercase e ícones centralizados em containers de alta definição.
    -   Efeito de hover aprimorado com deslocamento vertical (`-translate-y-1`) e sombras profundas.
-   **Sidebar**:
    -   Popover de perfil refinado com sombras de maior alcance e transparências controladas.
    -   Melhoria no badge de plano (Admin/Free) para um visual mais robusto.

## Benefícios
-   **Identidade Visual Proprietária**: O Kotaro OS agora possui um "tempero" visual único que o diferencia de protótipos de IA padrão.
-   **Consistência Cognitiva**: O usuário aprende um padrão de interação (como a aura de foco) que se repete em toda a jornada.
-   **Qualidade Percebida**: A atenção aos detalhes tipográficos e de espaçamento comunica um produto maduro e confiável.
