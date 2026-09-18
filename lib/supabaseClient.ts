import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabase client instance.
 * Safe to use on both browser and server side.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side admin client using service role key (Bypasses RLS for admin tasks).
 * ONLY use inside Next.js server-side API routes (app/api/...). NEVER expose to browser.
 */
export function getServiceSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  return createClient(supabaseUrl, serviceRoleKey);
}
