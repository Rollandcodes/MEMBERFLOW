
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runCampaignScheduler } from '../lib/messaging';
import { supabase } from '../lib/db';

const mockSupabase = vi.hoisted(() => {
    const mock: any = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        is: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
    };
    return mock;
});

vi.mock('../lib/db', () => ({
    supabase: mockSupabase,
}));

// Mock Whop SDK/DM function
vi.mock('../lib/whop', () => ({
    sendWhopDM: vi.fn().mockResolvedValue({ success: true }),
}));

import { sendWhopDM } from '../lib/whop';

describe('Campaign Scheduler Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset all to return this by default
        Object.values(mockSupabase).forEach((m: any) => {
            if (typeof m.mockReturnThis === 'function') m.mockReturnThis();
        });
    });

    it('should process empty queue correctly', async () => {
        // First call to eq() is for active campaigns lookup
        mockSupabase.eq.mockResolvedValueOnce({ data: [], error: null });
        
        const result = await runCampaignScheduler();
        expect(result.messagesSent).toBe(0);
        expect(sendWhopDM).not.toHaveBeenCalled();
    });

    it('should process a single message correctly', async () => {
        const now = new Date();
        const mockCampaign = {
            id: 'camp_1',
            user_id: 'user_1',
            campaign_steps: [
                { id: 'step_1', delay_days: 0, message_content: 'Hello {name}' }
            ]
        };
        const mockMember = {
            id: 'mem_1',
            whop_member_id: 'whop_mem_1',
            joined_at: now.toISOString(),
            tier: 'Pro'
        };

        // 1. Fetch campaigns: eq() is the final method
        mockSupabase.eq.mockResolvedValueOnce({ data: [mockCampaign], error: null });
        
        // 2. Fetch members: the second call to eq() is the final method in the members query
        // Wait, members query has TWO eq() calls. The second one is the final one.
        mockSupabase.eq.mockReturnValueOnce(mockSupabase); // first eq()
        mockSupabase.eq.mockResolvedValueOnce({ data: [mockMember], error: null }); // second eq()

        // 3. Idempotency check: maybeSingle() is the final method
        mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

        // 4. Log insertion: insert() is NOT the final method, it returns mock for further chaining (if any)
        // Actually, it's just awaited.
        mockSupabase.insert.mockResolvedValueOnce({ data: {}, error: null });

        const result = await runCampaignScheduler();
        
        expect(result.messagesSent).toBe(1);
        expect(sendWhopDM).toHaveBeenCalledWith('whop_mem_1', expect.stringContaining('whop_mem_1'));
    });

    it('should handle failed message processing and continue', async () => {
        const now = new Date();
        const mockCampaign = {
            id: 'camp_1',
            user_id: 'user_1',
            campaign_steps: [
                { id: 'step_1', delay_days: 0, message_content: 'Msg 1' }
            ]
        };
        const mockMember = {
            id: 'mem_1',
            whop_member_id: 'whop_mem_1',
            joined_at: now.toISOString()
        };

        mockSupabase.eq.mockResolvedValueOnce({ data: [mockCampaign], error: null });
        mockSupabase.eq.mockReturnValueOnce(mockSupabase);
        mockSupabase.eq.mockResolvedValueOnce({ data: [mockMember], error: null });
        mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null, error: null });

        (sendWhopDM as any).mockRejectedValueOnce(new Error('DM failed'));

        const result = await runCampaignScheduler();
        
        expect(result.messagesSent).toBe(0);
        // Should not have called insert for log since it failed
        expect(mockSupabase.insert).not.toHaveBeenCalled();
    });
});
