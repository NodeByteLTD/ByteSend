import { PricingTier, PlanType } from "./types";

/**
 * Plan Definitions
 * Fully configurable plan structure with limits and pricing
 */

export const PLANS: Record<PlanType, PricingTier> = {
  FREE: {
    plan: "FREE",
    displayName: "Free",
    description: "Perfect for getting started with ByteSend",
    order: 1,
    isLimited: true,
    monthlyPrice: 0,
    // No usageMetering — FREE plan is a hard cap on everything. No overage billing.
    limits: {
      monthlyEmailLimit: 12_500,
      dailyEmailLimit: 5_000,
      maxDomains: 2,
      maxContactBooks: 5,
      maxTeamMembers: 5,
      maxWebhooks: 3,
      contactsLimit: 100,
      campaignsLimit: 0, // Marketing emails not available on free plan
      prioritySupport: false,
      customBranding: false,
      advancedAnalytics: false,
      apiAccessLevel: "basic",
      concurrentConnections: 1,
      marketingEmailsIncluded: false,
      extraMemberRateCents: 0, // Hard cap — upgrade required
      additionalDomainRateCents: 100, // CA$1/domain add-on
    },
  },

  HOBBY: {
    plan: "HOBBY",
    displayName: "Hobby",
    description: "For hobbyists and side projects",
    order: 2,
    isLimited: true,
    monthlyPrice: 500, // CA$5/month in cents
    usageMetering: {
      marketing: 0.05,    // CA$0.05 per marketing email (overage after 25,000 included)
      transactional: 0.03, // CA$0.03 per transactional email (overage after 25,000 included)
    },
    limits: {
      monthlyEmailLimit: 25_000,
      dailyEmailLimit: 12_500,
      maxDomains: 4,
      maxContactBooks: 10,
      maxTeamMembers: 10,
      maxWebhooks: 5,
      contactsLimit: 200,
      campaignsLimit: 30,
      prioritySupport: false,
      customBranding: false,
      advancedAnalytics: false,
      apiAccessLevel: "basic",
      concurrentConnections: 2,
      marketingEmailsIncluded: true,
      extraMemberRateCents: 0, // Hard cap — upgrade required
      additionalDomainRateCents: 100, // CA$1/domain add-on
    },
  },

  LITE: {
    plan: "LITE",
    displayName: "Lite",
    description: "For small teams and growing projects",
    order: 3,
    isLimited: true,
    monthlyPrice: 1000, // CA$10/month in cents
    usageMetering: {
      marketing: 0.02,    // CA$0.02 per marketing email (overage after 50,000 included)
      transactional: 0.02, // CA$0.02 per transactional email (overage after 50,000 included)
    },
    limits: {
      monthlyEmailLimit: 50_000,
      dailyEmailLimit: 25_000,
      maxDomains: 6,
      maxContactBooks: 25,
      maxTeamMembers: 15,
      maxWebhooks: 10,
      contactsLimit: 300,
      campaignsLimit: 100,
      prioritySupport: true,
      customBranding: false,
      advancedAnalytics: false,
      apiAccessLevel: "full",
      concurrentConnections: 5,
      marketingEmailsIncluded: true,
      extraMemberRateCents: 0, // Hard cap — upgrade required
      additionalDomainRateCents: 100, // CA$1/domain add-on
    },
  },

  BASIC: {
    plan: "BASIC",
    displayName: "Professional",
    description: "For professionals and growing businesses",
    order: 4,
    isLimited: true,
    monthlyPrice: 2000, // CA$20/month in cents
    usageMetering: {
      marketing: 0.01,    // CA$0.01 per marketing email (overage after 100,000 included)
      transactional: 0.01, // CA$0.01 per transactional email (overage after 100,000 included)
    },
    limits: {
      monthlyEmailLimit: 100_000,
      dailyEmailLimit: Number.POSITIVE_INFINITY, // unlimited daily
      maxDomains: 12,
      maxContactBooks: 50,
      maxTeamMembers: 30,
      maxWebhooks: 25,
      contactsLimit: 1_000,
      campaignsLimit: 200,
      prioritySupport: true,
      customBranding: false, // Self-hosted only
      advancedAnalytics: true,
      apiAccessLevel: "full",
      concurrentConnections: 10,
      marketingEmailsIncluded: true,
      extraMemberRateCents: 0, // Hard cap — upgrade required
      additionalDomainRateCents: 100, // CA$1/domain add-on
    },
  },

  LIFETIME: {
    plan: "LIFETIME",
    displayName: "Lifetime",
    description: "One-time payment for long-term access",
    order: 5,
    isLimited: true,
    monthlyPrice: 0,
    oneTimePrice: 19900, // CA$199 one-time purchase
    // No usageMetering — emails are hard-capped at a generous limit; no overage billing.
    limits: {
      monthlyEmailLimit: 500_000,
      dailyEmailLimit: Number.POSITIVE_INFINITY, // unlimited daily
      maxDomains: 30,
      maxContactBooks: 200,
      maxTeamMembers: 100,
      maxWebhooks: 50,
      contactsLimit: 10_000,
      campaignsLimit: 1_000,
      prioritySupport: true,
      customBranding: false, // Self-hosted only
      advancedAnalytics: true,
      apiAccessLevel: "full",
      concurrentConnections: 20,
      marketingEmailsIncluded: true,
      extraMemberRateCents: 0,
      additionalDomainRateCents: 100, // CA$1/domain add-on
    },
  },
};

/**
 * Get plan by type
 */
export function getPlan(plan: PlanType): PricingTier {
  return PLANS[plan];
}

/**
 * Get all plans sorted by order
 */
export function getAllPlans(): PricingTier[] {
  return Object.values(PLANS).sort((a, b) => a.order - b.order);
}

/**
 * Check if a plan is limited (has usage caps)
 */
export function isPlanLimited(plan: PlanType): boolean {
  return PLANS[plan].isLimited;
}

/**
 * Get plan pricing
 */
export function getPlanMonthlyPrice(plan: PlanType, billing: "monthly" | "annual" = "monthly"): number {
  const planConfig = PLANS[plan];
  return billing === "annual" && planConfig.annualPrice
    ? planConfig.annualPrice
    : planConfig.monthlyPrice;
}

/** @deprecated use getPlanMonthlyPrice */
export const getPlanPrice = getPlanMonthlyPrice;
