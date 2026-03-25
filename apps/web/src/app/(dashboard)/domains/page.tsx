"use client";

import DomainsList from "./domain-list";
import AddDomain from "./add-domain";
import { H1 } from "@usesend/ui";

export default function DomainsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1>Domains</H1>
          <p className="text-sm text-muted-foreground mt-1">Manage your verified sending domains</p>
        </div>
        <AddDomain />
      </div>
      <DomainsList />
    </div>
  );
}
