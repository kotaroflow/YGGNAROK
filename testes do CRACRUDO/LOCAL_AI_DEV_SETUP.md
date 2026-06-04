# Local AI Development Setup

This repo is configured so YGGNAROK can be developed with local open-weight models when Codex quota is unavailable.

## Installed Local Models

- `qwen2.5-coder:3b`: fast default for normal coding tasks.
- `qwen2.5-coder:7b`: recommended daily agent model for harder bugs, refactors, and architecture work.
- `qwen2.5-coder:14b`: heavy local fallback for complex agent work when smaller models loop or fail.
- `qwen3:8b`: recommended Roo/Kilo tool-use model when the agent must call editor/terminal tools.
- `qwen2.5-coder:1.5b`: fast fallback for small edits, simple explanations, and quick checks.
- `nomic-embed-text`: embeddings model for local context/search features.

## Recommended Local Agent Setup

Open VS Code in this folder, then use Roo Code or Kilo Code first. Keep Cline as a fallback if it behaves well with the selected model.

- Provider: `Ollama`
- Base URL: `http://127.0.0.1:11434`
- Default agent/tool model: `qwen3:8b`
- Coding fallback model: `qwen2.5-coder:7b`
- Heavy coding fallback: `qwen2.5-coder:14b`
- Fast model: `qwen2.5-coder:3b`
- Very fast model: `qwen2.5-coder:1.5b`

Before asking for changes, tell the local agent:

```text
Read .clinerules/yggnarok.md and follow it strictly. Work inside this repo only.
```

If Cline repeatedly shows a warning about local models being less capable, switch to Roo Code or Kilo Code with the same Ollama settings and use `qwen2.5-coder:7b` or `qwen2.5-coder:14b`.

Recommended order:

1. Roo Code with `qwen3:8b` for agent/tool tasks.
2. Kilo Code with `qwen3:8b` if Roo is unstable.
3. Roo/Kilo with `qwen2.5-coder:7b` for chat-like coding guidance.
4. Roo/Kilo with `qwen2.5-coder:14b` for harder code reasoning when tools are not required.
4. Cline only if it stops repeating local-model warnings.

## If The Agent Says The Model Did Not Use Tools

This means the model answered like normal chat instead of calling the editor/terminal tools. Use a smaller, explicit first task:

```text
Use your tools now. First read package.json, src/lib/navigation.ts, and LOCAL_AI_DEV_SETUP.md. Do not answer only with text. After reading, summarize what you found.
```

Then ask for one concrete edit at a time:

```text
Use your tools to edit exactly one file. Update src/lib/navigation.ts to add the missing route, then show the diff.
```

If it still fails:

- Switch from Cline to Roo Code or Kilo Code.
- Use `qwen3:8b`.
- Make sure the extension is in Act/Agent/Code mode, not Ask/Chat-only mode.
- Avoid broad requests like "fix the app"; start with "read these files" or "edit this one file".

## Boundaries

- Local models are for developing YGGNAROK, not for the production site runtime.
- Do not reintroduce Ollama, ComfyUI, or local model servers into the deployed YGGNAROK app.
- Keep the product cloud/free-first unless the architecture is explicitly changed later.
- Run `npm run typecheck`, `npm run lint`, and `npm run build` after meaningful code changes.
