"use client";

import DomainsList from "./domain-list";
import AddDomain from "./add-domain";

export default function DomainsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Domains</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your verified sending domains</p>
        </div>
        <AddDomain />
      </div>
      <DomainsList />
    </div>
  );
}
