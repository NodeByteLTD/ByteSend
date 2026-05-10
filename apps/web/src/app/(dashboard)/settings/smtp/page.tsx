import { SmtpSettingsClient } from "../../dev-settings/smtp/smtp-settings-client";
import { env } from "~/env";
import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function SettingsSmtpPage() {
  const teamDetails = await api.team.getTeamDetails();

  return (
    <SmtpSettingsClient
      smtpHost={env.SMTP_HOST}
      smtpPort="465"
      smtpDefaultUsername={env.SMTP_USER}
      currentSmtpUsername={teamDetails.smtpUsername}
    />
  );
}