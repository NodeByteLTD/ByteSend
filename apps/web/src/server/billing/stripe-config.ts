/**
 * Stripe Config — DB-backed price ID loader
 *
 * After running `pnpm stripe:seed`, all Stripe price/product IDs are stored
 * in the `AppSetting` table under `stripe.*` keys. This module reads them
 * with an in-process cache so there's no per-request DB overhead.
 *
 * Only STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET are needed as env vars.
 */

import { db } from "../db";

// ── Key constants (mirrors DB_CONFIG_KEYS in packages/lib) ──────────────────

export const PRICE_KEYS = {
  hobby:    { monthly: "stripe.price.hobby.monthly", marketingUsage: "stripe.price.hobby.marketing_usage", transactionalUsage: "stripe.price.hobby.transactional_usage" },
  lite:     { monthly: "stripe.price.lite.monthly",  marketingUsage: "stripe.price.lite.marketing_usage",  transactionalUsage: "stripe.price.lite.transactional_usage"  },
  basic:    { monthly: "stripe.price.basic.monthly", marketingUsage: "stripe.price.basic.marketing_usage", transactionalUsage: "stripe.price.basic.transactional_usage" },
  lifetime: { oneTime: "stripe.price.lifetime.one_time" },
  addon:    { 
    domainMonthly: "stripe.price.addon.domain_monthly",
    memberMonthly: "stripe.price.addon.member_monthly",
  },
} as const;

// ── In-process cache ─────────────────────────────────────────────────────────

let _cache: Map<string, string> | null = null;

/**
 * Load all `stripe.*` keys from AppSetting into a Map.
 * Result is cached for the lifetime of the process (or until invalidated).
 */
export async function getStripeConfig(): Promise<Map<string, string>> {
  if (_cache) return _cache;

  const rows = await db.appSetting.findMany({
    where: { key: { startsWith: "stripe." } },
  });

  _cache = new Map(rows.map((r) => [r.key, r.value]));
  return _cache;
}

/**
 * Invalidate the in-process cache — call after re-seeding.
 */
export function invalidateStripeConfigCache(): void {
  _cache = null;
}

/**
 * Look up a single price/product ID.
 * Returns undefined when the key is missing (Stripe not seeded yet).
 */
export async function getStripeValue(key: string): Promise<string | undefined> {
  const config = await getStripeConfig();
  return config.get(key);
}

/**
 * Return the plan-level price IDs for a given paid plan.
 * Any field can be undefined if Stripe has not been seeded.
 */
export async function getPlanPriceIds(plan: "HOBBY" | "LITE" | "BASIC" | "LIFETIME"): Promise<{
  monthly?: string;
  marketingUsage?: string;
  transactionalUsage?: string;
  oneTime?: string;
}> {
  const config = await getStripeConfig();
  const get = (k: string) => config.get(k);

  switch (plan) {
    case "HOBBY":
      return {
        monthly:             get(PRICE_KEYS.hobby.monthly),
        marketingUsage:      get(PRICE_KEYS.hobby.marketingUsage),
        transactionalUsage:  get(PRICE_KEYS.hobby.transactionalUsage),
      };
    case "LITE":
      return {
        monthly:             get(PRICE_KEYS.lite.monthly),
        marketingUsage:      get(PRICE_KEYS.lite.marketingUsage),
        transactionalUsage:  get(PRICE_KEYS.lite.transactionalUsage),
      };
    case "BASIC":
      return {
        monthly:             get(PRICE_KEYS.basic.monthly),
        marketingUsage:      get(PRICE_KEYS.basic.marketingUsage),
        transactionalUsage:  get(PRICE_KEYS.basic.transactionalUsage),
      };
    case "LIFETIME":
      return {
        oneTime: get(PRICE_KEYS.lifetime.oneTime),
      };
  }
}

/**
 * Build a reverse map from priceId → Plan.
 * Used in syncStripeData to identify which plan a subscription belongs to.
 */
export async function buildPriceIdToPlanMap(): Promise<Map<string, string>> {
  const config = await getStripeConfig();
  const map = new Map<string, string>();

  const planEntries: Array<[string, string]> = [
    [PRICE_KEYS.hobby.monthly,    "HOBBY"],
    [PRICE_KEYS.lite.monthly,     "LITE"],
    [PRICE_KEYS.basic.monthly,    "BASIC"],
    [PRICE_KEYS.lifetime.oneTime, "LIFETIME"],
  ];

  for (const [key, plan] of planEntries) {
    const priceId = config.get(key);
    if (priceId) map.set(priceId, plan);
  }

  return map;
}

/**
 * Return the Set of add-on price IDs (domain slots etc.).
 * Used in syncStripeData to separate add-on subs from plan subs.
 */
export async function getAddonPriceIds(): Promise<Set<string>> {
  const config = await getStripeConfig();
  const ids = new Set<string>();
  const domainPriceId = config.get(PRICE_KEYS.addon.domainMonthly);
  const memberPriceId = config.get(PRICE_KEYS.addon.memberMonthly);
  if (domainPriceId) ids.add(domainPriceId);
  if (memberPriceId) ids.add(memberPriceId);
  return ids;
}

/**
 * Get domain and member addon price IDs separately for webhook processing.
 */
export async function getAddonPriceIdsByType(): Promise<{
  domainMonthly: string | undefined;
  memberMonthly: string | undefined;
}> {
  const config = await getStripeConfig();
  return {
    domainMonthly: config.get(PRICE_KEYS.addon.domainMonthly),
    memberMonthly: config.get(PRICE_KEYS.addon.memberMonthly),
  };
}

/**
 * Return the Stripe webhook signing secret from AppSetting.
 * Set by `pnpm stripe:seed` when registering the webhook endpoint.
 * Falls back to undefined if not seeded (env var STRIPE_WEBHOOK_SECRET used instead).
 */
export async function getWebhookSecret(): Promise<string | undefined> {
  return getStripeValue("stripe.webhook.secret");
}
