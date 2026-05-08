import Stripe from "stripe";
import type { Plan } from "@prisma/client";
import { env } from "~/env";
import { db } from "../db";
import { sendSubscriptionConfirmationEmail } from "../mailer";
import { TeamService } from "../service/team-service";
import { logger } from "../logger/log";
import {
  getPlanPriceIds,
  getAddonPriceIds,
  getAddonPriceIdsByType,
  buildPriceIdToPlanMap,
  getStripeValue,
  PRICE_KEYS,
} from "./stripe-config";

export type CheckoutPlan = Extract<Plan, "LITE" | "HOBBY" | "BASIC" | "LIFETIME">;

export function getStripe() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(env.STRIPE_SECRET_KEY);
}

async function createCustomerForTeam(teamId: number) {
  const stripe = getStripe();
  const customer = await stripe.customers.create({ metadata: { teamId } });

  await TeamService.updateTeam(teamId, {
    billingEmail: customer.email,
    stripeCustomerId: customer.id,
  });

  return customer;
}

export async function createCheckoutSessionForTeam(
  teamId: number,
  plan: CheckoutPlan = "BASIC",
) {
  const team = await db.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error("Team not found");
  if (team.isActive && team.plan !== "FREE") throw new Error("Team is already active");

  const stripe = getStripe();

  let customerId = team.stripeCustomerId;
  if (!customerId) {
    const customer = await createCustomerForTeam(teamId);
    customerId = customer.id;
  } else {
    // Verify the stored customer still exists in Stripe (handles DB resets / key switches)
    try {
      await stripe.customers.retrieve(customerId);
    } catch (err) {
      if (err instanceof Stripe.errors.StripeError && err.code === "resource_missing") {
        const customer = await createCustomerForTeam(teamId);
        customerId = customer.id;
      } else {
        throw err;
      }
    }
  }

  const priceIds = await getPlanPriceIds(plan);

  if (plan === "LIFETIME") {
    if (!priceIds.oneTime) {
      throw new Error("Stripe not seeded: run `pnpm stripe:seed` to create price IDs in DB");
    }
    return stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price: priceIds.oneTime, quantity: 1 }],
      success_url: `${env.NEXTAUTH_URL}/payments?success=true&plan=LIFETIME&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXTAUTH_URL}/settings/billing`,
      metadata: { teamId: teamId.toString(), plan },
      client_reference_id: teamId.toString(),
    });
  }

  // HOBBY, LITE, BASIC — subscription
  if (!priceIds.monthly) {
    throw new Error(`Stripe not seeded: run \`pnpm stripe:seed\` to create ${plan} price IDs in DB`);
  }

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      { price: priceIds.monthly, quantity: 1 },
      ...(priceIds.marketingUsage     ? [{ price: priceIds.marketingUsage }]     : []),
      ...(priceIds.transactionalUsage ? [{ price: priceIds.transactionalUsage }] : []),
    ],
    success_url: `${env.NEXTAUTH_URL}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXTAUTH_URL}/settings/billing`,
    metadata: { teamId: teamId.toString(), plan },
    client_reference_id: teamId.toString(),
  });
}

/**
 * Creates a Stripe Checkout session for purchasing additional domain slots.
 */
export async function createAddonCheckoutSession(
  teamId: number,
  quantity: number = 1,
  addonType: "EXTRA_DOMAIN" | "EXTRA_MEMBER" = "EXTRA_DOMAIN",
) {
  const priceKey = addonType === "EXTRA_DOMAIN" ? PRICE_KEYS.addon.domainMonthly : PRICE_KEYS.addon.memberMonthly;
  const addonPriceId = await getStripeValue(priceKey);
  if (!addonPriceId) {
    throw new Error(`Stripe not seeded: run \`pnpm stripe:seed\` to create ${addonType.toLowerCase()} add-on price in DB`);
  }

  const team = await db.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error("Team not found");

  const stripe = getStripe();

  let customerId = team.stripeCustomerId;
  if (!customerId) {
    const customer = await createCustomerForTeam(teamId);
    customerId = customer.id;
  }

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: addonPriceId, quantity }],
    success_url: `${env.NEXTAUTH_URL}/payments?success=true&addon=${addonType.toLowerCase()}&qty=${quantity}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXTAUTH_URL}/settings/billing`,
    metadata: {
      teamId: teamId.toString(),
      addonType: addonType,
      quantity: quantity.toString(),
    },
    client_reference_id: teamId.toString(),
  });
}

async function getPlanFromPriceIds(priceIds: string[]): Promise<Plan> {
  const map = await buildPriceIdToPlanMap();
  const priceSet = new Set(priceIds);
  for (const [priceId, plan] of map) {
    if (priceSet.has(priceId)) return plan as Plan;
  }
  return "FREE";
}

export async function getManageSessionUrl(teamId: number) {
  const team = await db.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error("Team not found");
  if (!team.stripeCustomerId) throw new Error("Team has no Stripe customer ID");

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: team.stripeCustomerId,
    return_url: `${env.NEXTAUTH_URL}`,
  });
  return session.url;
}

export async function syncStripeData(customerId: string) {
  const stripe = getStripe();

  const team = await db.team.findUnique({ where: { stripeCustomerId: customerId } });
  if (!team) return;

  const wasPaid = team.isActive && team.plan !== "FREE";

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 20,
    status: "all",
    expand: ["data.default_payment_method"],
  });

  // Identify add-on price IDs from DB
  const addonPriceIds = await getAddonPriceIds();
  const addonPricesByType = await getAddonPriceIdsByType();

  // Plan subscription = first sub whose items contain at least one non-addon price
  const planSubscription =
    subscriptions.data.find((sub) =>
      sub.items.data.some((item) => item.price?.id && !addonPriceIds.has(item.price.id)),
    ) ?? null;

  // Sum extra domain slots and member slots from ACTIVE add-on subscriptions
  let extraDomainSlots = 0;
  let extraMemberSlots = 0;
  for (const sub of subscriptions.data) {
    if (sub.status === "active") {
      for (const item of sub.items.data) {
        if (item.price?.id === addonPricesByType.domainMonthly) {
          extraDomainSlots += item.quantity ?? 1;
        } else if (item.price?.id === addonPricesByType.memberMonthly) {
          extraMemberSlots += item.quantity ?? 1;
        }
      }
    }
  }

  await db.team.update({ 
    where: { id: team.id }, 
    data: { extraDomainSlots, extraMemberSlots } 
  });
  await TeamService.invalidateTeamCache(team.id);

  if (!planSubscription?.items.data[0]) return;

  const subscription = planSubscription;
  const priceIds = subscription.items.data
    .map((item) => item.price?.id)
    .filter((id): id is string => Boolean(id));

  const nextPlan = await getPlanFromPriceIds(priceIds);
  const isNowPaid = subscription.status === "active" && nextPlan !== "FREE";
  const shouldSendSubscriptionConfirmation = !wasPaid && isNowPaid;

  const periodEnd   = subscription.items.data[0]?.current_period_end;
  const periodStart = subscription.items.data[0]?.current_period_start;

  await db.subscription.upsert({
    where: { id: subscription.id },
    update: {
      status: subscription.status,
      priceId: subscription.items.data[0]?.price?.id ?? "",
      priceIds,
      currentPeriodEnd:   periodEnd   ? new Date(periodEnd   * 1000) : null,
      currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
      paymentMethod: JSON.stringify(subscription.default_payment_method),
      teamId: team.id,
    },
    create: {
      id: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0]?.price?.id ?? "",
      priceIds,
      currentPeriodEnd:   periodEnd   ? new Date(periodEnd   * 1000) : null,
      currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
      cancelAtPeriodEnd: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
      paymentMethod: JSON.stringify(subscription.default_payment_method),
      teamId: team.id,
    },
  });

  await TeamService.updateTeam(team.id, {
    plan: subscription.status === "canceled" ? "FREE" : nextPlan,
    isActive: subscription.status === "active",
  });

  logger.info(
    { teamId: team.id, plan: nextPlan, status: subscription.status },
    "[Billing]: syncStripeData complete"
  );

  if (shouldSendSubscriptionConfirmation) {
    try {
      const teamUsers = await TeamService.getTeamUsers(team.id);
      await Promise.all(
        teamUsers
          .map((tu) => tu.user?.email)
          .filter((email): email is string => Boolean(email))
          .map((email) => sendSubscriptionConfirmationEmail(email)),
      );
    } catch (err) {
      logger.error({ err, teamId: team.id }, "[Billing]: Failed sending subscription confirmation email");
    }
  }
}

/**
 * Handles a completed LIFETIME one-time payment checkout.
 * Sets the team's plan to LIFETIME permanently — no subscription involved.
 */
export async function syncLifetimePayment(customerId: string) {
  const team = await db.team.findUnique({ where: { stripeCustomerId: customerId } });

  if (!team) {
    logger.warn({ customerId }, "[Billing]: LIFETIME payment — team not found for customer");
    return;
  }

  if (team.plan === "LIFETIME") return;

  await TeamService.updateTeam(team.id, { plan: "LIFETIME", isActive: true });

  try {
    const teamUsers = await TeamService.getTeamUsers(team.id);
    await Promise.all(
      teamUsers
        .map((tu) => tu.user?.email)
        .filter((email): email is string => Boolean(email))
        .map((email) => sendSubscriptionConfirmationEmail(email)),
    );
  } catch (err) {
    logger.error({ err, teamId: team.id }, "[Billing]: Failed sending LIFETIME confirmation email");
  }
}

