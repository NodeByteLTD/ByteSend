![ByteSend](./apps/web/public/nameplate.png)

**Open-source email infrastructure.** REST API, SMTP relay, campaigns, contact management, and real-time webhooks self-hostable or managed on [bytesend.cloud](https://bytesend.cloud).

[Dashboard](https://bytesend.cloud) · [Docs](https://docs.bytesend.cloud) · [API Reference](https://docs.bytesend.cloud/api-reference/introduction) · [Discord](https://discord.gg/xqkqzVRC4S)

---

## Cloud

The fastest way to get started is the managed cloud at [bytesend.cloud](https://bytesend.cloud). No infrastructure to manage — just sign up, verify a domain, and start sending.

| Plan | Price | Emails/month | Domains | Contacts |
|---|---|---|---|---|
| **Free** | CA$0 | 5,000 | 3 | 500 |
| **Hobby** | CA$5/mo | 15,000 | 5 | 2,000 |
| **Lite** | CA$10/mo | 50,000 | 10 | 10,000 |
| **Professional** | CA$30/mo | 150,000 | 100 | 1,000,000 |
| **Lifetime** | CA$60 once | Unlimited | 500 | 10,000,000 |

Hobby and above include marketing campaigns and overage billing. Professional and Lifetime include advanced analytics and priority support.

---

## Self-Hosting

ByteSend is fully self-hostable under the AGPL-3.0 license.

```bash
git clone https://github.com/NodeByteHosting/bytesend.git
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

---

## License

ByteSend is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

See [LICENSE](LICENSE) for full details.

