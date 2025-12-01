@echo off
REM BizzShort Local Development Server - Windows Batch Script
REM Simple HTTP server for local testing

echo ========================================
echo     BizzShort - Local Server Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_CMD=python
    goto :start_server
)

python3 --version >nul 2>&1
if %errorlevel% == 0 (
    set PYTHON_CMD=python3
    goto :start_server
)

REM Python not found
echo [ERROR] Python is not installed!
echo Please install Python from https://www.python.org/downloads/
echo.
echo Alternative options:
echo   1. Install Python (recommended)
echo   2. Use Node.js: npm install -g http-server then run: http-server -p 8080
echo   3. Use VS Code Live Server extension
echo.
pause
exit /b 1

:start_server
REM Get Python version
for /f "tokens=*" %%i in ('%PYTHON_CMD% --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [OK] Python detected: %PYTHON_VERSION%
echo.

REM Set port
set PORT=8080

echo Starting server on http://localhost:%PORT%
echo.
echo Server Options:
echo   * Home Page:      http://localhost:%PORT%/index.html
echo   * About:          http://localhost:%PORT%/about.html
echo   * Blog:           http://localhost:%PORT%/blog.html
echo   * Contact:        http://localhost:%PORT%/contact.html
echo   * Analytics:      http://localhost:%PORT%/analytics.html
echo   * Advertise:      http://localhost:%PORT%/advertise.html
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start Python HTTP server
%PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1

echo.
echo Server stopped.
pause