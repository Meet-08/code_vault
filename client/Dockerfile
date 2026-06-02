# Stage 1: Build & Package
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY . .

RUN npm run build

#Step 2: Runtime Environment
FROM node:22-alpine AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

WORKDIR /app

COPY --from=builder /app/.output ./.output

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
