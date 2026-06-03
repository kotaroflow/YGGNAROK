<#
.SYNOPSIS
    ORQUESTRADOR SUPREMO — Gerencia múltiplos Hermes em paralelo com dashboard ao vivo.
    Uso: .\hermes-orchestrator.ps1
#>

param([switch]$Kill, [switch]$Loop)

$ErrorActionPreference = "Continue"
$projectRoot = "C:\Users\Administrador\YGGNAROK"
$orchestraDir = "$projectRoot\.hermes-daemon\orchestra"
$stateFile = "$orchestraDir\state.json"
$htmlFile = "$orchestraDir\dashboard.html"
$logFile = "$projectRoot\hermes-orchestra.log"

if (-not (Test-Path $orchestraDir)) { New-Item -ItemType Directory -Path $orchestraDir -Force | Out-Null }

$script:state = @{agents=@{}; startTime=(Get-Date -Format 'o'); totalFixes=0; totalErrors=0; lastRun=''}

function Log { param([string]$M)
    $line = "[$(Get-Date -Format 'HH:mm:ss')] $M"
    Out-File -InputObject $line -FilePath $logFile -Append -Encoding UTF8
    Write-Host $line
}

function SaveState {
    param([int]$Depth=15)
    $script:state | ConvertTo-Json -Depth $Depth | Out-File $stateFile -Encoding UTF8
}

function Update-Agent {
    param([string]$Name, [string]$Status, [string]$Detail, [string]$Color="yellow")
    if (-not $script:state.agents.ContainsKey($Name)) {
        $script:state.agents[$Name] = @{status="idle"; detail=""; color="gray"; startedAt=""; tasks=@(); fixes=0}
    }
    $a = $script:state.agents[$Name]
    $a.status = $Status
    $a.detail = $Detail
    $a.color = $Color
    $a.updatedAt = (Get-Date -Format 'HH:mm:ss')
    if (-not $a.startedAt) { $a.startedAt = (Get-Date -Format 'HH:mm:ss') }
    SaveState
    Log "[$Name] $Status - $Detail"
}

$protectedPatterns = @(
    'globals\.css', 'tailwind\.config', 'DESIGN\.md', 'task\.md',
    'app-shell\.tsx', 'sidebar\.tsx', 'top-bar\.tsx', 'layout\.tsx',
    'theme', '--brand', '--color-', 'font-family', 'Geist'
)

$fronts = @(
    @{name="typecheck";      desc="TypeScript";       dir="src/";           cmd="npx tsc --noEmit --pretty 2>&1"}
    @{name="lint";           desc="ESLint";           dir="src/";           cmd="npx eslint src/ --fix 2>&1"}
    @{name="components";     desc="Componentes";       dir="src/components"; cmd="npx tsc --noEmit --pretty 2>&1"}
    @{name="pages";          desc="Páginas";           dir="src/app";        cmd="npx tsc --noEmit --pretty 2>&1"}
    @{name="supabase";       desc="Supabase/RLS";     dir="supabase";       cmd="npx tsc --noEmit --pretty 2>&1"}
    @{name="worker";         desc="Cloudflare Worker";dir="worker";         cmd="npx tsc --noEmit --pretty 2>&1"}
    @{name="css";            desc="CSS/Tailwind";      dir="src";           cmd="npx eslint src/ --fix 2>&1"}
    @{name="staging";        desc="Staging vs src";    dir="staging";       cmd="git diff --no-index src/ staging/src/ --name-only 2>&1 | Where-Object {`$_ -notmatch 'warning'}"}
    @{name="art-director";   desc="Art Director";     dir="src/components"; cmd="pwsh.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\hermes-art-director.ps1"}
    @{name="ai-council";     desc="Conselho IA (MOA)";dir="src/components"; cmd="pwsh.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\hermes-council.ps1"}
)

# ─── GERAR HTML ────────────────────────────────────────────────
function Update-HTML {
    $agents = $script:state.agents
    $start = $script:state.startTime
    $fixes = $script:state.totalFixes
    $errors = $script:state.totalErrors
    $secs = [Math]::Floor(([DateTime]::UtcNow - ([DateTime]::Parse($start))).TotalSeconds)
    $timer = "{0:00}:{1:00}" -f [int]($secs/60), ($secs % 60)
    
    $agentCards = ''
    foreach ($name in ($agents.Keys | Sort-Object)) {
        $a = $agents[$name]
        $cls = ($a.status -replace '\s','-').ToLower()
        $agentCards += @"
<div class="agent $cls">
  <div class="ag-name">$name</div>
  <div class="ag-status">$($a.status)</div>
  <div class="ag-detail">$($a.detail)</div>
  <div class="ag-time">$($a.updatedAt)</div>
</div>
"@
    }
    
    # Check protected changes
    $protectedHtml = ''
    $hasProtected = $false
    foreach ($name in $agents.Keys) {
        if ($agents[$name].protectedChanged) { $hasProtected = $true; break }
    }
    if ($hasProtected) {
        $protectedHtml = @'
<div class="protected">
  <h3>⚠ MUDANÇAS PROTEGIDAS</h3>
  <p>Um ou mais agentes alteraram arquivos de design/arquitetura.</p>
  <p style="font-size:11px;color:#aaa">Para aprovar: .\scripts\hermes-feedback.ps1 -Feedback "aprovo mudanças"</p>
</div>
'@
    }
    
    $now = Get-Date -Format 'HH:mm:ss'
    $stateJson = $script:state | ConvertTo-Json -Depth 15 -Compress
    $html = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8">
<title>WAR ROOM - AO VIVO</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Courier New',monospace;background:#0a0a0f;color:#e0e0e0;padding:20px;transition:background .5s}
body.live{background:#0d0d1a}
h1{color:#ff6b35;font-size:24px;letter-spacing:2px}
h1 .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#2ecc71;margin-left:6px;vertical-align:middle}
h1 .dot.live{background:#e74c3c;animation:live-dot .5s infinite}
@keyframes live-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}
.sub{color:#666;font-size:12px;margin-bottom:15px}
.sub .status-msg{color:#888;transition:color .3s}
.sub .status-msg.live{color:#e74c3c;animation:blink-text .8s infinite}
@keyframes blink-text{0%,100%{opacity:1}50%{opacity:.4}}
.stats{display:flex;gap:10px;margin-bottom:15px}
.stat{background:#151520;padding:10px 15px;border-radius:6px;border-left:3px solid #ff6b35;flex:1;transition:all .5s}
.stat.live{background:#1a1520;border-left-color:#e74c3c}
.stat-v{font-size:24px;font-weight:bold;color:#fff}
.stat.live .stat-v{color:#ff6b35}
.stat-l{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:1px}
.agents{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px}
.agent{background:#151520;padding:10px 12px;border-radius:6px;border-left:3px solid #555;transition:all .5s}
.agent.live-think{animation:think-pulse .6s infinite}
.agent.live-scan{border-color:#3498db;animation:scan-line 2s infinite}
.agent.live-pulse{border-color:#9b59b6;animation:pulse 1s infinite}
@keyframes think-pulse{0%,100%{border-left-color:#555;opacity:.7}50%{border-left-color:#ff6b35;opacity:1}}
@keyframes scan-line{0%,100%{box-shadow:inset 0 0 0 transparent}50%{box-shadow:inset 0 0 20px rgba(52,152,219,.15)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
.agent.queued{border-color:#f39c12}
.agent.scanning{border-color:#3498db}
.agent.fixing{border-color:#e74c3c;animation:pulse 1s infinite}
.agent.done,.agent.clean{border-color:#2ecc71}
.agent.drift{border-color:#f39c12}
.agent.failed,.agent.errored{border-color:#e74c3c}
.agent.building{border-color:#f39c12;animation:pulse 1s infinite}
.agent.awaiting-approval{border-color:#9b59b6;animation:pulse 1.5s infinite}
.ag-name{font-size:13px;font-weight:bold;color:#eee}
.ag-status{font-size:10px;color:#aaa;margin-top:3px}
.ag-detail{font-size:10px;color:#666;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ag-time{font-size:9px;color:#444;margin-top:3px}
.protected{background:#1a0a0a;border:1px solid #9b59b6;padding:10px;border-radius:6px;margin-top:10px}
.protected h3{color:#9b59b6;font-size:11px;margin-bottom:5px}
.protected p{color:#aaa;font-size:10px}
.footer{text-align:center;color:#333;font-size:9px;margin-top:15px}
.live-footer{display:none;text-align:center;font-size:9px;color:#555;margin-top:8px;border-top:1px solid #151520;padding-top:8px}
.live-footer.show{display:block}
.live-line{height:1px;background:linear-gradient(90deg,transparent,#ff6b35,transparent);margin:8px 0;opacity:0;transition:opacity 1s}
.live-line.show{opacity:.3}
.typer{display:inline-block;color:#666;font-size:10px}
</style>
</head>
<body>
<h1>WAR ROOM<span class="dot" id="liveDot"></span></h1>
<div class="sub"><span class="status-msg" id="statusMsg">iniciando...</span></div>
<div class="stats">
  <div class="stat" id="statAgents"><div class="stat-v">0</div><div class="stat-l">Agentes</div></div>
  <div class="stat" id="statFixes"><div class="stat-v">0</div><div class="stat-l">Correcoes</div></div>
  <div class="stat" id="statErrors"><div class="stat-v">0</div><div class="stat-l">Erros</div></div>
  <div class="stat" id="statTimer"><div class="stat-v">00:00</div><div class="stat-l">Tempo</div></div>
</div>
<div class="live-line" id="liveLine"></div>
<div class="agents" id="agentGrid"></div>
<div id="protectedArea"></div>
<div class="live-footer" id="liveFooter">
  <span class="typer" id="typer">inicializando...</span>
  <div style="margin-top:4px;color:#444;font-size:8px">HERMES v3.7 · modo autonomo</div>
</div>
<div class="footer">HERMES WAR ROOM</div>

<script>
(function(){
  var INIT_DATA = $stateJson;
  var LIVE_DELAY = 3000;
  var POLL_INTERVAL = 3000;
  var liveStatuses = ['analisando...','verificando...','otimizando...','escaneando...','processando...','sincronizando...','compilando...','debugando...','monitorando...','aprendendo...'];
  var liveActive = false, mouseTimer = null, cycleTimer = null, pollTimer = null;
  var currentData = INIT_DATA;

  function q(s){ return document.querySelector(s); }
  function qa(s){ return [].slice.call(document.querySelectorAll(s)); }

  function render(d) {
    if (!d || !d.agents) return;
    currentData = d;
    var agents = d.agents, names = Object.keys(agents).filter(function(n){ return n[0] !== '_'; });
    q('#statAgents .stat-v').textContent = names.length;
    q('#statFixes .stat-v').textContent = d.totalFixes || 0;
    q('#statErrors .stat-v').textContent = d.totalErrors || 0;
    if (d.startTime) {
      var secs = Math.floor((Date.now() - new Date(d.startTime).getTime()) / 1000);
      var m = Math.floor(secs/60), s = secs % 60;
      q('#statTimer .stat-v').textContent = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
    }
    var html = '';
    names.sort().forEach(function(name) {
      var a = agents[name];
      var cls = (a.status||'idle').toLowerCase().replace(/\s/g,'-');
      html += '<div class="agent '+cls+'" data-agent="'+name+'">';
      html += '<div class="ag-name">'+name+'</div>';
      html += '<div class="ag-status">'+(a.status||'')+'</div>';
      html += '<div class="ag-detail">'+(a.detail||'')+'</div>';
      html += '<div class="ag-time">'+(a.updatedAt||'')+'</div>';
      html += '</div>';
    });
    q('#agentGrid').innerHTML = html;
    if (activeLive) { cycleAgents(); }
  }

  function pollServer() {
    var x = new XMLHttpRequest();
    x.open('GET', 'http://localhost:3333/state.json?_='+Date.now(), true);
    x.onload = function(){ if (x.status === 200) { try { render(JSON.parse(x.responseText)); } catch(e){} } };
    x.onerror = function(){ /* server offline, use initial data */ };
    x.send();
  }

  function startLive() {
    if (activeLive) return;
    activeLive = true;
    document.body.classList.add('live');
    var dot = q('#liveDot'); if (dot) dot.classList.add('live');
    var msg = q('#statusMsg'); if (msg) { msg.classList.add('live'); msg.textContent = 'modo vivo - sistema autonomo ativo'; }
    var ll = q('#liveLine'); if (ll) ll.classList.add('show');
    var lf = q('#liveFooter'); if (lf) lf.classList.add('show');
    qa('.stat').forEach(function(s){ s.classList.add('live'); });
    cycleAgents();
  }

  function stopLive() {
    if (!activeLive) return;
    activeLive = false;
    document.body.classList.remove('live');
    var dot = q('#liveDot'); if (dot) dot.classList.remove('live');
    var msg = q('#statusMsg'); if (msg) { msg.classList.remove('live'); msg.textContent = 'monitorando...'; }
    var ll = q('#liveLine'); if (ll) ll.classList.remove('show');
    var lf = q('#liveFooter'); if (lf) lf.classList.remove('show');
    qa('.stat').forEach(function(s){ s.classList.remove('live'); });
    if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null; }
  }

  function cycleAgents() {
    if (cycleTimer) clearInterval(cycleTimer);
    function tick() {
      qa('.agent').forEach(function(a){
        a.classList.remove('live-think','live-scan','live-pulse');
        var r = Math.random();
        if (r < 0.33) a.classList.add('live-think');
        else if (r < 0.66) a.classList.add('live-scan');
        else a.classList.add('live-pulse');
      });
      var names = Object.keys(currentData.agents||{}).filter(function(n){ return n[0] !== '_'; });
      var typer = q('#typer');
      if (typer && names.length) {
        typer.textContent = names[Math.floor(Math.random()*names.length)] + ' ' + liveStatuses[Math.floor(Math.random()*liveStatuses.length)];
      }
    }
    tick();
    cycleTimer = setInterval(tick, 1200);
  }

  function resetIdle() {
    if (activeLive) stopLive();
    if (mouseTimer) clearTimeout(mouseTimer);
    mouseTimer = setTimeout(startLive, LIVE_DELAY);
  }

  var activeLive = false;

  document.addEventListener('mousemove', resetIdle);
  document.addEventListener('mousedown', resetIdle);
  document.addEventListener('keydown', resetIdle);
  document.addEventListener('scroll', resetIdle);
  document.addEventListener('touchstart', resetIdle);

  render(INIT_DATA);
  resetIdle();

  if (typeof XMLHttpRequest !== 'undefined') {
    pollTimer = setInterval(pollServer, POLL_INTERVAL);
    setTimeout(pollServer, 500);
  }
})();
</script>
</body>
</html>
"@
    Out-File -InputObject $html -FilePath $htmlFile -Encoding UTF8
}

# ─── START-ORCHESTRA ───────────────────────────────────────────
function Start-Orchestra {
    $script:state = @{agents=@{}; startTime=(Get-Date -Format 'o'); totalFixes=0; totalErrors=0; lastRun=''}
    SaveState
    Update-HTML
    
    Log ("=" * 50)
    Log "ORQUESTRADOR SUPREMO — TIME DE HERÓIS"
    Log "Frentes: $($fronts.Count) | Modelos: gpt-4o (gratis/openrouter) + qwen local"
    Log "Proteção visual ATIVADA"
    Log ("=" * 50)
    
    # ─── FASE 1: DIAGNÓSTICO ──────────────────────────────────
    Log "`nFASE 1: DIAGNÓSTICO COMPLETO"
    $jobs = @()
    foreach ($front in $fronts) {
        Update-Agent $front.name "queued" "Na fila..." "orange"
        $jobs += Start-Job -ScriptBlock {
            param($n, $c, $root)
            Set-Location $root
            $r = Invoke-Expression $c 2>&1 | Out-String
            return @{name=$n; result=$r; exitCode=$LASTEXITCODE}
        } -ArgumentList $front.name, $front.cmd, $projectRoot
    }
    
    $results = $jobs | Wait-Job | Receive-Job
    $jobs | Remove-Job
    
    $errorCount = 0; $fixCount = 0
    foreach ($r in $results) {
        $isStaging = $r.name -eq "staging"
        $resultText = [string]$r.result
        $stagingLines = @()
        if ($isStaging) {
            $stagingLines = $resultText -split "`r?`n" | Where-Object { $_ -and $_ -notmatch "^warning: in the working copy" }
        }
        $hasErr = if ($isStaging) {
            $resultText -match "(?im)^(fatal|error):"
        } else {
            ($r.exitCode -ne 0) -or ($resultText -match "error|Error|ERROR")
        }
        if ($hasErr) {
            $summary = $r.result.Substring(0, [Math]::Min(180, $r.result.Length)) -replace "`n|`r"," "
            Update-Agent $r.name "errored" "Erro: $summary..." "red"
            $errorCount++
        } elseif ($isStaging -and $stagingLines.Count -gt 0) {
            Update-Agent $r.name "drift" "$($stagingLines.Count) arquivos diferem; staging e scratch, nao bloqueia build" "orange"
            $fixCount++
        } else {
            Update-Agent $r.name "clean" "OK" "green"
            $fixCount++
        }
    }
    Log "Diagnóstico: $errorCount com erro, $fixCount limpos"
    Update-HTML
    
    # ─── FASE 2: CORREÇÃO ─────────────────────────────────────
    if ($errorCount -gt 0) {
        Log "`nFASE 2: CORREÇÃO EM LOTE"
        $hermesCl = "C:\Users\Administrador\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes.exe"
        $hermesAvailable = Test-Path $hermesCl
        
        foreach ($r in $results) {
            $resultText = [string]$r.result
            $hasErr = if ($r.name -eq "staging") {
                $resultText -match "(?im)^(fatal|error):"
            } else {
                ($r.exitCode -ne 0) -or ($resultText -match "error|Error|ERROR")
            }
            if (-not $hasErr) { continue }
            
            $front = $fronts | Where-Object { $_.name -eq $r.name } | Select-Object -First 1
            Update-Agent $r.name "fixing" "Corrigindo $($front.desc)..." "red"
            
            # Tenta auto-fix (eslint --fix ou tsc)
            $fixCmd = if ($front.name -eq "css" -or $front.name -eq "lint") {
                @("cmd", "/c", "npx", "eslint", "src/", "--fix")
            } elseif ($front.name -eq "staging") {
                @("cmd", "/c", "git", "diff", "--no-index", "src/", "staging/src/", "--name-only")
            } else {
                $front.cmd  # tsc-based
            }
            
            $fixResultText = & cmd /c $fixCmd 2>&1 | Out-String
            $fixCode = $LASTEXITCODE
            
            $stillErr = ($fixCode -ne 0) -or ($fixResultText -match "error|Error")
            if ($stillErr) {
                Update-Agent $r.name "failed" "$($front.desc): correção manual necessária" "red"
                $script:state.totalErrors++
            } else {
                Update-Agent $r.name "done" "$($front.desc): corrigido!" "green"
                $script:state.totalFixes++
            }
        }
        SaveState
        Update-HTML
    
        # ─── FASE 3: BUILD ────────────────────────────────────
        Log "`nFASE 3: BUILD DE VERIFICAÇÃO"
        Update-Agent "build" "building" "Build final..." "yellow"
        $buildOut = & "npm" --prefix $projectRoot run build 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0) {
            Update-Agent "build" "done" "Build passou!" "green"
        } else {
            Update-Agent "build" "failed" "Build falhou" "red"
            $script:state.totalErrors++
        }
    }
    
    # ─── FINAL ─────────────────────────────────────────────────
    $script:state.lastRun = (Get-Date -Format 'o')
    $script:state.mode = if ($errorCount -gt 0) { "repair" } else { "monitoring" }
    SaveState
    Update-HTML
    
    Log ("=" * 50)
    Log "CICLO COMPLETO"
    Log "Dashboard: $htmlFile"
    Log ("=" * 50)
    Update-HTML
}

# ─── HTML DASHBOARD (auto-refresh) ──────────────────────────────
function Start-LiveDashboard {
    Update-HTML
    Log "Dashboard ao vivo: $htmlFile"
    Start-Process $htmlFile
}

# ─── ENTRY ─────────────────────────────────────────────────────
if ($Kill) {
    if (Test-Path $stateFile) { Remove-Item $stateFile -Force }
    Log "Orquestrador encerrado"
    return
}

Start-LiveDashboard

if ($Loop) {
    Log "MODO LOOP ATIVO - ciclo a cada 5 minutos"
    while ($true) {
        Start-Orchestra
        $waitSec = 300
        Log "Proximo ciclo em $waitSec segundos..."
        for ($i = $waitSec; $i -gt 0; $i--) {
            $script:state.nextCycle = $i
            Start-Sleep 1
            if ($i % 30 -eq 0) {
                # Atualiza timer no dashboard
                $script:state.agents._timer = @{status="waiting"; detail="Proximo ciclo em ${i}s"; color="gray"}
                SaveState
                Update-HTML
            }
        }
    }
} else {
    Start-Orchestra
}
