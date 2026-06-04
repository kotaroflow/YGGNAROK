# YGGNAROK — Design Context

> Gerado pelo comando **teach-impeccable** (Impeccable). Atualize esta seção quando a direção visual ou o público mudar.

## Design Context

### Users

**Quem:** equipe interna mista — criadores de conteúdo, time comercial e ops/admin — com acesso segmentado por permissões (RLS, roles, sidebar por grupo).

**Contexto de uso:** sessões de trabalho longas em fluxos operacionais (criar conteúdo, biblioteca, postagem manual, vendas, jobs de IA, logs). Interface em **pt-BR**. Produto V1 focado em operação real, não em consumo público.

**Job to be done:** executar e acompanhar trabalho (perfis, conteúdo, vendas, mídia, jobs assíncronos) com clareza de status e atalhos rápidos — sem distrações de feed social ou gamificação.

### Brand Personality

**Tom:** preciso, acolhedor e confiável.

**Voz:** profissional mas humana; copy direto em português; nomenclatura com referências leves ao universo japonês/operacional nos grupos da sidebar (Entrada, Mercado, Criação, Operação), sem exagero temático.

**Emoções alvo:** **calma e foco** para fluxos longos, com **confiança** de ferramenta séria de trabalho.

**Identidade visual existente:** marca **YGGNAROK** com destaque **âmbar** (`--brand` / amber-300 CTAs), fundos quentes cream/stone, superfícies em vidro (`bg-white/78`, `backdrop-blur`), gradientes radiais sutis no `body::before`. Tipografia **Geist Sans/Mono** (Next.js). Ícones **Lucide**. Sem biblioteca de componentes tipo shadcn — padrões Tailwind customizados em `src/components/`.

### Aesthetic Direction

**Direção:** painel operacional premium-discreto — quente, legível, com hierarquia clara; não “startup de IA genérica”.

**Tema:** **claro e escuro com igual cuidado** (`.dark` + `localStorage` `ygn-theme`; tokens em `globals.css`).

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

4. **Acolhimento sem infantilizar** — tom quente (cream, âmbar) e copy em pt-BR; evitar gamificação, badges ruidosos ou metáforas visuais exageradas.

5. **Não parecer “mais um produto de IA”** — fugir de gradientes roxos dominantes, tipografia default sem intenção e layouts de marketing; o YGGNAROK é **ferramenta de trabalho**, não demo de chatbot.

### Stack & tokens (referência técnica)

| Item | Valor |
|------|--------|
| Framework | Next.js 16 + React 19 + Tailwind CSS 4 |
| Fontes | Geist Sans, Geist Mono |
| Brand CSS | `--brand: #f5c400` (light) / `#ffd22e` (dark) |
| Background | `#f7f4ee` (light) / `#0e0d10` (dark) |
| Componentes chave | `app-shell`, `sidebar`, `top-bar`, `auth-frame`, `field` |
