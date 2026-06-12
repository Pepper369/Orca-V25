# ORCA FINANCIAL Dashboard - Quick Setup Script
# For Windows (PowerShell)

Write-Host "🐋 ORCA FINANCIAL Dashboard Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Setup environment
if (-Not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "⚙️  Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env from .env.example" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env and set your DATABASE_URL if needed" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

# Check if Docker is available for PostgreSQL
try {
    docker --version | Out-Null
    Write-Host ""
    Write-Host "🐳 Docker detected. Would you like to start a local PostgreSQL container? (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq 'y' -or $response -eq 'Y') {
        docker run -d -p 5432:5432 `
            -e POSTGRES_USER=postgres `
            -e POSTGRES_PASSWORD=postgres `
            -e POSTGRES_DB=app_db `
            --name orca-postgres `
            postgres:16
        Write-Host "✓ PostgreSQL started on port 5432" -ForegroundColor Green
        
        # Wait for PostgreSQL to be ready
        Write-Host ""
        Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        # Push schema
        Write-Host ""
        Write-Host "📊 Pushing database schema..." -ForegroundColor Yellow
        npx drizzle-kit push
        Write-Host "✓ Schema pushed successfully" -ForegroundColor Green
    }
} catch {
    Write-Host ""
    Write-Host "ℹ️  Docker not detected. Skipping PostgreSQL setup." -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To start the development server:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Then open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 For more info, see README.md" -ForegroundColor Gray
