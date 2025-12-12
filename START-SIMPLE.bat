@echo off
echo ========================================
echo   BizzShort - Starting Local Server
echo ========================================
echo.
echo Opening BizzShort in your browser...
echo Server running at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

start http://localhost:8000/index.html

python -m http.server 8000

pause
