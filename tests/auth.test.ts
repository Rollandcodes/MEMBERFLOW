
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authenticateWhopUser } from '@/lib/auth';
import { supabase } from '@/lib/db';

const mockSupabase = vi.hoisted(() => {
  const mock: any = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn(),
  };
  mock.from.mockReturnValue(mock);
  mock.select.mockReturnValue(mock);
  mock.eq.mockReturnValue(mock);
  mock.single.mockReturnValue(mock);
  mock.insert.mockReturnValue(mock);
  mock.update.mockReturnValue(mock);
  return mock;
});

// Mock Supabase
vi.mock('@/lib/db', () => ({
  supabase: mockSupabase,
}));

// Mock global fetch
global.fetch = vi.fn();

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully authenticates a Whop user and returns user data', async () => {
    const mockWhopUser = { id: 'whop_user_123', email: 'test@example.com', company: { name: 'Test Community' } };
    const mockDbUser = { id: 'db_user_123', whop_user_id: 'whop_user_123', email: 'test@example.com', community_name: 'Test Community' };

    // Mock Whop API response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWhopUser,
    });

    // Mock Supabase find user (not found initially)
    mockSupabase.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } });
    
    // Mock Supabase create user
    mockSupabase.single.mockResolvedValueOnce({ data: mockDbUser, error: null });

    const user = await authenticateWhopUser('valid_token');

    expect(user).toEqual(mockDbUser);
    expect(global.fetch).toHaveBeenCalledWith('https://api.whop.com/v1/me', expect.any(Object));
  });

  it('throws error for invalid Whop token', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
    });

    await expect(authenticateWhopUser('invalid_token')).rejects.toThrow('Invalid Whop token');
  });

  it('handles existing users correctly and updates community name', async () => {
    const mockWhopUser = { id: 'whop_user_123', email: 'test@example.com', company: { name: 'New Name' } };
    const mockDbUser = { id: 'db_user_123', whop_user_id: 'whop_user_123', email: 'test@example.com', community_name: 'Old Name' };
    const updatedUser = { ...mockDbUser, community_name: 'New Name' };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWhopUser,
    });

    // Mock initial find
    mockSupabase.single.mockResolvedValueOnce({ data: mockDbUser, error: null });
    // Mock update
    mockSupabase.single.mockResolvedValueOnce({ data: updatedUser, error: null });

    const user = await authenticateWhopUser('valid_token');
    expect(user.community_name).toBe('New Name');
    expect(mockSupabase.update).toHaveBeenCalledWith({ community_name: 'New Name' });
  });
});
