# Use Node.js as the base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

# Copy source files
COPY frontend/ ./

# Build the application
RUN npm run build

RUN npm prune --production

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy built assets from build stage
COPY --from=builder /app/frontend/build /app/build/
COPY --from=builder /app/frontend/node_modules /app/node_modules/

# Expose the port the frontend will run on
EXPOSE 3000

# Command to run the application
CMD ["node", "./build/index.js"]