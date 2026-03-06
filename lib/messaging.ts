// lib/messaging.ts
import { supabase } from './db';
import { sendWhopDM } from './whop';

/**
 * Executes the campaign scheduler to find and process pending messages for all active campaigns.
 * Guaranteed idempotency via message_logs check.
 */
export async function runCampaignScheduler() {
    let messagesSent = 0;
    const now = new Date();

    console.info(`[Scheduler] Starting campaign processing at ${now.toISOString()}`);

    try {
        // 1. Fetch all active campaigns and their steps
        const { data: campaigns, error: campaignError } = await supabase
            .from('campaigns')
            .select('*, campaign_steps(*)')
            .eq('is_active', true);

        if (campaignError) {
            throw new Error(`Failed to fetch active campaigns: ${campaignError.message}`);
        }

        if (!campaigns || campaigns.length === 0) {
            console.info('[Scheduler] No active campaigns found.');
            return { messagesSent: 0 };
        }

        for (const campaign of campaigns) {
            // 2. Fetch active members for this creator's community
            const { data: members, error: memberError } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', campaign.user_id)
                .eq('status', 'active');

            if (memberError) {
                console.error(`[Scheduler] Member fetch error for user ${campaign.user_id}:`, memberError);
                continue;
            }

            if (!members || members.length === 0) continue;

            for (const member of members) {
                // 3. Evaluate each step of the campaign
                for (const step of (campaign.campaign_steps || [])) {
                    const joinDate = new Date(member.joined_at);
                    // Use milliseconds for more precise calculation if needed, but days are requested.
                    const daysSinceJoined = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

                    if (daysSinceJoined >= step.delay_days) {
                        // 4. Idempotency Check: ensure we haven't sent this step to this member already
                        const { data: existingLog, error: logError } = await supabase
                            .from('message_logs')
                            .select('id')
                            .eq('member_id', member.id)
                            .eq('campaign_step_id', step.id)
                            .maybeSingle();

                        if (logError) {
                            console.error(`[Scheduler] Log check error for member ${member.id}:`, logError);
                            continue;
                        }

                        if (!existingLog) { 
                            // 5. Send DM via Whop
                            const personalizedMessage = step.message_content
                                .replace(/{name}/g, member.whop_member_id) 
                                .replace(/{tier}/g, member.tier || 'Community');

                            try {
                                console.info(`[Scheduler] Sending DM to ${member.whop_member_id} for step ${step.id}`);
                                await sendWhopDM(member.whop_member_id, personalizedMessage);

                                // 6. Log the successful message for idempotency
                                await supabase
                                    .from('message_logs')
                                    .insert({
                                        member_id: member.id,
                                        campaign_step_id: step.id,
                                        status: 'sent',
                                        sent_at: new Date().toISOString()
                                    });
                                
                                messagesSent++;
                            } catch (dmError: any) {
                                console.error(`[Scheduler] Failed to send DM to member ${member.id}:`, dmError.message);
                                // We could log failures here too for a retry queue
                            }
                        }
                    }
                }
            }
        }

        console.info(`[Scheduler] Finished processing. Total messages sent: ${messagesSent}`);
        return { messagesSent };
    } catch (error: any) {
        console.error('[Scheduler] Critical error in campaign scheduler:', error.stack || error.message);
        throw error; // Rethrow for the API handler to catch and log
    }
}
