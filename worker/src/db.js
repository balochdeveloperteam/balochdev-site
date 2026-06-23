import { createClient } from '@supabase/supabase-js';

/**
 * Build the Supabase admin client per-request. Supabase clients are
 * cheap to construct, and Workers isolates do not safely share mutable
 * module state across requests.
 */
export function getAdmin(c) {
  const url = c.env.SUPABASE_URL;
  const key = c.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
