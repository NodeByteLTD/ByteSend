# Changelog

All notable changes to ByteSend are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.2.6] - 2026-05-10

### Added

#### Marketing Components
- **Modular homepage architecture** — split the landing page into reusable section components (`Hero`, `TrustStrip`, `Features`, `Comparison`, `PricingSection`, `CallToAction`, `DevSection`) for clearer ownership and easier iteration
- **Single pricing calculator flow** — promoted the calculator-led pricing experience and removed older card-based pricing composition in favor of a unified pricing section

#### Dashboard Settings
- **Settings API Keys page** — added first-class `/settings/api-keys` route
- **Settings SMTP page** — added first-class `/settings/smtp` route

#### SDKs
- **Go SDK initial package** — introduced `packages/go-sdk` with typed client surfaces for emails, contacts, contact books, campaigns, domains, and analytics

#### Documentation
- **SMTP auth API reference page** — added `apps/docs/api-reference/smtp/auth.mdx`
- **Self-hosting Docker doc relocation** — promoted Docker setup docs to `apps/docs/self-hosting/docker.mdx` and aligned navigation

### Changed

#### Marketing Site
- **Homepage composition refresh** — replaced older section files (`FeatureCard*`, `PricingTiers`, `CodeExample`) with the new component set and updated page assembly
- **Icon system modernization** — replaced hand-authored inline SVG usage in key marketing and app screens with icon components for consistency and maintainability
- **Developer section improvements** — expanded dev-focused section behavior and language-toggle handling in `CodeLangToggle` and `DevSection`

#### Settings UX & Navigation
- **Developer settings consolidation** — aligned developer tooling pages with the canonical Settings area while preserving compatibility flows from legacy dev-settings routes

#### Plans, Billing & Limits
- **Pricing/plan constant updates** — refreshed shared Stripe plan/product definitions and app-side plan/payment constants to keep UI, checkout, and limits in sync
- **Billing UI updates** — updated `/settings/billing` presentation and upgrade flows to match current plan structure
- **Stripe seed updates** — adjusted `stripe-seed.ts` for current product/price setup behavior

#### Documentation & API Spec
- **OpenAPI refresh** — regenerated and updated API reference spec and intro content
- **Docs navigation/content refresh** — updated docs navigation and onboarding pages (including Go and self-hosting paths) to match current product structure

### Fixed

#### Dashboard & Routing
- **Settings route reliability** — removed dead-end developer settings destinations by wiring pages into canonical Settings routes and maintaining redirect compatibility

#### Visual Consistency
- **Cross-page icon sizing/alignment** — normalized icon rendering across footer, auth, error, not-found, and dashboard surfaces after component migration

---

## [0.2.5] - 2026-05-09

### Added

#### Authentication
- **GitHub OAuth support** — added GitHub as a sign-in provider alongside Discord (`GITHUB_ID` / `GITHUB_SECRET`), enabling GitHub auth for cloud and self-hosted deployments

#### Notification Providers
- **Multi-provider notifications** — teams can now configure external alerting providers for operational events (email, campaign, domain, and error notifications)
- **Supported providers** — Discord, Slack, Microsoft Teams, Telegram, and Custom Webhook are now supported with provider-specific configuration
- **Notification provider schema** — added `NotificationProvider` model to store provider type, config, status, and team linkage
- **Notification log schema** — added `NotificationLog` model to store per-dispatch delivery outcomes and failure details
- **Notification provider API** — added `notificationProvider` tRPC router with `list`, `getById`, `create`, `update`, `delete`, `test`, `getLogs`, and `getStats`
- **Notification dispatcher services** — added provider dispatch and event emission services (`notification-provider-service.ts` and `notification-emitter.ts`)
- **Notifications settings page** — added `/settings/notifications` UI for provider management, testing, logs, and usage guidance
- **Notification integration reference** — added `.references/notification-integration.md`

#### Admin / Billing Operations
- **Admin plan assignment flow** — added `adminAssignPlan` to let cloud admins assign plans to teams either as complimentary grants or Stripe checkout-link driven assignments
- **Admin team billing controls** — admin team settings now supports `dailyEmailLimit = -1` for unlimited daily sending

#### Billing / Plan Source-of-Truth
- **Perks derived from shared plan constants** — `apps/web/src/lib/constants/payments.ts` now generates plan perks from `@bytesend/lib` PLANS rather than static duplicated data
- **Billing plan cards from shared plans** — `/settings/billing` plan options now derive from the shared PLANS map to avoid UI/config drift

#### CI / Automation
- **Issue summary workflow** — added `.github/workflows/issue-summary.yml` to automatically summarize newly opened issues
- **Stale cleanup workflow** — added `.github/workflows/stale-cleanup.yml` to clean up inactive issues and pull requests
- **CodeQL workflow** — introduced `.github/workflows/codeql.yml` and enabled `develop` branch triggers
- **JavaScript SDK release workflow** — added `.github/workflows/npm-release.yml` to build and publish the `bytesend-js` package from `packages/sdk` changes on `main` (plus manual dispatch)
- **Python SDK release workflow** — added `.github/workflows/pypi-release.yml` to build and publish the `bytesend-python` package from `packages/python-sdk` on pushes to `main` and manual dispatch

#### Community / Governance
- **Repository security policy** — added `.github/SECURITY.md` with supported versions, private reporting process, and response expectations
- **Code of Conduct** — added `.github/CODE_OF_CONDUCT.md` (Contributor Covenant v2.1)
- **Contributing guide** — added `.github/CONTRIBUTING.md` with development workflow, PR expectations, and testing checklist
- **Support guide** — added `.github/SUPPORT.md` with support channels and security-report routing

#### GitHub Templates
- **PR template** — added `.github/PULL_REQUEST_TEMPLATE.md` to standardize change summaries, testing notes, and release-impact checks
- **Issue template config** — added `.github/ISSUE_TEMPLATE/config.yml` with contact links and blank-issue controls
- **New issue forms** — added `.github/ISSUE_TEMPLATE/feature.yml` and `.github/ISSUE_TEMPLATE/docs.yml`

### Changed

#### Plans & Pricing
- **BASIC plan updated** — aligned plan limits/pricing model by setting BASIC to CA$20/mo with 100,000 monthly emails, 30 members, and 12 domains
- **LIFETIME plan updated** — aligned lifetime limits to current plan progression at CA$199 one-time with 500,000 monthly emails, 100 members, and 30 domains

#### Settings UX
- **Settings navigation restructured** — removed Team inner General/Members subtabs and promoted them to top-level Settings navigation
- **General tab behavior** — `/settings` now serves as the General overview (team profile and core team settings)
- **Members tab split-out** — members management moved to dedicated `/settings/members` tab alongside billing/usage-related settings
- **Usage resource breakdowns** — usage view now includes explicit domain, webhook, and member usage breakdowns with limit context

#### SMTP Server
- **SMTP server vendored into monorepo** — `apps/smtp-server` is now tracked directly in this repository (no gitlink/submodule-style entry), simplifying versioning and release consistency
- **Authentication compatibility fallback** — SMTP auth now supports the API-driven custom team username flow while retaining a legacy fallback username candidate for older client configurations

#### Documentation
- **SMTP docs refreshed for monorepo paths** — clone/build/deployment documentation now references `NodeByteLTD/ByteSend` and `apps/smtp-server` paths throughout
- **SMTP quickstart clarified** — get-started docs now direct users to use their configured SMTP username (default `bytesend`) rather than implying only a fixed username
- **Core docs/readme refresh** — updated main README and docs navigation/content pages for current monorepo structure and self-hosting guidance (`apps/docs/README.md`, `apps/docs/docs.json`, local/docker/self-hosting guide pages)
- **Feature docs expansion** — added new guides for GitHub OAuth, API authentication, plans/pricing, plan management, admin operations, and notification providers (`apps/docs/guides/*`)
- **Mintlify branding refresh** — updated `apps/docs/docs.json` theme colors/navigation and expanded `apps/docs/introduction.mdx` to surface new billing, alerting, and auth capabilities

#### References
- **Internal references expanded** — added `.references/README.md`, `smtp-auth-and-operations.md`, `release-playbook.md`, and `repository-governance.md`
- **Webhook reference improvements** — expanded `.references/webhook-architecture.md` with operations checklist, common failure modes, and change-safety notes

#### GitHub Templates
- **Issue form upgrades** — revamped bug/marketing/SMTP templates with clearer triage metadata, reproducibility fields, and validation checkboxes

#### Workflows
- **PR labeling workflow rename** — renamed the workflow file to `label-prs.yml`
- **Label action token update** — updated token reference in `.github/workflows/label.yml`
- **Website test workflow tuning** — adjusted website test workflow behavior
- **Docker publish workflow update** — updated `.github/workflows/docker-publish.yml`
- **Docker manifest recreation safety** — docker publish now removes existing manifests before create, preventing rerun failures on previously published tags
- **Docker remote tag cleanup** — docker publish now removes pre-existing remote tags/manifests with `docker buildx imagetools rm` before publishing platform images/manifests, avoiding `is a manifest list` rerun failures
- **Website tests pnpm version alignment** — removed hardcoded pnpm version from `.github/workflows/website-test.yml` so CI uses the repository `packageManager` version (`pnpm@9.0.0`)
- **Docker publish tag strategy hardening** — `.github/workflows/docker-publish.yml` now publishes ref-aware tags (`latest`, `develop`, version tag, and commit SHA) with matching multi-arch manifests
- **Manual Docker publish branch support** — wired `workflow_dispatch` branch input into checkout and tag resolution so manual runs build/publish the selected branch
- **Labeler rules refresh** — updated `.github/labeler.yml` to align automated PR labeling with the current repository structure
- **Actions runtime forward-compatibility** — added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` across workflows to avoid Node 20 JavaScript action deprecation breakage

### Fixed

#### Suppressions
- **Suppression removal reliability** — improved suppression deletion flow to handle non-canonical casing/inputs more robustly in dashboard and backend paths

#### Limits / Usage
- **Usage limit consistency** — fixed plan usage limit handling to align dashboard/service behavior with shared plan constants

#### Marketing Site
- **Contact CTA destination** — changed the marketing contact link from email to Discord

#### CI / Tests
- **Domain-service unit test import stability** — `apps/web/src/server/service/domain-service.ts` now initializes DNS resolvers with runtime-safe fallbacks (promises API or callback API), preventing `ERR_INVALID_ARG_TYPE` when DNS methods are partially mocked in tests
- **Usage unit test expectation alignment** — `apps/web/src/lib/usage.unit.test.ts` now derives expected costs from exported usage constants instead of stale hardcoded values
- **Workspace SDK resolution in Vitest** — `apps/web/vitest.config.ts` now aliases `bytesend-js` to `packages/sdk/index.ts` during tests so unit suites do not depend on prebuilt SDK `dist` artifacts
- **Contact-service unit test isolation** — `apps/web/src/server/service/contact-service.unit.test.ts` now mocks `LimitService.checkContactsLimit` to avoid transitive `TeamService` cache dependencies and prevent brittle failures
- **Campaign security test alignment** — `apps/web/src/server/api/routers/campaign-security.trpc.test.ts` updated for current plan access expectations

#### SMTP Server
- **SMTP Dockerfile context compatibility** — `apps/smtp-server/Dockerfile` no longer expects `pnpm-lock.yaml` in app-only build contexts and now uses an app-local install path that works with the `apps/smtp-server` Docker build context
- **SMTP container entrypoint correction** — fixed runtime command in `apps/smtp-server/Dockerfile` to execute `dist/server.js` from the container working directory
- **SMTP Docker Corepack compatibility** — pinned Docker image pnpm activation in `apps/smtp-server/Dockerfile` to `pnpm@9.0.0` (instead of `latest`) to avoid Corepack bootstrap/runtime failures in CI builds
- **SMTP package manager metadata** — added `packageManager: pnpm@9.0.0` to `apps/smtp-server/package.json` so Corepack does not auto-inject newer pnpm versions during container installs

### Security

- **SES callback SSRF hardening** — `apps/web/src/app/api/ses_callback/route.ts` no longer fetches user-provided `SubscribeURL` directly; it now constructs a trusted AWS SNS confirmation URL from validated `TopicArn`/`Token` components before issuing the request
- **SES callback log-safety hardening** — replaced ad-hoc request/parse logging in `apps/web/src/app/api/ses_callback/route.ts` with constant-format structured logs to avoid tainted-format-string risks from untrusted payload fields
- **SPF verification sanitization fix** — `apps/web/src/server/service/domain-service.ts` now parses SPF TXT mechanisms and validates `include:` domains (`amazonses.com` or subdomains) instead of broad substring checks
- **DKIM key strength upgrade** — `apps/web/src/server/aws/ses.ts` now generates 2048-bit RSA keys (up from 1024-bit)
- **Stripe seed secret logging removal** — `packages/scripts/stripe-seed.ts` no longer logs any portion of `STRIPE_SECRET_KEY`
- **Python webhook example exception exposure fix** — `packages/python-sdk/example/webhook-test-project/receiver.py` now returns a generic verification failure message and avoids exposing exception text to clients
- **Workflow least-privilege permissions** — `.github/workflows/website-test.yml` now sets explicit `permissions` with `contents: read`

---

## [0.2.4] - 2026-05-08

### Added

#### Billing
- **Stripe webhook automation** — `pnpm stripe:seed` now registers the Stripe webhook endpoint automatically. For non-development environments it lists existing webhook endpoints, creates the endpoint if not found (or updates its enabled events if it already exists), and saves the endpoint ID and `whsec_*` secret to the `AppSetting` table. Development environments skip registration and print a `stripe listen` hint instead
- **`getWebhookSecret()`** — new export in `stripe-config.ts` that resolves the webhook secret from the `AppSetting` table; used as a fallback in the Stripe webhook route when `STRIPE_WEBHOOK_SECRET` env var is not set
- **`stripe.webhook` config keys** — `DB_CONFIG_KEYS` in `packages/lib` now includes `stripe.webhook.endpoint_id` and `stripe.webhook.secret` so the seed script and webhook route share a single source of truth for key names

#### Schema
- **`extraDomainSlots` column** — added `extraDomainSlots Int @default(0)` to the `Team` model for tracking purchased additional domain slots
- **`extraMemberSlots` column** — added `extraMemberSlots Int @default(0)` to the `Team` model for tracking purchased additional team member slots

#### Legal Pages (Cloud)
- **Cookie Policy** — new `/cookie-policy` page covering UK PECR-compliant cookie usage; contact: `legal@nodebyte.co.uk`
- **DMCA Policy** — new `/dmca` page with designated DMCA agent and takedown procedure; primary contact: `dmca@nodebyte.co.uk`
- **Acceptable Use Policy** — new `/acceptable-use` page defining prohibited use for the email platform; contact: `legal@nodebyte.co.uk`
- **Data Processing Agreement** — new `/dpa` page (UK GDPR Art. 28) documenting sub-processors (NodeByte Hosting UK, Amazon SES EU/US, Upstash Redis EU); contact: `legal@nodebyte.co.uk`
- **`/legal` hub** — new central legal index page listing all six policy documents (Terms, Privacy, Cookie Policy, AUP, DMCA, DPA) as navigable cards with contact email references

#### Plan Enforcement — Marketing Features
- **`LimitReason.MARKETING_NOT_AVAILABLE`** — new enum value added to `LimitReason` in `lib/constants/plans.ts` for use across server guards and the upgrade modal
- **`LimitService.checkMarketingAccess(teamId)`** — new static method returning `false` for Free plan teams in cloud mode; bypassed for self-hosted and admin/founder teams
- **Campaign API guard** — `createCampaign` and `duplicateCampaign` tRPC mutations now call `checkMarketingAccess` upfront and throw `FORBIDDEN` for Free plan teams
- **Campaign service guard** — `createCampaignFromApi` and `scheduleCampaign` in `campaign-service.ts` now call `checkMarketingAccess` and throw `ByteSendApiError(FORBIDDEN)` for Free plan teams

#### Plan Enforcement — Resource Limits
- **Limit methods return usage counters** — All `LimitService.check*Limit()` methods now return `{ isLimitReached, limit, currentCount, reason? }` to enable UI display of usage ratios
- **Domain limit enforcement** — `domain.createDomain` now enforces the domain limit (base + extraDomainSlots) at the API level and returns descriptive error with currentCount
- **Team member limit enforcement** — `team.createTeamInvite` enforces the team member limit (base + extraMemberSlots) and includes currentCount in error message
- **Contact limit enforcement** — `ContactQueueService.addBulkContactJobs` checks the contact limit before queueing imports; includes currentCount in error
- **Webhook limit enforcement** — `WebhookService.createWebhook` already enforced limits (reconfirmed)
- **Contact book limit enforcement** — `contactBookService.createContactBook` already enforced limits (reconfirmed)

#### Plan Enforcement — Purchase Add-ons
- **`purchaseAddonMemberSlots` mutation** — new tRPC mutation (alongside existing `purchaseAddonDomainSlots`) allows teams to buy additional team member slots at CA$5/slot/month
- **Separate addon price IDs** — `PRICE_KEYS.addon` now includes both `domainMonthly` and `memberMonthly` for distinct pricing; `createAddonCheckoutSession` accepts `addonType` parameter to select the correct price
- **Webhook addon tracking** — Stripe webhook processing now distinguishes between `EXTRA_DOMAIN` and `EXTRA_MEMBER` addon prices and updates `team.extraDomainSlots` and `team.extraMemberSlots` independently

#### Email Metering & Overage Billing
- **Email meter event reporting** — `EmailQueueService` now reports successful emails to Stripe `billing.meterEventAdjustments` after each send, tracked separately by type (marketing vs transactional). Failures are logged but non-fatal so email delivery is never blocked by metering issues
- **Overage usage tracking** — Marketing and transactional emails beyond the plan's included monthly limit are now reported to Stripe for metered billing (overage charges)

#### Dashboard — Usage Indicators
- **Domain usage counter + purchase flow** — "Add domain" now shows "X / Y" usage and includes an in-dialog add-on checkout CTA. When below limit, the add form is shown; when at limit, the add form is hidden and the purchase CTA + limit message are shown
- **Team member usage counter + purchase flow** — "Invite Member" now shows "X / Y" usage and includes an in-dialog add-on checkout CTA. When below limit, invite form is shown; when at limit, the invite form is hidden and the purchase CTA + limit message are shown
- **Upgrade/purchase flow wiring** — Domain/member add-on CTAs open Stripe checkout sessions with proper success/cancel URLs and metadata for webhook handling

### Changed

#### Development Setup
- **Database migration required** — run `pnpm prisma migrate dev` to add the `extraMemberSlots` column to the Team table and create the new member addon price in Stripe via `pnpm stripe:seed`

#### Marketing Site
- **Pricing plans updated** — landing page pricing section (`page.tsx` and `PricingTiers.tsx`) now shows the correct three plans: **Free** (CA$0, 12,500 emails/mo), **Hobby** (CA$5/mo, 25,000 emails/mo), and **Lite** (CA$10/mo, 50,000 emails/mo, recommended). Removed the old Professional and Lifetime cards
- **Comparison table corrected** — free tier row updated from `5,000/mo` to `12,500/mo`; "Lifetime plan" row replaced with "Custom plans" (✓ for ByteSend, — for all competitors) to reflect the current offering
- **CTA copy corrected** — "5,000 emails per month" updated to "12,500 emails per month" in the bottom CTA section
- **Footer simplified** — site footer reverted to minimal single-row layout (`© ByteSend · Docs · Changelog · Legal · Status`) with "Legal" linking to the new `/legal` hub instead of individual policy links
- **Legal contact emails** — all `hey@nodebyte.co.uk` references in `privacy/page.tsx` and `terms/page.tsx` replaced with `legal@nodebyte.co.uk`

#### Dashboard — Marketing Feature Gating (UI)
- **Sidebar Marketing section locked on Free plan** — `AppSidebar` now checks `currentTeam.plan` and, for Free plan teams in cloud mode, renders the Contacts and Campaigns items as non-navigable buttons with a lock icon and dimmed opacity. Clicking either item opens the upgrade modal. The "Marketing" section label gains a "Paid" badge
- **Campaigns page upgrade gate** — `/campaigns` renders a centred lock screen (icon + copy + "Upgrade plan" button) instead of the campaign list when the current team is on the Free plan
- **Contacts page upgrade gate** — `/contacts` renders the same lock screen pattern for Free plan teams
- **Upgrade modal message** — `UpgradeModal` messages Record now includes `MARKETING_NOT_AVAILABLE`: "Marketing features (Contacts & Campaigns) are not available on the Free plan."

#### Dashboard — Editor Surfaces
- **Template/Campaign/Double opt-in editor layouts unified** — all three editor pages now share the same sticky top bar, metadata strips, and canvas structure for consistent behavior
- **Top-bar clipping resolved across all editor pages** — removed negative vertical wrapper offsets that were causing the back/status row to clip under the dashboard header
- **Editor canvas attached to metadata strip** — removed the visual gap so the editor appears connected to the variables/required strip rather than floating as a separate block
- **Editor width expanded to full available content area** — editor canvas now spans the dashboard content width instead of constrained widths/max-width wrappers
- **Theme-aware editor shell** — editor wrapper, toolbar, popovers, slash command menu, and inline controls now use design tokens (`bg-background`, `bg-popover`, `border-border`, `text-foreground`) for light/dark consistency
- **Toolbar feature expansion** — added paragraph/heading controls, task list, text alignment (left/center/right), blockquote, code block, horizontal rule, unlink, and undo/redo actions in addition to existing inline formatting and list controls

### Fixed

#### Database
- **Migration history drift resolved** — `_prisma_migrations` table contained ~50 stale records from old migrations that no longer existed locally. Truncated the table and replaced the entire history with a single baseline migration (`20260507000000_init`) generated from the current schema. Local `prisma/migrations/` folder now has exactly one migration; DB records match

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

[Unreleased]: https://github.com/nodebyte/bytesend/compare/v0.2.6...HEAD
[0.2.6]: https://github.com/nodebyte/bytesend/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/nodebyte/bytesend/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/nodebyte/bytesend/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/nodebyte/bytesend/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/nodebyte/bytesend/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/nodebyte/bytesend/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/nodebyte/bytesend/compare/v1.0.0-beta.1...v0.2.0
[1.0.0-beta.1]: https://github.com/nodebyte/bytesend/releases/tag/v1.0.0-beta.1
