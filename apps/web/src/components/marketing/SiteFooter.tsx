import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-3">
              <Image src="/logo-squircle.png" alt="ByteSend" width={28} height={28} />
              <span className="text-foreground font-semibold text-base group-hover:text-primary transition-colors">ByteSend</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reliable email infrastructure for developers and teams.
            </p>
            <a
              href="https://status.bytesend.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3"
              aria-label="Service status"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://status.bytesend.cloud/api/badge/1/status?upColor=2E9EFF&style=plastic"
                alt="Service status"
                className="h-5"
              />
            </a>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-foreground mb-3">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground text-[13px] transition-colors">Dashboard</Link></li>
              <li><a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-foreground text-[13px] transition-colors">Docs</a></li>
              <li><a href="https://discord.gg/nodebyte" target="_blank" rel="noopener noreferrer" className="hover:text-foreground text-[13px] transition-colors">Discord</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-foreground mb-3">Connect</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="mailto:hey@nodebyte.co.uk" className="hover:text-foreground text-[13px] transition-colors">Email</a></li>
              <li><a href="https://x.com/ByteSendCloud" target="_blank" rel="noopener noreferrer" className="hover:text-foreground text-[13px] transition-colors">X (Twitter)</a></li>
              <li><a href="https://bsky.app/profile/bytesend.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-foreground text-[13px] transition-colors">Bluesky</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground text-[13px] transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground text-[13px] transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} NodeByte LTD. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
