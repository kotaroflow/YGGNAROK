# 🏯 GRIMÓRIO DE OPERAÇÕES NEURAIS: HERMES & YGGNAROK

> *"A tecnologia é o nosso nanquim; o design é a nossa espada."*
> Guia tático operacional para o Comandante. Leia isto amanhã de manhã se não lembrar de nada.

---

## 👁️ 1. O Que Está Acontecendo no Background?

O seu projeto **YGGNAROK** agora roda no **CHAOS MODE**. Três sistemas principais estão ativos na sua máquina agora:

1. **War Room Dashboard (Porta `3333`):** Painel visual de monitoramento. Acesse em: `http://localhost:3333`.
2. **Orquestrador de Arquivos (`hermes-daemon.ps1`):** Um watcher invisível que fica caçando erros de TypeScript, gerando boilerplates instantâneos e rodando o conselho de agentes.
3. **Download do Modelo Anime:** Uma janela do PowerShell está ativamente baixando o modelo **Anything V5** (~2GB) diretamente para `.hermes-daemon/`.

---

## 👑 2. O Conselho de IA (Mixture of Agents - MOA)

Toda vez que você edita e salva um componente `.tsx` em `src/components/`, **5 agentes especializados** revisam e alteram o código em paralelo:

| Agente | Especialidade | Comportamento |
| :--- | :--- | :--- |
| 🎨 **Art Director** | Estética *Void & Amber* | Remove "AI Slop" (degrades roxos, layouts genéricos) e injeta design cinemático Seinen. |
| ⚡ **Engenheiro de Performance** | Otimização de React | Adiciona `useMemo` e `useCallback` e mata re-renders desnecessários. |
| ♿ **Guardião de Acessibilidade** | Acessibilidade (A11y) | Adiciona `aria-labels` e corrige a semântica de botões e links. |
| 🏗️ **Arquiteto Chefe** | Estrutura & TypeScript | Organiza importações, tipagens e exportações limpas. |
| ✍️ **UX Writer Sênior** | Tom de Voz (Anime/Manga) | Reescreve textos e placeholders. Transforma "Tarefas" em **"Quests"**, "Projetos" em **"Arcos"** e "Biblioteca" em **"Grimório"**. |

Ao final da revisão, o código recebe a assinatura no topo: `// COUNCIL_APPROVED`.

---

## 🎨 3. Como usar o Ilustrador Neural (ComfyUI)?

Você não precisa de APIs pagas (Midjourney, DALL-E). O Hermes usa a sua placa de vídeo local via **ComfyUI**.

### Passo a Passo para Gerar Imagens direto no Código:
1. Digite qualquer uma dessas linhas diretamente no meio do seu código React:
   ```tsx
   @img("Um guerreiro cyber-samurai no estilo anime retro, neon ambar")
   // @img("painel HUD futurista de controle")
   {/* @img("um logo minimalista da árvore Yggdrasil") */}
   ```
2. Salve o arquivo e espere alguns segundos (ou aperte `Ctrl + Shift + B`).
3. O ComfyUI vai renderizar a imagem, salvá-la em `/public/assets/ai/` e **substituir o seu comentário automaticamente** por uma tag `<img src="/assets/ai/...png" />` estilizada.

### ⚠️ Importante sobre o Modelo de Anime (Amanhã):
Quando a janela azul do terminal que está baixando o modelo chegar a **100%**:
1. O arquivo `anything-v5.safetensors` estará na pasta `.hermes-daemon/`.
2. Pegue esse arquivo e cole dentro da pasta do seu ComfyUI em: `ComfyUI/models/checkpoints/`
3. Reinicie seu ComfyUI.

---

## 🔮 4. Lobe Chat: O Oráculo Conversacional

Se você quiser bater um papo livre, pesquisar ou debater ideias de design fora do editor de código, use o seu **Lobe Chat** local conectado à API do Msty (`http://localhost:10000/v1`).

Eu deixei criadas duas personas exclusivas para você arrastar para dentro do Lobe Chat:
* 🏯 **Hermes (Mestre da Guilda):** `.hermes-daemon/lobe-agents/Hermes-Arquiteto.json`
* 🏮 **Huashu (Diretor de Arte Seinen):** `.hermes-daemon/lobe-agents/Huashu-Art-Director.json`

*Basta ir na área de Assistentes no Lobe, clicar em **Importar** e arrastar esses arquivos para lá.*

---

## 🛠️ 5. Comandos de Emergência

Se precisar reiniciar tudo ou disparar na força:

*   **Reiniciar tudo:** Abra o terminal na raiz do projeto e rode:
    ```powershell
    .\scripts\restart-hermes.ps1
    ```
    *(Isso limpa os processos fantasmas e reinicia o War Room e o Daemon de background).*
*   **Chamar Art Director manualmente no arquivo atual:** No VS Code, aperte **`Ctrl + Shift + B`**.

---

### 💻 6. Customização Visual (Glow Amber)
Se você recarregar a janela do seu VS Code (**F1** > `Developer: Reload Window`), o editor inteiro estará tematizado com a paleta do YGGNAROK: fundo preto absoluto, linhas de código em âmbar e destaque cibernético de sintaxe.

*Descanse bem, Comandante. Suas ordens foram completamente escritas e executadas.* 🌌🍷
