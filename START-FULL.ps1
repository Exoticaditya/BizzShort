# Start BizzShort Platform (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting BizzShort Platform" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend API Server (Port 3000)..." -ForegroundColor Yellow
Start-Process -NoNewWindow node -ArgumentList "server.js"
Start-Sleep -Seconds 2

Write-Host "Starting Frontend Server (Port 8000)..." -ForegroundColor Yellow
Start-Process python -ArgumentList "-m", "http.server", "8000"
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "BizzShort is now running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:8000" -ForegroundColor White
Write-Host "Backend API: http://localhost:3000" -ForegroundColor White
Write-Host "Admin Panel: http://localhost:8000/admin-login.html" -ForegroundColor White
Write-Host ""
Write-Host "Login: admin / admin@123" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
