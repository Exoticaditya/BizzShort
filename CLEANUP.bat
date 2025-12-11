@echo off
echo ========================================
echo    BizzShort - Quick Cleanup
echo ========================================
echo.
echo This will remove all development files
echo and prepare your project for production.
echo.
pause

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0CLEANUP_UNWANTED_FILES.ps1"

pause
