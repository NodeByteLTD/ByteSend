import Stripe from "stripe";
import { PlanType } from "./types";
import { STRIPE_PRODUCTS, STRIPE_ENV_KEYS, STRIPE_ADDON_PRODUCTS } from "./products";
import { PLANS } from "./plans";

/**
 * Stripe Seed/Sync Utilities
 * Syncs our plan definitions with Stripe products, meters, and prices
 */

/** Meter event names used for usage-based billing */
export const METER_EVENT_NAMES = {
  marketing: "bytesend_marketing_emails",
  transactional: "bytesend_transactional_emails",
  extraMember: "bytesend_extra_team_members",
} as const;

/** Plans that use Stripe metered overage billing (excludes FREE and LIFETIME) */
const METERED_PLANS: PlanType[] = ["HOBBY", "LITE", "BASIC"];

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
  meters: { marketing: string; transactional: string; extraMember: string };
  addonProducts?: { extraMemberProductId: string; additionalDomainProductId: string };
  errors?: string[];
}

/**
 * Ensure a Stripe Billing Meter exists, creating it if needed.
 */
async function ensureMeter(
  stripe: Stripe,
  eventName: string,
  displayName: string
): Promise<Stripe.Billing.Meter> {
  // List existing meters and find by event_name
  const meters = await stripe.billing.meters.list({ limit: 100 });
  const existing = meters.data.find((m) => m.event_name === eventName && m.status === "active");

  if (existing) {
    console.log(`✓ Meter already exists: ${eventName} (${existing.id})`);
    return existing;
  }

  const meter = await stripe.billing.meters.create({
    display_name: displayName,
    event_name: eventName,
    default_aggregation: { formula: "sum" },
    customer_mapping: {
      event_payload_key: "stripe_customer_id",
      type: "by_id",
    },
  });
  console.log(`✓ Created meter: ${eventName} (${meter.id})`);
  return meter;
}

/**
 * Sync all plans to Stripe
 * Creates or updates products, meters, and prices based on configuration
 *
 * @param stripe Stripe client instance
 * @param environment Environment name (dev, staging, production)
 * @returns Sync result with product/meter mappings
 */
export async function syncPlansToStripe(
  stripe: Stripe,
  environment: string = "dev"
): Promise<SyncResult> {
  const products: StripeProductMapping[] = [];
  const errors: string[] = [];

  try {
    // ── Step 1: Ensure Billing Meters exist ──
    console.log("📊 Ensuring Billing Meters...\n");
    const marketingMeter = await ensureMeter(
      stripe,
      METER_EVENT_NAMES.marketing,
      "Marketing Emails Sent (Overage)"
    );
    const transactionalMeter = await ensureMeter(
      stripe,
      METER_EVENT_NAMES.transactional,
      "Transactional Emails Sent (Overage)"
    );
    const extraMemberMeter = await ensureMeter(
      stripe,
      METER_EVENT_NAMES.extraMember,
      "Extra Team Members"
    );
    console.log("");

    // ── Step 2: Sync Products & Prices ──
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
          console.log(`  ✓ Updated product: ${product.id}`);
        } else {
          product = await stripe.products.create({
            name: productName,
            description: config.description,
            metadata: {
              plan,
              environment,
              bytesend_plan: plan,
            },
          });
          console.log(`  ✓ Created product: ${product.id}`);
        }

        const priceIds: StripeProductMapping["priceIds"] = {};

        // ── Base subscription / one-time prices ──
        if (plan === "FREE") {
          console.log(`  └─ Free plan, no base price or metering`);
        } else if (plan === "LIFETIME") {
          const price = await createOrUpdatePrice(stripe, {
            productId: product.id,
            amount: config.priceOneTime ?? 6000,
            currency: "cad",
            billingScheme: "per_unit",
            recurring: null,
            nickname: `${config.name} — Lifetime access (one-time)`,
            metadata: { type: "one-time", plan },
          });
          priceIds.oneTime = price.id;
          console.log(`  └─ One-time: CA$${((config.priceOneTime ?? 6000) / 100).toFixed(2)} → ${price.id}`);
        } else {
          // HOBBY, LITE, BASIC — monthly subscription
          const monthlyPrice = await createOrUpdatePrice(stripe, {
            productId: product.id,
            amount: config.priceMonthly!,
            currency: "cad",
            billingScheme: "per_unit",
            recurring: { interval: "month", usageType: "licensed" },
            nickname: `${config.name} — Monthly subscription`,
            metadata: { type: "monthly", plan },
          });
          priceIds.monthly = monthlyPrice.id;
          console.log(`  └─ Monthly: CA$${(config.priceMonthly! / 100).toFixed(2)}/mo → ${monthlyPrice.id}`);
        }

        // ── Metered overage prices (HOBBY, LITE, BASIC only) ──
        // Rates apply ONLY to emails sent BEYOND the plan's included monthly limit.
        // FREE has no metering (hard cap). LIFETIME has no metering (unlimited).
        const planData = PLANS[plan];
        if (planData.usageMetering && METERED_PLANS.includes(plan)) {
          // Marketing metered price — references the marketing meter
          const marketingCents = (planData.usageMetering.marketing * 100).toFixed(4);
          const marketingPrice = await createOrUpdateMeterPrice(stripe, {
            productId: product.id,
            unitAmountDecimal: marketingCents,
            currency: "cad",
            meterId: marketingMeter.id,
            nickname: `Marketing email overage (CA$${planData.usageMetering.marketing}/email)`,
            metadata: { type: "marketing-usage", plan },
          });
          priceIds.marketingUsage = marketingPrice.id;
          console.log(`  └─ Marketing overage: CA$${planData.usageMetering.marketing}/email → ${marketingPrice.id}`);

          // Transactional metered price — references the transactional meter
          const transactionalCents = (planData.usageMetering.transactional * 100).toFixed(4);
          const transactionalPrice = await createOrUpdateMeterPrice(stripe, {
            productId: product.id,
            unitAmountDecimal: transactionalCents,
            currency: "cad",
            meterId: transactionalMeter.id,
            nickname: `Transactional email overage (CA$${planData.usageMetering.transactional}/email)`,
            metadata: { type: "transactional-usage", plan },
          });
          priceIds.transactionalUsage = transactionalPrice.id;
          console.log(`  └─ Transactional overage: CA$${planData.usageMetering.transactional}/email → ${transactionalPrice.id}`);
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
        console.error(`  ✗ Error syncing ${planType}:`, error);
      }
    }

    return {
      success: errors.length === 0,
      products,
      meters: {
        marketing: marketingMeter.id,
        transactional: transactionalMeter.id,
        extraMember: extraMemberMeter.id,
      },
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      products: [],
      meters: { marketing: "", transactional: "", extraMember: "" },
      errors: [`Fatal error during sync: ${errorMsg}`],
    };
  }
}

// ── Price creation helpers ──

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
  nickname?: string;
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
    nickname,
    metadata,
  } = params;

  // Search for existing price with matching metadata
  const existingPrices = await stripe.prices.search({
    query: `product:'${productId}' AND metadata['type']:'${metadata.type}'`,
    limit: 1,
  });

  if (existingPrices.data.length > 0) {
    return existingPrices.data[0];
  }

  const priceData: Stripe.PriceCreateParams = {
    product: productId,
    currency,
    billing_scheme: billingScheme,
    metadata,
    ...(nickname ? { nickname } : {}),
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

  return stripe.prices.create(priceData);
}

interface CreateMeterPriceParams {
  productId: string;
  unitAmountDecimal: string;
  currency: string;
  meterId: string;
  nickname?: string;
  metadata: Record<string, string>;
}

async function createOrUpdateMeterPrice(
  stripe: Stripe,
  params: CreateMeterPriceParams
): Promise<Stripe.Price> {
  const { productId, unitAmountDecimal, currency, meterId, nickname, metadata } = params;

  // Search for existing price with matching metadata
  const existingPrices = await stripe.prices.search({
    query: `product:'${productId}' AND metadata['type']:'${metadata.type}'`,
    limit: 1,
  });

  if (existingPrices.data.length > 0) {
    return existingPrices.data[0];
  }

  // Create a meter-based price using the Billing Meters API
  return stripe.prices.create({
    product: productId,
    currency,
    billing_scheme: "per_unit",
    unit_amount_decimal: unitAmountDecimal,
    recurring: {
      interval: "month",
      usage_type: "metered",
      meter: meterId,
    },
    ...(nickname ? { nickname } : {}),
    metadata,
  });
}

/**
 * Stable key names used when persisting Stripe IDs to the AppSetting table.
 * Format: stripe.{type}.{plan|addon}.{price_type}
 */
export const DB_CONFIG_KEYS = {
  price: {
    hobby:    { monthly: "stripe.price.hobby.monthly", marketingUsage: "stripe.price.hobby.marketing_usage", transactionalUsage: "stripe.price.hobby.transactional_usage" },
    lite:     { monthly: "stripe.price.lite.monthly",  marketingUsage: "stripe.price.lite.marketing_usage",  transactionalUsage: "stripe.price.lite.transactional_usage"  },
    basic:    { monthly: "stripe.price.basic.monthly", marketingUsage: "stripe.price.basic.marketing_usage", transactionalUsage: "stripe.price.basic.transactional_usage" },
    lifetime: { oneTime: "stripe.price.lifetime.one_time" },
    addon:    { domainMonthly: "stripe.price.addon.domain_monthly" },
  },
  product: {
    free: "stripe.product.free", hobby: "stripe.product.hobby", lite: "stripe.product.lite",
    basic: "stripe.product.basic", lifetime: "stripe.product.lifetime",
    addonDomain: "stripe.product.addon.domain",
  },
  meter: {
    marketing:    "stripe.meter.marketing",
    transactional: "stripe.meter.transactional",
    extraMember:  "stripe.meter.extra_member",
  },
  webhook: {
    endpointId: "stripe.webhook.endpoint_id",
    secret:     "stripe.webhook.secret",
  },
} as const;

/**
 * Convert a SyncResult into flat key→value pairs suitable for AppSetting upserts.
 */
export function generateDbConfig(
  result: SyncResult,
  addonDomainProductId?: string,
  addonDomainPriceId?: string,
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const p of result.products) {
    const planKey = p.plan.toLowerCase() as keyof typeof DB_CONFIG_KEYS.product;
    const productDbKey = DB_CONFIG_KEYS.product[planKey];
    if (productDbKey) out[productDbKey] = p.productId;

    const priceKeys = DB_CONFIG_KEYS.price[planKey as keyof typeof DB_CONFIG_KEYS.price];
    if (!priceKeys) continue;
    const r = priceKeys as Record<string, string>;
    if (p.priceIds.monthly && r.monthly)               out[r.monthly] = p.priceIds.monthly;
    if (p.priceIds.marketingUsage && r.marketingUsage) out[r.marketingUsage] = p.priceIds.marketingUsage;
    if (p.priceIds.transactionalUsage && r.transactionalUsage) out[r.transactionalUsage] = p.priceIds.transactionalUsage;
    if (p.priceIds.oneTime && r.oneTime)               out[r.oneTime] = p.priceIds.oneTime;
  }

  if (addonDomainProductId) out[DB_CONFIG_KEYS.product.addonDomain] = addonDomainProductId;
  if (addonDomainPriceId)   out[DB_CONFIG_KEYS.price.addon.domainMonthly] = addonDomainPriceId;

  if (result.meters.marketing)    out[DB_CONFIG_KEYS.meter.marketing]    = result.meters.marketing;
  if (result.meters.transactional) out[DB_CONFIG_KEYS.meter.transactional] = result.meters.transactional;
  if (result.meters.extraMember)  out[DB_CONFIG_KEYS.meter.extraMember]  = result.meters.extraMember;

  return out;
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
    const envKeys = STRIPE_ENV_KEYS[result.plan as keyof typeof STRIPE_ENV_KEYS];
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
