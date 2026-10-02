import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run on /admin and /api/admin routes
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Allow public access to login endpoints (no auth required)
  if (pathname === "/admin/login" || pathname === "/api/admin/auth/login") {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const adminToken = request.cookies.get("sms_admin_token")?.value;

  if (!adminToken) {
    // API route without session → 401 Unauthorized
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        { error: "Accès refusé. Session administrateur obligatoire." },
        { status: 401 }
      );
    }

    // Dashboard page without session → redirect to login
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
