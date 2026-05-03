import Image from "next/image";
import Link from "next/link";

import { TopNavClient } from "./TopNavClient";

export function TopNav() {
  return (
    <header className="py-3 border-b border-border/40 fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-5xl px-6 flex items-center justify-between gap-4 text-sm">
        {/* Logo — server-rendered, zero client JS */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo-squircle.png" alt="ByteSend" width={28} height={28} />
          <span className="text-foreground font-semibold text-base group-hover:text-primary transition-colors">ByteSend</span>
        </Link>

        {/* Desktop nav links — server-rendered */}
        <nav className="hidden sm:flex items-center gap-6 text-muted-foreground">
          <Link href="/#features" className="hover:text-foreground transition-colors text-[13px]">Features</Link>
          <Link href="/#pricing" className="hover:text-foreground transition-colors text-[13px]">Pricing</Link>
          <Link href="/changelog" className="hover:text-foreground transition-colors text-[13px]">Changelog</Link>
          <a href="https://discord.gg/xqkqzVRC4S" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors text-[13px]">Discord</a>
          <a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors text-[13px]">Docs</a>
        </nav>

        {/* Session CTA + mobile hamburger/menu — tiny client island */}
        <TopNavClient />
      </div>
    </header>
  );
}
