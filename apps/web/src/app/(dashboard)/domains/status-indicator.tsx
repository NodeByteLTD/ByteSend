import { DomainStatus } from "@prisma/client";

export const StatusIndicator: React.FC<{ status: DomainStatus }> = ({ status }) => {
  const color =
    status === DomainStatus.SUCCESS
      ? "bg-emerald-500"
      : status === DomainStatus.FAILED
        ? "bg-red-500"
        : status === DomainStatus.PENDING || status === DomainStatus.TEMPORARY_FAILURE
          ? "bg-amber-500"
          : "bg-border";

  return <div className={`w-px self-stretch ${color} my-3 rounded-full shrink-0`} />;
};
