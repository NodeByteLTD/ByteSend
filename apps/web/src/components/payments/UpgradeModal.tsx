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
      "2,000 emails / day",
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
      "5,000 emails / day",
      "10 domains",
      "Priority support",
    ],
  },
  {
    plan: "BASIC",
    name: "Professional",
    price: "CA$30 / mo",
    perks: [
      "150,000 emails / month included",
      "Marketing & transactional CA$0.01/ea (overage)",
      "100 domains · advanced analytics",
    ],
    highlight: true,
  },
  {
    plan: "LIFETIME",
    name: "Lifetime",
    price: "CA$60 one-time",
    perks: [
      "Unlimited emails — no overage charges",
      "No recurring charges",
      "500 domains · all future features",
    ],
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
