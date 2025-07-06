FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --only=production=false

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /root/.npm && \
    rm -rf /tmp/* && \
    rm -rf /var/cache/apk/*

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

USER nestjs

EXPOSE 2121

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health.js || exit 1

CMD ["node", "dist/main.js"]