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
  maxWebhooks: number;
  contactsLimit: number;
  campaignsLimit: number;
  prioritySupport: boolean;
  customBranding: boolean;
  advancedAnalytics: boolean;
  apiAccessLevel: "basic" | "full";
  concurrentConnections: number;
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
  usageMetering?: {
    marketing: number; // dollars per email
    transactional: number; // dollars per email
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
