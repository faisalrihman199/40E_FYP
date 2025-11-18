@echo off
echo 🌸 Sakina Backend - Quick Start Setup 🌸
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  PostgreSQL CLI not found. Make sure PostgreSQL is installed and running.
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm install

REM Check if .env file exists
if not exist .env (
    echo.
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  IMPORTANT: Please edit the .env file with your actual configuration!
    echo.
    echo Required steps:
    echo 1. Set up PostgreSQL database and update DB credentials
    echo 2. Generate JWT secrets ^(run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"^)
    echo 3. Configure email SMTP settings
    echo.
    pause
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup complete! To start the development server, run:
echo npm run dev
echo.
echo 📍 Server will run on: http://localhost:5000
echo 📚 API Docs: server\README.md
echo.
pause
