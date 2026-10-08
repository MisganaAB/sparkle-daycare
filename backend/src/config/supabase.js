import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Public client (anon key) – safe for read queries
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Service-role client – server-side only, never expose to frontend
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
