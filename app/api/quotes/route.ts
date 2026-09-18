import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { installType, surface, facture, gouvernorat, nom, telephone, email } = body;

    // Server-Side Input Validation Constraints
    if (!installType) {
      return NextResponse.json(
        { error: "Le type d'installation est obligatoire." },
        { status: 400 }
      );
    }

    if (!surface || isNaN(Number(surface)) || Number(surface) <= 0) {
      return NextResponse.json(
        { error: "La surface disponible en m² doit être un nombre positif." },
        { status: 400 }
      );
    }

    if (!facture || isNaN(Number(facture)) || Number(facture) <= 0) {
      return NextResponse.json(
        { error: "La facture mensuelle STEG doit être un nombre positif." },
        { status: 400 }
      );
    }

    if (!gouvernorat) {
      return NextResponse.json(
        { error: "Le gouvernorat est obligatoire." },
        { status: 400 }
      );
    }

    if (!nom || typeof nom !== "string" || nom.trim().length < 3) {
      return NextResponse.json(
        { error: "Le nom complet est obligatoire (min 3 caractères)." },
        { status: 400 }
      );
    }

    const phoneRegex = /^(?:\+216|00216)?\s?[24579]\d{7}$/;
    if (!telephone || !phoneRegex.test(telephone.trim())) {
      return NextResponse.json(
        { error: "Numéro de téléphone tunisien valide obligatoire (8 chiffres)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Adresse email valide obligatoire." },
        { status: 400 }
      );
    }

    // Insert payload into Supabase database quotes table
    const { data, error } = await supabase.from("quotes").insert([
      {
        install_type: installType,
        surface_m2: Number(surface),
        steg_monthly_bill: Number(facture),
        gouvernorat: gouvernorat,
        full_name: nom.trim(),
        phone_number: telephone.trim(),
        email: email.trim(),
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: `Erreur Supabase: ${error.message || "Impossible d'enregistrer le devis"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Demande de devis enregistrée avec succès !",
      data: { installType, surface, facture, gouvernorat, nom, telephone, email },
    });
  } catch (error: any) {
    console.error("API /api/quotes error:", error);
    return NextResponse.json(
      { error: error?.message || "Une erreur est survenue lors de la soumission." },
      { status: 500 }
    );
  }
}
