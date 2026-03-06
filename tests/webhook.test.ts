
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyWhopSignature } from '../lib/whop';
import { handleWhopEvent } from '../lib/whopEvents';
import { supabase } from '../lib/db';
import { NextRequest } from 'next/server';
import { POST as webhookHandler } from '../app/api/webhooks/whop/route';

const mockSupabase = vi.hoisted(() => {
    const mock: any = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
    };
    return mock;
});

vi.mock('../lib/db', () => ({
    supabase: mockSupabase,
}));

describe('Webhook Integration Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset all to return this by default
        Object.values(mockSupabase).forEach((m: any) => {
            if (typeof m.mockReturnThis === 'function') m.mockReturnThis();
        });
    });

    describe('Signature Verification', () => {
        it('should verify a valid signature', () => {
            const secret = 'test_secret';
            const payload = JSON.stringify({ id: 'evt_123' });
            const crypto = require('crypto');
            const hmac = crypto.createHmac('sha256', secret);
            const signature = hmac.update(payload).digest('hex');
            
            expect(verifyWhopSignature(payload, signature, secret)).toBe(true);
        });

        it('should reject an invalid signature', () => {
            const secret = 'test_secret';
            const payload = JSON.stringify({ id: 'evt_123' });
            const signature = 'invalid_sig';
            
            expect(verifyWhopSignature(payload, signature, secret)).toBe(false);
        });
    });

    describe('membership.created event processing', () => {
        it('should enqueue the first campaign step and store log message', async () => {
            const payload = {
                action: 'membership.created',
                id: 'evt_joined',
                company_id: 'comp_123',
                data: {
                    member_id: 'mem_123',
                    tier_name: 'Pro',
                    status: 'active',
                    created_at: '2024-03-06T00:00:00Z'
                }
            };

            // 1. User lookup: from().select().eq().maybeSingle()
            mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { id: 'user_123' }, error: null });
            
            // 2. Member upsert: from().upsert().select().single()
            mockSupabase.single.mockResolvedValueOnce({ data: { id: 'db_mem_123' }, error: null });
            
            // 3. Campaigns lookup: from().select().eq().eq().eq()
            // Here eq() is the final method.
            // But eq is called 3 times. 
            // We need to return this for the first 2, and the result for the 3rd.
            mockSupabase.eq.mockReturnValueOnce(mockSupabase); // for user lookup eq
            mockSupabase.eq.mockReturnValueOnce(mockSupabase); // for campaigns user_id eq
            mockSupabase.eq.mockReturnValueOnce(mockSupabase); // for campaigns trigger_event eq
            mockSupabase.eq.mockResolvedValueOnce({ // for campaigns is_active eq (final)
                data: [{ 
                    id: 'camp_123', 
                    campaign_steps: [{ id: 'step_1', delay_days: 0 }] 
                }], 
                error: null 
            });

            // 4. Idempotency check: from().select().eq().eq().maybeSingle()
            mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
            
            // 5. Log insert
            mockSupabase.insert.mockResolvedValueOnce({ data: { id: 'log_123' }, error: null });

            await handleWhopEvent(payload);

            expect(mockSupabase.upsert).toHaveBeenCalledWith(expect.objectContaining({
                whop_member_id: 'mem_123',
                tier: 'Pro'
            }), expect.any(Object));
            
            expect(mockSupabase.eq).toHaveBeenCalledWith('trigger_event', 'member_joined');
            
            expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
                member_id: 'db_mem_123',
                campaign_step_id: 'step_1'
            }));
        });
    });

    describe('API Endpoint Handler', () => {
        it('should return 401 for invalid signature', async () => {
            process.env.WHOP_WEBHOOK_SECRET = 'test_secret';
            const req = new NextRequest('http://localhost/api/webhooks/whop', {
                method: 'POST',
                body: JSON.stringify({ action: 'test' }),
                headers: {
                    'x-whop-signature': 'invalid'
                }
            });

            const res = await webhookHandler(req);
            expect(res.status).toBe(401);
            const data = await res.json();
            expect(data.error.toLowerCase()).toBe('invalid signature');
        });

        it('should return 400 for malformed payload', async () => {
            process.env.WHOP_WEBHOOK_SECRET = 'test_secret';
            const payload = 'not-json';
            const crypto = require('crypto');
            const signature = crypto.createHmac('sha256', 'test_secret').update(payload).digest('hex');

            const req = new NextRequest('http://localhost/api/webhooks/whop', {
                method: 'POST',
                body: payload,
                headers: {
                    'x-whop-signature': signature
                }
            });

            const res = await webhookHandler(req);
            expect(res.status).toBe(400);
        });
    });
});
