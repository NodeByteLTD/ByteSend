# ByteSend

**Developer-friendly email sending.** A modern alternative to Resend, SendGrid, Mailgun, and Postmark with a REST API, SMTP support, campaigns, contact management, and real-time webhooks.

[Dashboard](https://bytesend.cloud) · [Documentation](https://docs.bytesend.cloud) · [API Reference](https://docs.bytesend.cloud/api-reference/introduction) · [Discord](https://discord.gg/BU8n8pJv8S)

---

## Features

- **Transactional Email** — Send single or batch emails via REST API or SMTP
- **Email Scheduling** — Schedule emails with natural language inputs like "tomorrow at 9am"
- **Campaigns** — Create and send marketing campaigns with personalisation variables
- **Contact Management** — Organise contacts into books with custom properties
- **Domain Management** — Add and verify sending domains with DNS record guidance
- **Webhooks** — Real-time event notifications with HMAC signature verification
- **Analytics** — Time-series delivery metrics and reputation monitoring
- **React Email** — First-class support for rendering React Email templates

---

## Quickstart

### 1. Get an API key

Create an account at [bytesend.cloud](https://bytesend.cloud) and generate an API key from [Developer Settings](https://bytesend.cloud/dev-settings/api-keys).

### 2. Verify a domain

Add and verify a sending domain at [bytesend.cloud/domains](https://bytesend.cloud/domains).

### 3. Send your first email

**Node.js**

```bash
npm install bytesend-js
```

```javascript
import { UseSend } from "bytesend-js";

const client = new UseSend("bs_your_api_key");

await client.emails.send({
  from: "hello@yourdomain.com",
  to: "user@example.com",
  subject: "Hello from ByteSend",
  html: "<p>Your first email via ByteSend.</p>",
});
```

**Python**

```bash
pip install usesend
```

```python
from usesend import UseSend

client = UseSend("bs_your_api_key")

data, err = client.emails.send({
    "from": "hello@yourdomain.com",
    "to": "user@example.com",
    "subject": "Hello from ByteSend",
    "html": "<p>Your first email via ByteSend.</p>",
})
```

**Go**

```bash
go get github.com/usesend/usesend-go
```

```go
client, _ := usesend.NewClient("bs_your_api_key")

client.Emails.Send(ctx, &usesend.EmailCreateParams{
    From:    "hello@yourdomain.com",
    To:      []string{"user@example.com"},
    Subject: "Hello from ByteSend",
    Html:    "<p>Your first email via ByteSend.</p>",
})
```

**cURL**

```bash
curl -X POST https://bytesend.cloud/api/emails \
  -H "Authorization: Bearer bs_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@yourdomain.com",
    "to": "user@example.com",
    "subject": "Hello from ByteSend",
    "html": "<p>Your first email via ByteSend.</p>"
  }'
```

---

## SMTP

Send emails through any SMTP-compatible client or framework.

| Setting  | Value                    |
|----------|--------------------------|
| Host     | `smtp.bytesend.cloud`    |
| Port     | `465`, `587`, `2465`, `2587` |
| Username | `bytesend`               |
| Password | Your API key             |

---

## SDKs

| Language   | Package                            | Install                            |
|------------|------------------------------------|------------------------------------|
| Node.js    | [bytesend-js](https://www.npmjs.com/package/bytesend-js) | `npm install bytesend-js`          |
| Python     | [usesend](https://pypi.org/project/usesend) | `pip install usesend`              |
| Go         | [usesend-go](https://github.com/usesend/usesend-go) | `go get github.com/usesend/usesend-go` |

---

## API Reference

Base URL: `https://bytesend.cloud/api/`

Authentication: `Authorization: Bearer bs_your_api_key`

| Resource       | Endpoints |
|----------------|-----------|
| Emails         | Send, batch send, schedule, cancel, retrieve |
| Contacts       | Create, update, upsert, bulk import/delete |
| Contact Books  | Create, update, delete, list |
| Domains        | Add, verify, delete |
| Campaigns      | Create, schedule, pause, resume, delete |
| Analytics      | Email time-series, reputation metrics |

Full reference at [docs.bytesend.cloud/api-reference](https://docs.bytesend.cloud/api-reference/introduction).

---

## Webhooks

ByteSend sends signed `POST` requests to your endpoint when events occur. Verify the `X-ByteSend-Signature` header to authenticate payloads.

**Email events:** `email.sent`, `email.delivered`, `email.bounced`, `email.opened`, `email.clicked`, `email.complained`, and more.

**Contact events:** `contact.created`, `contact.updated`, `contact.deleted`

**Domain events:** `domain.created`, `domain.verified`, `domain.updated`, `domain.deleted`

See the [Webhooks guide](https://docs.bytesend.cloud/guides/webhooks) for payload structure and signature verification examples.

---

## Community

- [Discord](https://discord.gg/BU8n8pJv8S) — ask questions, share feedback
- [Twitter / X](https://x.com/useSend_com) — updates and announcements
- [GitHub](https://github.com/usesend) — SDKs and open-source tooling

---

## License

UNLICENSED — © NodeByte Ltd.
