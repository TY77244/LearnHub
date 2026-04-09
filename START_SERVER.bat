@echo off
REM LearnHub Quick Start Script for Windows
REM This script starts the Node.js server and opens the app in your browser

echo.
echo ═══════════════════════════════════════════════════════════════
echo            🎓 LEARNHUB - QUICK START
echo ═══════════════════════════════════════════════════════════════
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js found

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: npm is not installed!
    echo.
    pause
    exit /b 1
)

echo ✓ npm found

REM Check if packages are installed
if not exist "node_modules" (
    echo.
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed
)

echo.
echo 🚀 Starting LearnHub server...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Server Information:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🌐 Local URL:     http://localhost:5000
echo 📄 App Location:  file:///e:/web development/app.html
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

timeout /t 2 >nul

REM Start the server
start cmd /k npm start

REM Wait for server to start
timeout /t 3 >nul

REM Open app in browser
echo.
echo 🌐 Opening app in your browser...
start "" "http://localhost:5000/app.html"

echo.
echo ✅ LearnHub is running!
echo.
echo 📚 Features Available:
echo   ✓ AI Q&A System
echo   ✓ Image Analysis
echo   ✓ Problem Solver (8 subjects)
echo   ✓ Gamification (XP + Streaks)
echo   ✓ Document Upload
echo   ✓ Progress Tracking
echo.
echo 💡 Tips:
echo   • First time? Create a new account
echo   • Check TESTING_GUIDE.txt for detailed instructions
echo   • Press Ctrl+C in server window to stop
echo.
echo 🔗 Quick Links:
echo   • Dashboard:        http://localhost:5000/app.html#dashboard
echo   • Ask AI:          http://localhost:5000/app.html#qa
echo   • Image Analysis:  http://localhost:5000/app.html#image
echo   • Problem Solver:  http://localhost:5000/app.html#solver
echo.
echo ═══════════════════════════════════════════════════════════════
