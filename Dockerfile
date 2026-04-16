# stage 1: build
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml* npm-shrinkwrap.json* yarn.lock* ./
RUN pnpm install || npm install || yarn install

COPY . .
RUN npm run build

# stage 2: runner
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]