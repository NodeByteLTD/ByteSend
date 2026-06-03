import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { sendEmailChangeVerificationEmail } from "~/server/mailer";
import {
  generateTwoFactorSecret,
  verifyTwoFactorToken,
} from "~/server/security/two-factor";
import {
  generateRecoveryCodes,
  hashRecoveryCode,
  verifyRecoveryCode,
} from "~/server/security/recovery-codes";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const b of bytes) token += chars[b % chars.length];
  return token;
}

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required").max(100),
        image: z.string().url("Must be a valid URL").optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name, image: input.image },
        select: { id: true, name: true, image: true },
      });
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        twoFactorEnabled: true,
        accounts: { select: { type: true, provider: true } },
      },
    });
  }),

  requestEmailChange: protectedProcedure
    .input(
      z.object({
        email: z.string().trim().toLowerCase().email("Must be a valid email"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const nextEmail = input.email.trim().toLowerCase();

      const currentUser = await db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { id: true, email: true },
      });

      if (!currentUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // Block OAuth users from changing email
      const oauthAccounts = await db.account.findMany({
        where: { userId: ctx.session.user.id, type: "oauth" },
        select: { provider: true },
      });
      if (oauthAccounts.length > 0) {
        const providers = oauthAccounts.map((a) => a.provider).join(", ");
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Email changes are not allowed for accounts linked to OAuth providers (${providers}). Sign in with email to manage your email address.`,
        });
      }

      const currentEmail = currentUser.email?.trim().toLowerCase() ?? null;
      if (currentEmail === nextEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That is already your current account email.",
        });
      }

      const existingUser = await db.user.findFirst({
        where: {
          email: {
            equals: nextEmail,
            mode: "insensitive",
          },
        },
        select: { id: true },
      });

      if (existingUser && existingUser.id !== currentUser.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That email is already in use by another account.",
        });
      }

      const code = generateCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await db.pendingEmailChange.upsert({
        where: {
          userId_newEmail: {
            userId: currentUser.id,
            newEmail: nextEmail,
          },
        },
        create: {
          userId: currentUser.id,
          newEmail: nextEmail,
          code,
          expiresAt,
        },
        update: {
          code,
          expiresAt,
        },
      });

      await sendEmailChangeVerificationEmail(nextEmail, code);

      return {
        sent: true,
        email: nextEmail,
        expiresAt,
      };
    }),

  confirmEmailChange: protectedProcedure
    .input(
      z.object({
        email: z.string().trim().toLowerCase().email("Must be a valid email"),
        code: z
          .string()
          .trim()
          .toUpperCase()
          .length(6, "Verification code must be 6 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const nextEmail = input.email.trim().toLowerCase();
      const code = input.code.trim().toUpperCase();

      const pending = await db.pendingEmailChange.findUnique({
        where: {
          userId_newEmail: {
            userId: ctx.session.user.id,
            newEmail: nextEmail,
          },
        },
      });

      if (!pending || pending.code !== code || pending.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or expired verification code.",
        });
      }

      const existingUser = await db.user.findFirst({
        where: {
          email: {
            equals: nextEmail,
            mode: "insensitive",
          },
          NOT: { id: ctx.session.user.id },
        },
        select: { id: true },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That email is already in use by another account.",
        });
      }

      const updated = await db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          email: nextEmail,
          emailVerified: new Date(),
        },
        select: { id: true, email: true, emailVerified: true },
      });

      await db.pendingEmailChange.delete({ where: { id: pending.id } });
      return updated;
    }),

  startTwoFactorSetup: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { email: true },
    });

    const email = user?.email?.trim().toLowerCase();
    if (!email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Add an account email before enabling 2FA.",
      });
    }

    const { secret, otpauthUrl } = generateTwoFactorSecret(email);

    await db.user.update({
      where: { id: ctx.session.user.id },
      data: { twoFactorTempSecret: secret },
    });

    return { secret, otpauthUrl };
  }),

  confirmTwoFactorSetup: protectedProcedure
    .input(
      z.object({
        code: z.string().trim().length(6, "Authentication code must be 6 digits"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { twoFactorTempSecret: true },
      });

      if (!user?.twoFactorTempSecret) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No 2FA setup in progress.",
        });
      }

      const valid = await verifyTwoFactorToken(input.code.trim(), user.twoFactorTempSecret);
      if (!valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid authentication code.",
        });
      }

      await db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          twoFactorEnabled: true,
          twoFactorSecret: user.twoFactorTempSecret,
          twoFactorTempSecret: null,
        },
      });

      // Generate fresh recovery codes
      const plainCodes = generateRecoveryCodes();
      await db.twoFactorRecoveryCode.deleteMany({ where: { userId: ctx.session.user.id } });
      await db.twoFactorRecoveryCode.createMany({
        data: plainCodes.map((code) => ({
          userId: ctx.session.user.id,
          codeHash: hashRecoveryCode(code),
        })),
      });

      return { enabled: true, recoveryCodes: plainCodes };
    }),

  useRecoveryCode: protectedProcedure
    .input(
      z.object({
        code: z.string().trim().toUpperCase(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const unusedCodes = await db.twoFactorRecoveryCode.findMany({
        where: { userId: ctx.session.user.id, used: false },
      });

      const match = unusedCodes.find((row) => verifyRecoveryCode(input.code, row.codeHash));

      if (!match) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or already-used recovery code.",
        });
      }

      await db.twoFactorRecoveryCode.update({
        where: { id: match.id },
        data: { used: true, usedAt: new Date() },
      });

      const remaining = unusedCodes.length - 1;
      return { verified: true, remaining };
    }),

  getRecoveryCodeCount: protectedProcedure.query(async ({ ctx }) => {
    const count = await db.twoFactorRecoveryCode.count({
      where: { userId: ctx.session.user.id, used: false },
    });
    return { remaining: count };
  }),

  regenerateRecoveryCodes: protectedProcedure
    .input(
      z.object({
        code: z.string().trim().length(6, "Authentication code must be 6 digits"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { twoFactorEnabled: true, twoFactorSecret: true },
      });

      if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "2FA is not enabled." });
      }

      const valid = await verifyTwoFactorToken(input.code.trim(), user.twoFactorSecret);
      if (!valid) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid authentication code." });
      }

      const plainCodes = generateRecoveryCodes();
      await db.twoFactorRecoveryCode.deleteMany({ where: { userId: ctx.session.user.id } });
      await db.twoFactorRecoveryCode.createMany({
        data: plainCodes.map((code) => ({
          userId: ctx.session.user.id,
          codeHash: hashRecoveryCode(code),
        })),
      });

      return { recoveryCodes: plainCodes };
    }),

  disableTwoFactor: protectedProcedure
    .input(
      z.object({
        code: z.string().trim().length(6, "Authentication code must be 6 digits"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { twoFactorEnabled: true, twoFactorSecret: true },
      });

      if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Two-factor authentication is not enabled.",
        });
      }

      const valid = await verifyTwoFactorToken(input.code.trim(), user.twoFactorSecret);
      if (!valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid authentication code.",
        });
      }

      await db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
          twoFactorTempSecret: null,
        },
      });

      return { enabled: false };
    }),

  verifyTwoFactorCode: protectedProcedure
    .input(
      z.object({
        code: z.string().trim().length(6, "Authentication code must be 6 digits"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { twoFactorEnabled: true, twoFactorSecret: true },
      });

      if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
        return { verified: true };
      }

      const valid = await verifyTwoFactorToken(input.code.trim(), user.twoFactorSecret);
      if (!valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid authentication code.",
        });
      }

      return { verified: true };
    }),
});
