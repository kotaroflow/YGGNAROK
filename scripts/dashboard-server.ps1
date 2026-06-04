$ParamBlock = @{
    Port = 3333
    RootDir = Join-Path $PSScriptRoot "..\\..\\.hermes-daemon\\orchestra"
    EnableCORS = $true
}
# Allow overriding via command‑line arguments
if ($args.Count -ge 1) { $ParamBlock.Port = [int]$args[0] }
if ($args.Count -ge 2) { $ParamBlock.RootDir = $args[1] }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$($ParamBlock.Port)/")
$listener.Start()
Write-Host "=== DASHBOARD AO VIVO ===" -ForegroundColor Cyan
Write-Host "URL: http://localhost:$($ParamBlock.Port)/dashboard.html" -ForegroundColor Green

function Get-ContentType($extension) {
    switch ($extension.ToLower()) {
        '.html' { return 'text/html; charset=utf-8' }
        '.json' { return 'application/json; charset=utf-8' }
        '.css'  { return 'text/css; charset=utf-8' }
        '.js'   { return 'application/javascript; charset=utf-8' }
        default { return 'application/octet-stream' }
    }
}

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response
        if ($ParamBlock.EnableCORS) {
            $res.AddHeader('Access-Control-Allow-Origin', '*')
        }
        $path = $req.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path)) { $path = 'dashboard.html' }
        $filePath = Join-Path $ParamBlock.RootDir $path
        if (Test-Path $filePath) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $res.ContentType = Get-ContentType ([System.IO.Path]::GetExtension($filePath))
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $errMsg = "404 - $path not found"
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes($errMsg)
            $res.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $res.Close()
    } catch {
        Write-Error "Error handling request: $_"
    }
}
