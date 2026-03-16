import { supabase } from './supabase';

const supabaseTable = process.env.EXPO_PUBLIC_SUPABASE_TABLE || '';

async function ensureAnonAuthSession() {
    const { data } = await supabase.auth.getSession();
    if (data.session) return;

    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
}

export async function sendExpoPushToken(token: string) {
    await ensureAnonAuthSession();

    if (!token) return;

    const { error } = await supabase.from(supabaseTable).insert({
        expo_token: token,
        level: 'general_alert',
    });

    if (error && (error as any).code !== '23505') {
        throw error;
    }
}
