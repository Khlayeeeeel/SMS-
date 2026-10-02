import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { withRateLimit, adminLoginLimiter } from "@/lib/rateLimit";

async function loginHandler(request: Request): Promise<Response> {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Veuillez fournir un email et un mot de passe." },
        { status: 400 }
      );
    }

    const envAdminEmail = process.env.ADMIN_EMAIL;
    const envAdminPassword = process.env.ADMIN_PASSWORD;

    // 1. First try Supabase Auth if configured
    let isAuthenticated = false;
    let userToken = "";
    let userEmail = email;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.session) {
        isAuthenticated = true;
        userToken = data.session.access_token;
        userEmail = data.user.email || email;
      }
    } catch (e) {
      // Supabase auth failed or not configured, fallback to env check
    }

    // 2. Fallback to Env credentials check if Supabase Auth wasn't used or returned error
    if (!isAuthenticated && envAdminEmail && envAdminPassword) {
      if (
        email.trim().toLowerCase() === envAdminEmail.toLowerCase() &&
        password === envAdminPassword
      ) {
        isAuthenticated = true;
        userToken = "sms_admin_session_token_" + Date.now();
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Identifiants incorrects. Vérifiez l'adresse email et le mot de passe." },
        { status: 401 }
      );
    }

    // Set secure auth cookie
    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie !",
      user: { email: userEmail, role: "admin" },
    });

    response.cookies.set("sms_admin_token", userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { error: error?.message || "Une erreur est survenue lors de la connexion." },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(adminLoginLimiter, loginHandler);
