param([string]$TargetFile = "")

$ErrorActionPreference = "SilentlyContinue"
$projectRoot = "C:\Users\Administrador\YGGNAROK"
$hermesCl = "C:\Users\Administrador\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes.exe"
if (-not (Test-Path $hermesCl)) { exit 0 }

$env:OPENAI_API_BASE = 'http://localhost:10000/v1'
$env:OPENAI_API_KEY = 'msty'

$kFile = "$projectRoot\.hermes-daemon\knowledge.json"
$tFile = "$projectRoot\task.md"
$kCtx = if (Test-Path $kFile) { Get-Content $kFile -Raw } else { "" }
$tCtx = if (Test-Path $tFile) { Get-Content $tFile -Raw } else { "" }

if ($TargetFile -and (Test-Path $TargetFile)) {
    $targetPath = $TargetFile
    $targetName = Split-Path $TargetFile -Leaf
} else {
    $recentFiles = Get-ChildItem -Path "$projectRoot\src\components" -Filter "*.tsx" -Recurse | 
        Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-5) } | 
        Sort-Object LastWriteTime -Descending
    if ($recentFiles.Count -eq 0) { exit 0 }
    $targetPath = $recentFiles[0].FullName
    $targetName = $recentFiles[0].Name
}

$code = Get-Content $targetPath -Raw

# 1. Pipeline de Geracao de Imagem Neural via ComfyUI
$regexImg = '(?i)(?://\s*|\{/\*\s*)?@(?:img|imagem)\("([^"]+)"\)(?:\s*\*/\})?'
$matchesImg = [regex]::Matches($code, $regexImg)

if ($matchesImg.Count -gt 0) {
    Write-Host "[Art Director] Detectado pedido de geracao de arte neural..." -ForegroundColor Cyan
    
    foreach ($m in $matchesImg) {
        $imgPrompt = $m.Groups[1].Value
        Write-Host "-> Pintando: $imgPrompt"
        
        $output = & pwsh.exe -NoProfile -ExecutionPolicy Bypass -File "$projectRoot\scripts\hermes-comfy.ps1" -Prompt $imgPrompt
        $resLine = $output | Where-Object { $_ -match "RESULT:(.*)" }
        
        if ($resLine) {
            $imgName = ($resLine -split "RESULT:")[1].Trim()
            $imgTag = "<img src=`"/assets/ai/$imgName`" alt=`"$imgPrompt`" className=`"w-full h-auto object-cover rounded-lg border border-white/10 shadow-lg`" />"
            
            # Substitui o comentario pela tag HTML com a arte gerada
            $code = $code.Replace($m.Value, $imgTag)
            Write-Host "-> Injetado: $imgName no codigo!" -ForegroundColor Green
        }
    }
    # Salva o arquivo modificado antes de continuar
    $code | Out-File $targetPath -Encoding UTF8
}

# Pular se já tem selo de qualidade ou se for muito pequeno
if ($code -match "HUASHU_APPROVED") { exit 0 }
if ($code.Length -lt 30) { exit 0 }

$promptFile = "$projectRoot\.hermes-daemon\temp-art-prompt.txt"
$prompt = @"
Voce e o Diretor de Arte Sênior (Huashu Design) do projeto YGGNAROK.
Avalie o componente React abaixo. Procure agressivamente por:
1. 'AI Slop' (cores padrao do tailwind como bg-blue-500, sombras shadow-xl soltas, icones emoji, cantos excessivamente arredondados).
2. Desvios do design system Void & Amber (que exige tons de slate/stone, acentos com --brand e glassmorphism via backdrop-blur e bg-white/X).
3. Texto denso sem a classe 'text-wrap: pretty'.
4. Falta de hierarquia visual e micro-interações (hover states premium).

Se houver qualquer sinal de design generico ou slop, REESCREVA O COMPONENTE INTEIRO elevando-o ao padrao Premium de arte e design.
Se ele ja estiver no nivel de um Diretor de Arte, responda APENAS a palavra PERFEITO.

IMPORTANTE: 
1. Ao reescrever, ADICIONE A LINHA `// HUASHU_APPROVED` no topo do arquivo.
2. Retorne APENAS o codigo puro para drop-in replacement. Sem markdown, sem backticks e sem explicacoes verbais.

Conhecimento Huashu Design:
$kCtx

Impeccable Context:
$tCtx

Codigo Original:
$code
"@

$prompt | Out-File $promptFile -Encoding UTF8

$ans = & $hermesCl chat (Get-Content $promptFile -Raw) | Out-String

if ($ans.Trim() -and $ans -notmatch "Error" -and $ans -notmatch "PERFEITO") {
    $cleanAns = $ans -replace '^(```[\w]*\s*)', '' -replace '(```\s*)$', ''
    if ($cleanAns.Length -gt 50) {
        $cleanAns.Trim() | Out-File $targetPath -Encoding UTF8
        Write-Host "Polimento finalizado em $targetName" -ForegroundColor Green
        
        $stateFile = "$projectRoot\.hermes-daemon\orchestra\state.json"
        if (Test-Path $stateFile) {
            $st = Get-Content $stateFile -Raw | ConvertFrom-Json
            if (-not $st.agents) { $st | Add-Member -MemberType NoteProperty -Name "agents" -Value @{} }
            $agName = "Art Director"
            $agObj = @{status="done"; detail="Design refatorado em $targetName"; color="magenta"; updatedAt=(Get-Date -Format 'HH:mm:ss')}
            $st.agents | Add-Member -MemberType NoteProperty -Name $agName -Value $agObj -Force
            $st | ConvertTo-Json -Depth 15 | Out-File $stateFile -Encoding UTF8
        }
    }
}
Remove-Item $promptFile -ErrorAction Ignore
exit 0
