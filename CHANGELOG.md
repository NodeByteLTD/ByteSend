# Changelog

All notable changes to ByteSend are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.2.0] - 2026-04-23

### Added

#### Domain Verification
- **DKIM auto-reregistration** — when a DKIM TXT record is confirmed present in DNS but AWS SES has been stuck in a non-`SUCCESS` state for over an hour, the verification cycle now automatically regenerates the DKIM signing attributes and forces a fresh SES check cycle, eliminating the "delete and redo" workaround
- **Parallel DNS pre-checks** — `refreshDomainVerification` now runs independent DNS lookups for DKIM, SPF, and MX in parallel alongside the SES identity poll, returning a `dnsPrecheck` result with per-record `"found" | "wrong_key" | "not_found"` status
- **Manual DKIM re-generation** — new `reregisterDkim` tRPC mutation exposed in the domain Actions dropdown; generates a fresh RSA key pair, updates the stored public key, and resets DKIM status to `NOT_STARTED` so the verification loop restarts cleanly
- **Full domain section redesign** — complete Vercel-inspired overhaul of all domain pages and components:
  - Domain list rewritten as a full-width column-header table (`Domain / Status / Region / Added`) replacing the old card-stack layout; clickable rows with hover states and empty state illustration
  - `DomainStatusBadge` redesigned as compact pill badges with Lucide status icons (CheckCircle2, XCircle, Clock, AlertTriangle) and semantic color fills (emerald/red/amber)
  - `StatusIndicator` simplified to a 1px self-stretch vertical line with the same semantic colors
  - Domain detail page: removed `max-w-4xl` constraint — layout now fills available width at all breakpoints
  - Domain detail page header improved: region shown inline, mobile-first `flex-col sm:flex-row` layout, Actions + Send test buttons in a consistent toolbar
  - DNS status signal cards (`DKIM / SPF / DMARC`) now render full-width in a `grid-cols-1 sm:grid-cols-3` grid with tinted backgrounds per status, icon + label + description + DNS hint in a consistent visual hierarchy
  - DNS records table: improved column widths, `border-b border-border/40` row separators, `w-55` Name column, `max-w-90 truncate` Value cells
  - "Add domain" button changed to `variant="outline" size="sm"` matching other dashboard action buttons; dialog form spacing tightened

### Changed

#### Performance
- **Removed framer-motion entirely** — all framer-motion animations replaced with Tailwind CSS `animate-in` / `animate-out` / `data-[state]` variants:
  - `email-details.tsx` — fade-in replaced with `animate-in fade-in duration-300`
  - `campaigns/[campaignId]/page.tsx` — `AnimatePresence` + `motion.div` layout animations removed
  - `packages/ui/accordion.tsx` — unused framer-motion import removed
  - `packages/ui/sheet.tsx` — framer-motion overlay and slide animations replaced with Radix `data-[state=open/closed]` Tailwind variants

#### Design System
- **Geist font** — switched from Inter + JetBrains Mono to Geist Sans + Geist Mono via `next/font/google`; CSS custom properties `--font-geist-sans` / `--font-geist-mono` wired through `@theme` in `globals.css`
- **Vercel-style neutral palette** — overhauled the entire color system from indigo-tinted backgrounds to pure black/gray neutrals:
  - Light mode: white background, near-black text (`#171717`), neutral gray borders (`#e5e5e5`), `#f5f5f5` muted surfaces
  - Dark mode: near-black background (`#0a0a0a`), `#111` card surfaces, `#262626` borders, `#737373` muted foreground
  - ByteSend electric blue primary (213 76%/94%) unchanged as the brand accent

#### UI / Dashboard
- **Breadcrumb navigation** — dashboard header now renders a full breadcrumb trail built from the pathname with human-readable segment labels, replacing the single-segment display
- **Settings nav tabs** — `SettingsNavButton` active indicator switched to `border-foreground`; transitions updated to `transition-all duration-150`

### Fixed

- Domain detail page had duplicate legacy component definitions (`DomainSettings`, `DnsVerificationStatus`, old `DomainItemPage`) left over from a partial edit — removed all stale code
- `packages/ui/sheet.tsx` no longer depends on framer-motion for slide and fade transitions, resolving WebKit rendering performance issues on Safari

---

## [1.0.0-beta.1] - 2026-04-08

Initial public beta release of ByteSend — an all-in-one email infrastructure platform for transactional and marketing email delivery.

### Added

#### Platform & Auth
- Email magic-link authentication with 6-character code entry (always shown after submit; code submits directly to NextAuth callback — no "please click the link" dead-end)
- OAuth sign-in via GitHub, Google, and Discord
- Profile setup screen on first login (name + avatar URL) for email-only users
- Session-based team context with team switching in the sidebar

#### Dashboard & Navigation
- Responsive app shell with collapsible sidebar (icon-only on desktop, sheet drawer on mobile)
- Sidebar layout fixed to viewport height (`h-dvh`) so the header never scrolls away on mobile
- Sidebar nav groups: General, Marketing, Settings, Admin (role-gated)
- Footer links (Feedback, Discord) moved into the scrollable content zone with `mt-auto` so they never push the user info off-screen regardless of how many nav items are added
- Sticky-free header bar using flex layout (always pinned, never disappears on scroll)
- Team switcher dropdown in the sidebar header with team image support
- User menu dropdown: profile links, theme switcher, log out

#### Email Sending
- Transactional email sending via AWS SES
- Real-time delivery status tracking (delivered, bounced, complained, opened, clicked)
- Per-domain email sending with configurable From addresses
- Email queue with BullMQ for reliable delivery
- Email list with pagination, filtering, and status badges
- Contact-level click and open tracking via redirect proxy

#### Campaigns (Marketing)
- Visual campaign editor using the ByteSend Email Editor (Notion-like WYSIWYG)
- Campaign scheduling (send now or at a future date/time)
- Audience targeting via contact books
- Per-campaign analytics (sent, delivered, opened, clicked, unsubscribed, bounced)
- Drag-and-drop image upload in the campaign editor (proxy-based, no CORS issues)

#### Templates
- Reusable email templates with the visual editor
- Template image upload via server-side S3 proxy
- Template duplication and management

#### Contacts
- Contact book management (lists/segments)
- Per-contact subscription status, consent, and activity history
- Custom contact variables for personalisation
- Double opt-in flow support
- Bulk import

#### Domains
- Domain management with DNS verification
- Per-domain DKIM, SPF, and DMARC guidance
- Sending domain selector dropdown on emails and campaigns

#### Analytics
- Dashboard with delivery overview chart (7-day and 30-day views)
- Bounce rate gauge
- Domain-level filter on analytics
- Open rate and click rate metrics

#### Developer Settings
- API key management with scoped permissions
- REST API for transactional email sending (`/api/v1/emails`)
- API rate limiting (configurable via environment variable)

#### Webhooks
- Configurable webhook endpoints per team
- Event types: delivered, bounced, complained, opened, clicked, unsubscribed
- Domain-level webhook filtering
- Webhook signature verification

#### Suppressions
- Global suppression list (auto-populated from bounces and complaints)
- Manual suppression management
- Suppression export

#### Settings
- Team general settings (name, logo/image, delete team)
- Team member management with role-based access (Admin / Member)
- Team invite system with email notifications
- Usage & billing page
- Billing via Stripe with plan tiers: Free, Hobby, Lite, Professional, Lifetime
- Stripe metered billing for overage (transactional and marketing usage)
- Upgrade modal with plan selector

#### Admin Panel
- User list with pagination
- Team list with pagination
- User ban / unban toggle
- Beta access management
- SES configuration management (add, edit, remove AWS credentials)

#### SMTP Relay Server (`apps/smtp-server`)
- Standalone SMTP server (ports 25, 587, 465)
- API key authentication
- STARTTLS and implicit TLS modes
- Forwards mail to ByteSend API
- Hot-reload TLS certificates

#### Infrastructure
- Docker Compose configurations for web and SMTP
- Standalone Next.js output for Docker deployments
- PostgreSQL via Prisma ORM with full migration history
- Redis via BullMQ for job queues
- S3-compatible object storage for team images, campaign assets, and template images
- Server-side upload proxy (`/api/upload`) — all file uploads go server-to-S3, eliminating browser CORS issues with object storage
- Environment variable validation with `@t3-oss/env-nextjs`

#### Marketing Site
- Landing page with hero, trust strip, features grid, pricing cards, competitor comparison, and CTA
- Light/dark hero screenshots
- Static export (`force-static`) for zero-latency page loads
- AVIF + WebP image optimisation

#### Documentation (`apps/docs`)
- Mintlify-based docs site
- API reference with OpenAPI spec
- Get-started guides: Node.js, Python, Go, SMTP, Local, AWS credentials, Docker
- Guides: campaign personalisation, double opt-in, React Email integration, webhooks
- Self-hosting overview and SMTP server guide

---

### Fixed (this release cycle)

- **CORS on file uploads** — Presigned S3 PUT URLs were blocked by browser CORS preflight against Hetzner Object Storage. All uploads now go through the `/api/upload` Next.js route which performs the S3 `PutObject` server-side.
- **Login code entry did nothing** — `handleVerificationCodeSubmit` showed an error telling users to click the magic link instead of verifying. Now correctly navigates to `/api/auth/callback/email?token=...` so manual code entry actually signs the user in.
- **Email lost after magic link redirect** — The user's email was stored only in component state; following the magic link to `?verify=1` cleared it. Email is now persisted in `sessionStorage` and restored on mount.
- **Two separate post-email UIs** — The `emailSent` card (info only, no code entry) and the `isVerifying` card (broken code entry) were separate. Merged into a single unified code-entry UI shown immediately after email submission.
- **Dashboard header disappears on scroll** — `sticky top-0` broke because `overflow-x-hidden` on the sidebar wrapper created a scroll container boundary, causing the sticky element's stacking context to disappear as the document scrolled. Fixed by switching to a `h-dvh overflow-hidden` viewport pane layout where the header is `shrink-0` and only the `<main>` scrolls.
- **Sidebar user info pushed off-screen on mobile** — Adding links to `SidebarFooter` grew it beyond the viewport with no escape. Footer now only contains `VersionInfo` + `NavUser` with `shrink-0`. Feedback and Discord links moved into `SidebarContent` with `mt-auto` so they float to the bottom of the scrollable zone and can never overflow.
- **Hero images returning null** — `next/image` makes a server-side request to optimise external images; the CDN (`embrly.ca`) blocked this with an empty response. Switched to the local `public/hero-light.webp` and `public/hero-dark.webp` assets.
- **SMTP server build failure** — Orphaned `main().catch(...)` call at the bottom of `server.ts` referenced a function that was never defined; removed.
- **Create team routing** — Sidebar "Create team" link pointed to `/create-team` (404). Fixed to `/join-team` which renders `<CreateTeam />` correctly with its own scoped `TRPCReactProvider` layout.
- **Team name uniqueness** — No uniqueness constraint existed on `Team.name`, allowing duplicate team names. Added `@unique` to the Prisma schema, created migration, and added pre-flight checks in `createTeam` and `updateTeam` service methods.
- **`isBanned` migration drift** — Column existed in the DB but not in the schema, causing Prisma Client to ignore it. Added `isBanned` to the schema and regenerated the client.

---

### Security

- All file uploads validated server-side: type allowlist (JPEG/PNG/WebP/GIF), 5 MB max, team membership verified before accepting any upload.
- API key authentication on SMTP relay with constant-time comparison.
- Rate limiting on email auth (`AUTH_EMAIL_RATE_LIMIT`) and API endpoints (`API_RATE_LIMIT`).
- Campaign and team procedures enforce team membership at the tRPC middleware level.
- Admin and founder procedures require elevated session roles checked server-side.

---

[Unreleased]: https://github.com/nodebyte/bytesend/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/nodebyte/bytesend/compare/v1.0.0-beta.1...v0.2.0
[1.0.0-beta.1]: https://github.com/nodebyte/bytesend/releases/tag/v1.0.0-beta.1
