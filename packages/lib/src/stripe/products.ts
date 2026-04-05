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
      "5,000 emails per month included.",
  },

  HOBBY: {
    plan: "HOBBY",
    name: "ByteSend Hobby",
    description:
      "For hobbyists and side projects. " +
      "15,000 emails per month included.",
    priceMonthly: 500, // $5/month
  },

  LITE: {
    plan: "LITE",
    name: "ByteSend Lite",
    description:
      "For small teams and growing projects. " +
      "50,000 emails per month included.",
    priceMonthly: 1000, // $10/month in cents
  },

  BASIC: {
    plan: "BASIC",
    name: "ByteSend Professional",
    description:
      "For professionals and growing businesses. " +
      "Unlimited emails — marketing & transactional included.",
    priceMonthly: 3000, // $30/month
  },

  LIFETIME: {
    plan: "LIFETIME",
    name: "ByteSend Lifetime",
    description:
      "One-time payment for lifetime access to all ByteSend features, forever. " +
      "No subscriptions, no renewals.",
    priceOneTime: 6000, // $60 one-time purchase
  },
};

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
  },
  LITE: {
    productId: "STRIPE_LITE_PRODUCT_ID",
    monthlyPrice: "STRIPE_LITE_PRICE_ID",
  },
  HOBBY: {
    productId: "STRIPE_HOBBY_PRODUCT_ID",
    monthlyPrice: "STRIPE_HOBBY_PRICE_ID",
  },
  BASIC: {
    productId: "STRIPE_BASIC_PRODUCT_ID",
    monthlyPrice: "STRIPE_BASIC_PRICE_ID",
  },
  LIFETIME: {
    productId: "STRIPE_LIFETIME_PRODUCT_ID",
    oneTimePrice: "STRIPE_LIFETIME_PRICE_ID",
  },
} as const;
