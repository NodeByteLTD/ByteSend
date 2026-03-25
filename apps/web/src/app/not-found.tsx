import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <Image
          src="/logo-squircle.png"
          alt="ByteSend"
          width={48}
          height={48}
          className="rounded-xl mx-auto"
        />
        <div className="space-y-2">
          <h1 className="text-7xl font-bold tracking-tight text-foreground">
            404
          </h1>
          <p className="text-lg text-muted-foreground">
            This page doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            Back to home
          </Link>
        </div>
        <p className="text-xs text-muted-foreground/40">
          © {new Date().getFullYear()} NodeByte LTD
        </p>
      </div>
    </main>
  );
}
