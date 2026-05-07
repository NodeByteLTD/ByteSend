import { EmailStatus } from "@prisma/client";

export const EmailStatusBadge: React.FC<{ status: EmailStatus }> = ({
  status,
}) => {
  let badgeColor = "bg-muted/30 text-muted-foreground border border-border/40";
  switch (status) {
    case "DELIVERED":
      badgeColor = "bg-green/15 text-green border border-green/25";
      break;
    case "BOUNCED":
    case "FAILED":
      badgeColor = "bg-red/15 text-red border border-red/25";
      break;
    case "CLICKED":
      badgeColor = "bg-blue/15 text-blue border border-blue/25";
      break;
    case "OPENED":
      badgeColor = "bg-primary/10 text-primary border border-primary/20";
      break;
    case "COMPLAINED":
    case "DELIVERY_DELAYED":
      badgeColor = "bg-yellow/15 text-yellow border border-yellow/25";
      break;
    default:
      break;
  }

  return (
    <div
      className={`text-center min-w-24 rounded-md capitalize py-1 px-2 text-xs font-medium ${badgeColor}`}
    >
      {status.toLowerCase().split("_").join(" ")}
    </div>
  );
};

export const EmailStatusIcon: React.FC<{ status: EmailStatus }> = ({
  status,
}) => {
  let outsideColor = "bg-muted-foreground/20";
  let insideColor = "bg-muted-foreground";

  switch (status) {
    case "DELIVERED":
      outsideColor = "bg-green/25";
      insideColor = "bg-green";
      break;
    case "BOUNCED":
    case "FAILED":
      outsideColor = "bg-red/25";
      insideColor = "bg-red";
      break;
    case "CLICKED":
      outsideColor = "bg-blue/25";
      insideColor = "bg-blue";
      break;
    case "OPENED":
      outsideColor = "bg-primary/20";
      insideColor = "bg-primary";
      break;
    case "DELIVERY_DELAYED":
    case "COMPLAINED":
      outsideColor = "bg-yellow/25";
      insideColor = "bg-yellow";
      break;
    default:
      break;
  }

  return (
    <div
      className={`flex justify-center items-center p-1.5 ${outsideColor} rounded-full`}
    >
      <div className={`h-2 w-2 rounded-full ${insideColor}`} />
    </div>
  );
};
