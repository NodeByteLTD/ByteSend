# SMTP Auth and Operations Reference

Last reviewed: 2026-05-09

## Scope

This document explains how the SMTP relay authenticates clients, routes messages, and should be monitored in production.

Primary files:

- apps/smtp-server/src/server.ts
- apps/web/src/server/public-api/api/smtp/smtp-auth.ts

## Authentication Flow

1. SMTP client connects to relay on one of the SMTP ports.
2. Relay receives username/password in AUTH.
3. Relay sends a POST request to /api/v1/smtp/auth on ByteSend API with:
   - username
   - password (API key)
4. API resolves team by API key and checks expected username:
   - expected = team.smtpUsername ?? SMTP_USER
5. API returns 200 valid or 401 invalid.

## Custom Username Compatibility

The relay builds username candidates in this order:

1. Provided SMTP username (trimmed)
2. Legacy fallback from SMTP_AUTH_USERNAME env var (default bytesend)

It attempts remote auth against each candidate until one succeeds.

This keeps compatibility for:

- Teams using new per-team usernames
- Older clients still using the legacy default username

## Port and TLS Behavior

SMTP plain ports (always):

- 25
- 587
- 2587

Implicit TLS ports (manual TLS mode only):

- 465
- 2465

TLS mode values:

- none: STARTTLS disabled, insecure auth allowed
- manual: cert/key loaded and STARTTLS enabled on plain ports

## Health Monitoring Strategy

The relay does not expose an HTTP health endpoint on a separate port.

Recommended monitoring for status pages:

- TCP checks against 25, 587, 2587
- Additional checks against 465 and 2465 when SMTP_TLS_MODE=manual

Optional deeper synthetic checks:

- SMTP handshake and AUTH probe with test API key
- End-to-end send to a controlled mailbox

## Certificate Reload Behavior

In manual TLS mode, certificate files are watched.
When key/cert files change, secure context is reloaded without full process restart.

## Common Failure Modes

- Invalid API key (password) sent by SMTP client
- Username mismatch with team SMTP username
- TLS misconfiguration in manual mode (missing/unreadable cert paths)
- Base URL misconfigured, causing auth request failures

## Debug Checklist

1. Confirm BYTESEND_BASE_URL points to the intended API instance.
2. Verify team SMTP username in dashboard dev settings.
3. Verify SMTP_AUTH_USERNAME fallback usage for legacy clients.
4. Confirm TLS mode and cert path validity when using manual mode.
5. Check relay logs for auth rejection vs upstream request failures.
6. Confirm target ports are reachable from client and monitoring provider.
