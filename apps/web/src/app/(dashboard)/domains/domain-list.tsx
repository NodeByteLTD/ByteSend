"use client";

import { Domain } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Switch } from "@bytesend/ui/src/switch";
import { api } from "~/trpc/react";
import React from "react";
import { StatusIndicator } from "./status-indicator";
import { DomainStatusBadge } from "./domain-badge";
import Spinner from "@bytesend/ui/src/spinner";

export default function DomainsList() {
  const domainsQuery = api.domain.domains.useQuery();

  return (
    <div className="flex flex-col gap-4">
      {domainsQuery.isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner
            className="w-6 h-6 mx-auto"
            innerSvgClass="stroke-primary"
          />
        </div>
      ) : domainsQuery.data?.length ? (
        domainsQuery.data?.map((domain) => (
          <DomainItem key={domain.id} domain={domain} />
        ))
      ) : (
        <div className="text-center py-16 text-muted-foreground">No domains added</div>
      )}
    </div>
  );
}

const DomainItem: React.FC<{ domain: Domain }> = ({ domain }) => {
  const updateDomain = api.domain.updateDomain.useMutation();
  const utils = api.useUtils();

  const [clickTracking, setClickTracking] = React.useState(
    domain.clickTracking
  );
  const [openTracking, setOpenTracking] = React.useState(domain.openTracking);

  function handleClickTrackingChange() {
    setClickTracking(!clickTracking);
    updateDomain.mutate(
      { id: domain.id, clickTracking: !clickTracking },
      {
        onSuccess: () => {
          utils.domain.domains.invalidate();
        },
      }
    );
  }

  function handleOpenTrackingChange() {
    setOpenTracking(!openTracking);
    updateDomain.mutate(
      { id: domain.id, openTracking: !openTracking },
      {
        onSuccess: () => {
          utils.domain.domains.invalidate();
        },
      }
    );
  }

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden hover:border-border transition-colors">
      <div className="flex items-stretch">
        <StatusIndicator status={domain.status} />
        <div className="flex-1 p-4 sm:p-5">
          {/* Mobile: stacked layout */}
          <div className="flex flex-col gap-4 sm:hidden">
            <div className="flex items-center justify-between">
              <Link
                href={`/domains/${domain.id}`}
                className="text-sm font-medium underline underline-offset-4 decoration-dashed truncate"
              >
                {domain.name}
              </Link>
              <DomainStatusBadge status={domain.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p>{formatDistanceToNow(new Date(domain.createdAt), { addSuffix: true })}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Region</p>
                <p>{domain.region}</p>
              </div>
            </div>
            <div className="flex gap-5">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={clickTracking}
                  onCheckedChange={handleClickTrackingChange}
                  className="data-[state=checked]:bg-success"
                />
                Click
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={openTracking}
                  onCheckedChange={handleOpenTrackingChange}
                  className="data-[state=checked]:bg-success"
                />
                Open
              </label>
            </div>
          </div>

          {/* Desktop: row layout */}
          <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="flex flex-col gap-1.5 min-w-0 flex-shrink">
              <Link
                href={`/domains/${domain.id}`}
                className="text-sm font-medium underline underline-offset-4 decoration-dashed truncate"
              >
                {domain.name}
              </Link>
              <DomainStatusBadge status={domain.status} />
            </div>
            <div className="flex items-center gap-8 shrink-0 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p>{formatDistanceToNow(new Date(domain.createdAt), { addSuffix: true })}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Region</p>
                <p>{domain.region}</p>
              </div>
              <label className="flex items-center gap-2">
                <Switch
                  checked={clickTracking}
                  onCheckedChange={handleClickTrackingChange}
                  className="data-[state=checked]:bg-success"
                />
                <span className="text-xs text-muted-foreground">Click</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch
                  checked={openTracking}
                  onCheckedChange={handleOpenTrackingChange}
                  className="data-[state=checked]:bg-success"
                />
                <span className="text-xs text-muted-foreground">Open</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
