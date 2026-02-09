#!/bin/bash
set -euo pipefail

# Senedx VPS Setup Script
# Installs dependencies for Puppeteer and other system libraries

echo "🚀 Setting up VPS dependencies for Senedx..."

# 1. Update package list
echo "📦 Updating package list..."
sudo apt-get update

# 2. Install Puppeteer dependencies
# List from Puppeteer docs: https://pptr.dev/browsers/api/puppeteer.launch
echo "🌐 Installing Chromium dependencies..."
sudo apt-get install -y ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils

# 3. Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
    echo "⚙️ Installing PM2..."
    sudo npm install -g pm2
fi

echo "✅ Setup complete!"
