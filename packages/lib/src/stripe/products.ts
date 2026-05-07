import { PlanType, StripeProductConfig } from "./types";
import { PLANS } from "./plans";

/**
 * Stripe Product Configuration
 * Maps our internal plans to Stripe products and pricing
 */

export const STRIPE_PRODUCTS: Record<PlanType, StripeProductConfig> = {
  FREE: {
    plan: "FREE",
    name: "ByteSend Free",
    description:
      "Perfect for getting started with ByteSend. " +
      "5,000 emails/month and 1,000 emails/day included (hard cap). " +
      "Transactional emails only — marketing emails not available.",
  },

  HOBBY: {
    plan: "HOBBY",
    name: "ByteSend Hobby",
    description:
      "For hobbyists and side projects. " +
      "15,000 emails/month included. " +
      "Overage billed at CA$0.05/marketing email and CA$0.03/transactional email.",
    priceMonthly: 500, // CA$5/month
  },

  LITE: {
    plan: "LITE",
    name: "ByteSend Lite",
    description:
      "For small teams and growing projects. " +
      "50,000 emails/month included. " +
      "Overage billed at CA$0.02/email (marketing and transactional).",
    priceMonthly: 1000, // CA$10/month in cents
  },

  BASIC: {
    plan: "BASIC",
    name: "ByteSend Professional",
    description:
      "For professionals and growing businesses. " +
      "150,000 emails/month included. " +
      "Overage billed at CA$0.01/email (marketing and transactional).",
    priceMonthly: 3000, // CA$30/month
  },

  LIFETIME: {
    plan: "LIFETIME",
    name: "ByteSend Lifetime",
    description:
      "One-time payment for lifetime access to all ByteSend features, forever. " +
      "Unlimited emails — marketing and transactional included at no extra cost. " +
      "No subscriptions, no renewals.",
    priceOneTime: 6000, // CA$60 one-time purchase
  },
};

/**
 * Add-on product configurations (not tied to a plan)
 */
export const STRIPE_ADDON_PRODUCTS = {
  EXTRA_MEMBER: {
    name: "ByteSend Extra Team Member",
    description:
      "Metered add-on for team members beyond the included plan limit. " +
      "Billed at CA$0.25 per additional member per month.",
    meteringConfig: {
      eventName: "bytesend_extra_team_members",
      rateCents: 25, // CA$0.25 per extra member
    },
  },
  ADDITIONAL_DOMAIN: {
    name: "ByteSend Additional Domain",
    description:
      "Order an additional sending domain at CA$1.00 per domain per month.",
    priceMonthly: 100, // CA$1.00/month per domain
  },
} as const;

/**
 * Get Stripe product config by plan
 */
export function getProductConfig(plan: PlanType): StripeProductConfig {
  return STRIPE_PRODUCTS[plan];
}

/**
 * Get all product configs
 */
export function getAllProductConfigs(): StripeProductConfig[] {
  return Object.values(STRIPE_PRODUCTS);
}

/**
 * Stripe environment variable names mapping
 */
export const STRIPE_ENV_KEYS = {
  FREE: {
    productId: "STRIPE_FREE_PRODUCT_ID",
    // No metered prices — FREE plan is hard-capped, no Stripe metering
  },
  LITE: {
    productId: "STRIPE_LITE_PRODUCT_ID",
    monthlyPrice: "STRIPE_LITE_PRICE_ID",
    marketingUsagePrice: "STRIPE_LITE_MARKETING_USAGE_PRICE_ID",
    transactionalUsagePrice: "STRIPE_LITE_TRANSACTIONAL_USAGE_PRICE_ID",
  },
  HOBBY: {
    productId: "STRIPE_HOBBY_PRODUCT_ID",
    monthlyPrice: "STRIPE_HOBBY_PRICE_ID",
    marketingUsagePrice: "STRIPE_HOBBY_MARKETING_USAGE_PRICE_ID",
    transactionalUsagePrice: "STRIPE_HOBBY_TRANSACTIONAL_USAGE_PRICE_ID",
  },
  BASIC: {
    productId: "STRIPE_BASIC_PRODUCT_ID",
    monthlyPrice: "STRIPE_BASIC_PRICE_ID",
    marketingUsagePrice: "STRIPE_BASIC_MARKETING_USAGE_PRICE_ID",
    transactionalUsagePrice: "STRIPE_BASIC_TRANSACTIONAL_USAGE_PRICE_ID",
  },
  LIFETIME: {
    productId: "STRIPE_LIFETIME_PRODUCT_ID",
    oneTimePrice: "STRIPE_LIFETIME_PRICE_ID",
    // No metered prices — LIFETIME is unlimited
  },
  // Add-on products
  EXTRA_MEMBER: {
    productId: "STRIPE_EXTRA_MEMBER_PRODUCT_ID",
    usagePrice: "STRIPE_EXTRA_MEMBER_USAGE_PRICE_ID",
  },
  ADDITIONAL_DOMAIN: {
    productId: "STRIPE_ADDITIONAL_DOMAIN_PRODUCT_ID",
    monthlyPrice: "STRIPE_ADDITIONAL_DOMAIN_PRICE_ID",
  },
} as const;
