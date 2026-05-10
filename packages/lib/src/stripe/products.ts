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
      "12,500 emails/month and 5,000 emails/day included (hard cap). " +
      "Transactional emails only — marketing emails not available. " +
      "Extra domains available at CA$1/domain/month.",
  },

  HOBBY: {
    plan: "HOBBY",
    name: "ByteSend Hobby",
    description:
      "For hobbyists and side projects. " +
      "25,000 emails/month included. " +
      "Transactional and marketing emails included. " +
      "Overage billed at CA$0.90/1,000 marketing emails and CA$0.40/1,000 transactional emails. " +
      "No daily send cap on paid plans. " +
      "Extra domains available at CA$1/domain/month.",
    priceMonthly: 500, // CA$5/month
  },

  LITE: {
    plan: "LITE",
    name: "ByteSend Lite",
    description:
      "For small teams and growing projects. " +
      "50,000 emails/month included. " +
      "Transactional and marketing emails included. " +
      "Overage billed at CA$0.80/1,000 marketing emails and CA$0.35/1,000 transactional emails. " +
      "No daily send cap on paid plans. " +
      "Extra domains available at CA$1/domain/month.",
    priceMonthly: 1000, // CA$10/month in cents
  },

  BASIC: {
    plan: "BASIC",
    name: "ByteSend Pro",
    description:
      "For teams with higher volume and tighter delivery requirements. " +
      "100,000 emails/month included with unlimited daily sending. " +
      "Overage billed at CA$0.70/1,000 marketing emails and CA$0.25/1,000 transactional emails. " +
      "Up to 12 domains, 30 team members, 1,000 contacts.",
    priceMonthly: 2000, // CA$20/month
  },

  LIFETIME: {
    plan: "LIFETIME",
    name: "ByteSend Lifetime",
    description:
      "One-time payment for long-term access to ByteSend. " +
      "500,000 emails/month included with unlimited daily sending. " +
      "Up to 30 domains, 100 team members, 10,000 contacts. " +
      "No subscriptions, no renewals.",
    priceOneTime: 19900, // CA$199 one-time purchase
  },
};

/**
 * Add-on product configurations (not tied to a plan)
 */
export const STRIPE_ADDON_PRODUCTS = {
  EXTRA_MEMBER: {
    name: "ByteSend Extra Team Member",
    description:
      "Add-on for team members beyond the included plan limit. " +
      "Billed at CA$2.00 per additional member per month.",
    priceMonthly: 200, // CA$2.00/month per member
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
    monthlyPrice: "STRIPE_EXTRA_MEMBER_PRICE_ID",
  },
  ADDITIONAL_DOMAIN: {
    productId: "STRIPE_ADDITIONAL_DOMAIN_PRODUCT_ID",
    monthlyPrice: "STRIPE_ADDITIONAL_DOMAIN_PRICE_ID",
  },
} as const;
