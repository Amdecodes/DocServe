# Deployment Guide for SENEDX

This guide covers how to deploy the application to your VPS using PM2 and Nginx.

## Prerequisites

On your VPS, ensure you have the following installed:
- **Node.js** (v18+)
- **Nginx**
- **PM2** (`npm install -g pm2`)
- **Git**

## Quick Deployment (Automated)

We have created a helper script to automate the update process.

1. SSH into your VPS.
2. Navigate to your project directory.
3. Run the deploy script:
   ```bash
   ./scripts/deploy.sh
   ```

## Manual Deployment Steps

If you prefer to deploy manually, follow these steps:

### 1. Update Code
```bash
git pull origin main
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Database Migration
```bash
pnpm run postinstall # Runs prisma generate
# If you have db changes: npx prisma migrate deploy
```

### 4. Build Application
```bash
# Optimize memory for build
export NODE_OPTIONS='--max-old-space-size=4096'
pnpm run build
```

### 5. Start/Restart Application
Using PM2 (Zero downtime reload):
```bash
pm2 reload senedx-app
```
*Note: If this is the first time, run:* `pm2 start ecosystem.config.js`

## Nginx Configuration

Ensure your Nginx config (`/etc/nginx/sites-available/default` or similar) proxies to the Next.js app running on port 3000.

```nginx
server {
    server_name senedx.com www.senedx.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
After changing Nginx config:
```bash
sudo nginx -t
sudo systemctl restart nginx
```
