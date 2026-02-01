#!/bin/bash
set -euo pipefail

# ============================
# SENEDX Docker Deployment Script
# ============================

echo "🚀 Starting SENEDX Docker Deployment..."

# 0. Ensure script runs from repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# 1. Check Git
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed."
    exit 1
fi

# 2. Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed."
    echo "👉 Install with: curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# 3. Check Docker Compose (v2)
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose v2 not available."
    exit 1
fi

# 4. Pull latest code
echo "📥 Pulling latest code..."
git pull --rebase

# 5. Check .env
if [ ! -f .env ]; then
    echo "❌ .env file is missing!"
    exit 1
fi

# 6. Stop existing containers cleanly
echo "🛑 Stopping existing containers..."
docker compose down --remove-orphans

# 7. Build & start containers
echo "🐳 Building and starting containers..."
docker compose up -d --build

# 8. Cleanup dangling images
echo "🧹 Cleaning unused Docker images..."
docker image prune -f

# 9. Show status
echo "📊 Container status:"
docker compose ps

echo "🎉 Deployment complete!"
echo "👉 Logs: docker compose logs -f"
