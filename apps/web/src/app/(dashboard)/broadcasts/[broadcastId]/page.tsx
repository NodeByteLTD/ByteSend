"use client";

import { use } from "react";
import CampaignDetailsPage from "../../campaigns/[campaignId]/page";

export default function BroadcastDetailsPage({
  params,
}: {
  params: Promise<{ broadcastId: string }>;
}) {
  const { broadcastId } = use(params);

  return <CampaignDetailsPage params={Promise.resolve({ campaignId: broadcastId })} />;
}