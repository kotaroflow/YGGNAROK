param(
    [switch]$Notify
)

$ErrorActionPreference = "Continue"
$projectRoot = "C:\Users\Administrador\YGGNAROK"
$logFile = "$projectRoot\hermes-monitor.log"
$issues = @()

Write-Output "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Iniciando monitoramento..." | Out-File -FilePath $logFile -Append

# 1. TypeScript check
Write-Output ">> typecheck..." | Out-File -FilePath $logFile -Append
$tsOut = & "C:\Program Files\nodejs\npx.cmd" --no-install tsc --noEmit 2>&1
if ($LASTEXITCODE -ne 0) {
    $issues += "TypeScript errors found"
    $tsOut | Out-File -FilePath "$projectRoot\typecheck-errors.log" -Force
    Write-Output "   TypeScript: ERROR" | Out-File -FilePath $logFile -Append
} else {
    Write-Output "   TypeScript: OK" | Out-File -FilePath $logFile -Append
}

# 2. ESLint check
Write-Output ">> eslint..." | Out-File -FilePath $logFile -Append
$lintOut = & "C:\Program Files\nodejs\npx.cmd" --no-install eslint src/ 2>&1
if ($LASTEXITCODE -ne 0) {
    $issues += "ESLint errors found"
    $lintOut | Out-File -FilePath "$projectRoot\eslint-errors.log" -Force
    Write-Output "   ESLint: ERROR" | Out-File -FilePath $logFile -Append
} else {
    Write-Output "   ESLint: OK" | Out-File -FilePath $logFile -Append
}

# 3. Check dev.err.log for new errors
$errLog = "$projectRoot\dev.err.log"
if (Test-Path $errLog) {
    $content = Get-Content $errLog -Tail 20
    if ($content -match "error|Error|ERROR|fail|Fail|FAIL") {
        $issues += "New errors in dev.err.log"
        Write-Output "   dev.err.log: NOVOS ERROS" | Out-File -FilePath $logFile -Append
    }
}

# 4. Next.js build check (quick syntax only)
Write-Output ">> next build (syntax check)..." | Out-File -FilePath $logFile -Append
$buildOut = & "C:\Program Files\nodejs\npx.cmd" --no-install next build 2>&1 | Select-String -Pattern "error|Error|ERROR|Failed|failed" -SimpleMatch
if ($buildOut) {
    $issues += "Next.js build errors"
    Write-Output "   Build: ERROR" | Out-File -FilePath $logFile -Append
} else {
    Write-Output "   Build: OK" | Out-File -FilePath $logFile -Append
}

# Summary
if ($issues.Count -gt 0) {
    Write-Output "`n⚠️  Problemas encontrados:" | Out-File -FilePath $logFile -Append
    $issues | ForEach-Object { Write-Output "   - $_" | Out-File -FilePath $logFile -Append }
} else {
    Write-Output "`n✓ Nenhum problema encontrado" | Out-File -FilePath $logFile -Append
}

Write-Output "================================" | Out-File -FilePath $logFile -Append
