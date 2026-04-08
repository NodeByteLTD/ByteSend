"use client";

import { useState } from "react";
import { z } from "zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@bytesend/ui/src/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@bytesend/ui/src/form";
import { Input } from "@bytesend/ui/src/input";
import Spinner from "@bytesend/ui/src/spinner";
import { toast } from "@bytesend/ui/src/toaster";
import { Switch } from "@bytesend/ui/src/switch";
import { Badge } from "@bytesend/ui/src/badge";
import { formatDistanceToNow } from "date-fns";

import { api } from "~/trpc/react";
import { isCloud } from "~/utils/common";
import type { AppRouter } from "~/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

const searchSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Enter a valid email address"),
});

type SearchInput = z.infer<typeof searchSchema>;

type RouterOutputs = inferRouterOutputs<AppRouter>;
type ManagedUser = NonNullable<RouterOutputs["admin"]["findUserByEmail"]>;
type ListedUser = NonNullable<RouterOutputs["admin"]["listUsers"]>["users"][number];

function formatDisplayName(email: string) {
  const localPart = email.split("@")[0] ?? email;
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ") || localPart;
}

function UserToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  isPending,
  dangerous,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  isPending: boolean;
  dangerous?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={isPending}
          className={dangerous && checked ? "data-[state=checked]:bg-destructive" : undefined}
        />
        {isPending ? <Spinner className="h-4 w-4" /> : null}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [userResult, setUserResult] = useState<ManagedUser | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersQuery, setUsersQuery] = useState("");
  const [usersQueryInput, setUsersQueryInput] = useState("");

  const form = useForm<SearchInput>({
    resolver: zodResolver(searchSchema),
    defaultValues: { email: "" },
  });

  const findUser = api.admin.findUserByEmail.useMutation({
    onSuccess: (data) => {
      setHasSearched(true);
      if (!data) {
        setUserResult(null);
        toast.info("No user found for that email");
        return;
      }
      setUserResult(data);
    },
    onError: (error) => {
      toast.error(error.message ?? "Unable to search for user");
    },
  });

  const updateBeta = api.admin.updateUserBeta.useMutation({
    onSuccess: (updated) => {
      setUserResult(updated);
      toast.success(
        updated.isBetaUser ? "Beta access granted" : "Beta access revoked",
      );
    },
    onError: (error) => {
      toast.error(error.message ?? "Unable to update beta status");
    },
  });

  const setAdmin = api.admin.setUserAdmin.useMutation({
    onSuccess: (updated) => {
      setUserResult(updated);
      toast.success(
        updated.isAdmin ? "Admin access granted" : "Admin access revoked",
      );
    },
    onError: (error) => {
      toast.error(error.message ?? "Unable to update admin status");
    },
  });

  const banUser = api.admin.banUser.useMutation({
    onSuccess: (updated) => {
      setUserResult(updated);
      toast.success(updated.isBanned ? "User banned" : "User unbanned");
    },
    onError: (error) => {
      toast.error(error.message ?? "Unable to update ban status");
    },
  });

  const listUsers = api.admin.listUsers.useQuery(
    { page: usersPage, pageSize: 20, query: usersQuery || undefined },
    { placeholderData: (prev) => prev },
  );

  const onSubmit = (values: SearchInput) => {
    setHasSearched(false);
    setUserResult(null);
    findUser.mutate(values);
  };

  if (!isCloud()) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-sm text-muted-foreground">
        User management is available only in the cloud deployment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="rounded-lg border p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="user@example.com"
                      autoComplete="off"
                      {...field}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={findUser.isPending}>
              {findUser.isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> Searching...
                </>
              ) : (
                "Lookup user"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {!findUser.isPending && hasSearched && !userResult ? (
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          No user matched that email. Try another search.
        </div>
      ) : null}

      {userResult ? (
        <div className="space-y-4 rounded-lg border p-6 shadow-sm">
          {/* User header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold">{userResult.name ?? "—"}</p>
              <p className="text-sm text-muted-foreground">{userResult.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Joined{" "}
                {formatDistanceToNow(new Date(userResult.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {userResult.isBanned && (
                <Badge variant="destructive">Banned</Badge>
              )}
              {userResult.isBetaUser && (
                <Badge variant="secondary">Beta</Badge>
              )}
              {userResult.isAdmin && (
                <Badge variant="outline">Admin</Badge>
              )}
              {!userResult.isBanned && !userResult.isBetaUser && !userResult.isAdmin && (
                <Badge variant="outline">Standard</Badge>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4 border-t pt-4">
            <UserToggleRow
              label="Beta access"
              description="Grant this user access to beta features before public release."
              checked={userResult.isBetaUser}
              onCheckedChange={(val) =>
                updateBeta.mutate({ userId: userResult.id, isBetaUser: val })
              }
              isPending={updateBeta.isPending}
            />

            <UserToggleRow
              label="Admin"
              description="Grants access to the admin panel — SES configs, team management, and analytics. Admins cannot manage other users or assign roles."
              checked={userResult.isAdmin}
              onCheckedChange={(val) =>
                setAdmin.mutate({ userId: userResult.id, isAdmin: val })
              }
              isPending={setAdmin.isPending}
              dangerous
            />

            <UserToggleRow
              label="Banned"
              description="Prevents this user from signing in and accessing ByteSend. Use for abuse or ToS violations."
              checked={userResult.isBanned}
              onCheckedChange={(val) =>
                banUser.mutate({ userId: userResult.id, isBanned: val })
              }
              isPending={banUser.isPending}
              dangerous
            />
          </div>
        </div>
      ) : null}

      {/* All users list */}
      <div className="space-y-4 rounded-lg border p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">All users</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={usersQueryInput}
              onChange={(e) => setUsersQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setUsersPage(1);
                  setUsersQuery(usersQueryInput);
                }
              }}
              placeholder="Filter by name or email…"
              className="h-8 rounded-md border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setUsersPage(1); setUsersQuery(usersQueryInput); }}
            >
              Filter
            </Button>
          </div>
        </div>

        {listUsers.isLoading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" /> Loading users…
          </div>
        ) : listUsers.isError ? (
          <p className="py-4 text-sm text-destructive">Failed to load users.</p>
        ) : !listUsers.data?.users.length ? (
          <p className="py-4 text-sm text-muted-foreground">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">User</th>
                  <th className="pb-2 pr-4 font-medium">Joined</th>
                  <th className="pb-2 font-medium">Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listUsers.data.users.map((u: ListedUser) => (
                  <tr key={u.id} className={u.isBanned ? "opacity-60" : undefined}>
                    <td className="py-2 pr-4">
                      <p className="font-medium">{u.name ?? formatDisplayName(u.email ?? "")}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="py-2 pr-4 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                    </td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        {u.isBanned && <Badge variant="destructive">Banned</Badge>}
                        {u.isBetaUser && <Badge variant="secondary">Beta</Badge>}
                        {u.isAdmin && <Badge variant="outline">Admin</Badge>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {listUsers.data && listUsers.data.total > 20 ? (
          <div className="flex items-center justify-between border-t pt-3 text-sm">
            <span className="text-muted-foreground">
              {(usersPage - 1) * 20 + 1}–{Math.min(usersPage * 20, listUsers.data.total)} of {listUsers.data.total}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={usersPage <= 1}
                onClick={() => setUsersPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={usersPage * 20 >= listUsers.data.total}
                onClick={() => setUsersPage((p) => p + 1)}
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
