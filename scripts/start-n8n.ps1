#Requires -Version 5.1

$ErrorActionPreference = 'Stop'
$n8nBin      = "C:\Users\Administrador\AppData\Roaming\npm\node_modules\n8n\bin\n8n.cmd"
$n8nPort     = 5678
$n8nUrl      = "http://127.0.0.1:$n8nPort"
$workflowFile = "C:\Users\Administrador\YGGNAROK\n8n-webhook-yggnarok.json"
$cookieFile  = "$env:TEMP\n8n_startup_cookies.txt"
$loginJson   = "$env:TEMP\n8n_startup_login.json"
$activateJson = "$env:TEMP\n8n_startup_activate.json"
$adminEmail  = "admin@yggnarok.local"
$adminPass   = "Yggnarok123!"

Write-Output "=== YGGNAROK n8n Startup ==="

# Step 1: Kill any existing n8n
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match "n8n" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Step 2: Start n8n
Write-Output "[1/5] Starting n8n on $n8nUrl ..."
$proc = Start-Process -FilePath $n8nBin -ArgumentList "start --port=$n8nPort --host=127.0.0.1" -WindowStyle Hidden -PassThru
$procId = $proc.Id
Write-Output "       n8n PID: $procId"

# Step 3: Wait for n8n to be ready
Write-Output "[2/5] Waiting for n8n readiness..."
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 2
    try {
        $health = Invoke-RestMethod -Uri "$n8nUrl/healthz" -TimeoutSec 3 -ErrorAction Stop
        if ($health.status -eq 'ok') {
            $ready = $true
            Write-Output "       n8n is ready (${($i+1)*2}s)"
            break
        }
    } catch { }
}
if (-not $ready) { throw "n8n did not start within 60 seconds" }

# Step 4: Login (create owner if first run)
Write-Output "[3/5] Authenticating..."
try {
    @{ emailOrLdapLoginId = $adminEmail; password = $adminPass } | ConvertTo-Json | Set-Content -LiteralPath $loginJson -NoNewline
    $login = curl.exe -s -c $cookieFile -X POST "$n8nUrl/rest/login" -H "Content-Type: application/json" -d "@$loginJson"
    $loginData = $login | ConvertFrom-Json
    if (-not $loginData.data) { throw "Login failed: $login" }
    Write-Output "       Logged in as $($loginData.data.email)"
} catch {
    Write-Output "       First-run setup..."
    $ownerBody = @{ email = $adminEmail; firstName = "Admin"; lastName = "YGGNAROK"; password = $adminPass } | ConvertTo-Json
    curl.exe -s -c $cookieFile -X POST "$n8nUrl/rest/owner/setup" -H "Content-Type: application/json" -d $ownerBody | Out-Null
    # Login again
    curl.exe -s -c $cookieFile -X POST "$n8nUrl/rest/login" -H "Content-Type: application/json" -d "@$loginJson" | Out-Null
    Write-Output "       Owner created and logged in"
}

# Step 5: Import workflow if not exists
Write-Output "[4/5] Importing YGGNAROK workflow..."
$workflows = curl.exe -s -b $cookieFile "$n8nUrl/rest/workflows" | ConvertFrom-Json
$existing = $workflows.data | Where-Object { $_.name -eq "YGGNAROK - Agente de Ingestão" }

if ($existing) {
    $wfId = $existing.id
    $versionId = $existing.versionId
    Write-Output "       Workflow already exists (ID: $wfId)"
    # Activate if not active
    if (-not $existing.active) {
        @{ versionId = $versionId } | ConvertTo-Json | Set-Content -LiteralPath $activateJson -NoNewline
        curl.exe -s -b $cookieFile -X POST "$n8nUrl/rest/workflows/$wfId/activate" -H "Content-Type: application/json" -d "@$activateJson" | Out-Null
        Write-Output "       Workflow activated"
    }
} else {
    $wfJson = Get-Content -Raw -LiteralPath $workflowFile
    $wfJson | Set-Content -LiteralPath "$env:TEMP\n8n_import.json" -NoNewline
    $import = curl.exe -s -b $cookieFile -X POST "$n8nUrl/rest/workflows" -H "Content-Type: application/json" -d "@$env:TEMP\n8n_import.json" | ConvertFrom-Json
    $wfId = $import.data.id
    $versionId = $import.data.versionId
    Write-Output "       Imported workflow (ID: $wfId)"
    # Activate
    @{ versionId = $versionId } | ConvertTo-Json | Set-Content -LiteralPath $activateJson -NoNewline
    curl.exe -s -b $cookieFile -X POST "$n8nUrl/rest/workflows/$wfId/activate" -H "Content-Type: application/json" -d "@$activateJson" | Out-Null
    Write-Output "       Workflow activated"
}

# Step 6: Report
Write-Output "[5/5] Health check..."
$testBody = @{ origem = "startup-script"; timestamp = (Get-Date -Format "o") } | ConvertTo-Json
$testBody | Set-Content -LiteralPath "$env:TEMP\n8n_healthcheck.json" -NoNewline
try {
    $result = curl.exe -s -X POST "$n8nUrl/webhook/yggnarok-hub" -H "Content-Type: application/json" -d "@$env:TEMP\n8n_healthcheck.json"
    Write-Output "       Webhook test: OK"
} catch {
    Write-Output "       Webhook test: FAILED ($_)"
}

# Cleanup temp files
Remove-Item -LiteralPath $loginJson, $activateJson, "$env:TEMP\n8n_import.json", "$env:TEMP\n8n_healthcheck.json" -ErrorAction SilentlyContinue

Write-Output ""
Write-Output "========================================"
Write-Output "  YGGNAROK n8n is running!"
Write-Output "  Webhook URL: $n8nUrl/webhook/yggnarok-hub"
Write-Output "  Dashboard:   $n8nUrl"
Write-Output "  PID:         $procId"
Write-Output "========================================"
