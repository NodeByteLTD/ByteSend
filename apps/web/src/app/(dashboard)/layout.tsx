import { DashboardProvider } from "~/providers/dashboard-provider";
import { NextAuthProvider } from "~/providers/next-auth";
import { DashboardLayout } from "./dasboard-layout";
import { TRPCReactProvider } from "~/trpc/react";

export const dynamic = "force-static";

export default function AuthenticatedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <NextAuthProvider>
        <DashboardProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </DashboardProvider>
      </NextAuthProvider>
    </TRPCReactProvider>
  );
}
