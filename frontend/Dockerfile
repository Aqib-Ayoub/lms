# ──────────────────────────────────────────────
#  Frontend — Production Dockerfile (multi-stage)
#
#  Stage 1 (builder): Build the React/Vite app
#  Stage 2 (runner):  Serve with Nginx
#
#  VITE_* variables are baked into the JS bundle
#  at build time, so they must be passed as
#  build ARGs (see docker-compose.prod.yml).
# ──────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Declare build-time env vars (passed from docker-compose)
ARG VITE_API_URL=/api
ARG VITE_UPLOADS_URL=

# Make them available to the Vite build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_UPLOADS_URL=$VITE_UPLOADS_URL

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────
FROM nginx:1.27-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
