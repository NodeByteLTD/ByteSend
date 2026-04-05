import { EmailStatus } from "@prisma/client";

export const EmailStatusBadge: React.FC<{ status: EmailStatus }> = ({
  status,
}) => {
  let badgeColor = "bg-gray-700/10 text-gray-400 border border-gray-400/10";
  switch (status) {
    case "DELIVERED":
      badgeColor = "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20";
      break;
    case "BOUNCED":
    case "FAILED":
      badgeColor = "bg-red-500/15 text-red-500 border border-red-500/20";
      break;
    case "CLICKED":
      badgeColor = "bg-blue-500/15 text-blue-500 border border-blue-500/20";
      break;
    case "OPENED":
      badgeColor = "bg-purple-500/15 text-purple-500 border border-purple-500/20";
      break;
    case "COMPLAINED":
    case "DELIVERY_DELAYED":
      badgeColor = "bg-yellow-500/15 text-yellow-500 border border-yellow-500/20";
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
  let outsideColor = "bg-gray-400/30";
  let insideColor = "bg-gray-400";

  switch (status) {
    case "DELIVERED":
      outsideColor = "bg-emerald-500/30";
      insideColor = "bg-emerald-500";
      break;
    case "BOUNCED":
    case "FAILED":
      outsideColor = "bg-red-500/30";
      insideColor = "bg-red-500";
      break;
    case "CLICKED":
      outsideColor = "bg-blue-500/30";
      insideColor = "bg-blue-500";
      break;
    case "OPENED":
      outsideColor = "bg-purple-500/30";
      insideColor = "bg-purple-500";
      break;
    case "DELIVERY_DELAYED":
    case "COMPLAINED":
      outsideColor = "bg-yellow-500/30";
      insideColor = "bg-yellow-500";
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
