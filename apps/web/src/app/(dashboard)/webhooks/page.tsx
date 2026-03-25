"use client";

import { H1 } from "@usesend/ui";
import { AddWebhook } from "./add-webhook";
import { WebhookList } from "./webhook-list";

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1>Webhooks</H1>
          <p className="text-sm text-muted-foreground mt-1">Receive real-time event notifications</p>
        </div>
        <AddWebhook />
      </div>
      <WebhookList />
    </div>
  );
}
