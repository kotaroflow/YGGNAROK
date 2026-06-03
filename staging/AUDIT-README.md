# YGGNAROK Creation Nexus — Staging Audit Report

**Generated:** 2026-06-01  
**Scope:** Full rewrite of `agent-node-studio.tsx` (Three.js/1262-line legacy) → modular 2D canvas architecture, plus critical sidebar bugfixes.  
**Status:** Build clean, all new files lint-free. Integration stubs present but un-wired.

---

## 1. What Was Done

### 1.1 Sidebar Fixes
| Issue | Location | Fix |
|-------|----------|-----|
| Triple-click detector intercepting all child clicks (`button`, `a`, `input`, etc.) | `sidebar.tsx` ~line 530 | Added `event.target.closest(...)` early return; only expands/collapses when clicking on sidebar chrome |
| Header brand text / toggle button jumping on expand/collapse | `sidebar.tsx` header | Replaced React conditional mount with stable DOM + CSS transitions (`opacity`, `max-w`, `translate-x`) so icons donʼt shift layout during `width 0.2s` |

### 1.2 Legacy Canvas Rewrite
- Deleted `ConstellationEditor.tsx` (broken import to non-existent `clsx` package + mismatched hook signatures).
- Replaced `agent-node-studio.tsx` (1262 lines of Three.js) with a 3-line proxy `export { YggNexusCanvas as AgentNodeStudio }`.
- Built a complete 2D node-graph architecture (see files below).

### 1.3 Design-System Hygiene
- Restored full `z-index` token block (`:root`) in `globals.css` after accidental strip during earlier hotfix (fe5f288).  
  Missing tokens caused modals, popups, and sidebar layers to collapse to `auto`.
- Refactored `theme-toggle.tsx` to `useSyncExternalStore` per React best-practice (removed `setState` + `useEffect` anti-pattern flagged by linter).

---

## 2. New Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Agent Node Studio                  │
│         (re-exported as AgentNodeStudio for /agentes-ia)   │
├─────────────────────────────────────────────────────────────┤
│  YggNexusCanvas.tsx (main)                                 │
│  ├─ NodeCard.tsx         (8 node-type mini-previews)       │
│  ├─ NodeInspector.tsx    (contextual right panel)          │
│  ├─ EdgeLayer.tsx        (SVG orthogonal edges)            │
│  ├─ useNodeGraph.ts      (reducer + undo/redo stack)        │
│  └─ useCanvasInteraction.ts (pan, zoom-to-cursor, shortcuts) │
│                                                             │
│  Utilities                                                 │
│  ├─ nodeTypeRegistry.ts  (colors, icons, dimensions)        │
│  ├─ gridCalculator.ts    (responsive layout)                │
│  └─ orthogonalPathfinding.ts (Manhattan 90° routing)        │
│                                                             │
│  Integration Services (stubs)                              │
│  ├─ n8n.ts                (webhook dispatch stubs)           │
│  ├─ obsidian.ts           (two-vault write stubs)            │
│  ├─ integrationConfig.ts  (env loader)                     │
│  └─ markdownBuilders.ts  (per-type Markdown export)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. File Manifest

### New / Modified Files in `staging/src/`

| Path | Lines | Type | Notes |
|------|-------|------|-------|
| `types/yggnarok.ts` | ~153 | NEW | All shared interfaces: `YggNode`, `YggEdge`, `N8nPayload`, `IntegrationConfig`, `ObsidianService`, `N8nService`, `User` |
| `utils/orthogonalPathfinding.ts` | ~89 | NEW | Manhattan route with 6px corner-radius fallback |
| `utils/gridCalculator.ts` | ~71 | NEW | Responsive columns (4/2/1), 24px gap, `fitView` padding |
| `utils/nodeTypeRegistry.ts` | ~118 | NEW | 8 node types, brand colors, Lucide icons, default dimensions |
| `hooks/useNodeGraph.ts` | ~296 | NEW | Reducer, 200-slot undo/redo, `useState` history stack |
| `hooks/useCanvasInteraction.ts` | ~208 | NEW | Pan, zoom 25–200%, zoom-to-cursor, keyboard shortcuts (`Ctrl+0`, `+`, `-`) |
| `components/yggnarok/YggNexusCanvas.tsx` | ~512 | NEW | Main canvas, floating toolbar, quick-add sidebar, toast wiring |
| `components/yggnarok/NodeCard.tsx` | ~174 | NEW | Per-type mini-previews, progress bars, tags, drag handles |
| `components/yggnarok/NodeInspector.tsx` | ~298 | NEW | Contextual right panel with 7 type-specific forms |
| `components/yggnarok/edges/EdgeLayer.tsx` | ~156 | NEW | SVG orthogonal edges, labels, `dot/arrow/diamond` markers per connection type |
| `services/integrations/n8n.ts` | ~80 | NEW | Stub dispatch: logs payload + returns synthetic execution ID |
| `services/integrations/obsidian.ts` | ~87 | NEW | Stub write: resolves admin vs user vault, builds path, logs markdown |
| `services/integrations/integrationConfig.ts` | ~48 | NEW | Reads `process.env.*` for n8n/Obsidian URLs/keys |
| `services/markdownBuilders.ts` | ~96 | NEW | Per-type Markdown export for Obsidian notes |
| `components/agent-node-studio.tsx` | 3 | MODIFIED | Proxy re-export: `YggNexusCanvas as AgentNodeStudio` |
| `components/sidebar.tsx` | ~+12 | MODIFIED | Click-interception fix; header transition fix |
| `components/theme-toggle.tsx` | ~-8 | MODIFIED | Switched to `useSyncExternalStore` |
| `app/globals.css` | ~+13 | MODIFIED | Restored z-index token block |
| `lib/utils.ts` | ~+18 | MODIFIED | Added `logger`, `throttle` with correct generic typing |

### Deleted Files
- `src/components/yggnarok/ConstellationEditor.tsx` — broken import `clsx` / `useThree` hooks / stale types.

---

## 4. Stub Contracts

### 4.1 n8n Service (`services/integrations/n8n.ts`)
- **Method:** `sendToN8n(node, workflowType, user)`
- **Current:** Logs payload to console; returns `{ success: true, executionId: "stub-…", workflowId: workflowType }`.
- **Wire-up:** Set env vars:
  - `N8N_ENABLED=true`
  - `N8N_BASE_URL=https://…`
  - `N8N_API_KEY=xxx`
  - Individual workflow webhook paths in `N8N_WEBHOOK_*`
- **Risk:** No real promise rejection currently; UI assumes success.

### 4.2 Obsidian Service (`services/integrations/obsidian.ts`)
- **Method:** `sendToObsidian(node, user)`
- **Current:** Logs markdown + target path; returns `{ success: true, vaultPath: "…" }`.
- **Wire-up:** Set env vars:
  - `OBSIDIAN_ENABLED=true`
  - `OBSIDIAN_ADMIN_VAULT_PATH=…`
  - `OBSIDIAN_USER_VAULT_BASE_PATH=…`
  - Future: connect to Obsidian Local REST API plugin.
- **Risk:** `pullFromObsidian` always returns `null`; bidirectional sync not implemented.

### 4.3 Integration Config (`services/integrations/integrationConfig.ts`)
- **Current:** All URLs default to `""`; will silently skip when `enabled` is `false`.
- **Action:** Populate `.env` (see `.env.example` at workspace root) before enabling.

---

## 5. Known Risks & Anti-Patterns

| Risk | Severity | File | Mitigation / Plan |
|------|----------|------|---------------------|
| `setState` called inside `setHistory` updater function | ⚠️ Medium | `useNodeGraph.ts` lines 150-176 | Works in React 18 but is concurrent-mode unsafe. Migrate to `useReducer` + `historyRef` for React 19 safety. |
| n8n/Obsidian stubs return synthetic success | ⚠️ Medium | `n8n.ts`, `obsidian.ts` | UI must eventually expose failure states (toast, retry). Wire real webhooks first. |
| `_nodeId` / `_edgeId` module-level mutable counters | ⚠️ Low | `useNodeGraph.ts` lines 9-13 | Conflict if multiple tabs open or SSR reused. Replace with UUID or `crypto.randomUUID()` on mount. |
| `applyGridLayout` dispatches `setNodes` on current `state.nodes` closure (stale) | ⚠️ Low | `useNodeGraph.ts` lines 264-272 | Call `dispatch` with `setNodes` computed from latest state via functional updater, or move layout logic into reducer. |
| module-level `integrationConfig` reads `process.env` at import time | ⚠️ Low | `integrationConfig.ts` | Acceptable for Next.js build-time envs; will be stale for runtime-cached containers. Move to a function evaluated on use if runtime envs are expected. |

---

## 6. Type-Safety & Lint

- `npx tsc --noEmit` inside `staging/` → **0 new errors** (legacy files in `estudio-video-client.tsx`, `agent-node-studio.tsx.old`, etc. still carry pre-existing errors outside the scope of this audit).
- `npm run lint -- --max-warnings=0` on new files → **passing**.
- Build output (`npm run build`) → **success**.

---

## 7. Integration Wiring Guide

1. Copy `.env.example` at workspace root to `staging/.env.local`.
2. Fill:
   ```
   N8N_ENABLED=true
   N8N_BASE_URL=https://your-n8n.example.com
   N8N_API_KEY=n8n_api_xxx

   OBSIDIAN_ENABLED=true
   OBSIDIAN_ADMIN_VAULT_PATH=/path/to/AdminVault
   OBSIDIAN_USER_VAULT_BASE_PATH=/path/to/UserVault
   ```
3. In `n8n.ts`, replace empty strings in `workflows` object with actual webhook IDs.
4. Replace `console.log` stubs with real `fetch()` calls (see inline TODO comments).
5. Add error boundaries around `YggNexusCanvas` to catch runtime canvas failures.

---

## 8. Next Steps

1. **Commit** all staging changes with a descriptive message referencing this audit.
2. **QA** manual checks: triple-click sidebar, resize, create/position/link nodes, undo/redo, zoom shortcuts.
3. **Fix** `useNodeGraph` history stack to use `historyRef` + functional `setHistory` dispatch (removes React 19 concern).
4. **Replace** module-level id counters with `crypto.randomUUID()`.
5. **Wire** real n8n and Obsidian endpoints when credentials are available.
6. **Add** E2E test (Playwright) for critical sidebar regression (triple-click + Chat link).

---

*End of audit — staging is clean to proceed to QA or merge.*
