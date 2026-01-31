#!/bin/bash -l

# SENEDX Deployment Script
# Usage: ./scripts/deploy.sh

# 0. Load Environment (NVM, .bashrc, etc)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$HOME/.bashrc" ] && source "$HOME/.bashrc"
[ -s "$HOME/.profile" ] && source "$HOME/.profile"

# 1. Critical Check: Is Node/NPM installed?
if ! command -v npm &> /dev/null; then
    echo "❌ CRITICAL ERROR: 'npm' is not found in PATH."
    echo "---------------------------------------------------"
    echo "It looks like Node.js is not installed or not in the path of this script."
    echo ""
    echo "👉 TRY RUNNING THIS TO INSTALL NODE.JS (Ubuntu/Debian):"
    echo "   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -"
    echo "   apt-get install -y nodejs"
    echo "---------------------------------------------------"
    exit 1
fi

echo "🚀 Starting Deployment..."

# 0. Ensure Global Tools Installed
if ! command -v pnpm &> /dev/null; then
    echo "⚠️ pnpm not found. Installing global pnpm..."
    npm install -g pnpm
fi

if ! command -v pm2 &> /dev/null; then
    echo "⚠️ PM2 not found. Installing global PM2..."
    npm install -g pm2
fi

# 1. Pull latest changes
echo "📥 Pulling latest code..."
git pull

# 2. Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# 3. Generate Prisma Client
echo "🗄️ Generating Prisma Client..."
pnpm run postinstall

# 4. Build Application
echo "🏗️ Building Next.js application..."
# Increase memory for build if needed
export NODE_OPTIONS='--max-old-space-size=4096'
pnpm run build

# 5. Restart PM2
echo "🔄 Restarting PM2 process..."
# Check if PM2 process exists
if pm2 show senedx-app > /dev/null; then
    pm2 reload senedx-app
    echo "✅ Application reloaded."
else
    pm2 start ecosystem.config.js
    echo "✅ Application started."
fi

echo "🎉 Deployment Complete!"
