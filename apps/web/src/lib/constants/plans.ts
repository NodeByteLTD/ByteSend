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
  }
> = {
  FREE: {
    emailsPerMonth: 5000,
    emailsPerDay: 250,
    domains: 3,
    contactBooks: 5,
    teamMembers: 5,
    webhooks: 3,
  },
  HOBBY: {
    emailsPerMonth: 15000,
    emailsPerDay: 500,
    domains: 5,
    contactBooks: 10,
    teamMembers: 10,
    webhooks: 5,
  },
  LITE: {
    emailsPerMonth: 50000,
    emailsPerDay: 2000,
    domains: 10,
    contactBooks: 25,
    teamMembers: 25,
    webhooks: 10,
  },
  BASIC: {
    emailsPerMonth: -1, // unlimited
    emailsPerDay: -1, // unlimited
    domains: 100,
    contactBooks: 500,
    teamMembers: 50,
    webhooks: 50,
  },
  LIFETIME: {
    emailsPerMonth: -1, // unlimited
    emailsPerDay: -1, // unlimited
    domains: 500,
    contactBooks: 1000,
    teamMembers: 200,
    webhooks: 100,
  },
};
