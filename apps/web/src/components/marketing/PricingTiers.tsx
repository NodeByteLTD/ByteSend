/**
 * PricingTiers — Free · Hobby · Lite + custom callout
 * Source of truth for displayed limits: packages/lib/src/stripe/plans.ts
 */

"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@bytesend/ui/components/badge";
import { Button } from "@bytesend/ui/components/button";
import { Check, X, Mail, Globe, Users, Database, Zap } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PlanKey = "FREE" | "HOBBY" | "LITE";

interface Feature {
  icon: React.ElementType;
  label: string;
  /** string value shown, false = not available */
  value: string | false;
}

interface PlanDef {
  key: PlanKey;
  name: string;
  tagline: string;
  /** CA cents per month (0 = free) */
  priceCents: number;
  /** Shown below the price, e.g. overage rates */
  priceSuffix?: string;
  recommended?: boolean;
  features: Feature[];
}

// ---------------------------------------------------------------------------
// Plan definitions — mirrors packages/lib/src/stripe/plans.ts exactly
// ---------------------------------------------------------------------------

const PLANS: PlanDef[] = [
  {
    key: "FREE",
    name: "Free",
    tagline: "Explore ByteSend at no cost",
    priceCents: 0,
    priceSuffix: "Hard cap — no overage billing",
    features: [
      { icon: Mail,     label: "Emails / month",  value: "12,500"   },
      { icon: Mail,     label: "Emails / day",     value: "5,000"    },
      { icon: Globe,    label: "Domains",          value: "2"        },
      { icon: Users,    label: "Team members",     value: "5"        },
      { icon: Database, label: "Contacts",         value: "100"      },
      { icon: Zap,      label: "Marketing emails", value: false      },
    ],
  },
  {
    key: "HOBBY",
    name: "Hobby",
    tagline: "Side projects with marketing",
    priceCents: 500,
    priceSuffix: "CA$0.05 / extra marketing email",
    features: [
      { icon: Mail,     label: "Emails / month",  value: "25,000"   },
      { icon: Mail,     label: "Emails / day",     value: "12,500"   },
      { icon: Globe,    label: "Domains",          value: "4"        },
      { icon: Users,    label: "Team members",     value: "10"       },
      { icon: Database, label: "Contacts",         value: "200"      },
      { icon: Zap,      label: "Marketing emails", value: "Included" },
    ],
  },
  {
    key: "LITE",
    name: "Lite",
    tagline: "Growing teams, lower overage",
    priceCents: 1000,
    priceSuffix: "CA$0.02 / extra marketing email",
    recommended: true,
    features: [
      { icon: Mail,     label: "Emails / month",  value: "50,000"   },
      { icon: Mail,     label: "Emails / day",     value: "25,000"   },
      { icon: Globe,    label: "Domains",          value: "6"        },
      { icon: Users,    label: "Team members",     value: "15"       },
      { icon: Database, label: "Contacts",         value: "300"      },
      { icon: Zap,      label: "Marketing emails", value: "Included" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Card component
// ---------------------------------------------------------------------------

function PlanCard({ plan }: { plan: PlanDef }) {
  const router = useRouter();
  const isFree = plan.priceCents === 0;
  const dollars = (plan.priceCents / 100).toFixed(0);

  function handleCta() {
    if (isFree) {
      router.push("/sign-up");
    } else {
      router.push(`/settings/billing?plan=${plan.key}`);
    }
  }

  return (
    <div
      className={[
        "relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden",
        plan.recommended
          ? "border-primary/60 shadow-xl shadow-primary/15 scale-[1.03] bg-primary/5"
          : "border-border/50 hover:border-border/80 bg-card",
      ].join(" ")}
    >
      {plan.recommended && (
        <div className="absolute -top-px inset-x-0 h-0.75 bg-linear-to-r from-primary/60 via-primary to-primary/60" />
      )}

      <div className="flex flex-col gap-6 p-8 flex-1">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
            {plan.recommended && (
              <Badge className="text-xs bg-primary text-primary-foreground">Recommended</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{plan.tagline}</p>
        </div>

        {/* Price */}
        <div>
          {isFree ? (
            <p className="text-4xl font-bold tracking-tight">Free</p>
          ) : (
            <div className="flex items-end gap-1">
              <span className="text-sm text-muted-foreground self-start mt-2">CA$</span>
              <span className="text-4xl font-bold tracking-tight leading-none">{dollars}</span>
              <span className="text-sm text-muted-foreground mb-1">/mo</span>
            </div>
          )}
          {plan.priceSuffix && (
            <p className="mt-1.5 text-xs text-muted-foreground leading-snug">{plan.priceSuffix}</p>
          )}
        </div>

        {/* CTA */}
        <Button
          className="w-full"
          variant={plan.recommended ? "default" : "outline"}
          onClick={handleCta}
        >
          {isFree ? "Get started for free" : `Get ${plan.name}`}
        </Button>

        {/* Features */}
        <div className="border-t border-border/40 pt-6 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            What&apos;s included
          </p>
          <ul className="space-y-3">
            {plan.features.map((feat) => {
              const Icon = feat.icon;
              const included = feat.value !== false;
              return (
                <li key={feat.label} className="flex items-center gap-3 text-sm">
                  <Icon
                    className={[
                      "size-4 shrink-0",
                      included ? "text-primary" : "text-muted-foreground/40",
                    ].join(" ")}
                  />
                  <span className={included ? "text-foreground" : "text-muted-foreground/50 line-through"}>
                    {feat.label}
                  </span>
                  {included && feat.value !== "Included" && (
                    <span className="ml-auto font-medium tabular-nums">{feat.value}</span>
                  )}
                  {feat.value === "Included" && (
                    <Check className="ml-auto size-4 text-primary" />
                  )}
                  {!included && (
                    <X className="ml-auto size-4 text-muted-foreground/40" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------

export function PricingTiers() {
  return (
    <section className="w-full space-y-16">
      {/* Heading */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Every plan includes transactional email. Paid plans unlock marketing sends with
          usage-based overage. Free plan is a hard cap — no surprise charges.
        </p>
        <p className="text-sm text-muted-foreground">
          Just exploring?{" "}
          <a href="/sign-up" className="text-primary font-medium hover:underline">
            Start for free
          </a>{" "}
          — no credit card required.
        </p>
      </div>

      {/* 3 plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
        {PLANS.map((plan) => (
          <PlanCard key={plan.key} plan={plan} />
        ))}
      </div>

      {/* Domain add-on */}
      <div className="rounded-2xl border border-border/50 bg-card/60 px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Globe className="size-6 text-primary shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1">
          <p className="font-semibold text-sm">Need more domains?</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Purchase extra domain slots on any paid plan for{" "}
            <span className="font-medium text-foreground">CA$1 / domain / month</span>.
          </p>
        </div>
        <a href="/settings/billing" className="text-sm text-primary hover:underline shrink-0 font-medium">
          Manage add-ons ?
        </a>
      </div>

      {/* Custom / Enterprise */}
      <div className="rounded-2xl border border-border/50 bg-card/60 px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-1 space-y-1.5">
          <h3 className="text-lg font-bold tracking-tight">Custom plan</h3>
          <p className="text-sm text-muted-foreground max-w-lg">
            Need higher volumes, dedicated infrastructure, SLA guarantees, or a white-label
            deployment? We&apos;ll put together a custom contract that fits your needs.
          </p>
        </div>
        <a
          href="mailto:hello@bytesend.app"
          className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors shrink-0"
        >
          Contact us ?
        </a>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        All paid plans include a 14-day money-back guarantee. Prices in Canadian dollars (CAD).
        Overage rates apply only after monthly limits are reached.
      </p>
    </section>
  );
}

export default PricingTiers;
