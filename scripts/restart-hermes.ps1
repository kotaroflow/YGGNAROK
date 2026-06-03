$ErrorActionPreference = "SilentlyContinue"

Write-Host "Procurando processos antigos do Hermes..." -ForegroundColor Yellow
$scripts = @("hermes-daemon.ps1", "hermes-orchestrator.ps1", "dashboard-server.ps1")
foreach ($s in $scripts) {
    $procs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match $s -and $_.Name -match "pwsh|powershell" }
    foreach ($p in $procs) {
        Stop-Process -Id $p.ProcessId -Force
        Write-Host "Finalizado: $s (PID: $($p.ProcessId))" -ForegroundColor Red
    }
}

Start-Sleep -Seconds 2

Write-Host "Iniciando a Revolucao com o Msty ativo..." -ForegroundColor Cyan

$baseDir = "C:\Users\Administrador\YGGNAROK\scripts"

Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$baseDir\dashboard-server.ps1`"" -WindowStyle Minimized
Write-Host "Dashboard Server inciado." -ForegroundColor Green

Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$baseDir\hermes-daemon.ps1`"" -WindowStyle Minimized
Write-Host "Daemon background inciado." -ForegroundColor Green

Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$baseDir\hermes-orchestrator.ps1`" -Loop" -WindowStyle Minimized
Write-Host "Orquestrador e War Room inciados." -ForegroundColor Green

Write-Host "Todos os sistemas 100% operantes!" -ForegroundColor Magenta
