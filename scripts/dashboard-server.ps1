$port = 3333
$orchestraDir = "C:\Users\Administrador\YGGNAROK\.hermes-daemon\orchestra"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "=== DASHBOARD AO VIVO ===" -ForegroundColor Cyan
Write-Host "URL: http://localhost:$port/dashboard.html" -ForegroundColor Green

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    
    $path = $req.Url.LocalPath.TrimStart('/')
    if ($path -eq '') { $path = 'dashboard.html' }
    $filePath = Join-Path $orchestraDir $path
    
    if (Test-Path $filePath) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $contentType = switch ([System.IO.Path]::GetExtension($filePath)) {
            '.html' { 'text/html; charset=utf-8' }
            '.json' { 'application/json; charset=utf-8' }
            '.css'  { 'text/css; charset=utf-8' }
            '.js'   { 'application/javascript; charset=utf-8' }
            default { 'application/octet-stream' }
        }
        $res.ContentType = $contentType
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
        $err = [System.Text.Encoding]::UTF8.GetBytes("404 - $path not found")
        $res.OutputStream.Write($err, 0, $err.Length)
    }
    $res.Close()
}
