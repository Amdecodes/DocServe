#!/bin/bash

# SENEDX Deployment Script
# Usage: ./scripts/deploy.sh

echo "🚀 Starting Deployment..."

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
