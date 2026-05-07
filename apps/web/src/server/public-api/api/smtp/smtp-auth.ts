import { createRoute, z } from "@hono/zod-openapi";
import { PublicAPIApp } from "~/server/public-api/hono";
import { getTeamAndApiKey } from "~/server/service/api-service";
import { env } from "~/env";

const GLOBAL_DEFAULT_USERNAME = env.SMTP_USER;

const route = createRoute({
  method: "post",
  path: "/v1/smtp/auth",
  security: [],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: z.object({
            username: z.string(),
            password: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ valid: z.literal(true) }),
        },
      },
      description: "Credentials are valid",
    },
    401: {
      content: {
        "application/json": {
          schema: z.object({ valid: z.literal(false), message: z.string() }),
        },
      },
      description: "Invalid credentials",
    },
  },
});

export default function smtpAuth(app: PublicAPIApp) {
  app.openapi(route, async (c) => {
    const { username, password } = c.req.valid("json");

    const teamAndApiKey = await getTeamAndApiKey(password);

    if (!teamAndApiKey) {
      return c.json({ valid: false as const, message: "Invalid API key" }, 401);
    }

    const { team } = teamAndApiKey;

    const expectedUsername = team.smtpUsername ?? GLOBAL_DEFAULT_USERNAME;

    if (username !== expectedUsername) {
      return c.json({ valid: false as const, message: "Invalid username" }, 401);
    }

    return c.json({ valid: true as const }, 200);
  });
}
