# Contributing to ByteSend

Thanks for your interest in contributing.

## Before You Start

- Read the Code of Conduct in `CODE_OF_CONDUCT.md`
- Check open issues and pull requests to avoid duplicate work
- For security vulnerabilities, follow `SECURITY.md` (do not post publicly)

## Development Setup

Prerequisites:

- Node.js 20.19+
- pnpm 9+
- Docker (recommended for local infra)

Setup:

```bash
pnpm install
cp .env.example .env
pnpm dx:up
pnpm db:migrate-dev
pnpm dev
```

Useful commands:

```bash
pnpm lint
pnpm build
pnpm test:web
pnpm test:web:all
pnpm test:infra:down
```

## Branching and Commits

- Create a feature branch from `develop`
- Use clear commit messages (Conventional Commits preferred)

Examples:

- `fix(smtp): accept legacy username fallback`
- `docs(self-hosting): clarify smtp deployment path`

## Pull Requests

Please include:

- What changed and why
- Screenshots or logs for UI/behavior changes
- Testing notes (what you ran)
- Any migration or rollout impact

Checklist before opening a PR:

- Lint passes
- Relevant tests pass
- Changelog updated when user-facing behavior changes
- No unrelated refactors mixed into the PR

## Documentation Changes

- Keep docs and code behavior aligned
- Prefer concise examples that copy/paste cleanly
- Update affected docs when config names or workflows change

## Issue Reporting

Use the issue templates and provide reproducible details.

For bugs, include:

- Deployment type (Cloud or self-hosted)
- Version/commit
- Expected vs actual behavior
- Steps to reproduce
- Logs/errors (with secrets removed)

## Contributor License / Licensing Notes

By contributing, you agree your contributions are provided under the repository
license (AGPL-3.0-only).
