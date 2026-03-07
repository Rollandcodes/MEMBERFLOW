import { prisma } from './prisma';

export interface SendMessageOptions {
    recipientId: string;
    content: string;
}

export class WhopApi {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    /**
     * Sends a direct message to a Whop user.
     * Note: In Whop v5, sending a DM usually involves creating/finding a channel first
     * but for apps with 'chat:message:create', you can often target a user directly 
     * depending on the specific API version.
     */
    async sendDirectMessage({ recipientId, content }: SendMessageOptions) {
        console.log(`[WhopApi] Sending DM to ${recipientId}: "${content.substring(0, 20)}..."`);

        try {
            // 1. First, we need to ensure we have a 'channel' or direct conversation ID.
            // Whop's modern API often uses 'POST /me/channels' or similar to start a DM.
            // For simplicity in this specialized sequence app, we'll try the direct message endpoint.

            const res = await fetch('https://api.whop.com/v5/messages', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipient_id: recipientId,
                    content: content,
                }),
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(`Failed to send Whop DM: ${err}`);
            }

            return await res.json();
        } catch (error) {
            console.error('[WhopApi] Error sending message:', error);
            throw error;
        }
    }

    /**
     * Helper to process a campaign for a member.
     */
    static async triggerSequence(campaignId: string, memberId: string) {
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
            include: { company: true }
        });

        const member = await prisma.member.findUnique({
            where: { id: memberId }
        });

        if (!campaign || !member || !campaign.company.accessToken) {
            console.error('[WhopApi] Cannot trigger sequence: missing data');
            return;
        }

        // Check if already sent
        const existing = await prisma.messageLog.findUnique({
            where: {
                campaignId_memberId: { campaignId, memberId }
            }
        });

        if (existing && existing.status === 'sent') {
            console.log('[WhopApi] Sequence already sent to this member.');
            return;
        }

        const api = new WhopApi(campaign.company.accessToken);

        try {
            // Log entry
            const logEntry = await prisma.messageLog.upsert({
                where: { campaignId_memberId: { campaignId, memberId } },
                update: { status: 'pending' },
                create: { campaignId, memberId, status: 'pending' }
            });

            await api.sendDirectMessage({
                recipientId: member.whopMemberId,
                content: campaign.messageText
            });

            await prisma.messageLog.update({
                where: { id: logEntry.id },
                data: { status: 'sent', sentAt: new Date() }
            });

            console.log('[WhopApi] Sequence message sent successfully!');
        } catch (error) {
            await prisma.messageLog.update({
                where: {
                    campaignId_memberId: { campaignId, memberId }
                },
                data: { status: 'failed', error: String(error) }
            });
        }
    }
}
