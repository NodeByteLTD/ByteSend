"use client";

import React from "react";
import {
    BarChart3,
    Check,
    Paintbrush,
    Server,
    Shield,
    Users,
    Webhook,
} from "lucide-react";

export function CheckIcon({ className = "" }: { className?: string }) {
    return <Check className={className} aria-hidden />;
}

export function BarChartIcon({ className = "" }: { className?: string }) {
    return <BarChart3 className={className} aria-hidden />;
}

export function PaintbrushIcon({ className = "" }: { className?: string }) {
    return <Paintbrush className={className} aria-hidden />;
}

export function UsersIcon({ className = "" }: { className?: string }) {
    return <Users className={className} aria-hidden />;
}

export function ShieldIcon({ className = "" }: { className?: string }) {
    return <Shield className={className} aria-hidden />;
}

export function ServerIcon({ className = "" }: { className?: string }) {
    return <Server className={className} aria-hidden />;
}

export function WebhookIcon({ className = "" }: { className?: string }) {
    return <Webhook className={className} aria-hidden />;
}