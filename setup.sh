#!/bin/bash

# ORCA FINANCIAL Dashboard - Quick Setup Script
# For macOS / Linux

set -e

echo "🐋 ORCA FINANCIAL Dashboard Setup"
echo "=================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup environment
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo "✓ Created .env from .env.example"
    echo "⚠️  Please edit .env and set your DATABASE_URL if needed"
else
    echo ""
    echo "✓ .env file already exists"
fi

# Check if Docker is available for PostgreSQL
if command -v docker &> /dev/null; then
    echo ""
    echo "🐳 Docker detected. Would you like to start a local PostgreSQL container? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        docker run -d -p 5432:5432 \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -e POSTGRES_DB=app_db \
            --name orca-postgres \
            postgres:16
        echo "✓ PostgreSQL started on port 5432"
        
        # Wait for PostgreSQL to be ready
        echo "⏳ Waiting for PostgreSQL to be ready..."
        sleep 3
        
        # Push schema
        echo ""
        echo "📊 Pushing database schema..."
        npx drizzle-kit push
        echo "✓ Schema pushed successfully"
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "📖 For more info, see README.md"
