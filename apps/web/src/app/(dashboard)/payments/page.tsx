"use client";

import { useState, useEffect } from "react";
import { Button } from "@bytesend/ui/src/button";
import Spinner from "@bytesend/ui/src/spinner";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { H1 } from "@bytesend/ui";

export default function PaymentsPage() {
  const searchParams = useSearchParams();

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  return (
    <div className="container mx-auto py-10">
      <H1>Payment {success ? "Success" : canceled ? "Canceled" : "Unknown"}</H1>
      {canceled ? (
        <Link href="/settings/billing">
          <Button>Go to billing</Button>
        </Link>
      ) : null}
      {success ? <VerifySuccess /> : null}
    </div>
  );
}

const TIMEOUT_MS = 30_000;

function VerifySuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const utils = api.useUtils();

  const { data: teams, refetch } = api.team.getTeams.useQuery(undefined, {
    refetchInterval: 3000,
  });

  const syncMutation = api.billing.syncSubscription.useMutation({
    onSuccess: async () => {
      await utils.team.getTeams.invalidate();
      await refetch();
    },
  });

  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), TIMEOUT_MS);
    return () => clearTimeout(t);
  }, []);

  // Use the active team ID from localStorage so we check the right team
  const [activeTeamId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("bytesend:active-team-id");
    return stored ? parseInt(stored, 10) : null;
  });

  const activeTeam = activeTeamId
    ? teams?.find((t) => t.id === activeTeamId) ?? teams?.[0]
    : teams?.[0];

  if (activeTeam?.plan !== "FREE") {
    return (
      <div>
        <div className="flex gap-2 items-center">
          <CheckCircle2 className="h-4 w-4 text-green shrink-0" />
          <p>Your account has been upgraded to the <strong>{activeTeam?.plan}</strong> plan.</p>
        </div>
        <Link href="/settings/billing" className="mt-8">
          <Button className="mt-8">Go to billing</Button>
        </Link>
      </div>
    );
  }

  if (timedOut || syncMutation.isError) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Your payment was received but the plan hasn&apos;t updated yet. Click below to sync directly from Stripe.
        </p>
        {sessionId && (
          <p className="text-xs text-muted-foreground">Session: <code>{sessionId}</code></p>
        )}
        {syncMutation.isError && (
          <p className="text-xs text-destructive">{syncMutation.error.message}</p>
        )}
        <div className="flex gap-3">
          <Button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
          >
            {syncMutation.isPending ? (
              <><Spinner className="h-4 w-4 mr-2" innerSvgClass="stroke-primary-foreground" /> Syncing...</>
            ) : "Sync from Stripe"}
          </Button>
          <Link href="/settings/billing">
            <Button variant="outline">Go to billing</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <Spinner
        className="h-5 w-5 stroke-muted-foreground"
        innerSvgClass=" stroke-muted-foreground"
      />
      <p className="text-muted-foreground">Verifying payment</p>
    </div>
  );
}
