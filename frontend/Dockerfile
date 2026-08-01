# syntax=docker/dockerfile:1

# ==========================================================
# Global build arguments
# ==========================================================

ARG NODE_VERSION=22-alpine


# ==========================================================
# Stage 1: Install dependencies
# ==========================================================

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

# Some Node.js packages may require glibc compatibility on Alpine.
RUN apk add --no-cache libc6-compat

# Copy dependency files separately for better Docker caching.
COPY package.json package-lock.json ./

# Install exact dependency versions from package-lock.json.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund


# ==========================================================
# Stage 2: Build the Next.js application
# ==========================================================

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# This must be passed during docker compose build.
ARG NEXT_PUBLIC_API_URL

# NEXT_PUBLIC variables are embedded into the browser bundle
# during `npm run build`.
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Stop the build when the API URL was not supplied.
RUN test -n "${NEXT_PUBLIC_API_URL}" || \
    (echo "ERROR: NEXT_PUBLIC_API_URL build argument is required" && exit 1)

RUN npm run build


# ==========================================================
# Stage 3: Production runtime
# ==========================================================

FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Optional metadata.
LABEL org.opencontainers.image.title="Smart Classroom Frontend"
LABEL org.opencontainers.image.description="Next.js frontend for Smart Classroom Edge AI System"

# Copy only the files needed by the standalone server.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static


# Run as the built-in non-root Node.js user.
USER node

EXPOSE 3000

# Verify that the Next.js server is responding.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]