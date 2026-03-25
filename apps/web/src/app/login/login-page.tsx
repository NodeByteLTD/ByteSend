"use client";

import { Button } from "@usesend/ui/src/button";
import { Input } from "@usesend/ui/src/input";
import Image from "next/image";
import { useState } from "react";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import Spinner from "@usesend/ui/src/spinner";
import Link from "next/link";
import { useSearchParams as useNextSearchParams } from "next/navigation";

const providerIcons: Record<string, React.ReactNode> = {
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  google: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="size-5">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};

export default function LoginPage({
  providers,
  isSignup = false,
}: {
  providers?: ClientSafeProvider[];
  isSignup?: boolean;
}) {
  const [submittedProvider, setSubmittedProvider] =
    useState<LiteralUnion<BuiltInProviderType> | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const searchParams = useNextSearchParams();
  const inviteId = searchParams.get("inviteId");

  const callbackUrl = inviteId
    ? `/join-team?inviteId=${inviteId}`
    : "/dashboard";

  const handleOAuthSubmit = (provider: LiteralUnion<BuiltInProviderType>) => {
    setSubmittedProvider(provider);
    signIn(provider, { callbackUrl });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setEmailLoading(true);
    try {
      await signIn("email", { email, callbackUrl, redirect: false });
      setEmailSent(true);
    } finally {
      setEmailLoading(false);
    }
  };

  const hasEmailProvider = providers?.some((p) => p.type === "email");
  const oauthProviders = providers?.filter((p) => p.type !== "email") ?? [];

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-100 space-y-8">
        {/* Logo & heading */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Image
            src="/logo-squircle.png"
            alt="ByteSend"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {isSignup ? "Create your account" : "Sign in to ByteSend"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignup
                ? "Get started with email infrastructure that scales"
                : "Welcome back, let's pick up where you left off"}
            </p>
          </div>
        </div>

        {/* Email check-your-inbox state */}
        {emailSent ? (
          <div className="rounded-xl border border-border/60 bg-card p-6 text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
              <svg className="size-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              We sent a sign-in link to <span className="font-medium text-foreground">{email}</span>
            </p>
            <button
              onClick={() => setEmailSent(false)}
              className="text-sm text-primary hover:underline mt-2"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            {/* Email form */}
            {hasEmailProvider && (
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-11"
                />
                <Button type="submit" className="w-full h-11" disabled={emailLoading}>
                  {emailLoading ? (
                    <Spinner className="size-4" />
                  ) : (
                    <>
                      <svg className="size-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      Continue with email
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Divider */}
            {hasEmailProvider && oauthProviders.length > 0 && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/60" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-3 text-muted-foreground/60">or</span>
                </div>
              </div>
            )}

            {/* OAuth buttons */}
            <div className="flex flex-col gap-2.5">
              {oauthProviders.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className="w-full h-11 gap-3 font-medium"
                  onClick={() => handleOAuthSubmit(provider.id)}
                  disabled={submittedProvider === provider.id}
                >
                  {submittedProvider === provider.id ? (
                    <Spinner className="size-4" />
                  ) : (
                    providerIcons[provider.id]
                  )}
                  Continue with {provider.name}
                </Button>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don\u2019t have an account?"}
            <Link
              href={isSignup ? "/login" : "/signup"}
              className="text-primary hover:underline ml-1 font-medium"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </Link>
          </p>
          <p className="text-xs text-muted-foreground/40">
            © {new Date().getFullYear()} NodeByte LTD
          </p>
        </div>
      </div>
    </main>
  );
}
