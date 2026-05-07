import { EmailUsageType, Plan, Subscription } from "@prisma/client";
import { PLANS, PlanType } from "@bytesend/lib";

/**
 * Get the per-email usage rate for a specific plan and email type.
 * Returns the rate in CAD per email.
 * Plans without usageMetering (BASIC, LIFETIME) return 0 — usage is included.
 */
export function getUsageRate(
  plan: PlanType,
  type: EmailUsageType
): number {
  const planData = PLANS[plan];
  if (!planData.usageMetering) return 0;
  return type === EmailUsageType.MARKETING
    ? planData.usageMetering.marketing
    : planData.usageMetering.transactional;
}

/**
 * Default fallback rates (matches LITE plan)
 */
export const USAGE_UNIT_PRICE: Record<EmailUsageType, number> = {
  [EmailUsageType.MARKETING]: PLANS.LITE.usageMetering!.marketing,
  [EmailUsageType.TRANSACTIONAL]: PLANS.LITE.usageMetering!.transactional,
};

/**
 * Unit price for cost calculations (marketing rate from LITE)
 */
export const UNIT_PRICE = PLANS.LITE.usageMetering!.marketing;

export const TRANSACTIONAL_UNIT_CONVERSION =
  UNIT_PRICE / USAGE_UNIT_PRICE[EmailUsageType.TRANSACTIONAL];

/**
 * Number of credits per plan
 * Credits are the units of measurement for email sending capacity.
 * Each plan comes with a specific number of credits that can be used for sending emails.
 * Marketing emails consume 1 credit per email, while transactional emails consume 0.25 credits per email.
 */
export const PLAN_CREDIT_UNITS = {
  [Plan.BASIC]: 5_000,
};

/**
 * Gets timestamp for usage reporting, set to yesterday's date
 * Converts to Unix timestamp (seconds since epoch)
 * @returns Unix timestamp in seconds for yesterday's date
 */
export function getUsageTimestamp() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return Math.floor(yesterday.getTime() / 1000);
}

/**
 * Gets yesterday's date in YYYY-MM-DD format
 * @returns Yesterday's date string in YYYY-MM-DD format
 */
export function getUsageDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isoString = yesterday.toISOString();
  return isoString.split("T")[0] as string;
}

/**
 * Calculates total usage units based on marketing and transaction emails

 * @param marketingUsage Number of marketing emails sent
 * @param transactionUsage Number of transaction emails sent
 * @returns Total usage units rounded down to nearest integer
 */
export function getUsageUnits(
  marketingUsage: number,
  transactionUsage: number,
) {
  return (
    marketingUsage +
    Math.floor(transactionUsage / TRANSACTIONAL_UNIT_CONVERSION)
  );
}

export function getCost(usage: number, type: EmailUsageType) {
  const calculatedUsage =
    type === EmailUsageType.MARKETING
      ? usage
      : Math.floor(usage / TRANSACTIONAL_UNIT_CONVERSION);

  return calculatedUsage * UNIT_PRICE;
}
