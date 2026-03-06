import { NextRequest, NextResponse } from 'next/server';
import { runCampaignScheduler } from '@/lib/messaging';

/**
 * Production-ready Cron Handler
 * Path: /api/cron/process-campaigns
 * Schedule: Defined in vercel.json (0 * * * *)
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Security Check: verify Vercel Cron Secret (or manually passed secret)
        // Vercel passes the secret in the Authorization header: Bearer <CRON_SECRET>
        const authHeader = req.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET;

        // Skip security check only in non-production local dev if CRON_SECRET is missing
        if (process.env.NODE_ENV === 'production' || cronSecret) {
            if (authHeader !== `Bearer ${cronSecret}`) {
                console.warn('[Cron] Unauthorized attempt to trigger scheduler.');
                return new Response('Unauthorized', { status: 401 });
            }
        }

        console.info('[Cron] Starting campaign processing sequence.');

        // 2. Invoke the Campaign Scheduler
        // This function handles its own internal idempotency via database logs.
        const result = await runCampaignScheduler();

        console.info(`[Cron] Scheduler execution completed successfully. Messages sent: ${result.messagesSent}`);

        // 3. Standardized Success Response
        return NextResponse.json({ ok: true, messagesSent: result.messagesSent });

    } catch (error: any) {
        // 4. Detailed Error Logging
        console.error('[Cron] Fatal error during campaign execution:');
        console.error(error.stack || error);

        // 5. Plain-text error response as requested for cron monitors
        return new Response('error', { status: 500 });
    }
}

// Ensure the endpoint is only reachable via GET
export async function POST() { return new Response('Method Not Allowed', { status: 405 }); }
export async function PUT() { return new Response('Method Not Allowed', { status: 405 }); }
export async function DELETE() { return new Response('Method Not Allowed', { status: 405 }); }
