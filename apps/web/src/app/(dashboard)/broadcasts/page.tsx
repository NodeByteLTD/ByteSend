"use client";

import CampaignList from "../campaigns/campaign-list";
import CreateBroadcast from "./create-broadcast";
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
        <CreateBroadcast />
      </div>
      <CampaignList intent="BROADCAST" basePath="/broadcasts" />
    </div>
  );
}
