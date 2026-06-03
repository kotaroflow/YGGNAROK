param([switch]$Foreground, [string]$GitEvent = "")
$ErrorActionPreference = "Continue"
$script:projectRoot = "C:\Users\Administrador\YGGNAROK"
$script:stateDir = "$script:projectRoot\.hermes-daemon"
$script:learnFile = "$script:stateDir\workflow.json"
$script:knowledgeFile = "$script:stateDir\knowledge.json"
$script:logFile = "$script:projectRoot\hermes-daemon.log"
$script:debounceMs = 30000
$script:cooldown = @{}
$script:learning = @{activeHours=@{}; errorPatterns=@(); commitPatterns=@()}
$script:knowledge = @{solutions=@(); conventions=@(); bugPatterns=@()}

if (-not (Test-Path $script:stateDir)) { New-Item -ItemType Directory -Path $script:stateDir -Force | Out-Null }

function Log {
    param([string]$Msg, [string]$Level = "INFO")
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [$Level] $Msg"
    Out-File -FilePath $script:logFile -InputObject $line -Append -Encoding UTF8
    if ($Foreground) { Write-Host $line }
}

function LoadJson {
    param([string]$Path)
    if (Test-Path $Path) { return Get-Content $Path -Raw | ConvertFrom-Json }
    return $null
}

function SaveJson {
    param([object]$Data, [string]$Path)
    $Data | ConvertTo-Json -Depth 10 | Out-File $Path -Encoding UTF8
}

function LearnActiveHours {
    $hour = (Get-Date).Hour
    $day = (Get-Date).DayOfWeek
    $key = "$day-$hour"
    if (-not $script:learning.activeHours.$key) { $script:learning.activeHours.$key = 0 }
    $script:learning.activeHours.$key++
    SaveJson $script:learning $script:learnFile
}

function InstallGitHooks {
    $hooksDir = "$script:projectRoot\.git\hooks"
    if (-not (Test-Path $hooksDir)) { return }
    @("post-commit", "post-merge", "post-checkout") | ForEach-Object {
        $hookPath = "$hooksDir\$_"
        if (-not (Test-Path $hookPath)) {
            $content = "#!/bin/sh`npwsh.exe -NoProfile -ExecutionPolicy Bypass -Command `"& 'C:\Users\Administrador\YGGNAROK\scripts\hermes-daemon.ps1' -GitEvent $_`""
            Set-Content -Path $hookPath -Value $content -Encoding UTF8
            Log "Git hook installed: $_"
        }
    }
}

function StartErrorAnalysis {
    $errLog = "$script:projectRoot\dev.err.log"
    $eslintOut = "$script:projectRoot\eslint-output.txt"
    if (Test-Path $errLog) {
        $errors = Get-Content $errLog -Tail 30 | Where-Object { $_ -match "error|Error|ERROR" }
        if ($errors) {
            Log "Erros em dev.err.log: $($errors.Count) linhas" -Level "WARN"
            $patterns = $errors | Select-String -Pattern "Error:|error:|Failed:|Module not found|Cannot find|TypeError|ReferenceError|SyntaxError" | ForEach-Object { $_.Matches.Value } | Group-Object
            foreach ($p in $patterns) {
                if ($p.Count -gt 1) {
                    $script:knowledge.bugPatterns += @{pattern=$p.Name; count=$p.Count; firstSeen=(Get-Date -Format 'o')}
                }
            }
            SaveJson $script:knowledge $script:knowledgeFile
        }
    }
    if (Test-Path $eslintOut) {
        $lintErrors = Get-Content $eslintOut | Where-Object { $_ -match "error" }
        if ($lintErrors) { Log "Erros de lint: $($lintErrors.Count)" -Level "WARN" }
    }
}

function InvokeStagingAudit {
    $stagingDir = "$script:projectRoot\staging"
    if (-not (Test-Path $stagingDir)) { return }
    Log "Auditando staging/..."
    $items = Get-ChildItem $stagingDir -Recurse -File
    $totalSize = ($items | Measure-Object -Property Length -Sum).Sum / 1MB
    Log "Staging: $($items.Count) arquivos, $([math]::Round($totalSize, 2)) MB"
    if (Test-Path "$stagingDir\src") {
        $diff = & git diff --no-index "$script:projectRoot\src\" "$stagingDir\src\" --name-only 2>&1
        if ($diff) { Log "Diferencas entre staging e src: $($diff.Count) arquivos" }
    }
}

function InvokeCouncilDoctor {
    $result = & "npm" --prefix "$script:projectRoot" run council:doctor 2>&1
    if ($LASTEXITCODE -ne 0) {
        Log "Council doctor: ERRO" -Level "WARN"
        Log "Output: $result"
    } else {
        Log "Council doctor: OK"
    }
}

function OnGitCommit {
    Log "Git commit detectado"
    $diff = & git -C "$script:projectRoot" diff HEAD~1..HEAD --name-only 2>&1
    $script:learning.commitPatterns += @{timestamp=(Get-Date -Format 'o'); files=@($diff)}
    SaveJson $script:learning $script:learnFile
    
    $hermesCl = "C:\Users\Administrador\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes.exe"
    if (Test-Path $hermesCl) {
        Log "Injetando Analise Semantica de Commit no Daemon..."
        $diffContent = & git -C "$script:projectRoot" diff HEAD~1..HEAD | Select-Object -First 80 | Out-String
        $promptFile = "$script:stateDir\last-commit-prompt.txt"
        "Analise o diff abaixo e descreva em 1 frase curta a convencao arquitetural ou erro corrigido. Responda APENAS a frase:`n`n$diffContent" | Out-File $promptFile -Encoding UTF8
        
        $psCode = @"
`$ErrorActionPreference = 'SilentlyContinue'
`$prompt = Get-Content `"$promptFile`" -Raw
`$ans = & `"$hermesCl`" -z `$prompt --provider custom -m devstral-gpu-safe:24b | Out-String
if (`$ans.Trim() -and `$ans -notmatch `"Error`") {
    `$kFile = `"$script:knowledgeFile`"
    `$k = if (Test-Path `$kFile) { Get-Content `$kFile -Raw | ConvertFrom-Json } else { @{conventions=@(); solutions=@(); bugPatterns=@()} }
    if (-not `$k.conventions) { `$k | Add-Member -MemberType NoteProperty -Name "conventions" -Value @() }
    `$k.conventions += `$ans.Trim()
    `$k | ConvertTo-Json -Depth 10 | Out-File `$kFile -Encoding UTF8
}
"@
        Set-Content -Path $tmpScript -Value $psCode -Encoding UTF8
        Start-Process pwsh.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$tmpScript`""
    }

    if ($diff -match "staging/") { InvokeStagingAudit }
}

function StartFileWatchers {
    $watched = @{}
    $watched["$script:projectRoot\src"] = "src"
    $watched["$script:projectRoot\staging"] = "staging"
    $watched["$script:projectRoot\worker"] = "worker"

    foreach ($dir in $watched.Keys) {
        if (-not (Test-Path $dir)) { continue }
        $w = New-Object System.IO.FileSystemWatcher
        $w.Path = $dir
        $w.IncludeSubdirectories = $true
        $w.EnableRaisingEvents = $true
        $w.NotifyFilter = [System.IO.NotifyFilters]::FileName -bor [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::DirectoryName
        $label = $watched[$dir]
        Register-ObjectEvent $w "Changed" -Action {
            $path = $Event.SourceEventArgs.FullPath
            $type = $Event.SourceEventArgs.ChangeType
            $now = Get-Date
            $key = "$label-$path"
            if ($script:cooldown.$key -and (($now - $script:cooldown.$key).TotalMilliseconds -lt $script:debounceMs)) { return }
            $script:cooldown.$key = $now
            Log "${label}: $type $path"
            if ($label -eq "staging") { InvokeStagingAudit }
            elseif ($path -match "\.(ts|tsx|js|jsx|css)$") {
                Log "Codigo alterado em ${label}, acionando analise..."
                $ext = [System.IO.Path]::GetExtension($path)
                if ($ext -in ".ts", ".tsx") {
                    $result = & "npx" --no-install tsc --noEmit --pretty 2>&1 | Select-String -Pattern "error TS"
                    if ($LASTEXITCODE -ne 0 -and $result) {
                        Log "ERRO de tipo detectado em $path" -Level "WARN"
                        $script:learning.errorPatterns += @{file=$path; errors=@($result); timestamp=(Get-Date -Format 'o')}
                        SaveJson $script:learning $script:learnFile
                        
                        $hermesCl = "C:\Users\Administrador\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes.exe"
                        if (Test-Path $hermesCl) {
                            Log "CAOS MODO: Auto-Healing background iniciado para $path..."
                            $tmpScript = "$script:stateDir\auto-heal-$([guid]::NewGuid().ToString().Substring(0,8)).ps1"
                            $errText = $result | Out-String
                            $psCode = @"
`$ErrorActionPreference = 'SilentlyContinue'
`$taskFile = `"$script:projectRoot\task.md`"
`$taskCtx = if (Test-Path `$taskFile) { Get-Content `$taskFile -Raw } else { '' }
`$code = Get-Content `"$path`" -Raw
`$promptFile = `"$tmpScript.prompt.txt`"
`"O arquivo $path falhou no TypeCheck com os erros:`n`$errText`nCorrija o codigo e retorne APENAS o codigo corrigido, sem markdown, sem blocos de codigo e sem texto explicativo.`n`nDesign Impeccable Context:`n`$taskCtx`n`nCodigo:`n`$code`" | Out-File `$promptFile -Encoding UTF8
`$prompt = Get-Content `$promptFile -Raw
`$ans = & `"$hermesCl`" -z `$prompt --provider custom -m devstral-gpu-safe:24b | Out-String
if (`$ans.Trim() -and `$ans -notmatch `"Error`") {
    `$fixedPath = `"$path.auto-fix`"
    `$cleanAns = `$ans -replace '^(```[\w]*\s*)', '' -replace '(```\s*)$', ''
    `$cleanAns.Trim() | Out-File `$fixedPath -Encoding UTF8
    Add-Content -Path `"$script:logFile`" -Value `"[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [INFO] Auto-Heal concluiu: `$fixedPath gerado com sucesso.`"
    
    # Injetar o status do Auto-Heal no War Room Dashboard
    `$stateFile = `"$script:projectRoot\.hermes-daemon\orchestra\state.json`"
    if (Test-Path `$stateFile) {
        `$st = Get-Content `$stateFile -Raw | ConvertFrom-Json
        `$st.totalFixes++
        if (-not `$st.agents) { `$st | Add-Member -MemberType NoteProperty -Name "agents" -Value @{} }
        `$agName = "Auto-Healer"
        `$fileName = Split-Path `$fixedPath -Leaf
        `$agObj = @{status="done"; detail="Fix gerado: `$fileName"; color="green"; updatedAt=(Get-Date -Format 'HH:mm:ss')}
        `$st.agents | Add-Member -MemberType NoteProperty -Name `$agName -Value `$agObj -Force
        `$st | ConvertTo-Json -Depth 15 | Out-File `$stateFile -Encoding UTF8
    }
}
Remove-Item `$promptFile -ErrorAction Ignore
Remove-Item `"$tmpScript`" -ErrorAction Ignore
"@
                            Set-Content -Path $tmpScript -Value $psCode -Encoding UTF8
                            Start-Process pwsh.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$tmpScript`""
                        }
                    }
                }
            }
        } | Out-Null
        Register-ObjectEvent $w "Created" -Action {
            $path = $Event.SourceEventArgs.FullPath
            $type = $Event.SourceEventArgs.ChangeType
            $now = Get-Date
            $key = "${label}-created-$path"
            if ($script:cooldown.$key -and (($now - $script:cooldown.$key).TotalMilliseconds -lt $script:debounceMs)) { return }
            $script:cooldown.$key = $now
            Log "${label}: CREATED $path"
            
            # Zero-Boilerplate Chaos Mode
            if ($path -match "\.tsx$" -and (Test-Path $path)) {
                $fileInfo = Get-Item $path
                if ($fileInfo.Length -lt 20) {
                    $hermesCl = "C:\Users\Administrador\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes.exe"
                    if (Test-Path $hermesCl) {
                        Log "CAOS MODO: Injetando Boilerplate Neural em $path..."
                        $tmpScript = "$script:stateDir\auto-boiler-$([guid]::NewGuid().ToString().Substring(0,8)).ps1"
                        $fileName = Split-Path $path -Leaf
                        $psCode = @"
`$ErrorActionPreference = 'SilentlyContinue'
`$kFile = `"$script:knowledgeFile`"
`$kCtx = if (Test-Path `$kFile) { Get-Content `$kFile -Raw } else { '' }
`$taskFile = `"$script:projectRoot\task.md`"
`$taskCtx = if (Test-Path `$taskFile) { Get-Content `$taskFile -Raw } else { '' }
`$promptFile = `"$tmpScript.prompt.txt`"
`"O desenvolvedor criou um arquivo React vazio chamado '$fileName'. Escreva o codigo base do componente usando React 19, Tailwind CSS 4, lucide-react e o design system 'Void & Amber' com Estética Otaku Premium/Seinen (Akira/Evangelion). Use retículas sutis, cortes retos táticos e bordas finas de HUD. Retorne APENAS o codigo puro, sem tags markdown, sem blocos de codigo e sem explicacao:\n\nConhecimento Geral:\n`$kCtx\n\nDiretrizes de Design (Impeccable):\n`$taskCtx`" | Out-File `$promptFile -Encoding UTF8
`$prompt = Get-Content `$promptFile -Raw
`$ans = & `"$hermesCl`" -z `$prompt --provider custom -m devstral-gpu-safe:24b | Out-String
if (`$ans.Trim() -and `$ans -notmatch `"Error`") {
    `$cleanAns = `$ans -replace '^(```[\w]*\s*)', '' -replace '(```\s*)$', ''
    `$cleanAns.Trim() | Out-File `"$path`" -Encoding UTF8
    Add-Content -Path `"$script:logFile`" -Value `"[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [INFO] Zero-Boilerplate injetado em: `$fileName`"
    
    # Injetar o status do Zero-Boilerplate no War Room Dashboard
    `$stateFile = `"$script:projectRoot\.hermes-daemon\orchestra\state.json`"
    if (Test-Path `$stateFile) {
        `$st = Get-Content `$stateFile -Raw | ConvertFrom-Json
        if (-not `$st.agents) { `$st | Add-Member -MemberType NoteProperty -Name "agents" -Value @{} }
        `$agName = "Architect"
        `$agObj = @{status="done"; detail="Boilerplate gerado: `$fileName"; color="blue"; updatedAt=(Get-Date -Format 'HH:mm:ss')}
        `$st.agents | Add-Member -MemberType NoteProperty -Name `$agName -Value `$agObj -Force
        `$st | ConvertTo-Json -Depth 15 | Out-File `$stateFile -Encoding UTF8
    }
}
Remove-Item `$promptFile -ErrorAction Ignore
Remove-Item `"$tmpScript`" -ErrorAction Ignore
"@
                        Set-Content -Path $tmpScript -Value $psCode -Encoding UTF8
                        Start-Process pwsh.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$tmpScript`""
                    }
                }
            }
        } | Out-Null
        Register-ObjectEvent $w "Deleted" -Action {
            Log "${label}: DELETED $($Event.SourceEventArgs.FullPath)"
        } | Out-Null
        Log "Watching: $dir"
    }

    # Watch logs
    $logFilePaths = @("$script:projectRoot\dev.err.log")
    foreach ($f in $logFilePaths) {
        if (-not (Test-Path $f)) { continue }
        $parent = Split-Path $f -Parent
        $filename = Split-Path $f -Leaf
        $w = New-Object System.IO.FileSystemWatcher
        $w.Path = $parent
        $w.Filter = $filename
        $w.EnableRaisingEvents = $true
        $w.NotifyFilter = [System.IO.NotifyFilters]::LastWrite
        Register-ObjectEvent $w "Changed" -Action { Log "Log alterado, analisando..."; StartErrorAnalysis } | Out-Null
    }
}

function StartDaemon {
    Log ("=" * 40)
    Log "HERMES AUTO-DAEMON - MODO CAOS ATIVADO"
    Log "Projeto: $script:projectRoot"
    Log ("=" * 40)
    $loaded = LoadJson $script:learnFile
    if ($loaded) { $script:learning = $loaded }
    $loadedK = LoadJson $script:knowledgeFile
    if ($loadedK) { $script:knowledge = $loadedK }
    LearnActiveHours
    InstallGitHooks
    if ($GitEvent) { Log "Git event: $GitEvent"; if ($GitEvent -eq "post-commit") { OnGitCommit }; return }
    StartFileWatchers
    StartErrorAnalysis
    InvokeCouncilDoctor
    Log "Daemon rodando em background. Ctrl+C para parar."
    Log "========================================"
    while ($true) {
        Start-Sleep -Seconds 300
        LearnActiveHours
        $min = (Get-Date).Minute
        if ($min -eq 0 -or $min -eq 30) { StartErrorAnalysis }
        if ($min -eq 15 -or $min -eq 45) { InvokeCouncilDoctor }
    }
}

StartDaemon
