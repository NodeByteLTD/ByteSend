"use client";

import React from "react";

export function TrustStrip() {

    const stats = [
        { value: "12,500", label: "Free emails/month" },
        { value: "96.6%", label: "Uptime SLA" },
        { value: "<2s", label: "Avg. delivery" },
        { value: "24/7", label: "Monitoring" },
    ];

    return (
        <div className="border-y border-border/30">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/30">
                    {stats.map((s) => (
                        <div key={s.label} className="py-8 px-4 text-center">
                            <div className="text-2xl sm:text-3xl font-bold tabular-nums">{s.value}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TrustStrip;
