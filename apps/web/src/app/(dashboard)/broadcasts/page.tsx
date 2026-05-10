"use client";

import CampaignList from "../campaigns/campaign-list";
import CreateCampaign from "../campaigns/create-campaign";
import { H1 } from "@bytesend/ui";
import { useTeam } from "~/providers/team-context";
import { useUpgradeModalStore } from "~/store/upgradeModalStore";
import { LimitReason } from "~/lib/constants/plans";
import { isCloud } from "~/utils/common";
import { LockIcon } from "lucide-react";
import { Button } from "@bytesend/ui/src/button";
import { useSession } from "next-auth/react";

export default function BroadcastsPage() {
  const { data: session } = useSession();
  const { currentTeam } = useTeam();
  const openUpgradeModal = useUpgradeModalStore((s) => s.action.openModal);

  if (isCloud() && currentTeam?.plan === "FREE" && !session?.user?.isEnvAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <LockIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Broadcasts require a paid plan</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Send one-off or scheduled broadcasts to your contact lists. Upgrade to unlock this feature.
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
