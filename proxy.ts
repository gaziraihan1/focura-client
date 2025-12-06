import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";
const BACKEND_COOKIE_NAME = isProd ? "__Secure-focura.backend" : "focura.backend";

export async function proxy(request: NextRequest) {
  console.log('🔍 [Middleware] Running for path:', request.nextUrl.pathname);
  
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log('🔍 [Middleware] Token found:', !!token);
  if (token) {
    console.log('🔍 [Middleware] User:', token.email);
  }

  const isAuthPage = request.nextUrl.pathname.startsWith("/authentication");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  console.log('🔍 [Middleware] isAuthPage:', isAuthPage, 'isDashboard:', isDashboard);

  // Redirect logic
  if (isAuthPage && token) {
    console.log('🔄 [Middleware] Redirecting authenticated user to dashboard');
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isDashboard && !token) {
    console.log('🔄 [Middleware] Redirecting unauthenticated user to login');
    return NextResponse.redirect(new URL("/authentication/login", request.url));
  }

  // If user is authenticated and accessing dashboard, ensure backend cookie matches session
  if (token && token.sub && isDashboard) {
    const existingCookie = request.cookies.get(BACKEND_COOKIE_NAME);
    
    let needsNewCookie = !existingCookie;
    let cookieMismatch = false;
    
    // Check if existing cookie matches current session
    if (existingCookie) {
      try {
        const decoded = jwt.decode(existingCookie.value) as any;
        if (decoded?.sub !== token.sub) {
          console.log('⚠️ [Middleware] Cookie user mismatch!');
          console.log('  Session user:', token.sub, token.email);
          console.log('  Cookie user:', decoded?.sub, decoded?.email);
          needsNewCookie = true;
          cookieMismatch = true;
        }
      } catch (error) {
        console.log('🔄 [Middleware] Invalid cookie, refreshing');
        needsNewCookie = true;
      }
    }
    
    if (needsNewCookie) {
      if (cookieMismatch) {
        console.log('🔄 [Middleware] Clearing mismatched cookie');
      }
      
      console.log('🔵 [Middleware] Creating backend cookie for:', token.email);
      
      try {
        if (!process.env.BACKEND_JWT_SECRET) {
          console.error('❌ [Middleware] BACKEND_JWT_SECRET is not defined!');
          return NextResponse.next();
        }

        const backendToken = jwt.sign(
          { 
            sub: token.sub,
            email: token.email,
            role: (token as any).role ?? "USER"
          },
          process.env.BACKEND_JWT_SECRET,
          { 
            expiresIn: "7d",
            issuer: "focura-app",
            algorithm: 'HS256'
          }
        );

        console.log('✅ [Middleware] Backend token created');

        const response = NextResponse.next();
        
        // Set the backend cookie
        response.cookies.set({
          name: BACKEND_COOKIE_NAME,
          value: backendToken,
          httpOnly: true,
          secure: isProd,
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        console.log('✅ [Middleware] Backend cookie set');
        
        return response;
      } catch (error) {
        console.error('❌ [Middleware] Failed to create backend cookie:', error);
      }
    } else {
      console.log('✅ [Middleware] Backend cookie already exists and matches session');
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authentication/:path*", "/dashboard/:path*"],
};