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

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollLeft = 0;
    }

    window.scrollTo({ left: 0 });
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
  }, [pathname]);

  return (
    <div className="h-full bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          {/* Top header bar */}
          <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b border-border/50 bg-background/80 backdrop-blur-lg px-4 md:px-6">
            <SidebarTrigger className="h-7 w-7 text-muted-foreground" />
            <div className="h-4 w-px bg-border/60" />
            <span className="text-sm text-muted-foreground font-medium capitalize truncate">
              {pathname?.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ?? "Dashboard"}
            </span>
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
