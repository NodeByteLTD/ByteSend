"use client";

import React from "react";
import {
    CheckIcon,
    BarChartIcon,
    PaintbrushIcon,
    UsersIcon,
    ShieldIcon,
    ServerIcon,
    WebhookIcon
} from "~/components/marketing/HomeIcons";

const features = [
    {
        icon: BarChartIcon,
        title: "Real-time analytics",
        description:
            "Track deliveries, opens, clicks, bounces, and complaints as they happen. Full visibility across transactional and marketing sends.",
        accent: "bg-blue-500/10 text-blue-500",
    },
    {
        icon: PaintbrushIcon,
        title: "Visual email editor",
        description:
            "Design beautiful campaigns with a drag-and-drop WYSIWYG editor. No code, no external tools works for developers and non-technical teams alike.",
        accent: "bg-purple-500/10 text-purple-500",
    },
    {
        icon: UsersIcon,
        title: "Contact management",
        description: "Manage subscribers, consent, and lists. Auto updated from bounce and complaint events.",
        accent: "bg-emerald-500/10 text-emerald-500",
    },
    {
        icon: ShieldIcon,
        title: "Suppression lists",
        description: "Block accidental sends. Auto populated from bounces and spam complaints.",
        accent: "bg-amber-500/10 text-amber-500",
    },
    {
        icon: ServerIcon,
        title: "SMTP relay",
        description: "Drop-in SMTP that works with any existing app. Change one config line and you're sending through ByteSend.",
        accent: "bg-rose-500/10 text-rose-500",
    },
    {
        icon: WebhookIcon,
        title: "Webhooks",
        description: "Real-time event push for every email event. Build automations on top of delivery, opens, clicks, and more.",
        accent: "bg-cyan-500/10 text-cyan-500",
    },
];

export function Features() {

    return (
        <section id="features" className="py-20 sm:py-28 border-t border-border/30">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Features</p>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                        Everything you need to send email
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Transactional receipts, marketing campaigns, and everything in between one platform, one bill.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((f, i) => (
                        <div
                            key={f.title}
                            className={`rounded-2xl border border-border/40 bg-card/40 p-6 ${i < 2 ? "lg:col-span-2" : ""}`}
                        >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.accent} mb-4`}>
                                <f.icon className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold mb-2">{f.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Features;
