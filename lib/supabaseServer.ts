import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// SERVER-ONLY Supabase admin client.
//
// ⚠️  SECURITY WARNING:
//   - This file uses the SERVICE ROLE key which BYPASSES Row Level Security.
//   - NEVER import this file from a client component ("use client").
//   - NEVER import this file from any file that could be bundled for the browser.
//   - Only use inside Next.js API Route Handlers (app/api/**) or
//     Server Actions running exclusively on the server.
// ---------------------------------------------------------------------------

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
      "This key must be kept secret and must NEVER start with 'NEXT_PUBLIC_'."
  );
}

/**
 * Server-side Supabase admin client (service role key).
 *
 * Has full database access and bypasses RLS.
 * Use ONLY in server-side API routes — never on the client.
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    // Disable auto-refresh tokens — not needed in server context
    autoRefreshToken: false,
    persistSession: false,
  },
});
