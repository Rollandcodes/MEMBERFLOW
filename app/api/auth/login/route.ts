import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function GET() {
    const clientId = process.env.WHOP_CLIENT_ID;
    const redirectUri = process.env.WHOP_REDIRECT_URI || 'https://memberflow-eight.vercel.app/api/auth/callback/whop';

    if (!clientId) {
        return NextResponse.json({ error: 'WHOP_CLIENT_ID is not set in environment' }, { status: 500 });
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
    });

    return NextResponse.redirect(
        `https://whop.com/oauth?${params.toString()}`,
        { status: 302 }
    );
}
