/**
 * Stripe Integration Utilities for Web App
 * Bridges between the Stripe lib and the application
 */

import { env } from "~/env";
import { PLANS, getPlan, PlanType } from "@bytesend/lib";

/**
 * Environment variable mapping for plan price IDs
 */
const PLAN_ENV_MAP: Record<PlanType, { monthly?: string; marketingUsage?: string; transactionalUsage?: string; oneTime?: string }> = {
  FREE: {
    // No metered prices — FREE plan is hard-capped, no Stripe overage metering
  },
  LITE: {
    monthly: env.STRIPE_LITE_PRICE_ID,
    marketingUsage: env.STRIPE_LITE_MARKETING_USAGE_PRICE_ID,
    transactionalUsage: env.STRIPE_LITE_TRANSACTIONAL_USAGE_PRICE_ID,
  },
  HOBBY: {
    monthly: env.STRIPE_HOBBY_PRICE_ID,
    marketingUsage: env.STRIPE_HOBBY_MARKETING_USAGE_PRICE_ID,
    transactionalUsage: env.STRIPE_HOBBY_TRANSACTIONAL_USAGE_PRICE_ID,
  },
  BASIC: {
    monthly: env.STRIPE_BASIC_PRICE_ID,
    marketingUsage: env.STRIPE_BASIC_MARKETING_USAGE_PRICE_ID,
    transactionalUsage: env.STRIPE_BASIC_TRANSACTIONAL_USAGE_PRICE_ID,
  },
  LIFETIME: {
    oneTime: env.STRIPE_LIFETIME_PRICE_ID,
    // No metered prices — LIFETIME is unlimited
  },
};

/**
 * Get Stripe price IDs for a plan
 */
export function getPlanPriceIds(plan: PlanType): { monthly?: string; marketingUsage?: string; transactionalUsage?: string; oneTime?: string } {
  return PLAN_ENV_MAP[plan];
}

/**
 * Get the price ID for monthly billing
 */
export function getMonthlyPriceId(plan: PlanType): string | undefined {
  return PLAN_ENV_MAP[plan]?.monthly;
}

/**
 * Get the price ID for marketing email metered billing
 */
export function getMarketingUsagePriceId(plan: PlanType): string | undefined {
  return PLAN_ENV_MAP[plan]?.marketingUsage;
}

/**
 * Get the price ID for transactional email metered billing
 */
export function getTransactionalUsagePriceId(plan: PlanType): string | undefined {
  return PLAN_ENV_MAP[plan]?.transactionalUsage;
}

/**
 * Get the price ID for one-time purchase plans (e.g. LIFETIME)
 */
export function getOneTimePriceId(plan: PlanType): string | undefined {
  return PLAN_ENV_MAP[plan]?.oneTime;
}

/**
 * Get billing tier info for display
 */
export function getBillingTierInfo(plan: PlanType) {
  const tier = getPlan(plan);
  return {
    name: tier.displayName,
    description: tier.description,
    monthlyPrice: tier.monthlyPrice / 100, // Convert cents to dollars
    isLimited: tier.isLimited,
    limits: tier.limits,
  };
}

/**
 * Get all available billing tiers for display
 */
export function getAvailableBillingTiers() {
  return Object.values(PLANS)
    .sort((a, b) => a.order - b.order)
    .map(tier => ({
      plan: tier.plan,
      name: tier.displayName,
      description: tier.description,
      monthlyPrice: tier.monthlyPrice / 100,
      annualPrice: tier.annualPrice ? tier.annualPrice / 100 : undefined,
      isLimited: tier.isLimited,
      limits: tier.limits,
      usageMetering: tier.usageMetering,
    }));
}

/**
 * Format plan pricing for display (CAD)
 */
export function formatPlanPrice(plan: PlanType): string {
  const pricing = getPlan(plan);

  if (plan === "FREE") {
    return "Free";
  }

  if (plan === "LIFETIME") {
    return `CA$${((pricing.oneTimePrice ?? 0) / 100).toFixed(0)} one-time`;
  }

  if (plan === "BASIC") {
    return `CA$${(pricing.monthlyPrice / 100).toFixed(2)}/mo`;
  }

  return `CA$${(pricing.monthlyPrice / 100).toFixed(2)}/mo`;
}

/**
 * Get meter rate info for a given plan.
 * Returns null for plans with usage included (BASIC, LIFETIME).
 */
export function getMeterRates(plan: PlanType = "LITE") {
  const planData = getPlan(plan);
  return planData.usageMetering ?? null;
}

/**
 * Check if a plan should be shown in pricing UI
 */
export function shouldShowPlanInUI(plan: PlanType): boolean {
  // You can customize which plans to show in the UI
  // For now, show all non-HOBBY plans (HOBBY is for internal testing)
  return plan !== "HOBBY";
}

/**
 * Get the best tier for estimated email volume
 */
export function getRecommendedPlan(monthlyEmails: number): PlanType {
  if (monthlyEmails <= 5000) {
    return "FREE";
  }
  if (monthlyEmails <= 50000) {
    return "LITE";
  }
  return "BASIC";
}
