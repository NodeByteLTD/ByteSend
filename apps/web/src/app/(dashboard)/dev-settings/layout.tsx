"use client";

import { SettingsNavButton } from "./settings-nav-button";

export const dynamic = "force-static";

export default function ApiKeysPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Developer Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          API keys, SMTP credentials, and integration settings
        </p>
      </div>
      <div className="flex flex-wrap gap-1 border-b border-border/60">
        <SettingsNavButton href="/settings/api-keys">API Keys</SettingsNavButton>
        <SettingsNavButton href="/settings/smtp">SMTP</SettingsNavButton>
      </div>
      <div>{children}</div>
    </div>
  );
}
