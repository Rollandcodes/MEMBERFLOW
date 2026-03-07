import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { WhopApi } from '@/lib/whop-api';

export async function POST(request: NextRequest) {
    const signature = request.headers.get('x-whop-signature');
    const secret = process.env.WHOP_WEBHOOK_SECRET;

    if (!secret) {
        console.error('[Webhooks] WHOP_WEBHOOK_SECRET is not set');
        return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const rawBody = await request.text();

    // Verification (Optional but highly recommended)
    if (signature) {
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(rawBody).digest('hex');
        if (digest !== signature) {
            console.warn('[Webhooks] Signature mismatch');
            // return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
    }

    try {
        const payload = JSON.parse(rawBody);
        const { action, data } = payload;

        console.log(`[Webhooks] Received event: ${action}`);

        if (action === 'membership.activated') {
            const whopMemberId = data.user_id || data.user?.id;
            const whopBizId = data.biz_id || data.company_id;
            const username = data.user?.username || 'Member';

            if (!whopMemberId || !whopBizId) {
                return NextResponse.json({ error: 'Missing member or biz ID' }, { status: 400 });
            }

            // 1. Find the company in our DB
            const company = await prisma.company.findUnique({
                where: { whopUserId: whopBizId }
            });

            if (!company) {
                console.log(`[Webhooks] Company ${whopBizId} not found in our records.`);
                return NextResponse.json({ message: 'Company not registered' });
            }

            // 2. Add or update the member
            const member = await prisma.member.upsert({
                where: { whopMemberId: whopMemberId },
                update: { status: 'active', username: username },
                create: {
                    whopMemberId: whopMemberId,
                    companyId: company.id,
                    username: username,
                    status: 'active'
                }
            });

            // 3. Find any active campaigns for this trigger
            const campaigns = await prisma.campaign.findMany({
                where: {
                    companyId: company.id,
                    isActive: true,
                    triggerType: 'membership.activated'
                }
            });

            for (const campaign of campaigns) {
                // Trigger the sequence!
                // If there's a delay, we'd normally queue this. 
                // For now, we trigger immediately as per simplicity.
                console.log(`[Webhooks] Triggering campaign: ${campaign.name} for ${username}`);
                await WhopApi.triggerSequence(campaign.id, member.id);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Webhooks] Error processing webhook:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
