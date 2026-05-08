#!/usr/bin/env tsx
/**
 * Stripe + DB Seed
 *
 * Syncs ByteSend plans to Stripe (creating/updating products and prices)
 * then persists all resulting IDs to the `AppSetting` table so that no
 * plan-specific STRIPE_*_PRICE_ID env vars are needed at runtime.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY  — Stripe secret key (sk_live_* or sk_test_*)
 *   DATABASE_URL       — Postgres connection string
 *
 * Usage (from repo root):
 *   pnpm stripe:seed          (defaults to "dev")
 *   pnpm stripe:seed:prod     (environment label = "production")
 */

import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import {
  syncPlansToStripe,
  generateDbConfig,
  DB_CONFIG_KEYS,
} from "../../../packages/lib/src/stripe/seed.ts";
import { STRIPE_ADDON_PRODUCTS } from "../../../packages/lib/src/stripe/products.ts";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const DATABASE_URL      = process.env.DATABASE_URL;
const ENVIRONMENT       = process.argv[2] ?? process.env.NODE_ENV ?? "dev";

async function main() {
  console.log("\n🚀  ByteSend Stripe + DB Seed");
  console.log("================================\n");

  if (!STRIPE_SECRET_KEY) {
    console.error("❌  STRIPE_SECRET_KEY is not set");
    process.exit(1);
  }
  if (!DATABASE_URL) {
    console.error("❌  DATABASE_URL is not set");
    process.exit(1);
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });
  const db     = new PrismaClient();

  console.log(`📦  Environment : ${ENVIRONMENT}`);
  console.log(`🔑  Stripe key  : ${STRIPE_SECRET_KEY.slice(0, 20)}...`);
  console.log("\n📝  Syncing plans to Stripe...\n");

  // ── Step 1: Sync core plans ──────────────────────────────────────────────
  const result = await syncPlansToStripe(stripe, ENVIRONMENT);

  if (!result.success) {
    console.error("\n❌  Stripe sync failed:");
    result.errors?.forEach((e) => console.error(`   - ${e}`));
    await db.$disconnect();
    process.exit(1);
  }

  console.log(`\n✅  Synced ${result.products.length} core plans`);

  // ── Step 2: Sync additional-domain add-on ────────────────────────────────
  console.log("\n📎  Syncing add-on: Additional Domain...");

  const addonConfig = STRIPE_ADDON_PRODUCTS.ADDITIONAL_DOMAIN;
  const addonProductName = `${addonConfig.name} (${ENVIRONMENT})`;

  const existingAddon = await stripe.products.search({
    query: `name:"${addonProductName}"`,
    limit: 1,
  });

  let addonProduct: Stripe.Product;
  if (existingAddon.data.length > 0) {
    addonProduct = existingAddon.data[0];
    await stripe.products.update(addonProduct.id, {
      description: addonConfig.description,
      metadata: { bytesend_addon: "ADDITIONAL_DOMAIN", environment: ENVIRONMENT },
    });
    console.log(`  ✓ Updated add-on product: ${addonProduct.id}`);
  } else {
    addonProduct = await stripe.products.create({
      name: addonProductName,
      description: addonConfig.description,
      metadata: { bytesend_addon: "ADDITIONAL_DOMAIN", environment: ENVIRONMENT },
    });
    console.log(`  ✓ Created add-on product: ${addonProduct.id}`);
  }

  // Find or create the add-on price
  const existingAddonPrices = await stripe.prices.search({
    query: `product:'${addonProduct.id}' AND metadata['type']:'addon-domain-monthly'`,
    limit: 1,
  });

  let addonPrice: Stripe.Price;
  if (existingAddonPrices.data.length > 0) {
    addonPrice = existingAddonPrices.data[0];
    console.log(`  ✓ Found add-on price: ${addonPrice.id}`);
  } else {
    addonPrice = await stripe.prices.create({
      product: addonProduct.id,
      currency: "cad",
      unit_amount: addonConfig.priceMonthly, // CA$1.00/month
      recurring: { interval: "month" },
      metadata: { type: "addon-domain-monthly", environment: ENVIRONMENT },
    });
    console.log(`  ✓ Created add-on price: ${addonPrice.id}`);
  }

  // ── Step 3: Build DB config map ──────────────────────────────────────────
  const dbConfig = generateDbConfig(result, addonProduct.id, addonPrice.id);

  console.log(`\n💾  Writing ${Object.keys(dbConfig).length} config keys to AppSetting...\n`);

  // Upsert every key into AppSetting
  let savedCount = 0;
  for (const [key, value] of Object.entries(dbConfig)) {
    await db.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    console.log(`  ✓ ${key}`);
    savedCount++;
  }

  console.log(`\n✅  Saved ${savedCount} keys to AppSetting`);

  // ── Step 4: Register webhook endpoint ───────────────────────────────────
  const isDev = ENVIRONMENT === "dev" || ENVIRONMENT === "development" || ENVIRONMENT === "test";
  const appUrl = process.env.NEXTAUTH_URL ?? process.env.APP_URL;

  if (isDev) {
    console.log("\n🔔  Webhook: skipping registration for dev environment.");
    console.log("   Run `pnpm stripe:listen` to forward events to localhost.");
  } else if (!appUrl) {
    console.warn("\n⚠️   Webhook: NEXTAUTH_URL / APP_URL not set — skipping endpoint registration.");
    console.warn("   Set NEXTAUTH_URL and re-run to auto-register the webhook.");
  } else {
    const webhookUrl = `${appUrl.replace(/\/$/, "")}/api/webhook/stripe`;
    console.log(`\n🔔  Registering webhook endpoint: ${webhookUrl}`);

    const enabledEvents: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
      "checkout.session.completed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "customer.subscription.paused",
      "customer.subscription.resumed",
      "customer.subscription.pending_update_applied",
      "customer.subscription.pending_update_expired",
      "customer.subscription.trial_will_end",
      "invoice.paid",
      "invoice.payment_failed",
      "invoice.payment_action_required",
      "invoice.upcoming",
      "invoice.marked_uncollectible",
      "invoice.payment_succeeded",
      "payment_intent.succeeded",
      "payment_intent.payment_failed",
      "payment_intent.canceled",
    ];

    // Check if endpoint already registered for this URL
    const existingEndpoints = await stripe.webhookEndpoints.list({ limit: 100 });
    const existing = existingEndpoints.data.find((e) => e.url === webhookUrl);

    let webhookSecret: string | undefined;

    if (existing) {
      console.log(`  ✓ Endpoint already registered: ${existing.id}`);
      console.log(`    Status: ${existing.status}`);

      // Update enabled events in case they changed
      await stripe.webhookEndpoints.update(existing.id, { enabled_events: enabledEvents });
      console.log(`  ✓ Enabled events updated`);

      // Check if we already have the secret stored
      const existingSecret = await db.appSetting.findUnique({
        where: { key: DB_CONFIG_KEYS.webhook.secret },
      });
      if (existingSecret) {
        console.log(`  ✓ Webhook secret already in AppSetting`);
      } else {
        console.warn(`  ⚠️  Webhook secret not in AppSetting — endpoint was created previously.`);
        console.warn(`     Re-create the endpoint manually or delete it and re-run the seed.`);
      }
    } else {
      const endpoint = await stripe.webhookEndpoints.create({
        url: webhookUrl,
        enabled_events: enabledEvents,
        metadata: { environment: ENVIRONMENT, bytesend: "true" },
      });
      webhookSecret = endpoint.secret;
      console.log(`  ✓ Created endpoint: ${endpoint.id}`);

      // Save endpoint ID and secret to AppSetting
      await db.appSetting.upsert({
        where: { key: DB_CONFIG_KEYS.webhook.endpointId },
        update: { value: endpoint.id },
        create: { key: DB_CONFIG_KEYS.webhook.endpointId, value: endpoint.id },
      });
      await db.appSetting.upsert({
        where: { key: DB_CONFIG_KEYS.webhook.secret },
        update: { value: webhookSecret! },
        create: { key: DB_CONFIG_KEYS.webhook.secret, value: webhookSecret! },
      });
      console.log(`  ✓ Webhook secret saved to AppSetting`);
      console.log(`\n  ℹ️  Optionally set in .env for faster startup:`);
      console.log(`     STRIPE_WEBHOOK_SECRET=${webhookSecret}`);
    }
  }

  // ── Step 5: Print summary ────────────────────────────────────────────────
  console.log("\n📊  Price IDs stored:");
  console.log("─────────────────────────────────────────");

  const prices = Object.entries(dbConfig).filter(([k]) => k.startsWith("stripe.price."));
  for (const [key, value] of prices) {
    console.log(`  ${key.padEnd(50)} ${value}`);
  }

  console.log("\n✅  Done. You only need STRIPE_SECRET_KEY in your .env.");
  console.log("   All price/product IDs and the webhook secret are stored in the database.\n");

  await db.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  const db = new PrismaClient();
  await db.$disconnect();
  process.exit(1);
});
