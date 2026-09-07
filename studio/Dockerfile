# syntax=docker/dockerfile:1

# ============================================================
# rddo — Sanity Studio (standalone content studio)
# Runs `sanity dev` on port 3333.
# Project id & dataset come from sanity.config.ts (l9ie13zf / production).
# ============================================================

FROM oven/bun:1.4-slim AS base
WORKDIR /app

# install deps first for layer caching
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# copy the rest of the studio source
COPY . .

EXPOSE 3333

# sanity dev binds to localhost by default — expose it for Docker
CMD ["bun", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3333"]
