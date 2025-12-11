@echo off
echo ========================================
echo    BizzShort - Local Test Server
echo ========================================
echo.
echo Starting local server on port 8000...
echo.
echo Admin Panel: http://localhost:8000/admin-login.html
echo Video Manager: http://localhost:8000/AUTO_ADD_VIDEOS.html
echo Homepage: http://localhost:8000/index.html
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python -m http.server 8000
