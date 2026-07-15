# Deployment Guide for SENEDX

This guide covers how to deploy the application to your VPS using **PM2** and **Nginx** with the optimized standalone build.

## Prerequisites

On your VPS (Ubuntu/Debian recommended), ensure you have:
- **Node.js** (v18.17+ or v20+)
- **Nginx**
- **Git**

## 1. Initial Setup

1. **Clone the repository** to your VPS:
   ```bash
   git clone <your-repo-url> paperless
   cd paperless
   ```

2. **Run the VPS Setup Script**:
   This script installs system dependencies required for Puppeteer and PM2.
   ```bash
   chmod +x scripts/vps-setup.sh
   sudo ./scripts/vps-setup.sh
   ```

3. **Setup Environment Variables**:
   Create a `.env` file with your production keys:
   ```bash
   cp .env.example .env
   nano .env
   # Fill in your DATABASE_URL, NEXT_PUBLIC_..., etc.
   ```

## 2. Install & Build

1. **Install Dependencies**:
   ```bash
   npm ci
   ```

2. **Build the Application**:
   ```bash
   npm run build
   ```
   *This will create a `.next/standalone` folder optimized for production.*

3. **Database Migration**:
   ```bash
   npx prisma migrate deploy
   ```

## 3. Operations (Start/Restart)

We use **PM2** to manage the application process.

- **Start the application**:
  ```bash
  pm2 start ecosystem.config.js --env production
  ```

- **Save the process list** (so it restarts on reboot):
  ```bash
  pm2 save
  pm2 startup
  ```

- **Update & Restart**:
  When you have new code:
  ```bash
  git pull
  npm ci
  npm run build
  npx prisma migrate deploy
  pm2 reload senedx-app
  ```

## 4. Automation

We have created scripts to simplify management.

- **Update Application** (Pull, Build, Restart):
  ```bash
  ./scripts/update.sh
  ```

## 5. Nginx Configuration (Optional but Recommended)

Set up Nginx as a reverse proxy to port 3000.

1. Create a config file: `/etc/nginx/sites-available/senedx`
   ```nginx
   server {
       server_name yourdomain.com;
   
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
2. Enable it:
   ```bash
   sudo ln -s /etc/nginx/sites-available/senedx /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 6. Verification and Logs

- **View Logs**:
  ```bash
  pm2 logs senedx-app
  ```

- **Update Environment Variables**:
  If you need to change secrets (e.g., API keys) in `.env`:
  1. Edit the file on the VPS: `nano .env`
  2. If it's a **Server-side Variable** (e.g., `DATABASE_URL`):
     ```bash
     pm2 restart senedx-app
     ```
  3. If it's a **Client-side Variable** (`NEXT_PUBLIC_...`):
     ```bash
     npm run build
     pm2 reload senedx-app
     ```
