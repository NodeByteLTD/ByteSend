import { PLANS, getAllPlans } from "@bytesend/lib";

function fmt(n: number): string {
  if (!isFinite(n) || n === -1) return "Unlimited";
  return n.toLocaleString();
}

function buildPerks(plan: (typeof PLANS)[keyof typeof PLANS]): string[] {
  const l = plan.limits;
  const perks: string[] = [];

  // Email volume
  if (!isFinite(l.monthlyEmailLimit)) {
    perks.push("Unlimited emails — no overage charges");
  } else {
    const isHardCap = !plan.usageMetering && plan.plan !== "FREE";
    const suffix = plan.plan === "FREE" ? " (hard cap)" : " included";
    perks.push(`${fmt(l.monthlyEmailLimit)} emails / month${suffix}`);

    if (!isFinite(l.dailyEmailLimit)) {
      perks.push("Unlimited daily sending");
    } else {
      const dailySuffix = plan.plan === "FREE" ? " (hard cap)" : "";
      perks.push(`${fmt(l.dailyEmailLimit)} emails / day${dailySuffix}`);
    }
  }

  // Marketing
  if (!l.marketingEmailsIncluded) {
    perks.push("Marketing emails not available");
  } else if (plan.usageMetering) {
    const rate = plan.usageMetering.marketing.toFixed(2);
    perks.push(`Marketing CA$${rate}/ea (overage)`);
    if (plan.usageMetering.transactional !== plan.usageMetering.marketing) {
      const txRate = plan.usageMetering.transactional.toFixed(2);
      perks.push(`Transactional CA$${txRate}/ea (overage)`);
    }
  } else {
    perks.push("Marketing & transactional included");
  }

  // Domains
  if (l.additionalDomainRateCents > 0) {
    perks.push(`Up to ${fmt(l.maxDomains)} domains + $${l.additionalDomainRateCents / 100}/extra`);
  } else {
    perks.push(`Up to ${fmt(l.maxDomains)} domains`);
  }

  // Members
  if (!isFinite(l.maxTeamMembers)) {
    perks.push("Unlimited team members");
  } else {
    perks.push(`Up to ${l.maxTeamMembers} team members`);
  }

  // Support
  perks.push(l.prioritySupport ? "Priority support" : "Community support");

  // Analytics
  if (l.advancedAnalytics) perks.push("Advanced analytics");

  return perks;
}

export const PLAN_PERKS: Record<string, string[]> = Object.fromEntries(
  getAllPlans().map((plan) => [plan.plan, buildPerks(plan)]),
);
