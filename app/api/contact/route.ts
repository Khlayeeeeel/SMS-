import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, email, telephone, message } = body;

    // Server-Side Input Validation Constraints
    if (!nom || typeof nom !== "string" || nom.trim().length < 3) {
      return NextResponse.json(
        { error: "Le nom complet est obligatoire (min 3 caractères)." },
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

    const phoneRegex = /^(?:\+216|00216)?\s?[24579]\d{7}$/;
    if (!telephone || !phoneRegex.test(telephone.trim())) {
      return NextResponse.json(
        { error: "Numéro de téléphone tunisien valide obligatoire (8 chiffres)." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Le message doit comporter au moins 10 caractères." },
        { status: 400 }
      );
    }

    // Insert payload into Supabase database
    const { data, error } = await supabase.from("contact_messages").insert([
      {
        full_name: nom.trim(),
        email: email.trim(),
        phone_number: telephone.trim(),
        message: message.trim(),
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: `Erreur Supabase: ${error.message || "Impossible d'enregistrer"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message transmis avec succès à l'équipe SMS Solaire !",
    });
  } catch (error: any) {
    console.error("API /api/contact error:", error);
    return NextResponse.json(
      { error: error?.message || "Une erreur est survenue lors de l'envoi." },
      { status: 500 }
    );
  }
}
