"use client";

import { AppSidebar } from "~/components/AppSideBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@bytesend/ui/src/sidebar";
import { UpgradeModal } from "~/components/payments/UpgradeModal";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Analytics",
  logs: "Logs",
  emails: "Emails",
  templates: "Templates",
  suppressions: "Suppressions",
  contacts: "Contacts",
  campaigns: "Campaigns",
  broadcasts: "Broadcasts",
  domains: "Domains",
  webhooks: "Webhooks",
  "dev-settings": "Developer Settings",
  settings: "Settings",
  admin: "Admin",
  "join-team": "Join Team",
  smtp: "SMTP",
  billing: "Billing",
  team: "Team",
  users: "Users",
  "email-analytics": "Email Analytics",
};

function buildBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = ROUTE_LABELS[seg] ?? seg.replace(/-/g, " ");
    crumbs.push({ label, href: path });
  }
  return crumbs;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      mainRef.current.scrollLeft = 0;
    }
  }, [pathname]);

  const crumbs = buildBreadcrumbs(pathname ?? "");

  return (
    <div className="h-dvh overflow-hidden bg-background">
      <SidebarProvider className="h-full">
        <AppSidebar />
        <SidebarInset className="min-w-0">
          {/* Top header bar */}
          <header className="shrink-0 z-10 flex h-11 items-center gap-2 border-b border-border/30 bg-background/80 backdrop-blur-xl px-3 md:px-4">
            <SidebarTrigger className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground transition-colors" />
            <div className="h-4 w-px bg-border/40 shrink-0" />
            <nav className="flex items-center gap-1 min-w-0 overflow-hidden">
              {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                  <span key={crumb.href} className="flex items-center gap-1 min-w-0">
                    {i > 0 && (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                    )}
                    <span
                      className={`text-sm capitalize truncate ${isLast
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                        }`}
                    >
                      {crumb.label}
                    </span>
                  </span>
                );
              })}
            </nav>
          </header>
          <main
            ref={mainRef}
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6"
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <UpgradeModal />
    </div>
  );
}
