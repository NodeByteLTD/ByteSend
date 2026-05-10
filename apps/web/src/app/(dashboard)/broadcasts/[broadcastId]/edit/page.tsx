"use client";

import { use } from "react";
import EditCampaignPage from "../../../campaigns/[campaignId]/edit/page";

export default function EditBroadcastPage({
  params,
}: {
  params: Promise<{ broadcastId: string }>;
}) {
  const { broadcastId } = use(params);

  return <EditCampaignPage params={Promise.resolve({ campaignId: broadcastId })} />;
}