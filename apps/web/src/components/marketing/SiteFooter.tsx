import Image from "next/image";
import Link from "next/link";
import { env } from "~/env";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function BlueSkyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.6 3.476 6.158 3.226-4.477.753-5.952 3.249-3.349 5.744C5.96 21.744 8.986 22.558 12 18.9c3.014 3.658 6.04 2.844 8.567.317 2.603-2.495 1.128-4.991-3.349-5.744 2.558.25 5.373-.6 6.158-3.226.246-.828.624-5.789.624-6.479 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
    </svg>
  );
}

const isCloud = env.NEXT_PUBLIC_IS_CLOUD;

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border/30">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left: brand + links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/logo-squircle.png" alt="ByteSend" width={22} height={22} />
              <span className="text-foreground font-semibold text-sm group-hover:text-primary transition-colors">ByteSend</span>
            </Link>
            <nav className="flex items-center gap-4 text-[13px] text-muted-foreground">
              <a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Docs</a>
              {isCloud && <Link href="/changelog" className="hover:text-foreground transition-colors">Changelog</Link>}
              {isCloud && <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>}
              {isCloud && <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>}
              {isCloud && <a href="https://status.bytesend.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Status</a>}
            </nav>
          </div>

          {/* Right: social icons */}
          <div className="flex items-center gap-3">
            <a href="https://discord.gg/xqkqzVRC4S" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Discord">
              <DiscordIcon className="size-4.5" />
            </a>
            <a href="https://x.com/TryByteSend" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="X (Twitter)">
              <XIcon className="size-4" />
            </a>
            <a href="https://bsky.app/profile/nodebyte.host" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Bluesky">
              <BlueSkyIcon className="size-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/20 text-center text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} NodeByte LTD
        </div>
      </div>
    </footer>
  );
}
