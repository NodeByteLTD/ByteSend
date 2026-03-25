"use client";

import { Button } from "@usesend/ui/src/button";
import Image from "next/image";
import { useState } from "react";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import Spinner from "@usesend/ui/src/spinner";
import Link from "next/link";
import { useSearchParams as useNextSearchParams } from "next/navigation";

const providerSvgs = {
  github: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      className="h-5 w-5 fill-primary-foreground"
    >
      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
    </svg>
  ),
  google: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      className="h-5 w-5 fill-primary-foreground"
    >
      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
    </svg>
  ),
  discord: (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="h-5 w-5 fill-primary-foreground"
    >
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

  const searchParams = useNextSearchParams();
  const inviteId = searchParams.get("inviteId");

  const handleSubmit = (provider: LiteralUnion<BuiltInProviderType>) => {
    setSubmittedProvider(provider);
    const callbackUrl = inviteId
      ? `/join-team?inviteId=${inviteId}`
      : "/dashboard";
    signIn(provider, { callbackUrl });
  };

  return (
    <main className="min-h-screen flex bg-background">
      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex lg:w-5/12 bg-primary flex-col justify-between p-10 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_top_right,hsl(var(--primary-light)/0.25),transparent)]" />
        <div className="relative flex items-center gap-3">
          <Image
            src="/logo-squircle.png"
            alt="ByteSend"
            width={30}
            height={30}
            className="rounded-lg"
          />
          <span className="text-primary-foreground text-lg font-bold tracking-tight">
            ByteSend
          </span>
        </div>
        <div className="relative space-y-5">
          <div>
            <h2 className="text-primary-foreground text-3xl font-bold leading-tight">
              The email platform
              <br />
              built for developers
            </h2>
            <p className="text-primary-foreground/65 mt-3 text-sm leading-relaxed">
              Send transactional and marketing emails at scale. Built on AWS
              SES. Pay only for what you send.
            </p>
          </div>
          <ul className="space-y-2.5">
            {[
              "Powered by AWS SES — pay as you go",
              "Open source & fully self-hostable",
              "Campaigns, contacts & suppression lists",
              "Webhooks, SMTP relay & REST API",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-primary-foreground/75"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground/50 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative text-xs text-primary-foreground/35">
          © {new Date().getFullYear()} NodeByte LTD. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-7">
          {/* Mobile logo — hidden on lg+ */}
          <div className="flex flex-col items-center gap-3 lg:hidden">
            <Image
              src="/logo-squircle.png"
              alt="ByteSend"
              width={44}
              height={44}
              className="rounded-xl"
            />
            <span className="text-xl font-bold tracking-tight">ByteSend</span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold text-foreground">
              {isSignup ? "Create an account" : "Welcome back"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "New to ByteSend?"}
              <Link
                href={isSignup ? "/login" : "/signup"}
                className="text-primary hover:underline ml-1"
              >
                {isSignup ? "Sign in" : "Sign up free"}
              </Link>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {providers &&
              Object.values(providers).map((provider) => {
                if (provider.type === "email") return null;
                return (
                  <Button
                    key={provider.id}
                    className="w-full"
                    size="lg"
                    onClick={() => handleSubmit(provider.id)}
                  >
                    {submittedProvider === provider.id ? (
                      <Spinner className="w-5 h-5" />
                    ) : (
                      providerSvgs[provider.id as keyof typeof providerSvgs]
                    )}
                    <span className="ml-3">
                      {isSignup ? "Sign up with" : "Continue with"}{" "}
                      {provider.name}
                    </span>
                  </Button>
                );
              })}
          </div>

          <p className="text-center text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} NodeByte LTD. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
