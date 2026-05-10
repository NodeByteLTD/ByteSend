"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@bytesend/ui/src/dialog";
import Link from "next/link";
import { Button } from "@bytesend/ui/src/button";
import { useUpgradeModalStore } from "~/store/upgradeModalStore";
import { LimitReason } from "~/lib/constants/plans";

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

        <div className="mt-3 rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-sm text-muted-foreground">
            To keep pricing and plan details consistent, all plan options and checkout are managed in Billing.
          </p>
          <div className="mt-4 flex justify-end">
            <Button asChild onClick={closeModal}>
              <Link href="/settings/billing">Open Billing</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
