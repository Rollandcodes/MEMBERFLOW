/// <reference types="node" />
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { validateWhopWebhook, EVENT_MAP } from '@/lib/whop';

export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const signature = req.headers.get('whop-signature') || '';

        // 1. Validate the webhook signature
        if (!validateWhopWebhook(signature, payload)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(payload);
        const eventType = event.action; // Whop event action
        const data = event.data;

        // 2. Log the webhook event
        const { error: logError } = await supabase
            .from('webhook_events')
            .insert({
                whop_event_id: event.id,
                event_type: eventType,
                payload: data
            });

        if (logError && logError.code !== '23505') { // Ignore duplicate events
            console.error('Webhook log error:', logError);
        }

        // 3. Process Member-related events
        const internalTrigger = EVENT_MAP[eventType as keyof typeof EVENT_MAP];
        
        if (internalTrigger && data.member_id) {
            // Find or create member in Supabase
            const { data: member, error: memberError } = await supabase
                .from('members')
                .upsert({
                    whop_member_id: data.member_id,
                    tier: data.tier_name || 'Free',
                    status: data.status || 'active',
                    joined_at: data.created_at || new Date().toISOString()
                }, { onConflict: 'whop_member_id' })
                .select('*')
                .single();

            if (memberError) {
                console.error('Member sync error:', memberError);
            } else if (member) {
                // Check for campaigns triggered by this event
                // This will be picked up by the Automation Engine (Cron)
                // or we could trigger a specific "Immediate" campaign processor here.
            }
        }

        // 4. Update the event as processed
        await supabase
            .from('webhook_events')
            .update({ processed_at: new Date().toISOString() })
            .eq('whop_event_id', event.id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Webhook handler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
