/// <reference types="node" />
// lib/whop.ts
// Enhanced Whop SDK integration for production use.

const WHOP_API_KEY = process.env.WHOP_API_KEY;
const WHOP_COMPANY_ID = process.env.WHOP_COMPANY_ID;
const WHOP_WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET;

/**
 * Fetch all members for the community with pagination support.
 */
export async function fetchWhopMembers(page = 1) {
    const response = await fetch(`https://api.whop.com/v1/members?company_id=${WHOP_COMPANY_ID}&page=${page}`, {
        headers: {
            'Authorization': `Bearer ${WHOP_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Whop API Error: ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Send a direct message to a member via Whop.
 */
export async function sendWhopDM(memberWhopId: string, message: string) {
    const response = await fetch(`https://api.whop.com/v1/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${WHOP_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipient_id: memberWhopId,
            content: message
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Whop DM Error: ${errorData.message || response.statusText}`);
    }

    return await response.json();
}

/**
 * Retrieve detailed subscription information for a user.
 */
export async function getWhopSubscription(subscriptionId: string) {
    const response = await fetch(`https://api.whop.com/v1/subscriptions/${subscriptionId}`, {
        headers: {
            'Authorization': `Bearer ${WHOP_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch subscription details');
    }

    return await response.json();
}

/**
 * Validate incoming webhook signatures from Whop using HMAC-SHA256 and timing-safe comparison.
 */
export function verifyWhopSignature(body: string, signature: string, secret: string): boolean {
    if (!secret) {
        console.warn('Webhook secret is not configured.');
        return false;
    }
    
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(body).digest('hex');
    
    // Perform timing-safe comparison to prevent side-channel attacks
    try {
        return crypto.timingSafeEqual(
            Buffer.from(digest, 'utf8'),
            Buffer.from(signature, 'utf8')
        );
    } catch (err) {
        // Handle cases where buffers have different lengths
        return false;
    }
}

/**
 * Maps Whop event types to our internal campaign triggers.
 */
export const EVENT_MAP = {
    'membership.created': 'member_joined',
    'membership.cancelled': 'member_cancelled',
    'membership.updated': 'member_upgraded',
    'membership.expired': 'member_inactive'
};
