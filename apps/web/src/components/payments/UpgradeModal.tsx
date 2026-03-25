"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@usesend/ui/src/dialog";
import { CheckCircle2 } from "lucide-react";
import { useUpgradeModalStore } from "~/store/upgradeModalStore";
import { PLAN_PERKS } from "~/lib/constants/payments";
import { LimitReason } from "~/lib/constants/plans";
import { UpgradeButton } from "./UpgradeButton";

export const UpgradeModal = () => {
  const {
    isOpen,
    reason,
    action: { closeModal },
  } = useUpgradeModalStore();

  const basicPlanPerks = PLAN_PERKS.BASIC || [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            {(() => {
              const messages: Record<LimitReason, string> = {
                [LimitReason.DOMAIN]:
                  "You've reached the domain limit on the Free plan.",
                [LimitReason.CONTACT_BOOK]:
                  "You've reached the contact book limit on the Free plan.",
                [LimitReason.TEAM_MEMBER]:
                  "You've reached the team member limit on the Free plan.",
                [LimitReason.WEBHOOK]:
                  "You've reached the webhook limit on the Free plan.",
                [LimitReason.EMAIL_BLOCKED]:
                  "You've reached the email sending limit on the Free plan.",
                [LimitReason.EMAIL_DAILY_LIMIT_REACHED]:
                  "You've reached the daily email limit on the Free plan.",
                [LimitReason.EMAIL_FREE_PLAN_MONTHLY_LIMIT_REACHED]:
                  "You've reached the monthly email limit on the Free plan.",
              };
              return reason
                ? `${messages[reason] ?? ""} Upgrade to Pro to unlock unlimited sending and more.`
                : "Unlock unlimited sending and priority support with Pro.";
            })()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">What&#39;s included in Pro:</h4>
            <ul className="space-y-2">
              {basicPlanPerks.map((perk, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green shrink-0 mt-0.5" />
                  <span className="text-sm">{perk}</span>
                </li>
              ))}
            </ul>
          </div>

          <UpgradeButton />
        </div>
      </DialogContent>
    </Dialog>
  );
};
