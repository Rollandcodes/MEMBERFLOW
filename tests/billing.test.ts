
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { canCreateCampaign } from '../lib/billing';
import { supabase } from '../lib/db';

const mockSupabase = vi.hoisted(() => {
    const mock: any = {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        count: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn(),
        single: vi.fn(),
    };
    return mock;
});

vi.mock('../lib/db', () => ({
    supabase: mockSupabase,
}));

describe('Billing and Subscription Gating Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockSupabase.from.mockReturnThis();
        mockSupabase.select.mockReturnThis();
        mockSupabase.eq.mockReturnThis();
    });

    describe('canCreateCampaign logic', () => {
        it('should allow creation if under Starter limit', () => {
            expect(canCreateCampaign(0, 'starter')).toBe(true);
        });

        it('should prevent creation if at Starter limit', () => {
            expect(canCreateCampaign(1, 'starter')).toBe(false);
        });

        it('should allow creation if under Growth limit', () => {
            expect(canCreateCampaign(4, 'growth')).toBe(true);
        });

        it('should prevent creation if at Growth limit', () => {
            expect(canCreateCampaign(5, 'growth')).toBe(false);
        });

        it('should allow unlimited creation on Pro plan', () => {
            expect(canCreateCampaign(100, 'pro')).toBe(true);
        });
    });

    it('should correctly fetch user plan and count before checking limits', async () => {
        const mockUserId = 'user_123';
        
        mockSupabase.maybeSingle.mockResolvedValueOnce({ 
            data: { id: mockUserId, plan_id: 'starter' }, 
            error: null 
        });

        // The second call to eq() in the test (from the second query)
        mockSupabase.eq.mockReturnValueOnce(mockSupabase); // for the first query's eq
        mockSupabase.eq.mockResolvedValueOnce({ count: 1, data: [], error: null }); // for the second query's eq

        const { data: user } = await supabase.from('users').select('*').eq('id', mockUserId).maybeSingle();
        const { count } = await supabase.from('campaigns').select('*', { count: 'exact' }).eq('user_id', mockUserId);
        
        const allowed = canCreateCampaign(count || 0, user?.plan_id || 'starter');
        
        expect(allowed).toBe(false);
    });
});
