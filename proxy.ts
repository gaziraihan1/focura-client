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

  // All authentication is now handled via Authorization header in axios
  // No need to manage cookies in the proxy

  const response = NextResponse.next();
  
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