# Proposta de Integração - Alinhamento Visual, Simetria e Customização do Seletor de Modelos

**Autor:** Antigravity (Google DeepMind)
**ID da Conversa:** 124da657-e864-4859-b879-7a4b87baffa1
**Data:** 31 de Maio de 2026
**Status:** Prontidão para Produção (Compilação Bem-Sucedida - Build OK)

---

## 1. Arquivos Alterados no Staging

- [model-switcher.tsx](file:///c:/Users/Administrador/YGGNAROK/staging/src/components/model-switcher.tsx) — Redesenho total do painel de seleção, injeção de scrollbar customizada e alinhamentos de simetria impecável.

---

## 2. Descrição das Correções Estéticas e Alinhamentos Efetuados

Para corrigir todos os pontos tortos e assimetrias que deixavam o dropdown com cara de incompleto:
1. **Integrated Usage & Metadata Row (Fim do Crowding):**
   - Eliminamos o empilhamento assimétrico de `openai/gpt-4o` de um lado e o progresso do outro.
   - Criamos o componente `UsageBar` aprimorado que consolida e renderiza em uma única linha premium com separador superior (`border-t border-line/10 pt-2`):
     - À esquerda: Contexto da IA e ID limpo (ex: `128K ctx · gpt-4o`).
     - À direita: Estatísticas de requisições em negrito âmbar (ex: `0/1000 req (0%)`).
2. **Scrollbar Sleek Customizada (Fim do Scrollbar Branco/Nativo):**
   - Injetamos classes de webkit scrollbar nativas do Tailwind no contêiner da lista (`max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-line/45 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand/50 scrollbar-thin`).
   - O scrollbar agora é uma linha sutil, cinza translúcida no tema escuro, que se ilumina ao passar o mouse.
3. **Impedimento de Shift de Texto por Borda (Simetria de Layout):**
   - Adicionamos por padrão `border-l-2 border-transparent` nos botões de modelo. Ao selecionar o modelo, a borda vira `border-brand`. Isso impede que o texto e os badges deem um pulo (shift) de 2px para a direita, mantendo o alinhamento impecável.
4. **Header de Provedor Ricos e Centralizados:**
   - Adicionamos a contagem de modelos ativos de cada provedor (ex: `Anthropic - 5 modelos`) no cabeçalho cinza pegajoso para deixar o layout robusto.
5. **Micro-Badges em Caixa Alta (Grid Alinhado):**
   - Transformamos as tags `Grátis`, `Pago` e o Tier de velocidade em micro-badges de altíssimo padrão (`inline-flex items-center rounded-full uppercase tracking-wide px-2 py-0.5 text-[9px] font-extrabold`), fazendo com que fiquem perfeitamente alinhados verticalmente ao nome do modelo.

---

## 3. Validação de Integridade Técnica

* **Resultado do Build:** Compilação finalizada com **Exit Code: 0** (Sem erros ou avisos).
