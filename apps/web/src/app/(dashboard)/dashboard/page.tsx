"use client";

import EmailChart from "./email-chart";
import DashboardFilters from "./dashboard-filters";
import { H1 } from "@bytesend/ui";
import { useUrlState } from "~/hooks/useUrlState";
import { ReputationMetrics } from "./reputation-metrics";
import { useTeam } from "~/providers/team-context";

export default function Dashboard() {
  const [days, setDays] = useUrlState("days", "30");
  const [domain, setDomain] = useUrlState("domain");
  const { currentTeam } = useTeam();
  const isPaidTeam = currentTeam?.plan !== "FREE";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <H1>Analytics</H1>
          <p className="text-sm text-muted-foreground mt-1">Monitor your email delivery and engagement</p>
        </div>
        <DashboardFilters
          days={days ?? "30"}
          setDays={setDays}
          domain={domain}
          setDomain={setDomain}
        />
      </div>
      <div className="space-y-8">
        <EmailChart days={Number(days ?? "30")} domain={domain} isPaidTeam={Boolean(isPaidTeam)} />

        <ReputationMetrics days={Number(days ?? "30")} domain={domain} />
      </div>
    </div>
  );
}
