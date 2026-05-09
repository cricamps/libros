# ============================================================
# git-push-eft.ps1
# Commit y push final para la EFT
# ============================================================

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "   Git Push EFT – TechStore           " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

git add -A
git status

$msg = "EFT: TechStore FullStack completo - 3 microservicios (8081/8082/8083) + Angular 17 + Docker + SonarQube"
git commit -m $msg

git push origin main

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "  Push completado!" -ForegroundColor Green
Write-Host "  https://github.com/cricamps/libros   " -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
