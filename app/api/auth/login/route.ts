import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.WHOP_CLIENT_ID;
    const redirectUri = process.env.WHOP_REDIRECT_URI || 'https://memberflow-eight.vercel.app/api/auth/callback';

    if (!clientId) {
        return NextResponse.json({ error: 'WHOP_CLIENT_ID is not set in environment' }, { status: 500 });
    }

    // Standard Whop OAuth authorization URL uses whop.com/oauth
    const oauthUrl = `https://whop.com/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile`;

    return NextResponse.redirect(oauthUrl);
}
