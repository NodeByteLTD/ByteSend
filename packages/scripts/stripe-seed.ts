#!/usr/bin/env node

/**
 * Stripe Products Seed CLI
 *
 * Syncs all ByteSend plans to Stripe as products and prices.
 * Run from repo root: pnpm stripe:seed:dev
 */

import Stripe from "stripe";
import { syncPlansToStripe, generateEnvOutput } from "../lib/src/stripe/index.ts";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const ENVIRONMENT = process.argv[2] ?? process.env.NODE_ENV ?? "dev";

async function main() {
  console.log("\n🚀 ByteSend Stripe Products Seed");
  console.log("================================\n");

  if (!STRIPE_SECRET_KEY) {
    console.error("❌  STRIPE_SECRET_KEY is not set in your .env");
    process.exit(1);
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
  });

  console.log(`📦  Environment : ${ENVIRONMENT}`);
  console.log("🔑  Stripe key  : configured");
  console.log("\n📝  Syncing plans to Stripe...\n");

  const result = await syncPlansToStripe(stripe, ENVIRONMENT);

  if (!result.success) {
    console.error("\n❌  Sync failed:");
    result.errors?.forEach((e) => console.error(`   - ${e}`));
    process.exit(1);
  }

  console.log(`\n✅  Synced ${result.products.length} plans\n`);

  console.log("📊  Billing Meters:");
  console.log("─────────────────────");
  console.log(`  Marketing meter    : ${result.meters.marketing}`);
  console.log(`  Transactional meter: ${result.meters.transactional}`);

  console.log("\n📊  Product mappings:");
  console.log("─────────────────────");
  for (const p of result.products) {
    console.log(`\n  ${p.plan}`);
    console.log(`    Product ID          : ${p.productId}`);
    if (p.priceIds.monthly) console.log(`    Monthly             : ${p.priceIds.monthly}`);
    if (p.priceIds.marketingUsage) console.log(`    Marketing usage     : ${p.priceIds.marketingUsage}`);
    if (p.priceIds.transactionalUsage) console.log(`    Transactional usage : ${p.priceIds.transactionalUsage}`);
    if (p.priceIds.oneTime) console.log(`    One-time            : ${p.priceIds.oneTime}`);
  }

  const envOutput = generateEnvOutput(result.products);
  const lines = Object.entries(envOutput)
    .map(([k, v]) => `${k}="${v}"`)
    .join("\n");

  console.log("\n\n📄  Add these to your .env:");
  console.log("─────────────────────────────");
  console.log(lines);
  console.log("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
