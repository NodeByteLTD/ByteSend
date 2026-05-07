"use client";

import { useState } from "react";
import InviteTeamMember from "./invite-team-member";
import TeamMembersList from "./team-members-list";
import TeamGeneralSettings from "./team-general-settings";
import { useTeam } from "~/providers/team-context";

type Tab = "general" | "members";

export default function TeamsPage() {
  const { currentIsAdmin } = useTeam();
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-border/40 mb-6">
        {(["general", "members"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "general" && <TeamGeneralSettings />}

      {tab === "members" && (
        <>
          {currentIsAdmin && (
            <div className="flex justify-end">
              <InviteTeamMember />
            </div>
          )}
          <TeamMembersList />
        </>
      )}
    </div>
  );
}
