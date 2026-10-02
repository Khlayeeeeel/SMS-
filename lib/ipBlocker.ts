import { supabaseAdmin } from "@/lib/supabaseServer";

export interface BlockedIp {
  id: string;
  ip_address: string;
  reason: string;
  attempts_count: number;
  expires_at: string | null;
  created_at: string;
}

/**
 * Checks if an IP address is currently banned in the Supabase blocked_ips table.
 * Returns true if banned and ban has not expired.
 */
export async function isIpBlocked(ipAddress: string): Promise<boolean> {
  if (!ipAddress || ipAddress === "unknown") return false;

  try {
    const { data, error } = await supabaseAdmin
      .from("blocked_ips")
      .select("*")
      .eq("ip_address", ipAddress)
      .single();

    if (error || !data) return false;

    // Check if ban is permanent (expires_at is null) or currently active
    if (!data.expires_at) return true;

    const expiresAtMs = new Date(data.expires_at).getTime();
    if (expiresAtMs > Date.now()) {
      return true;
    } else {
      // Ban has expired — auto clean up
      await supabaseAdmin.from("blocked_ips").delete().eq("id", data.id);
      return false;
    }
  } catch (err) {
    console.error("[IP Blocker] Error checking blocked IP status:", err);
    return false;
  }
}

/**
 * Counts recent failed login attempts for an IP in the last 15 minutes.
 * If failed attempts exceed the threshold (default 5), automatically bans the IP for 24 hours.
 */
export async function recordFailedAttemptAndCheckBan(
  ipAddress: string,
  email: string,
  maxAttempts: number = 5,
  banDurationHours: number = 24
): Promise<{ isBanned: boolean; attempts: number }> {
  if (!ipAddress || ipAddress === "unknown") {
    return { isBanned: false, attempts: 1 };
  }

  try {
    // 1. Calculate 15 minutes ago
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    // 2. Count failed attempts from admin_login_logs in the last 15 mins
    const { count, error } = await supabaseAdmin
      .from("admin_login_logs")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", ipAddress)
      .eq("success", false)
      .gte("created_at", fifteenMinsAgo);

    const attempts = (count || 0) + 1; // including current failed attempt

    if (attempts >= maxAttempts) {
      // Calculate ban expiration
      const expiresAt = new Date(
        Date.now() + banDurationHours * 60 * 60 * 1000
      ).toISOString();

      // Upsert into blocked_ips
      await supabaseAdmin.from("blocked_ips").upsert(
        [
          {
            ip_address: ipAddress,
            reason: `Blocage automatique: ${attempts} tentatives de connexion échouées en 15 min (Cible: ${email})`,
            attempts_count: attempts,
            expires_at: expiresAt,
          },
        ],
        { onConflict: "ip_address" }
      );

      console.warn(`[IP Blocker] 🚨 BANNED IP ${ipAddress} for ${banDurationHours} hours after ${attempts} failed attempts.`);
      return { isBanned: true, attempts };
    }

    return { isBanned: false, attempts };
  } catch (err) {
    console.error("[IP Blocker] Error recording failed attempt:", err);
    return { isBanned: false, attempts: 1 };
  }
}

/**
 * Get list of all currently blocked IPs for Admin UI.
 */
export async function getBlockedIps(): Promise<BlockedIp[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("blocked_ips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("[IP Blocker] Error fetching blocked IPs:", err);
    return [];
  }
}

/**
 * Manually unblock an IP.
 */
export async function unblockIp(idOrIp: string): Promise<boolean> {
  try {
    let query = supabaseAdmin.from("blocked_ips").delete();

    if (idOrIp.includes(".")) {
      query = query.eq("ip_address", idOrIp);
    } else {
      query = query.eq("id", idOrIp);
    }

    const { error } = await query;
    return !error;
  } catch (err) {
    console.error("[IP Blocker] Error unblocking IP:", err);
    return false;
  }
}

/**
 * Manually block an IP.
 */
export async function manuallyBlockIp(
  ipAddress: string,
  reason: string = "Blocage manuel par l'administrateur",
  durationHours: number = 24
): Promise<boolean> {
  try {
    const expiresAt = durationHours > 0
      ? new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString()
      : null;

    const { error } = await supabaseAdmin.from("blocked_ips").upsert(
      [
        {
          ip_address: ipAddress.trim(),
          reason: reason.trim(),
          attempts_count: 1,
          expires_at: expiresAt,
        },
      ],
      { onConflict: "ip_address" }
    );

    return !error;
  } catch (err) {
    console.error("[IP Blocker] Error manually blocking IP:", err);
    return false;
  }
}
