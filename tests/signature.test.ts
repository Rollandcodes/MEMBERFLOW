// tests/signature.test.ts
import { describe, it, expect } from 'vitest';
import { verifyWhopSignature } from '../lib/whop';
import crypto from 'crypto';

describe('Whop Signature Verifier', () => {
    const secret = 'test_whop_secret';
    const payload = JSON.stringify({ event: 'test', id: '123' });
    
    it('should verify a valid HMAC-SHA256 signature', () => {
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        const isValid = verifyWhopSignature(payload, signature, secret);
        expect(isValid).toBe(true);
    });

    it('should fail an incorrect signature', () => {
        const signature = 'incorrect_hex_digest';
        const isValid = verifyWhopSignature(payload, signature, secret);
        expect(isValid).toBe(false);
    });

    it('should fail when secret is missing', () => {
        const signature = 'anything';
        const isValid = verifyWhopSignature(payload, signature, '');
        expect(isValid).toBe(false);
    });

    it('should be timing-safe (length mismatch check)', () => {
        // timingSafeEqual throws if lengths are different, our wrapper should catch it
        const shortSignature = 'abc';
        const isValid = verifyWhopSignature(payload, shortSignature, secret);
        expect(isValid).toBe(false);
    });
});
