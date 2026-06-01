# Proposta de Refinamento Visual: Página Inicial (Chat)

## Arquivos Alterados em `staging/`
- `staging/src/components/chat-client.tsx`

## Objetivo das Modificações
Implementar refinamentos estéticos de alta fidelidade ("Quick Wins") na interface principal do Kotaro OS para elevar a percepção de qualidade premium e reduzir o aspecto de "interface genérica".

### Alterações Realizadas:

1.  **Tipografia Editorial (h2)**:
    - Alterado `tracking-tight` para `tracking-tighter` na saudação principal. Isso cria uma estética mais próxima de revistas de tecnologia e branding de alto nível (ex: Apple/Stripe), onde o kerning mais fechado comunica precisão.

2.  **Aura de Foco no Input**:
    - Adicionado `focus-within:shadow-[0_0_50px_-12px_rgba(234,179,8,0.25)]` ao container do campo de texto. 
    - **Por que**: Quando o usuário começa a interagir, a caixa de entrada agora emite um brilho sutil (glow) em tom âmbar, criando uma resposta visual "viva" que reforça o estado de foco e a identidade da marca.

3.  **Vibração Atmosférica (Empty State)**:
    - Adicionada a classe `animate-[pulse_20s_infinite]` ao container principal quando o chat está vazio.
    - **Por que**: Uma pulsação extremamente lenta (20 segundos) cria um efeito de "respiração" na interface. Isso evita que a página pareça estática ou "morta" enquanto aguarda a primeira instrução do usuário, sem ser uma distração visual agressiva.

## Novas Dependências
Nenhuma. Utilizado apenas classes utilitárias do Tailwind CSS.

## Benefícios
- **Percepção Premium**: Detalhes tipográficos e sombras personalizadas separam o projeto de templates padrão.
- **UX Feedback**: O foco no input agora é multissensorial (borda + brilho).
- **Branding**: O brilho âmbar reforça a cor de destaque do sistema.
