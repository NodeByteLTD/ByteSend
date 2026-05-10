import { z } from "zod";
import { createTRPCRouter, teamProcedure } from "~/server/api/trpc";

const LOG_SOURCES = ["EMAIL", "WEBHOOK", "NOTIFICATION"] as const;

export const logsRouter = createTRPCRouter({
    list: teamProcedure
        .input(
            z
                .object({
                    limit: z.number().int().min(10).max(300).default(120),
                    source: z.enum(LOG_SOURCES).optional(),
                })
                .optional(),
        )
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 120;
            const source = input?.source;

            const includeEmail = !source || source === "EMAIL";
            const includeWebhook = !source || source === "WEBHOOK";
            const includeNotification = !source || source === "NOTIFICATION";

            const [emailEvents, webhookCalls, notificationLogs] = await Promise.all([
                includeEmail
                    ? ctx.db.emailEvent.findMany({
                        where: { teamId: ctx.team.id },
                        orderBy: { createdAt: "desc" },
                        take: limit,
                        select: {
                            id: true,
                            createdAt: true,
                            status: true,
                            emailId: true,
                            email: {
                                select: {
                                    subject: true,
                                    from: true,
                                    to: true,
                                },
                            },
                        },
                    })
                    : Promise.resolve([]),
                includeWebhook
                    ? ctx.db.webhookCall.findMany({
                        where: { teamId: ctx.team.id },
                        orderBy: { createdAt: "desc" },
                        take: limit,
                        select: {
                            id: true,
                            createdAt: true,
                            type: true,
                            status: true,
                            responseStatus: true,
                            lastError: true,
                            webhook: {
                                select: {
                                    url: true,
                                },
                            },
                        },
                    })
                    : Promise.resolve([]),
                includeNotification
                    ? ctx.db.notificationLog.findMany({
                        where: { teamId: ctx.team.id },
                        orderBy: { createdAt: "desc" },
                        take: limit,
                        select: {
                            id: true,
                            createdAt: true,
                            status: true,
                            eventType: true,
                            providerId: true,
                            responseStatus: true,
                            lastError: true,
                        },
                    })
                    : Promise.resolve([]),
            ]);

            const entries = [
                ...emailEvents.map((event) => ({
                    id: event.id,
                    source: "EMAIL" as const,
                    createdAt: event.createdAt,
                    status: event.status,
                    kind: event.status,
                    title: event.email?.subject || "Email event",
                    target: event.email?.to?.[0] || event.emailId,
                    metadata: {
                        emailId: event.emailId,
                        from: event.email?.from,
                    },
                })),
                ...webhookCalls.map((call) => ({
                    id: call.id,
                    source: "WEBHOOK" as const,
                    createdAt: call.createdAt,
                    status: call.status,
                    kind: call.type,
                    title: call.type,
                    target: call.webhook?.url || "Webhook endpoint",
                    metadata: {
                        responseStatus: call.responseStatus,
                        lastError: call.lastError,
                    },
                })),
                ...notificationLogs.map((log) => ({
                    id: log.id,
                    source: "NOTIFICATION" as const,
                    createdAt: log.createdAt,
                    status: log.status,
                    kind: log.eventType,
                    title: log.eventType,
                    target: `Provider ${log.providerId}`,
                    metadata: {
                        responseStatus: log.responseStatus,
                        lastError: log.lastError,
                    },
                })),
            ]
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, limit);

            return entries;
        }),
});
