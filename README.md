![ByteSend](./apps/web/public/nameplate.png)

**Open-source email infrastructure that works.** REST API, SMTP relay, campaigns, contact management, and real-time webhooks - self-hosted or managed on [bytesend.cloud](https://bytesend.cloud).

[Dashboard](https://bytesend.cloud) · [Docs](https://docs.bytesend.cloud) · [API Reference](https://docs.bytesend.cloud/api-reference/introduction) · [Discord](https://discord.gg/xqkqzVRC4S)

---

## Cloud

The fastest way to get started is the managed cloud at [bytesend.cloud](https://bytesend.cloud). No infrastructure to manage — just sign up, verify a domain, and start sending.


---

## Self-Hosting

ByteSend is fully self-hostable under the AGPL-3.0 license.

```bash
git clone https://github.com/NodeByteLTD/ByteSend.git
cp docker/prod/.env.example docker/prod/.env
# fill in your values
docker compose -f docker/prod/compose.yml --env-file docker/prod/.env up -d
docker compose -f docker/prod/compose.yml --env-file docker/prod/.env exec web pnpm db:migrate-deploy
```

Full setup guide (reverse proxy, TLS, firewall, SMTP relay): [docs.bytesend.cloud/self-hosting/overview](https://docs.bytesend.cloud/self-hosting/overview)

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL + Prisma |
| Cache | Redis |
| Email delivery | AWS SES |
| Auth | NextAuth.js v5 |
| Monorepo | Turborepo + pnpm |

---

## Development

```bash
pnpm install
cp .env.example .env   # fill in values, then symlink: ln -s ../../.env apps/web/.env
pnpm dev               # starts app at http://localhost:3000
pnpm db:migrate-dev    # run migrations
```

See [docs.bytesend.cloud/get-started/local](https://docs.bytesend.cloud/get-started/local) for the full local setup guide.

---

## Contributing

1. Fork the repo and create a feature branch
2. Commit with [Conventional Commits](https://www.conventionalcommits.org/)
3. Open a pull request against `main`

Please check existing issues before opening a new one.

See also:

- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)
- [Support](SUPPORT.md)

---

## License

ByteSend is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

See [LICENSE](LICENSE) for full details.
