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
import { UpgradeButton } from "~/components/payments/UpgradeButton";

type PaidPlan = "HOBBY" | "LITE" | "BASIC" | "LIFETIME";

const PLAN_OPTIONS: {
  plan: PaidPlan;
  name: string;
  price: string;
  perks: string[];
  highlight?: boolean;
}[] = [
  {
    plan: "HOBBY",
    name: "Hobby",
    price: "CA$5 / mo",
    perks: [
      "15,000 emails / month",
      "500 emails / day",
      "5 domains",
      "Usage-based billing",
    ],
  },
  {
    plan: "LITE",
    name: "Lite",
    price: "CA$10 / mo",
    perks: [
      "50,000 emails / month",
      "2,000 emails / day",
      "10 domains",
      "Priority support",
    ],
  },
  {
    plan: "BASIC",
    name: "Professional",
    price: "CA$30 / mo",
    perks: [
      "Unlimited emails",
      "No per-email charges",
      "100 domains · 50 members",
      "Advanced analytics",
    ],
    highlight: true,
  },
  {
    plan: "LIFETIME",
    name: "Lifetime",
    price: "CA$60 one-time",
    perks: [
      "Unlimited emails forever",
      "No recurring charges",
      "500 domains · 200 members",
      "All future features",
    ],
  },
];

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

      {currentTeam?.plan === "FREE" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Upgrade Your Plan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAN_OPTIONS.map(({ plan, name, price, perks, highlight }) => (
              <div
                key={plan}
                className={`rounded-lg border p-4 flex flex-col gap-3 ${
                  highlight ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{name}</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {price}
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
                <UpgradeButton plan={plan} label={`Choose ${name}`} />
              </div>
            ))}
          </div>
        </div>
      )}
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
