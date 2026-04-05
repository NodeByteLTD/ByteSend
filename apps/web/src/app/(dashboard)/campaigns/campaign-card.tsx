"use client";

import { CampaignStatus } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bytesend/ui/src/tooltip";
import DeleteCampaign from "./delete-campaign";
import DuplicateCampaign from "./duplicate-campaign";
import TogglePauseCampaign from "./toggle-pause-campaign";
import CampaignStatusBadge from "./campaign-status-badge";

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    subject: string;
    from: string;
    status: CampaignStatus;
    createdAt: Date;
    updatedAt: Date;
    scheduledAt?: Date | null;
    total: number;
    sent: number;
    delivered: number;
    unsubscribed: number;
  };
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const sentPercentage =
    campaign.total > 0 ? Math.round((campaign.sent / campaign.total) * 100) : 0;
  const pendingCount = campaign.total - campaign.sent;

  return (
    <div className="border border-border/60 rounded-xl p-4 hover:border-border transition-colors">
      {/* Mobile: stacked */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex items-center justify-between">
          <Link
            href={
              campaign.status === CampaignStatus.DRAFT ||
              campaign.status === CampaignStatus.SCHEDULED
                ? `/campaigns/${campaign.id}/edit`
                : `/campaigns/${campaign.id}`
            }
            className="text-sm font-medium underline decoration-dashed underline-offset-2 truncate"
          >
            {campaign.name}
          </Link>
          <CampaignStatusBadge status={campaign.status} />
        </div>

        <div className="text-xs font-mono text-muted-foreground">
          {campaign.status === CampaignStatus.SCHEDULED ? (
            campaign.scheduledAt && (
              <span>At <strong>{format(new Date(campaign.scheduledAt), "MMM do, hh:mm a")}</strong></span>
            )
          ) : campaign.status === CampaignStatus.SENT ? (
            <span>Delivered <strong>{campaign.delivered}</strong> · Unsub <strong>{campaign.unsubscribed}</strong></span>
          ) : (
            <span>Sent <strong>{campaign.sent}</strong>{pendingCount > 0 && <> · Pending <strong>{pendingCount}</strong></>}</span>
          )}
        </div>

        <TooltipProvider>
          <div className="flex gap-3 items-center">
            {(campaign.status === CampaignStatus.SCHEDULED ||
              campaign.status === CampaignStatus.RUNNING ||
              campaign.status === CampaignStatus.PAUSED) && (
              <TogglePauseCampaign campaign={campaign} />
            )}
            <DuplicateCampaign campaign={campaign} />
            <DeleteCampaign campaign={campaign} />
          </div>
        </TooltipProvider>
      </div>

      {/* Desktop: row */}
      <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <Link
            href={
              campaign.status === CampaignStatus.DRAFT ||
              campaign.status === CampaignStatus.SCHEDULED
                ? `/campaigns/${campaign.id}/edit`
                : `/campaigns/${campaign.id}`
            }
            className="text-sm font-medium underline decoration-dashed underline-offset-2"
          >
            {campaign.name}
          </Link>
          <div className="text-xs font-mono text-muted-foreground mt-1.5">
            {campaign.status === CampaignStatus.SCHEDULED ? (
              campaign.scheduledAt && (
                <span>At <strong>{format(new Date(campaign.scheduledAt), "MMM do, hh:mm a")}</strong></span>
              )
            ) : campaign.status === CampaignStatus.SENT ? (
              <span>Delivered <strong>{campaign.delivered}</strong> · Unsub <strong>{campaign.unsubscribed}</strong></span>
            ) : (
              <span>Sent <strong>{campaign.sent}</strong>{pendingCount > 0 && <> · Pending <strong>{pendingCount}</strong></>}</span>
            )}
          </div>
        </div>

        <CampaignStatusBadge status={campaign.status} />

        <TooltipProvider>
          <div className="flex gap-3 items-center shrink-0">
            {(campaign.status === CampaignStatus.SCHEDULED ||
              campaign.status === CampaignStatus.RUNNING ||
              campaign.status === CampaignStatus.PAUSED) && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <TogglePauseCampaign campaign={campaign} />
                  </span>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  {campaign.status === CampaignStatus.PAUSED ? "Resume campaign" : "Pause campaign"}
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <DuplicateCampaign campaign={campaign} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Duplicate</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <DeleteCampaign campaign={campaign} />
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Delete</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
