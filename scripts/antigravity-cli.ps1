# Antigravity CLI - shortcuts for YGGNAROK project

function Invoke-Dev {
    Write-Host "Starting Next.js dev server..."
    npm run dev
}

function Invoke-Lint {
    Write-Host "Running ESLint..."
    npm run lint
}

function Invoke-WorkerOnce {
    Write-Host "Running Worker once..."
    npm run worker:once
}

function Invoke-Hermes {
    param(
        [Parameter(Mandatory=$true)][string]$Prompt
    )
    $hermesExe = "C:\Users\Administrador\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes.exe"
    if (-Not (Test-Path $hermesExe)) {
        Write-Error "Hermes executable not found at $hermesExe"
        return
    }
    & $hermesExe -z $Prompt --provider custom -m devstral-gpu-safe:24b
}

# Alias shortcuts for quick use
Set-Alias dev Invoke-Dev
Set-Alias lint Invoke-Lint
Set-Alias worker Invoke-WorkerOnce
Set-Alias hermes Invoke-Hermes

Write-Host "Antigravity CLI loaded. Use 'dev', 'lint', 'worker', or 'hermes <prompt>' to run commands."
