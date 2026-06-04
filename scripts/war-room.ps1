param([switch]$Once)
$projectRoot = "C:\Users\Administrador\YGGNAROK"
$stateDir = "$projectRoot\.hermes-daemon\orchestra"
$stateFile = "$stateDir\state.json"
$htmlFile = "$stateDir\dashboard.html"
if (-not (Test-Path $stateDir)) { New-Item -ItemType Directory -Path $stateDir -Force | Out-Null }

function Log   { Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $args" }
function Save  { $script:state | ConvertTo-Json -Depth 5 | Set-Content $stateFile -Encoding UTF8 }
function Agent($n, $s, $d, $c) {
    $script:state.agents[$n] = @{status="$s"; detail="$d"; color="$c"; updated=(Get-Date -Format 'HH:mm:ss')}
}

$fronts = @(
    @{name="typecheck"; cmd="npm run typecheck"; desc="TypeScript Check"}
    @{name="lint";      cmd="npm run lint";      desc="ESLint"}
    @{name="build";     cmd="npm run build";     desc="Build"}
    @{name="ollama";    cmd="curl -s http://localhost:11434/api/tags >`$null 2>&1"; desc="Ollama"}
    @{name="n8n";       cmd="curl -s http://localhost:5678/healthz >`$null 2>&1";   desc="n8n"}
    @{name="dashboard"; cmd="curl -s http://localhost:3333/dashboard.html >`$null 2>&1"; desc="Dashboard"}
    @{name="nextjs";    cmd="curl -s http://localhost:3000 >`$null 2>&1";           desc="Next.js"}
)

function Update-HTML {
    $state = $script:state
    $agentsHtml = ""
    foreach ($name in @("typecheck","lint","build","ollama","n8n","dashboard","nextjs")) {
        $a = $state.agents[$name]
        if (-not $a) { continue }
        $color = $a.color
        $status = $a.status
        $detail = $a.detail
        $updated = $a.updated
        $agentsHtml += @"
<div class="agent-card" style="border-left:4px solid $color">
  <div class="agent-name"><span class="dot" style="background:$color"></span>$name</div>
  <div class="agent-status" style="color:$color">$status</div>
  <div class="agent-detail">$detail</div>
  <div class="agent-time">$updated</div>
</div>
"@
    }
    $html = @"
<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>YGGNAROK - Sala de Guerra</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0f;color:#e0e0e0;font-family:'Segoe UI',system-ui,sans-serif;padding:20px}
h1{font-size:1.5rem;color:#f5c400;margin-bottom:4px;letter-spacing:2px;text-transform:uppercase}
.sub{color:#888;font-size:.85rem;margin-bottom:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px;margin-bottom:24px}
.agent-card{background:rgba(255,255,255,.04);border-radius:8px;padding:14px;backdrop-filter:blur(8px)}
.agent-name{font-weight:600;font-size:.9rem;text-transform:capitalize;margin-bottom:6px}
.dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px}
.agent-status{font-size:.8rem;margin-bottom:4px}
.agent-detail{font-size:.75rem;color:#aaa;margin-bottom:2px}
.agent-time{font-size:.65rem;color:#666}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.stat-card{background:rgba(255,255,255,.04);border-radius:8px;padding:14px;text-align:center}
.stat-value{font-size:2rem;font-weight:700;color:#f5c400}
.stat-label{font-size:.75rem;color:#888;margin-top:4px}
.footer{text-align:center;color:#555;font-size:.7rem;margin-top:24px;padding-top:12px;border-top:1px solid rgba(255,255,255,.05)}
.refresh{color:#555;font-size:.7rem;margin-top:8px;text-align:center}
</style></head><body>
<h1>YGGNAROK</h1>
<div class="sub">Sala de Guerra - Comando Supremo</div>
<div class="stats-grid">
  <div class="stat-card"><div class="stat-value">$($state.totalFixes)</div><div class="stat-label">Concluidos</div></div>
  <div class="stat-card"><div class="stat-value">$($state.totalErrors)</div><div class="stat-label">Alertas</div></div>
  <div class="stat-card"><div class="stat-value">$($state.agents.Count)</div><div class="stat-label">Agentes</div></div>
  <div class="stat-card"><div class="stat-value">$($state.mode)</div><div class="stat-label">Modo</div></div>
</div>
<div class="grid">$agentsHtml</div>
<div class="refresh">Atualizando a cada 3s - Ultimo ciclo: $($state.lastRun)</div>
<div class="footer">YGGNAROK v1 - Poder maximo: Ollama+OpenRouter+n8n+Obsidian</div>
<script>
var pollTimer = setInterval(function(){
  var x = new XMLHttpRequest();
  x.open('GET','/state.json',true);
  x.onload = function(){ if(x.status===200) location.reload() };
  x.send();
}, 3000);
</script>
</body></html>
"@
    Set-Content $htmlFile $html -Encoding UTF8
}

# --- CICLO -------------------------------------
function Run-Cycle {
    $script:state = @{agents=@{}; startTime=(Get-Date -Format 'o'); totalFixes=0; totalErrors=0; lastRun=''; mode='monitoring'}
    
    Log "=== CICLO ==="
    
    # Check all services
    foreach ($f in $fronts) {
        Agent $f.name "checking" "Verificando..." "orange"
    }
    Save
    Update-HTML
    
    foreach ($f in $fronts) {
        $name = $f.name
        Agent $name "running" "Executando $($f.desc)..." "yellow"
        Save
        Update-HTML
        
        if ($name -in @("ollama","n8n","dashboard","nextjs")) {
            $ports = @{ollama=11434; n8n=5678; dashboard=3333; nextjs=3000}
            try { $ok = (netstat -an | Select-String ":$($ports[$name]).*LISTEN") -ne $null } catch { $ok = $false }
            if ($ok) {
                Agent $name "online" "$($f.desc) - OK" "green"
                $script:state.totalFixes++
            } else {
                Agent $name "offline" "$($f.desc) - desconectado" "red"
                $script:state.totalErrors++
            }
        } else {
            $r = & npm run $name 2>&1 | Out-String
            $ok = $LASTEXITCODE -eq 0
            if ($ok) {
                Agent $name "ok" "$($f.desc) - passou" "green"
                $script:state.totalFixes++
            } else {
                Agent $name "falhou" "$($f.desc) - erro" "red"
                $script:state.totalErrors++
            }
        }
        Save
        Update-HTML
    }
    
    $script:state.lastRun = (Get-Date -Format 'HH:mm:ss')
    $script:state.mode = if ($script:state.totalErrors -gt 0) { "reparo" } else { "monitoring" }
    Save
    Update-HTML
    
    Log "Ciclo completo: $($script:state.totalFixes) OK, $($script:state.totalErrors) erros"
    
    # Start dashboard server if not running
    $dashRunning = (netstat -an | Select-String ":3333.*LISTEN") -ne $null
    if (-not $dashRunning) {
        Start-Job -Name DashSrv -ScriptBlock { & "C:\Users\Administrador\YGGNAROK\scripts\dashboard-server.ps1" }
        Log "Dashboard server iniciado em :3333"
    }
}

# --- LOOP --------------------------------------
if ($Once) {
    Run-Cycle
} else {
    Log "=== GUERRA TOTAL - Loop de 5 minutos ==="
    while ($true) {
        Run-Cycle
        Log "Aguardando 5 minutos..."
        Start-Sleep -Seconds 300
    }
}
