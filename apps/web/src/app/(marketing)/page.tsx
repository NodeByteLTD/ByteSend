import Image from "next/image";
import Link from "next/link";
import { Button } from "@bytesend/ui/src/button";

export const dynamic = "force-static";

const APP_URL = "/login";

export default function Page() {
  return (
    <main className="min-h-screen text-foreground bg-background">
      <Hero />
      <TrustStrip />
      <Features />
      <Pricing />
      <ComparisonTable />
      <Cta />
    </main>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-x-clip">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-150 w-225 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 left-1/4 h-75 w-100 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 sm:pt-36 sm:pb-24 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          No credit card required.
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
          Email infrastructure
          <br />
          <span className="text-primary"> that just works</span>
        </h1>

        <p className="mt-5 text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transactional emails, marketing campaigns, and analytics all in one
          platform. Start free and pay only for what you send.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base rounded-xl shadow-lg shadow-primary/20" asChild>
            <Link href={APP_URL}>Get started free</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-12 text-base rounded-xl" asChild>
            <Link href="#pricing">View pricing</Link>
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Free tier included · No credit card required · Cancel anytime
        </p>

        {/* Hero screenshot */}
        <div className="mt-16 sm:mt-20 mx-auto max-w-4xl">
          <div className="rounded-2xl bg-linear-to-b from-primary/20 to-primary/5 p-0.5">
            <div className="rounded-[14px] bg-background/80 backdrop-blur p-1">
              <Image
                src="/hero-light.webp"
                alt="ByteSend dashboard"
                width={3456}
                height={1914}
                className="w-full h-auto rounded-xl block dark:hidden"
                sizes="(min-width: 1024px) 900px, 100vw"
                priority
              />
              <Image
                src="/hero-dark.webp"
                alt="ByteSend dashboard"
                width={3456}
                height={1914}
                className="w-full h-auto rounded-xl hidden dark:block"
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

/* ─────────────── Trust Strip ─────────────── */

function TrustStrip() {
  const stats = [
    { value: "96.6%", label: "Uptime SLA" },
    { value: "<2s", label: "Avg. delivery" },
    { value: "1000+", label: "Emails Sent" },
    { value: "24/7", label: "Monitoring" },
  ];

  return (
    <section className="border-y border-border/30 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-card/60 p-4 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Features ─────────────────── */

function Features() {
  const features = [
    {
      icon: BarChartIcon,
      title: "Real-time analytics",
      description: "Track deliveries, opens, clicks, bounces and complaints as they happen.",
      accent: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: PaintbrushIcon,
      title: "Visual email editor",
      description: "Design campaigns with a Notion-like WYSIWYG editor. No code required.",
      accent: "bg-purple-500/10 text-purple-500",
    },
    {
      icon: UsersIcon,
      title: "Contact management",
      description: "Manage lists, consent and subscription status. Auto-updated from events.",
      accent: "bg-emerald-500/10 text-emerald-500",
    },
    {
      icon: ShieldIcon,
      title: "Suppression lists",
      description: "Prevent accidental sends. Auto-populated from bounces and complaints.",
      accent: "bg-amber-500/10 text-amber-500",
    },
    {
      icon: ServerIcon,
      title: "SMTP relay",
      description: "Drop-in SMTP that works with any app. No vendor lock-in.",
      accent: "bg-rose-500/10 text-rose-500",
    },
    {
      icon: WebhookIcon,
      title: "Webhooks",
      description: "Real-time event notifications for deliveries, bounces and more.",
      accent: "bg-cyan-500/10 text-cyan-500",
    },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to send emails
          </h2>
          <p className="mt-4 text-muted-foreground">
            From transactional receipts to marketing campaigns one platform, one bill.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-6 transition-all hover:border-primary/30 hover:bg-card/60 hover:shadow-md ${
                i < 2 ? "lg:col-span-2" : ""
              }`}
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${f.accent} mb-4 ring-1 ring-current/10`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="relative font-semibold text-[15px]">{f.title}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Pricing ─────────────────── */

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
  { label: "Owned teams", values: ["5", "10", "20", "50", "Unlimited", "Unlimited"] },
  { label: "Members per team", values: ["5", "30", "60", "Unlimited", "Unlimited", "Unlimited"] },
  { label: "Contacts", values: ["500", "2,000", "10,000", "1M", "10M", "Unlimited"] },
  { label: "Advanced analytics", values: [false, false, false, true, true, true] },
  { label: "Custom branding", values: [false, false, false, false, false, true] },
  { label: "Priority support", values: [false, false, true, true, true, true] },
];

function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
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

        {/* Pricing cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pricingPlans.map((plan, planIdx) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all hover:shadow-md ${
                plan.popular
                  ? "border-primary/40 bg-primary/3 shadow-lg shadow-primary/8 ring-1 ring-primary/20 lg:scale-[1.03] z-10"
                  : plan.selfHosted
                    ? "border-dashed border-border/60 bg-muted/20 hover:border-primary/20"
                    : "border-border/40 bg-card/40 hover:border-primary/20"
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

              {/* Feature list */}
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
                className={`w-full rounded-xl ${plan.popular ? "shadow-lg shadow-primary/20" : ""}`}
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
          † Overage rates apply only after the plan&apos;s included monthly email limit is reached. Free plan is a hard cap no overage billing.
        </p>
      </div>
    </section>
  );
}

/* ───────────── Competitor Comparison ───────────── */

const advantages = [
  {
    title: "Most generous free tier",
    description: "5,000 emails/month free. Others cap at 100-3,000.",
    bytesend: "5,000/mo",
    others: ["Resend 3k", "SendGrid 100/day", "Postmark 100"],
    icon: GiftIcon,
  },
  {
    title: "All-in-one platform",
    description: "Marketing campaigns, transactional emails, contacts, and analytics in one place.",
    bytesend: "Everything included",
    others: ["Resend: No campaigns", "Postmark: No campaigns", "SES: No UI"],
    icon: LayersIcon,
  },
  {
    title: "Pay-once lifetime option",
    description: "One payment, unlimited emails forever. No other provider offers this.",
    bytesend: "CA$60 once",
    others: ["Everyone else: Monthly forever"],
    icon: InfinityIcon,
  },
  {
    title: "Self-hostable",
    description: "Run on your own infrastructure with Docker. Full data sovereignty.",
    bytesend: "Docker ready",
    others: ["Resend: No", "SendGrid: No", "Postmark: No"],
    icon: ServerIcon,
  },
  {
    title: "Visual email editor",
    description: "Notion-like WYSIWYG editor for campaigns. No code, no external tools.",
    bytesend: "Built-in editor",
    others: ["Resend: Code only", "Postmark: Templates", "SES: Raw HTML"],
    icon: PaintbrushIcon,
  },
  {
    title: "SMTP relay included",
    description: "Drop-in SMTP server that works with any app. Swap one config, done.",
    bytesend: "Drop-in SMTP",
    others: ["All providers offer SMTP"],
    icon: ServerIcon,
  },
];

function ComparisonTable() {
  return (
    <section className="py-20 sm:py-28 border-t border-border/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">
            Compare
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Why teams choose ByteSend
          </h2>
          <p className="mt-4 text-muted-foreground">
            See how we compare against Resend, SendGrid, Postmark, and AWS SES.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {advantages.map((a) => (
            <div
              key={a.title}
              className="group relative rounded-2xl border border-border/40 bg-card/40 p-6 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <a.icon className="h-5 w-5" />
              </div>

              <h3 className="font-semibold mb-1">{a.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{a.description}</p>

              {/* ByteSend value */}
              <div className="rounded-xl bg-primary/6 border border-primary/15 px-4 py-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium text-primary">ByteSend</span>
                </div>
                <p className="mt-1 text-sm font-semibold">{a.bytesend}</p>
              </div>

              {/* Others */}
              <div className="space-y-1.5">
                {a.others.map((o) => (
                  <div key={o} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30 shrink-0" />
                    {o}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Ready to switch? Migration takes minutes.
          </p>
          <Button size="lg" className="px-8 h-12 text-base rounded-xl shadow-lg shadow-primary/20" asChild>
            <Link href={APP_URL}>Get started free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── CTA ─────────────────── */

function Cta() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 px-8 py-16 sm:px-16 text-center">
          {/* Background gradient layers */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/12 via-primary/4 to-transparent" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-primary/8 blur-[60px]" />

          {/* Grid dot pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Free tier available
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Ready to send?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              Create your free account in seconds. No credit card required just sign up and start sending.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base rounded-xl shadow-lg shadow-primary/20" asChild>
                <Link href={APP_URL}>Get started free</Link>
              </Button>
              <Button variant="ghost" size="lg" className="w-full sm:w-auto px-8 h-12 text-base rounded-xl" asChild>
                <Link href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer">
                  Read the docs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Icons ─────────────────── */

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

function GiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

function LayersIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22.54 12.43-10 4.56a2 2 0 0 1-1.66 0l-9.42-4.29" /><path d="m22.54 16.43-10 4.56a2 2 0 0 1-1.66 0l-9.42-4.29" />
    </svg>
  );
}

function InfinityIcon({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
    </svg>
  );
}
