"use client";

import CampaignList from "../campaigns/campaign-list";
import CreateCampaign from "../campaigns/create-campaign";
import { H1 } from "@bytesend/ui";

export default function BroadcastsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1>Broadcasts</H1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send now or schedule one-off email broadcasts
          </p>
        </div>
        <CreateCampaign intent="BROADCAST" basePath="/broadcasts" />
      </div>
      <CampaignList intent="BROADCAST" basePath="/broadcasts" />
    </div>
  );
}
