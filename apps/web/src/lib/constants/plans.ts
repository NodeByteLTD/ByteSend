import { Plan } from "@prisma/client";

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
    emailsPerMonth: 12_500,
    emailsPerDay: 5_000,   // Hard cap — must wait or upgrade
    domains: 2,
    contactBooks: 5,
    contacts: 100,         // Hard cap across all contact books
    teamMembers: 5,        // Hard cap — upgrade required
    webhooks: 3,
    marketingEmailsIncluded: false, // Marketing emails blocked on free plan
  },
  HOBBY: {
    emailsPerMonth: 25_000, // Included; overage billed at CA$0.05 marketing / CA$0.03 transactional
    emailsPerDay: 12_500,
    domains: 4,
    contactBooks: 10,
    contacts: 200,
    teamMembers: 10,        // Hard cap — upgrade required
    webhooks: 5,
    marketingEmailsIncluded: true,
  },
  LITE: {
    emailsPerMonth: 50_000, // Included; overage billed at CA$0.02/ea
    emailsPerDay: 25_000,
    domains: 6,
    contactBooks: 25,
    contacts: 300,
    teamMembers: 15,        // Hard cap — upgrade required
    webhooks: 10,
    marketingEmailsIncluded: true,
  },
  BASIC: {
    emailsPerMonth: 150_000, // Included; overage billed at CA$0.01/ea
    emailsPerDay: -1, // Unlimited daily
    domains: 100,
    contactBooks: 500,
    contacts: -1, // Unlimited
    teamMembers: -1, // Unlimited
    webhooks: 50,
    marketingEmailsIncluded: true,
  },
  LIFETIME: {
    emailsPerMonth: -1, // Unlimited
    emailsPerDay: -1,  // Unlimited
    domains: 500,
    contactBooks: 1000,
    contacts: -1, // Unlimited
    teamMembers: -1, // Unlimited
    webhooks: 100,
    marketingEmailsIncluded: true,
  },
};
