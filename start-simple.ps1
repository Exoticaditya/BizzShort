# BizzShort - Simple Python Server Starter
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BizzShort - Starting Local Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening BizzShort in your browser..." -ForegroundColor Yellow
Write-Host "Server running at: http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Open browser
Start-Process "http://localhost:8000/index.html"

# Start Python HTTP server
python -m http.server 8000
