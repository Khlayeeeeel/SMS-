import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.trim()) ||
  (process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim()) ||
  "https://eutylmpejwcrmdxqcfdn.supabase.co";

const supabaseAnonKey =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim()) ||
  (process.env.SUPABASE_PUBLISHABLE_KEY && process.env.SUPABASE_PUBLISHABLE_KEY.trim()) ||
  "placeholder-key";

/**
 * Supabase client instance.
 * Safe to use on both browser and server side.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side admin client using secret key.
 */
export function getServiceSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || supabaseAnonKey;
  return createClient(supabaseUrl, serviceRoleKey);
}
