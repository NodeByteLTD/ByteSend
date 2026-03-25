"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@usesend/ui/src/button";

const APP_URL = "/login";

export function TopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const featuresHref = isHome ? "#features" : "/#features";
  const pricingHref = isHome ? "#pricing" : "/#pricing";

  return (
    <header className="py-3 border-b border-border/50 sticky top-0 z-20 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-5xl px-6 flex items-center justify-between gap-4 text-sm">
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo-squircle.png" alt="ByteSend" width={28} height={28} />
          <span className="text-foreground font-semibold text-base group-hover:text-primary transition-colors">ByteSend</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-muted-foreground">
          <Link href={featuresHref} className="hover:text-foreground transition-colors text-[13px]">Features</Link>
          <Link href={pricingHref} className="hover:text-foreground transition-colors text-[13px]">Pricing</Link>
          <a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors text-[13px]">Docs</a>
          <Button size="sm" className="ml-2 rounded-lg" asChild>
            <Link href={APP_URL}>Get started</Link>
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          aria-label="Open menu"
          className="sm:hidden p-1.5 rounded-lg hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-border/50 bg-background/95 backdrop-blur-lg">
          <div className="mx-auto max-w-5xl px-6 py-4 flex flex-col gap-1 text-sm">
            <Link href={featuresHref} className="py-2.5 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Features</Link>
            <Link href={pricingHref} className="py-2.5 hover:text-primary transition-colors" onClick={() => setOpen(false)}>Pricing</Link>
            <a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer" className="py-2.5 hover:text-primary transition-colors">Docs</a>
            <Button className="w-full mt-2 rounded-lg" asChild>
              <Link href={APP_URL}>Get started</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
