#!/usr/bin/env pwsh
# BizzShort Local Development Server
# Simple HTTP server for local testing

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    BizzShort - Local Server Setup     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pythonCmd = "python3"
} else {
    Write-Host "Error: Python is not installed!" -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Use Node.js server (see instructions below)" -ForegroundColor Yellow
    exit 1
}

# Get Python version
$pythonVersion = & $pythonCmd --version 2>&1
Write-Host "✓ Python detected: $pythonVersion" -ForegroundColor Green
Write-Host ""

# Set port
$port = 8080
Write-Host "Starting server on http://localhost:$port" -ForegroundColor Yellow
Write-Host ""
Write-Host "Server Options:" -ForegroundColor Cyan
Write-Host "  • Home Page:      http://localhost:$port/index.html" -ForegroundColor White
Write-Host "  • About:          http://localhost:$port/about.html" -ForegroundColor White
Write-Host "  • Blog:           http://localhost:$port/blog.html" -ForegroundColor White
Write-Host "  • Contact:        http://localhost:$port/contact.html" -ForegroundColor White
Write-Host "  • Analytics:      http://localhost:$port/analytics.html" -ForegroundColor White
Write-Host "  • Advertise:      http://localhost:$port/advertise.html" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Python HTTP server
try {
    if ($pythonVersion -match "Python 3") {
        & $pythonCmd -m http.server $port --bind 127.0.0.1
    } else {
        & $pythonCmd -m SimpleHTTPServer $port
    }
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Server stopped." -ForegroundColor Yellow