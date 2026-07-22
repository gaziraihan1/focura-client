import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Get NextAuth token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = path.startsWith("/authentication");
  // Post-auth pages (success / verified) must render for authenticated users
  // so they can read the `callbackUrl` and continue to the intended page.
  const isPostAuthPage =
    path.startsWith("/authentication/success") ||
    path.startsWith("/authentication/verified") ||
    path.startsWith("/authentication/verify-email");
  const isProtectedRoute =
    path.startsWith("/dashboard") || path.startsWith("/admin-dashboard");
  const isAdminRoute = path.startsWith("/admin-dashboard");

  // Redirect authenticated users away from auth entry pages (login, register, etc.)
  if (isAuthPage && !isPostAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/authentication/login", request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  // Enforce admin role for admin routes
  if (isAdminRoute && token && token.role !== "ADMIN" && token.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();

  // ── Security Headers ────────────────────────────────────────────────────────
  // Prevent clickjacking — pages cannot be embedded in iframes
  response.headers.set("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // XSS protection (legacy browsers)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Prevent search engines from indexing protected pages
  if (isProtectedRoute) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Strict Transport Security — force HTTPS for 1 year
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Content Security Policy — inline scripts only from same origin
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' http://localhost:5000 https:; frame-ancestors 'none';"
    );
  }

  // Optional: Add debug headers in development
  if (token && process.env.NODE_ENV === 'development') {
    response.headers.set('X-User-Email', token.email || '');
    response.headers.set('X-User-Role', token.role || 'USER');
  }

  return response;
}

export const config = {
  matcher: [
    "/authentication/:path*",
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
  ],
};
