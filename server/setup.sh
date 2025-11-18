#!/bin/bash

echo "🌸 Sakina Backend - Quick Start Setup 🌸"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL CLI not found. Make sure PostgreSQL is installed and running."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Please edit the .env file with your actual configuration!"
    echo ""
    echo "Required steps:"
    echo "1. Set up PostgreSQL database and update DB credentials"
    echo "2. Generate JWT secrets (run: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\")"
    echo "3. Configure email SMTP settings"
    echo ""
    read -p "Press Enter after you've configured .env file..."
else
    echo "✅ .env file already exists"
fi

# Check if database connection works
echo ""
echo "🗄️  Testing database connection..."
node -e "
require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    console.log('');
    console.log('Please check:');
    console.log('1. PostgreSQL is running');
    console.log('2. Database exists (createdb ${process.env.DB_NAME || 'sakina_db'})');
    console.log('3. Credentials in .env are correct');
    process.exit(1);
  });
"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup complete! Starting development server..."
    echo ""
    echo "📍 Server will run on: http://localhost:${PORT:-5000}"
    echo "📚 API Docs: server/README.md"
    echo ""
    npm run dev
else
    echo ""
    echo "❌ Setup failed. Please fix the errors above and try again."
fi
