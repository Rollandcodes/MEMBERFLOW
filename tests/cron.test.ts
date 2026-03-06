// tests/cron.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../app/api/cron/process-campaigns/route';
import { runCampaignScheduler } from '../lib/messaging';
import { NextRequest } from 'next/server';

// Mock the messaging module
vi.mock('../lib/messaging', () => ({
    runCampaignScheduler: vi.fn(),
}));

describe('Cron Handler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv('CRON_SECRET', 'test_secret');
        vi.stubEnv('NODE_ENV', 'production');
    });

    it('should return 401 if unauthorized', async () => {
        const req = new NextRequest('https://localhost/api/cron/process-campaigns', {
            headers: { 'authorization': 'Bearer wrong_secret' }
        });
        
        const response = await GET(req);
        expect(response.status).toBe(401);
        expect(await response.text()).toBe('Unauthorized');
    });

    it('should call runCampaignScheduler and return 200 on success', async () => {
        (runCampaignScheduler as any).mockResolvedValue({ messagesSent: 5 });
        
        const req = new NextRequest('https://localhost/api/cron/process-campaigns', {
            headers: { 'authorization': 'Bearer test_secret' }
        });
        
        const response = await GET(req);
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data).toEqual({ ok: true, messagesSent: 5 });
        expect(runCampaignScheduler).toHaveBeenCalled();
    });

    it('should return 500 and "error" body on failure', async () => {
        (runCampaignScheduler as any).mockRejectedValue(new Error('Fatal error'));
        
        const req = new NextRequest('https://localhost/api/cron/process-campaigns', {
            headers: { 'authorization': 'Bearer test_secret' }
        });
        
        const response = await GET(req);
        expect(response.status).toBe(500);
        expect(await response.text()).toBe('error');
    });
});
