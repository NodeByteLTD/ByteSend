import Stripe from "stripe";
import type { Plan } from "@prisma/client";
import { env } from "~/env";
import { db } from "../db";
import { sendSubscriptionConfirmationEmail } from "../mailer";
import { TeamService } from "../service/team-service";
import { logger } from "../logger/log";

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
  plan: CheckoutPlan = "BASIC"
) {
  const team = await db.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (team.isActive && team.plan !== "FREE") {
    throw new Error("Team is already active");
  }

  const stripe = getStripe();

  let customerId = team.stripeCustomerId;

  if (!customerId) {
    const customer = await createCustomerForTeam(teamId);
    customerId = customer.id;
  }

  if (plan === "LIFETIME") {
    if (!env.STRIPE_LIFETIME_PRICE_ID) {
      throw new Error("STRIPE_LIFETIME_PRICE_ID is not set");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price: env.STRIPE_LIFETIME_PRICE_ID, quantity: 1 }],
      success_url: `${env.NEXTAUTH_URL}/payments?success=true&plan=LIFETIME&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXTAUTH_URL}/settings/billing`,
      metadata: { teamId, plan },
      client_reference_id: teamId.toString(),
    });

    return session;
  }

  if (plan === "LITE") {
    if (!env.STRIPE_LITE_PRICE_ID) {
      throw new Error("STRIPE_LITE_PRICE_ID is not set");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        { price: env.STRIPE_LITE_PRICE_ID, quantity: 1 },
        ...(env.STRIPE_LITE_MARKETING_USAGE_PRICE_ID
          ? [{ price: env.STRIPE_LITE_MARKETING_USAGE_PRICE_ID }]
          : []),
        ...(env.STRIPE_LITE_TRANSACTIONAL_USAGE_PRICE_ID
          ? [{ price: env.STRIPE_LITE_TRANSACTIONAL_USAGE_PRICE_ID }]
          : []),
      ],
      success_url: `${env.NEXTAUTH_URL}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXTAUTH_URL}/settings/billing`,
      metadata: { teamId, plan },
      client_reference_id: teamId.toString(),
    });

    return session;
  }

  if (plan === "HOBBY") {
    if (!env.STRIPE_HOBBY_PRICE_ID) {
      throw new Error("STRIPE_HOBBY_PRICE_ID is not set");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        { price: env.STRIPE_HOBBY_PRICE_ID, quantity: 1 },
        ...(env.STRIPE_HOBBY_MARKETING_USAGE_PRICE_ID
          ? [{ price: env.STRIPE_HOBBY_MARKETING_USAGE_PRICE_ID }]
          : []),
        ...(env.STRIPE_HOBBY_TRANSACTIONAL_USAGE_PRICE_ID
          ? [{ price: env.STRIPE_HOBBY_TRANSACTIONAL_USAGE_PRICE_ID }]
          : []),
      ],
      success_url: `${env.NEXTAUTH_URL}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXTAUTH_URL}/settings/billing`,
      metadata: { teamId, plan },
      client_reference_id: teamId.toString(),
    });

    return session;
  }

  // BASIC: monthly flat-rate subscription
  if (!env.STRIPE_BASIC_PRICE_ID) {
    throw new Error("STRIPE_BASIC_PRICE_ID is not set");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      { price: env.STRIPE_BASIC_PRICE_ID, quantity: 1 },
    ],
    success_url: `${env.NEXTAUTH_URL}/payments?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.NEXTAUTH_URL}/settings/billing`,
    metadata: { teamId, plan },
    client_reference_id: teamId.toString(),
  });

  return session;
}

function getPlanFromPriceIds(priceIds: string[]): Plan {
  if (env.STRIPE_LIFETIME_PRICE_ID && priceIds.includes(env.STRIPE_LIFETIME_PRICE_ID)) {
    return "LIFETIME";
  }

  if (
    (env.STRIPE_BASIC_PRICE_ID && priceIds.includes(env.STRIPE_BASIC_PRICE_ID)) ||
    (env.STRIPE_LEGACY_BASIC_PRICE_ID &&
      priceIds.includes(env.STRIPE_LEGACY_BASIC_PRICE_ID))
  ) {
    return "BASIC";
  }

  if (env.STRIPE_LITE_PRICE_ID && priceIds.includes(env.STRIPE_LITE_PRICE_ID)) {
    return "LITE";
  }

  if (env.STRIPE_HOBBY_PRICE_ID && priceIds.includes(env.STRIPE_HOBBY_PRICE_ID)) {
    return "HOBBY";
  }

  return "FREE";
}

export async function getManageSessionUrl(teamId: number) {
  const team = await db.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (!team.stripeCustomerId) {
    throw new Error("Team has no Stripe customer ID");
  }

  const stripe = getStripe();

  const subscriptions = await stripe.billingPortal.sessions.create({
    customer: team.stripeCustomerId,
    return_url: `${env.NEXTAUTH_URL}`,
  });

  return subscriptions.url;
}

export async function syncStripeData(customerId: string) {
  const stripe = getStripe();

  const team = await db.team.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!team) {
    return;
  }

  const wasPaid = team.isActive && team.plan !== "FREE";

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
    status: "all",
    expand: ["data.default_payment_method"],
  });

  const subscription = subscriptions.data[0];

  if (!subscription) {
    return;
  }

  if (!subscription.items.data[0]) {
    return;
  }

  const priceIds = subscription.items.data
    .map((item) => item.price?.id)
    .filter((id): id is string => Boolean(id));

  const nextPlan = getPlanFromPriceIds(priceIds);
  const isNowPaid = subscription.status === "active" && nextPlan !== "FREE";
  const shouldSendSubscriptionConfirmation = !wasPaid && isNowPaid;

  await db.subscription.upsert({
    where: { id: subscription.id },
    update: {
      status: subscription.status,
      priceId: subscription.items.data[0]?.price?.id || "",
      priceIds: priceIds,
      currentPeriodEnd: new Date(
        subscription.items.data[0]?.current_period_end * 1000
      ),
      currentPeriodStart: new Date(
        subscription.items.data[0]?.current_period_start * 1000
      ),
      cancelAtPeriodEnd: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000)
        : null,
      paymentMethod: JSON.stringify(subscription.default_payment_method),
      teamId: team.id,
    },
    create: {
      id: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0]?.price?.id || "",
      priceIds: priceIds,
      currentPeriodEnd: new Date(
        subscription.items.data[0]?.current_period_end * 1000
      ),
      currentPeriodStart: new Date(
        subscription.items.data[0]?.current_period_start * 1000
      ),
      cancelAtPeriodEnd: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000)
        : null,
      paymentMethod: JSON.stringify(subscription.default_payment_method),
      teamId: team.id,
    },
  });

  await TeamService.updateTeam(team.id, {
    plan: subscription.status === "canceled" ? "FREE" : nextPlan,
    isActive: subscription.status === "active",
  });

  if (shouldSendSubscriptionConfirmation) {
    try {
      const teamUsers = await TeamService.getTeamUsers(team.id);
      await Promise.all(
        teamUsers
          .map((tu) => tu.user?.email)
          .filter((email): email is string => Boolean(email))
          .map((email) => sendSubscriptionConfirmationEmail(email))
      );
    } catch (err) {
      logger.error(
        { err, teamId: team.id },
        "[Billing]: Failed sending subscription confirmation email"
      );
    }
  }
}

/**
 * Handles a completed LIFETIME one-time payment checkout.
 * Sets the team's plan to LIFETIME permanently — no subscription involved.
 */
export async function syncLifetimePayment(customerId: string) {
  const team = await db.team.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!team) {
    logger.warn({ customerId }, "[Billing]: LIFETIME payment — team not found for customer");
    return;
  }

  if (team.plan === "LIFETIME") {
    return; // Already upgraded, nothing to do
  }

  await TeamService.updateTeam(team.id, {
    plan: "LIFETIME",
    isActive: true,
  });

  try {
    const teamUsers = await TeamService.getTeamUsers(team.id);
    await Promise.all(
      teamUsers
        .map((tu) => tu.user?.email)
        .filter((email): email is string => Boolean(email))
        .map((email) => sendSubscriptionConfirmationEmail(email))
    );
  } catch (err) {
    logger.error(
      { err, teamId: team.id },
      "[Billing]: Failed sending LIFETIME confirmation email"
    );
  }
}
