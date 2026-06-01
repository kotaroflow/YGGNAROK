# Proposta de Integração - Pílula do Switcher de Modelos com Preenchimento Dinâmico de Progresso

**Autor:** Antigravity (Google DeepMind)
**ID da Conversa:** 124da657-e864-4859-b879-7a4b87baffa1
**Data:** 31 de Maio de 2026
**Status:** Prontidão para Produção (Compilação Bem-Sucedida - Build OK)

---

## 1. Arquivos Alterados no Staging

- [models.ts](file:///c:/Users/Administrador/YGGNAROK/staging/src/lib/models.ts) — Atualização da lógica de incremento de requisições de modelo para disparar um evento global de atualização em tempo real (`ygn-model-usage-change`).
- [chat-client.tsx](file:///c:/Users/Administrador/YGGNAROK/staging/src/components/chat-client.tsx) — Integração de chamadas para a função `incrementModelUsage` no encerramento de todas as respostas obtidas via stream.
- [model-switcher.tsx](file:///c:/Users/Administrador/YGGNAROK/staging/src/components/model-switcher.tsx) — Escuta de eventos para re-renderização reativa instantânea e injeção do gradiente de preenchimento de progresso (`linear-gradient`) no botão pílula do switcher.

---

## 2. Descrição das Melhorias Estéticas e Funcionais

Para conferir uma experiência extremamente premium, responsiva e viva ao switcher de modelos do YGGNAROK OS:
1. **Preenchimento Dinâmico da Pílula (Background Gradiente):**
   - Substituímos o fundo estático do botão por um gradiente CSS de progresso dinâmico (`linear-gradient(to right, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.1) ${pct * 100}%, transparent ${pct * 100}%)`).
   - A pílula de gatilho do switcher agora **se enche de cor gradualmente da esquerda para a direita** conforme o usuário gasta sua cota diária de requisições do modelo ativo.
2. **Atualização Reativa em Tempo Real (0ms de Atraso):**
   - Implementamos um emissor e receptor de evento nativo DOM (`ygn-model-usage-change`) que notifica instantaneamente o `ModelSwitcher` sempre que o chat incrementa as requisições. O preenchimento da pílula atualiza na tela de forma contínua sem depender de recargas ou timers arbitrários.
3. **Harmonia com Void & Amber:**
   - Usamos uma tonalidade âmbar refinada e translúcida (`rgba(245, 158, 11, 0.1)`) para garantir que o preenchimento seja elegante, sutil e perfeitamente legível sobre o fundo escuro do chat.

---

## 3. Validação de Integridade Técnica

* **Resultado do Build:** Compilação finalizada com **Exit Code: 0** (Zero avisos, zero falhas de tipagem).
