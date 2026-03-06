export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        console.error(`[MemberFlow Auth] Error from Whop: ${error}`);
        return NextResponse.redirect(new URL("/?error=auth_failed", req.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL("/?error=missing_code", req.url));
    }

    const clientId = process.env.WHOP_CLIENT_ID;
    const clientSecret = process.env.WHOP_CLIENT_SECRET;
    const redirectUri = process.env.WHOP_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        console.error("[MemberFlow Auth] Missing OAuth environment variables");
        return NextResponse.redirect(new URL("/?error=server_config", req.url));
    }

    try {
        // 1. Exchange the authorisation code for access and refresh tokens
        const tokenRes = await fetch("https://whop.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grant_type: "authorization_code",
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenRes.ok) {
            const errorText = await tokenRes.text();
            console.error(`[MemberFlow Auth] Token exchange failed: ${errorText}`);
            return NextResponse.redirect(new URL("/?error=token_exchange", req.url));
        }

        const tokens = await tokenRes.json();
        const { access_token, refresh_token } = tokens;

        // 2. Use the access token to get the user's Whop ID and Profile
        const userRes = await fetch("https://api.whop.com/v5/me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!userRes.ok) {
            console.error("[MemberFlow Auth] Failed to fetch user profile");
            return NextResponse.redirect(new URL("/?error=fetch_profile", req.url));
        }

        const userData = await userRes.json();

        // In Whop V5, the user object is usually returned directly or inside a `data` wrap
        const user = userData.id ? userData : userData.data;

        // 3. Upsert the Company (the Creator) in our database
        const company = await prisma.company.upsert({
            where: { whopUserId: user.id },
            create: {
                whopUserId: user.id,
                email: user.email || null,
                name: user.username || "Creator",
                accessToken: access_token,
                refreshToken: refresh_token,
            },
            update: {
                email: user.email || null,
                name: user.username || "Creator",
                accessToken: access_token,
                refreshToken: refresh_token,
            },
        });

        // 4. Create a default Welcome Campaign if they don't have one
        const existingCampaigns = await prisma.campaign.count({
            where: { companyId: company.id },
        });

        if (existingCampaigns === 0) {
            await prisma.campaign.create({
                data: {
                    companyId: company.id,
                    name: "Welcome DM",
                    triggerType: "membership.activated",
                    messageText: "Hey {{first_name}} 👋 Welcome to {{product_name}}! So glad to have you here.",
                    delayHours: 0,
                },
            });
        }

        // 5. Set authentication cookie & redirect to dashboard
        const response = NextResponse.redirect(new URL("/app/dashboard", req.url));

        response.cookies.set({
            name: "memberflow_company_id",
            value: company.id,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return response;
    } catch (err) {
        console.error("[MemberFlow Auth] Unexpected error during OAuth flow", err);
        return NextResponse.redirect(new URL("/?error=internal_error", req.url));
    }
}
