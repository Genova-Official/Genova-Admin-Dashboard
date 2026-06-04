# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Copy all source files
COPY . .

# Install all workspace dependencies
RUN npm ci

# Environment variables must be present at build time for Next.js client-side
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Run production build
RUN npm run build

# Stage 2: Runner
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only the necessary outputs for running
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
