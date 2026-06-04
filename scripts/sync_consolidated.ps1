# scripts\sync_consolidated.ps1

# -------------------------------------------------
# Sincroniza bidirecionalmente:
#   - YGGNAROK\  <=>  Desktop\YGGNAROK-CONSOLIDADO
# Mantém documentação, scripts e assets alinhados.
# -------------------------------------------------

$projRoot   = "C:\Users\Administrador\YGGNAROK"
$consolRoot = "C:\Users\Administrador\Desktop\YGGNAROK-CONSOLIDADO"

function Sync-FromProject {
    Write-Host "[SYNC] Copiando do projeto para a pasta consolidada..."
    robocopy $projRoot $consolRoot *.md *.txt *.ps1 *.py *.html *.jsx /MIR /XF "*.log" "node_modules" ".git" /NFL /NDL /NP /R:2 /W:1
}

function Sync-FromConsolidated {
    Write-Host "[SYNC] Copiando da pasta consolidada para o projeto..."
    robocopy $consolRoot $projRoot *.md *.txt *.ps1 *.py *.html *.jsx /MIR /XF "*.log" "node_modules" ".git" /NFL /NDL /NP /R:2 /W:1
}

# Executa ambas as direções (primeiro do projeto, depois da consolidada)
Sync-FromProject
Sync-FromConsolidated

Write-Host "[SYNC] Sincronização concluída."
