// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/authOptions";
import { createBackendToken } from "@/lib/auth/backendToken";
import { BACKEND_COOKIE_NAME, isProd } from "@/lib/auth/contants";

type NextAuthHandler = (
  req: Request,
  ctx: { params: { nextauth: string[] } }
) => Promise<Response>;

const nextAuthHandler = NextAuth(authOptions) as unknown as NextAuthHandler;

// Simple in-memory rate limiter for login attempts (per IP)
const LOGIN_MAX_ATTEMPTS = 10;
const LOGIN_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const loginAttempts = new Map<string, { count: number; first: number }>();

function getClientIp(req: Request) {
  const header =
    req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  return header.split(",")[0]?.trim() || "unknown";
}

function isLoginPath(path: string) {
  return (
    path.includes("/callback") ||
    path.includes("/signin") ||
    path.endsWith("/login")
  );
}

function isRateLimited(req: Request) {
  const ip = getClientIp(req);
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry) {
    loginAttempts.set(ip, { count: 1, first: now });
    return false;
  }

  if (now - entry.first > LOGIN_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, first: now });
    return false;
  }

  entry.count += 1;
  loginAttempts.set(ip, entry);

  return entry.count > LOGIN_MAX_ATTEMPTS;
}

async function handleSetBackendCookie(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.redirect(new URL("/authentication/login", req.url));

  const token = createBackendToken({
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
  });

  const res = NextResponse.redirect(
    new URL("/authentication/success", req.url)
  );
 res.cookies.set({
  name: BACKEND_COOKIE_NAME,
  value: token,
  httpOnly: true,
  secure: isProd,        // Must be true for SameSite=None
  sameSite: "none",    // REQUIRED for cross-domain cookies
  path: "/",
  maxAge: 15 * 60,
});

  return res;
}

async function handleClearBackendCookie(req: Request) {
  const res = NextResponse.redirect(new URL("/authentication/login", req.url));
  res.cookies.set({
    name: BACKEND_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProd,
    sameSite: "none",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const path = new URL(req.url).pathname;
  if (path.endsWith("/set-backend-cookie")) return handleSetBackendCookie(req);
  if (path.endsWith("/clear-backend-cookie"))
    return handleClearBackendCookie(req);
  const params = await context.params;
  return await nextAuthHandler(req, { params });
}

export async function POST(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  const path = new URL(req.url).pathname;
  if (isLoginPath(path) && isRateLimited(req)) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }
  if (path.endsWith("/clear-backend-cookie"))
    return handleClearBackendCookie(req);
  const params = await context.params;
  return await nextAuthHandler(req, { params });
}
