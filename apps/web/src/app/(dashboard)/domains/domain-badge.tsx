import { DomainStatus } from "@prisma/client";
import { CheckCircle2, XCircle, Clock, AlertTriangle, MinusCircle } from "lucide-react";

export const DomainStatusBadge: React.FC<{ status: DomainStatus }> = ({ status }) => {
  const configs: Record<DomainStatus, { label: string; className: string; Icon: React.ElementType }> = {
    [DomainStatus.SUCCESS]: {
      label: "Verified",
      className: "text-green bg-green/15 border-green/25",
      Icon: CheckCircle2,
    },
    [DomainStatus.FAILED]: {
      label: "Failed",
      className: "text-red bg-red/15 border-red/25",
      Icon: XCircle,
    },
    [DomainStatus.PENDING]: {
      label: "Pending",
      className: "text-yellow bg-yellow/15 border-yellow/25",
      Icon: Clock,
    },
    [DomainStatus.TEMPORARY_FAILURE]: {
      label: "Degraded",
      className: "text-yellow bg-yellow/15 border-yellow/25",
      Icon: AlertTriangle,
    },
    [DomainStatus.NOT_STARTED]: {
      label: "Not set up",
      className: "text-muted-foreground bg-muted border-border/40",
      Icon: MinusCircle,
    },
  };

  const { label, className, Icon } = configs[status] ?? configs[DomainStatus.NOT_STARTED];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};
