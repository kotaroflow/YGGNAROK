# 📚 Índice de Skills


## Antigravity (`antigravity_skill.txt`)
- **Comando:** `@antigravity <prompt>`
- **Descrição:** Roda o prompt no modelo local **phi** via Ollama.
- **Comandos auxiliares:**
  - `antigravity dev` – inicia o servidor Next.js.
  - `antigravity lint` – roda ESLint.

## Huashu (`huashu_skill.txt`)
- **Comando:** `@huashu <prompt>` ou `@huashu-design <prompt>`
- **Descrição:** Aciona o workflow de design de alta fidelidade e prototipagem premium.

## Impeccable (`impeccable_skill.txt`)
- **Comando:** `@impeccable <sub-comando>`
- **Descrição:** Suíte de refinamento de interface (UI/UX), contendo sub-comandos como `teach`, `audit`, `animate`, `polish`, `simplify`, `colorize` e `critique`.

---


### Como usar
```powershell
# Exemplo rápido
$resp = DispatchAgent "@antigravity Qual a capital do Brasil?"
Write-Host "Antigravity: $resp"
```
