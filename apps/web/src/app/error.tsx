"use client";

import { useEffect } from "react";
import { FaArrowLeftLong, FaRotateRight, FaTriangleExclamation } from "react-icons/fa6";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Destructive gradient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-140 w-180 rounded-full bg-destructive/6 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-20 right-1/3 h-60 w-100 rounded-full bg-destructive/4 blur-[100px]" />

      <div className="relative text-center space-y-8 max-w-lg">
        {/* Animated pulse ring + icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-destructive/10 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-2 rounded-full bg-destructive/10 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }} />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20 backdrop-blur-sm">
            <FaTriangleExclamation className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto">
            An unexpected error occurred. Please try again or contact support if
            the problem persists.
          </p>
          {error.digest && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-muted/50 border border-border/30 px-3 py-1.5">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">Error ID</span>
              <code className="text-xs font-mono text-muted-foreground">{error.digest}</code>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <FaRotateRight className="h-4 w-4" />
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border/40 bg-card/40 px-6 py-2.5 text-sm font-medium text-foreground hover:bg-card/80 transition-colors backdrop-blur-sm"
          >
            <FaArrowLeftLong className="h-4 w-4" />
            Home
          </a>
        </div>

        <p className="text-xs text-muted-foreground/30 pt-4">
          © {new Date().getFullYear()} NodeByte LTD
        </p>
      </div>
    </main>
  );
}
