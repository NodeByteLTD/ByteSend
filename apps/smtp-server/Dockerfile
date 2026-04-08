FROM node:20.19-alpine3.20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the SMTP server
COPY src ./src
COPY tsconfig.json tsup.config.ts ./
RUN pnpm run build

FROM base AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose SMTP ports
# 25: SMTP (unencrypted)
# 587: Submission (STARTTLS)
# 465: SMTPS (implicit SSL/TLS)
# 2587: Alternative submission port
# 2465: Alternative SMTPS port
EXPOSE 25 465 587 2465 2587

CMD ["node", "apps/smtp-server/dist/server.js"]
