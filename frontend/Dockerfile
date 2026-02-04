# Use an official Node runtime as a parent image
FROM node:20-slim AS base

# Install pnpm
RUN npm install -g pnpm

# Set work directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy project
COPY . .

# Build the application
# RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "dev"]
