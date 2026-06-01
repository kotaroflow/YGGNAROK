# YGGNAROK / YGN V1 — Staging

> Área de staging da interface YGGNAROK. Código revisado e polido com huashu-design + Impeccable em 2026-06-01.

---

## Design System — Regra de Inversão

O YGGNAROK opera em dois modos visuais. A regra é: **o nome do modo define o fundo, os detalhes são a cor oposta.**

| Modo | Fundo (atmosfera) | Detalhes (brand, glow, accentos) |
|------|-------------------|----------------------------------|
| **AMBER** (light) | Claro `#FAFAFA` | Violeta `#5B21B6` — VOID |
| **VOID** (dark) | Escuro `#121214` | Âmbar `#F59E0B` — AMBER |

### Exemplo prático

- **Modo AMBER ativo** → sidebar fundo claro, toggle brilha violeta, glow de fundo violeta
- **Modo VOID ativo** → sidebar fundo escuro, toggle brilha âmbar, glow de fundo âmbar

O toggle sempre mostra a cor **oposta** ao fundo — ele sinaliza a energia do outro modo.

---

## Tokens Globais (`src/app/globals.css`)

### Z-Index Layer
```css
--z-content: 1
--z-amber-ambient: 4
--z-amber-aura: 5
--z-page-effects: 10
--z-sidebar: 1000
--z-modal: 1210
--z-toast: 1300
```

### Paleta — Tabela completa

| Token | AMBER (light) | VOID (dark) |
|-------|--------------|-------------|
| `--background` | `#FAFAFA` | `#121214` |
| `--foreground` | `#171717` | `#F5F5F5` |
| `--surface` | `rgba(255,255,255,.95)` | `rgba(30,30,32,.65)` |
| `--brand` | `#5B21B6` | `#F59E0B` |
| `--brand-strong` | `#4C1D95` | `#D97706` |
| `--muted` | `#404040` | `#A3A3A3` |
| `--aura-color` | `109, 40, 217` | `245, 158, 11` |
| `--sidebar-bg` | `#F5F5F5` | `#141416` |
| `--sidebar-active-bg` | `rgba(91,33,182,.08)` | `rgba(245,158,11,.18)` |

---

## Componentes Premium

### `SidebarToggleButton` — Toggle Animado
CSS Module em `layout/SidebarToggleButton.module.css`. Variáveis por tema:
- **Default (VOID)**: linhas violeta-escuras, glow `#7c3aed`, visível em fundos claros
- **AMBER** (`data-theme-mode="amber"`): linhas âmbar-claras, glow `#f59e0b`, visível em fundos escuros

Features: hover transform, sweep de luz via `::after` com `skewX`, compressão `scale(0.92)` no click, focus acessível, `prefers-reduced-motion`.

### `YggSidebarEmblem` — Moeda 3D
Flip 3D com lighting sweep. Glow usa `var(--brand)` dinamicamente. Drop-shadow temático por modo (violeta no AMBER, âmbar no VOID).

### `AmberCursorTracker`
Rastreia cursor via `requestAnimationFrame` + throttle 50ms. Detecta mobile (`pointer: coarse`). Atualiza `--mouse-x`/`--mouse-y` para o `body::before`/`::after`.

---

## Arquitetura de Fundo

`body::before` — camada larga (blur 120px), gradiente radial + linear, segue cursor

`body::after` — camada focada (blur 80px), radial, segue cursor

`--aura-color` troca automaticamente entre violeta e âmbar conforme o tema.

Mobile tem animação de pulsação (`amber-pulse` 12s) em vez de tracking.

---

## O Que Foi Feito (Review 2026-06-01)

### Bugs corrigidos
- `YggSidebarEmblem.tsx`: `preload` inválido → `priority` (prop correta do Next.js Image)
- `YggSidebarEmblem.module.css`: drop-shadow invertido entre modos
- `globals.css`: removido font imports Google mortos (não usados — Geist via Next.js)
- `sidebar.tsx`: toggleThemeMode invertido para refletir regra de inversão

### Melhorias aplicadas
- `SidebarToggleButton.module.css`: reescrito com tokens violeta/âmbar, backgrounds corretos por modo
- `globals.css`: `--aura-color` dinâmico, `body::before/::after` usa `rgba(var(--aura-color), ...)`
- `YggSidebarEmblem.module.css`: glow via `var(--brand)`, drop-shadow temático por `.dark`

### Limpeza
- Removidos 20 arquivos stale (`.log`, `.py`, `.html` temp, `.tsbuildinfo`, reports antigos)
- TypeScript `tsc --noEmit` — zero erros

---

## Stack

- Next.js 16 + TypeScript + Tailwind CSS 4
- Supabase Auth, PostgreSQL, RLS e Realtime
- Cloudflare R2 para mídia
- Worker TypeScript em `worker/`
- Vercel para frontend

## Comandos

```bash
npm run dev
npm run lint
npm run typecheck
npm run worker:once
npm run worker:dev
```

## Variáveis

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

Worker/backend privado usa service role, R2 e chaves de IA.
