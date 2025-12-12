@echo off
echo ========================================
echo Starting BizzShort Platform
echo ========================================
echo.
echo Starting Backend API Server (Port 3000)...
start "BizzShort API" cmd /k "node server.js"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Server (Port 8000)...
start "BizzShort Frontend" cmd /k "python -m http.server 8000"
echo.
echo ========================================
echo BizzShort is now running!
echo ========================================
echo.
echo Frontend: http://localhost:8000
echo Backend API: http://localhost:3000
echo Admin Panel: http://localhost:8000/admin-login.html
echo.
echo Login: admin / admin@123
echo.
echo Press any key to stop all servers...
pause > nul
taskkill /FI "WINDOWTITLE eq BizzShort*" /F
