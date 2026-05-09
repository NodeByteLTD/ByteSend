# Notification Provider Integration Guide

## Overview

The notification provider system allows your team to receive real-time alerts via Discord, Slack, Microsoft Teams, Telegram, or custom webhooks. This guide shows how to integrate notifications into your existing services.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Event Sources                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Webhook      │  │ Campaign     │  │ Domain       │           │
│  │ Service      │  │ Service      │  │ Service      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│         │                  │                   │                 │
│         └──────────────────┼───────────────────┘                 │
│                            ▼                                      │
│                 NotificationEmitter                              │
│            (High-level notification API)                         │
│                            │                                      │
│         ┌──────────────────┼──────────────────┐                  │
│         ▼                  ▼                  ▼                   │
│  NotificationProviderService (routes to providers)              │
│         │                                                         │
│    ┌────┴──────┬──────────┬──────────┬──────────┐               │
│    ▼           ▼          ▼          ▼          ▼               │
│  Discord     Slack     Teams    Telegram   Custom               │
│  Provider  Provider   Provider  Provider   Webhook              │
│    │           │         │         │          │                 │
│    └───────────┴─────────┴─────────┴──────────┘                 │
│                         ▼                                         │
│                    External Services                             │
└─────────────────────────────────────────────────────────────────┘
```

## Integration Points

### 1. Webhook Service (Email Events)

**File**: `apps/web/src/server/service/webhook-service.ts`

Add notifications when emails are delivered, bounced, or opened:

```typescript
import { NotificationEmitter } from "./notification-emitter";

// In your WebhookService.emit() method or webhook processor:

if (eventType === "email.delivered") {
  NotificationEmitter.emitEmailEvent(teamId, "delivered", {
    emailId: payload.data.emailId,
    to: payload.data.to,
    subject: payload.data.subject,
  }).catch(err => logger.error("Notification failed", err));
}

if (eventType === "email.bounced") {
  NotificationEmitter.emitEmailEvent(teamId, "bounced", {
    emailId: payload.data.emailId,
    to: payload.data.to,
    subject: payload.data.subject,
  }).catch(err => logger.error("Notification failed", err));
}

if (eventType === "email.complained") {
  NotificationEmitter.emitEmailEvent(teamId, "complained", {
    emailId: payload.data.emailId,
    to: payload.data.to,
    subject: payload.data.subject,
  }).catch(err => logger.error("Notification failed", err));
}

if (eventType === "email.opened") {
  NotificationEmitter.emitEmailEvent(teamId, "opened", {
    emailId: payload.data.emailId,
    to: payload.data.to,
    subject: payload.data.subject,
  }).catch(err => logger.error("Notification failed", err));
}

if (eventType === "email.clicked") {
  NotificationEmitter.emitEmailEvent(teamId, "clicked", {
    emailId: payload.data.emailId,
    to: payload.data.to,
    subject: payload.data.subject,
  }).catch(err => logger.error("Notification failed", err));
}
```

### 2. Campaign Service

**File**: `apps/web/src/server/service/` (wherever campaigns are updated)

Add notifications when campaigns start/complete:

```typescript
import { NotificationEmitter } from "~/server/service/notification-emitter";

// When campaign starts:
await NotificationEmitter.emitCampaignEvent(teamId, "started", {
  campaignId: campaign.id,
  campaignName: campaign.name,
  totalContacts: campaign.total,
});

// When campaign completes:
await NotificationEmitter.emitCampaignEvent(teamId, "completed", {
  campaignId: campaign.id,
  campaignName: campaign.name,
  totalContacts: campaign.total,
  sent: campaign.sent,
});
```

### 3. Domain Service

**File**: `apps/web/src/server/service/` (wherever domains are verified)

Add notifications when domains are verified:

```typescript
import { NotificationEmitter } from "~/server/service/notification-emitter";

// When domain verification succeeds:
await NotificationEmitter.emitDomainEvent(teamId, {
  domainName: domain.name,
  status: "verified",
});

// When domain verification fails:
await NotificationEmitter.emitDomainEvent(teamId, {
  domainName: domain.name,
  status: "failed",
  error: "DKIM verification failed",
});
```

### 4. Contact Service

**File**: `apps/web/src/server/service/` (wherever contacts are created/deleted)

Add notifications for contact events:

```typescript
import { NotificationEmitter } from "~/server/service/notification-emitter";

// When contacts are created:
await NotificationEmitter.emitContactEvent(teamId, "created", {
  contactEmail: contact.email,
  contactBookName: contactBook.name,
  count: 1,
});

// When contacts are deleted:
await NotificationEmitter.emitContactEvent(teamId, "deleted", {
  contactEmail: contact.email,
  contactBookName: contactBook.name,
});
```

### 5. Error Handling

Use notifications for critical errors:

```typescript
import { NotificationEmitter } from "~/server/service/notification-emitter";

try {
  // Some operation
} catch (error) {
  await NotificationEmitter.emitErrorAlert(teamId, {
    title: "Email sending failed",
    message: "Failed to send campaign emails",
    errorCode: "SEND_FAILED",
    context: {
      campaignId: campaign.id,
      error: error instanceof Error ? error.message : "Unknown error",
    },
  }).catch(err => logger.error("Failed to send error notification", err));
  
  throw error;
}
```

## Frontend Usage

### Accessing the Notification Settings Page

Users can access notifications at: `/settings/notifications`

This page provides:
- List of configured providers
- Create/edit/delete providers
- Test message sending
- Statistics on sent/failed notifications
- Event type filtering
- Documentation for each provider

### API Endpoints

All endpoints are available via tRPC at `api.notificationProvider.*`:

```typescript
// List providers
const providers = await api.notificationProvider.list.useQuery();

// Create provider
api.notificationProvider.create.useMutation({
  type: "DISCORD",
  name: "Team Alerts",
  config: { webhookUrl: "https://..." },
  eventTypes: ["EMAIL_DELIVERED", "ERROR_ALERT"],
});

// Update provider
api.notificationProvider.update.useMutation({
  id: "provider_id",
  isActive: false,
});

// Delete provider
api.notificationProvider.delete.useMutation({ id: "provider_id" });

// Test provider
api.notificationProvider.test.useMutation({ id: "provider_id" });

// Get logs
api.notificationProvider.getLogs.useQuery({
  providerId: "provider_id",
  limit: 50,
});

// Get stats
const stats = api.notificationProvider.getStats.useQuery();
```

## Provider Configuration

### Discord

```json
{
  "type": "DISCORD",
  "config": {
    "webhookUrl": "https://discord.com/api/webhooks/...",
    "mentionRole": "123456789",
    "threadId": "987654321"
  }
}
```

### Slack

```json
{
  "type": "SLACK",
  "config": {
    "webhookUrl": "https://hooks.slack.com/services/...",
    "channelId": "C123456",
    "botToken": "xoxb-..."
  }
}
```

### Microsoft Teams

```json
{
  "type": "MICROSOFT_TEAMS",
  "config": {
    "webhookUrl": "https://outlook.webhook.office.com/webhookb2/...",
    "adaptiveCard": true
  }
}
```

### Telegram

```json
{
  "type": "TELEGRAM",
  "config": {
    "botToken": "123456:ABC...",
    "chatId": "987654321"
  }
}
```

### Custom Webhook

```json
{
  "type": "CUSTOM_WEBHOOK",
  "config": {
    "url": "https://api.example.com/webhooks/notifications",
    "secret": "your-secret-key",
    "headers": {
      "Authorization": "Bearer token",
      "X-Custom-Header": "value"
    }
  }
}
```

## Notification Format

All notifications follow this structure:

```json
{
  "title": "Notification title",
  "description": "Optional detailed description",
  "color": "#0EA5E9",
  "fields": [
    {
      "name": "Field name",
      "value": "Field value",
      "inline": true
    }
  ],
  "timestamp": true,
  "data": {
    "additional": "context data"
  }
}
```

Each provider formats this according to its platform's capabilities:
- **Discord**: Uses embeds with colors and field formatting
- **Slack**: Uses block kit with formatted text
- **Teams**: Uses adaptive cards
- **Telegram**: Uses markdown formatting
- **Custom**: Sends raw JSON with optional HMAC-SHA256 signature

## Event Types

Available events to filter notifications:

- `EMAIL_SENT` - Email queued for sending
- `EMAIL_DELIVERED` - Email successfully delivered
- `EMAIL_BOUNCED` - Email hard bounced
- `EMAIL_COMPLAINED` - Recipient marked as spam
- `EMAIL_OPENED` - Email opened by recipient
- `EMAIL_CLICKED` - Link clicked in email
- `CONTACT_CREATED` - Contact added to list
- `CONTACT_DELETED` - Contact removed
- `DOMAIN_VERIFIED` - Domain verification completed
- `CAMPAIGN_STARTED` - Campaign began sending
- `CAMPAIGN_COMPLETED` - Campaign finished
- `ERROR_ALERT` - Critical error occurred

## Error Handling & Retry Logic

- Failed notifications are logged to `NotificationLog` table
- Providers track consecutive failures
- Auto-disable after X consecutive failures
- Manual test messages help troubleshoot issues
- All notification sends are async (fire-and-forget)

## Security Considerations

- Webhook URLs and tokens are stored encrypted in the database
- Sensitive config fields are marked as `type="password"` in forms
- Custom webhooks support HMAC-SHA256 signatures for verification
- Sensitive data in notifications should be limited to IDs, not PII

## Best Practices

1. **Avoid notification fatigue** - Use event filtering to receive only important events
2. **Test before deploying** - Use the "Test" button on each provider
3. **Monitor logs** - Check notification logs for delivery issues
4. **Graceful failures** - Wrap notification sends in try-catch to prevent service interruption
5. **Rate limiting** - Consider limiting high-frequency events (e.g., EMAIL_OPENED)

## Monitoring & Debugging

Check the notification dashboard at `/settings/notifications` to:
- View provider status and failure counts
- See recent notification logs
- Verify event type filtering is working
- Test provider connectivity

## Future Enhancements

Potential additions:
- Notification templates/customization
- Scheduled digests (hourly/daily summaries)
- Rate limiting per provider
- Notification deduplication
- Batch notifications
- Webhook retry exponential backoff
- Provider-specific formatting options
