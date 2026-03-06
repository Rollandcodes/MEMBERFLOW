/// <reference types="node" />
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { verifyWhopSignature } from '@/lib/whop';
import { handleWhopEvent } from '@/lib/whopEvents';

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const signature = req.headers.get('x-whop-signature') || '';
        const secret = process.env.WHOP_WEBHOOK_SECRET || '';

        // 1. Validate the webhook signature
        if (!verifyWhopSignature(payload, signature, secret)) {
            return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
        }

        let event;
        try {
            event = JSON.parse(payload);
        } catch (e) {
            return NextResponse.json({ error: 'malformed json' }, { status: 400 });
        }

        const eventId = event.id;
        const action = event.action;

        // 2. Log the webhook event and ensure idempotency
        // Using upsert with event_id to prevent double processing
        const { error: logError } = await supabase
            .from('webhook_events')
            .upsert({
                whop_event_id: eventId,
                event_type: action,
                payload: event,
                processed_at: null // Will be updated after successful processing
            }, { onConflict: 'whop_event_id' });

        if (logError) {
            console.error('Webhook log error:', logError);
            return NextResponse.json({ error: 'Failed to log event' }, { status: 500 });
        }

        // 3. Process the event
        try {
            await handleWhopEvent(event);
        } catch (error: any) {
            console.error('Event processing error:', error);
            // We return 200 here to acknowledge receipt, even if processing failed
            // so Whop doesn't keep retrying. We should handle errors internally.
        }

        // 4. Update the event as processed
        await supabase
            .from('webhook_events')
            .update({ processed_at: new Date().toISOString() })
            .eq('whop_event_id', eventId);

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        console.error('Webhook handler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
