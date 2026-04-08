import { z } from "zod";

import {
  createTRPCRouter,
  teamProcedure,
  protectedProcedure,
  domainProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  createDomain,
  deleteDomain,
  getDomain,
  getDomains,
  updateDomain,
} from "~/server/service/domain-service";
import { sendEmail } from "~/server/service/email-service";
import { SesSettingsService } from "~/server/service/ses-settings-service";
import { env } from "~/env";

function isAdminOrFounder(email: string | null | undefined) {
  const adminEmails = [env.ADMIN_EMAIL, env.FOUNDER_EMAIL].filter(Boolean);
  return !!email && adminEmails.includes(email);
}

export const domainRouter = createTRPCRouter({
  getAvailableRegions: protectedProcedure.query(async () => {
    const settings = await SesSettingsService.getAllSettings();
    return settings.filter((s) => s.isActive).map((setting) => setting.region);
  }),

  createDomain: teamProcedure
    .input(z.object({ name: z.string(), region: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const allowReserved = isAdminOrFounder(ctx.session.user.email);
      return createDomain(
        ctx.team.id,
        input.name,
        input.region,
        ctx.team.sesTenantId ?? undefined,
        allowReserved,
      );
    }),

  startVerification: domainProcedure.mutation(async ({ ctx, input }) => {
    await ctx.db.domain.update({
      where: { id: input.id },
      data: { isVerifying: true },
    });
  }),

  domains: teamProcedure.query(async ({ ctx }) => {
    return getDomains(ctx.team.id);
  }),

  getDomain: domainProcedure.query(async ({ input, ctx }) => {
    return getDomain(input.id, ctx.team.id);
  }),

  updateDomain: domainProcedure
    .input(
      z.object({
        clickTracking: z.boolean().optional(),
        openTracking: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return updateDomain(input.id, {
        clickTracking: input.clickTracking,
        openTracking: input.openTracking,
      });
    }),

  deleteDomain: domainProcedure.mutation(async ({ input }) => {
    await deleteDomain(input.id);
    return { success: true };
  }),

  sendTestEmailFromDomain: domainProcedure.mutation(
    async ({
      ctx: {
        session: { user },
        team,
      },
      input,
    }) => {
      const domain = await db.domain.findFirst({
        where: { id: input.id, teamId: team.id },
      });

      if (!domain) {
        throw new Error("Domain not found");
      }

      if (!user.email) {
        throw new Error("User email not found");
      }

      return sendEmail({
        teamId: team.id,
        to: user.email,
        from: `hello@${domain.name}`,
        subject: "ByteSend test email",
        text: "hello,\n\nByteSend — email infrastructure that just works.\n\ncheck out https://bytesend.cloud",
        html: "<p>hello,</p><p>ByteSend — email infrastructure that just works.</p><p>check out <a href='https://bytesend.cloud'>bytesend.cloud</a></p>",
      });
    }
  ),
});
