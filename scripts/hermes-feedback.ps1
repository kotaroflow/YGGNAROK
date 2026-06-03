param([string]$Feedback)

if (-not $Feedback) {
    Write-Host "Uso: .\hermes-feedback.ps1 -Feedback `"seu feedback aqui`""
    Write-Host "Ex: .\hermes-feedback.ps1 -Feedback `"a sidebar esta quebrada em mobile`""
    exit 1
}

$projectRoot = "C:\Users\Administrador\YGGNAROK"
$iterationFile = "$projectRoot\.hermes-daemon\war-room\last-iteration.json"
$memoryFile = "$projectRoot\.hermes-daemon\war-room\infinite-memory.json"

# Carrega memoria infinita
if (Test-Path $memoryFile) {
    $mem = Get-Content $memoryFile -Raw | ConvertFrom-Json
} else {
    $mem = @{feedback=@()}
}

# Adiciona feedback
$entry = @{
    timestamp = (Get-Date -Format 'o')
    text = $Feedback
    iteration = if (Test-Path $iterationFile) { (Get-Content $iterationFile -Raw | ConvertFrom-Json).iteration } else { 0 }
}
$mem.feedback += $entry
$mem | ConvertTo-Json -Depth 15 | Out-File $memoryFile -Encoding UTF8

# Marca que precisa de nova iteracao
@{
    timestamp = (Get-Date -Format 'o')
    feedback = $Feedback
    nextIteration = $true
} | ConvertTo-Json | Out-File $iterationFile -Encoding UTF8

Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Feedback registrado: $Feedback"
Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Proxima iteracao do War Room vai considerar isso."

# Dispara Hermes com o feedback
$hermes = "C:\Users\Administrador\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes.exe"
$prompt = "Recebi este feedback do usuario sobre o YGGNAROK: '$Feedback'. Analise o estado atual do projeto, aplique as correcoes necessarias, e prepare a proxima iteracao. Use os sub-agentes e o kanban para coordenar o trabalho."

Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Acionando Hermes com o feedback (usando Msty)..."
$env:OPENAI_API_BASE = "http://localhost:10000/v1"
$env:OPENAI_API_KEY = "msty"
Start-Process -NoNewWindow -FilePath $hermes -ArgumentList "chat", $prompt
