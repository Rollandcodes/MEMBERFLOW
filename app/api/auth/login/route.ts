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
    const codeVerifier = base64URLEncode(crypto.randomBytes(32))
    const codeChallenge = base64URLEncode(
        crypto.createHash('sha256').update(codeVerifier).digest()
    )

    const cookieStore = await cookies()
    cookieStore.set('pkce_verifier', codeVerifier, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 600,
        path: '/',
    })

    const params = new URLSearchParams({
        client_id: process.env.WHOP_CLIENT_ID!,
        redirect_uri: 'https://memberflow-eight.vercel.app/api/auth/callback/whop',
        response_type: 'code',
        scope: 'openid email profile',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    })

    return NextResponse.redirect(`https://whop.com/oauth?${params.toString()}`, { status: 302 })
}
