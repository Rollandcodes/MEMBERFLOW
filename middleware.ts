import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Protect all app routes, including /app/dashboard.
    if (request.nextUrl.pathname.startsWith("/app")) {
        const hasCompanyId = request.cookies.has("memberflow_company_id");
        if (!hasCompanyId) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/app/:path*"],
};
