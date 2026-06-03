# ⚙️ COMO CONFIGURAR O LOBE CHAT COM SEU MSTY LOCAL

Siga este passo a passo rápido para fazer o Lobe Chat usar a sua placa de vídeo de graça através do Msty:

---

## 🛠️ PASSO 1: Configurar a API Local no Lobe Chat

1. Abra o **Lobe Chat** no seu computador.
2. Clique no ícone de **Configurações** (a engrenagem no canto inferior esquerdo).
3. No menu lateral, clique em **Modelos de Linguagem** (Language Models).
4. Procure pela aba **OpenAI** e clique para abrir as opções:
   * **Ativar OpenAI:** Marque como **ATIVADO** (Toggle ON).
   * **Chave de API (API Key):** Digite `msty` (o Msty local não precisa de chave real, mas o Lobe Chat exige que tenha algo escrito no campo para liberar o botão).
   * **Endereço do Proxy (API Proxy Address):** Cole a URL do Msty local:
     ```text
     http://localhost:10000/v1
     ```
5. Clique no botão de verificar conexão. Pronto! A ponte está feita.

---

## 🏯 PASSO 2: Importar os Agentes do YGGNAROK

Agora que a API está conectada, vamos injetar as mentes táticas:

1. No menu lateral esquerdo do Lobe Chat, clique em **Chat** ou **Assistentes** (Agentes).
2. Procure pelo botão **Importar** (ícone de uma caixinha com seta ou nos três pontinhos no topo da lista de chats).
3. Vá na pasta do seu projeto:
   `C:\Users\Administrador\YGGNAROK\.hermes-daemon\lobe-agents\`
4. Arrasta e solte esses dois arquivos para dentro do Lobe Chat:
   * 🏯 `Hermes-Arquiteto.json`
   * 🏮 `Huashu-Art-Director.json`
5. Eles vão aparecer imediatamente na sua barra lateral como novos contatos!

---

## 🧠 PASSO 3: Selecionar o Modelo Local no Chat

1. Clique no agente **Hermes | Mestre da Guilda** que você acabou de importar.
2. No topo da tela de chat dele, clique no seletor de modelos (onde geralmente diz GPT-3.5 ou GPT-4).
3. O Lobe vai carregar a lista de modelos ativos do seu Msty. Selecione o seu modelo local (ex: `qwen2.5-coder` ou similar).
4. Diga *"Olá Comandante"* e veja a mágica local acontecer 100% de graça!
