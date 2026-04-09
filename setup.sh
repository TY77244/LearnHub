#!/bin/bash
# LearnHub Setup Script for Linux/Mac

echo "🚀 LearnHub Platform Setup"
echo "============================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if Python is installed  
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 not found. Some features will be limited."
else
    echo "✅ Python 3 found"
fi

echo "✅ Node.js found: $(node --version)"

# Install Node.js dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
npm install

# Install Python dependencies if Python is available
if command -v python3 &> /dev/null; then
    echo ""
    echo "📦 Installing Python dependencies..."
    python3 -m pip install -r requirements.txt
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. For Node.js backend:"
echo "   npm start"
echo ""
echo "2. For Python backend (optional):"
echo "   python3 structure.py"
echo ""
echo "3. Open app.html in your browser"
echo ""
echo "Happy Learning! 📚"
