# Use Node.js 22 Alpine as base image
FROM node:22-alpine AS base

WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Install all dependencies for building
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/eslint-config/package.json ./packages/eslint-config/
RUN pnpm install --frozen-lockfile --silent

# Build the source code
FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Production runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV LOG_LEVEL=silent

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 hono

# Copy package files and install production dependencies only
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/eslint-config/package.json ./packages/eslint-config/
RUN pnpm install --frozen-lockfile --prod --silent

# Copy built application
COPY --from=builder --chown=hono:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=hono:nodejs /app/apps/web/dist ./apps/web/dist

# Copy drizzle configuration, migration files, and env files for migrations
COPY --from=builder --chown=hono:nodejs /app/apps/server/drizzle.config.ts ./apps/server/
COPY --from=builder --chown=hono:nodejs /app/apps/server/src/env.ts ./apps/server/src/
COPY --from=builder --chown=hono:nodejs /app/apps/server/src/db/migrations ./apps/server/src/db/migrations

USER hono:nodejs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --spider --quiet http://localhost:8080/ || exit 1

# Run migrations and then start the server
CMD ["sh", "-c", "pnpm --filter @fit-tracker/server db:migrate && pnpm start"]