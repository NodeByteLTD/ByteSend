"use client";

import CampaignList from "./campaign-list";
import CreateCampaign from "./create-campaign";
import { H1 } from "@bytesend/ui";
import { useTeam } from "~/providers/team-context";
import { useUpgradeModalStore } from "~/store/upgradeModalStore";
import { LimitReason } from "~/lib/constants/plans";
import { isCloud } from "~/utils/common";
import { LockIcon } from "lucide-react";
import { Button } from "@bytesend/ui/src/button";

export default function CampaignsPage() {
  const { currentTeam } = useTeam();
  const openUpgradeModal = useUpgradeModalStore((s) => s.action.openModal);

  if (isCloud() && currentTeam?.plan === "FREE") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <LockIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Campaigns require a paid plan</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Create and send bulk email campaigns to your contact lists. Upgrade to unlock this feature.
          </p>
        </div>
        <Button onClick={() => openUpgradeModal(LimitReason.MARKETING_NOT_AVAILABLE)}>
          Upgrade plan
        </Button>
      </div>
    );
  }

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
