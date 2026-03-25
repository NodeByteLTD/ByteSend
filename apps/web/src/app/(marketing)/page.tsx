import Image from "next/image";
import Link from "next/link";
import { FeatureCard } from "~/components/marketing/FeatureCard";
import { FeatureCardPlain } from "~/components/marketing/FeatureCardPlain";
import { PricingCalculator } from "~/components/marketing/PricingCalculator";
import CodeExample from "~/components/marketing/CodeExample";
import { Button } from "@usesend/ui/src/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ByteSend – The email platform for modern teams",
  description:
    "Send product, transactional and marketing emails. Pay only for what you send.",
};

const APP_URL = "/login";

export default function Page() {
  return (
    <main className="min-h-screen text-foreground bg-background">
      <Hero />
      <LogoStrip />
      {/**<Features /> */}
      {/**<CodeExample /> */}
      <Pricing />
      <Cta />
    </main>
  );
}

/* ─────────────────────── Hero ─────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 left-1/4 h-[300px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-32 sm:pb-24 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Now in public beta
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Email infrastructure{" "}
          <span className="text-primary">that just works</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Transactional emails, marketing campaigns, and analytics all in one
          platform. Pay only for what you send.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="px-8 h-12 text-base rounded-xl shadow-lg shadow-primary/20" asChild>
            <Link href={APP_URL}>Get started free</Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8 h-12 text-base rounded-xl" asChild>
            <Link href="#pricing">View pricing</Link>
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Free tier included · No credit card required · Cancel anytime
        </p>

        {/* Hero screenshot */}
        <div className="mt-20 mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-b from-primary/20 to-primary/5 p-[2px]">
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

/* ─────────────── Stat / trust strip ─────────────── */

function LogoStrip() {
  const stats = [
    { value: "99.9%", label: "Uptime SLA" },
    { value: "~2s", label: "Avg. delivery" },
    { value: "1000+", label: "Emails sent" },
    { value: "24/7", label: "Monitoring" },
  ];

  return (
    <section className="border-y border-border/50 bg-muted/30">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{s.value}</div>
              <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Features ─────────────────── */

function Features() {
  const top = [
    {
      key: "feature-analytics",
      title: "Real-time analytics",
      content:
        "Track deliveries, opens, clicks, bounces and unsubscribes in real time. Filter by domain, status, or API key. Know exactly which campaigns perform best.",
      imageLightSrc: "/emails-search-light.webp",
      imageDarkSrc: "/emails-search-dark.webp",
    },
    {
      key: "feature-editor",
      title: "Visual email editor",
      content:
        "Design beautiful campaigns without code using a visual, Notion-like WYSIWYG editor. Reuse templates, apply brand styles, and personalize with variables.",
      imageLightSrc: "/editor-light.webp",
      imageDarkSrc: "/editor-dark.webp",
    },
  ];

  const bottom = [
    {
      key: "feature-contacts",
      title: "Contact management",
      content:
        "Manage contacts, lists and consent in one place. Import and export easily, maintain per-list subscription status. Automatically updated from bounces and complaints.",
    },
    {
      key: "feature-suppression",
      title: "Suppression lists",
      content:
        "Prevent accidental sends. Automatically populated from bounces and complaints, manageable via import/export or API.",
    },
    {
      key: "feature-smtp",
      title: "SMTP relay",
      content:
        "Drop-in SMTP relay that works with any app or framework. No vendor lock-in — perfect with services like Supabase.",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-medium uppercase tracking-wider text-primary mb-3">
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to send email
          </h2>
          <p className="mt-4 text-muted-foreground">
            From transactional receipts to marketing campaigns — one platform, one bill.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {top.map((f) => (
            <FeatureCard
              key={f.key}
              title={f.title}
              content={f.content}
              imageLightSrc={f.imageLightSrc}
              imageDarkSrc={f.imageDarkSrc}
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {bottom.map((f) => (
            <FeatureCardPlain key={f.key} title={f.title} content={f.content} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Pricing ─────────────────── */

function Pricing() {
  const freePerks = [
    "5,000 emails / month",
    "250 emails / day",
    "Up to 5 contact books",
    "Up to 3 domains",
    "Up to 5 team members",
    "Community support",
  ];

  const paidPerks = [
    "$5 monthly usage credits included",
    "Transactional at $0.0004 / email",
    "Marketing at $0.001 / email",
    "Unlimited contact books",
    "Unlimited domains",
    "Unlimited team members",
    "Priority support",
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-sm font-medium uppercase tracking-wider text-primary mb-3">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free, scale as you grow. No surprises.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <PricingCard title="Free" price="$0" note="forever" perks={freePerks} popular={false} />
          <PricingCard
            title="Pro"
            price="$5"
            note="per month minimum"
            perks={paidPerks}
            popular
          />
        </div>

        <div className="mt-10 max-w-4xl mx-auto">
          <PricingCalculator />
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  title,
  price,
  note,
  perks,
  popular,
}: {
  title: string;
  price: string;
  note: string;
  perks: string[];
  popular?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl border ${popular ? "border-primary shadow-lg shadow-primary/10" : "border-border"} bg-background p-6 flex flex-col`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-0.5 text-xs font-medium text-primary-foreground">
          Most popular
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-primary">{price}</span>
        <span className="text-sm text-muted-foreground">/ {note}</span>
      </div>
      <ul className="mt-6 space-y-3 text-sm flex-1">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2.5">
            <CheckIcon className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button className={`w-full ${popular ? "" : "variant-outline"}`} variant={popular ? "default" : "outline"} asChild>
          <Link href={APP_URL}>Get started</Link>
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────── CTA ─────────────────── */

function Cta() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 px-8 py-16 sm:px-16 text-center">
          <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-[80px]" />
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to send?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Create your free account in seconds. No credit card required, no
            trial limits just start sending.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="px-8 h-12 text-base rounded-xl shadow-lg shadow-primary/20" asChild>
              <Link href={APP_URL}>Get started free</Link>
            </Button>
            <Button variant="ghost" size="lg" className="px-8 h-12 text-base rounded-xl" asChild>
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
