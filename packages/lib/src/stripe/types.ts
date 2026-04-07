/**
 * Stripe Payment Types
 * Defines all payment-related types for ByteSend's Stripe integration
 */

export type PlanType = "FREE" | "LITE" | "HOBBY" | "BASIC" | "LIFETIME";

export interface PlanLimits {
  monthlyEmailLimit: number;
  dailyEmailLimit: number;
  maxDomains: number;
  maxContactBooks: number;
  maxTeamMembers: number;
  maxOwnedTeams: number;
  maxWebhooks: number;
  contactsLimit: number;
  campaignsLimit: number;
  prioritySupport: boolean;
  customBranding: boolean;
  advancedAnalytics: boolean;
  apiAccessLevel: "basic" | "full";
  concurrentConnections: number;
  /** Whether marketing/campaign emails are available on this plan. False = marketing blocked entirely. */
  marketingEmailsIncluded: boolean;
  /** Per-member overage rate in cents when maxTeamMembers is exceeded. 0 = hard cap (no overage). */
  extraMemberRateCents: number;
  /** Rate in cents to order an additional domain. 0 = not applicable. */
  additionalDomainRateCents: number;
}

export interface PricingTier {
  plan: PlanType;
  displayName: string;
  description: string;
  limits: PlanLimits;
  /** Monthly recurring price in cents. 0 for free or one-time plans. */
  monthlyPrice: number;
  annualPrice?: number;
  /** One-time purchase price in cents (e.g. LIFETIME plan). */
  oneTimePrice?: number;
  /**
   * Per-email overage billing rates (CAD).
   * Applies ONLY to emails sent BEYOND the plan's included monthlyEmailLimit.
   * Plans without this field are either hard-capped (FREE) or unlimited (LIFETIME).
   */
  usageMetering?: {
    marketing: number; // CAD per marketing email (overage only)
    transactional: number; // CAD per transactional email (overage only)
  };
  isLimited: boolean;
  order: number;
}

export interface StripeProduct {
  plan: PlanType;
  productId: string;
  prices: {
    monthly?: string;
    annual?: string;
    usage?: string;
    oneTime?: string;
  };
}

export interface StripeProductConfig {
  plan: PlanType;
  name: string;
  description: string;
  priceMonthly?: number;
  priceAnnual?: number;
  /**
   * One-time purchase price in cents (used for LIFETIME plan).
   * When set, creates a Stripe price with no `recurring` field.
   */
  priceOneTime?: number;
  meteringConfig?: {
    marketingRate: number;
    transactionalRate: number;
  };
}
