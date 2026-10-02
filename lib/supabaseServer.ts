import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// SERVER-ONLY Supabase admin client.
//
// ⚠️  SECURITY WARNING:
//   - This file uses the SERVICE ROLE key which BYPASSES Row Level Security.
//   - NEVER import this file from a client component ("use client").
//   - NEVER import this file from any file that could be bundled for the browser.
//   - Only use inside Next.js API Route Handlers (app/api/**) or
//     Server Actions running exclusively on the server.
//
// ℹ️  LAZY INITIALIZATION:
//   - The client is created on first use, not at module load time.
//   - This prevents Vercel build crashes caused by missing env vars during
//     static page collection (build time vs runtime).
// ---------------------------------------------------------------------------

let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Returns the server-side Supabase admin client (service role key).
 * Lazily initialised on first call — safe during Next.js build phase.
 *
 * Has full database access and bypasses RLS.
 * Use ONLY in server-side API routes — never on the client.
 */
function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "[SMS Solaire] Missing NEXT_PUBLIC_SUPABASE_URL environment variable."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "[SMS Solaire] Missing SUPABASE_SERVICE_ROLE_KEY environment variable.\n" +
        "This key must be kept secret and must NEVER start with 'NEXT_PUBLIC_'.\n" +
        "Add it to your Vercel project: Settings → Environment Variables."
    );
  }

  _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _supabaseAdmin;
}

/**
 * Proxy object — used exactly like `supabaseAdmin.from(...)` in all existing code.
 * No changes needed in any route file that already imports supabaseAdmin.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop];
  },
});
