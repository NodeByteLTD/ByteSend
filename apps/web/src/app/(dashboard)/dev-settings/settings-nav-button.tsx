"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const SettingsNavButton: React.FC<{
  href: string;
  children: React.ReactNode;
  comingSoon?: boolean;
}> = ({ href, children, comingSoon }) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  if (comingSoon) {
    return (
      <span className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed select-none -mb-px border-b-2 border-transparent">
        {children}
        <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full leading-none">
          soon
        </span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`relative flex text-sm items-center gap-2 px-3 py-2 -mb-px border-b-2 transition-all duration-150 ${
        isActive
          ? "border-foreground text-foreground font-medium"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
};
