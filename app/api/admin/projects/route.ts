import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin Projects Fetch Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur serveur lors de la récupération des projets." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, gouvernorat, power_capacity, metric_label, description, image_url, before_after, published } = body;

    if (!title || !category || !gouvernorat || !power_capacity || !description || !image_url) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être renseignés." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("projects")
      .insert([
        {
          title: title.trim(),
          category: category.trim(),
          gouvernorat: gouvernorat.trim(),
          power_capacity: power_capacity.trim(),
          metric_label: metric_label || "Puissance",
          description: description.trim(),
          image_url: image_url.trim(),
          before_after: !!before_after,
          published: published !== undefined ? !!published : true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Admin Project Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la création du projet." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "L'identifiant du projet (id) est requis." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Admin Project Update Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la mise à jour du projet." },
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
        { error: "L'identifiant du projet à supprimer est requis." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Admin Project Delete Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Projet supprimé avec succès." });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur lors de la suppression du projet." },
      { status: 500 }
    );
  }
}
