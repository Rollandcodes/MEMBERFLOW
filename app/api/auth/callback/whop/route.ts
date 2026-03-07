/// <reference types="next" />
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    if (error || !code) {
        // Pass through OAuth provider query params.
        const params = new URLSearchParams(searchParams);
        return NextResponse.redirect(new URL(`/?${params.toString()}`, request.url))
    }

    const cookieStore = await cookies()
    const codeVerifier = cookieStore.get('pkce_verifier')?.value
    const expectedState = cookieStore.get('oauth_state')?.value

    if (!codeVerifier) {
        return NextResponse.redirect(new URL('/?error=missing_verifier', request.url))
    }

    if (!state || !expectedState || state !== expectedState) {
        return NextResponse.redirect(new URL('/?error=invalid_oauth_state', request.url))
    }

    try {
        // Step 1: Exchange code for token (Whop OAuth docs use JSON body with PKCE)
        const clientId = process.env.WHOP_CLIENT_ID || '';
        const clientSecret = process.env.WHOP_CLIENT_SECRET || '';
        const redirectUri = process.env.WHOP_REDIRECT_URI || 'https://memberflow-eight.vercel.app/api/auth/callback/whop';

        if (!clientId || !clientSecret || !redirectUri) {
            return NextResponse.redirect(new URL('/?error=missing_oauth_env', request.url))
        }

        const body = {
            grant_type: 'authorization_code',
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        };

        const tokenRes = await fetch('https://api.whop.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const tokenText = await tokenRes.text()

        if (!tokenRes.ok) {
            console.error('[Callback] Token exchange failed with status', tokenRes.status)
            const errorDetail = encodeURIComponent(tokenText.substring(0, 200))
            return NextResponse.redirect(new URL(`/?error=token_exchange_failed&detail=${errorDetail}`, request.url))
        }

        const tokenData = JSON.parse(tokenText)
        const accessToken = tokenData.access_token

        if (!accessToken) {
            console.error('[Callback] No access_token in token response')
            return NextResponse.redirect(new URL('/?error=no_access_token', request.url))
        }

        // Step 2: Get company info
        const companyRes = await fetch('https://api.whop.com/v5/companies/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        const companyText = await companyRes.text()
        if (!companyRes.ok) {
            console.error('[Callback] Failed to fetch company profile with status', companyRes.status)
        }

        let whopCompanyId = 'unknown'
        let companyName = 'My Company'

        if (companyRes.ok) {
            const companyData = JSON.parse(companyText)
            whopCompanyId = companyData.id || companyData.company_id || 'unknown'
            companyName = companyData.title || companyData.name || 'My Company'
        }

        // Step 3: Save to database
        const company = await prisma.company.upsert({
            where: { whopUserId: whopCompanyId },
            update: { accessToken, name: companyName },
            create: {
                whopUserId: whopCompanyId,
                email: 'creator@whop.com',
                name: companyName,
                accessToken,
            },
        })

        // Step 4: Set cookie and redirect
        cookieStore.set('memberflow_company_id', company.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        })

        // One-time PKCE secret should not persist after a successful exchange.
        cookieStore.set('pkce_verifier', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        })
        cookieStore.set('oauth_state', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        })
        cookieStore.set('oauth_nonce', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        })
        return NextResponse.redirect(new URL('/app/dashboard', request.url))

    } catch (err) {
        console.error('[Callback] Unexpected OAuth callback error', err)
        return NextResponse.redirect(new URL('/?error=unexpected_error', request.url))
    }
}
