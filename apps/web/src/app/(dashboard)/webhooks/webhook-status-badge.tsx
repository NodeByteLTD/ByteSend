import { WebhookStatus } from "@prisma/client";

export function WebhookStatusBadge({ status }: { status: WebhookStatus }) {
  let badgeColor = "bg-muted/30 text-muted-foreground border border-border/40";
  let label: string = status;

  if (status === WebhookStatus.ACTIVE) {
    badgeColor = "bg-green/15 text-green border border-green/20";
    label = "Active";
  } else if (status === WebhookStatus.PAUSED) {
    badgeColor = "bg-yellow/15 text-yellow border border-yellow/20";
    label = "Paused";
  } else if (status === WebhookStatus.AUTO_DISABLED) {
    badgeColor = "bg-red/15 text-red border border-red/20";
    label = "Auto disabled";
  }

  return (
    <div
      className={`text-center min-w-24 px-2 rounded capitalize py-1 text-xs ${badgeColor}`}
    >
      {label}
    </div>
  );
}
