"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@bytesend/ui/src/button";

export function Hero() {

    const APP_URL = "/login";

    return (
        <section>
            <div className="mx-auto max-w-4xl px-6 pt-24 pb-16 sm:pt-36 sm:pb-24 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-1.5 text-xs text-muted-foreground mb-8">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Open source · Self-hostable · Free tier included
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
                    Email infrastructure
                    <br />
                    <span className="text-primary">that just works</span>
                </h1>

                <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Transactional emails, marketing campaigns, and analytics.
                    One platform, one bill. Start free and pay only for what you send.
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

                <p className="mt-4 text-xs text-muted-foreground">
                    Free forever · No credit card · Self-host with Docker
                </p>

                {/* Dashboard screenshot */}
                <div className="mt-16 sm:mt-20 mx-auto max-w-4xl">
                    <div className="rounded-2xl border border-border/40 p-0.5">
                        <div className="rounded-[14px] overflow-hidden">
                            <Image
                                src="/hero-light.webp"
                                alt="ByteSend dashboard"
                                width={3456}
                                height={1914}
                                className="w-full h-auto block dark:hidden"
                                sizes="(min-width: 1024px) 900px, 100vw"
                                priority
                            />
                            <Image
                                src="/hero-dark.webp"
                                alt="ByteSend dashboard"
                                width={3456}
                                height={1914}
                                className="w-full h-auto hidden dark:block"
                                sizes="(min-width: 1024px) 900px, 100vw"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
