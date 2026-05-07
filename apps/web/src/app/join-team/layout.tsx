import { TRPCReactProvider } from "~/trpc/react";

export default function JoinTeamLayout({ children }: { children: React.ReactNode }) {
  return <TRPCReactProvider>{children}</TRPCReactProvider>;
}
