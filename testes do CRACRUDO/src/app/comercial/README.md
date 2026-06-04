# Ura Ichiba · 裏市場

## O que mudou

A página `/comercial` foi reconstruída do zero. Saiu o `CommercialDashboardClient` (dashboard de abas estilo SaaS genérico), entrou o `UraIchibaClient` — um observatório econômico vivo.

## Arquivos alterados

| Arquivo | Tipo |
|---------|------|
| `src/components/ura-ichiba-client.tsx` | NOVO — Componente principal (513 linhas) |
| `src/app/comercial/page.tsx` | EDITADO — Importa `UraIchibaClient` |

## Funcionalidades

### 1. Header vivo
- Fluxo ativo (R$ XX/min) atualiza a cada 3s
- Contador de fontes e agentes
- Botões NOVA CAMPANHA e GERAR LINK

### 2. Mapa Econômico (Canvas)
- 8 nós em constelação: Youtube, TikTok, Produto A/B, Afiliado, Campanha, Blog, Newsletter
- Conexões curvas (bezier) entre nós
- 60 partículas fluindo entre nós ativos (cada uma = dinheiro em movimento)
- Cada nó com cor, glow, receita, variação %, label da IA
- Tooltip flutuante ao pairar sobre nó (receita, ROI, IA responsável)
- 4 métricas rápidas abaixo do mapa (Receita Total, ROI Médio, Canais Ativos, CAC)
- Respeita `--background` e `--brand` do tema (light/amber e dark/void)

### 3. Painel de Oportunidades (esquerda)
- 4 cards com título, crescimento %, confiança
- Botão "CAPITALIZAR" aparece no hover

### 4. Painel de Agentes (direita)
- HERMES, KOTARO, MA'AT, HEFESTO com ícone, status, detalhe e barra de progresso
- Botões CONSELHO ECONÔMICO e ARSENAL

### 5. Arsenal Drawer
- 6 categorias arrastáveis: Links, Cupons, Criativos, Vídeos, Scripts, Landing Pages
- Abre/fecha por botão na sidebar direita

### 6. Conselho Econômico (Modal)
- GPT-5, Claude e Gemini debatem com cores diferentes
- Barra de decisão (TikTok 70% / Youtube 30%)
- Botão APLICAR DECISÃO

## Análise de erros e gambiarras

### Verificações aplicadas

| Ferramenta | Resultado |
|------------|-----------|
| `tsc --noEmit` | ✅ Nenhum erro nos arquivos modificados |
| `eslint` | ✅ 0 erros, 0 warnings |
| `next build` | ✅ Compila (verificado) |

### Problemas encontrados e corrigidos

1. **`Math.random()` no render** (linha 418): O ESLint `react-hooks/purity` acusava chamada de função impura durante o render. A barra de progresso dos agentes usava `Math.random()` inline no `style.width`. **Corrigido**: substituído por `useState(() => AGENTS.map(() => 60 + Math.random() * 35))[0]` — inicialização lazy única.

2. **`particles` state não utilizado**: `setParticles(p)` era chamado em `initParticles` mas a variável `particles` nunca era lida (o canvas usa `particlesRef.current`). **Corrigido**: removido o estado não utilizado.

### Problemas pré-existentes (não relacionados)

- `src/components/agent-node-studio.tsx:3` — Erro TS2307: módulo `./yggnarok/YggNexusCanvas` não encontrado. Este erro existia antes das alterações e não afeta a página comercial.

### Observações de design

- O `Math.random()` no `requestAnimationFrame` (linhas 147-148) faz as curvas bezier entre os nós "respirarem" sutilmente a cada frame. É intencional — o mapa deve parecer um ecossistema vivo, não um gráfico estático.
- `getComputedStyle()` é chamado 60fps para ler `--background` e `--brand`. Para um protótipo é aceitável; em produção, considere ler uma vez e ouvir `transitionend` ou usar um observer.

## Como testar

```bash
cd staging
npm run dev
# Abra http://localhost:3000/comercial
```

Os dados são mock. Para conectar dados reais:
1. Substitua `NODES`, `EDGES`, `AGENTS`, `OPPORTUNITIES` por chamadas `fetch` à API
2. Substitua `alert()` por modais ou chamadas de ação reais
3. Adicione WebSockets para partículas reagirem a vendas em tempo real
