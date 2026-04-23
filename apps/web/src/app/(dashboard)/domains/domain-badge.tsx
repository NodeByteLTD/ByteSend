import { DomainStatus } from "@prisma/client";
import { CheckCircle2, XCircle, Clock, AlertTriangle, MinusCircle } from "lucide-react";

export const DomainStatusBadge: React.FC<{ status: DomainStatus }> = ({ status }) => {
  const configs: Record<DomainStatus, { label: string; className: string; Icon: React.ElementType }> = {
    [DomainStatus.SUCCESS]: {
      label: "Verified",
      className: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      Icon: CheckCircle2,
    },
    [DomainStatus.FAILED]: {
      label: "Failed",
      className: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
      Icon: XCircle,
    },
    [DomainStatus.PENDING]: {
      label: "Pending",
      className: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      Icon: Clock,
    },
    [DomainStatus.TEMPORARY_FAILURE]: {
      label: "Degraded",
      className: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
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
