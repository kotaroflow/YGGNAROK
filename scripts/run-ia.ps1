# scripts/run-ia.ps1
param(
    [string]$sessionId = ""
)

# If sessionId is not provided, generate a unique one
if (-not $sessionId) {
    $sessionId = "session_$(Get-Date -Format 'yyyyMMdd_HHmmss')_$(Get-Random -Maximum 999999)"
}

# Path to memory file
$memoryFile = Join-Path -Path $PSScriptRoot -ChildPath "..\memory\$sessionId.json"

# Load existing memory if exists
$memoryContent = ""
if (Test-Path $memoryFile) {
    Write-Host "Loading existing memory from $memoryFile"
    $memoryContent = Get-Content -Path $memoryFile -Raw
}
else {
    Write-Host "Creating new memory file at $memoryFile"
    $memoryContent = "[]"
}

# Output the sessionId and memory content for the user to use
Write-Host "Session ID: $sessionId"
Write-Host "Memory content (JSON): $memoryContent"

# TODO: Replace the following line with the actual command to start the IA
# Example: & "C:\Path\To\antigravity.exe" start-ia --session $sessionId --history "$memoryContent"