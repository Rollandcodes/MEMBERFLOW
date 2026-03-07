export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    console.log('[Callback] code:', code, 'error:', error)

    if (error || !code) {
        console.log('[Callback] No code or error param:', error)
        return NextResponse.redirect(new URL('/?error=missing_code', request.url))
    }

    try {
        // Step 1: Exchange code for token (OAuth2 standard requires form-urlencoded)
        const clientId = process.env.WHOP_CLIENT_ID || '';
        const clientSecret = process.env.WHOP_CLIENT_SECRET || '';
        // OAuth2 standard: credentials in the Authorization header AND/OR body as JSON
        const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

        const payload = {
            grant_type: 'authorization_code',
            code: code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: process.env.WHOP_REDIRECT_URI || 'https://memberflow-eight.vercel.app/api/auth/callback/whop',
        };

        console.log('[Callback] Attempting token exchange with Whop (JSON)...');

        const tokenRes = await fetch('https://api.whop.com/oauth/token', {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        const tokenText = await tokenRes.text()
        console.log('[Callback] Token response status:', tokenRes.status)
        console.log('[Callback] Token response body:', tokenText)

        if (!tokenRes.ok) {
            const errorDetail = encodeURIComponent(tokenText.substring(0, 200))
            return NextResponse.redirect(new URL(`/?error=token_exchange_failed&detail=${errorDetail}`, request.url))
        }

        const tokenData = JSON.parse(tokenText)
        const accessToken = tokenData.access_token

        if (!accessToken) {
            console.error('[Callback] No access_token in response:', tokenData)
            return NextResponse.redirect(new URL('/?error=no_access_token', request.url))
        }

        // Step 2: Get company info
        const companyRes = await fetch('https://api.whop.com/v5/companies/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        const companyText = await companyRes.text()
        console.log('[Callback] Company response status:', companyRes.status)
        console.log('[Callback] Company response body:', companyText)

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
        const cookieStore = cookies()
        cookieStore.set('memberflow_company_id', company.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        })

        console.log('[Callback] Success! Redirecting to dashboard')
        return NextResponse.redirect(new URL('/app/dashboard', request.url))

    } catch (err) {
        return NextResponse.redirect(new URL('/?error=unexpected_error', request.url))
    }
}
