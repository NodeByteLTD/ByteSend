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
    usageMetering: {
      marketing: 0.004, // $0.004 per marketing email
      transactional: 0.002, // $0.002 per transactional email
    },
    limits: {
      monthlyEmailLimit: 5_000,
      dailyEmailLimit: 250,
      maxDomains: 3,
      maxContactBooks: 5,
      maxTeamMembers: 5,
      maxWebhooks: 3,
      contactsLimit: 500,
      campaignsLimit: 10,
      prioritySupport: false,
      customBranding: false,
      advancedAnalytics: false,
      apiAccessLevel: "basic",
      concurrentConnections: 1,
    },
  },

  HOBBY: {
    plan: "HOBBY",
    displayName: "Hobby",
    description: "For hobbyists and side projects",
    order: 2,
    isLimited: true,
    monthlyPrice: 500, // $5/month in cents
    usageMetering: {
      marketing: 0.003, // $0.003 per marketing email
      transactional: 0.0015, // $0.0015 per transactional email
    },
    limits: {
      monthlyEmailLimit: 15_000,
      dailyEmailLimit: 500,
      maxDomains: 5,
      maxContactBooks: 10,
      maxTeamMembers: 10,
      maxWebhooks: 5,
      contactsLimit: 2_000,
      campaignsLimit: 30,
      prioritySupport: false,
      customBranding: false,
      advancedAnalytics: false,
      apiAccessLevel: "basic",
      concurrentConnections: 2,
    },
  },

  LITE: {
    plan: "LITE",
    displayName: "Lite",
    description: "For small teams and growing projects",
    order: 3,
    isLimited: true,
    monthlyPrice: 1000, // $10/month in cents
    usageMetering: {
      marketing: 0.002, // $0.002 per marketing email
      transactional: 0.001, // $0.001 per transactional email
    },
    limits: {
      monthlyEmailLimit: 50_000,
      dailyEmailLimit: 2_000,
      maxDomains: 10,
      maxContactBooks: 25,
      maxTeamMembers: 25,
      maxWebhooks: 10,
      contactsLimit: 10_000,
      campaignsLimit: 100,
      prioritySupport: true,
      customBranding: false,
      advancedAnalytics: false,
      apiAccessLevel: "full",
      concurrentConnections: 5,
    },
  },

  BASIC: {
    plan: "BASIC",
    displayName: "Professional",
    description: "For professionals and growing businesses",
    order: 4,
    isLimited: false,
    monthlyPrice: 3000, // $30/month in cents
    // Marketing & transactional emails included at no extra cost
    limits: {
      monthlyEmailLimit: Number.POSITIVE_INFINITY,
      dailyEmailLimit: Number.POSITIVE_INFINITY,
      maxDomains: 100,
      maxContactBooks: 500,
      maxTeamMembers: 50,
      maxWebhooks: 50,
      contactsLimit: 1_000_000,
      campaignsLimit: 1_000,
      prioritySupport: true,
      customBranding: true,
      advancedAnalytics: true,
      apiAccessLevel: "full",
      concurrentConnections: 10,
    },
  },

  LIFETIME: {
    plan: "LIFETIME",
    displayName: "Lifetime",
    description: "One-time payment for unlimited access",
    order: 5,
    isLimited: false,
    monthlyPrice: 0,
    oneTimePrice: 6000, // $60 one-time purchase
    // Marketing & transactional emails included at no extra cost
    limits: {
      monthlyEmailLimit: Number.POSITIVE_INFINITY,
      dailyEmailLimit: Number.POSITIVE_INFINITY,
      maxDomains: 500,
      maxContactBooks: 1000,
      maxTeamMembers: 200,
      maxWebhooks: 100,
      contactsLimit: 10_000_000,
      campaignsLimit: 10_000,
      prioritySupport: true,
      customBranding: true,
      advancedAnalytics: true,
      apiAccessLevel: "full",
      concurrentConnections: 50,
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
