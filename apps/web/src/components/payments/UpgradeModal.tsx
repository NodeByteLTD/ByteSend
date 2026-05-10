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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upgrade Required</DialogTitle>
          <DialogDescription>
            {(() => {
              const messages: Record<LimitReason, string> = {
                [LimitReason.DOMAIN]:
                  "You have reached the domain limit for your current plan.",
                [LimitReason.CONTACT_BOOK]:
                  "You have reached the contact list limit for your current plan.",
                [LimitReason.TEAM_MEMBER]:
                  "You have reached the team member limit for your current plan.",
                [LimitReason.WEBHOOK]:
                  "You have reached the webhook limit for your current plan.",
                [LimitReason.EMAIL_BLOCKED]:
                  "Email sending is currently limited on your plan.",
                [LimitReason.EMAIL_DAILY_LIMIT_REACHED]:
                  "You have reached your daily sending limit.",
                [LimitReason.EMAIL_FREE_PLAN_MONTHLY_LIMIT_REACHED]:
                  "You have reached your monthly sending limit.",
                [LimitReason.MARKETING_NOT_AVAILABLE]:
                  "Contacts, Broadcasts, and Campaigns are not available on the Free plan.",
              };
              return reason
                ? `${messages[reason] ?? ""} Upgrade to continue.`
                : "Your current plan does not include this feature.";
            })()}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 rounded-lg border border-border/60 bg-muted/20 p-4">
          <p className="text-sm text-muted-foreground">
            Compare plans, review limits, and complete checkout securely from Billing.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal}>
              Not now
            </Button>
            <Button asChild onClick={closeModal}>
              <Link href="/settings/billing">View plans</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
