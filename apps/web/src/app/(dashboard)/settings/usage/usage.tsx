"use client";

import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@bytesend/ui/src/card";
import { Button } from "@bytesend/ui/src/button";
import Spinner from "@bytesend/ui/src/spinner";
import { format } from "date-fns";
import {
  getCost,
  PLAN_CREDIT_UNITS,
  UNIT_PRICE,
  USAGE_UNIT_PRICE,
} from "~/lib/usage";
import { useTeam } from "~/providers/team-context";
import { EmailUsageType } from "@prisma/client";
import { PlanDetails } from "~/components/payments/PlanDetails";
import { useUpgradeModalStore } from "~/store/upgradeModalStore";
import { Progress } from "@bytesend/ui/src/progress";

const UNLIMITED_PLANS = new Set(["BASIC", "LIFETIME"]);

function ChoosePlanButton() {
  const { action: { openModal } } = useUpgradeModalStore();
  return (
    <Button className="w-full" onClick={() => openModal()}>
      Choose Plan
    </Button>
  );
}

const FREE_PLAN_LIMIT = 3000;

/* ────────── Free-tier usage ────────── */

function FreePlanUsage({
  usage,
  dayUsage,
}: {
  usage: { type: EmailUsageType; sent: number }[];
  dayUsage: { type: EmailUsageType; sent: number }[];
}) {
  const DAILY_LIMIT = 100;
  const totalSent = usage?.reduce((acc, item) => acc + item.sent, 0) || 0;
  const monthlyPct = Math.min((totalSent / FREE_PLAN_LIMIT) * 100, 100);
  const dailyUsage = dayUsage?.reduce((acc, item) => acc + item.sent, 0) || 0;
  const dailyPct = Math.min((dailyUsage / DAILY_LIMIT) * 100, 100);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Monthly gauge */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Monthly limit</span>
            <span className="text-sm font-mono text-muted-foreground">
              {totalSent.toLocaleString()}/{FREE_PLAN_LIMIT.toLocaleString()}
            </span>
          </div>
          <Progress value={monthlyPct} className="h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            {(FREE_PLAN_LIMIT - totalSent).toLocaleString()} emails remaining
          </p>
        </CardContent>
      </Card>

      {/* Daily gauge */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Daily limit</span>
            <span className="text-sm font-mono text-muted-foreground">
              {dailyUsage.toLocaleString()}/{DAILY_LIMIT.toLocaleString()}
            </span>
          </div>
          <Progress value={dailyPct} className="h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            Resets at midnight UTC
          </p>
        </CardContent>
      </Card>

      {/* Breakdown */}
      <Card className="sm:col-span-2 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {usage?.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <span className="font-medium capitalize">
                  {item.type.toLowerCase()}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {item.type === "TRANSACTIONAL"
                    ? "API & SMTP"
                    : "Campaign editor"}
                </span>
              </div>
              <span className="font-mono">
                {item.sent.toLocaleString()}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────── Paid-tier usage ────────── */

function PaidPlanUsage({
  usage,
}: {
  usage: { type: EmailUsageType; sent: number }[];
}) {
  const { currentTeam } = useTeam();
  if (currentTeam?.plan === "FREE") return null;

  const plan = currentTeam?.plan ?? "FREE";
  const isUnlimited = UNLIMITED_PLANS.has(plan);
  const totalCost =
    usage?.reduce((acc, item) => acc + getCost(item.sent, item.type), 0) || 0;
  const planCreditCost = isUnlimited
    ? 0
    : (PLAN_CREDIT_UNITS[plan as keyof typeof PLAN_CREDIT_UNITS] ?? 0) * UNIT_PRICE;
  const creditRemaining = isUnlimited ? null : Math.max(planCreditCost - totalCost, 0);
  const amountDue = isUnlimited ? 0 : Math.max(totalCost - planCreditCost, 0);
  const creditPct =
    !isUnlimited && planCreditCost > 0
      ? Math.min(100, 100 - (totalCost / planCreditCost) * 100)
      : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Amount due */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Amount due
          </p>
          <p className="mt-2 text-3xl font-bold font-mono">
            {isUnlimited ? "$0.00" : `$${amountDue.toFixed(2)}`}
          </p>
          {isUnlimited && (
            <p className="mt-1 text-xs text-muted-foreground">Included in plan</p>
          )}
        </CardContent>
      </Card>

      {/* Credit remaining */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Credit remaining
          </p>
          <p className="mt-2 text-3xl font-bold font-mono">
            {isUnlimited ? "∞" : `$${(creditRemaining ?? 0).toFixed(2)}`}
          </p>
          {!isUnlimited && <Progress value={creditPct} className="mt-3 h-1.5" />}
        </CardContent>
      </Card>

      {/* Total emails */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Emails sent
          </p>
          <p className="mt-2 text-3xl font-bold font-mono">
            {usage?.reduce((a, i) => a + i.sent, 0).toLocaleString() || "0"}
          </p>
        </CardContent>
      </Card>

      {/* Detailed breakdown */}
      <Card className="sm:col-span-3 border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Cost breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/50">
            {usage?.map((item) => (
              <div
                key={item.type}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <span className="text-sm font-medium capitalize">
                    {item.type.toLowerCase()}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {item.sent.toLocaleString()} × ${USAGE_UNIT_PRICE[item.type]}
                  </span>
                </div>
                <span className="text-sm font-mono font-medium">
                  ${getCost(item.sent, item.type).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────── Main page ────────── */

export default function UsagePage() {
  const { data: usage, isLoading } = api.billing.getThisMonthUsage.useQuery();
  const { currentTeam } = useTeam();
  const { data: subscription } = api.billing.getSubscriptionDetails.useQuery();

  const today = new Date();
  const billingPeriod =
    subscription?.currentPeriodStart && subscription?.currentPeriodEnd
      ? `${format(new Date(subscription.currentPeriodStart), "MMM dd")} – ${format(new Date(subscription.currentPeriodEnd), "MMM dd")}`
      : `${format(new Date(today.getFullYear(), today.getMonth(), 1), "MMM dd")} – ${format(new Date(today.getFullYear(), today.getMonth() + 1, 1), "MMM dd")}`;

  return (
    <div className="space-y-8">
      {/* Usage section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Usage</h2>
          <p className="text-sm text-muted-foreground">{billingPeriod}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-6 h-6" innerSvgClass="stroke-primary" />
          </div>
        ) : usage?.month.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No usage data available
            </CardContent>
          </Card>
        ) : currentTeam?.plan === "FREE" ? (
          <FreePlanUsage usage={usage?.month ?? []} dayUsage={usage?.day ?? []} />
        ) : (
          <PaidPlanUsage usage={usage?.month ?? []} />
        )}
      </div>

      {/* Current plan section */}
      {currentTeam?.plan && (
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <PlanDetails />
            {currentTeam.plan === "FREE" && (
              <div className="mt-6">
                <ChoosePlanButton />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
