@echo off
echo ========================================
echo    BizzShort - Complete Startup
echo ========================================
echo.

REM Kill any existing Node.js processes on port 3000
echo [1/4] Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

REM Start backend server
echo [2/4] Starting backend API server on port 3000...
start "BizzShort API" cmd /k "node server.js"
timeout /t 3 /nobreak >nul

REM Open in default browser
echo [3/4] Opening website in browser...
start http://localhost:5500/index.html

echo [4/4] Instructions:
echo.
echo ========================================
echo    IMPORTANT: Follow these steps!
echo ========================================
echo.
echo 1. In VS Code, RIGHT-CLICK on "index.html"
echo 2. Select "Open with Live Server"
echo 3. Your website will open at: http://localhost:5500
echo.
echo ========================================
echo    Project Status:
echo ========================================
echo.
echo Backend API: http://localhost:3000
echo Frontend Website: http://localhost:5500
echo.
echo API Endpoints:
echo - Health: http://localhost:3000/api/health
echo - Articles: http://localhost:3000/api/articles
echo - Analytics: http://localhost:3000/api/analytics
echo.
echo ========================================
echo Press any key to exit...
pause >nul
