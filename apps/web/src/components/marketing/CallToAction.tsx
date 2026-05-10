"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@bytesend/ui/src/button";

export function CallToAction() {

    const APP_URL = "/login";

    return (
        <section className="py-20 sm:py-28 border-t border-border/30 bg-muted/20">
            <div className="mx-auto max-w-4xl px-6 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-1.5 text-xs text-muted-foreground mb-8">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Free tier available — no credit card required
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    Start sending today.
                </h2>
                <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Create your free account in seconds. 12,500 emails per month, forever.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button size="lg" className="w-full sm:w-auto px-8 h-12 text-base rounded-xl" asChild>
                        <Link href={APP_URL}>Get started free</Link>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 h-12 text-base rounded-xl" asChild>
                        <a href="https://docs.bytesend.cloud" target="_blank" rel="noopener noreferrer">
                            Read the docs
                        </a>
                    </Button>
                </div>

                <p className="mt-5 text-xs text-muted-foreground">
                    Also available as a Docker container for self-hosting.{" "}
                    <a href="https://docs.bytesend.cloud/self-hosting/overview" className="underline underline-offset-2 hover:text-foreground" target="_blank" rel="noopener noreferrer">
                        Learn more →
                    </a>
                </p>
            </div>
        </section>
    );
}

export default CallToAction;
