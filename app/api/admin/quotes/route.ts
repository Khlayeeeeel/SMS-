import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = supabaseAdmin
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "ALL") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Admin Quotes Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ quotes: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur serveur lors de la récupération des devis." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "L'identifiant (id) et le nouveau statut sont requis." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("quotes")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Admin Quote Update Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, quote: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la mise à jour du devis." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "L'identifiant du devis à supprimer est requis." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("quotes").delete().eq("id", id);

    if (error) {
      console.error("Admin Quote Delete Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Devis supprimé avec succès." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la suppression du devis." },
      { status: 500 }
    );
  }
}
