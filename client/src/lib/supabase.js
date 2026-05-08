import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Singleton Supabase browser client.
 * Importing this module multiple times reuses the same instance, which avoids the
 * "Multiple GoTrueClient instances detected" warning and keeps auth state consistent.
 */
export const supabase = url && anon ? createClient(url, anon) : null;
