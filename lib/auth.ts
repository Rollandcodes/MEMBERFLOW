// lib/auth.ts
// Whop authentication logic
import { supabase } from './db';

export async function authenticateWhopUser(whopToken: string) {
    // In a real flow, you'd exchange the Whop auth code for a token
    // For this example, assume we have a whopToken or some identifier from Whop

    const response = await fetch(`https://api.whop.com/v1/me`, {
        headers: {
            'Authorization': `Bearer ${whopToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Invalid Whop token');
    }

    const whopUser = await response.json();
    const whopUserId = whopUser.id;
    const whopEmail = whopUser.email;

    // Check if user exists in Supabase, if not create them
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('whop_user_id', whopUserId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is not found
        throw error;
    }

    if (!user) {
        // Create new user
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                whop_user_id: whopUserId,
                email: whopEmail
            })
            .select('*')
            .single();

        if (createError) throw createError;
        return newUser;
    }

    return user;
}
