import { Prisma, type Plan } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, adminProcedure, founderProcedure } from "~/server/api/trpc";
import { SesSettingsService } from "~/server/service/ses-settings-service";
import { getAccount } from "~/server/aws/ses";
import { db } from "~/server/db";
import { sendMail } from "~/server/mailer";
import { logger } from "~/server/logger/log";
import { ByteSend } from "bytesend-js";
import { isCloud } from "~/utils/common";
import { toPlainHtml } from "~/server/utils/email-content";
import { Target } from "lucide-react";

const userAdminSelection = {
  id: true,
  email: true,
  name: true,
  isBetaUser: true,
  isAdmin: true,
  isBanned: true,
  createdAt: true,
} as const;

function formatDisplayNameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? email;
  const pieces = localPart.split(/[._-]+/).filter(Boolean);
  if (pieces.length === 0) {
    return localPart;
  }
  return pieces
    .map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1))
    .join(" ");
}

const teamAdminSelection = {
  id: true,
  name: true,
  plan: true,
  apiRateLimit: true,
  dailyEmailLimit: true,
  isBlocked: true,
  billingEmail: true,
  createdAt: true,
  teamUsers: {
    select: {
      role: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  },
  domains: {
    select: {
      id: true,
      name: true,
      status: true,
      isVerifying: true,
    },
  },
} as const;

const adminDomainSelection = {
  id: true,
  name: true,
  status: true,
  region: true,
  clickTracking: true,
  openTracking: true,
  isVerifying: true,
  createdAt: true,
  team: {
    select: {
      id: true,
      name: true,
      plan: true,
      isBlocked: true,
    },
  },
} as const;

const adminWebhookSelection = {
  id: true,
  url: true,
  status: true,
  eventTypes: true,
  domainIds: true,
  consecutiveFailures: true,
  lastFailureAt: true,
  lastSuccessAt: true,
  createdAt: true,
  team: {
    select: {
      id: true,
      name: true,
      plan: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
} as const;

export const adminRouter = createTRPCRouter({
  getSesSettings: adminProcedure.query(async () => {
    return SesSettingsService.getAllSettings();
  }),

  getQuotaForRegion: adminProcedure
    .input(
      z.object({
        region: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const acc = await getAccount(input.region);
      return acc.SendQuota?.MaxSendRate;
    }),

  addSesSettings: adminProcedure
    .input(
      z.object({
        region: z.string(),
        bytesendUrl: z.string().url(),
        sendRate: z.number(),
        transactionalQuota: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return SesSettingsService.createSesSetting({
        region: input.region,
        bytesendUrl: input.bytesendUrl,
        sendingRateLimit: input.sendRate,
        transactionalQuota: input.transactionalQuota,
      });
    }),

  updateSesSettings: adminProcedure
    .input(
      z.object({
        settingsId: z.string(),
        sendRate: z.number(),
        transactionalQuota: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return SesSettingsService.updateSesSetting({
        id: input.settingsId,
        sendingRateLimit: input.sendRate,
        transactionalQuota: input.transactionalQuota,
      });
    }),

  deleteSesSettings: adminProcedure
    .input(z.object({ settingsId: z.string() }))
    .mutation(async ({ input }) => {
      return SesSettingsService.deleteSesSetting(input.settingsId);
    }),

  toggleSesSettingsActive: adminProcedure
    .input(z.object({ settingsId: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      return SesSettingsService.toggleSesSettingActive(input.settingsId, input.isActive);
    }),

  getSetting: adminProcedure
    .input(
      z.object({
        region: z.string().optional().nullable(),
      }),
    )
    .query(async ({ input }) => {
      return SesSettingsService.getSetting(
        input.region ?? env.AWS_DEFAULT_REGION,
      );
    }),

  findUserByEmail: adminProcedure
    .input(
      z.object({
        email: z
          .string()
          .email()
          .transform((value) => value.toLowerCase()),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { email: input.email },
        select: userAdminSelection,
      });

      return user ?? null;
    }),

  updateUserBeta: founderProcedure
    .input(
      z.object({
        userId: z.number(),
        isBetaUser: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({
        where: { id: input.userId },
        select: userAdminSelection,
      });

      if (!user) {
        throw new Error("User not found");
      }

      return db.user.update({
        where: { id: input.userId },
        data: { isBetaUser: input.isBetaUser },
        select: userAdminSelection,
      });
    }),

  setUserAdmin: founderProcedure
    .input(
      z.object({
        userId: z.number(),
        isAdmin: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Prevent the founder from removing their own admin (safety guard)
      const target = await db.user.findUnique({
        where: { id: input.userId },
        select: { id: true, email: true },
      });

      if (!target) {
        throw new Error("User not found");
      }

      if (target.email === env.FOUNDER_EMAIL) {
        throw new Error("Cannot modify the founder's admin status");
      }

      return db.user.update({
        where: { id: input.userId },
        data: { isAdmin: input.isAdmin },
        select: userAdminSelection,
      });
    }),

  banUser: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        isBanned: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const target = await db.user.findUnique({
        where: { id: input.userId },
        select: { id: true, email: true },
      });

      if (!target) {
        throw new Error("User not found");
      }

      if (target.email === env.FOUNDER_EMAIL) {
        throw new Error("Cannot ban the founder account");
      }

      return db.user.update({
        where: { id: input.userId },
        data: { isBanned: input.isBanned },
        select: userAdminSelection,
      });
    }),

  listUsers: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
        query: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, query } = input;
      const skip = (page - 1) * pageSize;

      const where: Prisma.UserWhereInput = query
        ? {
            OR: [
              { email: { contains: query, mode: "insensitive" } },
              { name: { contains: query, mode: "insensitive" } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        db.user.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
          select: userAdminSelection,
        }),
        db.user.count({ where }),
      ]);

      return { users, total, page, pageSize };
    }),

  findTeam: adminProcedure
    .input(
      z.object({
        query: z
          .string({ required_error: "Search query is required" })
          .trim()
          .min(1, "Search query is required"),
      }),
    )
    .mutation(async ({ input }) => {
      const query = input.query.trim();

      let numericId: number | null = null;
      if (/^\d+$/.test(query)) {
        numericId = Number(query);
      }

      let team = numericId
        ? await db.team.findUnique({
            where: { id: numericId },
            select: teamAdminSelection,
          })
        : null;

      if (!team) {
        team = await db.team.findFirst({
          where: {
            OR: [
              { name: { equals: query, mode: "insensitive" } },
              { billingEmail: { equals: query, mode: "insensitive" } },
              {
                teamUsers: {
                  some: {
                    user: {
                      email: { equals: query, mode: "insensitive" },
                    },
                  },
                },
              },
              {
                domains: {
                  some: {
                    name: { equals: query, mode: "insensitive" },
                  },
                },
              },
              {
                subscription: {
                  some: {
                    id: { equals: query, mode: "insensitive" },
                  },
                },
              },
            ],
          },
          select: teamAdminSelection,
        });
      }

      return team ?? null;
    }),

  listTeams: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
        query: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, query } = input;
      const skip = (page - 1) * pageSize;

      const where: Prisma.TeamWhereInput = query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { billingEmail: { contains: query, mode: "insensitive" } },
              {
                teamUsers: {
                  some: {
                    user: { email: { contains: query, mode: "insensitive" } },
                  },
                },
              },
            ],
          }
        : {};

      const [teams, total] = await Promise.all([
        db.team.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
          select: teamAdminSelection,
        }),
        db.team.count({ where }),
      ]);

      return { teams, total, page, pageSize };
    }),

  updateTeamSettings: adminProcedure
    .input(
      z.object({
        teamId: z.number(),
        apiRateLimit: z.number().int().min(1).max(10_000),
        dailyEmailLimit: z.number().int().min(0).max(10_000_000),
        isBlocked: z.boolean(),
        plan: z.enum(["FREE", "HOBBY", "LITE", "BASIC", "LIFETIME"]),
      }),
    )
    .mutation(async ({ input }) => {
      const { teamId, ...data } = input;

      const updatedTeam = await db.team.update({
        where: { id: teamId },
        data,
        select: teamAdminSelection,
      });

      return updatedTeam;
    }),

  listAdminDomains: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
        query: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, query } = input;
      const skip = (page - 1) * pageSize;

      const where: Prisma.DomainWhereInput = query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { region: { contains: query, mode: "insensitive" } },
              { team: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {};

      const [domains, total] = await Promise.all([
        db.domain.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
          select: adminDomainSelection,
        }),
        db.domain.count({ where }),
      ]);

      return { domains, total, page, pageSize };
    }),

  listAdminWebhooks: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
        query: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, query } = input;
      const skip = (page - 1) * pageSize;

      const where: Prisma.WebhookWhereInput = query
        ? {
            OR: [
              { url: { contains: query, mode: "insensitive" } },
              { team: { name: { contains: query, mode: "insensitive" } } },
              { createdBy: { email: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {};

      const [webhooks, total] = await Promise.all([
        db.webhook.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
          select: adminWebhookSelection,
        }),
        db.webhook.count({ where }),
      ]);

      return { webhooks, total, page, pageSize };
    }),

  listAdminBilling: adminProcedure
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        pageSize: z.number().int().min(1).max(100).default(20),
        query: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, pageSize, query } = input;
      const skip = (page - 1) * pageSize;

      const where: Prisma.TeamWhereInput = query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { billingEmail: { contains: query, mode: "insensitive" } },
              { stripeCustomerId: { contains: query, mode: "insensitive" } },
              {
                subscription: {
                  some: {
                    id: { contains: query, mode: "insensitive" },
                  },
                },
              },
            ],
          }
        : {};

      const [teams, total] = await Promise.all([
        db.team.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            plan: true,
            isActive: true,
            isBlocked: true,
            billingEmail: true,
            stripeCustomerId: true,
            createdAt: true,
            subscription: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: {
                id: true,
                status: true,
                currentPeriodStart: true,
                currentPeriodEnd: true,
                cancelAtPeriodEnd: true,
                createdAt: true,
              },
            },
          },
        }),
        db.team.count({ where }),
      ]);

      return { teams, total, page, pageSize };
    }),

  getEmailAnalytics: adminProcedure
    .input(
      z.object({
        timeframe: z.enum(["today", "thisMonth"]),
        paidOnly: z.boolean().optional(),
      }),
    )
    .query(async ({ input }) => {
      const timeframe = input.timeframe;
      const paidOnly = input.paidOnly ?? false;

      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const monthStartDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
      );
      const monthStart = monthStartDate.toISOString().slice(0, 10);

      type EmailAnalyticsRow = {
        teamId: number;
        name: string;
        plan: Plan;
        sent: number;
        delivered: number;
        opened: number;
        clicked: number;
        bounced: number;
        complained: number;
        hardBounced: number;
      };

      const rows = await db.$queryRaw<Array<EmailAnalyticsRow>>`
        SELECT
          d."teamId" AS "teamId",
          t."name" AS name,
          t."plan" AS plan,
          SUM(d.sent)::integer AS sent,
          SUM(d.delivered)::integer AS delivered,
          SUM(d.opened)::integer AS opened,
          SUM(d.clicked)::integer AS clicked,
          SUM(d.bounced)::integer AS bounced,
          SUM(d.complained)::integer AS complained,
          SUM(d."hardBounced")::integer AS "hardBounced"
        FROM "DailyEmailUsage" d
        INNER JOIN "Team" t ON t.id = d."teamId"
        WHERE 1 = 1
        ${
          timeframe === "today"
            ? Prisma.sql`AND d."date" = ${today}`
            : Prisma.sql`AND d."date" >= ${monthStart}`
        }
        ${paidOnly ? Prisma.sql`AND t."plan" = 'BASIC'` : Prisma.sql``}
        GROUP BY d."teamId", t."name", t."plan"
        ORDER BY sent DESC
      `;

      const totals = rows.reduce(
        (acc, row) => {
          acc.sent += row.sent;
          acc.delivered += row.delivered;
          acc.opened += row.opened;
          acc.clicked += row.clicked;
          acc.bounced += row.bounced;
          acc.complained += row.complained;
          acc.hardBounced += row.hardBounced;
          return acc;
        },
        {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          complained: 0,
          hardBounced: 0,
        },
      );

      return {
        rows,
        totals,
        timeframe,
        paidOnly,
        periodStart: timeframe === "today" ? today : monthStart,
      };
    }),
});
