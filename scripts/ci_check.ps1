# scripts\ci_check.ps1

# -------------------------------------------------
# 1️⃣ Roda teste de despacho (test-dispatch.ps1)
# 2️⃣ Executa ESLint
# 3️⃣ Gera sumário de logs recentes
# -------------------------------------------------

$ErrorActionPreference = "Stop"

Write-Host "=== CI – Teste de Dispatch ==="
& "$PSScriptRoot\test-dispatch.ps1"
if ($LASTEXITCODE -ne 0) { Write-Error "Dispatch test failed."; exit 1 }

Write-Host "`n=== CI – ESLint ==="
npm run lint --silent
if ($LASTEXITCODE -ne 0) { Write-Error "ESLint errors."; exit 1 }

Write-Host "`n=== CI – Resumo de logs ==="
$logDir = "C:\Users\Administrador\YGGNAROK\logs"
if (Test-Path $logDir) {
    Get-ChildItem $logDir -File | Sort-Object LastWriteTime -Descending |
        Select-Object -First 5 | ForEach-Object {
            Write-Host "- $($_.Name) - $($_.LastWriteTime)"
        }
} else {
    Write-Host "Nenhum diretório de logs encontrado."
}

Write-Host "`nCI concluído com sucesso.""
