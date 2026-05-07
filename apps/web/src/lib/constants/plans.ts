import { Plan } from "@prisma/client";

export enum LimitReason {
  DOMAIN = "DOMAIN",
  CONTACT_BOOK = "CONTACT_BOOK",
  TEAM_MEMBER = "TEAM_MEMBER",
  WEBHOOK = "WEBHOOK",
  EMAIL_BLOCKED = "EMAIL_BLOCKED",
  EMAIL_DAILY_LIMIT_REACHED = "EMAIL_DAILY_LIMIT_REACHED",
  EMAIL_FREE_PLAN_MONTHLY_LIMIT_REACHED = "EMAIL_FREE_PLAN_MONTHLY_LIMIT_REACHED",
}

export const PLAN_LIMITS: Record<
  Plan,
  {
    emailsPerMonth: number;
    emailsPerDay: number;
    domains: number;
    contactBooks: number;
    teamMembers: number;
    webhooks: number;
    /** Whether marketing/campaign emails are available on this plan. */
    marketingEmailsIncluded: boolean;
  }
> = {
  FREE: {
    emailsPerMonth: 5000,
    emailsPerDay: 1000, // Hard cap — must wait or upgrade
    domains: 3,
    contactBooks: 5,
    teamMembers: 5, // Hard cap
    webhooks: 3,
    marketingEmailsIncluded: false, // Marketing emails blocked on free plan
  },
  HOBBY: {
    emailsPerMonth: 15000, // Included; overage billed at CA$0.05 marketing / CA$0.03 transactional
    emailsPerDay: 2000,
    domains: 5,
    contactBooks: 10,
    teamMembers: 30,
    webhooks: 5,
    marketingEmailsIncluded: true,
  },
  LITE: {
    emailsPerMonth: 50000, // Included; overage billed at CA$0.02/ea
    emailsPerDay: 5000,
    domains: 10,
    contactBooks: 25,
    teamMembers: 60,
    webhooks: 10,
    marketingEmailsIncluded: true,
  },
  BASIC: {
    emailsPerMonth: 150000, // Included; overage billed at CA$0.01/ea
    emailsPerDay: -1, // Unlimited daily
    domains: 100,
    contactBooks: 500,
    teamMembers: -1, // Unlimited
    webhooks: 50,
    marketingEmailsIncluded: true,
  },
  LIFETIME: {
    emailsPerMonth: -1, // Unlimited
    emailsPerDay: -1, // Unlimited
    domains: 500,
    contactBooks: 1000,
    teamMembers: -1, // Unlimited
    webhooks: 100,
    marketingEmailsIncluded: true,
  },
};
