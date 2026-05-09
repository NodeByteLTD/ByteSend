"use client";

import InviteTeamMember from "../team/invite-team-member";
import TeamMembersList from "../team/team-members-list";
import { useTeam } from "~/providers/team-context";

export default function MembersPage() {
  const { currentIsAdmin } = useTeam();

  return (
    <div>
      {currentIsAdmin && (
        <div className="flex justify-end">
          <InviteTeamMember />
        </div>
      )}
      <TeamMembersList />
    </div>
  );
}
