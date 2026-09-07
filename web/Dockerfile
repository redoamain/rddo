# syntax=docker/dockerfile:1

# ============================================================
# rddo — web (Astro + Sanity, static output)
# Build: fetch Sanity content & generate static site
# Run:   served by nginx
# ============================================================

# ---------- stage 1: build the Astro site ----------
FROM oven/bun:1.4-slim AS build
WORKDIR /app

# Public project config — dataset is public-read, so no secrets here.
ARG PUBLIC_SANITY_PROJECT_ID=l9ie13zf
ARG PUBLIC_SANITY_DATASET=production

# 1) install deps (cached as long as lockfile is unchanged)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# 2) copy source
COPY . .

# 3) astro.config.mjs reads PUBLIC_* via loadEnv() from a .env file
RUN printf 'PUBLIC_SANITY_PROJECT_ID=%s\nPUBLIC_SANITY_DATASET=%s\n' \
    "$PUBLIC_SANITY_PROJECT_ID" "$PUBLIC_SANITY_DATASET" > .env

# 4) static build (fetches Sanity content at build time)
RUN bun run build

# ---------- stage 2: minimal static server ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
