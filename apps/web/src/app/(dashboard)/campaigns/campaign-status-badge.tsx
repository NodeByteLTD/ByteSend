import { CampaignStatus } from "@prisma/client";
import {
  Circle,
  CheckCircle2,
  Clock,
  Pause,
  Play,
} from "lucide-react";

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

const statusConfig: Record<
  CampaignStatus,
  { label: string; className: string; Icon: React.ElementType }
> = {
  [CampaignStatus.DRAFT]: {
    label: "Draft",
    className: "bg-gray/10 text-gray border border-gray/20",
    Icon: Circle,
  },
  [CampaignStatus.SCHEDULED]: {
    label: "Scheduled",
    className: "bg-primary/10 text-primary border border-primary/20",
    Icon: Clock,
  },
  [CampaignStatus.RUNNING]: {
    label: "Running",
    className: "bg-blue/15 text-blue border border-blue/25",
    Icon: Play,
  },
  [CampaignStatus.PAUSED]: {
    label: "Paused",
    className: "bg-yellow/15 text-yellow border border-yellow/25",
    Icon: Pause,
  },
  [CampaignStatus.SENT]: {
    label: "Sent",
    className: "bg-green/15 text-green border border-green/25",
    Icon: CheckCircle2,
  },
};

export default function CampaignStatusBadge({
  status,
}: CampaignStatusBadgeProps) {
  const { label, className, Icon } = statusConfig[status] ?? statusConfig[CampaignStatus.DRAFT];

  return (
    <div
      className={`inline-flex items-center gap-1 min-w-24 rounded-md py-1 px-2 text-xs font-medium ${className}`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </div>
  );
}
