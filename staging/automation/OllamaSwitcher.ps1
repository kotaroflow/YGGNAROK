# Ollama Model Switcher for Codex
function Get-OllamaModels {
    $list = ollama list
    if ($LASTEXITCODE -ne 0) { return @() }
    $lines = $list | Select-Object -Skip 1
    $names = @()
    foreach ($line in $lines) {
        if ($line -match '\S') {
            $parts = $line -split '\s+'
            $names += $parts[0]
        }
    }
    return $names
}
function Get-OllamaRunningModels {
    $ps = ollama ps
    if ($LASTEXITCODE -ne 0) { return @() }
    $lines = $ps | Select-Object -Skip 1
    $names = @()
    foreach ($line in $lines) {
        if ($line -match '\S') {
            $parts = $line -split '\s+'
            $names += $parts[0]
        }
    }
    return $names
}
function Invoke-OllamaSwitch {
    # Get list of local models
    $models = Get-OllamaModels
    if (-not $models) {
        Write-Warning 'No local models found. Pull one first.'
        return
    }
    # Show menu
    Write-Host 'Select an Ollama model:`n'
    for ($i=0; $i -lt $models.Count; $i++) {
        Write-Host ('{0}: {1}' -f ($i+1), $models[$i])
    }
    Write-Host ('{0}: [Pull a cloud model...]' -f ($models.Count+1))
    $choice = Read-Host 'Enter number'
    if ($choice -notmatch '^\d+$') { Write-Warning 'Invalid choice'; return }
    $idx = [int]$choice - 1
    if ($idx -eq $models.Count) {
        # Pull cloud model
        $modelName = Read-Host 'Enter model name to pull (e.g., llama3:8b)'
        if (-not $modelName) { Write-Warning 'No name supplied'; return }
        Write-Host ('Pulling {0}...' -f $modelName)
        ollama pull $modelName
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Failed to pull $modelName."
            return
        }
        $selected = $modelName
    } else {
        $selected = $models[$idx]
    }
    # Stop all running models
    $running = Get-OllamaRunningModels
    foreach ($m in $running) {
        Write-Host ('Stopping {0}...' -f $m)
        ollama stop $m
    }
    # Run selected model in background (hidden window)
    Write-Host ('Running {0}...' -f $selected)
    Start-Process -FilePath ollama -ArgumentList @('run',$selected) -WindowStyle Hidden
    # Notify discreetly via BurntToast if available
    try {
        Import-Module BurntToast -ErrorAction Stop
        New-BurntToastNotification -Text 'Ollama', ('Now using model: {0}' -f $selected)
    } catch {
        # Fallback: simple host message
        Write-Host ('Ollama: Now using model: {0}' -f $selected)
    }
}
# Entry point
Invoke-OllamaSwitch
