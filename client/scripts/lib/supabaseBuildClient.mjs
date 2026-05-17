import { createClient } from '@supabase/supabase-js';

/**
 * Supabase JS client for Node build scripts (enumeration, prerender bootstrap).
 * Uses process.env.VITE_* so Cloudflare Pages / local `.env` can supply the same
 * names as Vite runtime.
 */
export function tryCreateSupabaseBuildClient(log = console.warn) {
  const url = (process.env.VITE_SUPABASE_URL || '').trim();
  const anon = (process.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (!url || !anon) {
    log(
      `[routes:enumerate] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — blog routes will be skipped.`,
    );
    return null;
  }

  return createClient(url, anon);
}
