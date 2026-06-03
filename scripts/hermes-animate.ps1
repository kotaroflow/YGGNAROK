# 🎬 Agente de Animação Neural (AnimateDiff Local)
param(
    [string]$Prompt = "A beautiful cyber otaku coding, glowing amber screens, particles flying, masterwork"
)

$ErrorActionPreference = "Continue"
$projectRoot = "C:\Users\Administrador\YGGNAROK"
$comfyUrl = "http://127.0.0.1:8188"
$templatePath = "$projectRoot\.hermes-daemon\comfy-templates\animate-template.json"
$outputDir = "$projectRoot\public\assets\ai"

if (-not (Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir -Force | Out-Null }

Write-Host "🎬 [Motion Engine] Carregando template de Animacao..." -ForegroundColor Magenta

if (-not (Test-Path $templatePath)) {
    Write-Host "❌ Template de animacao nao encontrado em $templatePath" -ForegroundColor Red
    exit 1
}

# Carrega e injeta o prompt
$json = Get-Content $templatePath -Raw
$injectedJson = $json.Replace("{{PROMPT}}", $Prompt)

# Gera seed aleatoria
$seed = Get-Random -Minimum 1 -Maximum 999999999
$injectedJson = $injectedJson.Replace('"seed": 42', '"seed": ' + $seed)

Write-Host "🚀 Enviando comando de animacao (16 frames) para o ComfyUI local..." -ForegroundColor Cyan
Write-Host "-> Prompt: $Prompt" -ForegroundColor Yellow

$headers = @{"Content-Type" = "application/json"}
try {
    $res = Invoke-RestMethod -Uri "$comfyUrl/prompt" -Method Post -Body $injectedJson -Headers $headers
    $promptId = $res.prompt_id
    Write-Host "🎯 Animacao enviada com sucesso! ID da Tarefa: $promptId" -ForegroundColor Green
} catch {
    Write-Host "❌ Nao foi possivel conectar ao ComfyUI na porta 8188. Certifique-se de que ele esta aberto!" -ForegroundColor Red
    exit 1
}

# Monitorando a geracao
Write-Host "⏳ Renderizando frames em background (isso pode levar de 30 a 60 segundos)..." -ForegroundColor Cyan
$done = $false
$attempts = 0

while (-not $done) {
    Start-Sleep -Seconds 3
    $attempts++
    
    try {
        $history = Invoke-RestMethod -Uri "$comfyUrl/history/$promptId" -Method Get
        if ($history.$promptId) {
            $done = $true
            # Captura a saida do node combine
            $outputs = $history.$promptId.outputs
            # Encontra o node 8 (AnimateDiffCombine)
            $gifData = $outputs."8".gifs[0]
            $filename = $gifData.filename
            
            $downloadUrl = "$comfyUrl/view?filename=$filename&type=output"
            $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
            $finalFilename = "hermes_anim_$timestamp.gif"
            $finalPath = "$outputDir\$finalFilename"
            
            Write-Host "📥 Baixando arquivo final de animacao (.gif)..." -ForegroundColor Cyan
            Invoke-WebRequest -Uri $downloadUrl -OutFile $finalPath
            Write-Host "🎉 [MOTION ENGINE COMPLETO] Animacao salva em: $finalPath" -ForegroundColor Green
            
            # Atualiza o painel do War Room
            $stateFile = "$projectRoot\.hermes-daemon\orchestra\state.json"
            if (Test-Path $stateFile) {
                $st = Get-Content $stateFile -Raw | ConvertFrom-Json
                if (-not $st.agents) { $st | Add-Member -MemberType NoteProperty -Name "agents" -Value @{} }
                $st.agents | Add-Member -MemberType NoteProperty -Name "Coreógrafo de Interface" -Value @{status="done"; detail="Animacao gerada: $finalFilename"; color="magenta"; updatedAt=(Get-Date -Format 'HH:mm:ss')} -Force
                $st | ConvertTo-Json -Depth 15 | Out-File $stateFile -Encoding UTF8
            }
            
            # Retorno progamático
            Write-Output "RESULT:$finalFilename"
        }
    } catch {
        # Silencia erros temporarios de rede
    }
    
    if ($attempts -gt 40) {
        Write-Host "⚠️ Tempo limite de geracao esgotado." -ForegroundColor Yellow
        exit 1
    }
}
exit 0
