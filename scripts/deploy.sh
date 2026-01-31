#!/bin/bash

# SENEDX Deployment Script
# Usage: ./scripts/deploy.sh

# Try to load NVM configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check if npm/node is available now
if ! command -v npm &> /dev/null; then
    echo "❌ Error: 'npm' is not found."
    echo "This script requires Node.js. If you installed it via NVM, make sure to run this script as a user with NVM accessing rights."
    echo "To fix: Install Node.js v18+ manually on this VPS."
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
