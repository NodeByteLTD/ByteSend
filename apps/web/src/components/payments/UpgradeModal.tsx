"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@bytesend/ui/src/dialog";
import { CheckCircle2 } from "lucide-react";
import { useUpgradeModalStore } from "~/store/upgradeModalStore";
import { LimitReason } from "~/lib/constants/plans";
import { UpgradeButton } from "./UpgradeButton";

type PaidPlan = "HOBBY" | "LITE";

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
      "25,000 emails / month",
      "12,500 emails / day",
      "4 domains + $1/extra",
      "10 team members",
      "Marketing CA$0.05/ea (overage)",
    ],
  },
  {
    plan: "LITE",
    name: "Lite",
    price: "CA$10 / mo",
    perks: [
      "50,000 emails / month",
      "25,000 emails / day",
      "6 domains + $1/extra",
      "15 team members",
      "Marketing CA$0.02/ea (overage)",
      "Priority support",
    ],
    highlight: true,
  },
];

export const UpgradeModal = () => {
  const {
    isOpen,
    reason,
    action: { closeModal },
  } = useUpgradeModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose a Plan</DialogTitle>
          <DialogDescription>
            {(() => {
              const messages: Record<LimitReason, string> = {
                [LimitReason.DOMAIN]:
                  "You've reached the domain limit on your current plan.",
                [LimitReason.CONTACT_BOOK]:
                  "You've reached the contact book limit on your current plan.",
                [LimitReason.TEAM_MEMBER]:
                  "You've reached the team member limit on your current plan.",
                [LimitReason.WEBHOOK]:
                  "You've reached the webhook limit on your current plan.",
                [LimitReason.EMAIL_BLOCKED]:
                  "You've reached the email sending limit on your current plan.",
                [LimitReason.EMAIL_DAILY_LIMIT_REACHED]:
                  "You've reached the daily email limit on your current plan.",
                [LimitReason.EMAIL_FREE_PLAN_MONTHLY_LIMIT_REACHED]:
                  "You've reached the monthly email limit on your current plan.",
                [LimitReason.MARKETING_NOT_AVAILABLE]:
                  "Marketing features (Contacts & Campaigns) are not available on the Free plan.",
              };
              return reason
                ? `${messages[reason] ?? ""} Upgrade to unlock more.`
                : "Select a plan that fits your needs.";
            })()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-2">
          {PLAN_OPTIONS.map(({ plan, name, price, perks, highlight }) => (
            <div
              key={plan}
              className={`rounded-lg border p-4 flex flex-col gap-3 ${
                highlight
                  ? "border-primary bg-primary/5"
                  : "border-border"
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
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0 mt-0.5" />
                    {perk}
                  </li>
                ))}
              </ul>
              <UpgradeButton plan={plan} label={`Choose ${name}`} />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
