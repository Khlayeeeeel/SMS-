import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET() {
  try {
    // 1. Fetch count of quotes
    const { count: totalQuotes, error: quotesErr } = await supabaseAdmin
      .from("quotes")
      .select("*", { count: "exact", head: true });

    // 2. Fetch count of NEW quotes
    const { count: newQuotes, error: newQuotesErr } = await supabaseAdmin
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .eq("status", "NEW");

    // 3. Fetch count of contact messages
    const { count: totalMessages, error: msgErr } = await supabaseAdmin
      .from("contact_messages")
      .select("*", { count: "exact", head: true });

    // 4. Fetch count of UNREAD messages
    const { count: unreadMessages, error: unreadMsgErr } = await supabaseAdmin
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "UNREAD");

    // 5. Fetch count of projects
    const { count: totalProjects, error: projErr } = await supabaseAdmin
      .from("projects")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      totalQuotes: totalQuotes || 0,
      newQuotes: newQuotes || 0,
      totalMessages: totalMessages || 0,
      unreadMessages: unreadMessages || 0,
      totalProjects: totalProjects || 0,
    });
  } catch (error: any) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la récupération des statistiques." },
      { status: 500 }
    );
  }
}
