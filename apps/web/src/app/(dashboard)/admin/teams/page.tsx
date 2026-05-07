"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@bytesend/ui/src/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@bytesend/ui/src/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@bytesend/ui/src/form";
import { Input } from "@bytesend/ui/src/input";
import { Switch } from "@bytesend/ui/src/switch";
import Spinner from "@bytesend/ui/src/spinner";
import { toast } from "@bytesend/ui/src/toaster";
import { Badge } from "@bytesend/ui/src/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bytesend/ui/src/select";
import { formatDistanceToNow } from "date-fns";

import { api } from "~/trpc/react";
import type { AppRouter } from "~/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";
import { isCloud } from "~/utils/common";
import { cn } from "@bytesend/ui/lib/utils";

const searchSchema = z.object({
  query: z
    .string({ required_error: "Enter a team ID, name, domain, member email, or subscription ID" })
    .trim()
    .min(1, "Enter a team ID, name, domain, member email, or subscription ID"),
});

type SearchInput = z.infer<typeof searchSchema>;

type RouterOutputs = inferRouterOutputs<AppRouter>;
type TeamAdmin = NonNullable<RouterOutputs["admin"]["findTeam"]>;
type ListedTeam = NonNullable<RouterOutputs["admin"]["listTeams"]>["teams"][number];

function AdminStatusPill({
  active,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        active
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-muted text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-emerald-500" : "bg-muted-foreground",
        )}
      />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

const updateSchema = z.object({
  apiRateLimit: z.coerce.number().int().min(1).max(10_000),
  dailyEmailLimit: z.coerce.number().int().min(0).max(10_000_000),
  isBlocked: z.boolean(),
  plan: z.enum(["FREE", "HOBBY", "LITE", "BASIC", "LIFETIME"]),
});

type UpdateInput = z.infer<typeof updateSchema>;

export default function AdminTeamsPage() {
  const [team, setTeam] = useState<TeamAdmin | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [teamsPage, setTeamsPage] = useState(1);
  const [teamsQuery, setTeamsQuery] = useState("");
  const [teamsQueryInput, setTeamsQueryInput] = useState("");

  const searchForm = useForm<SearchInput>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  const updateForm = useForm<UpdateInput>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      apiRateLimit: 1,
      dailyEmailLimit: 0,
      isBlocked: false,
      plan: "FREE",
    },
  });

  useEffect(() => {
    if (team) {
      updateForm.reset({
        apiRateLimit: team.apiRateLimit,
        dailyEmailLimit: team.dailyEmailLimit,
        isBlocked: team.isBlocked,
        plan: team.plan,
      });
    }
  }, [team, updateForm]);

  if (!isCloud()) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
        Team administration tools are available only in the cloud deployment.
      </div>
    );
  }

  const findTeam = api.admin.findTeam.useMutation({
    onSuccess: (data) => {
      setHasSearched(true);
      if (!data) {
        setTeam(null);
        toast.info("No team found for that query");
        return;
      }
      setTeam(data);
    },
    onError: (error) => {
      toast.error(error.message ?? "Unable to search for team");
    },
  });

  const updateTeam = api.admin.updateTeamSettings.useMutation({
    onSuccess: (updated) => {
      setTeam(updated);
      updateForm.reset({
        apiRateLimit: updated.apiRateLimit,
        dailyEmailLimit: updated.dailyEmailLimit,
        isBlocked: updated.isBlocked,
        plan: updated.plan,
      });
      toast.success("Team settings updated");
    },
    onError: (error) => {
      toast.error(error.message ?? "Unable to update team settings");
    },
  });

  const onSearchSubmit = (values: SearchInput) => {
    setTeam(null);
    setHasSearched(false);
    findTeam.mutate(values);
  };

  const onUpdateSubmit = (values: UpdateInput) => {
    if (!team) return;
    updateTeam.mutate({ teamId: team.id, ...values });
  };

  const listTeams = api.admin.listTeams.useQuery(
    { page: teamsPage, pageSize: 20, query: teamsQuery || undefined },
    { placeholderData: (prev) => prev },
  );

  return (
    <div className="space-y-8">
      <div className="rounded-lg border p-6 shadow-sm">
        <Form {...searchForm}>
          <form
            onSubmit={searchForm.handleSubmit(onSearchSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={searchForm.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team lookup</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Team ID, team name, domain, member email, or subscription ID"
                      autoComplete="off"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={findTeam.isPending}>
              {findTeam.isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> Searching...
                </>
              ) : (
                "Lookup team"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {findTeam.isPending ? null : hasSearched && !team ? (
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          No team matched that query. Try another search.
        </div>
      ) : null}

      {team ? (
        <div className="space-y-6 rounded-lg border p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Team</p>
              <p className="text-xl font-semibold">{team.name}</p>
              <p className="text-xs text-muted-foreground">
                ID #{team.id} • Created {formatDistanceToNow(new Date(team.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">Plan: {team.plan}</Badge>
              <Badge variant={team.isBlocked ? "destructive" : "outline"}>
                {team.isBlocked ? "Blocked" : "Active"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Members</h3>
              <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                {team.teamUsers.length ? (
                  team.teamUsers.map((member) => (
                    <div
                      key={member.user.id}
                      className="flex items-center justify-between rounded-md bg-background px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-medium">{member.user.name ?? member.user.email}</p>
                        <p className="text-xs text-muted-foreground">{member.user.email}</p>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No members found.</p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Domains</h3>
              <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                {team.domains.length ? (
                  team.domains.map((domain) => (
                    <div
                      key={domain.id}
                      className="flex items-center justify-between rounded-md bg-background px-3 py-2 text-sm"
                    >
                      <span>{domain.name}</span>
                      <Badge variant={domain.status === "SUCCESS" ? "outline" : "secondary"}>
                        {domain.status === "SUCCESS"
                          ? "Verified"
                          : domain.status.toLowerCase()}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No domains connected.</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/10 p-4">
            <p className="text-sm text-muted-foreground">
              Billing contact: {team.billingEmail ?? "Not set"}
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="grid gap-6 lg:grid-cols-2">
                <FormField
                  control={updateForm.control}
                  name="apiRateLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API rate limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={10000}
                          {...field}
                          value={Number.isNaN(field.value) ? 1 : field.value}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          disabled={updateTeam.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="dailyEmailLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily email limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={10_000_000}
                          {...field}
                          value={Number.isNaN(field.value) ? 0 : field.value}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          disabled={updateTeam.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={updateTeam.isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FREE">Free</SelectItem>
                            <SelectItem value="HOBBY">Hobby</SelectItem>
                            <SelectItem value="LITE">Lite</SelectItem>
                            <SelectItem value="BASIC">Professional</SelectItem>
                            <SelectItem value="LIFETIME">Lifetime</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="isBlocked"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blocked</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-3 rounded-md border px-3 py-2">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={updateTeam.isPending}
                          />
                          <span className="text-sm text-muted-foreground">
                            {field.value ? "Team is blocked" : "Team is active"}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="lg:col-span-2 flex justify-end">
                  <Button type="submit" disabled={updateTeam.isPending}>
                    {updateTeam.isPending ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" /> Saving...
                      </>
                    ) : (
                      "Update team"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      ) : null}

      {/* All teams list */}
      <div className="space-y-4 rounded-xl border p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">All teams</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={teamsQueryInput}
              onChange={(e) => setTeamsQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setTeamsPage(1);
                  setTeamsQuery(teamsQueryInput);
                }
              }}
              placeholder="Filter by name, email\u2026"
              className="h-8 rounded-md border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setTeamsPage(1); setTeamsQuery(teamsQueryInput); }}
            >
              Filter
            </Button>
          </div>
        </div>

        {listTeams.isLoading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" /> Loading teams\u2026
          </div>
        ) : listTeams.isError ? (
          <p className="py-4 text-sm text-destructive">Failed to load teams.</p>
        ) : !listTeams.data?.teams.length ? (
          <p className="py-4 text-sm text-muted-foreground">No teams found.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="rounded-tl-xl">Team</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="rounded-tr-xl text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listTeams.data.teams.map((t: ListedTeam) => (
                  <TableRow key={t.id} className={cn(t.isBlocked && "opacity-60")}>
                    <TableCell>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">ID #{t.id}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t.plan}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <AdminStatusPill
                        active={!t.isBlocked}
                        activeLabel="Active"
                        inactiveLabel="Blocked"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-foreground hover:bg-muted"
                        onClick={() => {
                          setTeamsPage(1);
                          setHasSearched(false);
                          setTeam(null);
                          findTeam.mutate({ query: t.name });
                        }}
                      >
                        View team
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {listTeams.data && listTeams.data.total > 20 ? (
          <div className="flex items-center justify-between border-t pt-3 text-sm">
            <span className="text-muted-foreground">
              {(teamsPage - 1) * 20 + 1}\u2013{Math.min(teamsPage * 20, listTeams.data.total)} of {listTeams.data.total}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={teamsPage <= 1}
                onClick={() => setTeamsPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={teamsPage * 20 >= listTeams.data.total}
                onClick={() => setTeamsPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
