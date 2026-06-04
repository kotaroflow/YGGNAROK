# backup_staging.ps1

# -------------------------------------------------
# Backup the `staging` folder into a timestamped zip
# Destination: C:\Users\Administrador\Desktop\Backups\staging_YYYYMMDD.zip
# -------------------------------------------------

$src   = "C:\Users\Administrador\YGGNAROK\staging"
$destDir = "C:\Users\Administrador\Desktop\Backups"
$timestamp = Get-Date -Format "yyyyMMdd"
$zipPath = Join-Path $destDir "staging_$timestamp.zip"

if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }

Write-Host "Creating backup of staging at $zipPath"
Compress-Archive -Path "$src\*" -DestinationPath $zipPath -Force
Write-Host "Backup completed."
