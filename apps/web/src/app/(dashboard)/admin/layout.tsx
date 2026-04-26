"use client";

import { useSession } from "next-auth/react";
import { SettingsNavButton } from "../dev-settings/settings-nav-button";
import { isCloud } from "~/utils/common";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const isAdmin = session?.user.isAdmin ?? false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage infrastructure, users, and platform configuration
        </p>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-border/60 pb-0">
        <SettingsNavButton href="/admin">
          SES Configurations
        </SettingsNavButton>
        {isCloud() ? (
          <SettingsNavButton href="/admin/email-analytics">
            Email Analytics
          </SettingsNavButton>
        ) : null}
        {isCloud() ? (
          <SettingsNavButton href="/admin/domains">
            Domains
          </SettingsNavButton>
        ) : null}
        {isCloud() ? (
          <SettingsNavButton href="/admin/webhooks">
            Webhooks
          </SettingsNavButton>
        ) : null}
        {isCloud() ? (
          <SettingsNavButton href="/admin/billing">
            Billing
          </SettingsNavButton>
        ) : null}
        {isCloud() ? (
          <SettingsNavButton href="/admin/teams">
            Teams
          </SettingsNavButton>
        ) : null}
        {isCloud() && isAdmin ? (
          <SettingsNavButton href="/admin/users">
            Users
          </SettingsNavButton>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
}
