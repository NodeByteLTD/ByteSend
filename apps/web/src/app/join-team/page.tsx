import CreateTeam from "~/components/team/CreateTeam";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function JoinTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ inviteId?: string }>;
}) {
  const session = await getServerAuthSession();
  const params = await searchParams;

  if (!session) {
    const inviteId = params?.inviteId;
    redirect(`/login${inviteId ? `?inviteId=${inviteId}` : ""}`);
  }

  return <CreateTeam />;
}
