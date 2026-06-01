param(
    [string]$Path = "C:\Users\Administrador\YGGNAROK\staging",
    [string]$LogFile = "C:\Users\Administrador\YGGNAROK\staging\watch-changes.log"
)

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $Path
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

$action = {
    $time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $changeType = $Event.SourceEventArgs.ChangeType
    $fullPath = $Event.SourceEventArgs.FullPath
    $relative = $fullPath.Replace("C:\Users\Administrador\YGGNAROK\staging\", "")
    $line = "[$time] $changeType : $relative"
    Add-Content -Path "C:\Users\Administrador\YGGNAROK\staging\watch-changes.log" -Value $line
    Write-Host $line
}

Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Deleted" -Action $action
Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action $action

Write-Host "Watching staging/ for changes... (Ctrl+C to stop)"
while ($true) { Start-Sleep -Seconds 1 }
