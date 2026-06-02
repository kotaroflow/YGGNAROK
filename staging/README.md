# YGGNAROK / YGN V1 — Staging

> Auditoria completa 2026-06-01 · huashu-design + Impeccable
> `tsc --noEmit`: 0 erros nos arquivos alterados (2 pré-existentes em arquivos não tocados)

---

## Regra de Inversão

| Modo ativo | Fundo | Detalhes (brand, glow, aura, toggle) |
|-----------|-------|--------------------------------------|
| **AMBER** (light) | Claro `#FAFAFA` | Violeta `#7c3aed` |
| **VOID** (dark) | Escuro `#121214` | Âmbar `#F59E0B` |

O nome do modo = atmosfera de fundo. Os detalhes = cor oposta. O toggle sempre mostra o outro modo.

---

## Tokens Globais

### Paleta — `:root` / `.dark`

| Token | AMBER | VOID |
|-------|-------|------|
| `--background` | `#FAFAFA` | `#121214` |
| `--foreground` | `#171717` | `#F5F5F5` |
| `--brand` | `#7c3aed` | `#F59E0B` |
| `--brand-strong` | `#6d28d9` | `#D97706` |
| `--aura-color` | `109, 40, 217` | `245, 158, 11` |
| `--sidebar-bg` | `#F5F5F5` | `#141416` |
| `--sidebar-active-bg` | `rgba(124,58,237,.06)` | `rgba(245,158,11,.10)` |
| `--core-opacity` | `0.12` | `0.18` |
| `--ambient-opacity` | `0.04` | `0.06` |

### Tipografia

| Token | Fonte |
|-------|-------|
| `--font-sans` / `--font-serif` / `--font-divine` | Playfair Display Bold Italic (700i) |
| `--font-mono` | JetBrains Mono |

### Z-Index

`1 → 4 → 5 → 10 → 1000 → 1210 → 1300 → 1400`

---

## Componentes Auditados

### `SidebarToggleButton` (Void/Amber)
CSS Module em `layout/SidebarToggleButton.module.css`. Tokens violeta (default) para fundos claros, tokens âmbar (`[data-theme-mode="amber"]`) para fundos escuros. Linhas 18×2px, animação bounce (`cubic-bezier 0.34,1.56,0.64,1`), sweep de luz via `::after` com `skewX`, compressão `scale(0.93)` no click. `prefers-reduced-motion` desliga tudo.

### `YggSidebarEmblem` (Moeda 3D)
Flip 3D com `perspective: 780px`, `rotateY(180deg)` no hover. Glow usa `var(--brand)` dinâmico. Drop-shadow violeta no AMBER, âmbar no VOID (via `:global(.dark)`).

### `AmberCursorTracker`
Rastreia cursor com `requestAnimationFrame` + `throttle(50ms)`. Detecta mobile (`pointer: coarse`) e desliga. Atualiza `--mouse-x`/`--mouse-y` no `:root` do `<html>`.

### `ThemeToggle`
`useTheme()` hook com `localStorage` + sincronização entre tabs via `storage` event e `ygn-theme-change` custom event. Labels: "Void" (dark) / "Amber" (light).

### `AuthFrame`
Login/cadastro com arte de fundo + grid 0.76:1.34. Badge, campos e links agora usam `text-brand`/`focus:ring-brand` — dinâmico por tema.

---

## Bugs Corrigidos (Total: 9)

| # | Arquivo | Problema | Fix |
|---|---------|----------|-----|
| 1 | `globals.css` | `body::before/::after` hardcoded `rgba(245,158,11)` = âmbar sobre âmbar ilegível | `--aura-color: 109,40,217` (violeta) no :root, invertido no .dark |
| 2 | `globals.css` | Variáveis duplicadas 3× (gambiarra de merge) | Consolidado em blocos únicos |
| 3 | `globals.css` | Google Fonts Inter/Playfair/Cinzel importados e nunca usados | Removidos, só Playfair+JetBrains |
| 4 | `layout.tsx` | `Geist_Mono` importado e nunca usado (JetBrains do Google Fonts já cobre) | Removido |
| 5 | `layout.tsx` | `<head></head>` desnecessário | Removido |
| 6 | `YggSidebarEmblem.tsx` | `preload` inválido (não é prop do Next.js Image) | `priority` |
| 7 | `YggSidebarEmblem.css` | Drop-shadow invertido entre modos | Violeta no AMBER, âmbar no `.dark` |
| 8 | `auth-frame.tsx` | 6 lugares com `amber-*` hardcoded | `text-brand`/`focus:ring-brand` |
| 9 | `sidebar.tsx` | `toggleThemeMode` invertido (codex) | `theme === "dark" ? "amber" : "void"` |

### Melhorias Aplicadas

- **Glows reduzidos**: SidebarToggleButton (`0.42→0.18`), YggSidebarEmblem (`0.42→0.28`), body::before/::after (`0.22→0.12`)
- **SidebarToggleButton reescrito**: timing `cubic-bezier(0.34,1.56,0.64,1)` com bounce, sweep de luz, compressão no click
- **Fonte trocada**: Playfair Display Bold Italic (700i) no site inteiro, JetBrains Mono para código
- **YggSidebarEmblem glow**: `background: var(--brand)` — troca automaticamente entre violeta e âmbar
- **`<head>` removido** do layout

### Limpeza
- 20 arquivos stale removidos (`.log`, `.py`, `.html` temp, `.tsbuildinfo`, reports)
- 2 artefatos de build removidos (`tsconfig.tsbuildinfo`, `next-env.d.ts`)
- `.gitignore` na raiz ignora `staging/`

---

## Stack

- Next.js 16 + TypeScript + Tailwind CSS 4
- Supabase Auth, PostgreSQL, RLS e Realtime
- Cloudflare R2
- Vercel frontend

## Comandos

```bash
npm run dev
npm run typecheck
npm run worker:dev
```

## Variáveis

`NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` · `NEXT_PUBLIC_APP_URL`
