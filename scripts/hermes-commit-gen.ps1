param($CommitMsgFile, $CommitSource)

# Ignorar se o usuário já forneceu uma mensagem via flag -m ou se for um merge
if ($CommitSource -in @('message', 'merge', 'squash', 'commit')) { exit 0 }

$diff = & git diff --cached | Select-Object -First 100 | Out-String
if ([string]::IsNullOrWhiteSpace($diff)) { exit 0 }

$hermesCl = "C:\Users\Administrador\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes.exe"
if (-not (Test-Path $hermesCl)) { exit 0 }

Write-Host "`n🧠 Hermes (Msty) esta lendo o seu diff..." -ForegroundColor Magenta

$taskFile = "C:\Users\Administrador\YGGNAROK\task.md"
$taskCtx = if (Test-Path $taskFile) { Get-Content $taskFile -Raw } else { "" }

$promptFile = "C:\Users\Administrador\YGGNAROK\.hermes-daemon\temp-commit-prompt.txt"
$prompt = "Abaixo esta o diff das mudancas q o desenvolvedor acabou de fazer no YGGNAROK. Escreva UMA UNICA LINHA de mensagem de commit usando o padrao Conventional Commits. Nao adicione aspas nem markdown. Mantenha em pt-BR:`n`nContexto de Design (Impeccable):`n$taskCtx`n`nDiff:`n$diff"
$prompt | Out-File $promptFile -Encoding UTF8

$prompt = Get-Content $promptFile -Raw
$ans = & $hermesCl -z $prompt --provider custom -m devstral-gpu-safe:24b | Out-String

if ($ans.Trim() -and $ans -notmatch "Error") {
    $msg = $ans.Trim() -replace '^(```[\w]*\s*)', '' -replace '(```\s*)$', '' -replace '`"',''
    
    # Adiciona a mensagem do Hermes antes dos comentários padrão do git
    $oldMsg = if (Test-Path $CommitMsgFile) { Get-Content $CommitMsgFile -Raw } else { "" }
    $newMsg = "$msg`n`n$oldMsg"
    $newMsg | Out-File $CommitMsgFile -Encoding UTF8
    
    Write-Host "✅ Mensagem Auto-Gerada: $msg`n" -ForegroundColor Green
}
Remove-Item $promptFile -ErrorAction Ignore
