"use client";

import EmailList from "./email-list";
import { H1 } from "@usesend/ui";

export default function EmailsPage() {
  return (
    <div className="space-y-6">
      <div>
        <H1>Emails</H1>
        <p className="text-sm text-muted-foreground mt-1">View and track all sent emails</p>
      </div>
      <EmailList />
    </div>
  );
}
