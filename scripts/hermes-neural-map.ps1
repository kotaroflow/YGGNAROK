<#
.SYNOPSIS
    Mapeamento Neural para o YGGNAROK. 
    Este script varre a estrutura do projeto, extrai a lista de componentes, 
    tipos exportados e dependencias chave, condensando tudo no "cerebro" do Hermes.
#>

$ErrorActionPreference = "Continue"
$projectRoot = "C:\Users\Administrador\YGGNAROK"
$mapFile = "$projectRoot\.hermes-daemon\neural-map.json"

Write-Host "Iniciando Varredura Neural Profunda..." -ForegroundColor Cyan

$map = @{
    lastScan = (Get-Date -Format 'o')
    components = @()
    apis = @()
    workers = @()
}

# 1. Componentes
$compDir = "$projectRoot\src\components"
if (Test-Path $compDir) {
    Write-Host "Mapeando componentes React..."
    $files = Get-ChildItem -Path $compDir -Recurse -Include *.tsx,*.jsx
    foreach ($f in $files) {
        $map.components += $f.Name -replace '\.tsx|\.jsx', ''
    }
}

# 2. Rotas API / Pages
$appDir = "$projectRoot\src\app"
if (Test-Path $appDir) {
    Write-Host "Mapeando rotas App Router..."
    $files = Get-ChildItem -Path $appDir -Recurse -Include page.tsx,route.ts
    foreach ($f in $files) {
        $route = $f.FullName.Replace($appDir, "").Replace("\page.tsx", "").Replace("\route.ts", "").Replace("\", "/")
        if ($route -eq "") { $route = "/" }
        $map.apis += $route
    }
}

# 3. Worker Jobs
$workerDir = "$projectRoot\worker\src\jobs"
if (Test-Path $workerDir) {
    Write-Host "Mapeando Worker Jobs (AI Council)..."
    $files = Get-ChildItem -Path $workerDir -Recurse -Include *.ts
    foreach ($f in $files) {
        $map.workers += $f.Name -replace '\.ts', ''
    }
}

$map.components = $map.components | Select-Object -Unique | Sort-Object
$map.apis = $map.apis | Select-Object -Unique | Sort-Object
$map.workers = $map.workers | Select-Object -Unique | Sort-Object

$map | ConvertTo-Json -Depth 10 | Out-File $mapFile -Encoding UTF8

Write-Host "Varredura Concluida! $($map.components.Count) componentes catalogados." -ForegroundColor Green
Write-Host "Mapa Neural salvo em $mapFile" -ForegroundColor Yellow
