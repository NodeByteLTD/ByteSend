import Image from "next/image";
import Link from "next/link";
import { Button } from "@bytesend/ui/src/button";

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
          Now in public beta
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
                loading="eager"
                priority
              />
              <Image
                src="/hero-dark.webp"
                alt="ByteSend dashboard"
                width={3456}
                height={1914}
                className="w-full h-auto rounded-xl hidden dark:block"
                sizes="(min-width: 1024px) 900px, 100vw"
                loading="eager"
                priority
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
    { value: "99.9%", label: "Uptime SLA" },
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
            Everything you need to send email
          </h2>
          <p className="mt-4 text-muted-foreground">
            From transactional receipts to marketing campaigns — one platform, one bill.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:shadow-sm ${
                i < 2 ? "lg:col-span-2" : ""
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.accent} mb-4`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Pricing ─────────────────── */

const pricingPlans = [
  { name: "Free", price: "$0", period: "forever", cta: "Get started free", popular: false },
  { name: "Hobby", price: "$5", period: "/mo", cta: "Start with Hobby", popular: false },
  { name: "Lite", price: "$10", period: "/mo", cta: "Start with Lite", popular: false },
  { name: "Professional", price: "$30", period: "/mo", cta: "Go Professional", popular: true },
  { name: "Lifetime", price: "$60", period: "once", cta: "Buy Lifetime", popular: false, badge: "Best value" },
];

const pricingFeatures: { label: string; values: (string | boolean)[] }[] = [
  { label: "Monthly emails", values: ["5,000", "15,000", "50,000", "Unlimited", "Unlimited"] },
  { label: "Daily emails", values: ["250", "500", "2,000", "Unlimited", "Unlimited"] },
  { label: "Marketing emails", values: [true, true, true, true, true] },
  { label: "Transactional rate", values: ["$0.002/ea", "$0.0015/ea", "$0.001/ea", "Included", "Included"] },
  { label: "Marketing rate", values: ["$0.004/ea", "$0.003/ea", "$0.002/ea", "Included", "Included"] },
  { label: "Domains", values: ["3", "5", "10", "100", "500"] },
  { label: "Contacts", values: ["500", "2,000", "10,000", "1M", "10M"] },
  { label: "Team members", values: ["5", "10", "25", "50", "200"] },
  { label: "Advanced analytics", values: [false, false, false, true, true] },
  { label: "Custom branding", values: [false, false, false, true, true] },
  { label: "Priority support", values: [false, false, true, true, true] },
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
            Every plan includes marketing &amp; transactional emails. Higher plans unlock better rates.
          </p>
        </div>

        {/* Desktop pricing table */}
        <div className="hidden lg:block overflow-visible rounded-2xl border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="p-5 text-left w-48" />
                {pricingPlans.map((plan) => (
                  <th
                    key={plan.name}
                    className={`p-5 pt-8 text-center relative ${
                      plan.popular ? "bg-primary/5" : ""
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground whitespace-nowrap shadow-sm">
                        Most popular
                      </span>
                    )}
                    {plan.badge && !plan.popular && (
                      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 px-4 py-1 text-xs font-medium text-white whitespace-nowrap shadow-sm">
                        {plan.badge}
                      </span>
                    )}
                    <div className="font-semibold text-base">{plan.name}</div>
                    <div className="mt-2 flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-xs text-muted-foreground">{plan.period}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {pricingFeatures.map((row) => (
                <tr key={row.label} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-medium text-muted-foreground">{row.label}</td>
                  {row.values.map((val, i) => {
                    const plan = pricingPlans[i]!;
                    return (
                      <td
                        key={plan.name}
                        className={`p-4 text-center ${plan.popular ? "bg-primary/3" : ""}`}
                      >
                        {typeof val === "boolean" ? (
                          val ? (
                            <CheckIcon className="h-4 w-4 text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )
                        ) : (
                          <span className="font-medium">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* CTA row */}
              <tr>
                <td className="p-5" />
                {pricingPlans.map((plan) => (
                  <td key={plan.name} className={`p-5 text-center ${plan.popular ? "bg-primary/3" : ""}`}>
                    <Button
                      className="w-full max-w-40"
                      variant={plan.popular ? "default" : "outline"}
                      size="sm"
                      asChild
                    >
                      <Link href={APP_URL}>{plan.cta}</Link>
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile pricing cards */}
        <div className="lg:hidden space-y-6">
          {pricingPlans.map((plan, planIdx) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 ${
                plan.popular
                  ? "border-primary/50 bg-primary/3 shadow-lg shadow-primary/10 ring-1 ring-primary/20"
                  : "border-border/50 bg-card/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-medium text-primary-foreground">
                  Most popular
                </div>
              )}
              {plan.badge && !plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-[11px] font-medium text-white">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-xs text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {pricingFeatures.map((row) => {
                  const val = row.values[planIdx];
                  return (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      {typeof val === "boolean" ? (
                        val ? (
                          <CheckIcon className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )
                      ) : (
                        <span className="font-medium">{val}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button
                className="mt-6 w-full"
                variant={plan.popular ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link href={APP_URL}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Competitor Comparison ───────────── */

const comparisonRows = [
  { feature: "Free tier emails", bytesend: "5,000/mo", unsend: "3,000/mo", resend: "3,000/mo", sendgrid: "100/day", postmark: "100/mo", ses: "N/A" },
  { feature: "Transactional pricing", bytesend: "$0.001/ea", unsend: "$0.001/ea", resend: "$0.001/ea", sendgrid: "$0.0006/ea", postmark: "$0.001/ea", ses: "$0.0001/ea" },
  { feature: "Marketing campaigns", bytesend: "✓ Built-in", unsend: "✓ Built-in", resend: "✗", sendgrid: "✓", postmark: "✗", ses: "✗" },
  { feature: "Visual editor", bytesend: "✓ WYSIWYG", unsend: "✓ WYSIWYG", resend: "✗", sendgrid: "✓", postmark: "✗", ses: "✗" },
  { feature: "Contact management", bytesend: "✓ Built-in", unsend: "✓ Built-in", resend: "✓", sendgrid: "✓", postmark: "✗", ses: "✗" },
  { feature: "SMTP relay", bytesend: "✓", unsend: "✓", resend: "✓", sendgrid: "✓", postmark: "✓", ses: "✓" },
  { feature: "Webhooks", bytesend: "✓", unsend: "✓", resend: "✓", sendgrid: "✓", postmark: "✓", ses: "Via SNS" },
  { feature: "Lifetime plan", bytesend: "✓ $60", unsend: "✗", resend: "✗", sendgrid: "✗", postmark: "✗", ses: "✗" },
  { feature: "Self-hostable", bytesend: "✓ Docker", unsend: "✓ Docker", resend: "✗", sendgrid: "✗", postmark: "✗", ses: "✗" },
  { feature: "Open API", bytesend: "✓ REST", unsend: "✓ REST", resend: "✓ REST", sendgrid: "✓ REST", postmark: "✓ REST", ses: "✓ AWS SDK" },
  { feature: "Multiple plans", bytesend: "5 plans", unsend: "2 plans", resend: "3 plans", sendgrid: "4 plans", postmark: "1 plan", ses: "Pay-as-you-go" },
];

function ComparisonTable() {
  const providers = [
    { key: "bytesend", name: "ByteSend", highlight: true },
    { key: "unsend", name: "Unsend", highlight: false },
    { key: "resend", name: "Resend", highlight: false },
    { key: "sendgrid", name: "SendGrid", highlight: false },
    { key: "postmark", name: "Postmark", highlight: false },
    { key: "ses", name: "AWS SES", highlight: false },
  ];

  return (
    <section className="py-20 sm:py-28 border-t border-border/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">
            Compare
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            See how ByteSend stacks up
          </h2>
          <p className="mt-4 text-muted-foreground">
            Feature-for-feature comparison with popular email providers.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="text-left font-medium text-muted-foreground p-4 w-50">Feature</th>
                {providers.map((p) => (
                  <th
                    key={p.key}
                    className={`text-center font-medium p-4 ${p.highlight ? "text-primary bg-primary/5" : "text-muted-foreground"}`}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {comparisonRows.map((row) => (
                <tr key={row.feature} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-medium">{row.feature}</td>
                  {providers.map((p) => {
                    const val = row[p.key as keyof typeof row];
                    const isCheck = typeof val === "string" && val.startsWith("✓");
                    const isCross = typeof val === "string" && val.startsWith("✗");
                    return (
                      <td
                        key={p.key}
                        className={`p-4 text-center ${p.highlight ? "bg-primary/2" : ""} ${isCheck ? "text-emerald-500" : isCross ? "text-muted-foreground/50" : ""}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {comparisonRows.map((row) => (
            <div key={row.feature} className="rounded-xl border border-border/50 p-4">
              <div className="font-medium mb-3">{row.feature}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {providers.map((p) => {
                  const val = row[p.key as keyof typeof row];
                  const isCheck = typeof val === "string" && val.startsWith("✓");
                  return (
                    <div
                      key={p.key}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                        p.highlight ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
                      }`}
                    >
                      <span className={`text-xs ${p.highlight ? "text-primary font-medium" : "text-muted-foreground"}`}>
                        {p.name}
                      </span>
                      <span className={`text-xs font-medium ${isCheck ? "text-emerald-500" : ""}`}>{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 px-8 py-16 sm:px-16 text-center">
          <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-[80px]" />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to send?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Create your free account in seconds. No credit card required — just start sending.
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
