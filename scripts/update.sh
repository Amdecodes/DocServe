#!/bin/bash
set -euo pipefail

# Senedx Update Script
# Automates the update process for the PM2/Standalone deployment

echo "🚀 Starting Update Process..."

# 1. Pull latest code
echo "📥 Pulling latest changes..."
git pull

# 2. Install dependencies (in case of changes)
echo "📦 Installing/Updating dependencies..."
npm ci

# 3. Build application
echo "🏗️  Building application..."
npm run build

# 4. Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# 5. Reload PM2
echo "🔄 Reloading application..."
pm2 reload senedx-app

echo "✅ Update complete! Application is running with latest changes."
