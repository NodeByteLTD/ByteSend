"use client";

import { useState } from "react";
import { Button } from "@bytesend/ui/src/button";
import { Card } from "@bytesend/ui/src/card";
import { Spinner } from "@bytesend/ui/src/spinner";
import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useTeam } from "~/providers/team-context";
import { api } from "~/trpc/react";
import { PlanDetails } from "~/components/payments/PlanDetails";
import {
  UpgradeButton,
  type CheckoutPlan,
} from "~/components/payments/UpgradeButton";
import { PLANS, getAllPlans } from "@bytesend/lib";
import { PLAN_PERKS } from "~/lib/constants/payments";

const BILLING_PLAN_OPTIONS = getAllPlans().filter(
  (plan) => plan.plan !== "FREE",
);

function formatPlanPrice(plan: (typeof PLANS)[keyof typeof PLANS]): string {
  if (plan.oneTimePrice) return `CA$${plan.oneTimePrice / 100} one-time`;
  if (plan.monthlyPrice === 0) return "Free";
  return `CA$${plan.monthlyPrice / 100} / mo`;
}

export default function SettingsPage() {
  const { currentTeam, currentIsAdmin } = useTeam();
  const manageSessionUrl = api.billing.getManageSessionUrl.useMutation();
  const updateBillingEmailMutation =
    api.billing.updateBillingEmail.useMutation();

  const { data: subscription } = api.billing.getSubscriptionDetails.useQuery();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [billingEmail, setBillingEmail] = useState(
    currentTeam?.billingEmail || "",
  );

  const apiUtils = api.useUtils();

  const onManageClick = async () => {
    const url = await manageSessionUrl.mutateAsync();
    if (url) {
      window.location.href = url;
    }
  };

  const handleEditEmail = () => {
    setBillingEmail(currentTeam?.billingEmail || "");
    setIsEditingEmail(true);
  };

  const handleSaveEmail = async () => {
    try {
      await updateBillingEmailMutation.mutateAsync({ billingEmail });
      await apiUtils.team.getTeams.invalidate();
      setIsEditingEmail(false);
    } catch (error) {
      console.error("Failed to update billing email:", error);
    }
  };

  const paymentMethod =
    subscription?.paymentMethod && subscription.paymentMethod !== "null"
      ? JSON.parse(subscription.paymentMethod)
      : {};

  if (!currentIsAdmin) {
    return null;
  }

  if (!currentTeam?.plan) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner className="w-4 h-4" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className=" rounded-xl mt-10 p-8 px-8">
        <PlanDetails />
        <div className="mt-4">
          {currentTeam?.plan !== "FREE" ? (
            <Button
              onClick={onManageClick}
              className="mt-4 w-30"
              disabled={manageSessionUrl.isPending}
            >
              {manageSessionUrl.isPending ? (
                <Spinner className="w-4 h-4" />
              ) : (
                "Manage"
              )}
            </Button>
          ) : null}
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Plan details and checkout are managed here for consistency. Homepage pricing is estimate-only.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {BILLING_PLAN_OPTIONS.map((planData) => {
            const plan = planData.plan as CheckoutPlan;
            const perks = PLAN_PERKS[plan] ?? [];
            const isCurrent = currentTeam.plan === plan;
            const highlight = plan === "LITE" || plan === "BASIC";

            return (
              <div
                key={plan}
                className={`rounded-lg border p-4 flex flex-col gap-3 ${
                  isCurrent
                    ? "border-primary bg-primary/5"
                    : highlight
                      ? "border-primary/40"
                      : "border-border"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm">{planData.displayName}</span>
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {formatPlanPrice(planData)}
                  </span>
                </div>
                <ul className="space-y-1.5 flex-1">
                  {perks.map((perk, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0 mt-0.5" />
                      {perk}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button disabled className="w-full" variant="outline">
                    Current plan
                  </Button>
                ) : currentTeam.plan === "FREE" ? (
                  <UpgradeButton plan={plan} label={`Choose ${planData.displayName}`} />
                ) : (
                  <Button
                    onClick={onManageClick}
                    className="w-full"
                    variant="outline"
                    disabled={manageSessionUrl.isPending}
                  >
                    {manageSessionUrl.isPending ? (
                      <Spinner className="w-4 h-4" />
                    ) : (
                      "Change in billing portal"
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card className="p-6">
          <div>
            <div className="text-sm text-muted-foreground">Payment Method</div>
            {subscription ? (
              <div className="mt-2">
                <div className="text-lg font-mono uppercase flex items-center gap-2">
                  {subscription.paymentMethod &&
                  subscription.paymentMethod !== "null" ? (
                    <>
                      <span>💳</span>
                      <span className="capitalize">
                        {paymentMethod?.card?.brand || ""} ••••{" "}
                        {paymentMethod?.card?.last4 || ""}
                      </span>
                      {paymentMethod?.card && (
                        <span className="text-sm text-muted-foreground lowercase">
                          (Expires: {paymentMethod.card.exp_month}/
                          {paymentMethod.card.exp_year})
                        </span>
                      )}
                    </>
                  ) : (
                    "No Payment Method"
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Next billing date:{" "}
                  {subscription.currentPeriodEnd
                    ? format(
                        new Date(subscription.currentPeriodEnd),
                        "MMM dd, yyyy",
                      )
                    : "N/A"}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground mt-2">
                No active subscription
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <div className="text-sm text-muted-foreground">Billing Email</div>
            {isEditingEmail ? (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter billing email"
                  />
                  <Button
                    onClick={handleSaveEmail}
                    disabled={updateBillingEmailMutation.isPending}
                    size="sm"
                  >
                    {updateBillingEmailMutation.isPending ? (
                      <Spinner className="w-4 h-4" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsEditingEmail(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="font-mono">
                    {currentTeam?.billingEmail || "No billing email set"}
                  </div>
                  <Button onClick={handleEditEmail} variant="default" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
