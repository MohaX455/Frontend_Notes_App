import { NextRequest, NextResponse } from "next/server";

const parseJwtPayload = (token: string) => {
    try {
        const [, payload] = token.split(".");
        if (!payload) {
            return null;
        }

        const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
        const decoded = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
};

const isAccessTokenValid = (token: string) => {
    const payload = parseJwtPayload(token);

    if (!payload || typeof payload.exp !== "number") {
        return false;
    }

    return Date.now() < payload.exp * 1000;
};

export const middleware = (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const isAuthenticated = !!accessToken && isAccessTokenValid(accessToken);

    // Auth routes (login/register)
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

    // Dashboard routes
    const isDashboardRoute = pathname.startsWith("/workspaces");

    // If accessing dashboard routes without authentication, redirect to login
    if (isDashboardRoute && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If accessing auth routes while authenticated, redirect to workspaces
    if (isAuthRoute && isAuthenticated) {
        const workspacesUrl = new URL("/workspaces", request.url);
        return NextResponse.redirect(workspacesUrl);
    }

    // If accessing homepage while authenticated, redirect to workspaces
    if (pathname === "/" && isAuthenticated) {
        const workspacesUrl = new URL("/workspaces", request.url);
        return NextResponse.redirect(workspacesUrl);
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api (API routes)
         */
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
};
