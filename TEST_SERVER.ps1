# ========================================
# BizzShort - Test Server
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BizzShort - Local Test Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting local server on port 8000..." -ForegroundColor Green
Write-Host ""

Write-Host "🔗 Admin Panel:" -ForegroundColor Yellow
Write-Host "   http://localhost:8000/admin-login.html" -ForegroundColor White
Write-Host ""

Write-Host "🎬 Video Manager (Standalone):" -ForegroundColor Yellow
Write-Host "   http://localhost:8000/AUTO_ADD_VIDEOS.html" -ForegroundColor White
Write-Host ""

Write-Host "🏠 Homepage:" -ForegroundColor Yellow
Write-Host "   http://localhost:8000/index.html" -ForegroundColor White
Write-Host ""

Write-Host "📝 Default Admin Login:" -ForegroundColor Magenta
Write-Host "   Username: admin" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""

Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start the server
python -m http.server 8000
