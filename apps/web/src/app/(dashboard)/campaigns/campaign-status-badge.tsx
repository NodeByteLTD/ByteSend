import { CampaignStatus } from "@prisma/client";

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

export default function CampaignStatusBadge({
  status,
}: CampaignStatusBadgeProps) {
  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.DRAFT:
        return "bg-gray-500/15 text-gray-400 border border-gray-500/20";
      case CampaignStatus.SENT:
        return "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20";
      case CampaignStatus.RUNNING:
        return "bg-blue-500/15 text-blue-500 border border-blue-500/20";
      case CampaignStatus.PAUSED:
        return "bg-yellow-500/15 text-yellow-500 border border-yellow-500/20";
      case CampaignStatus.SCHEDULED:
        return "bg-gray-500/15 text-gray-400 border border-gray-500/20";
      default:
        return "bg-gray-500/15 text-gray-400 border border-gray-500/20";
    }
  };

  return (
    <div
      className={`text-center min-w-24 rounded-md capitalize py-1 px-2 text-xs font-medium ${getStatusColor(status)}`}
    >
      {status.toLowerCase()}
    </div>
  );
}
