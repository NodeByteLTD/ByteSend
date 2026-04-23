"use client";

import { Domain } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { api } from "~/trpc/react";
import { DomainStatusBadge } from "./domain-badge";
import Spinner from "@bytesend/ui/src/spinner";
import { Globe, ChevronRight } from "lucide-react";

export default function DomainsList() {
  const domainsQuery = api.domain.domains.useQuery();

  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      {/* Table header */}
      <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 px-4 py-2.5 border-b border-border/60 bg-muted/30">
        <span className="text-xs font-medium text-muted-foreground">Domain</span>
        <span className="text-xs font-medium text-muted-foreground">Status</span>
        <span className="text-xs font-medium text-muted-foreground">Region</span>
        <span className="text-xs font-medium text-muted-foreground">Added</span>
        <span className="w-4" />
      </div>

      {domainsQuery.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="w-5 h-5" innerSvgClass="stroke-primary" />
        </div>
      ) : domainsQuery.data?.length ? (
        <div className="divide-y divide-border/40">
          {domainsQuery.data.map((domain) => (
            <DomainRow key={domain.id} domain={domain} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          <Globe className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">No domains yet</p>
          <p className="text-xs text-muted-foreground">Add a domain to start sending emails</p>
        </div>
      )}
    </div>
  );
}

const DomainRow: React.FC<{ domain: Domain }> = ({ domain }) => {
  return (
    <Link
      href={`/domains/${domain.id}`}
      className="flex sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-3 sm:gap-4 px-4 py-3.5 hover:bg-muted/30 transition-colors group"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium truncate">{domain.name}</span>
      </div>

      <div className="hidden sm:block">
        <DomainStatusBadge status={domain.status} />
      </div>

      <div className="hidden sm:block">
        <span className="text-sm text-muted-foreground">{domain.region}</span>
      </div>

      <div className="hidden sm:block">
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(domain.createdAt), { addSuffix: true })}
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto sm:hidden">
        <DomainStatusBadge status={domain.status} />
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0 hidden sm:block" />
    </Link>
  );
};