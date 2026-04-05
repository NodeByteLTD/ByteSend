"use client";

import CampaignList from "./campaign-list";
import CreateCampaign from "./create-campaign";
import { H1 } from "@bytesend/ui";

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1>Campaigns</H1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage email campaigns</p>
        </div>
        <CreateCampaign />
      </div>
      <CampaignList />
    </div>
  );
}
