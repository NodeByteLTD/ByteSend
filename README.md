![ByteSend](./apps/web/public/nameplate.png)

**Developer-friendly email sending.** A modern alternative to Resend, SendGrid, Mailgun, and Postmark — with a REST API, SMTP relay, campaigns, contact management, and real-time webhooks.

[Dashboard](https://bytesend.cloud) · [Documentation](https://docs.bytesend.cloud) · [API Reference](https://docs.bytesend.cloud/api-reference/introduction) · [Discord](https://discord.gg/nodebyte)

---

## What is ByteSend?

ByteSend is an open-source email platform built by [NodeByte LTD](https://nodebyte.co.uk). It wraps AWS SES to give you a developer-friendly REST API and SMTP relay, a transactional email dashboard, campaign management, contact books, domain verification, and delivery analytics — all in one self-hostable package.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Prisma ORM) |
| Cache / Queue | Redis |
| Email delivery | AWS SES |
| Auth | NextAuth.js v5 |
| Payments | Stripe |
| Monorepo | Turborepo + pnpm workspaces |
| SMTP relay | Custom Node.js SMTP server |

---

## Repository Structure

```
apps/
  web/          # Main Next.js application (dashboard + API)
  docs/         # Mintlify documentation site
  smtp-server/  # Standalone SMTP-to-API relay server

packages/
  lib/          # Shared utilities and Stripe plan definitions
  sdk/          # TypeScript SDK for the ByteSend REST API
  ui/           # Shared React component library
  email-editor/ # Drag-and-drop email editor
  eslint-config/
  typescript-config/
```

---

## Getting Started (Development)

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for local Postgres + Redis)
- An AWS account (for SES email delivery)

### 1. Clone and install

```bash
git clone https://github.com/NodeByteHosting/bytesend.git
cd bytesend
corepack enable
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values (see [Environment Variables](#environment-variables) below), then create a symlink so Next.js can find it:

```bash
# Linux / macOS
ln -s ../../.env apps/web/.env

# Windows (PowerShell, run as administrator)
New-Item -ItemType SymbolicLink -Path apps\web\.env -Target ..\..\env
```

### 3. Start the development server

```bash
pnpm dev
```

This starts the Next.js app at **http://localhost:3000** with a local Postgres and Redis via Docker Compose automatically.

### 4. Set up the database

```bash
pnpm db:migrate-dev
```

---

## Environment Variables

The full list lives in `.env.example`. The most important ones:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `NEXTAUTH_URL` | Public URL of the app (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random secret — generate with `openssl rand -base64 32` |
| `AWS_ACCESS_KEY` | AWS access key ID (SES permissions required) |
| `AWS_SECRET_KEY` | AWS secret access key |
| `AWS_DEFAULT_REGION` | AWS region (e.g. `eu-west-1`) |
| `GITHUB_ID` | GitHub OAuth app client ID (optional) |
| `GITHUB_SECRET` | GitHub OAuth app client secret (optional) |
| `STRIPE_SECRET_KEY` | Stripe secret key (optional, needed for billing) |

---

## Self-Hosting with Docker

ByteSend ships with Docker support out of the box. See [docker-compose.web.yml](./docker-compose.web.yml) for the full production compose file.

### Quick start

```bash
# 1. Copy and fill in environment variables
cp .env.example .env

# 2. Start all services (app + Postgres + Redis)
docker compose -f docker-compose.web.yml up -d

# 3. Run database migrations
docker compose -f docker-compose.web.yml exec web pnpm db:migrate-deploy
```

The app will be available at **http://localhost:3000**.

For SMTP relay support, see [docker-compose.smtp.yml](./docker-compose.smtp.yml) or the [SMTP Server documentation](https://docs.bytesend.cloud/self-hosting/smtp-server).

For a full self-hosting guide including reverse proxy, TLS, and firewall setup, see the [self-hosting documentation](https://docs.bytesend.cloud/self-hosting/overview).

---

## Useful Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm db:migrate-dev` | Run Prisma migrations (dev) |
| `pnpm db:migrate-deploy` | Run Prisma migrations (production) |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm test:web` | Run default web test suite |
| `pnpm test:web:all` | Run full test suite (requires Docker) |
| `pnpm stripe:seed` | Seed Stripe plans |
| `pnpm dev:docs` | Start docs site (Mintlify) |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Open a pull request against `main`

Please check existing issues before opening a new one.

---

## License

UNLICENSED — © [NodeByte LTD](https://nodebyte.co.uk)
