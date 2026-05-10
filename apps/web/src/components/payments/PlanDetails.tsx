import { PLANS } from "@bytesend/lib";
import { PLAN_PERKS } from "~/lib/constants/payments";
import { CheckCircle2 } from "lucide-react";
import { api } from "~/trpc/react";
import { useTeam } from "~/providers/team-context";
import { Badge } from "@bytesend/ui/src/badge";
import { format } from "date-fns";

export const PlanDetails = () => {
  const subscriptionQuery = api.billing.getSubscriptionDetails.useQuery();
  const { currentTeam } = useTeam();

  if (subscriptionQuery.isLoading || !currentTeam) {
    return null;
  }

  const planKey = currentTeam.plan as keyof typeof PLAN_PERKS;
  const perks = PLAN_PERKS[planKey] || [];
  const displayName = PLANS[planKey]?.displayName ?? planKey;

  return (
    <div>
      <div className="text-lg font-semibold">{displayName}</div>
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground text-sm">Current plan</div>
        {subscriptionQuery.data?.cancelAtPeriodEnd && (
          <Badge variant="secondary">
            Cancels {format(subscriptionQuery.data.cancelAtPeriodEnd, "MMM dd")}
          </Badge>
        )}
      </div>
      <ul className="mt-4 space-y-3">
        {perks.map((perk, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green shrink-0" />
            <span className="text-sm">{perk}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
