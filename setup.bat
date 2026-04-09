@echo off
REM LearnHub Setup Script for Windows

echo.
echo 🚀 LearnHub Platform Setup
echo ============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Python 3 not found. Some features will be limited.
) else (
    echo ✅ Python 3 found: 
    python --version
)

REM Install Node.js dependencies
echo.
echo 📦 Installing Node.js dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)

REM Install Python dependencies if Python is available
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo 📦 Installing Python dependencies...
    python -m pip install -r requirements.txt
)

echo.
echo ✅ Setup complete!
echo.
echo To start the application:
echo.
echo 1. For Node.js backend:
echo    npm start
echo.
echo 2. For Python backend (optional):
echo    python structure.py
echo.
echo 3. Open app.html in your browser
echo.
echo Happy Learning! 📚
echo.
pause
