# 🏯 YGGNAROK NEURAL CONTROL CENTER (MENU TÁTICO)
$ErrorActionPreference = "SilentlyContinue"
$projectRoot = "C:\Users\Administrador\YGGNAROK"
$host.ui.RawUI.WindowTitle = "YGGNAROK // Central de Comando Neural"

function Show-Header {
    Clear-Host
    Write-Host @"
============================================================
           Y G G N A R O K  //  C O N T R O L  H Q
               --- MODO CAOS NEURAL ATIVADO ---
============================================================
              [ ESTÉTICA VOID & AMBER - SEINEN ]
"@ -ForegroundColor Yellow
}

function Show-Menu {
    Write-Host "`n[1] ⚡ Reiniciar Todo o Ecossistema (Hermes + Dashboard)" -ForegroundColor Cyan
    Write-Host "[2] 🎨 Gerar Imagem Anime Estática (ComfyUI)" -ForegroundColor Cyan
    Write-Host "[3] 🎬 Gerar Animação Curta em GIF (AnimateDiff)" -ForegroundColor Cyan
    Write-Host "[4] 🎞️ Converter GIF para MP4 (Pronto para Edição)" -ForegroundColor Green
    Write-Host "[5] 🎥 Compilar Imagens em Vídeo (Slideshow/Ken Burns)" -ForegroundColor Green
    Write-Host "[6] 🎙️ Auto-Duck Audio (Mixa Voz de IA com Trilha Sonora)" -ForegroundColor Green
    Write-Host "[7] 🌐 Abrir Dashboard do War Room (localhost:3333)" -ForegroundColor Yellow
    Write-Host "[8] 🔮 Importar Personas no Lobe Chat (Instruções)" -ForegroundColor Yellow
    Write-Host "[9] 🚪 Sair do Terminal" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Yellow
}

do {
    Show-Header
    Show-Menu
    $choice = Read-Host "`n[Comandante] Selecione a Operação Tática (1-9)"
    
    switch ($choice) {
        "1" {
            Show-Header
            Write-Host "🔄 Reiniciando daemons e limpando portas..." -ForegroundColor Cyan
            & "$projectRoot\scripts\restart-hermes.ps1"
            Read-Host "`n[OK] Pressione Enter para voltar ao Menu"
        }
        "2" {
            Show-Header
            $prompt = Read-Host "🎨 Digite o prompt para a Imagem de Anime"
            if ($prompt) {
                Write-Host "🚀 Disparando gerador de imagens..." -ForegroundColor Cyan
                # Usa o art director passando o prompt temporariamente
                $tmpFile = "$projectRoot\.hermes-daemon\menu-prompt.tsx"
                "// @img(`"$prompt`")" | Out-File $tmpFile -Encoding UTF8
                & "$projectRoot\scripts\hermes-art-director.ps1" -TargetFile $tmpFile
                Remove-Item $tmpFile -ErrorAction Ignore
            }
            Read-Host "`n[OK] Geração concluída! Pressione Enter para voltar"
        }
        "3" {
            Show-Header
            $prompt = Read-Host "🎬 Digite o prompt para a Animação GIF"
            if ($prompt) {
                & "$projectRoot\scripts\hermes-animate.ps1" -Prompt $prompt
            }
            Read-Host "`n[OK] Animação concluída! Pressione Enter para voltar"
        }
        "4" {
            Show-Header
            Write-Host "🎞️ Convertendo o último GIF gerado para MP4..." -ForegroundColor Cyan
            & "$projectRoot\scripts\hermes-video.ps1" -Action GifToMp4
            Read-Host "`n[OK] Conversão concluída! Pressione Enter para voltar"
        }
        "5" {
            Show-Header
            Write-Host "🎥 Compilando suas artes em um vídeo Slideshow..." -ForegroundColor Cyan
            & "$projectRoot\scripts\hermes-video.ps1" -Action CreateSlideshow
            Read-Host "`n[OK] Slideshow criado! Pressione Enter para voltar"
        }
        "6" {
            Show-Header
            $voice = Read-Host "🎙️ Arraste ou digite o caminho do arquivo de Voz (TTS)"
            $music = Read-Host "🎵 Arraste ou digite o caminho da Trilha Sonora"
            if ($voice -and $music) {
                # Limpa aspas do windows ao arrastar arquivo
                $voice = $voice -replace '"', ''
                $music = $music -replace '"', ''
                & "$projectRoot\scripts\hermes-video.ps1" -Action AutoDuck -VoicePath $voice -AudioPath $music
            } else {
                Write-Host "❌ Caminhos inválidos!" -ForegroundColor Red
            }
            Read-Host "`n[OK] Pressione Enter para voltar"
        }
        "7" {
            Show-Header
            Write-Host "🌐 Abrindo Painel Tático no navegador..." -ForegroundColor Cyan
            Start-Process "http://localhost:3333"
            Start-Sleep -Seconds 1
        }
        "8" {
            Show-Header
            Write-Host "🔮 PERSONAS PRONTAS PARA O LOBE CHAT:" -ForegroundColor Yellow
            Write-Host "Abra o Lobe Chat e importe os seguintes arquivos JSON:" -ForegroundColor Cyan
            Write-Host "1. Mestre da Guilda: .hermes-daemon\lobe-agents\Hermes-Arquiteto.json" -ForegroundColor Green
            Write-Host "2. Diretor de Arte: .hermes-daemon\lobe-agents\Huashu-Art-Director.json" -ForegroundColor Green
            Read-Host "`n[OK] Pressione Enter para voltar ao Menu"
        }
        "9" {
            Write-Host "`n🔒 Desconectando terminal... Até logo, Comandante!" -ForegroundColor Red
            Start-Sleep -Seconds 1
            break
        }
        default {
            Write-Host "❌ Opção inválida! Tente de 1 a 9." -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
} while ($true)
