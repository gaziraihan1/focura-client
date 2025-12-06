// app/api/auth/set-backend-cookie/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";
import { createBackendToken } from "@/lib/auth/backendToken";

// Import or define these constants
const isProd = process.env.NODE_ENV === "production";
const BACKEND_COOKIE_NAME = isProd ? "__Secure-focura.backend" : "focura.backend";

export async function POST(req: NextRequest) {
  try {
    console.log("🔵 [set-backend-cookie] Endpoint called");
    console.log("🔵 [set-backend-cookie] Environment:", process.env.NODE_ENV);
    console.log("🔵 [set-backend-cookie] Cookie name:", BACKEND_COOKIE_NAME);
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.error("❌ [set-backend-cookie] No session found");
      return NextResponse.json(
        { error: "Not authenticated", details: "No session" }, 
        { status: 401 }
      );
    }

    console.log("✅ [set-backend-cookie] Session found for:", session.user.email);

    if (!session.user.id) {
      console.error("❌ [set-backend-cookie] User ID missing from session");
      return NextResponse.json(
        { error: "Not authenticated", details: "No user ID" }, 
        { status: 401 }
      );
    }

    const tokenPayload = {
      id: session.user.id,
      email: session.user.email!,
      role: (session.user as any).role ?? "USER",
    };

    console.log("🔵 [set-backend-cookie] Creating token for:", tokenPayload.email);

    const token = createBackendToken(tokenPayload);

    console.log("✅ [set-backend-cookie] Token created successfully");
    console.log("🔵 [set-backend-cookie] Token length:", token.length);

    const response = NextResponse.json({ 
      success: true,
      message: "Backend cookie set successfully"
    });
    
    response.cookies.set({
      name: BACKEND_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log("✅ [set-backend-cookie] Cookie set in response");
    console.log("🔵 [set-backend-cookie] Cookie config:", {
      name: BACKEND_COOKIE_NAME,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("❌ [set-backend-cookie] Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to set backend cookie",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Also support GET for testing
export async function GET(req: NextRequest) {
  return POST(req);
}