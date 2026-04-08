import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { db } from "~/server/db";

/**
 * Custom email verification adapter that gracefully handles missing verification tokens.
 * This prevents P2025 errors when users try to verify with expired or missing tokens.
 */
export function createEmailVerificationAdapter(): Adapter {
  const adapter = PrismaAdapter(db) as Adapter;

  return {
    ...adapter,
    useVerificationToken: adapter.useVerificationToken
      ? // Wrap the original useVerificationToken to handle errors
        async (params) => {
          try {
            return await adapter.useVerificationToken!(params);
          } catch (error: any) {
            // Handle P2025 (record not found) error gracefully
            if (error?.code === "P2025") {
              console.warn(
                `[Auth] Verification token not found for ${params.identifier}. Token may have expired or been used already.`,
                error.meta
              );
              // Return null instead of throwing error, so NextAuth shows a user-friendly error page
              return null;
            }
            // Re-throw other errors
            throw error;
          }
        }
      : undefined,
  };
}
