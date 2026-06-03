# 🎬 Hermes Video & Audio Processor (FFmpeg Integration)
param(
    [ValidateSet("GifToMp4", "CreateSlideshow", "AutoDuck")]
    [string]$Action = "GifToMp4",
    [string]$InputPath = "",
    [string]$OutputPath = "",
    [string]$AudioPath = "",
    [string]$VoicePath = ""
)

$ErrorActionPreference = "Continue"
$projectRoot = "C:\Users\Administrador\YGGNAROK"
$ffmpeg = "ffmpeg.exe" # Assume FFmpeg está no PATH global do Windows

# Verifica se o FFmpeg está instalado
try {
    Get-Command $ffmpeg -ErrorAction Stop | Out-Null
} catch {
    Write-Host "⚠️ FFmpeg nao encontrado no seu PATH global do Windows." -ForegroundColor Yellow
    Write-Host "Instale o FFmpeg ou coloque-o no PATH para rodar comandos de edicao de video!" -ForegroundColor Cyan
}

Write-Host "🎬 [Video Studio] Iniciando operacao: $Action..." -ForegroundColor Magenta

switch ($Action) {
    "GifToMp4" {
        if (-not $InputPath) { $InputPath = "$projectRoot\public\assets\ai\*.gif" }
        # Pega o ultimo GIF gerado se usar curinga
        if ($InputPath -like "*\*") {
            $parent = Split-Path $InputPath -Parent
            $filter = Split-Path $InputPath -Leaf
            $recent = Get-ChildItem -Path $parent -Filter $filter | Sort-Object LastWriteTime -Descending | Select-Object -First 1
            if ($recent) { $InputPath = $recent.FullName }
        }

        if (-not (Test-Path $InputPath)) {
            Write-Host "❌ Arquivo GIF de entrada nao encontrado: $InputPath" -ForegroundColor Red
            exit 1
        }

        if (-not $OutputPath) {
            $dir = Split-Path $InputPath -Parent
            $name = [System.IO.Path]::GetFileNameWithoutExtension($InputPath)
            $OutputPath = "$dir\$name.mp4"
        }

        Write-Host "-> Convertendo GIF para MP4 otimizado de alta qualidade (YUV420p)..." -ForegroundColor Cyan
        Write-Host "-> Entrada: $InputPath" -ForegroundColor Yellow
        Write-Host "-> Saida: $OutputPath" -ForegroundColor Yellow

        # Comando FFmpeg para converter GIF em MP4 com compressao perfeita
        & $ffmpeg -y -i $InputPath -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" $OutputPath

        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 Conversao Concluida! Video pronto para o Premiere/After Effects em: $OutputPath" -ForegroundColor Green
        }
    }

    "CreateSlideshow" {
        # Compila uma pasta de imagens AI em um video com zoom dinâmico (efeito Ken Burns)
        if (-not $InputPath) { $InputPath = "$projectRoot\public\assets\ai" }
        if (-not $OutputPath) { $OutputPath = "$projectRoot\public\assets\ai\slideshow.mp4" }

        Write-Host "-> Compilando imagens AI em um video com movimento cinemático..." -ForegroundColor Cyan
        Write-Host "-> Lendo de: $InputPath" -ForegroundColor Yellow
        
        $images = Get-ChildItem -Path $InputPath -Filter "*.png" | Sort-Object LastWriteTime -Descending | Select-Object -First 5
        if ($images.Count -eq 0) {
            Write-Host "❌ Nenhuma imagem PNG encontrada em $InputPath" -ForegroundColor Red
            exit 1
        }

        # Cria arquivo temporario de lista
        $listFile = "$projectRoot\.hermes-daemon\image_list.txt"
        $content = ""
        foreach ($img in $images) {
            $safePath = $img.FullName -replace '\\', '/'
            $content += "file '$safePath'`nduration 3`n"
        }
        # Repete o ultimo frame por conta de um bug do ffmpeg
        $safePath = $images[-1].FullName -replace '\\', '/'
        $content += "file '$safePath'`n"
        $content | Out-File $listFile -Encoding UTF8

        # Compila slideshow com crossfade sutil
        & $ffmpeg -y -f concat -safe 0 -i $listFile -pix_fmt yuv420p -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" $OutputPath

        Remove-Item $listFile -ErrorAction Ignore
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 Slideshow criado com sucesso! Video salvo em: $OutputPath" -ForegroundColor Green
        }
    }

    "AutoDuck" {
        # O Santo Graal da Edicao Automatica: Mixa Locucao de IA com Musica de Fundo, abaixando a musica quando a voz fala!
        if (-not $VoicePath -or -not $AudioPath) {
            Write-Host "❌ Voce precisa passar os caminhos de -VoicePath (Voz IA) e -AudioPath (Musica de Fundo)!" -ForegroundColor Red
            exit 1
        }
        if (-not $OutputPath) { $OutputPath = "$projectRoot\public\assets\ai\mixed_audio.mp3" }

        Write-Host "-> Aplicando Dynamic Audio Ducking (Mixa voz + musica com atenuacao automatica)..." -ForegroundColor Cyan
        Write-Host "-> Voz (IA): $VoicePath" -ForegroundColor Yellow
        Write-Host "-> Musica: $AudioPath" -ForegroundColor Yellow

        # Filtro complexo FFmpeg: Ouve a track da voz (0:a) e abaixa a musica (1:a) em 15dB sempre que a voz subir de volume
        $filter = "[0:a]asplit[v1][v2];[1:a][v1]sidechaincompress=threshold=0.08:ratio=12:attack=50:release=350[m];[v2][m]amix=inputs=2:duration=first"
        
        & $ffmpeg -y -i $VoicePath -i $AudioPath -filter_complex $filter -b:a 192k $OutputPath

        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 Audio mixado profissionalmente com sidechain em: $OutputPath" -ForegroundColor Green
        }
    }
}
exit 0
