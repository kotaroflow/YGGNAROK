param(
    [string]$Prompt = "A futuristic server room in void and amber colors, cinematic lighting, 8k resolution, masterpiece",
    [string]$OutputPath = "C:\Users\Administrador\YGGNAROK\public\assets\ai",
    [string]$Filename = "hermes_$(Get-Date -Format 'yyyyMMdd_HHmmss').png"
)

$ErrorActionPreference = "Stop"
$comfyUrl = "http://127.0.0.1:8188"
$templateFile = "C:\Users\Administrador\YGGNAROK\.hermes-daemon\comfy-template.json"

if (-not (Test-Path $templateFile)) {
    Write-Host "Erro: Arquivo de template do ComfyUI nao encontrado." -ForegroundColor Red
    exit 1
}

# Criar diretorio de saida se nao existir
if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Force -Path $OutputPath | Out-Null
}

Write-Host "🎨 [Hermes ComfyUI] Iniciando geracao neural de arte..." -ForegroundColor Magenta
Write-Host "Prompt: $Prompt"

# 1. Preparar o JSON do workflow
$workflowJsonRaw = Get-Content $templateFile -Raw
$workflowJsonRaw = $workflowJsonRaw -replace '\{\{PROMPT\}\}', $Prompt
# Randomizar seed
$randomSeed = Get-Random -Minimum 1 -Maximum 999999999
$workflowObj = $workflowJsonRaw | ConvertFrom-Json
$workflowObj."3".inputs.seed = $randomSeed

$payload = @{
    prompt = $workflowObj
} | ConvertTo-Json -Depth 10

# 2. Enviar prompt para a API do ComfyUI
try {
    $response = Invoke-RestMethod -Uri "$comfyUrl/prompt" -Method Post -Body $payload -ContentType "application/json"
    $promptId = $response.prompt_id
    Write-Host "✅ Prompt enviado! ID da Tarefa: $promptId" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao contatar ComfyUI. Ele esta rodando na porta 8188?" -ForegroundColor Red
    exit 1
}

# 3. Aguardar a geracao terminar (Polling history)
$isDone = $false
$generatedImageName = ""
Write-Host "⏳ Aguardando renderizacao na GPU..." -NoNewline

while (-not $isDone) {
    Start-Sleep -Seconds 2
    Write-Host "." -NoNewline
    
    try {
        $history = Invoke-RestMethod -Uri "$comfyUrl/history/$promptId" -Method Get
        if ($history.$promptId) {
            $isDone = $true
            # Extrair o nome da imagem salva (Node 9)
            $outputs = $history.$promptId.outputs
            if ($outputs."9") {
                $generatedImageName = $outputs."9".images[0].filename
            }
        }
    } catch {
        # Continua tentando
    }
}
Write-Host " Concluido!" -ForegroundColor Green

# 4. Baixar a imagem gerada
if ($generatedImageName) {
    $downloadUrl = "$comfyUrl/view?filename=$generatedImageName&type=output"
    $finalPath = Join-Path $OutputPath $Filename
    
    Invoke-WebRequest -Uri $downloadUrl -OutFile $finalPath
    Write-Host "🖼️ Imagem salva com sucesso em: $finalPath" -ForegroundColor Cyan
    
    # Atualizar o Dashboard War Room
    $stateFile = "C:\Users\Administrador\YGGNAROK\.hermes-daemon\orchestra\state.json"
    if (Test-Path $stateFile) {
        $st = Get-Content $stateFile -Raw | ConvertFrom-Json
        if (-not $st.agents) { $st | Add-Member -MemberType NoteProperty -Name "agents" -Value @{} }
        $st.agents | Add-Member -MemberType NoteProperty -Name "Ilustrador Neural" -Value @{status="done"; detail="Arte gerada: $Filename"; color="blue"; updatedAt=(Get-Date -Format 'HH:mm:ss')} -Force
        $st | ConvertTo-Json -Depth 15 | Out-File $stateFile -Encoding UTF8
    }
    
    # Retorno para o Art Director ler
    Write-Output "RESULT:$Filename"
} else {
    Write-Host "⚠️ Imagem nao encontrada no retorno do ComfyUI." -ForegroundColor Yellow
}
