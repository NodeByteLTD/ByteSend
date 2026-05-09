# ByteSend Docs

Documentation for ByteSend cloud and self-hosted users.

- Cloud dashboard: https://bytesend.cloud
- Docs: https://docs.bytesend.cloud
- API reference: https://docs.bytesend.cloud/api-reference/introduction

## Local development

From the repository root:

```bash
pnpm install
pnpm dev:docs
```

This starts the docs locally using Mintlify.

## Editing guidelines

- Use `https://bytesend.cloud` for cloud-hosted links.
- Prefer absolute links for dashboard paths in docs examples.
- Keep API examples aligned with `https://bytesend.cloud/api`.

## Deployment

Docs are deployed from this repository. Push changes to the default branch after review.
