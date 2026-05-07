import { WebhookCallStatus } from "@prisma/client";

export function WebhookCallStatusBadge({
  status,
}: {
  status: WebhookCallStatus;
}) {
  let badgeColor = "bg-muted/30 text-muted-foreground border border-border/40";
  let label: string = status;

  switch (status) {
    case WebhookCallStatus.DELIVERED:
      badgeColor = "bg-green/15 text-green border border-green/20";
      label = "Delivered";
      break;
    case WebhookCallStatus.FAILED:
      badgeColor = "bg-red/15 text-red border border-red/20";
      label = "Failed";
      break;
    case WebhookCallStatus.PENDING:
      badgeColor = "bg-yellow/20 text-yellow border border-yellow/10";
      label = "Pending";
      break;
    case WebhookCallStatus.IN_PROGRESS:
      badgeColor = "bg-blue/15 text-blue border border-blue/20";
      label = "In Progress";
      break;
    case WebhookCallStatus.DISCARDED:
      badgeColor = "bg-muted/30 text-muted-foreground border border-border/40";
      label = "Discarded";
      break;
  }

  return (
    <div
      className={`text-center min-w-24 px-2 rounded capitalize py-1 text-xs ${badgeColor}`}
    >
      {label}
    </div>
  );
}
