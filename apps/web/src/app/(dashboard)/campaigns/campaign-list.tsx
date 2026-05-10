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
import CampaignCard from "./campaign-card";

export default function CampaignList() {
  const [page, setPage] = useUrlState("page", "1");
  const [status, setStatus] = useUrlState("status");
  const [search, setSearch] = useUrlState("search");

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 1000);

  const pageNumber = Number(page);

  const campaignsQuery = api.campaign.getCampaigns.useQuery(
    {
      page: pageNumber,
      status: status as CampaignStatus | null,
      search,
    },
    {
      refetchInterval: (query) => {
        const c = query.state.data?.campaigns;
        if (!c) return false;
        const shouldPoll = c.some(
          (campaign) =>
            campaign.status === CampaignStatus.RUNNING ||
            campaign.status === CampaignStatus.SCHEDULED
        );
        return shouldPoll ? 5000 : false;
      },
    }
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search input */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
            value={search || ""}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status filter */}
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
            <SelectItem
              value={CampaignStatus.SCHEDULED}
              className="capitalize"
            >
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
      {/* Campaign cards */}
      <div className="flex flex-col gap-4">
        {campaignsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-6 h-6" innerSvgClass="stroke-primary" />
          </div>
        ) : campaignsQuery.data?.campaigns.length ? (
          campaignsQuery.data?.campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))
import { FaBullhorn } from "react-icons/fa6";
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border/60 rounded-xl">
            <FaBullhorn className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-foreground">
              {search || status ? "No campaigns match your filters" : "No campaigns yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search || status
                ? "Try adjusting your search or status filter"
                : "Create your first campaign to get started"}
            </p>
          </div>
        )}
      </div>
      <div className="flex gap-4 justify-end">
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
