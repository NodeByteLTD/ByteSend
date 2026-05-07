# Changelog

All notable changes to ByteSend are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.2.3] - 2026-05-07

### Added

#### SMTP
- **Per-team custom SMTP username** — teams can now set a custom SMTP username instead of the shared `bytesend` default. The username is stored on the `Team` model (`smtpUsername String?`; `null` means use the global default). Validation enforces alphanumeric characters, underscores, dots, and hyphens (max 64 chars)
- **`POST /api/v1/smtp/auth` endpoint** — new public API endpoint the SMTP server calls during `onAuth` to validate credentials. Looks up the API key, resolves the team's effective username (`smtpUsername ?? SMTP_USER`), and returns `{valid: true}` or 401. Exempt from the standard bearer-token middleware and rate limiter
- **SMTP server remote auth** — `onAuth` in `apps/smtp-server` now calls the ByteSend API for credential validation instead of doing a static string comparison against `SMTP_AUTH_USERNAME`. The server is fully stateless about usernames; all logic lives in the API

#### Dashboard
- **Editable SMTP settings page** — the SMTP credentials page (`/developer-settings/smtp`) is now a client component with an editable username field. Shows the effective username (custom or default), a "Reset to default" button when a custom value is set, and an inline save button that appears when the field is dirty
- **`team.getTeamDetails` tRPC query** — new procedure returning `id`, `name`, and `smtpUsername` for the current team
- **`team.updateSmtpUsername` tRPC mutation** — team admins can update or reset their SMTP username. Passing `null` reverts to the global default

#### Notifications
- **Discord webhook notifications** — `DISCORD_WEBHOOK_URL` is now fully wired to real app events. When set, ByteSend posts a message to Discord on: new user signup (email + name), new team created (name + team ID), hard bounce detected (email ID, subject, affected recipients, team ID), and spam complaint received (same fields). All notifications fire-and-forget and never block the main request flow

### Changed

#### Design System — Dashboard-wide consistency pass
All dashboard pages and components now consistently follow the design system. The following violations were corrected across 13+ files:

**Status badges**
- `email-status-badge.tsx` — replaced all hardcoded Tailwind palette colors (`bg-emerald-500/15 text-emerald-500`, `bg-purple-500/15 text-purple-500`, `bg-gray-400/30`, etc.) with CSS variable design tokens (`bg-green/15 text-green`, `bg-primary/10 text-primary`, `bg-muted/30 text-muted-foreground`, etc.)
- `domain-badge.tsx` — replaced `text-emerald-600 dark:text-emerald-400 bg-emerald-500/10`, `text-amber-600 dark:text-amber-400 bg-amber-500/10` etc. with `text-green bg-green/15`, `text-yellow bg-yellow/15`
- `webhook-status-badge.tsx` and `webhook-call-status-badge.tsx` — replaced `bg-gray-700/10 text-gray-400` default state and removed fixed `w-[130px]`/`w-[110px]` in favour of `min-w-24 px-2`
- `contact-list.tsx` — replaced fixed `w-[130px]` status pills with `min-w-24 px-2`

**Card and table borders**
- `email-list.tsx`, `contact-list.tsx`, `webhook-list.tsx`, `suppression-list.tsx`, `dashboard/reputation-metrics.tsx` — replaced `border shadow` / `border rounded-xl shadow` with `border border-border/60 rounded-xl`
- `contact-list.tsx` — fixed typo `border-broder` → `border-border/60`

**Email preview**
- `email-details.tsx` — replaced `dark:bg-slate-200 h-[350px]` email preview container with `bg-white h-88`; card borders changed from `rounded-lg shadow` to `border-border/60 rounded-xl`; `border-gray-300 dark:border-gray-700` timeline connector → `border-border`

**Editor pages — dark-mode canvas**
- `double-opt-in/page.tsx` — settings card `border rounded-lg shadow` → `border border-border/60 rounded-xl`; editor wrapper `rounded-lg bg-gray-50` → same dark-aware panel (border + header + white canvas) applied to template and campaign editors in the previous release

**Arbitrary Tailwind values replaced with shorthands** across all modified files:
- `w-[700px]` → `w-175` / `max-w-175`; `w-[600px]` → `w-150`; `w-[300px]` → `w-75`; `w-[240px]` → `w-60`; `w-[200px]` → `w-50`; `w-[180px]` → `w-45`; `w-[150px]` → `w-38`; `w-[130px]` → `min-w-24 px-2`; `w-[110px]` → `min-w-24 px-2`; `w-[100px]` → `w-25`; `w-[80px]` → `w-20`; `w-[70px]` → `w-17.5`; `h-[350px]` → `h-88`; `h-[18px] w-[18px]` → `h-4.5 w-4.5`; `w-[300px]` tooltip → `w-75`; `-mt-[0.125rem]` → `-mt-0.5`

---

## [0.2.2] - 2026-05-03

### Fixed

#### Email Delivery
- **Emails stuck as QUEUED forever** — when `getConfigurationSetName()` returned `null` the job silently returned success to BullMQ without marking the email as failed, leaving it in `QUEUED` state indefinitely. Now explicitly marks the email `FAILED` with a descriptive error event so the problem is visible in the email log
- **No retry on transient SES errors** — any SES error (throttle, 5xx, network hiccup) was immediately written as a permanent `FAILED` with no retry. Transient errors (`TooManyRequestsException`, `ServiceUnavailableException`, server-fault responses) are now re-thrown so BullMQ retries the job automatically
- **Zero retry budget on email jobs** — `DEFAULT_QUEUE_OPTIONS` had no `attempts` key so BullMQ defaulted to 1 attempt. Email jobs now receive **3 attempts** with **10 s exponential backoff** (10 s → 20 s → 40 s)
- **Silent worker crashes** — email queue workers had no `error` or `stalled` event listeners; a crashed worker left jobs orphaned with no log trace. Both events are now logged with region and queue context

#### Domain / DKIM
- **DKIM auto-reregister infinite loop** — the hourly background verification job triggered auto-reregistration on `wrong_key` DNS status and also when `lastCheckedAt` was `null`, causing an endless re-registration cycle for newly added domains. Auto-reregister now only fires when the DKIM record is confirmed `found` in DNS (propagation confirmed) but SES has not acknowledged it for over 1 hour, and requires a non-null `lastCheckedAt`
- **Verify button inaccessible after DKIM re-generation** — reregistration set `isVerifying: true`, which hid the Verify button and locked users out of the verification flow. Now sets `isVerifying: false` and uses a Redis-backed `dkimReregistered` flag (24 h TTL) to show an amber guidance banner with instructions; the banner clears automatically when the user clicks Verify

#### Version Display
- **Version always showing "unknown" in production** — Docker Compose defaulted `APP_VERSION` to the string literal `"unknown"` when not provided by CI; the `/api/version` route immediately returned this sentinel without attempting the GitHub API fallback. The route now ignores `"unknown"` and `"canary"` as sentinel values, and the Docker Compose `APP_VERSION` arg now defaults to empty so the GitHub release lookup runs when CI does not inject a version

---

## [0.2.1] - 2026-04-26

### Added

#### Admin Panel
- **Domains admin section** — added a global domains view to the admin panel with filtering, pagination, team ownership, region, verification status, tracking flags, and verification-in-progress visibility
- **Webhooks admin section** — added a global webhooks view to the admin panel with filtering, pagination, owning team, creator, status, subscribed event summary, consecutive failure count, and last success/failure timestamps
- **Billing admin section** — added a global billing view to the admin panel with summary cards and per-team billing records covering plan, latest subscription, billing email, Stripe customer ID, period end, and cancel-at-period-end state

### Changed

#### Admin Panel
- **Expanded admin navigation** — admin tabs now include Domains, Webhooks, and Billing alongside SES Configurations, Teams, Email Analytics, and Users
- **Teams and Users tables redesigned** — the Teams and Users admin lists now use the same shared table primitives and muted header-row treatment as SES Configurations, replacing the older hand-rolled tables and bright blue row actions with a more consistent admin UI
- **Admin status styling unified** — teams and users now use compact semantic pill indicators for active/blocked and user flag states so status presentation matches the rest of the admin panel

### Fixed

- **Mobile sidebar user section still clipped in portrait** — the previous sidebar fix was incomplete on short mobile viewports. The mobile drawer now uses a viewport-bounded height (`svh` with `dvh` support), a `min-h-0` inner column, safe-area bottom padding, and non-shrinking sidebar header/footer regions so the user section remains visible in portrait as well as landscape
- **JavaScript SDK repository metadata** — corrected the npm package repository URL in `packages/sdk/package.json` from the old repository path to `https://github.com/NodeByteHosting/bytesend-cloud`, so published package metadata now points to the right source repository

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
- **Sheet transition animations removed** — all `animate-in` / `animate-out` slide and fade classes stripped from `SheetOverlay` and all `sheetVariants` sides in `packages/ui/sheet.tsx`; drawer now opens and closes instantly with no layout shift
- **Float keyframes removed** — `--animate-float`, `--animate-float-delayed`, and the `@keyframes float` block removed from `packages/ui/styles/globals.css`; accordion animation duration reduced from default to `0.2s`
- **Marketing page animation and gradient cleanup** — removed all gradient overlays (including the `bg-linear-to-b` overlay in `FeatureCard.tsx`) and transition effects from the marketing page; email preview fade-in wrapper removed from `email-details.tsx`

#### Design System
- **Geist font** — switched from Inter + JetBrains Mono to Geist Sans + Geist Mono via `next/font/google`; CSS custom properties `--font-geist-sans` / `--font-geist-mono` wired through `@theme` in `globals.css`
- **Vercel-style neutral palette** — overhauled the entire color system from indigo-tinted backgrounds to pure black/gray neutrals:
  - Light mode: white background, near-black text (`#171717`), neutral gray borders (`#e5e5e5`), `#f5f5f5` muted surfaces
  - Dark mode: near-black background (`#0a0a0a`), `#111` card surfaces, `#262626` borders, `#737373` muted foreground
  - ByteSend electric blue primary (213 76%/94%) unchanged as the brand accent

#### Marketing Site
- **Full landing page overhaul** — complete Vercel-inspired redesign of `apps/web/src/app/(marketing)/page.tsx`:
  - **Hero** — typography scaled up (5xl → 7xl), badge updated to "Open source · Self-hostable · Free tier included", added "Read the docs" secondary CTA
  - **TrustStrip** — full-width divider with column separators (Vercel style), updated platform stats
  - **DevSection** (new) — split panel with value prop, feature checklist, primary/secondary CTAs on the left, and a terminal-style TypeScript SDK code snippet on the right (static `<pre>/<code>`, no added dependencies)
  - **Comparison table** — redesigned from a card grid to an HTML `<table>` comparing ByteSend vs Resend vs SendGrid vs Postmark vs AWS SES across key features with ✓ / — cells
  - **CTA** — `bg-muted/20` alternating background, larger headline, self-hosting note with docs link

#### Version System
- **Version route rewritten** — `/api/version` now uses a multi-source fallback cascade instead of a single GitLab call:
  1. `NEXT_PUBLIC_APP_VERSION` build-time env var (CI sets this before `next build`)
  2. GitLab: `permalink/latest` → releases list → repository tags
  3. GitHub: `releases/latest` → releases list → tags
  4. `"canary"` fallback of last resort
  - Each failed source now logs `console.error` with context so silent failures are visible in server logs
  - `revalidate` set to `3600` so the version is cached per-deployment rather than fetched on every request

#### UI / Dashboard
- **Breadcrumb navigation** — dashboard header now renders a full breadcrumb trail built from the pathname with human-readable segment labels, replacing the single-segment display
- **Settings nav tabs** — `SettingsNavButton` active indicator switched to `border-foreground`; transitions updated to `transition-all duration-150`

### Fixed

- Domain detail page had duplicate legacy component definitions (`DomainSettings`, `DnsVerificationStatus`, old `DomainItemPage`) left over from a partial edit — removed all stale code
- `packages/ui/sheet.tsx` no longer depends on framer-motion for slide and fade transitions, resolving WebKit rendering performance issues on Safari
- **OAuth profile picture not showing in sidebar** — `PrismaAdapter` only writes `image` to the database on the very first OAuth sign-in via `createUser`; subsequent logins never updated a stale or missing image. The `signIn` callback in `auth.ts` now reads the correct provider-specific image field on every OAuth login (`avatar_url` for GitHub, `picture` for Google, CDN URL constructed from `id`/`avatar` for Discord) and syncs it to the DB when it differs. The `session` callback explicitly forwards `user.image` so the updated value reaches the client immediately without requiring a re-login.
- **Sidebar mobile footer pushed off-screen** — `overflow-y-auto` on the mobile `SheetContent` wrapper broke the flex layout, causing `SidebarFooter` (with the user avatar and version info) to scroll off-screen on smaller viewports. Changed to `overflow-hidden` so the footer stays pinned and only `SidebarContent` scrolls.
- **Version route always returning "canary"** — the original implementation only tried a single GitLab endpoint (`permalink/latest`) which requires GitLab 14.2+ with formal releases configured; all failures were silently swallowed with no logging. Replaced with the multi-endpoint cascade described above.

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

[Unreleased]: https://github.com/nodebyte/bytesend/compare/v0.2.3...HEAD
[0.2.3]: https://github.com/nodebyte/bytesend/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/nodebyte/bytesend/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/nodebyte/bytesend/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/nodebyte/bytesend/compare/v1.0.0-beta.1...v0.2.0
[1.0.0-beta.1]: https://github.com/nodebyte/bytesend/releases/tag/v1.0.0-beta.1
