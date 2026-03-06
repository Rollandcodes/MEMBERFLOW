import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Check if navigating to any /app path (the dashboard routes)
    if (request.nextUrl.pathname.startsWith("/app")) {
        // Check for the auth cookie
        const hasCompanyId = request.cookies.has("memberflow_company_id");

        if (!hasCompanyId) {
            // Redirect to landing page to log in via Whop
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // Allow all other routes (landing, /privacy, /terms, etc.)
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/app/:path*",
        "/dashboard/:path*",
    ],
};
