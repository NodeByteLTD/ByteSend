import Stripe from "stripe";
import { PlanType } from "./types";
import { STRIPE_PRODUCTS, STRIPE_ENV_KEYS } from "./products";
import { PLANS } from "./plans";

/**
 * Stripe Seed/Sync Utilities
 * Syncs our plan definitions with Stripe products and prices
 */

export interface StripeProductMapping {
  plan: PlanType;
  productId: string;
  priceIds: {
    monthly?: string;
    annual?: string;
    marketingUsage?: string;
    transactionalUsage?: string;
    oneTime?: string;
  };
  metadata: {
    environment: string;
    lastSyncedAt: string;
  };
}

export interface SyncResult {
  success: boolean;
  products: StripeProductMapping[];
  errors?: string[];
}

/**
 * Sync all plans to Stripe
 * Creates or updates products and prices based on STRIPE_PRODUCTS configuration
 *
 * @param stripe Stripe client instance
 * @param environment Environment name (dev, staging, production) - appended to product names
 * @returns Sync result with product mappings
 */
export async function syncPlansToStripe(
  stripe: Stripe,
  environment: string = "dev"
): Promise<SyncResult> {
  const products: StripeProductMapping[] = [];
  const errors: string[] = [];

  try {
    for (const [planType, config] of Object.entries(STRIPE_PRODUCTS)) {
      try {
        const plan = planType as PlanType;
        const productName = `${config.name} (${environment})`;

        console.log(`Syncing plan: ${plan}`);

        // Search for existing product
        const existingProducts = await stripe.products.search({
          query: `name:"${productName}"`,
          limit: 1,
        });

        let product: Stripe.Product;

        if (existingProducts.data.length > 0) {
          // Update existing product
          product = existingProducts.data[0];
          await stripe.products.update(product.id, {
            name: productName,
            description: config.description,
            metadata: {
              plan,
              environment,
              bytesend_plan: plan,
            },
          });
          console.log(`✓ Updated product for ${plan}: ${product.id}`);
        } else {
          // Create new product
          product = await stripe.products.create({
            name: productName,
            description: config.description,
            type: "service",
            metadata: {
              plan,
              environment,
              bytesend_plan: plan,
            },
          });
          console.log(`✓ Created product for ${plan}: ${product.id}`);
        }

        // Handle pricing based on plan type
        const priceIds: { monthly?: string; annual?: string; marketingUsage?: string; transactionalUsage?: string; oneTime?: string } =
          {};

        if (plan === "FREE") {
          // No base subscription price — only metered usage prices
          console.log(`  └─ Free plan, skipping base price`);
        } else if (plan === "LIFETIME") {
          // One-time purchase — no recurring field in Stripe means type=one_time
          const price = await createOrUpdatePrice(stripe, {
            productId: product.id,
            amount: config.priceOneTime ?? 29900,
            currency: "usd",
            billingScheme: "per_unit",
            recurring: null,
            metadata: { type: "one-time", plan },
          });
          priceIds.oneTime = price.id;
          console.log(`  └─ Created one-time price ($${((config.priceOneTime ?? 29900) / 100).toFixed(2)}): ${price.id}`);
        } else if (plan === "BASIC") {
          // Fixed monthly price — marketing & transactional included
          const monthlyPrice = await createOrUpdatePrice(stripe, {
            productId: product.id,
            amount: config.priceMonthly || 3000,
            currency: "usd",
            billingScheme: "per_unit",
            recurring: { interval: "month", usageType: "licensed" },
            metadata: { type: "monthly", plan },
          });
          priceIds.monthly = monthlyPrice.id;
          console.log(`  └─ Created monthly price ($${((config.priceMonthly || 3000) / 100).toFixed(2)}/mo): ${monthlyPrice.id}`);
        } else if (plan === "LITE" || plan === "HOBBY") {
          // Monthly subscription price
          const monthlyPrice = await createOrUpdatePrice(stripe, {
            productId: product.id,
            amount: config.priceMonthly!,
            currency: "usd",
            billingScheme: "per_unit",
            recurring: { interval: "month", usageType: "licensed" },
            metadata: { type: "monthly", plan },
          });
          priceIds.monthly = monthlyPrice.id;
          console.log(`  └─ Created monthly price ($${(config.priceMonthly! / 100).toFixed(2)}/mo): ${monthlyPrice.id}`);
        }

        // Create metered usage prices for plans with usageMetering
        const planData = PLANS[plan];
        if (planData.usageMetering) {
          // Rates are in dollars — convert to cents string for Stripe unit_amount_decimal
          const marketingCents = (planData.usageMetering.marketing * 100).toFixed(4);
          const transactionalCents = (planData.usageMetering.transactional * 100).toFixed(4);

          const marketingPrice = await createOrUpdatePrice(stripe, {
            productId: product.id,
            unitAmountDecimal: marketingCents,
            currency: "usd",
            billingScheme: "per_unit",
            recurring: { interval: "month", usageType: "metered", aggregateUsage: "sum" },
            metadata: { type: "marketing-usage", plan },
          });
          priceIds.marketingUsage = marketingPrice.id;
          console.log(`  └─ Created marketing usage price ($${planData.usageMetering.marketing}/email): ${marketingPrice.id}`);

          const transactionalPrice = await createOrUpdatePrice(stripe, {
            productId: product.id,
            unitAmountDecimal: transactionalCents,
            currency: "usd",
            billingScheme: "per_unit",
            recurring: { interval: "month", usageType: "metered", aggregateUsage: "sum" },
            metadata: { type: "transactional-usage", plan },
          });
          priceIds.transactionalUsage = transactionalPrice.id;
          console.log(`  └─ Created transactional usage price ($${planData.usageMetering.transactional}/email): ${transactionalPrice.id}`);
        }

        products.push({
          plan,
          productId: product.id,
          priceIds,
          metadata: {
            environment,
            lastSyncedAt: new Date().toISOString(),
          },
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errors.push(`Failed to sync ${planType}: ${errorMsg}`);
        console.error(`✗ Error syncing ${planType}:`, error);
      }
    }

    return {
      success: errors.length === 0,
      products,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      products: [],
      errors: [`Fatal error during sync: ${errorMsg}`],
    };
  }
}

interface CreatePriceParams {
  productId: string;
  amount?: number | null;
  unitAmountDecimal?: string;
  currency: string;
  billingScheme: "per_unit";
  recurring: {
    interval: "month" | "year";
    usageType: "metered" | "licensed";
    aggregateUsage?: "sum" | "max" | "last_during_period";
  } | null;
  metadata: Record<string, string>;
}

async function createOrUpdatePrice(
  stripe: Stripe,
  params: CreatePriceParams
): Promise<Stripe.Price> {
  const {
    productId,
    amount,
    unitAmountDecimal,
    currency,
    billingScheme,
    recurring,
    metadata,
  } = params;

  // Search for existing price
  const existingPrices = await stripe.prices.search({
    query: `product:'${productId}' AND metadata['type']:'${metadata.type}'`,
    limit: 1,
  });

  if (existingPrices.data.length > 0) {
    // Stripe API: prices can't be updated, only created new ones
    // Return the existing one
    return existingPrices.data[0];
  }

  // Create new price
  const priceData: Stripe.PriceCreateParams = {
    product: productId,
    currency,
    billing_scheme: billingScheme,
    metadata,
  };

  if (recurring) {
    priceData.recurring = {
      interval: recurring.interval,
      usage_type: recurring.usageType,
      ...(recurring.aggregateUsage && {
        aggregate_usage: recurring.aggregateUsage,
      }),
    };
  }

  if (amount !== undefined && amount !== null) {
    priceData.unit_amount = amount;
  } else if (unitAmountDecimal !== undefined) {
    priceData.unit_amount_decimal = unitAmountDecimal;
  }

  const price = await stripe.prices.create(priceData);
  return price;
}

/**
 * Get the environment variable names for a plan's Stripe IDs
 */
export function getEnvKeysForPlan(plan: PlanType): { [key: string]: string } {
  const envKeys = STRIPE_ENV_KEYS[plan as keyof typeof STRIPE_ENV_KEYS];
  return envKeys || {};
}

/**
 * Generate .env format output for synced products
 */
export function generateEnvOutput(
  results: StripeProductMapping[]
): Record<string, string> {
  const env: Record<string, string> = {};

  for (const result of results) {
    const envKeys = STRIPE_ENV_KEYS[result.plan];
    if (!envKeys) continue;

    const keysRecord = envKeys as Record<string, string>;
    for (const [key, envKey] of Object.entries(keysRecord)) {
      if (key === "productId") {
        env[envKey] = result.productId;
      } else if (key === "monthlyPrice" && result.priceIds.monthly) {
        env[envKey] = result.priceIds.monthly;
      } else if (key === "marketingUsagePrice" && result.priceIds.marketingUsage) {
        env[envKey] = result.priceIds.marketingUsage;
      } else if (key === "transactionalUsagePrice" && result.priceIds.transactionalUsage) {
        env[envKey] = result.priceIds.transactionalUsage;
      } else if (key === "oneTimePrice" && result.priceIds.oneTime) {
        env[envKey] = result.priceIds.oneTime;
      }
    }
  }

  return env;
}
