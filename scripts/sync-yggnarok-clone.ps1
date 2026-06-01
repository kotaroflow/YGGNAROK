# Sincroniza YGGNAROK <-> YGGNAROK-1 (arquivo mais recente vence).
# Nao toca em .git, node_modules, builds nem .env.local.
#
# Fluxo recomendado:
#   1. Trabalhe em qualquer pasta (Antigravity ou Cursor).
#   2. Ao trocar de IDE: npm run sync:clone
#   3. Commits Git: faca push de uma pasta; na outra: git pull
#      (remotes irmas: yggnarok-ag / yggnarok-cursor, se configurados)
#
# Uso:
#   npm run sync:clone
#   npm run sync:clone -- -DryRun
#   npm run sync:clone -- -From antigravity   # so YGGNAROK -> YGGNAROK-1
#   npm run sync:clone -- -From cursor        # so YGGNAROK-1 -> YGGNAROK

param(
    [ValidateSet("both", "antigravity", "cursor")]
    [string]$From = "both",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$AntigravityRoot = "C:\Users\Administrador\YGGNAROK"
$CursorRoot = "C:\Users\Administrador\YGGNAROK-2"
if (-not (Test-Path $CursorRoot)) {
    $CursorRoot = "C:\Users\Administrador\YGGNAROK-1"
}

if (-not (Test-Path $AntigravityRoot)) {
    throw "Pasta nao encontrada: $AntigravityRoot"
}
if (-not (Test-Path $CursorRoot)) {
    throw "Pasta nao encontrada: $CursorRoot"
}

$ExcludeDirs = @(
    ".git",
    "node_modules",
    ".next",
    "out",
    "dist",
    ".cursor",
    ".vercel",
    "coverage",
    ".turbo"
)

$ExcludeFiles = @(
    ".env",
    ".env.local",
    ".env.production",
    ".env.development"
)

function Sync-OneWay {
    param(
        [string]$Source,
        [string]$Destination,
        [string]$Label
    )

    if ($Source -eq $Destination) { return }

    Write-Host ""
    Write-Host ">> $Label" -ForegroundColor Cyan
    Write-Host "   $Source"
    Write-Host "   -> $Destination"

    $xd = ($ExcludeDirs | ForEach-Object { "/XD"; $_ }) -join " "
    $xf = ($ExcludeFiles | ForEach-Object { "/XF"; $_ }) -join " "

    $robocopyArgs = @(
        $Source,
        $Destination,
        "/E",
        "/XO",
        "/R:2",
        "/W:1",
        "/NFL",
        "/NDL",
        "/NJH",
        "/NJS",
        "/NP"
    )

    foreach ($dir in $ExcludeDirs) {
        $robocopyArgs += "/XD"
        $robocopyArgs += $dir
    }
    foreach ($file in $ExcludeFiles) {
        $robocopyArgs += "/XF"
        $robocopyArgs += $file
    }
    if ($DryRun) {
        $robocopyArgs += "/L"
    }

    & robocopy @robocopyArgs | Out-Null
    $code = $LASTEXITCODE
    # Robocopy: 0-7 = sucesso com ou sem arquivos copiados
    if ($code -ge 8) {
        throw "robocopy falhou ($code): $Source -> $Destination"
    }
}

Write-Host "YGGNAROK clone sync" -ForegroundColor Green
Write-Host "  Antigravity: $AntigravityRoot"
Write-Host "  Cursor:      $CursorRoot"
if ($DryRun) { Write-Host "  (dry-run)" -ForegroundColor Yellow }

switch ($From) {
    "antigravity" {
        Sync-OneWay -Source $AntigravityRoot -Destination $CursorRoot -Label "Antigravity -> Cursor"
    }
    "cursor" {
        Sync-OneWay -Source $CursorRoot -Destination $AntigravityRoot -Label "Cursor -> Antigravity"
    }
    "both" {
        Sync-OneWay -Source $AntigravityRoot -Destination $CursorRoot -Label "Antigravity -> Cursor (mais recente)"
        Sync-OneWay -Source $CursorRoot -Destination $AntigravityRoot -Label "Cursor -> Antigravity (mais recente)"
    }
}

Write-Host ""
Write-Host "Concluido. Rode 'git status' em cada pasta para ver o que mudou." -ForegroundColor Green
