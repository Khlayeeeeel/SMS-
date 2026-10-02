import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// PUBLIC (anon) client — safe for browser & server-side rendering.
// Only uses NEXT_PUBLIC_ variables. Never contains any secret.
// ---------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[SMS Solaire] Missing Supabase public environment variables.\n" +
      "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file."
  );
}

/**
 * Public Supabase client (anon key).
 * Safe to import on the client side. Does NOT have admin privileges.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
