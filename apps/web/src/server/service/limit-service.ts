import { PLAN_LIMITS, LimitReason } from "~/lib/constants/plans";
import { env } from "~/env";
import { getThisMonthUsage } from "./usage-service";
import { TeamService } from "./team-service";
import { withCache } from "../redis";
import { db } from "../db";
import { logger } from "../logger/log";
import { Plan } from "@prisma/client";

function isLimitExceeded(current: number, limit: number): boolean {
  if (limit === -1) return false; // unlimited
  return current >= limit;
}

function getActivePlan(team: { plan: Plan; isActive: boolean }): Plan {
  return team.isActive ? team.plan : "FREE";
}

export class LimitService {
  /**
   * Returns true if the team has the admin or founder as a member.
   * These teams are exempt from all limits.
   */
  private static async isAdminOrFounderTeam(teamId: number): Promise<boolean> {
    const adminEmails = [env.ADMIN_EMAIL, env.FOUNDER_EMAIL].filter(Boolean) as string[];
    if (adminEmails.length === 0) return false;
    const count = await db.teamUser.count({
      where: {
        teamId,
        user: { email: { in: adminEmails } },
      },
    });
    return count > 0;
  }

  static async checkDomainLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    currentCount: number;
    reason?: LimitReason;
  }> {
    // Limits only apply in cloud mode
    if (!env.NEXT_PUBLIC_IS_CLOUD) {
      return { isLimitReached: false, limit: -1, currentCount: 0 };
    }

    const team = await TeamService.getTeamCached(teamId);
    const currentCount = await db.domain.count({ where: { teamId } });

    const baseDomainLimit = PLAN_LIMITS[getActivePlan(team)].domains;
    // Extra domain slots purchasable as add-on (not available on FREE — hard cap)
    const extraSlots = getActivePlan(team) !== "FREE" ? (team.extraDomainSlots ?? 0) : 0;
    const limit = baseDomainLimit === -1 ? -1 : baseDomainLimit + extraSlots;
    if (isLimitExceeded(currentCount, limit)) {
      return {
        isLimitReached: true,
        limit,
        currentCount,
        reason: LimitReason.DOMAIN,
      };
    }

    return {
      isLimitReached: false,
      limit,
      currentCount,
    };
  }

  static async checkContactsLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    currentCount: number;
    reason?: LimitReason;
  }> {
    // Limits only apply in cloud mode
    if (!env.NEXT_PUBLIC_IS_CLOUD) {
      return { isLimitReached: false, limit: -1, currentCount: 0 };
    }

    const team = await TeamService.getTeamCached(teamId);
    const currentCount = await db.contact.count({
      where: { contactBook: { teamId } },
    });

    const limit = PLAN_LIMITS[getActivePlan(team)].contacts;
    if (isLimitExceeded(currentCount, limit)) {
      return {
        isLimitReached: true,
        limit,
        currentCount,
        reason: LimitReason.CONTACTS,
      };
    }

    return { isLimitReached: false, limit, currentCount };
  }

  static async checkContactBookLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    reason?: LimitReason;
  }> {
    // Limits only apply in cloud mode
    if (!env.NEXT_PUBLIC_IS_CLOUD) {
      return { isLimitReached: false, limit: -1, currentCount: 0 };
    }

    const team = await TeamService.getTeamCached(teamId);
    const currentCount = await db.contactBook.count({ where: { teamId } });

    const limit = PLAN_LIMITS[getActivePlan(team)].contactBooks;
    if (isLimitExceeded(currentCount, limit)) {
      return {
        isLimitReached: true,
        limit,
        reason: LimitReason.CONTACT_BOOK,
      };
    }

    return {
      isLimitReached: false,
      limit,
    };
  }

  static async checkTeamMemberLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    currentCount: number;
    reason?: LimitReason;
  }> {
    // Limits only apply in cloud mode
    if (!env.NEXT_PUBLIC_IS_CLOUD) {
      return { isLimitReached: false, limit: -1, currentCount: 0 };
    }

    const team = await TeamService.getTeamCached(teamId);
    const currentCount = await db.teamUser.count({ where: { teamId } });

    const baseMemberLimit = PLAN_LIMITS[getActivePlan(team)].teamMembers;
    const extraSlots = team.extraMemberSlots ?? 0;
    const limit = baseMemberLimit === -1 ? -1 : baseMemberLimit + extraSlots;
    if (isLimitExceeded(currentCount, limit)) {
      return {
        isLimitReached: true,
        limit,
        currentCount,
        reason: LimitReason.TEAM_MEMBER,
      };
    }

    return {
      isLimitReached: false,
      limit,
      currentCount,
    };
  }

  static async checkWebhookLimit(teamId: number): Promise<{
    isLimitReached: boolean;
    limit: number;
    currentCount: number;
    reason?: LimitReason;
  }> {
    // Limits only apply in cloud mode
    if (!env.NEXT_PUBLIC_IS_CLOUD) {
      return { isLimitReached: false, limit: -1, currentCount: 0 };
    }

    const team = await TeamService.getTeamCached(teamId);
    const currentCount = await db.webhook.count({
      where: { teamId },
    });

    const limit = PLAN_LIMITS[getActivePlan(team)].webhooks;
    if (isLimitExceeded(currentCount, limit)) {
      return {
        isLimitReached: true,
        limit,
        currentCount,
        reason: LimitReason.WEBHOOK,
      };
    }

    return {
      isLimitReached: false,
      limit,
      currentCount,
    };
  }

  // Checks email sending limits and also triggers usage notifications.
  // Side effects:
  // - Sends "warning" emails when nearing daily/monthly limits (rate-limited in TeamService)
  // - Sends "limit reached" notifications when limits are exceeded (rate-limited in TeamService)
  // - Teams with inactive subscriptions are treated like FREE plans for monthly limit alerts
  static async checkEmailLimit(
    teamId: number,
    emailType?: "MARKETING" | "TRANSACTIONAL",
  ): Promise<{
    isLimitReached: boolean;
    limit: number;
    reason?: LimitReason;
    available?: number;
  }> {
    // Limits only apply in cloud mode
    if (!env.NEXT_PUBLIC_IS_CLOUD) {
      return { isLimitReached: false, limit: -1 };
    }

    // Admin/founder teams have no limits
    if (await LimitService.isAdminOrFounderTeam(teamId)) {
      return { isLimitReached: false, limit: -1 };
    }

    const team = await TeamService.getTeamCached(teamId);

    // In cloud, enforce verification and block flags first
    if (team.isBlocked) {
      return {
        isLimitReached: true,
        limit: 0,
        reason: LimitReason.EMAIL_BLOCKED,
      };
    }

    const activePlan = getActivePlan(team);

    // Block marketing emails on plans where they are not available (e.g. FREE)
    if (
      emailType === "MARKETING" &&
      !PLAN_LIMITS[activePlan].marketingEmailsIncluded
    ) {
      return {
        isLimitReached: true,
        limit: 0,
        reason: LimitReason.EMAIL_BLOCKED,
      };
    }

    // Enforce daily sending limit (team-specific)
    const usage = await withCache(
      `usage:this-month:${teamId}`,
      () => getThisMonthUsage(teamId),
      { ttlSeconds: 60 },
    );

    const dailyUsage = usage.day.reduce((acc, curr) => acc + curr.sent, 0);
    const dailyLimit = PLAN_LIMITS[activePlan].emailsPerDay;

    logger.info(
      { dailyUsage, dailyLimit, team },
      `[LimitService]: Daily usage and limit`,
    );

    if (isLimitExceeded(dailyUsage, dailyLimit)) {
      // Notify: daily limit reached
      try {
        await TeamService.maybeNotifyEmailLimitReached(
          teamId,
          dailyLimit,
          LimitReason.EMAIL_DAILY_LIMIT_REACHED,
        );
      } catch (e) {
        logger.warn(
          { err: e },
          "Failed to send daily limit reached notification",
        );
      }

      return {
        isLimitReached: true,
        limit: dailyLimit,
        reason: LimitReason.EMAIL_DAILY_LIMIT_REACHED,
        available: dailyLimit - dailyUsage,
      };
    }

    // Apply monthly limit logic for FREE plan or inactive subscriptions
    if (getActivePlan(team) === "FREE") {
      const monthlyUsage = usage.month.reduce(
        (acc, curr) => acc + curr.sent,
        0,
      );
      // Use FREE plan limits for inactive subscriptions
      const monthlyLimit = PLAN_LIMITS.FREE.emailsPerMonth;

      logger.info(
        { monthlyUsage, monthlyLimit, team, isActive: team.isActive },
        `[LimitService]: Monthly usage and limit (FREE plan or inactive subscription)`,
      );

      if (monthlyUsage / monthlyLimit > 0.8 && monthlyUsage < monthlyLimit) {
        await TeamService.sendWarningEmail(
          teamId,
          monthlyUsage,
          monthlyLimit,
          LimitReason.EMAIL_FREE_PLAN_MONTHLY_LIMIT_REACHED,
        );
      }

      logger.info(
        { monthlyUsage, monthlyLimit, team, isActive: team.isActive },
        `[LimitService]: Monthly usage and limit (FREE plan or inactive subscription)`,
      );

      if (isLimitExceeded(monthlyUsage, monthlyLimit)) {
        // Notify: monthly (free plan or inactive subscription) limit reached
        try {
          await TeamService.maybeNotifyEmailLimitReached(
            teamId,
            monthlyLimit,
            LimitReason.EMAIL_FREE_PLAN_MONTHLY_LIMIT_REACHED,
          );
        } catch (e) {
          logger.warn(
            { err: e },
            "Failed to send monthly limit reached notification",
          );
        }

        return {
          isLimitReached: true,
          limit: monthlyLimit,
          reason: LimitReason.EMAIL_FREE_PLAN_MONTHLY_LIMIT_REACHED,
          available: monthlyLimit - monthlyUsage,
        };
      }
    }

    // Warn: nearing daily limit (e.g., < 20% available)
    if (
      dailyLimit !== -1 &&
      dailyLimit > 0 &&
      dailyLimit - dailyUsage > 0 &&
      (dailyLimit - dailyUsage) / dailyLimit < 0.2
    ) {
      try {
        await TeamService.sendWarningEmail(
          teamId,
          dailyUsage,
          dailyLimit,
          LimitReason.EMAIL_DAILY_LIMIT_REACHED,
        );
      } catch (e) {
        logger.warn({ err: e }, "Failed to send daily warning email");
      }
    }

    return {
      isLimitReached: false,
      limit: dailyLimit,
      available: dailyLimit - dailyUsage,
    };
  }

  /**
   * Returns true if the team's active plan includes marketing/campaign emails.
   * No side effects — safe to call at request time without triggering notifications.
   * Admin/founder teams and self-hosted instances are always allowed.
   */
  static async checkMarketingAccess(teamId: number): Promise<boolean> {
    if (!env.NEXT_PUBLIC_IS_CLOUD) return true;
    if (await LimitService.isAdminOrFounderTeam(teamId)) return true;
    const team = await TeamService.getTeamCached(teamId);
    return PLAN_LIMITS[getActivePlan(team)].marketingEmailsIncluded;
  }

}
