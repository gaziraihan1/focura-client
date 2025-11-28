import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = request.nextUrl.pathname.startsWith("/authentication");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // If user is logged in and tries to access any authentication page
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is not logged in and tries to access dashboard
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/authentication/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authentication/:path*", "/dashboard/:path*"],
};