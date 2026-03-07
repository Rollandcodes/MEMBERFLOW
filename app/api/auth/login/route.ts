import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { cookies } from 'next/headers'

function base64URLEncode(buffer: Buffer) {
    return buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}

export async function GET() {
    const clientId = process.env.WHOP_CLIENT_ID
    const redirectUri = process.env.WHOP_REDIRECT_URI || 'https://memberflow-eight.vercel.app/api/auth/callback/whop'

    if (!clientId) {
        return NextResponse.json({ error: 'WHOP_CLIENT_ID is not set in environment' }, { status: 500 })
    }

    const codeVerifier = base64URLEncode(crypto.randomBytes(32))
    const codeChallenge = base64URLEncode(
        crypto.createHash('sha256').update(codeVerifier).digest()
    )
    const oauthState = base64URLEncode(crypto.randomBytes(24))

    const cookieStore = await cookies()
    cookieStore.set('pkce_verifier', codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
        path: '/',
    })
    cookieStore.set('oauth_state', oauthState, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
        path: '/',
    })

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: oauthState,
    })

    return NextResponse.redirect(`https://api.whop.com/oauth/authorize?${params.toString()}`, { status: 302 })
}
