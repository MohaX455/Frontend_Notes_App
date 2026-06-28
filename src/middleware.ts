import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const isAuthenticated = Boolean(accessToken);

    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
    const isDashboardRoute = pathname.startsWith("/workspaces");

    if (isDashboardRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/workspaces", request.url));
    }

    if (pathname === "/" && isAuthenticated) {
        return NextResponse.redirect(new URL("/workspaces", request.url));
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
