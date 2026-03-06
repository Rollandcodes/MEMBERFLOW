// lib/whopEvents.ts
import { supabase } from './db';
import { EVENT_MAP } from './whop';

/**
 * Handle incoming Whop webhook events and process business logic.
 */
export async function handleWhopEvent(payload: any) {
    const eventType = payload.action;
    const data = payload.data;
    const internalTrigger = EVENT_MAP[eventType as keyof typeof EVENT_MAP];

    if (!internalTrigger || !data.member_id) {
        console.warn(`Unhandleable event or missing member_id: ${eventType}`);
        return;
    }

    // 1. Find the user (creator) by company_id
    // For now, we'll try to find a user with this whop_company_id or fall back to the first one for testing.
    // In a production SaaS, users would have a whop_company_id column.
    const companyId = payload.company_id;
    let userId: string | null = null;

    if (companyId) {
        const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('whop_user_id', companyId) // Assuming whop_user_id might store company_id or we'd have a separate column
            .maybeSingle();
        
        if (userData) {
            userId = userData.id;
        }
    }

    // Fallback logic if we can't find a user (not ideal for multi-tenant, but safe for initial setup)
    if (!userId) {
        const { data: firstUser } = await supabase.from('users').select('id').limit(1).maybeSingle();
        userId = firstUser?.id || null;
    }

    if (!userId) {
        console.error('Could not find a creator user for this webhook event.');
        return;
    }

    // 2. Upsert the member in our database
    const { data: member, error: memberError } = await supabase
        .from('members')
        .upsert({
            user_id: userId,
            whop_member_id: data.member_id,
            tier: data.tier_name || 'Free',
            status: data.status || 'active',
            joined_at: data.created_at || new Date().toISOString()
        }, { onConflict: 'user_id,whop_member_id' })
        .select('*')
        .single();

    if (memberError) {
        console.error('Member sync error:', memberError);
        return;
    }

    // 3. Find active campaigns triggered by this event
    const { data: activeCampaigns } = await supabase
        .from('campaigns')
        .select(`
            *,
            campaign_steps (*)
        `)
        .eq('user_id', userId)
        .eq('trigger_event', internalTrigger)
        .eq('is_active', true);

    if (!activeCampaigns || activeCampaigns.length === 0) {
        console.info(`No active campaigns found for trigger: ${internalTrigger}`);
        return;
    }

    // 4. For each active campaign, create logs for its steps
    // We only create logs for steps with delay_days = 0 immediately.
    // Steps with delay_days > 0 will be picked up by the Cron job.
    for (const campaign of activeCampaigns) {
        for (const step of campaign.campaign_steps) {
            // Check if this step was already logged to prevent duplicates (Idempotency)
            const { data: existingLog } = await supabase
                .from('message_logs')
                .select('id')
                .eq('member_id', member.id)
                .eq('campaign_step_id', step.id)
                .maybeSingle();

            if (existingLog) continue;

            // Log the step. If delay_days is 0, it will be marked for immediate processing
            // In a more complex system, we might mark it as 'pending' and let the cron handle it.
            // For now, let's just create the log.
            await supabase
                .from('message_logs')
                .insert({
                    member_id: member.id,
                    campaign_step_id: step.id,
                    status: step.delay_days === 0 ? 'pending' : 'scheduled'
                });
        }
    }
    
    console.info(`Successfully processed ${eventType} for member ${data.member_id}`);
}
