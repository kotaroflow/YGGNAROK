# YGGNAROK — Design Context

> Gerado pelo comando **teach-impeccable** (Impeccable). Atualize esta seção quando a direção visual ou o público mudar.

## Design Context

### Users

**Quem:** equipe interna mista — criadores de conteúdo, time comercial e ops/admin — com acesso segmentado por permissões (RLS, roles, sidebar por grupo).

**Contexto de uso:** sessões de trabalho longas em fluxos operacionais (criar conteúdo, biblioteca, postagem manual, vendas, jobs de IA, logs). Interface em **pt-BR**. Produto V1 focado em operação real, não em consumo público.

**Job to be done:** executar e acompanhar trabalho (perfis, conteúdo, vendas, mídia, jobs assíncronos) com clareza de status e atalhos rápidos — sem distrações de feed social ou gamificação.

### Brand Personality

**Tom:** Épico, acolhedor e preciso. Uma fusão entre uma Guilda de Aventureiros de Isekai e um Terminal Operacional de Mechas (como Evangelion/Ghost in the Shell).

**Voz:** Profissional, mas com alma Otaku. A nomenclatura dos sistemas deve beber fortemente do universo de Anime e Mangá (ex: Arcos de História, Guildas, Seinen, Shonen), usando referências sutis à cultura japonesa, mas sem perder a clareza de uso.

**Emoções alvo:** **Ação e Foco**, a sensação de estar lendo um painel tático de um grande mangá Shonen.

**Identidade visual existente:** marca **YGGNAROK** (A Árvore do Mundo/Fim dos Tempos). Destaque **âmbar** (`--brand`), fundos escuros profundos (Void), interfaces com cortes diagonais sutis que lembram painéis de mangá, e "screentones" (retículas) se possível. Tipografia **Geist Sans/Mono** para clareza, contrastando com a energia explosiva dos animes.

### Aesthetic Direction

**Direção:** Painel Tático de Anime Premium. Deve remeter a interfaces Sci-Fi japonesas (Akira, Evangelion, Sword Art Online) misturadas com o minimalismo "Void & Amber".

**Tema:** Predominantemente escuro (Dark Mode nativo absoluto), com acentos de luz neon âmbar e componentes sobrepostos que lembram a diagramação de um Mangá.

**Referências implícitas no código:** dashboard com cards elevados, sidebar colapsável, top bar com busca e CTA âmbar, auth com arte por rota (`auth-frame`).

**Anti-referências (evitar explicitamente):**
- SaaS genérico de IA (Inter + roxo + cards empilhados sem propósito)
- Visual gamer / neon excessivo
- ERP corporativo cinza, denso e frio
- Rede social consumer (feed infinito, stories, engajamento vazio)

**Cores:** manter âmbar como acento de marca; slate/stone para texto e superfícies; acentos secundários (violet, blue) só com função semântica (ex.: estatísticas no dashboard), não como identidade principal.

### Design Principles

1. **Clareza operacional primeiro** — cada tela deve deixar óbvio o estado do trabalho (jobs, pendências, próximo passo); densidade informativa sim, ruído visual não.

2. **Calma visual, ação evidente** — fundos suaves e superfícies translúcidas; CTAs primários em âmbar com contraste forte; animações discretas e respeito a `prefers-reduced-motion`.

3. **Confiança através da consistência** — reutilizar padrões de `AppShell`, cards `rounded-lg border … backdrop-blur`, tipografia `text-slate-*` / `dark:text-stone-*`, e tokens CSS antes de inventar novos estilos.

4. **Acolhimento de Guilda** — O sistema deve parecer o "Quartel General" da equipe. Termos como "Missões", "Arcos", "Personagens" e "Estúdios" são bem-vindos.

5. **A Alma Otaku Premium** — O design não pode parecer infantil. É um Mangá Seinen adulto. O "Void" representa o nanquim escuro, o "Amber" representa a energia/impacto visual. As imagens geradas pelo ComfyUI DEVEM ser no estilo Anime 2D/Cell-shaded (Niji/Animagine).

### Stack & tokens (referência técnica)

| Item | Valor |
|------|--------|
| Framework | Next.js 16 + React 19 + Tailwind CSS 4 |
| Fontes | Geist Sans, Geist Mono |
| Brand CSS | `--brand: #f5c400` (light) / `#ffd22e` (dark) |
| Background | `#f7f4ee` (light) / `#0e0d10` (dark) |
| Componentes chave | `app-shell`, `sidebar`, `top-bar`, `auth-frame`, `field` |
