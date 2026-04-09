#!/bin/bash

# LearnHub Quick Start Script for Mac/Linux
# This script starts the Node.js server and opens the app in your browser

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "            🎓 LEARNHUB - QUICK START"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Then run this script again."
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: npm is not installed!"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✓ npm found: $(npm --version)"

# Check if packages are installed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ ERROR: Failed to install dependencies"
        read -p "Press Enter to exit..."
        exit 1
    fi
    echo "✓ Dependencies installed"
fi

echo ""
echo "🚀 Starting LearnHub server..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Server Information:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Local URL:     http://localhost:5000"

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "📄 App Location:  file://$SCRIPT_DIR/app.html"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

sleep 2

# Start the server in background and open browser
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Open app in browser based on OS
echo ""
echo "🌐 Opening app in your browser..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "http://localhost:5000/app.html" 2>/dev/null || echo "Please open: http://localhost:5000/app.html"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "http://localhost:5000/app.html" 2>/dev/null || echo "Please open: http://localhost:5000/app.html"
fi

echo ""
echo "✅ LearnHub is running!"
echo ""
echo "📚 Features Available:"
echo "  ✓ AI Q&A System"
echo "  ✓ Image Analysis"
echo "  ✓ Problem Solver (8 subjects)"
echo "  ✓ Gamification (XP + Streaks)"
echo "  ✓ Document Upload"
echo "  ✓ Progress Tracking"
echo ""
echo "💡 Tips:"
echo "  • First time? Create a new account"
echo "  • Check TESTING_GUIDE.txt for detailed instructions"
echo "  • Press Ctrl+C to stop the server"
echo ""
echo "🔗 Quick Links:"
echo "  • Dashboard:        http://localhost:5000/app.html#dashboard"
echo "  • Ask AI:          http://localhost:5000/app.html#qa"
echo "  • Image Analysis:  http://localhost:5000/app.html#image"
echo "  • Problem Solver:  http://localhost:5000/app.html#solver"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Wait for server process
wait $SERVER_PID
