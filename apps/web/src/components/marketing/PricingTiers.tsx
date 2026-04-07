/**
 * Pricing Tiers Component
 * Displays all available ByteSend plans
 * 
 * Usage:
 *   <PricingTiers />
 */

"use client";

import { getAllPlans } from "@bytesend/lib";
import { PlanType } from "@bytesend/lib";
import { Button } from "@bytesend/ui/components/button";
import { Badge } from "@bytesend/ui/components/badge";
import React from "react";

interface PricingTierCardProps {
  plan: PlanType;
  displayName: string;
  description: string;
  monthlyPrice: number;
  limits: Record<string, number | string | boolean>;
  isPopular?: boolean;
  onSelect?: (plan: PlanType) => void;
}

function PricingTierCard({
  plan,
  displayName,
  description,
  monthlyPrice,
  limits,
  isPopular = false,
  onSelect,
}: PricingTierCardProps) {
  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const isPlanFree = monthlyPrice === 0 && plan !== "LIFETIME";
  const isPayAsYouGo = plan === "BASIC";
  const isOneTime = plan === "LIFETIME";

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 ${
        isPopular
          ? "border-primary/50 shadow-xl shadow-primary/20 scale-105"
          : "border-border/50 hover:border-border/80"
      } ${isPopular ? "bg-primary/5" : "bg-card"}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold tracking-tight">{displayName}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          {isPlanFree ? (
            <div className="text-4xl font-bold tracking-tight">Free</div>
          ) : isPayAsYouGo ? (
            <>
              <div className="text-4xl font-bold tracking-tight">
                CA${formatPrice(monthlyPrice)}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                per month + usage-based billing
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Marketing: CA$0.001/email · Transactional: CA$0.0004/email
              </p>
            </>
          ) : isOneTime ? (
            <>
              <div className="text-4xl font-bold tracking-tight">Lifetime</div>
              <p className="mt-2 text-sm text-muted-foreground">One-time purchase</p>
            </>
          ) : (
            <>
              <div className="text-4xl font-bold tracking-tight">
                CA${formatPrice(monthlyPrice)}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">per month</p>
            </>
          )}
        </div>

        {/* CTA Button */}
        <Button
          className="w-full mb-8"
          variant={isPopular ? "default" : "outline"}
          onClick={() => onSelect?.(plan)}
        >
          Get Started
        </Button>

        {/* Features */}
        <div className="border-t border-border/40 pt-8">
          <div className="text-sm font-semibold mb-4">What's included</div>
          <ul className="space-y-3 text-sm">
            {Object.entries(limits).map(([key, value]) => {
              // Format the limit key for display
              const displayKey = key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .trim();

              let displayValue = "";
              if (typeof value === "boolean") {
                displayValue = value ? "✓" : "✗";
              } else if (typeof value === "number") {
                if (value === Infinity) {
                  displayValue = "Unlimited";
                } else if (value >= 1000000) {
                  displayValue = `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  displayValue = `${(value / 1000).toFixed(0)}K`;
                } else {
                  displayValue = value.toString();
                }
              } else {
                displayValue = value.toString();
              }

              // Only show significant limits
              if (value === false || value === 0) {
                return null;
              }

              return (
                <li key={key} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{displayKey}</span>
                  <span className="font-medium">{displayValue}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function PricingTiers() {
  const plans = getAllPlans();

  // Hide HOBBY plan from UI (it's for internal use)
  const visiblePlans = plans.filter((p) => p.plan !== "HOBBY");

  // Determine which plan is popular (BASIC is the recommended paid plan)
  const handleSelectPlan = (plan: PlanType) => {
    console.log(`Selected plan: ${plan}`);
    // TODO: Integrate with checkout flow
    // router.push(`/billing/checkout?plan=${plan}`);
  };

  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the perfect plan for your email needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {visiblePlans.map((plan) => (
          <PricingTierCard
            key={plan.plan}
            plan={plan.plan as PlanType}
            displayName={plan.displayName}
            description={plan.description}
            monthlyPrice={plan.monthlyPrice}
            limits={plan.limits}
            isPopular={plan.plan === "BASIC"}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          All plans include 30-day money-back guarantee · No credit card required
        </p>
      </div>
    </div>
  );
}

export default PricingTiers;
