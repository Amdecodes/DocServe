# 1. Base image
FROM node:20-alpine

# Install dependencies including openssl for Prisma
RUN apk add --no-cache openssl libc6-compat

# Install pnpm
RUN npm install -g pnpm

# 2. Set working directory
WORKDIR /app

# 3. Copy dependency files AND prisma folder first
# This is crucial because postinstall runs 'prisma generate'
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

# 4. Install dependencies
# Using --prefer-offline to speed up if possible
RUN pnpm install --frozen-lockfile

# 5. Copy rest of project
COPY . .

# 6. Build Next.js
RUN pnpm run build

# 7. Expose port
EXPOSE 3000

# 8. Start app
CMD ["pnpm", "start"]
