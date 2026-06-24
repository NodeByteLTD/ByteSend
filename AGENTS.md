# AGENTS.md — ByteSend

Guidelines for AI coding agents (Claude Code, Copilot, etc.) working in this repository.

---

## Repository Overview

ByteSend is a self-hostable transactional and marketing email platform built as a pnpm monorepo.

| App / Package | Path | Purpose |
|---|---|---|
| Web app | `apps/web/` | Next.js 15 dashboard + tRPC API + Hono public REST API |
| SMTP server | `apps/smtp-server/` | Lightweight SMTP bridge that proxies to the ByteSend API |
| Docs | `apps/docs/` | Product documentation site |
| TypeScript SDK | `packages/sdk/` | Official TS/JS client library |
| Python SDK | `packages/python-sdk/` | Official Python client library |
| Go SDK | `packages/go-sdk/` | Official Go client library |
| ESLint config | `packages/eslint-config/` | Shared lint rules |

**Primary stack (web app):** Next.js · TypeScript · tRPC · Hono · Prisma · PostgreSQL · Redis · AWS SES · NextAuth v4

---

## Development Commands

```bash
pnpm install          # install all workspace deps
pnpm dev              # start all apps in watch mode
pnpm build            # production build
pnpm lint             # eslint across all packages
pnpm test:web         # run web unit tests (vitest)
pnpm test:web:all     # unit + integration tests
pnpm db:migrate-dev   # apply pending Prisma migrations
pnpm db:studio        # open Prisma Studio
pnpm dx:up            # start local Docker infra (Postgres, Redis, etc.)
pnpm dx:down          # stop local Docker infra
```

All commands run from the repo root via Turbo unless otherwise noted.

---

## Architecture Notes

### Web app (`apps/web/src/`)

```
server/
  api/          tRPC routers and context (trpc.ts is the source of truth for auth layers)
  public-api/   Hono REST API — authenticated via API keys (Bearer token)
  service/      Business logic (LimitService, EmailService, etc.)
  aws/          SES + SNS clients
  auth.ts       NextAuth configuration (providers, session/jwt callbacks)
  db.ts         Prisma client singleton

app/
  (dashboard)/  Authenticated Next.js App Router pages
  (marketing)/  Public marketing pages
  api/          Next.js API routes (auth, webhooks, etc.)
```

### Auth layers (tRPC, in order of strictness)

1. `publicProcedure` — no auth
2. `authedProcedure` — valid session + not banned (DB check on every call)
3. `protectedProcedure` — extends authed
4. `twoFactorProtectedProcedure` — extends protected, requires 2FA cookie
5. `teamProcedure` — extends protected, resolves active team from `x-team-id` header
6. `teamAdminProcedure` — team ADMIN role required
7. `adminProcedure` — platform admin required (`isAdmin` flag or env var)
8. `founderProcedure` — founder only (`FOUNDER_EMAIL` env var)

### Public REST API (Hono)

All routes authenticate via `getTeamFromToken()` in `src/server/public-api/auth.ts`. This validates the `bs_<clientId>_<token>` API key format and checks that no ADMIN team member is banned.

### Session / JWT

- `isBanned`, `isAdmin`, `isFounder`, `isEnvAdmin`, `isBetaUser` are all surfaced on `session.user`
- `isBanned` is also embedded in the JWT so the Edge middleware can redirect without a DB call
- The middleware (`middleware.ts`) protects `/dashboard`, `/broadcasts`, `/campaigns`

---

## Key Conventions

- **No comments explaining what code does** — name things clearly instead. Only add a comment for a non-obvious *why* (hidden constraint, workaround, invariant).
- **Conventional Commits** — prefix messages: `fix(scope):`, `feat(scope):`, `chore(scope):`, `docs(scope):`
- **Branch from `develop`** — PRs target `develop`, not `main`
- **tRPC for internal API calls** — do not add raw fetch calls between dashboard and the backend; use tRPC
- **Hono for the public REST API** — do not mix tRPC into the public API surface
- **Prisma migrations** — always generate and commit migration files; never edit the DB directly in production
- **Environment variables** — all vars must be declared in `apps/web/src/env.ts` (t3-env); failing to do so will cause a build error

---

## What NOT to Do

- Do not add `console.log` to production code — use the structured logger (`import { logger } from "~/server/logger/log"`)
- Do not use `db.user.findUnique` without a `select` — always select only the fields you need
- Do not skip `isBanned` checks in new auth paths — every new procedure that accepts a session must sit behind `authedProcedure` or higher
- Do not add fields to Prisma `select` that don't exist in `schema.prisma` — TypeScript will infer the wrong type silently
- Do not bypass the `LimitService` when sending emails — it enforces plan quotas and the `isBlocked` team flag
- Do not create new pages under `(dashboard)/` without ensuring they are protected by the middleware matcher
- Do not run `pnpm install` with `--ignore-scripts` — some AWS SDK packages require postinstall scripts to populate their `commands/` directories

---

## Testing

- Unit tests live alongside source files (`*.unit.test.ts`)
- Integration tests require local Docker infra (`pnpm dx:up` first): `*.integration.test.ts`
- Test runner: Vitest
- Do not mock the database in integration tests — they run against a real local Postgres instance

---

## Reference Docs

Internal references live in `.references/`:

- `smtp-auth-and-operations.md` — SMTP server auth flow
- `webhook-architecture.md` — webhook delivery and retry model
- `notification-integration.md` — in-app notification provider system
- `repository-governance.md` — PR/issue template maintenance checklist
- `release-playbook.md` — how to cut a release

---

## Security

- Report vulnerabilities privately per `.github/SECURITY.md` — do not open public issues for security bugs
- Never commit secrets or `.env` files
- All user-facing input is validated at the tRPC/Hono boundary via Zod schemas
