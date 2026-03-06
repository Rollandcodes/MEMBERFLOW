import { NextRequest, NextResponse } from 'next/server';
import { fetchCustomerProfile } from '@/lib/whop';

/**
 * Demo Endpoint: Using the newly added WHOP_CUSTOMER_SECRET and WHOP_CUSTOMER_USER_ID.
 * This demonstrates how to use bot/customer-level credentials to interact with the Whop API.
 * Path: /api/demo/whop-customer
 */
export async function GET(req: NextRequest) {
    try {
        const profile = await fetchCustomerProfile();
        
        if (!profile) {
            return NextResponse.json({ 
                error: 'Customer credentials not configured in .env.local',
                required_keys: ['WHOP_CUSTOMER_SECRET', 'WHOP_CUSTOMER_USER_ID']
            }, { status: 400 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Successfully authenticated using Customer Secret!',
            customer_profile: profile,
            webhook_config: {
                target_url: process.env.WHOP_WEBHOOK_URL,
                app_id: process.env.WHOP_APP_ID
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
