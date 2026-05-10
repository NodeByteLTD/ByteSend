"use client";

import { api } from "~/trpc/react";
import { useUrlState } from "~/hooks/useUrlState";
import { Button } from "@bytesend/ui/src/button";
import Spinner from "@bytesend/ui/src/spinner";
import { CampaignStatus } from "@prisma/client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@bytesend/ui/src/select";
import { Input } from "@bytesend/ui/src/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { FaBullhorn } from "react-icons/fa6";
import CampaignCard from "./campaign-card";

type MarketingIntent = "CAMPAIGN" | "BROADCAST";

interface CampaignListProps {
  intent: MarketingIntent;
  basePath: "/campaigns" | "/broadcasts";
}

export default function CampaignList({ intent, basePath }: CampaignListProps) {
  const [page, setPage] = useUrlState("page", "1");
  const [status, setStatus] = useUrlState("status");
  const [search, setSearch] = useUrlState("search");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const pageNumber = Number(page);
  const noun = intent === "BROADCAST" ? "broadcast" : "campaign";
  const nounPlural = `${noun}s`;

  const campaignsQuery = api.campaign.getCampaigns.useQuery(
    {
      page: pageNumber,
      status: status as CampaignStatus | null,
      search,
      intent,
    },
    {
      refetchInterval: (query) => {
        const c = query.state.data?.campaigns;
        if (!c) return false;
        const shouldPoll = c.some(
          (campaign) =>
            campaign.status === CampaignStatus.RUNNING ||
            campaign.status === CampaignStatus.SCHEDULED,
        );
        return shouldPoll ? 5000 : false;
      },
    },
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder={`Search ${nounPlural}...`}
            value={search || ""}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={status ?? "all"}
          onValueChange={(val) => setStatus(val === "all" ? null : val)}
        >
          <SelectTrigger className="w-45 capitalize">
            {status ? status.toLowerCase() : "All statuses"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="capitalize">
              All statuses
            </SelectItem>
            <SelectItem value={CampaignStatus.DRAFT} className="capitalize">
              Draft
            </SelectItem>
            <SelectItem value={CampaignStatus.SCHEDULED} className="capitalize">
              Scheduled
            </SelectItem>
            <SelectItem value={CampaignStatus.RUNNING} className="capitalize">
              Running
            </SelectItem>
            <SelectItem value={CampaignStatus.PAUSED} className="capitalize">
              Paused
            </SelectItem>
            <SelectItem value={CampaignStatus.SENT} className="capitalize">
              Sent
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        {campaignsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-6 w-6" innerSvgClass="stroke-primary" />
          </div>
        ) : campaignsQuery.data?.campaigns.length ? (
          campaignsQuery.data.campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} basePath={basePath} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-20 text-center">
            <FaBullhorn className="mb-3 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">
              {search || status
                ? `No ${nounPlural} match your filters`
                : `No ${nounPlural} yet`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || status
                ? "Try adjusting your search or status filter"
                : `Create your first ${noun} to get started`}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          size="sm"
          onClick={() => setPage((pageNumber - 1).toString())}
          disabled={pageNumber === 1}
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => setPage((pageNumber + 1).toString())}
          disabled={pageNumber >= (campaignsQuery.data?.totalPage ?? 0)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
