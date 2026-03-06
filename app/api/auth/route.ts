import { NextRequest, NextResponse } from 'next/server';
import { authenticateWhopUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        const user = await authenticateWhopUser(token);

        return NextResponse.json({ user });
    } catch (error: any) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
