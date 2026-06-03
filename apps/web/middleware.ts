import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { validateTwoFactorCookieEdge, TWO_FACTOR_COOKIE } from "~/lib/edge-2fa-utils";

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip middleware for:
    // - Public routes
    // - API routes
    // - Auth routes
    // - Marketing routes
    // - Static assets
    const publicPaths = [
        "/login",
        "/signup",
        "/api",
        "/auth",
        "/",
        "/privacy",
        "/terms",
        "/cookie-policy",
        "/dmca",
        "/dpa",
        "/acceptable-use",
        "/legal",
        "/changelog",
        "/_next",
        "/favicon.ico",
    ];

    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // For dashboard routes, check 2FA
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/broadcasts") || pathname.startsWith("/campaigns")) {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            // Not authenticated, redirect to login
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // User is authenticated. Check if they have 2FA enabled.
        // We can't query the DB from middleware easily, so we rely on:
        // 1. The 2FA cookie being set after verification
        // 2. If no cookie, we let the client-side check handle it (DashboardProvider)
        // But for maximum security, we could also check via an API call

        // For now, just verify the cookie if it exists
        const cookieValue = request.cookies.get(TWO_FACTOR_COOKIE)?.value;
        const userId = token.sub ? parseInt(token.sub, 10) : null;

        if (cookieValue && userId) {
            const isValid = await validateTwoFactorCookieEdge(
                cookieValue,
                userId,
                process.env.NEXTAUTH_SECRET ?? "dev-secret"
            );
            if (!isValid) {
                // Invalid/expired cookie, redirect to 2FA verification
                const url = new URL("/auth/2fa-verify", request.url);
                const res = NextResponse.redirect(url);
                res.cookies.delete(TWO_FACTOR_COOKIE);
                return res;
            }
            // Valid cookie, allow access
            return NextResponse.next();
        }

        // No cookie — the DashboardProvider will handle the 2FA gate client-side
        // But optionally we could require 2FA verification here
        // For now, allow the request to proceed and let the dashboard provider gate it
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all paths except static files and api/auth/callback
        "/((?!api/auth/callback|_next/static|_next/image|favicon.ico).*)",
    ],
};
