# YGGNAROK AI Council

## Core

YGGNAROK now treats AI execution as a council instead of a single assistant.

Runtime flow:

```txt
ai_jobs row
-> worker claims job
-> recent ai_learning is loaded
-> Model Router infers domain and mode
-> AI Gateway tries OpenRouter free models, AI Runner, then optional premium providers
-> Multi-Model Generator creates candidates
-> Multi-Agent Debate Engine critiques candidates
-> Supervisor Agent synthesizes final answer
-> Audit Log records models, agents, risk, critiques and learning
-> Learning Engine stores approved or pending learning
```

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

## Council Agents

- Creator Agent: creates first drafts and ideas.
- Critic Agent: finds flaws, repetition, low quality and contradictions.
- Strategy Agent: improves practical outcome, engagement, retention, sales or conversion.
- Consistency Agent: checks profile, niche, rules, history, style and YGGNAROK identity.
- Safety/Governance Agent: classifies low, medium or high risk.
- Memory Agent: extracts useful learning and memory risk.
- Supervisor Agent: resolves conflict and writes the final synthesis.
- Momonga/Admin Override: required for high risk.

## Risk Authority

- `low`: council can decide automatically.
- `medium`: Supervisor Agent authority.
- `high`: requires Momonga/Admin approval.

The worker never publishes automatically, changes auth, deletes critical data, changes structural database rules, spends above configured limits or enables persistent automations as an autonomous AI action.

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
