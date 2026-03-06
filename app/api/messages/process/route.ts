import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { sendWhopDM } from '@/lib/whop';

export async function GET() {
    // In production, this would be protected by an API key or Vercel Cron secret
    try {
        // 1. Fetch all active campaigns and their steps
        const { data: campaigns, error: campaignError } = await supabase
            .from('campaigns')
            .select('*, campaign_steps(*)')
            .eq('is_active', true);

        if (campaignError) throw campaignError;

        let messagesSent = 0;

        for (const campaign of campaigns) {
            // 2. Find members who should receive the next step
            // Logic: member.joined_at + step.delay_days <= now 
            // AND message_logs for this member + step doesn't exist
            
            const { data: members, error: memberError } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', campaign.user_id)
                .eq('status', 'active');

            if (memberError) throw memberError;

            for (const member of members) {
                for (const step of campaign.campaign_steps) {
                    const joinDate = new Date(member.joined_at);
                    const now = new Date();
                    const daysSinceJoined = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

                    if (daysSinceJoined >= step.delay_days) {
                        // Check if already sent
                        const { data: logError } = await supabase
                            .from('message_logs')
                            .select('*')
                            .eq('member_id', member.id)
                            .eq('campaign_step_id', step.id)
                            .single();

                        if (logError && (logError as any).code === 'PGRST116') { // Not sent yet
                            // 3. Send message via Whop
                            await sendWhopDM(member.whop_member_id, step.message_content);

                            // 4. Log the message
                            await supabase
                                .from('message_logs')
                                .insert({
                                    member_id: member.id,
                                    campaign_step_id: step.id,
                                    status: 'sent'
                                });
                            
                            messagesSent++;
                        }
                    }
                }
            }
        }

        return NextResponse.json({ success: true, messages_sent: messagesSent });
    } catch (error: any) {
        console.error('Messaging engine error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
