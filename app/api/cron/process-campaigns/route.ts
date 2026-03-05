/// <reference types="node" />
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { sendWhopDM } from '@/lib/whop';

/**
 * Automation Engine (Cron Job)
 * Trigger: Every hour (Vercel Cron)
 * Goal: Check all active campaigns, find eligible members based on triggers, and send DMs.
 */
export async function GET(req: Request) {
    // In production, verify Vercel Cron Secret
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let messagesSent = 0;
        const now = new Date();

        // 1. Fetch all active campaigns and their steps
        const { data: campaigns, error: campaignError } = await supabase
            .from('campaigns')
            .select('*, campaign_steps(*)')
            .eq('is_active', true);

        if (campaignError) throw campaignError;

        for (const campaign of campaigns) {
            // 2. Fetch members for this creator's community
            const { data: members, error: memberError } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', campaign.user_id)
                .eq('status', 'active'); // For most triggers, we only care about active members

            if (memberError) {
                console.error(`Member fetch error for user ${campaign.user_id}:`, memberError);
                continue;
            }

            for (const member of members) {
                // 3. Evaluate each step of the campaign
                for (const step of campaign.campaign_steps) {
                    const joinDate = new Date(member.joined_at);
                    const daysSinceJoined = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

                    // Trigger Logic: 
                    // - Onboarding (member_joined): check delay_days relative to join_date
                    // - Cancellation: check relative to status change (needs extra column)
                    // - For now, we use the primary 'member_joined' flow as requested.

                    if (daysSinceJoined >= step.delay_days) {
                        // 4. Idempotency Check: ensure we haven't sent this step to this member already
                        const { data: log, error: logError } = await supabase
                            .from('message_logs')
                            .select('*')
                            .eq('member_id', member.id)
                            .eq('campaign_step_id', step.id)
                            .maybeSingle();

                        if (logError) {
                            console.error(`Log check error for member ${member.id}:`, logError);
                            continue;
                        }

                        if (!log) { // Not sent yet!
                            // 5. Send DM via Whop
                            // Note: we can replace variables like {name} here
                            const personalizedMessage = step.message_content
                                .replace(/{name}/g, member.whop_member_id) // Ideally, we'd have their real name
                                .replace(/{tier}/g, member.tier || 'Community');

                            try {
                                await sendWhopDM(member.whop_member_id, personalizedMessage);

                                // 6. Log the successful message
                                await supabase
                                    .from('message_logs')
                                    .insert({
                                        member_id: member.id,
                                        campaign_step_id: step.id,
                                        status: 'sent'
                                    });
                                
                                messagesSent++;
                            } catch (dmError: any) {
                                console.error(`Failed to send DM to member ${member.id}:`, dmError.message);
                                // Log failure for retry logic
                                await supabase
                                    .from('message_logs')
                                    .insert({
                                        member_id: member.id,
                                        campaign_step_id: step.id,
                                        status: 'failed'
                                    });
                            }
                        }
                    }
                }
            }
        }

        return NextResponse.json({ 
            success: true, 
            messages_sent: messagesSent,
            timestamp: now.toISOString()
        });
    } catch (error: any) {
        console.error('Automation Engine Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
