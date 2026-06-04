Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Load configuration (if exists)
$configPath = "C:\Users\Administrador\YGGNAROK\scripts\token_widget_config.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    $interval = $config.intervalSeconds
} else {
    $interval = 30  # seconds default
}

# Create form
$form = New-Object System.Windows.Forms.Form
$form.Text = "Quota de Tokens"
$form.FormBorderStyle = 'None'
$form.StartPosition = 'Manual'
$form.TopMost = $true
$form.ShowInTaskbar = $false
$form.BackColor = [System.Drawing.Color]::FromArgb(30,30,30) # dark background
$form.Opacity = 0.9
$form.Width = 180
$form.Height = 80

# Position top‑right (auto‑calculate X based on screen width)
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$form.Location = New-Object System.Drawing.Point ($screen.Width - $form.Width - 10), 10

# Label to show token data
$label = New-Object System.Windows.Forms.Label
$label.AutoSize = $false
$label.Dock = 'Fill'
$label.TextAlign = 'MiddleCenter'
$label.ForeColor = [System.Drawing.Color]::White
$label.Font = New-Object System.Drawing.Font('Inter',12,[System.Drawing.FontStyle]::Bold)
$form.Controls.Add($label)

# Function to fetch quota
function Get-Quota {
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:3333/api/v1/quota" -UseBasicParsing -ErrorAction Stop
        $data = $resp.Content | ConvertFrom-Json
    } catch {
        # Fallback to static json file in project
        $fallbackPath = "C:\Users\Administrador\YGGNAROK\public\token_usage.json"
        if (Test-Path $fallbackPath) {
            $data = Get-Content $fallbackPath -Raw | ConvertFrom-Json
        } else {
            $data = @{used=0;limit=0;remaining=0}
        }
    }
    return $data
}

# Timer to refresh UI
$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = $interval * 1000
$timer.Add_Tick({
    $quota = Get-Quota
    $used   = $quota.used
    $limit  = $quota.limit
    $remain = $quota.remaining
    $label.Text = "{0:N0} / {1:N0} tokens`nRestam: {2:N0}" -f $used,$limit,$remain
})
$timer.Start()

# Initial load
$timer.InvokeTick()

# Show form (non‑blocking)
$form.ShowDialog()
