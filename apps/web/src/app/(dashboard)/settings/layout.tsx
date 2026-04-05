"use client";

import { useTeam } from "~/providers/team-context";
import { SettingsNavButton } from "../dev-settings/settings-nav-button";
import { isCloud } from "~/utils/common";

export const dynamic = "force-static";

export default function ApiKeysPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentIsAdmin } = useTeam();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Usage, billing, and team management
        </p>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-border/60">
        {isCloud() ? (
          <SettingsNavButton href="/settings">Usage</SettingsNavButton>
        ) : null}
        {currentIsAdmin && isCloud() ? (
          <SettingsNavButton href="/settings/billing">
            Billing
          </SettingsNavButton>
        ) : null}
        <SettingsNavButton href="/settings/team">Team</SettingsNavButton>
      </div>
      <div>{children}</div>
    </div>
  );
}
