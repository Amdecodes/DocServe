#!/bin/bash
# Docker Build Script - Reads .env and passes build args

# Load environment variables from .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "🐳 Building Docker image with environment variables..."
echo "   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:0:20}..."

docker build \
    --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" \
    --build-arg NEXT_PUBLIC_BASE_URL="$NEXT_PUBLIC_BASE_URL" \
    -t bir-stationary .

echo ""
echo "✅ Build complete! Run with: docker run -p 3000:3000 --env-file .env bir-stationary"
