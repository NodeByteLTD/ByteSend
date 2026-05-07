"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@bytesend/ui/src/button";
import { Input } from "@bytesend/ui/src/input";
import Spinner from "@bytesend/ui/src/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@bytesend/ui/src/table";
import { api } from "~/trpc/react";
import { isCloud } from "~/utils/common";
import { WebhookStatusBadge } from "../../webhooks/webhook-status-badge";
import type { AppRouter } from "~/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type AdminWebhook = NonNullable<RouterOutputs["admin"]["listAdminWebhooks"]>["webhooks"][number];

export default function AdminWebhooksPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [queryInput, setQueryInput] = useState("");

  const webhooksQuery = api.admin.listAdminWebhooks.useQuery(
    { page, pageSize: 20, query: query || undefined },
    { placeholderData: (prev) => prev },
  );

  if (!isCloud()) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
        Webhook administration is available only in the cloud deployment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Webhooks</h2>
        <div className="flex items-center gap-2">
          <Input
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setPage(1);
                setQuery(queryInput);
              }
            }}
            placeholder="Filter by URL, team, or creator email"
            className="h-9 w-[320px]"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage(1);
              setQuery(queryInput);
            }}
          >
            Filter
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="rounded-tl-xl">Webhook</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Failures</TableHead>
              <TableHead>Last success</TableHead>
              <TableHead className="rounded-tr-xl">Last failure</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooksQuery.isLoading ? (
              <TableRow className="h-32">
                <TableCell colSpan={7} className="py-4 text-center">
                  <Spinner className="mx-auto h-6 w-6" innerSvgClass="stroke-primary" />
                </TableCell>
              </TableRow>
            ) : webhooksQuery.isError ? (
              <TableRow className="h-32">
                <TableCell colSpan={7} className="py-4 text-center text-destructive">
                  Failed to load webhooks.
                </TableCell>
              </TableRow>
            ) : !webhooksQuery.data?.webhooks.length ? (
              <TableRow className="h-32">
                <TableCell colSpan={7} className="py-4 text-center">
                  No webhooks found.
                </TableCell>
              </TableRow>
            ) : (
              webhooksQuery.data.webhooks.map((webhook: AdminWebhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="max-w-[280px]">
                    <div>
                      <p className="truncate font-medium">{webhook.url}</p>
                      <p className="text-xs text-muted-foreground">
                        {webhook.createdBy?.email ?? "Unknown creator"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{webhook.team.name}</p>
                      <p className="text-xs text-muted-foreground">{webhook.team.plan}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <WebhookStatusBadge status={webhook.status} />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[220px] text-xs text-muted-foreground">
                      {webhook.eventTypes.slice(0, 3).join(", ")}
                      {webhook.eventTypes.length > 3 ? ` +${webhook.eventTypes.length - 3}` : ""}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {webhook.consecutiveFailures}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {webhook.lastSuccessAt
                      ? formatDistanceToNow(new Date(webhook.lastSuccessAt), { addSuffix: true })
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {webhook.lastFailureAt
                      ? formatDistanceToNow(new Date(webhook.lastFailureAt), { addSuffix: true })
                      : "Never"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {webhooksQuery.data && webhooksQuery.data.total > 20 ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {(page - 1) * 20 + 1}–{Math.min(page * 20, webhooksQuery.data.total)} of {webhooksQuery.data.total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page * 20 >= webhooksQuery.data.total}
              onClick={() => setPage((current) => current + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}