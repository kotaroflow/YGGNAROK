# 👑 Hermes Council (Mixture of Agents - CHAOS MODE)
$ErrorActionPreference = "SilentlyContinue"
$projectRoot = "C:\Users\Administrador\YGGNAROK"
$hermesCl = "C:\Users\Administrador\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes.exe"
if (-not (Test-Path $hermesCl)) { exit 0 }

$env:OPENAI_API_BASE = 'http://localhost:10000/v1'
$env:OPENAI_API_KEY = 'msty'

# Encontrar o ultimo arquivo modificado nos ultimos 10 min
$recentFiles = Get-ChildItem -Path "$projectRoot\src\components" -Filter "*.tsx" -Recurse | 
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-10) } | 
    Sort-Object LastWriteTime -Descending

if ($recentFiles.Count -eq 0) { exit 0 }
$target = $recentFiles[0]
$code = Get-Content $target.FullName -Raw

# Se já passou pelo conselho
if ($code -match "COUNCIL_APPROVED") { exit 0 }
if ($code.Length -lt 50) { exit 0 }

# Definição do Exército de Agentes
$agents = @(
    @{
        id="Performance"
        name="Engenheiro de Performance"
        color="yellow"
        prompt="Voce e um Engenheiro de Performance React Sênior. Analise o componente abaixo. Se houver mapeamentos pesados sem 'useMemo', funcoes de callback recriadas sem 'useCallback', ou re-renders obvios, REESCREVA O CODIGO para otimiza-lo. Se estiver leve e otimizado, responda APENAS 'PERFEITO'."
    },
    @{
        id="Accessibility"
        name="Guardião de A11y"
        color="green"
        prompt="Voce e o Auditor de Acessibilidade. Verifique o componente abaixo. Adicione 'aria-labels' onde faltar, garanta que botoes tenham contrastes e tipos corretos, e que elementos interativos tenham semantica (roles). Se ja estiver acessivel, responda APENAS 'PERFEITO'."
    },
    @{
        id="Architect"
        name="Arquiteto Chefe"
        color="cyan"
        prompt="Voce e o Arquiteto de Software do YGGNAROK. Avalie o codigo abaixo. Remova importacoes nao utilizadas, garanta que as interfaces TypeScript estao exportadas corretamente e organize o codigo de forma limpa. Se estiver bem estruturado, responda APENAS 'PERFEITO'."
    },
    @{
        id="MotionUI"
        name="Coreógrafo de Interface"
        color="magenta"
        prompt="Voce e um Mestre em Motion Design (GSAP/Tailwind). Analise o componente. Injete transicoes suaves ('transition-all duration-300 ease-out'), efeitos de 'hover' cinemáticos (scale, glow no backdrop-blur) e micro-interacoes usando APENAS Tailwind CSS. Nao use useEffect ou JS se o Tailwind resolver. Se ja estiver animado e fluido, responda APENAS 'PERFEITO'."
    },
    @{
        id="UXWriter"
        name="UX Writer Sênior"
        color="white"
        prompt="Voce e o Editor Chefe do YGGNAROK. A base deste projeto e a cultura de Animes e Mangas. Reescreva todos os textos, placeholders e labels do componente para usar essa nomenclatura (ex: 'Quests/Missoes' em vez de Tarefas, 'Guilda' em vez de Equipe, 'Arcos' em vez de Projetos, 'Grimorio' em vez de Biblioteca). Mantenha tudo em pt-BR de forma epica, sombria (estilo Seinen/Evangelion) mas extremamente funcional."
    },
    @{
        id="Composer"
        name="Maestro de Trilha Sonora"
        color="blue"
        prompt="Voce e o Maestro e Compositor de Trilha Sonora do YGGNAROK. Analise o componente e a energia visual dele. Adicione ao topo do componente (antes do codigo, logo apos a linha '// COUNCIL_APPROVED') um bloco de comentario decorativo em formato de HUD (Anime style) chamado 'MUSIC_MOOD_BOARD'. Nesse bloco, indique: 1. Estilo Musical (ex: Industrial Cyberpunk, Orchestral Mecha), 2. BPM sugerido, 3. Instrumentacao Principal (ex: Synthesizers, Taiko Drums, Distorted Bass), e 4. O Prompt de Audio exato para rodar no MusicGen local (ex: 'cyberpunk beats, low bass, fast tempo, dark amber neon'). Retorne o codigo completo contendo esse bloco no topo."
    }
)

Write-Host "👑 Invocando o Conselho de IA (MOA) para $($target.Name)..." -ForegroundColor Magenta

$currentCode = $code
$changesMade = $false

foreach ($ag in $agents) {
    Write-Host "-> $($ag.name) analisando..." -ForegroundColor $ag.color
    
    $promptFile = "$projectRoot\.hermes-daemon\temp-council-$($ag.id).txt"
    $fullPrompt = "$($ag.prompt)`n`nIMPORTANTE: Retorne APENAS o codigo puro atualizado. Sem crases markdown, sem a palavra typescript.`n`nCodigo Atual:`n$currentCode"
    $fullPrompt | Out-File $promptFile -Encoding UTF8
    
    $ans = & $hermesCl chat (Get-Content $promptFile -Raw) | Out-String
    
    if ($ans.Trim() -and $ans -notmatch "Error" -and $ans -notmatch "PERFEITO") {
        $cleanAns = $ans -replace '^(```[\w]*\s*)', '' -replace '(```\s*)$', ''
        if ($cleanAns.Length -gt 50) {
            $currentCode = $cleanAns.Trim()
            $changesMade = $true
            
            # Atualiza o War Room
            $stateFile = "$projectRoot\.hermes-daemon\orchestra\state.json"
            if (Test-Path $stateFile) {
                $st = Get-Content $stateFile -Raw | ConvertFrom-Json
                if (-not $st.agents) { $st | Add-Member -MemberType NoteProperty -Name "agents" -Value @{} }
                $st.agents | Add-Member -MemberType NoteProperty -Name $ag.name -Value @{status="done"; detail="Auditoria completa"; color=$ag.color; updatedAt=(Get-Date -Format 'HH:mm:ss')} -Force
                $st | ConvertTo-Json -Depth 15 | Out-File $stateFile -Encoding UTF8
            }
            Write-Host "   [$($ag.name)] Modificacoes aplicadas!" -ForegroundColor Green
        }
    }
    Remove-Item $promptFile -ErrorAction Ignore
}

if ($changesMade) {
    Write-Host "👑 Invocando o Supervisor Supremo (Odin) para a sintese final..." -ForegroundColor Gold
    
    $promptFile = "$projectRoot\.hermes-daemon\temp-council-supervisor.txt"
    $superPrompt = "Você é o Supervisor Supremo do Conselho de IA do YGGNAROK (Odin). Seu papel é realizar a síntese final de todas as propostas feitas pelos especialistas (Performance, Acessibilidade, Design, UX Writing e Trilha Sonora) no código acumulado abaixo. Resolva quaisquer conflitos lógicos ou estéticos. Garanta que as animações de Tailwind não entrem em conflito com a acessibilidade e que o tom Seinen/Manga do UX Writer não tenha quebrado o fluxo de tipos do TypeScript ou destruído imports essenciais. Retorne APENAS o código final refinado e unificado, sem tags markdown, sem blocos de código e sem explicações.`n`nOriginal:`n$code`n`nCódigo Acumulado:`n$currentCode"
    $superPrompt | Out-File $promptFile -Encoding UTF8
    
    $ans = & $hermesCl chat (Get-Content $promptFile -Raw) | Out-String
    if ($ans.Trim() -and $ans -notmatch "Error") {
        $cleanAns = $ans -replace '^(```[\w]*\s*)', '' -replace '(```\s*)$', ''
        if ($cleanAns.Length -gt 50) {
            $currentCode = $cleanAns.Trim()
            
            # Atualiza o War Room
            $stateFile = "$projectRoot\.hermes-daemon\orchestra\state.json"
            if (Test-Path $stateFile) {
                $st = Get-Content $stateFile -Raw | ConvertFrom-Json
                if (-not $st.agents) { $st | Add-Member -MemberType NoteProperty -Name "agents" -Value @{} }
                $st.agents | Add-Member -MemberType NoteProperty -Name "Supervisor Odin" -Value @{status="done"; detail="Sintese final concluida com harmonia"; color="yellow"; updatedAt=(Get-Date -Format 'HH:mm:ss')} -Force
                $st | ConvertTo-Json -Depth 15 | Out-File $stateFile -Encoding UTF8
            }
            Write-Host "   [Supervisor Odin] Sintese concluida sem conflitos!" -ForegroundColor Yellow
        }
    }
    Remove-Item $promptFile -ErrorAction Ignore

    $currentCode = "// COUNCIL_APPROVED`n" + $currentCode
    $currentCode | Out-File $target.FullName -Encoding UTF8
    Write-Host "✅ Todos os agentes terminaram. Codigo unificado e blindado pelo Supervisor Odin." -ForegroundColor Green
} else {
    $currentCode = "// COUNCIL_APPROVED`n" + $currentCode
    $currentCode | Out-File $target.FullName -Encoding UTF8
}
exit 0
