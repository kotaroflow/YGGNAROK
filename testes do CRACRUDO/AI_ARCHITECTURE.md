# YGGNAROK AI Council

## Core

YGGNAROK now treats AI execution as a lucid multi-agent hierarchy instead of a single assistant.

Runtime flow:

```txt
user thought / ai_jobs row
-> Lucidity Agent preserves the original intent and creates an executable mission
-> Coordinator orders agents, context and retry policy
-> Named Council Agents create divergent structural bases
-> Median Judges compare bases against the original idea
-> Specialist Critic validates exactness and execution risk
-> Final Specialist Team passes work between architecture, prompt, automation, quality and delivery
-> Admin authority approves high-risk decisions
-> Audit Log records models, agents, risk, critiques, fidelity evidence and learning
-> Learning Engine stores approved or pending learning
```

The canonical code sources for this hierarchy are:

- `src/lib/ai-entity-catalog.ts`: entity catalog generated from the reference list, with 40 primary IAs and 180 total IAs/sub-IAs.
- `src/lib/ai-hierarchy.ts`: runtime hierarchy, admin authority, orchestration metadata and prompt contract.

## Providers

- OpenRouter: default free-model router for integrated no-local text execution.
- AI Runner: optional cloud worker fallback for durable production execution.
- Paid providers: disabled by default. They should only be enabled through an explicit cost-control decision.
- Cloud media provider: future cloud-only image/audio/video handoff after textual prompt debate.
- Future providers: add a new `provider:model` prefix in the AI Gateway.

Model values may be prefixed:

- `openrouter:openrouter/free`
- `openrouter:model-id:free`
- `openrouter:paid-model-id` only when paid AI is explicitly enabled

## Modes

- `fast`: free-router first, one model, one round.
- `normal`: executor plus light critique.
- `comparative`: multiple executors and one critic.
- `evolutive`: comparative flow plus learning extraction.
- `debate`: strategic debate and learning.
- `deep`: 3-5 agents using free cloud models unless paid AI is explicitly enabled.
- `chaos`: widest debate allowed by limits.
- `council_decision`: internal decision mode with risk authority.

## Named Council Agents

The V1 real architecture uses 40 primary IAs from the YGGNAROK / YGN reference list:

1. Heimdall: routing.
2. Janus: flows and state transitions.
3. Ísis: triage.
4. Ma’at: justice and conciliation.
5. Athena: strategy.
6. Hotei: pet assistant.
7. Hefesto: prompts and ideas.
8. Tenjin: tutorials.
9. Amaterasu: content creation.
10. Benzaiten: aesthetics.
11. Daedalus: technical generation.
12. Orpheus: voice and storytelling.
13. Gaia: monetization.
14. Inari: copy and offer.
15. Hermes: distribution.
16. Ebisu: partnerships and links.
17. Daikokuten: campaigns.
18. Fuxi: niche strategy.
19. Omoikane: reports.
20. Hachiman: global learning.
21. Mnemosyne: memory.
22. Wenchang: library.
23. Hypnos: intelligent trash/reuse.
24. Yomi: copyright.
25. Themis: rules and LGPD.
26. Zhong Kui: problematic content.
27. Susanoo: security.
28. Asclépio: system health.
29. Raphael: recovery.
30. Metatron: logs and permissions.
31. Astraea: XP and rank.
32. Yama: karma.
33. Caishen: rewards.
34. Nüwa: onboarding.
35. Ame-no-Uzume: interface and UX.
36. Sarutahiko: manual posting.
37. Gabriel: notifications.
38. Pandora: tests.
39. Anúbis: final audit.
40. Nemesis: brand risk.

The 130+ extra IAs/sub-IAs remain available as expansion modules and should be called only when needed. They may be represented visually in n8n for operational clarity, but they should not become one independent site screen, backend or automation each.

## Implementation Guardrails

- IAs are registered modules with function, context, rules, permissions and response format.
- Heimdall routes; Janus controls state, approvals and retry loops.
- Agents answer structured JSON and carry `needs_admin_approval` when risk requires it.
- Critical actions require Administrator Master approval: publishing, deletion, auth, permission changes, structural database changes, spending and persistent automations.
- Lore, characters and visual ranks do not become backend permission unless a real permission rule exists.
- Legacy names such as Kotaro OS, KCO and KCOS should not be used for new architecture; the current product is YGGNAROK / YGN.
- n8n can be used as a visual operational map for the hierarchy without forcing the same visual structure into the product UI.

## Lucid Hierarchy

- Ísis: turns raw thought into a triaged, clear, executable mission.
- Heimdall: routes which IAs enter the flow.
- Janus: controls state transitions, approvals and retry loops.
- Ma’at and Anúbis: judge coherence, justice, exactness and final passage.
- Athena: protects strategic direction.
- Domain IAs: Amaterasu, Hefesto, Daedalus, Gaia, Inari, Hermes, Wenchang and others execute by area.
- Themis, Susanoo, Zhong Kui and Nemesis: protect legality, security, problematic content and brand risk.
- Omoikane, Mnemosyne, Metatron and Maat: produce reports, memory, logs, permissions and audit.
- Administrator Master: final human authority.

## Local Runtime Layer

The consolidated local tooling adds a machine-local runtime hierarchy:

- Huashu: visual direction and prototype/design specialist.
- Impeccable: final polish and quality standard.

## Risk Authority

- `low`: council can decide automatically.
- `medium`: coordinator/supervisor authority.
- `high`: requires Administrator Master approval.

The worker never publishes automatically, changes auth, deletes critical data, changes structural database rules, spends above configured limits or enables persistent automations as an autonomous AI action.

## Persistent Memory And Evolution

YGGNAROK's memory is operational, explicit and reviewable.

Persistent memory sources:

- `library_items(type=ai_learning)`: approved active learning loaded as recent context.
- `ai_memory_candidates`: proposed memories waiting for approval/rejection when needed.
- `ai_vector_memory`: future semantic memory layer.
- `agent_runs`: execution trace by job and agent.
- `audit_logs`: durable trace for decisions, risks, models and guardrails.

Continuous evolution loop:

1. Capture job, input, agent, model, output, risk and current context.
2. Reflect through the Memory Agent.
3. Propose memory, prompt improvement, routing hint or risk alert.
4. Approve medium/high-risk memory through Administrator Master review.
5. Apply approved memories as recent context in future jobs.
6. Audit decisions and failures for future diagnosis.

The migration `202606040001_yggnarok_ai_hierarchy_memory_evolution.sql` registers the 40 named agents, memory/evolution permissions and admin-controlled automations. `n8n_visual_map_review` is intentionally paused by default: n8n may show the hierarchy visually, but the product does not need one independent screen/backend per IA.

## Learning

Learning is extracted from current runtime results only. Memory candidates include content, origin, agent, model, date via database timestamps, scope, risk, confidence, status and justification.

- Low-risk learning is stored as active.
- Medium-risk learning is pending when supervised learning is enabled.
- High-risk learning is pending when admin approval is required.

## Audit

Every completed or failed council job writes `audit_logs` with job type, mode, domain, risk, decision authority, models, candidates, critiques, learning candidates and guardrails.

## Momonga Panel

`/momonga` reads current jobs, agent runs, audit logs, health logs and AI learning memories to show:

- active models and providers
- jobs by status
- recent decisions and risks
- pending or approved memories
- provider usage signals
- operational alerts
- kill switch status from env
