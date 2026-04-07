import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Layered gradient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-160 w-200 rounded-full bg-primary/8 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-120 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative text-center space-y-8 max-w-lg">
        {/* Giant 404 with gradient text */}
        <div className="relative select-none">
          <span className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter bg-linear-to-b from-foreground/20 to-foreground/3 bg-clip-text text-transparent">
            404
          </span>
          {/* Overlaid solid text for depth */}
          <span className="absolute inset-0 flex items-center justify-center text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter bg-linear-to-b from-primary/60 to-primary/20 bg-clip-text text-transparent blur-xs">
            404
          </span>
        </div>

        <div className="space-y-3 -mt-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xs mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved to a new URL.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22" />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 px-6 py-2.5 text-sm font-medium text-foreground hover:bg-card/80 transition-colors backdrop-blur-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
        </div>

        <p className="text-xs text-muted-foreground/30 pt-4">
          © {new Date().getFullYear()} NodeByte LTD
        </p>
      </div>
    </main>
  );
}
