"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { H1 } from "@bytesend/ui";
import { api } from "~/trpc/react";
import Spinner from "@bytesend/ui/src/spinner";
import { Input } from "@bytesend/ui/src/input";
import { Badge } from "@bytesend/ui/src/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@bytesend/ui/src/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@bytesend/ui/src/table";

const SOURCE_FILTERS = ["ALL", "EMAIL", "WEBHOOK", "NOTIFICATION"] as const;

type SourceFilter = (typeof SOURCE_FILTERS)[number];

export default function LogsPage() {
    const [source, setSource] = useState<SourceFilter>("ALL");
    const [status, setStatus] = useState("ALL");
    const [search, setSearch] = useState("");

    const logsQuery = api.logs.list.useQuery({
        limit: 200,
        source: source === "ALL" ? undefined : source,
    });

    const rows = useMemo(() => {
        const base = logsQuery.data ?? [];
        const searchTerm = search.trim().toLowerCase();

        return base.filter((row) => {
            if (status !== "ALL" && row.status !== status) return false;

            if (!searchTerm) return true;

            const haystack = [
                row.title,
                row.kind,
                row.status,
                row.target,
                row.metadata?.lastError,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return haystack.includes(searchTerm);
        });
    }, [logsQuery.data, search, status]);

    const statusOptions = useMemo(() => {
        const unique = new Set<string>();
        for (const row of logsQuery.data ?? []) unique.add(row.status);
        return Array.from(unique).sort();
    }, [logsQuery.data]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <H1>Logs</H1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Unified audit trail for email events, webhook deliveries, and notifications.
                    </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search logs"
                        className="sm:col-span-1"
                    />

                    <Select value={source} onValueChange={(v) => setSource(v as SourceFilter)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Source" />
                        </SelectTrigger>
                        <SelectContent>
                            {SOURCE_FILTERS.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">ALL</SelectItem>
                            {statusOptions.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-xl border border-border/60">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30">
                            <TableHead className="rounded-tl-xl">Time</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead className="rounded-tr-xl">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logsQuery.isLoading ? (
                            <TableRow className="h-28">
                                <TableCell colSpan={6} className="text-center">
                                    <Spinner className="mx-auto h-5 w-5" innerSvgClass="stroke-primary" />
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow className="h-28">
                                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                                    No logs found for this filter set.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={`${row.source}-${row.id}`}>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{row.source}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{row.title}</div>
                                        <div className="text-xs text-muted-foreground">{row.kind}</div>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={row.status} />
                                    </TableCell>
                                    <TableCell className="max-w-80 truncate text-sm text-muted-foreground">
                                        {row.target}
                                    </TableCell>
                                    <TableCell className="max-w-80 truncate text-xs text-muted-foreground">
                                        {row.metadata?.lastError
                                            ? `Error: ${row.metadata.lastError}`
                                            : row.metadata?.responseStatus
                                                ? `HTTP ${row.metadata.responseStatus}`
                                                : "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const variant = statusColor(status);

    return (
        <Badge
            variant="outline"
            className={variant}
        >
            {status}
        </Badge>
    );
}

function statusColor(status: string): string {
    if (["DELIVERED", "SENT", "OPENED", "CLICKED"].includes(status)) {
        return "border-green/40 text-green";
    }
    if (["FAILED", "BOUNCED", "COMPLAINED", "REJECTED", "DISCARDED"].includes(status)) {
        return "border-red/40 text-red";
    }
    if (["PENDING", "IN_PROGRESS", "QUEUED", "SCHEDULED"].includes(status)) {
        return "border-yellow/40 text-yellow";
    }
    return "border-border/60 text-muted-foreground";
}
