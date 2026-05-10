import { Plan } from "@prisma/client";
import { PLANS } from "@bytesend/lib";

export enum LimitReason {
  DOMAIN = "DOMAIN",
  CONTACT_BOOK = "CONTACT_BOOK",
  CONTACTS = "CONTACTS",
  TEAM_MEMBER = "TEAM_MEMBER",
  WEBHOOK = "WEBHOOK",
  EMAIL_BLOCKED = "EMAIL_BLOCKED",
  EMAIL_DAILY_LIMIT_REACHED = "EMAIL_DAILY_LIMIT_REACHED",
  EMAIL_FREE_PLAN_MONTHLY_LIMIT_REACHED = "EMAIL_FREE_PLAN_MONTHLY_LIMIT_REACHED",
  MARKETING_NOT_AVAILABLE = "MARKETING_NOT_AVAILABLE",
}

export const PLAN_LIMITS: Record<
  Plan,
  {
    emailsPerMonth: number;
    emailsPerDay: number;
    domains: number;
    contactBooks: number;
    contacts: number;
    teamMembers: number;
    webhooks: number;
    /** Whether marketing/campaign emails are available on this plan. */
    marketingEmailsIncluded: boolean;
  }
> = {
  FREE: {
    emailsPerMonth: PLANS.FREE.limits.monthlyEmailLimit,
    emailsPerDay: PLANS.FREE.limits.dailyEmailLimit,   // Hard cap — must wait or upgrade
    domains: PLANS.FREE.limits.maxDomains,
    contactBooks: PLANS.FREE.limits.maxContactBooks,
    contacts: PLANS.FREE.limits.contactsLimit,         // Hard cap across all contact books
    teamMembers: PLANS.FREE.limits.maxTeamMembers,        // Hard cap — upgrade required
    webhooks: PLANS.FREE.limits.maxWebhooks,
    marketingEmailsIncluded: PLANS.FREE.limits.marketingEmailsIncluded, // Marketing emails blocked on free plan
  },
  HOBBY: {
    emailsPerMonth: PLANS.HOBBY.limits.monthlyEmailLimit, // Included; overage billed monthly
    emailsPerDay: -1, // Unlimited daily on paid plans
    domains: PLANS.HOBBY.limits.maxDomains,
    contactBooks: PLANS.HOBBY.limits.maxContactBooks,
    contacts: PLANS.HOBBY.limits.contactsLimit,
    teamMembers: PLANS.HOBBY.limits.maxTeamMembers,        // Hard cap — upgrade required
    webhooks: PLANS.HOBBY.limits.maxWebhooks,
    marketingEmailsIncluded: PLANS.HOBBY.limits.marketingEmailsIncluded,
  },
  LITE: {
    emailsPerMonth: PLANS.LITE.limits.monthlyEmailLimit, // Included; overage billed monthly
    emailsPerDay: -1, // Unlimited daily on paid plans
    domains: PLANS.LITE.limits.maxDomains,
    contactBooks: PLANS.LITE.limits.maxContactBooks,
    contacts: PLANS.LITE.limits.contactsLimit,
    teamMembers: PLANS.LITE.limits.maxTeamMembers,        // Hard cap — upgrade required
    webhooks: PLANS.LITE.limits.maxWebhooks,
    marketingEmailsIncluded: PLANS.LITE.limits.marketingEmailsIncluded,
  },
  BASIC: {
    emailsPerMonth: PLANS.BASIC.limits.monthlyEmailLimit, // Included; overage billed at CA$0.01/ea
    emailsPerDay: -1, // Unlimited daily
    domains: PLANS.BASIC.limits.maxDomains,
    contactBooks: PLANS.BASIC.limits.maxContactBooks,
    contacts: -1, // Unlimited
    teamMembers: -1, // Unlimited
    webhooks: PLANS.BASIC.limits.maxWebhooks,
    marketingEmailsIncluded: PLANS.BASIC.limits.marketingEmailsIncluded,
  },
  LIFETIME: {
    emailsPerMonth: -1, // Unlimited
    emailsPerDay: -1,  // Unlimited
    domains: PLANS.LIFETIME.limits.maxDomains,
    contactBooks: PLANS.LIFETIME.limits.maxContactBooks,
    contacts: -1, // Unlimited
    teamMembers: -1, // Unlimited
    webhooks: PLANS.LIFETIME.limits.maxWebhooks,
    marketingEmailsIncluded: PLANS.LIFETIME.limits.marketingEmailsIncluded,
  },
};
