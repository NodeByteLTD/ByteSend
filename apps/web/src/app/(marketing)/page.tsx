import Image from "next/image";
import Link from "next/link";
import { Button } from "@bytesend/ui/src/button";

export const dynamic = "force-static";

const APP_URL = "/login";

// Static code snippet shown in the developer section (no Shiki needed)
const TS_SNIPPET = `import { ByteSend } from "bytesend-js";

const client = new ByteSend("bs_••••••••");

await client.emails.send({
  to:      "user@acme.com",
  from:    "noreply@yourapp.com",
  subject: "Welcome to Acme!",
  html:    "<h1>Welcome aboard 🎉</h1>",
  text:    "Welcome aboard!",
});

// → { id: "em_abc123", success: true }`;

/* ─────────────────────── Page ─────────────────────── */

export default function Page() {
  return (
    <main className="min-h-screen text-foreground bg-background">
      <Hero />
      <TrustStrip />
      <Features />
      <DevSection />
      <Pricing />
      <ComparisonTable />
      <Cta />
    </main>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function Hero() {
  return (
    <section>
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-16 sm:pt-36 sm:pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-1.5 text-xs text-muted-foreground mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Open source · Self-hostable · Free tier included
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          Email infrastructure
          <br />
          <span className="text-primary">that just works</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Transactional emails, marketing campaigns, and analytics.
          One platform, one bill. Start free and pay only for what you send.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base rounded-xl" asChild>
            <Link href={APP_URL}>Get started free</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-12 text-base rounded-xl" asChild>
            <a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer">
              Read the docs
            </a>
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Free forever · No credit card · Self-host with Docker
        </p>

        {/* Dashboard screenshot */}
        <div className="mt-16 sm:mt-20 mx-auto max-w-4xl">
          <div className="rounded-2xl border border-border/40 p-0.5">
            <div className="rounded-[14px] overflow-hidden">
              <Image
                src="/hero-light.webp"
                alt="ByteSend dashboard"
                width={3456}
                height={1914}
                className="w-full h-auto block dark:hidden"
                sizes="(min-width: 1024px) 900px, 100vw"
                priority
              />
              <Image
                src="/hero-dark.webp"
                alt="ByteSend dashboard"
                width={3456}
                height={1914}
                className="w-full h-auto hidden dark:block"
                sizes="(min-width: 1024px) 900px, 100vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Trust Strip ─────────────────────── */

function TrustStrip() {
  const stats = [
    { value: "5,000", label: "Free emails/month" },
    { value: "96.6%", label: "Uptime SLA" },
    { value: "<2s", label: "Avg. delivery" },
    { value: "24/7", label: "Monitoring" },
  ];

  return (
    <div className="border-y border-border/30">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/30">
          {stats.map((s) => (
            <div key={s.label} className="py-8 px-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold tabular-nums">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Features ─────────────────────── */

const features = [
  {
    icon: BarChartIcon,
    title: "Real-time analytics",
    description:
      "Track deliveries, opens, clicks, bounces, and complaints as they happen. Full visibility across transactional and marketing sends.",
    accent: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: PaintbrushIcon,
    title: "Visual email editor",
    description:
      "Design beautiful campaigns with a drag-and-drop WYSIWYG editor. No code, no external tools — works for developers and non-technical teams alike.",
    accent: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: UsersIcon,
    title: "Contact management",
    description: "Manage subscribers, consent, and lists. Auto-updated from bounce and complaint events.",
    accent: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: ShieldIcon,
    title: "Suppression lists",
    description: "Block accidental sends. Auto-populated from bounces and spam complaints.",
    accent: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: ServerIcon,
    title: "SMTP relay",
    description: "Drop-in SMTP that works with any existing app. Change one config line and you're sending through ByteSend.",
    accent: "bg-rose-500/10 text-rose-500",
  },
  {
    icon: WebhookIcon,
    title: "Webhooks",
    description: "Real-time event push for every email event. Build automations on top of delivery, opens, clicks, and more.",
    accent: "bg-cyan-500/10 text-cyan-500",
  },
];

function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 border-t border-border/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to send email
          </h2>
          <p className="mt-4 text-muted-foreground">
            Transactional receipts, marketing campaigns, and everything in between — one platform, one bill.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`rounded-2xl border border-border/40 bg-card/40 p-6 ${i < 2 ? "lg:col-span-2" : ""}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.accent} mb-4`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Developer Section ─────────────────────── */

function DevSection() {
  return (
    <section className="border-t border-border/30 bg-muted/20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
          {/* Left: text */}
          <div className="lg:pt-4">
            <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Developer-first</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Up and running<br />in minutes
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Typed SDK for TypeScript. Simple REST API for every language. Fully documented,
              consistently designed, with no surprises.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                "TypeScript SDK with full type safety",
                "Simple REST API with Bearer auth",
                "Webhooks for real-time event delivery",
                "Drop-in SMTP relay — one config change",
                "OpenAPI spec included",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <CheckIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button className="rounded-xl" asChild>
                <a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer">
                  View the docs
                </a>
              </Button>
              <Button variant="outline" className="rounded-xl" asChild>
                <Link href={APP_URL}>Get your API key</Link>
              </Button>
            </div>
          </div>

          {/* Right: code block */}
          <div className="rounded-xl border border-border/40 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-muted/40">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/50" />
              </div>
              <span className="text-xs text-muted-foreground font-mono">send-email.ts</span>
            </div>
            <pre className="px-5 py-5 text-[13px] font-mono leading-[1.7] overflow-x-auto text-foreground/85 bg-background">
              <code>{TS_SNIPPET}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Pricing ─────────────────────── */

const pricingPlans: {
  name: string;
  price: string;
  period: string;
  cta: string;
  popular?: boolean;
  badge?: string;
  href?: string;
  selfHosted?: boolean;
}[] = [
  { name: "Free", price: "CA$0", period: "forever", cta: "Get started free", href: APP_URL },
  { name: "Hobby", price: "CA$5", period: "/mo", cta: "Start with Hobby", href: APP_URL },
  { name: "Lite", price: "CA$10", period: "/mo", cta: "Start with Lite", href: APP_URL },
  { name: "Professional", price: "CA$30", period: "/mo", cta: "Go Professional", popular: true, href: APP_URL },
  { name: "Lifetime", price: "CA$60", period: "once", cta: "Buy Lifetime", badge: "Best value", href: APP_URL },
  { name: "Self-Hosted", price: "Free", period: "open source", cta: "View docs", badge: "Coming soon", href: "https://docs.bytesend.cloud", selfHosted: true },
];

// Values align with pricingPlans order: [Free, Hobby, Lite, Pro, Lifetime, Self-Hosted]
const pricingFeatures: { label: string; values: (string | boolean)[] }[] = [
  { label: "Monthly emails included", values: ["5,000", "15,000", "50,000", "150,000", "Unlimited", "Unlimited"] },
  { label: "Daily email limit", values: ["1,000", "2,000", "5,000", "Unlimited", "Unlimited", "Unlimited"] },
  { label: "Transactional emails", values: ["Included", "CA$0.03/ea†", "CA$0.02/ea†", "CA$0.01/ea†", "Included", "Included"] },
  { label: "Marketing emails", values: [false, "CA$0.05/ea†", "CA$0.02/ea†", "CA$0.01/ea†", "Included", "Included"] },
  { label: "Domains", values: ["3 + $1/extra", "5 + $1/extra", "10 + $1/extra", "100 + $1/extra", "500 + $1/extra", "Unlimited"] },
  { label: "Members per team", values: ["5", "30", "60", "Unlimited", "Unlimited", "Unlimited"] },
  { label: "Contacts", values: ["500", "2,000", "10,000", "1M", "10M", "Unlimited"] },
  { label: "Advanced analytics", values: [false, false, false, true, true, true] },
  { label: "Custom branding", values: [false, false, false, false, false, true] },
  { label: "Priority support", values: [false, false, true, true, true, true] },
];

function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28 border-t border-border/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every plan includes transactional emails. Paid plans unlock marketing email sending.
            Usage-based overage rates apply only <em>after</em> the included monthly limit is reached.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pricingPlans.map((plan, planIdx) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.popular
                  ? "border-primary/40 bg-primary/3 ring-1 ring-primary/20 lg:scale-[1.03] z-10"
                  : plan.selfHosted
                    ? "border-dashed border-border/60 bg-muted/20"
                    : "border-border/40 bg-card/40"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                  Most popular
                </div>
              )}
              {plan.badge && !plan.popular && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-medium text-white shadow-sm ${plan.selfHosted ? "bg-muted-foreground" : "bg-emerald-500"}`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {pricingFeatures.map((row) => {
                  const val = row.values[planIdx];
                  if (typeof val === "boolean" && !val) return null;
                  return (
                    <li key={row.label} className="flex items-start gap-2.5 text-sm">
                      <CheckIcon className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">
                        {typeof val === "boolean" ? row.label : (
                          <>
                            <span className="font-medium text-foreground">{val}</span>{" "}
                            {row.label.toLowerCase()}
                          </>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Button
                className={`w-full rounded-xl ${plan.popular ? "shadow-sm" : ""}`}
                variant={plan.popular ? "default" : plan.selfHosted ? "ghost" : "outline"}
                size="lg"
                asChild
              >
                <Link href={plan.href ?? APP_URL} {...(plan.selfHosted ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          † Overage rates apply only after the plan&apos;s included monthly email limit is reached. Free plan is a hard cap — no overage billing.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────── Comparison Table ─────────────────────── */

const comparisonRows: { feature: string; bs: string | boolean; resend: string | boolean; sendgrid: string | boolean; postmark: string | boolean; ses: string | boolean }[] = [
  { feature: "Free tier",             bs: "5,000/mo",     resend: "3,000/mo",    sendgrid: "100/day",     postmark: "100 test/mo",  ses: "Pay-per-use" },
  { feature: "Marketing campaigns",   bs: true,           resend: false,         sendgrid: true,          postmark: false,          ses: false },
  { feature: "Visual email editor",   bs: true,           resend: false,         sendgrid: "Basic",       postmark: false,          ses: false },
  { feature: "Self-hostable",         bs: true,           resend: false,         sendgrid: false,         postmark: false,          ses: false },
  { feature: "Contact management",    bs: true,           resend: false,         sendgrid: true,          postmark: "Lists only",   ses: false },
  { feature: "Webhooks",              bs: true,           resend: true,          sendgrid: true,          postmark: true,           ses: false },
  { feature: "SMTP relay",            bs: true,           resend: true,          sendgrid: true,          postmark: true,           ses: true },
  { feature: "Analytics dashboard",   bs: true,           resend: "Basic",       sendgrid: true,          postmark: "Basic",        ses: false },
  { feature: "Lifetime plan",         bs: "CA$60 once",   resend: false,         sendgrid: false,         postmark: false,          ses: false },
];

function CompCell({ val }: { val: string | boolean }) {
  if (val === true) return <span className="text-emerald-500 font-semibold">✓</span>;
  if (val === false) return <span className="text-muted-foreground/40">—</span>;
  return <span>{val}</span>;
}

function ComparisonTable() {
  const cols = ["ByteSend", "Resend", "SendGrid", "Postmark", "AWS SES"] as const;
  const vals = (row: (typeof comparisonRows)[0]) => [row.bs, row.resend, row.sendgrid, row.postmark, row.ses] as (string | boolean)[];

  return (
    <section className="py-20 sm:py-28 border-t border-border/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Compare</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Why teams choose ByteSend</h2>
          <p className="mt-4 text-muted-foreground">
            See how we stack up against Resend, SendGrid, Postmark, and AWS SES.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border/40">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="text-left font-medium text-muted-foreground px-5 py-3.5 w-[220px]">Feature</th>
                {cols.map((col, i) => (
                  <th
                    key={col}
                    className={`text-center font-semibold px-4 py-3.5 ${i === 0 ? "text-primary" : "text-foreground/70"}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, ri) => (
                <tr
                  key={row.feature}
                  className={`border-b border-border/30 last:border-0 ${ri % 2 === 0 ? "" : "bg-muted/10"}`}
                >
                  <td className="px-5 py-3.5 text-muted-foreground font-medium">{row.feature}</td>
                  {vals(row).map((val, vi) => (
                    <td
                      key={vi}
                      className={`text-center px-4 py-3.5 tabular-nums ${vi === 0 ? "font-medium" : "text-muted-foreground"}`}
                    >
                      <CompCell val={val} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground mb-4">Ready to switch? Migration takes minutes.</p>
          <Button size="lg" className="px-8 h-12 text-base rounded-xl" asChild>
            <Link href={APP_URL}>Get started free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── CTA ─────────────────────── */

function Cta() {
  return (
    <section className="py-20 sm:py-28 border-t border-border/30 bg-muted/20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-1.5 text-xs text-muted-foreground mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Free tier available — no credit card required
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Start sending today.
        </h2>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          Create your free account in seconds. 5,000 emails per month, forever.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base rounded-xl" asChild>
            <Link href={APP_URL}>Get started free</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-12 text-base rounded-xl" asChild>
            <a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer">
              Read the docs
            </a>
          </Button>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Also available as a Docker container for self-hosting.{" "}
          <a href="https://docs.bytesend.cloud/self-hosting/overview" className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noopener noreferrer">
            Learn more →
          </a>
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────── Icons ─────────────────────── */

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChartIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function PaintbrushIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m14.622 17.897-10.68-2.913" /><path d="M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z" /><path d="M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15" />
    </svg>
  );
}

function UsersIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ServerIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  );
}

function WebhookIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" /><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" /><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8H12" />
    </svg>
  );
}
