// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/authOptions";
import { createBackendToken } from "@/lib/auth/backendToken";
import { BACKEND_COOKIE_NAME, isProd } from "@/lib/auth/contants";

const nextAuthHandler = NextAuth(authOptions);

function safeBase(req: Request) {
  // In some environments req.url may be relative; fallback to NEXTAUTH_URL
  const maybe = req.url || process.env.NEXTAUTH_URL;
  return maybe!;
}

async function handleSetBackendCookie(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      const base = new URL("/authentication/login", safeBase(req)).toString();
      return NextResponse.redirect(base);
    }

    const backendToken = createBackendToken({
      id: (session.user as any).id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user as any).role ?? "USER",
    });

    const res = NextResponse.redirect(new URL("/authentication/success", safeBase(req)));
    res.cookies.set({
      name: BACKEND_COOKIE_NAME,
      value: backendToken,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, 
    });

    return res;
  } catch (err) {
    console.error("handleSetBackendCookie error:", err);
    return NextResponse.redirect(new URL("/authentication/login", safeBase(req)));
  }
}

async function handleClearBackendCookie(req: Request) {
  const res = NextResponse.redirect(new URL("/authentication/login", safeBase(req)));
  res.cookies.set({
    name: BACKEND_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function GET(req: Request, context: { params: { nextauth: string[] } }) {
  const pathname = new URL(req.url).pathname;

  if (pathname.endsWith("/api/auth/set-backend-cookie")) {
    return handleSetBackendCookie(req);
  }

  if (pathname.endsWith("/api/auth/clear-backend-cookie")) {
    return handleClearBackendCookie(req);
  }

  // delegate to NextAuth
  return await (nextAuthHandler as any)(req, { params: context.params });
}

export async function POST(req: Request, context: { params: { nextauth: string[] } }) {
  const pathname = new URL(req.url).pathname;

  if (pathname.endsWith("/api/auth/clear-backend-cookie")) {
    const res = NextResponse.json({ success: true });
    res.cookies.set({
      name: BACKEND_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return res;
  }

  return await (nextAuthHandler as any)(req, { params: context.params });
}
