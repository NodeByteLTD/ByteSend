import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import { Provider } from "next-auth/providers/index";
import { sendSignUpEmail } from "~/server/mailer";
import { createEmailVerificationAdapter } from "~/server/email-adapter";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface Session extends DefaultSession {
    user: {
      id: number;
      isBetaUser: boolean;
      isAdmin: boolean;
      isFounder: boolean;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // eslint-disable-next-line no-unused-vars
  interface User {
    id: number;
    isBetaUser: boolean;
    isAdmin: boolean;
    isFounder: boolean;
    image?: string | null;
  }
}

/**
 * Auth providers
 */

function getProviders() {
  const providers: Provider[] = [];

  if (env.GITHUB_ID && env.GITHUB_SECRET) {
    providers.push(
      GitHubProvider({
        clientId: env.GITHUB_ID,
        clientSecret: env.GITHUB_SECRET,
        allowDangerousEmailAccountLinking: true,
        authorization: {
          params: {
            scope: "read:user user:email",
          },
        },
      })
    );
  }

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    );
  }

  if (env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET) {
    providers.push(
      DiscordProvider({
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    );
  }

  providers.push(
    EmailProvider({
      server: {},
      from: env.FROM_EMAIL ?? "noreply@bytesend.cloud",
      maxAge: 24 * 60 * 60, // 24 hours instead of 10 minutes for email verification code
      generateVerificationToken() {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let token = "";
        const bytes = new Uint8Array(6);
        crypto.getRandomValues(bytes);
        for (const b of bytes) token += chars[b % chars.length];
        return token;
      },
      async sendVerificationRequest({ identifier: email, token, url }) {
        await sendSignUpEmail(email, token, url);
      },
    })
  );

  if (providers.length === 0 && process.env.SKIP_ENV_VALIDATION !== "true") {
    throw new Error("No auth providers found, need atleast one");
  }

  return providers;
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn: async ({ user, account, profile, credentials }) => {
      // For email provider with code verification
      if (account?.provider === "email" && credentials?.code) {
        try {
          return true;
        } catch {
          return false;
        }
      }

      // Sync the OAuth provider's profile picture to the User record on every
      // OAuth sign-in so the avatar stays fresh (covers both first-time OAuth
      // logins and users who originally signed up via email then linked OAuth).
      const oauthProviders = ["github", "discord", "google"];
      if (account?.provider && oauthProviders.includes(account.provider)) {
        // Each provider uses a different field name in its raw profile response.
        let freshImage: string | null = null;
        if (account.provider === "github") {
          freshImage = (profile as { avatar_url?: string } | undefined)?.avatar_url ?? null;
        } else if (account.provider === "google") {
          freshImage = (profile as { picture?: string } | undefined)?.picture ?? null;
        } else if (account.provider === "discord") {
          const dp = profile as { image_url?: string; avatar?: string; id?: string } | undefined;
          freshImage =
            dp?.image_url ??
            (dp?.id && dp?.avatar
              ? `https://cdn.discordapp.com/avatars/${dp.id}/${dp.avatar}.png`
              : null);
        }

        if (freshImage && freshImage !== user.image) {
          try {
            await db.user.update({
              where: { id: user.id },
              data: { image: freshImage },
            });
            // Reflect immediately so the session callback sees the new value
            user.image = freshImage;
          } catch {
            // Non-fatal — sign-in still succeeds without the image update
          }
        }
      }

      return true;
    },
    session: ({ session, user }) => {
      const isFounder = !!env.FOUNDER_EMAIL && user.email === env.FOUNDER_EMAIL;
      const isAdmin =
        isFounder ||
        (!!env.ADMIN_EMAIL && user.email === env.ADMIN_EMAIL) ||
        user.isAdmin;
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          isBetaUser: user.isBetaUser,
          isAdmin,
          isFounder,
          // Explicitly forward the DB image so it always reaches the client,
          // even when session.user was built before the image update above.
          image: user.image ?? session.user.image,
        },
      };
    },
  },
  adapter: createEmailVerificationAdapter() as Adapter,
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verify=1",
    error: "/login?error=callback",
  },
  events: {
    createUser: async ({ user }) => {
      let invitesAvailable = false;

      if (user.email) {
        const invites = await db.teamInvite.findMany({
          where: { email: user.email },
        });

        invitesAvailable = invites.length > 0;
      }

      if (
        !env.NEXT_PUBLIC_IS_CLOUD ||
        env.NODE_ENV === "development" ||
        invitesAvailable
      ) {
        await db.user.update({
          where: { id: user.id },
          data: { isBetaUser: true },
        });
      } else {
        await db.user.update({
          where: { id: user.id },
          data: { isBetaUser: true },
        });
      }
    },
  },
  providers: getProviders(),
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
