# ──────────────────────────────────────────────
#  Backend — Production Dockerfile
#  Uses node:20-alpine for a minimal image size
# ──────────────────────────────────────────────
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (layer cache-friendly)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads

# Expose the API port
EXPOSE 5000

# Run with plain node in production (no nodemon)
CMD ["node", "server.js"]
