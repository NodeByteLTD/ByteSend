import { env } from "~/env";
import { db } from "~/server/db";
import { logger } from "~/server/logger/log";
import { parseSesHook, SesHookParser } from "~/server/service/ses-hook-parser";
import { SesSettingsService } from "~/server/service/ses-settings-service";
import { SnsNotificationMessage } from "~/types/aws-types";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ data: "Hello" });
}

export async function POST(req: Request) {
  const data = await req.json();

  logger.debug(
    {
      type: data?.Type,
      topicArn: data?.TopicArn,
      messageId: data?.MessageId,
      hasMessage: typeof data?.Message === "string",
    },
    "Received SES callback payload",
  );

  const isEventValid = await checkEventValidity(data);

  logger.debug({ isEventValid }, "SES callback topic validation result");

  if (!isEventValid) {
    return Response.json({ data: "Event is not valid" });
  }

  if (data.Type === "SubscriptionConfirmation") {
    return handleSubscription(data);
  }

  let message = null;

  try {
    message = JSON.parse(data.Message || "{}");
    const status = await SesHookParser.queue({
      event: message,
      messageId: data.MessageId,
    });
    if (!status) {
      return Response.json({ data: "Error in parsing hook" });
    }

    return Response.json({ data: "Success" });
  } catch (e) {
    logger.error(
      { error: e instanceof Error ? e.message : "Unknown error" },
      "Failed to parse SES callback message",
    );
    return Response.json({ data: "Error is parsing hook" });
  }
}

/**
 * Handles the subscription confirmation event. called only once for a webhook
 */
async function handleSubscription(message: any) {
  const subscribeUrl = buildSnsSubscribeConfirmUrl(message);

  await fetch(subscribeUrl, {
    method: "GET",
  });

  const topicArn = message.TopicArn as string;
  const setting = await db.sesSetting.findFirst({
    where: {
      topicArn,
    },
  });

  if (!setting) {
    return Response.json({ data: "Setting not found" });
  }

  await db.sesSetting.update({
    where: {
      id: setting?.id,
    },
    data: {
      callbackSuccess: true,
    },
  });

  SesSettingsService.invalidateCache();

  return Response.json({ data: "Success" });
}

/**
 * Build a trusted SNS subscription confirmation URL from message fields.
 * We intentionally do not use message.SubscribeURL directly to prevent SSRF.
 */
function buildSnsSubscribeConfirmUrl(message: {
  TopicArn?: string;
  Token?: string;
}) {
  const topicArn = message.TopicArn;
  const token = message.Token;

  if (!topicArn || !token) {
    throw new Error("Invalid SNS subscription payload");
  }

  const arnParts = topicArn.split(":");
  if (arnParts.length < 6 || arnParts[2] !== "sns") {
    throw new Error("Invalid SNS TopicArn");
  }

  const partition = arnParts[1];
  const region = arnParts[3];

  if (!region) {
    throw new Error("SNS TopicArn is missing region");
  }

  const domain = partition === "aws-cn" ? "amazonaws.com.cn" : "amazonaws.com";
  const confirmUrl = new URL(`https://sns.${region}.${domain}/`);
  confirmUrl.searchParams.set("Action", "ConfirmSubscription");
  confirmUrl.searchParams.set("TopicArn", topicArn);
  confirmUrl.searchParams.set("Token", token);

  return confirmUrl.toString();
}

/**
 * A simple check to ensure that the event is from the correct topic
 */
async function checkEventValidity(message: SnsNotificationMessage) {
  if (env.NODE_ENV === "development") {
    return true;
  }

  const { TopicArn } = message;
  const configuredTopicArn = await SesSettingsService.getTopicArns();

  if (!configuredTopicArn.includes(TopicArn)) {
    return false;
  }

  return true;
}
