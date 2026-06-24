import Link from "next/link";
import { FaDiscord } from "react-icons/fa6";

export default function BannedPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-160 w-200 rounded-full bg-destructive/8 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-120 rounded-full bg-destructive/5 blur-[120px]" />

      <div className="relative text-center space-y-8 max-w-lg">
        <div className="relative select-none">
          <span className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter bg-linear-to-b from-foreground/20 to-foreground/3 bg-clip-text text-transparent">
            Ban
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter bg-linear-to-b from-destructive/60 to-destructive/20 bg-clip-text text-transparent blur-xs">
            Ban
          </span>
        </div>

        <div className="space-y-3 -mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Your account has been suspended
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto">
            Access to ByteSend has been restricted. If you believe this is a
            mistake, please reach out to us on Discord and we&apos;ll look into it.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="https://discord.com/invite/BU8n8pJv8S"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#4752c4] transition-colors shadow-lg shadow-[#5865F2]/20"
          >
            <FaDiscord className="h-4 w-4" />
            Join our Discord
          </Link>
        </div>

        <p className="text-xs text-muted-foreground/30 pt-4">
          © {new Date().getFullYear()} NodeByte LTD
        </p>
      </div>
    </main>
  );
}
